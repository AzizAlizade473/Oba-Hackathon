// components/ProductCard.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { TranslationDict } from '../i18n/useTranslation';

export interface ProductItem {
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
  allowedRating?: boolean;
  orderCreatedAt?: string;
  rating?: number;
  reviews?: number;
}

// Font Awesome icon names per category
function getCategoryFA(catKey: string): string {
  const map: Record<string, string> = {
    Dairy: 'cheese',
    Drinks: 'wine-bottle',
    Food: 'bread-slice',
    Sweets: 'cookie-bite',
    Hygiene: 'pump-soap',
    Meat: 'drumstick-bite',
  };
  return map[catKey] || 'shopping-basket';
}

function getCategoryStyle(catKey: string): { bg: string; text: string } {
  const map: Record<string, { bg: string; text: string }> = {
    Dairy: { bg: '#DBEAFE', text: '#1D4ED8' },     // bg-blue-100 text-blue-700
    Drinks: { bg: '#EDE9FE', text: '#7C3AED' },    // bg-purple-100 text-purple-700
    Food: { bg: '#FEF3C7', text: '#D97706' },       // bg-amber-100 text-amber-700
    Sweets: { bg: '#FCE7F3', text: '#DB2777' },     // bg-pink-100 text-pink-700
    Hygiene: { bg: '#CCFBF1', text: '#0F766E' },    // bg-teal-100 text-teal-700
    Meat: { bg: '#FEE2E2', text: '#DC2626' },       // bg-red-100 text-red-700
  };
  return map[catKey] || { bg: '#F3F4F6', text: '#374151' };
}

function getCategoryName(catKey: string, t: TranslationDict): string {
  const cats = t.categories as Record<string, string> | undefined;
  return cats?.[catKey] || catKey;
}

interface ProductCardProps {
  product: ProductItem;
  onRate: (product: ProductItem, stars: number) => void;
  onEdit: (product: ProductItem) => void;
  isRatingAllowed?: (product: ProductItem) => boolean;
  t: TranslationDict;
}

// Star row component using FontAwesome5
function StarRow({ value, onRate, disabled, dimmed }: { value: number; onRate: (i: number) => void; disabled: boolean; dimmed?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <TouchableOpacity
          key={i}
          onPress={() => !disabled ? onRate(i) : null}
          style={[ps.starBtn, dimmed && { opacity: 0.5 }]}
          activeOpacity={0.7}
        >
          <FontAwesome5
            name="star"
            size={20}
            solid
            color={i <= value ? '#D4F238' : '#E5E7EB'} // text-brand-lime : text-gray-200
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

export function ProductCard({ product, onRate, onEdit, isRatingAllowed, t }: ProductCardProps) {
  const cat = getCategoryStyle(product.catKey);
  const repReward = Number(product.reputationAppliedReward ?? product.rewardAmount ?? 0);
  const baseReward = Number(product.baseReward ?? repReward);
  const hasReward = repReward > 0 && !product.rated;
  const ratingAllowed = isRatingAllowed ? isRatingAllowed(product) : true;

  return (
    /* bg-white p-4 rounded-3xl shadow-card border group transition-all */
    <View style={[ps.card, hasReward && ps.cardHighlight]}>
      {/* Main row: flex items-center justify-between */}
      <View style={ps.mainRow}>
        <View style={ps.leftSection}>
          {/* w-14 h-14 rounded-2xl flex items-center justify-center text-xl squircle */}
          <View style={[ps.catIcon, { backgroundColor: cat.bg }]}>
            <FontAwesome5 name={getCategoryFA(product.catKey)} size={20} color={cat.text} />
          </View>
          <View style={{ marginLeft: 16, flex: 1 }}>
            {/* font-bold text-gray-900 text-sm */}
            <Text style={ps.productName} numberOfLines={1}>{product.name}</Text>
            <View style={ps.badgeRow}>
              {/* text-[10px] font-bold text-gray-400 uppercase tracking-wide */}
              <Text style={ps.categoryLabel}>{getCategoryName(product.catKey, t)}</Text>

              {/* New badge: text-[9px] bg-brand-lime text-black px-2 py-0.5 rounded font-bold */}
              {product.type === 'new' && (
                <View style={ps.newBadge}>
                  <Text style={ps.newBadgeText}>YENİ</Text>
                </View>
              )}
              {/* Reward badge for new products */}
              {product.type === 'new' && hasReward && (
                <View style={ps.rewardBadgeInline}>
                  <FontAwesome5 name="gift" size={9} color="#004D3B" />
                  <Text style={ps.rewardBadgeText}>{repReward.toFixed(2)}₼</Text>
                  {baseReward !== repReward && (
                    <Text style={ps.rewardStrikeText}>{baseReward.toFixed(2)}₼</Text>
                  )}
                </View>
              )}
            </View>
          </View>
        </View>
        {/* Price: font-bold text-gray-900 */}
        <Text style={ps.price}>{product.price}₼</Text>
      </View>

      {/* Rating section */}
      {product.rateable && (
        <View style={ps.ratingSection}>
          <StarRow
            value={product.userRating || 0}
            onRate={(i) => onRate(product, i)}
            disabled={product.rated && !product.isEditing}
            dimmed={!ratingAllowed && !product.rated}
          />

          {/* Edit button: text-[10px] font-bold text-gray-400 fas fa-pencil-alt */}
          {product.rated ? (
            <TouchableOpacity onPress={() => onEdit(product)} style={ps.editBtn}>
              <FontAwesome5 name="pencil-alt" size={10} color="#9CA3AF" style={{ marginRight: 4 }} />
              <Text style={ps.editBtnText}>{String(t.edit ?? 'Düzəlt')}</Text>
            </TouchableOpacity>
          ) : !ratingAllowed && !product.rated ? (
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={ps.timeText}>{String(t.rating_available_24h ?? 'Rating available in 24 hours')}</Text>
            </View>
          ) : hasReward ? (
            <View style={{ alignItems: 'flex-end' }}>
              {/* text-[10px] text-brand-green font-bold bg-green-50 px-2 py-1 rounded */}
              <View style={ps.rewardTag}>
                <Text style={ps.rewardTagText}>+{repReward.toFixed(2)}₼</Text>
              </View>
              {baseReward !== repReward && (
                <View style={{ flexDirection: 'row', marginTop: 4 }}>
                  <Text style={ps.strikePriceText}>{baseReward.toFixed(2)}₼</Text>
                  <Text style={ps.arrowPriceText}> → {repReward.toFixed(2)}₼</Text>
                </View>
              )}
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
}

// ReceiptItemCard
interface ReceiptItemCardProps {
  item: ProductItem;
  onRate: (item: ProductItem, stars: number) => void;
  onEdit: (item: ProductItem) => void;
  isRatingAllowed?: (item: ProductItem) => boolean;
  t: TranslationDict;
}

export function ReceiptItemCard({ item, onRate, onEdit, isRatingAllowed, t }: ReceiptItemCardProps) {
  const cat = getCategoryStyle(item.catKey);
  const repReward = Number(item.reputationAppliedReward ?? item.rewardAmount ?? 0);
  const baseReward = Number(item.baseReward ?? repReward);
  const hasReward = repReward > 0 && !item.rated;
  const ratingAllowed = isRatingAllowed ? isRatingAllowed(item) : true;

  return (
    /* relative p-3 rounded-2xl border transition-all */
    <View style={[
      ps.receiptCard,
      hasReward && ps.receiptCardHighlight,
      !item.rateable && { opacity: 0.6, backgroundColor: '#F9FAFB' },
    ]}>

      {/* Floating Reward Badge: absolute top-2 right-2 */}
      {hasReward && (
        <View style={ps.floatingBadge}>
          <View style={ps.floatingBadgeInner}>
            <FontAwesome5 name="gift" size={10} color="#000" />
            <Text style={ps.floatingBadgeText}>+{repReward.toFixed(2)}₼</Text>
          </View>
          {baseReward !== repReward && (
            <View style={ps.floatingBadgeSub}>
              <Text style={ps.floatingStrike}>{baseReward.toFixed(2)}₼</Text>
              <Text style={ps.floatingArrow}> →{repReward.toFixed(2)}₼</Text>
            </View>
          )}
        </View>
      )}

      {/* Main row */}
      <View style={ps.receiptMainRow}>
        {/* w-12 h-12 rounded-xl flex items-center justify-center */}
        <View style={[ps.receiptCatIcon, { backgroundColor: cat.bg }]}>
          <FontAwesome5 name={getCategoryFA(item.catKey)} size={16} color={cat.text} />
        </View>
        <View style={{ marginLeft: 12, flex: 1 }}>
          {/* font-bold text-gray-900 text-sm truncate */}
          <Text style={ps.productName} numberOfLines={1}>{item.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {/* text-xs text-gray-400 font-medium */}
            <Text style={ps.receiptSubText}>
              {item.price}₼ • {item.quantity} {String(t.quantity ?? 'Ədəd')}
            </Text>
            {/* New badge: bg-brand-black/90 text-white */}
            {item.type === 'new' && (
              <View style={ps.newBadgeDark}>
                <FontAwesome5 name="bolt" size={8} color="#D4F238" style={{ marginRight: 4 }} />
                <Text style={ps.newBadgeDarkText}>{String(t.new_badge ?? 'YENİ • 2x')}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Rating section */}
      {item.rateable && (
        <View style={ps.receiptRatingRow}>
          <StarRow
            value={item.userRating || 0}
            onRate={(i) => onRate(item, i)}
            disabled={item.rated && !item.isEditing}
            dimmed={!ratingAllowed && !item.rated}
          />

          {item.rated ? (
            <TouchableOpacity onPress={() => onEdit(item)} style={ps.editBtn}>
              <FontAwesome5 name="pencil-alt" size={10} color="#9CA3AF" style={{ marginRight: 4 }} />
              <Text style={ps.editBtnText}>{String(t.edit ?? 'Düzəlt')}</Text>
            </TouchableOpacity>
          ) : !ratingAllowed && !item.rated ? (
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={ps.timeText}>{String(t.rating_available_24h ?? 'Rating available in 24 hours')}</Text>
            </View>
          ) : hasReward ? (
            <View style={ps.rewardTag}>
              <Text style={ps.rewardTagText}>+{repReward.toFixed(2)}₼</Text>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
}

const ps = StyleSheet.create({
  // bg-white p-4 rounded-3xl shadow-card border border-gray-50
  card: {
    backgroundColor: '#FFFFFF', // bg-white
    padding: 16, // p-4
    borderRadius: 24, // rounded-3xl
    borderWidth: 1,
    borderColor: '#F9FAFB', // border-gray-50
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03, // shadow-card
    shadowRadius: 10,
    elevation: 2,
  },
  // border-brand-lime reward-glow-pulse
  cardHighlight: {
    borderColor: '#D4F238', // border-brand-lime
    shadowColor: 'rgba(212, 242, 56, 0.4)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
  },
  // flex items-center justify-between
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  // w-14 h-14 rounded-2xl squircle
  catIcon: {
    width: 56, // w-14
    height: 56, // h-14
    borderRadius: 16, // rounded-2xl (squircle)
    alignItems: 'center',
    justifyContent: 'center',
  },
  // font-bold text-gray-900 text-sm
  productName: {
    fontWeight: '700', // font-bold
    color: '#111827', // text-gray-900
    fontSize: 14, // text-sm
  },
  // flex items-center gap-2 mt-1
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // space-x-2
    marginTop: 4, // mt-1
    flexWrap: 'wrap',
  },
  // text-[10px] font-bold text-gray-400 uppercase tracking-wide
  categoryLabel: {
    fontSize: 10, // text-[10px]
    fontWeight: '700', // font-bold
    color: '#9CA3AF', // text-gray-400
    textTransform: 'uppercase',
    letterSpacing: 0.5, // tracking-wide
  },
  // text-[9px] bg-brand-lime text-black px-2 py-0.5 rounded font-bold
  newBadge: {
    backgroundColor: '#D4F238', // bg-brand-lime
    paddingHorizontal: 8, // px-2
    paddingVertical: 2, // py-0.5
    borderRadius: 4, // rounded
  },
  newBadgeText: {
    fontSize: 9, // text-[9px]
    fontWeight: '700', // font-bold
    color: '#000000', // text-black
  },
  // reward-badge-animate flex items-center space-x-1 text-[9px] text-brand-green font-bold bg-green-50 px-2 py-0.5 rounded border border-brand-lime/30
  rewardBadgeInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDF4', // bg-green-50
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(212, 242, 56, 0.3)',
  },
  rewardBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#004D3B', // text-brand-green
  },
  rewardStrikeText: {
    fontSize: 10,
    opacity: 0.6,
    textDecorationLine: 'line-through',
  },
  // font-bold text-gray-900
  price: {
    fontWeight: '700', // font-bold
    color: '#111827', // text-gray-900
    fontSize: 14,
  },
  // mt-3 flex items-center justify-between border-t border-gray-100 pt-3
  ratingSection: {
    marginTop: 12, // mt-3
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6', // border-gray-100
    paddingTop: 12, // pt-3
  },
  // text-xl px-0.5
  starBtn: {
    paddingHorizontal: 2, // px-0.5
  },
  // text-[10px] font-bold text-gray-400 flex items-center px-2 py-1 rounded-md hover:bg-gray-50
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8, // px-2
    paddingVertical: 4, // py-1
    borderRadius: 6, // rounded-md
    backgroundColor: '#F9FAFB', // bg-gray-50
  },
  editBtnText: {
    fontSize: 10, // text-[10px]
    fontWeight: '700', // font-bold
    color: '#9CA3AF', // text-gray-400
  },
  // text-[10px] text-brand-green font-bold bg-green-50 px-2 py-1 rounded
  rewardTag: {
    backgroundColor: '#F0FDF4', // bg-green-50
    paddingHorizontal: 8, // px-2
    paddingVertical: 4, // py-1
    borderRadius: 4, // rounded
  },
  rewardTagText: {
    fontSize: 10, // text-[10px]
    fontWeight: '700', // font-bold
    color: '#004D3B', // text-brand-green
  },
  // text-[8px] text-gray-400
  strikePriceText: {
    fontSize: 8,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  arrowPriceText: {
    fontSize: 8,
    color: '#9CA3AF',
  },
  // text-[8px] text-gray-400
  timeText: {
    fontSize: 8,
    color: '#9CA3AF',
  },

  // ========== RECEIPT ITEM CARD ==========

  // relative p-3 rounded-2xl border
  receiptCard: {
    position: 'relative',
    padding: 12, // p-3
    borderRadius: 16, // rounded-2xl
    borderWidth: 1,
    borderColor: '#F3F4F6', // border-gray-100
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  // border-brand-lime reward-glow-pulse
  receiptCardHighlight: {
    borderColor: '#D4F238', // border-brand-lime
    shadowColor: 'rgba(212, 242, 56, 0.4)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
  },
  // absolute top-2 right-2 z-20
  floatingBadge: {
    position: 'absolute',
    top: 8, // top-2
    right: 8, // right-2
    zIndex: 20,
    alignItems: 'flex-end',
  },
  // flex items-center space-x-1 bg-brand-lime text-black px-2 py-1 rounded-full shadow-lg border-2 border-white
  floatingBadgeInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D4F238', // bg-brand-lime
    paddingHorizontal: 8, // px-2
    paddingVertical: 4, // py-1
    borderRadius: 9999, // rounded-full
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  // text-[10px] font-black
  floatingBadgeText: {
    fontSize: 10,
    fontWeight: '900', // font-black
    color: '#000000',
  },
  // text-[8px] text-gray-400 mt-1
  floatingBadgeSub: {
    flexDirection: 'row',
    marginTop: 4,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 4,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  floatingStrike: {
    fontSize: 8,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  floatingArrow: {
    fontSize: 8,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  // flex items-center space-x-3 relative z-10
  receiptMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // space-x-3
    zIndex: 10,
  },
  // w-12 h-12 rounded-xl
  receiptCatIcon: {
    width: 48, // w-12
    height: 48, // h-12
    borderRadius: 12, // rounded-xl
    alignItems: 'center',
    justifyContent: 'center',
  },
  // text-xs text-gray-400 font-medium
  receiptSubText: {
    fontSize: 12, // text-xs
    color: '#9CA3AF', // text-gray-400
    fontWeight: '500', // font-medium
  },
  // bg-brand-black/90 backdrop-blur px-1.5 py-0.5 rounded
  newBadgeDark: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 26, 0.9)', // bg-brand-black/90
    paddingHorizontal: 6, // px-1.5
    paddingVertical: 2, // py-0.5
    borderRadius: 4, // rounded
  },
  // text-[9px] font-bold text-white tracking-wide
  newBadgeDarkText: {
    fontSize: 9, // text-[9px]
    fontWeight: '700', // font-bold
    color: '#FFFFFF', // text-white
    letterSpacing: 0.5, // tracking-wide
  },
  // mt-3 flex items-center justify-between border-t border-gray-100 pt-2
  receiptRatingRow: {
    marginTop: 12, // mt-3
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6', // border-gray-100
    paddingTop: 8, // pt-2
  },
});
