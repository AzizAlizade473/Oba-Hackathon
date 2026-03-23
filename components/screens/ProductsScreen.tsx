// components/screens/ProductsScreen.tsx
// Pixel-perfect match to index.html products tab

import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { ProductCard, ProductItem } from '../ProductCard';
import { CAT_KEYS } from '../../constants/helpers';
import { TranslationDict } from '../../i18n/useTranslation';

interface ProductsScreenProps {
  paginatedProducts: ProductItem[];
  searchQuery: string;
  selectedCategory: string;
  currentPage: number;
  totalPages: number;
  getText: (key: string) => string;
  getCategoryLabel: (key: string) => string;
  t: TranslationDict;
  onSearchChange: (query: string) => void;
  onCategoryChange: (cat: string) => void;
  onPageChange: (page: number) => void;
  onRate: (product: ProductItem, stars: number) => void;
  onEdit: (product: ProductItem) => void;
}

export function ProductsScreen({
  paginatedProducts,
  searchQuery,
  selectedCategory,
  currentPage,
  totalPages,
  getText,
  getCategoryLabel,
  t,
  onSearchChange,
  onCategoryChange,
  onPageChange,
  onRate,
  onEdit,
}: ProductsScreenProps) {
  return (
    <View>
      {/* bg-white rounded-2xl px-4 py-3.5 text-sm font-medium text-gray-900 shadow-card */}
      <TextInput
        style={s.searchInput}
        placeholder={getText('search')}
        placeholderTextColor="#9CA3AF"
        value={searchQuery}
        onChangeText={(v) => { onSearchChange(v); onPageChange(1); }}
      />

      {/* Category filter row: flex overflow-x-auto gap-2 */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
        {CAT_KEYS.map((key) => (
          <TouchableOpacity
            key={key}
            style={[s.catBtn, selectedCategory === key && s.catBtnActive]}
            onPress={() => {
              onCategoryChange(key);
              onPageChange(1);
              if (key === 'All') onSearchChange('');
            }}
          >
            {/* text-xs font-bold */}
            <Text style={[s.catBtnText, selectedCategory === key && { color: '#FFFFFF' }]}>
              {getCategoryLabel(key)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Product cards with gap */}
      <View style={{ gap: 12 }}>
        {paginatedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            t={t}
            onRate={onRate}
            onEdit={onEdit}
          />
        ))}
      </View>

      {/* Pagination */}
      {totalPages > 1 && (
        <View style={[s.paginationRow, { marginTop: 12 }]}>
          <TouchableOpacity
            onPress={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            style={[s.pageBtn, currentPage === 1 && { opacity: 0.4 }]}
          >
            {/* fas fa-chevron-left */}
            <FontAwesome5 name="chevron-left" size={12} color="#6B7280" />
          </TouchableOpacity>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <TouchableOpacity
              key={page}
              onPress={() => onPageChange(page)}
              style={[s.pageBtn, currentPage === page && { backgroundColor: '#004D3B' }]}
            >
              <Text style={[s.pageBtnText, currentPage === page && { color: '#FFFFFF' }]}>{page}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            style={[s.pageBtn, currentPage === totalPages && { opacity: 0.4 }]}
          >
            {/* fas fa-chevron-right */}
            <FontAwesome5 name="chevron-right" size={12} color="#6B7280" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  // bg-white rounded-2xl px-4 py-3.5 text-sm font-medium text-gray-900 shadow-card
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  // bg-white px-4 py-2.5 rounded-xl shadow-sm mr-2
  catBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  // active: bg-brand-black
  catBtnActive: {
    backgroundColor: '#1A1A1A',
  },
  // text-xs font-bold text-gray-500
  catBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  // Pagination
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // w-10 h-10 bg-white rounded-xl shadow-sm
  pageBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  // text-sm font-bold text-gray-500
  pageBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },
});
