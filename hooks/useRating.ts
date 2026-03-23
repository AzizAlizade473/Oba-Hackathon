// hooks/useRating.ts

import { useState } from 'react';
import { api } from '../constants/api';
import { ProductItem } from '../components/ProductCard';
import { Order } from '../components/screens/HomeScreen';
import type { User } from '../types';

interface UseRatingProps {
  orders: Order[];
  products: ProductItem[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setProducts: React.Dispatch<React.SetStateAction<ProductItem[]>>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  getText: (key: string) => string;
  showToast: (msg: string, type: string) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setAnimateBalance: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useRating({
  setOrders,
  setProducts,
  setUser,
  getText,
  showToast,
  setLoading,
  setAnimateBalance,
}: UseRatingProps) {
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedRatingItem, setSelectedRatingItem] = useState<ProductItem | null>(null);
  const [selectedRatingValue, setSelectedRatingValue] = useState(0);
  const [feedbackReason, setFeedbackReason] = useState('');
  const [feedbackComment, setFeedbackComment] = useState('');

  async function submitRatingToBackend(
    item: ProductItem,
    stars: number,
    comment: string,
    reason?: string,
  ): Promise<void> {
    try {
      setLoading(true);

      if (item.userRatingId) {
        await api.updateRating(item.userRatingId, stars, comment, reason);
        showToast(getText('updated'), 'success');

        const productId = item.id;
        setOrders((prev) =>
          prev.map((order) => ({
            ...order,
            items: order.items.map((oi) =>
              oi.id === productId ? { ...oi, rated: true, userRating: stars, isUpdating: false } : oi,
            ),
          })),
        );
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, rated: true, userRating: stars } : p)),
        );
        return;
      }

      const response = await api.submitRating(item.id, stars, comment, reason);
      const data = (response.data ?? response) as Record<string, unknown>;
      const earnedAmount = data.rewardAmount !== undefined ? Number(data.rewardAmount) : 0;
      const ratingId = (data.id ?? data.ratingId) as string | undefined;

      setUser((prev) => ({
        ...(prev ?? {}),
        balance: Number((Number((prev ?? {}).balance ?? 0) + earnedAmount).toFixed(2)),
      }));
      setAnimateBalance(true);
      setTimeout(() => setAnimateBalance(false), 500);

      if (earnedAmount > 0) showToast(`+${earnedAmount.toFixed(2)}₼`, 'success');
      else showToast(getText('feedback_success'), 'success');

      const productId = item.id;
      setOrders((prev) =>
        prev.map((order) => {
          const newItems = order.items.map((oi) =>
            oi.id === productId
              ? { ...oi, rated: true, userRating: stars, userRatingId: ratingId ?? null, isUpdating: false }
              : oi,
          );
          const allRated = newItems.filter((p) => p.rateable).every((p) => p.rated);
          return { ...order, items: newItems, status: allRated ? ('rated' as const) : ('pending' as const) };
        }),
      );
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, rated: true, userRating: stars, userRatingId: ratingId ?? null } : p,
        ),
      );
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : getText('error_generic');
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }

  function handleRate(item: ProductItem, stars: number): void {
    setSelectedRatingItem(item);
    setSelectedRatingValue(stars);
    if (stars <= 3) {
      setFeedbackReason('');
      setFeedbackComment('');
      setFeedbackModalOpen(true);
    } else {
      submitRatingToBackend(item, stars, '', undefined);
    }
  }

  function handleEditRating(item: ProductItem): void {
    if (!item.userRatingId) {
      showToast(getText('cant_edit'), 'error');
      return;
    }
    setOrders((prev) =>
      prev.map((order) => ({
        ...order,
        items: order.items.map((i) =>
          i.id === item.id ? { ...i, isUpdating: true, rated: false } : i,
        ),
      })),
    );
    setProducts((prev) =>
      prev.map((p) => (p.id === item.id ? { ...p, isUpdating: true, rated: false } : p)),
    );
    showToast(getText('rating_updating'), 'info');
  }

  function submitFeedback(): void {
    if (!feedbackReason && !feedbackComment) {
      showToast(getText('reason'), 'error');
      return;
    }
    setFeedbackModalOpen(false);
    let reasonToSend = feedbackReason;
    if (['Digər', 'Other', 'Другое'].includes(reasonToSend)) reasonToSend = 'Other';
    if (selectedRatingItem) {
      submitRatingToBackend(selectedRatingItem, selectedRatingValue, feedbackComment, reasonToSend);
    }
  }

  return {
    feedbackModalOpen,
    setFeedbackModalOpen,
    feedbackReason,
    setFeedbackReason,
    feedbackComment,
    setFeedbackComment,
    handleRate,
    handleEditRating,
    submitFeedback,
  };
}
