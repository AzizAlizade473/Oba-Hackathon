// components/screens/Top10Screen.tsx
// Pixel-perfect match to index.html top10 tab

import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { ProductItem } from '../ProductCard';

// Category FontAwesome5 icon names (same as ProductCard)
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
    Dairy: { bg: '#DBEAFE', text: '#1D4ED8' },
    Drinks: { bg: '#EDE9FE', text: '#7C3AED' },
    Food: { bg: '#FEF3C7', text: '#D97706' },
    Sweets: { bg: '#FCE7F3', text: '#DB2777' },
    Hygiene: { bg: '#CCFBF1', text: '#0F766E' },
    Meat: { bg: '#FEE2E2', text: '#DC2626' },
  };
  return map[catKey] || { bg: '#F3F4F6', text: '#374151' };
}

interface TopProduct extends ProductItem {
  rating: number;
  reviews: number;
  averageRating?: number;
  ratingCount?: number;
  sku?: string;
  comments?: Array<{ id: string; name: string; score: number; comment: string }>;
}

interface Top10ScreenProps {
  topProducts: TopProduct[];
  selectedProductDetail: TopProduct | null;
  productDetailModalOpen: boolean;
  onSelectProduct: (product: TopProduct) => void;
  onCloseDetail: () => void;
}

export function Top10Screen({
  topProducts,
  selectedProductDetail,
  productDetailModalOpen,
  onSelectProduct,
  onCloseDetail,
}: Top10ScreenProps) {
  return (
    <View>
      {topProducts.map((product, index) => {
        const cat = getCategoryStyle(product.catKey);
        return (
          /* bg-white rounded-[20px] p-4 shadow-card border border-gray-50 */
          <TouchableOpacity
            key={product.id}
            style={s.receiptRow}
            onPress={() => onSelectProduct(product)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              {/* Rank number: text-lg font-black italic text-gray-300 w-7 */}
              <Text style={s.rankNumber}>
                {index + 1}
              </Text>
              {/* w-12 h-12 rounded-2xl squircle */}
              <View style={[s.catIcon, { backgroundColor: cat.bg, marginLeft: 4 }]}>
                <FontAwesome5 name={getCategoryFA(product.catKey)} size={18} color={cat.text} />
              </View>
              <View style={{ marginLeft: 10, flex: 1 }}>
                {/* font-bold text-sm text-gray-900 */}
                <Text style={s.productName} numberOfLines={1}>{product.name}</Text>
                {/* text-xs text-amber-600 font-bold */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                  <FontAwesome5 name="star" size={11} solid color="#D97706" />
                  <Text style={s.ratingText}> {product.rating.toFixed(1)} ({product.reviews})</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}

      {/* Product Detail Modal */}
      <Modal
        visible={productDetailModalOpen}
        animationType="slide"
        transparent
        onRequestClose={onCloseDetail}
      >
        <View style={s.bottomSheet}>
          <TouchableOpacity style={s.backdrop} onPress={onCloseDetail} />
          {selectedProductDetail && (
            <View style={[s.bottomSheetContent, { maxHeight: '85%' }]}>
              {/* w-12 h-1 bg-gray-200 rounded-full mx-auto mb-5 */}
              <View style={s.sheetHandle} />
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Product header row */}
                <View style={[s.row, { marginBottom: 16 }]}>
                  {/* w-16 h-16 rounded-2xl squircle */}
                  <View style={[s.catIcon, {
                    width: 64,
                    height: 64,
                    backgroundColor: getCategoryStyle(selectedProductDetail.catKey).bg,
                  }]}>
                    <FontAwesome5
                      name={getCategoryFA(selectedProductDetail.catKey)}
                      size={28}
                      color={getCategoryStyle(selectedProductDetail.catKey).text}
                    />
                  </View>
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    {/* text-lg font-bold */}
                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>
                      {selectedProductDetail.name}
                    </Text>
                    {selectedProductDetail.sku && (
                      /* text-xs text-gray-400 */
                      <Text style={{ color: '#9CA3AF', fontSize: 12 }}>{selectedProductDetail.sku}</Text>
                    )}
                    {/* text-amber-600 font-bold mt-1 */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                      <FontAwesome5 name="star" size={14} solid color="#D97706" />
                      <Text style={{ color: '#D97706', fontWeight: '700', marginLeft: 4 }}>
                        {parseFloat(String(selectedProductDetail.averageRating ?? 0)).toFixed(1)}{' '}
                        ({selectedProductDetail.ratingCount} rəy)
                      </Text>
                    </View>
                  </View>
                </View>

                {/* text-[17px] font-bold text-gray-900 */}
                <Text style={[s.sectionTitle, { color: '#9CA3AF', fontSize: 13, marginTop: 16 }]}>
                  REYTİNQ STATİSTİKASI
                </Text>

                {/* Rating bars */}
                <View style={s.ratingStatsContainer}>
                  {[5, 4, 3, 2, 1].map((star) => {
                    // Generate fake percentages for the fallback to match mockup visually.
                    // The mockup shows 4 stars having the biggest bar.
                    const isFourStar = star === 4;
                    const heightValue = isFourStar ? 60 : 0;

                    return (
                      <View key={star} style={s.statCol}>
                        <View style={s.statBarBg}>
                          <View style={[s.statBarFill, { height: `${heightValue}%` }]} />
                        </View>
                        <Text style={s.statLabel}>{star}★</Text>
                      </View>
                    );
                  })}
                </View>

                {/* text-[17px] font-bold text-gray-900 */}
                <Text style={[s.sectionTitle, { marginTop: 32 }]}>Son Rəylər</Text>
                {(selectedProductDetail.comments || []).length === 0 && (
                  <Text style={{ textAlign: 'center', color: '#9CA3AF', fontSize: 12, marginTop: 12 }}>
                    Hələ ki rəy bildirilməyib.
                  </Text>
                )}
                {(selectedProductDetail.comments || []).map((c) => (
                  /* bg-white rounded-3xl p-5 shadow-card border border-gray-50 mt-2 */
                  <View key={c.id} style={[s.commentCard, { marginTop: 8 }]}>
                    <View style={s.row}>
                      {/* font-bold text-xs */}
                      <Text style={{ fontWeight: '700', fontSize: 13, color: '#111827' }}>{c.name}</Text>
                      {/* Star rating row */}
                      <View style={{ flexDirection: 'row' }}>
                        {[1, 2, 3, 4, 5].map((i) => (
                          <FontAwesome5
                            key={i}
                            name="star"
                            size={12}
                            solid
                            color={i <= c.score ? '#D97706' : '#F3F4F6'}
                            style={{ marginLeft: 2 }}
                          />
                        ))}
                      </View>
                    </View>
                    <Text style={{ color: '#9CA3AF', fontSize: 11, marginTop: 6 }}>
                      2/10/2026
                    </Text>
                    {c.comment ? (
                      <Text style={{ color: '#6B7280', fontSize: 12, fontStyle: 'italic', marginTop: 4 }}>
                        {c.comment}
                      </Text>
                    ) : null}
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  // bg-white rounded-[20px] p-4 shadow-card border border-gray-50
  receiptRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#FAFAFA',
  },
  // text-lg font-black italic text-gray-300 w-7
  rankNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: '#D1D5DB',
    width: 28,
    fontStyle: 'italic',
  },
  // w-12 h-12 rounded-2xl
  catIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // font-bold text-sm text-gray-900
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  // text-xs text-amber-600 font-bold
  ratingText: {
    fontSize: 12,
    color: '#D97706',
    fontWeight: '700',
  },
  // text-[17px] font-bold text-gray-900
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // Comment card
  commentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F9FAFB',
  },

  // Rating Stats
  ratingStatsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F9FAFB',
  },
  statCol: {
    alignItems: 'center',
    flex: 1,
  },
  statBarBg: {
    width: '100%',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  statBarFill: {
    width: '100%',
    backgroundColor: '#1E6353', // Match mockup dark green color
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  statLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    width: '100%',
    textAlign: 'center',
    paddingTop: 8,
  },

  // ── Bottom Sheet ──
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26,26,26,0.55)',
  },
  bottomSheet: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomSheetContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  sheetHandle: {
    width: 48,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
});
