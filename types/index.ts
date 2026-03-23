// Shared application types

export type Lang = 'az' | 'en' | 'ru';

export type Tab = 'home' | 'products' | 'top10' | 'settings';

export type AuthMode = 'login' | 'register';

export interface SavedCard {
  id: number;
  number: string;
  type: 'visa' | 'master';
  bank: string;
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
}

export interface ReceiptFilters {
  startDate: string;
  endDate: string;
}

export interface BonusCard {
  cardNumber?: string;
  card_number?: string;
  balance?: number;
  [key: string]: unknown;
}

export interface User {
  id?: string;
  name?: string;
  surname?: string;
  phone?: string;
  balance?: number;
  bonusBalance?: number;
  monthlyEarned?: number;
  rank?: string;
  reliability?: number;
  bonusCard?: BonusCard;
  bonus_card?: BonusCard;
  cardNumber?: string;
  bonusCardNumber?: string;
  [key: string]: unknown;
}

export interface Product {
  id: string;
  uniqueId?: string;
  name: string;
  price: number;
  quantity?: number;
  catKey: string;
  type?: 'pl' | 'global' | 'new';
  rateable: boolean;
  rated: boolean;
  isEditing?: boolean;
  isUpdating?: boolean;
  userRating?: number;
  userRatingId?: string | null;
  rewardAmount?: number;
  baseReward?: number;
  reputationAppliedReward?: number;
  rating?: number;
  reviews?: number;
}

export type OrderItem = Product;

export interface Order {
  id: string;
  fullId: string;
  date: string;
  day: number;
  month: string;
  time: string;
  total: string;
  status: 'rated' | 'pending';
  items: OrderItem[];
}

export interface TopProduct extends Product {
  rating: number;
  reviews: number;
  averageRating?: number;
  ratingCount?: number;
  sku?: string;
  comments?: Array<{
    id: string;
    name: string;
    score: number;
    comment: string;
  }>;
}

export interface Notification {
  id: number;
  title: string;
  msg: string;
  time: string;
  type: 'reward' | 'info';
}

export type FeedbackOptions = Record<Lang, string[]>;

