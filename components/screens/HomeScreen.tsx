// components/screens/HomeScreen.tsx
// Pixel-perfect match to index.html home tab

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  FlatList,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { ReceiptItemCard, ProductItem } from '../ProductCard';
import { TranslationDict } from '../../i18n/useTranslation';
import type { User } from '../../types';

export interface Order {
  id: string;
  fullId: string;
  date: string;
  day: number;
  month: string;
  time: string;
  total: string;
  status: 'rated' | 'pending';
  items: ProductItem[];
}

interface HomeScreenProps {
  user: User | null;
  orders: Order[];
  loading: boolean;
  animateBalance: boolean;
  barcodeDigits: string;
  showAllReceipts: boolean;
  selectedReceipt: Order | null;
  receiptPagination: { page: number; limit: number; totalPages: number };
  getText: (key: string) => string;
  getExactMonth: (key: string) => string;
  t: TranslationDict;
  onShowAllReceipts: (v: boolean) => void;
  onSelectReceipt: (receipt: Order | null) => void;
  onBarcodePress: () => void;
  onInstructionsPress: () => void;
  onProductsTabPress: () => void;
  onReceiptPageChange: (page: number) => void;
  onRateItem: (item: ProductItem, stars: number) => void;
  onEditItem: (item: ProductItem) => void;
  onLoadUserData: () => void;
}

export function HomeScreen({
  user,
  orders,
  loading,
  animateBalance,
  barcodeDigits,
  showAllReceipts,
  selectedReceipt,
  receiptPagination,
  getText,
  getExactMonth,
  t,
  onShowAllReceipts,
  onSelectReceipt,
  onBarcodePress,
  onInstructionsPress,
  onProductsTabPress,
  onReceiptPageChange,
  onRateItem,
  onEditItem,
  onLoadUserData,
}: HomeScreenProps) {
  const balance = user?.balance as number | undefined;

  return (
    <View>
      {/* ── Wallet Card ─────────────────────────────────────────────────────
          bg-brand-green rounded-[32px] p-6 aspect-[1.7] overflow-hidden
          shadow-float relative flex flex-col justify-between
      ─────────────────────────────────────────────────────────────────────── */}
      <View style={[s.walletCard, { aspectRatio: 1.7, flex: undefined, flexDirection: 'column', justifyContent: 'space-between', padding: 24, overflow: 'hidden' }]}>
        
        {/* Top-right blob: absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-16 -mt-16 */}
        <View style={{
          position: 'absolute', top: -64, right: -64, width: 256, height: 256,
          backgroundColor: '#FFFFFF', opacity: 0.1, borderRadius: 128,
          // Faking blur-3xl with drop shadow and lower opacity in RN
          shadowColor: '#fff', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 32,
        }} />
        
        {/* Bottom-left blob: absolute bottom-0 left-0 w-40 h-40 bg-brand-lime opacity-10 rounded-full blur-2xl -ml-10 -mb-10 */}
        <View style={{
          position: 'absolute', bottom: -40, left: -40, width: 160, height: 160,
          backgroundColor: '#D4F238', opacity: 0.15, borderRadius: 80,
          shadowColor: '#D4F238', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.7, shadowRadius: 24,
        }} />

        {/* Top row — Balance + Active pill: relative z-10 flex justify-between items-start */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 10 }}>
          <View>
            {/* label text-white/60 text-xs font-medium tracking-wide */}
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '500', letterSpacing: 0.5, marginBottom: 4, textTransform: 'uppercase' }}>
              {getText('cashback') || 'CASHBACK'}
            </Text>
            {/* balance number text-4xl font-bold with ₼ as text-xl font-medium text-white/80 */}
            <Text style={[
              { color: '#FFFFFF', fontSize: 36, fontWeight: '700', letterSpacing: -0.5 },
              animateBalance && { color: '#D4F238' }
            ]}>
              {(balance ?? 0).toFixed(2)}
              <Text style={{ fontSize: 20, fontWeight: '500', color: 'rgba(255,255,255,0.8)' }}> ₼</Text>
            </Text>
          </View>
          
          {/* rounded frosted pill: bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 */}
          <View style={{
            flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)',
            paddingHorizontal: 12, paddingVertical: 4, borderRadius: 9999,
            borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)'
          }}>
            {/* ⚡ AKTIV in text-[10px] font-bold text-brand-lime uppercase */}
            <FontAwesome5 name="bolt" size={10} color="#D4F238" />
            <Text style={{ fontSize: 10, fontWeight: '700', color: '#D4F238', textTransform: 'uppercase', letterSpacing: 1, marginLeft: 4 }}>
              {getText('active_status') || 'AKTİV'}
            </Text>
          </View>
        </View>

        {/* Bottom row — Barcode button + last 4 digits: relative z-10 flex (matches image of them next to each other) */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, zIndex: 10 }}>
          {/* w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl with fa-barcode */}
          <TouchableOpacity 
            style={{ width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}
            onPress={onBarcodePress} activeOpacity={0.7}
          >
            <FontAwesome5 name="barcode" size={20} color="rgba(255,255,255,0.9)" />
          </TouchableOpacity>
          {/* text-xs font-mono text-white/70 tracking-widest */}
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', letterSpacing: 2 }}>
            {barcodeDigits?.slice(-4) || '****'}
          </Text>
        </View>
      </View>

      {/* ── Problem Solved Widget ────────────────────────────────────────────
          bg-white rounded-3xl p-5 shadow-card border border-gray-50
          w-12 h-12 rounded-2xl bg-green-50 fas fa-clipboard-check text-brand-green
      ─────────────────────────────────────────────────────────────────────── */}
      <View style={[s.card, { flexDirection: 'row', marginTop: 16 }]}>
        {/* w-12 h-12 rounded-2xl bg-green-50 */}
        <View style={s.solvedIconBox}>
          {/* fas fa-clipboard-check text-brand-green text-xl */}
          <FontAwesome5 name="clipboard-check" size={22} color="#004D3B" />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {/* font-bold text-[13px] text-gray-900 */}
            <Text style={s.solvedTitle}>{getText('solved_problem')}</Text>
            {/* text-[10px] bg-gray-100 text-gray-400 font-bold px-2 py-0.5 rounded-full */}
            <View style={s.newBadge}><Text style={s.newBadgeText}>{getText('new')}</Text></View>
          </View>
          {/* text-xs text-gray-400 mt-1 leading-relaxed */}
          <Text style={s.solvedDesc}>
            <Text style={{ fontWeight: '700', color: '#111827' }}>OBA Kərə Yağı </Text>
            {getText('solved_problem_sentence')}
          </Text>
        </View>
      </View>

      {/* ── Grid Widgets ─────────────────────────────────────────────────────
          flex gap-4 mt-4
      ─────────────────────────────────────────────────────────────────────── */}
      <View style={{ flexDirection: 'row', marginTop: 16, gap: 16 }}>
        {/* How it Works Widget — white bg with light blue decorative shapes */}
        <TouchableOpacity
          style={[s.widgetCard, { flex: 1, backgroundColor: '#FFFFFF', borderWidth: 0, overflow: 'hidden' }]}
          onPress={onInstructionsPress}
          activeOpacity={0.9}
        >
          {/* Light blue decorative circle top-right */}
          <View style={{ position: 'absolute', top: -20, right: -20, width: 90, height: 90, borderRadius: 45, backgroundColor: '#EFF6FF' }} />
          <View style={{ position: 'absolute', top: 16, right: 16 }}>
            <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold', fontStyle: 'italic' }}>i</Text>
            </View>
          </View>
          
          <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: '#DBEAFE', alignItems: 'center', justifyContent: 'center' }}>
            <FontAwesome5 name="book-open" size={20} color="#2563EB" />
          </View>
          {/* text-lg font-extrabold text-gray-900 mt-4 leading-tight */}
          <Text style={[s.widgetTitle, { marginTop: 16, color: '#111827', fontSize: 18, fontWeight: '800' }]}>{getText('how_it_works')}</Text>
          {/* text-[10px] text-gray-400 font-bold mt-1 */}
          <Text style={[s.widgetSub, { color: '#9CA3AF', fontSize: 10 }]}>{getText('rules_rank')}</Text>
        </TouchableOpacity>

        {/* Rate & Earn Widget — very dark bg with dark grey icon wrap */}
        <TouchableOpacity
          style={[s.widgetCard, { flex: 1, backgroundColor: '#18181A', borderWidth: 0 }]}
          onPress={onProductsTabPress}
          activeOpacity={0.9}
        >
          <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: '#3F3F46', alignItems: 'center', justifyContent: 'center' }}>
            <FontAwesome5 name="star" size={20} solid color="#FFFFFF" />
          </View>
          {/* text-lg font-extrabold text-white mt-4 leading-tight */}
          <Text style={[s.widgetTitle, { marginTop: 16, color: '#FFFFFF', fontSize: 18, fontWeight: '800' }]}>{getText('rate_earn')}</Text>
          {/* text-[10px] text-brand-lime font-bold mt-1 */}
          <Text style={[s.widgetSub, { color: '#D4F238', fontSize: 11 }]}>{getText('earn_sub')} →</Text>
        </TouchableOpacity>
      </View>

      {/* ── Receipts ──────────────────────────────────────────────────────── */}
      <View style={{ marginTop: 24 }}>
        <View style={[s.row, { marginBottom: 16 }]}>
          {/* text-[17px] font-bold text-gray-900 */}
          <Text style={s.sectionTitle}>{getText('receipts')}</Text>
          {orders.length > 0 && (
            /* bg-green-50 text-brand-green font-bold text-xs px-3 py-1 rounded-full */
            <TouchableOpacity style={s.allBtn} onPress={() => onShowAllReceipts(true)}>
              <Text style={s.allBtnText}>{getText('all')}</Text>
            </TouchableOpacity>
          )}
        </View>
        {loading && orders.length === 0 && <ActivityIndicator color="#004D3B" style={{ marginTop: 20 }} />}
        {!loading && orders.length === 0 && (
          /* bg-white rounded-3xl p-8 text-center shadow-card */
          <View style={s.emptyBox}>
            {/* fas fa-receipt text-3xl text-gray-300 mb-2 */}
            <FontAwesome5 name="receipt" size={32} color="#D1D5DB" style={{ marginBottom: 8 }} />
            <Text style={s.emptyTitle}>{getText('no_receipts')}</Text>
            <Text style={s.emptyDesc}>{getText('no_receipts_sub')}</Text>
          </View>
        )}
        {orders.slice(0, 3).map((bill) => (
          /* bg-white rounded-[20px] p-4 shadow-card border border-gray-50 */
          <TouchableOpacity key={bill.fullId} style={s.receiptRow} onPress={() => onSelectReceipt(bill)}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 */}
              <View style={s.dateBadge}>
                <Text style={s.dateBadgeMonth}>{getExactMonth(bill.month)}</Text>
                <Text style={s.dateBadgeDay}>{bill.day}</Text>
              </View>
              <View style={{ marginLeft: 12 }}>
                <Text style={s.receiptTitle}>{getText('purchase')} #{bill.id}</Text>
                <Text style={s.receiptSub}>{bill.items.length} {getText('product')} • {bill.time}</Text>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={s.receiptAmount}>{bill.total}₼</Text>
              <Text style={[s.statusBadge, bill.status === 'rated' ? s.statusRated : s.statusPending]}>
                {getText(bill.status)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── All Receipts Modal ────────────────────────────────────────────── */}
      <Modal visible={showAllReceipts} animationType="slide" onRequestClose={() => onShowAllReceipts(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FB' }}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>{getText('receipts')}</Text>
            <TouchableOpacity onPress={() => onShowAllReceipts(false)} style={s.closeBtn}>
              <FontAwesome5 name="times" size={14} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={orders}
            keyExtractor={(item) => item.fullId}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item: bill }) => (
              <TouchableOpacity
                style={s.receiptRow}
                onPress={() => { onShowAllReceipts(false); onSelectReceipt(bill); }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={s.dateBadge}>
                    <Text style={s.dateBadgeMonth}>{getExactMonth(bill.month)}</Text>
                    <Text style={s.dateBadgeDay}>{bill.day}</Text>
                  </View>
                  <View style={{ marginLeft: 12 }}>
                    <Text style={s.receiptTitle}>{getText('purchase')} #{bill.id}</Text>
                    <Text style={s.receiptSub}>{bill.items.length} {getText('product')} • {bill.time}</Text>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={s.receiptAmount}>{bill.total}₼</Text>
                  <Text style={[s.statusBadge, bill.status === 'rated' ? s.statusRated : s.statusPending]}>
                    {getText(bill.status)}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', color: '#9CA3AF', marginTop: 40 }}>
                {getText('no_receipts')}
              </Text>
            }
          />
          {receiptPagination.totalPages > 1 && (
            <View style={[s.row, { justifyContent: 'space-between', padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F3F4F6' }]}>
              <TouchableOpacity
                onPress={() => { onReceiptPageChange(Math.max(1, receiptPagination.page - 1)); onLoadUserData(); }}
                disabled={receiptPagination.page === 1}
                style={[s.pageBtn, receiptPagination.page === 1 && { opacity: 0.4 }]}
              >
                {/* fas fa-chevron-left */}
                <FontAwesome5 name="chevron-left" size={12} color="#6B7280" />
              </TouchableOpacity>
              <Text style={{ fontSize: 12, color: '#9CA3AF', fontWeight: '600' }}>
                {receiptPagination.page} / {receiptPagination.totalPages}
              </Text>
              <TouchableOpacity
                onPress={() => { onReceiptPageChange(Math.min(receiptPagination.totalPages, receiptPagination.page + 1)); onLoadUserData(); }}
                disabled={receiptPagination.page === receiptPagination.totalPages}
                style={[s.pageBtn, receiptPagination.page === receiptPagination.totalPages && { opacity: 0.4 }]}
              >
                {/* fas fa-chevron-right */}
                <FontAwesome5 name="chevron-right" size={12} color="#6B7280" />
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </Modal>

      {/* ── Receipt Detail Modal ──────────────────────────────────────────── */}
      <Modal
        visible={!!selectedReceipt}
        animationType="slide"
        transparent
        onRequestClose={() => onSelectReceipt(null)}
      >
        <View style={s.bottomSheet}>
          <TouchableOpacity style={s.backdrop} onPress={() => onSelectReceipt(null)} />
          <View style={s.bottomSheetContent}>
            <View style={s.sheetHandle} />
            <View style={[s.row, { marginBottom: 16 }]}>
              <View>
                {/* text-[26px] font-extrabold */}
                <Text style={{ fontSize: 26, fontWeight: '800', color: '#111827' }}>{selectedReceipt?.total}₼</Text>
                {/* text-gray-400 text-[13px] */}
                <Text style={{ color: '#9CA3AF', fontSize: 13 }}>#{selectedReceipt?.id}</Text>
              </View>
              <TouchableOpacity onPress={() => onSelectReceipt(null)} style={s.closeBtn}>
                <FontAwesome5 name="times" size={14} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {(selectedReceipt?.items || [])
                .slice()
                .sort((a, b) => (b.rewardAmount ?? 0) - (a.rewardAmount ?? 0))
                .map((item: ProductItem) => (
                  <ReceiptItemCard
                    key={item.uniqueId}
                    item={item}
                    t={t}
                    onRate={onRateItem}
                    onEdit={onEditItem}
                  />
                ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  // ── Wallet ──
  // bg-brand-green rounded-[32px] p-6 aspect-[1.7/1] overflow-hidden shadow-2xl shadow-brand-green/30
  walletCard: {
    backgroundColor: '#004D3B',
    borderRadius: 32,
    padding: 24,
    marginBottom: 4,
    aspectRatio: 1.7,
    overflow: 'hidden',
    justifyContent: 'space-between',
    shadowColor: '#004D3B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 10,
  },
  // absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full
  walletBgShape1: {
    position: 'absolute',
    top: -64,
    right: -64,
    width: 256,
    height: 256,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 128,
  },
  // absolute -bottom-10 -left-10 w-40 h-40 bg-brand-lime/10 rounded-full
  walletBgShape2: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    width: 160,
    height: 160,
    backgroundColor: 'rgba(212,242,56,0.1)',
    borderRadius: 80,
  },
  // text-white/60 text-xs font-medium tracking-wide mb-1
  walletLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  // text-4xl font-bold tracking-tight
  walletBalance: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  // text-xl font-medium text-white/80
  walletCurrency: {
    fontSize: 20,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
  },
  // bg-white/10 border border-white/10 px-3 py-1 rounded-full
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  // text-[10px] font-bold text-brand-lime uppercase tracking-wider
  activePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D4F238',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  // w-10 h-10 bg-white/20 rounded-xl
  barcodeBtn: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  // text-white/70 text-xs font-mono tracking-widest
  cardLastDigits: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 3,
    fontWeight: '500',
  },

  // ── Card ──
  // bg-white rounded-3xl p-5 shadow-card border border-gray-50
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#FAFAFA',
  },

  // ── Solved ──
  // w-12 h-12 rounded-2xl bg-green-50
  solvedIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // font-bold text-[13px] text-gray-900
  solvedTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  // text-xs text-gray-400 mt-1 leading-relaxed
  solvedDesc: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    lineHeight: 18,
  },
  // text-[10px] bg-gray-100 text-gray-400 font-bold px-2 py-0.5 rounded-full
  newBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  newBadgeText: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '700',
  },

  // ── Widgets ──
  // rounded-3xl p-5 min-h-[148px] shadow-card border border-gray-50 overflow-hidden
  widgetCard: {
    borderRadius: 24,
    padding: 20,
    minHeight: 148,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#FAFAFA',
    overflow: 'hidden',
  },
  // text-lg font-extrabold leading-tight
  widgetTitle: {
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 22,
  },
  // text-[10px] text-gray-400 font-bold mt-1
  widgetSub: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
    fontWeight: '700',
  },

  // ── Shared ──
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // text-[17px] font-bold text-gray-900
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },

  // ── Receipts ──
  // bg-green-50 text-brand-green font-bold text-xs px-3 py-1 rounded-full
  allBtn: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  allBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#004D3B',
  },
  // bg-white rounded-3xl p-8 text-center shadow-card
  emptyBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
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
  // w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100
  dateBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  // text-[9px] font-bold uppercase text-gray-400
  dateBadgeMonth: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#9CA3AF',
  },
  // text-base font-bold text-gray-900
  dateBadgeDay: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  receiptTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  receiptSub: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  receiptAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  // text-[10px] font-bold px-1.5 py-0.5 rounded-md
  statusBadge: {
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
    marginTop: 4,
  },
  // bg-green-50 text-emerald-600
  statusRated: {
    backgroundColor: '#F0FDF4',
    color: '#059669',
  },
  // bg-orange-50 text-orange-600
  statusPending: {
    backgroundColor: '#FFF7ED',
    color: '#EA580C',
  },

  // ── Modal ──
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  // w-9 h-9 bg-gray-100 rounded-full
  closeBtn: {
    width: 36,
    height: 36,
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Page buttons
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

  // ── Bottom Sheet ──
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26,26,26,0.55)',
  },
  bottomSheet: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  // bg-white rounded-t-[32px] p-6 max-h-[80%] shadow-2xl
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
  // w-12 h-1 bg-gray-200 rounded-full mx-auto mb-5
  sheetHandle: {
    width: 48,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
});
