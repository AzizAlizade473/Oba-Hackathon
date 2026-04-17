import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

/**
 * STANDALONE RECEIPT RATING SYSTEM
 * 
 * This file contains the logic for the Receipt Item Card and the 
 * feedback/rating flow used in the OBA Epsilon Application.
 */

// --- TYPES ---

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
  rewardAmount?: number;
  baseReward?: number;
  reputationAppliedReward?: number;
  orderCreatedAt?: string;
  type?: 'new' | 'global';
}

interface ReceiptItemCardProps {
  item: ProductItem;
  onRate: (item: ProductItem, stars: number) => void;
  onEdit: (item: ProductItem) => void;
  isRatingAllowed?: (item: ProductItem) => boolean;
  reliability?: number; // Trust Score (0.0 to 1.0)
  t: any; // Translation strings
}

// --- LOGIC HELPERS ---

/**
 * Calculates current trust score percentage and the corresponding color.
 */
const getTrustInfo = (reliability?: number) => {
  const percent = reliability !== undefined ? Math.round(reliability * 100) : 100;
  let color = '#10B981'; // Green (Safe)
  if (percent < 60) color = '#EF4444'; // Red (Warning)
  else if (percent < 90) color = '#EAB308'; // Yellow (At Risk)
  return { percent, color };
};

// --- COMPONENT ---

/**
 * ReceiptItemCard
 * 
 * A specialized card used inside the Receipt Details view.
 * It handles the 24h cooldown display, Trust-adjusted reward calculation,
 * and the star-rating interaction.
 */
export function ReceiptItemCard({ 
  item, 
  onRate, 
  onEdit, 
  isRatingAllowed, 
  reliability, 
  t 
}: ReceiptItemCardProps) {
  
  // 1. Calculate Trust Impact
  const repReward = Number(item.reputationAppliedReward ?? item.rewardAmount ?? 0);
  const baseReward = Number(item.baseReward ?? repReward);
  const { percent: repPercent, color: trustColor } = getTrustInfo(reliability);
  
  // 2. Determine State
  const hasReward = repReward > 0 && !item.rated;
  const ratingAllowed = isRatingAllowed ? isRatingAllowed(item) : true;

  return (
    <View style={[
      styles.card,
      hasReward && styles.cardHighlight, // Pulse borders if reward is active
      !item.rateable && styles.disabledCard
    ]}>

      {/* REWARD BADGE: Floating top-right */}
      {hasReward && (
        <View style={styles.floatingBadge}>
          <View style={styles.badgeInner}>
            <FontAwesome5 name="gift" size={10} color="#000" />
            <Text style={styles.badgeText}>+{repReward.toFixed(2)}₼</Text>
          </View>
        </View>
      )}

      {/* PRODUCT INFO ROW */}
      <View style={styles.mainRow}>
        <View style={styles.iconBox}>
          {/* Placeholder for getProductIcon logic */}
          <FontAwesome5 name="shopping-basket" size={16} color="#004D3B" />
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.subText}>
            {item.price}₼ • {item.quantity} {t.quantity || 'pcs'}
          </Text>
        </View>
      </View>

      {/* RATING SECTION: Only shown if product is rateable */}
      {item.rateable && (
        <View style={styles.ratingRow}>
          
          {/* STAR UI (Simplified for extraction) */}
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((stars) => (
              <TouchableOpacity 
                key={stars}
                onPress={() => onRate(item, stars)}
                disabled={item.rated}
              >
                <FontAwesome5 
                  name="star" 
                  size={20} 
                  solid={item.userRating && stars <= item.userRating}
                  color={item.userRating && stars <= item.userRating ? '#FBBF24' : '#E5E7EB'} 
                  style={styles.star}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* DYNAMIC FOOTER: Logic split between Rated, Cooldown, and Reward Status */}
          {item.rated ? (
            <TouchableOpacity onPress={() => onEdit(item)} style={styles.editBtn}>
              <FontAwesome5 name="pencil-alt" size={10} color="#9CA3AF" />
              <Text style={styles.editText}>{t.edit || 'Edit'}</Text>
            </TouchableOpacity>
          ) : !ratingAllowed ? (
            <Text style={styles.cooldownText}>
              {t.rating_available_24h || 'Available in 24h'}
            </Text>
          ) : (
            <View style={styles.trustInfo}>
               <Text style={styles.trustLabel}>
                 {t.max_reward || 'Max'}: {baseReward.toFixed(2)}₼ • {t.trust_score || 'Trust'}: 
                 <Text style={{ color: trustColor, fontWeight: 'bold' }}> {repPercent}%</Text>
               </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 8,
  },
  cardHighlight: {
    borderColor: '#D4F238', // OBA Brand Lime
    borderWidth: 1.5,
  },
  disabledCard: {
    opacity: 0.6,
    backgroundColor: '#F9FAFB',
  },
  floatingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 20,
  },
  badgeInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D4F238',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
    marginLeft: 4,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBox: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontWeight: '700',
    color: '#111827',
    fontSize: 14,
  },
  subText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  ratingRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 8,
  },
  stars: {
    flexDirection: 'row',
  },
  star: {
    marginRight: 4,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 6,
    borderRadius: 6,
  },
  editText: {
    fontSize: 10,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  cooldownText: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  trustInfo: {
    alignItems: 'flex-end',
  },
  trustLabel: {
    fontSize: 9, 
    color: '#9CA3AF',
  }
});
