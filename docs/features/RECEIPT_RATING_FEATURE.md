# Feature Extraction: Receipt Rating System

This document outlines the architecture and business logic of the **Receipt Rating System** within the Epsilon (OBA Market) application. This feature allows users to earn rewards (cashback) by providing feedback on specific items purchased in-store.

## 1. Logic Overview

The rating flow is a multi-step process designed to ensure high-quality data while rewarding loyal users.

1.  **Receipt Sync**: Purchases made in-store are synced to the app. Each receipt contains a list of `ProductItem` objects.
2.  **Rateability Check**: 
    *   Products are checked for `rateable` (is it a product we want feedback on?) and `rated` (has the user already rated it?).
    *   **24-Hour Cooldown**: Ratings are only available 24 hours after the purchase to ensure the user has had time to use the product.
3.  **The Rating Component**: The `ReceiptItemCard` displays the product info and a custom star-rating interface.
4.  **Feedback Loop**:
    *   **1-3 Stars**: Requires a mandatory selection of a reason (e.g., "Taste", "Price") and optional comments.
    *   **4-5 Stars**: Feedback is optional but encouraged.
5.  **Dynamic Rewards**:
    *   Rewards are calculated based on a **Trust Score** (Reliability).
    *   Users with high reliability (90%+) receive the full reward.
    *   Spam behavior (dishonest or random ratings) lowers the Trust Score, which reduces future reward payouts.

## 2. Shared Types

These types define the data structure used across the system:

```typescript
export interface ProductItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  catKey: string;
  rateable: boolean;
  rated: boolean;
  userRating?: number;
  userRatingId?: string | null;
  rewardAmount?: number;         // The final reward after trust applied
  baseReward?: number;           // The theoretical max reward
  reputationAppliedReward?: number; 
  orderCreatedAt?: string;       // Used for the 24h wait logic
}
```

## 3. The 24h Waiting Logic

This helper ensures users don't rate products too quickly before trying them.

```typescript
export function getRatingWaitTime(orderDate: string | undefined) {
  if (!orderDate) return null;
  const orderTime = new Date(orderDate).getTime();
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  const elapsed = Date.now() - orderTime;

  if (elapsed >= TWENTY_FOUR_HOURS) return null;

  const remaining = TWENTY_FOUR_HOURS - elapsed;
  const hours = Math.floor(remaining / (60 * 60 * 1000));
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));

  return { formatted: `${hours}h ${minutes}m` };
}
```
