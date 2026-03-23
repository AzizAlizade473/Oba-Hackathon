// hooks/useOrders.ts

import { api } from '../constants/api';
import {
  guessCategory,
  formatDate,
  formatDay,
  formatMonth,
  formatTime,
} from '../constants/helpers';
import { ProductItem } from '../components/ProductCard';
import { Order } from '../components/screens/HomeScreen';
import { TranslationDict } from '../i18n/useTranslation';

interface OrdersParams {
  page: number;
  limit: number;
  startDate?: string;
  endDate?: string;
}

export interface LoadOrdersResult {
  orders: Order[];
  products: ProductItem[];
  totalPages: number;
}

export async function loadOrdersFromApi(
  params: OrdersParams,
  t: TranslationDict,
): Promise<LoadOrdersResult> {
  const response = await api.getUserOrders(params);
  const rawOrders = (response.data ?? []) as Record<string, unknown>[];
  const totalPages = (response.totalPages as number | undefined) ?? 1;

  const tAsStringRecord = t as Record<string, string>;

  const orders: Order[] = rawOrders.map((order) => {
    const orderProducts = (order.products ?? []) as Record<string, unknown>[];
    const rateableProducts = orderProducts.filter((p) => p.rewardInfo ? 1 : p.userRating ? 1 : 0);
    const allRated =
      rateableProducts.length > 0 && rateableProducts.every((p) => p.hasUserRated);

    const orderId = order.orderId as string | undefined;

    return {
      id: orderId?.substring((orderId?.length ?? 4) - 4) ?? '0000',
      fullId: orderId ?? '',
      date: formatDate(order.orderDate as string, tAsStringRecord),
      day: formatDay(order.orderDate as string),
      month: formatMonth(order.orderDate as string),
      time: formatTime(order.orderDate as string),
      total: parseFloat(String(order.totalAmount ?? 0)).toFixed(2),
      status: allRated ? 'rated' : 'pending',
      items: orderProducts.map((p) => {
        const rewardInfo = p.rewardInfo as Record<string, unknown> | undefined;
        const userRating = p.userRating as Record<string, unknown> | undefined;
        return {
          id: p.id as string,
          uniqueId: `${orderId}_${p.id}`,
          name: p.name as string,
          price: p.price as number,
          quantity: p.quantity as number,
          catKey: guessCategory(p.name as string),
          type: p.isPrivateLabel ? 'pl' : 'global',
          rewardAmount: (rewardInfo?.allocatedCredit as number | undefined) ?? (p.rewardAmount as number | undefined) ?? 0,
          rateable: p.rateable as boolean,
          rated: p.hasUserRated as boolean,
          userRating: (userRating?.score as number | undefined) ?? 0,
          userRatingId: (userRating?.id as string | undefined) ?? null,
          rating: (p.averageRating as number | undefined) ?? 0,
          reviews: (p.ratingCount as number | undefined) ?? 0,
        } satisfies ProductItem;
      }),
    };
  });

  const productsMap = new Map<string, ProductItem>();
  rawOrders.forEach((order) => {
    const orderProducts = (order.products ?? []) as Record<string, unknown>[];
    const orderId = order.orderId as string | undefined;
    orderProducts.forEach((p) => {
      const id = p.id as string;
      if (!productsMap.has(id)) {
        const rewardInfo = p.rewardInfo as Record<string, unknown> | undefined;
        const userRating = p.userRating as Record<string, unknown> | undefined;
        productsMap.set(id, {
          id,
          uniqueId: `${orderId}_${id}`,
          name: p.name as string,
          price: p.price as number,
          catKey: guessCategory(p.name as string),
          rated: p.hasUserRated as boolean,
          rateable: p.rateable as boolean,
          rewardAmount: (rewardInfo?.allocatedCredit as number | undefined) ?? (p.rewardAmount as number | undefined) ?? 0,
          userRating: (userRating?.score as number | undefined) ?? 0,
          userRatingId: (userRating?.id as string | undefined) ?? null,
          rating: (p.averageRating as number | undefined) ?? 0,
          reviews: (p.ratingCount as number | undefined) ?? 0,
        });
      }
    });
  });

  return { orders, products: Array.from(productsMap.values()), totalPages };
}

export async function loadTopProductsFromApi(): Promise<ProductItem[]> {
  const response = await api.request('/products/top');
  const rawData = Array.isArray(response) ? response : ((response.data ?? []) as unknown[]);
  const mapped = (rawData as Record<string, unknown>[])
    .map((p) => ({
      id: p.id as string,
      name: p.name as string,
      price: (p.price as number | undefined) ?? 0,
      catKey: guessCategory(p.name as string),
      rating: parseFloat(String(p.averageRating ?? 0)),
      reviews: (p.ratingCount as number | undefined) ?? 0,
      rewardAmount: parseFloat(String(p.rewardAmount ?? 0)),
      rateable: true,
      rated: false,
    }))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);
  return mapped;
}
