// components/BarcodeModal.tsx
// Pixel-perfect match to index.html barcode modal

import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Animated, Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { TranslationDict } from '../i18n/useTranslation';
import type { User, BonusCard } from '../types';

interface BarcodeModalProps {
  visible: boolean;
  onClose: () => void;
  barcodeDigits: string;
  user: User | null;
  getText: (key: string) => string;
  t: TranslationDict;
}

function useEnterAnimation(trigger: boolean) {
  const translateY = useRef(new Animated.Value(8)).current;
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const shine = useRef(new Animated.Value(0)).current;
  const pulse1 = useRef(new Animated.Value(0.5)).current;
  const pulse2 = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (trigger) {
      translateY.setValue(8);
      scale.setValue(0.9);
      opacity.setValue(0);
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, damping: 18, stiffness: 200 }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 18, stiffness: 200 }),
        Animated.timing(opacity, { toValue: 1, useNativeDriver: true, duration: 300 }),
      ]).start();

      Animated.loop(
        Animated.sequence([
          Animated.delay(1000),
          Animated.timing(shine, { toValue: 1, duration: 1200, useNativeDriver: true }),
          Animated.timing(shine, { toValue: 0, duration: 0, useNativeDriver: true })
        ])
      ).start();

      Animated.loop(Animated.sequence([
        Animated.timing(pulse1, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulse1, { toValue: 0.5, duration: 2000, useNativeDriver: true })
      ])).start();

      setTimeout(() => {
        Animated.loop(Animated.sequence([
          Animated.timing(pulse2, { toValue: 1, duration: 2000, useNativeDriver: true }),
          Animated.timing(pulse2, { toValue: 0.5, duration: 2000, useNativeDriver: true })
        ])).start();
      }, 1000);
    } else {
      shine.setValue(0);
      pulse1.setValue(0.5);
      pulse2.setValue(0.5);
    }
  }, [trigger]);
  return { translateY, scale, opacity, shine, pulse1, pulse2 };
}

export function BarcodeModal({ visible, onClose, barcodeDigits, user, getText }: BarcodeModalProps) {
  const { translateY, scale, opacity, shine, pulse1, pulse2 } = useEnterAnimation(visible);
  const bonusCard = (user?.bonusCard ?? user?.bonus_card) as BonusCard | undefined;
  const cardNumberRaw = (bonusCard?.cardNumber ?? bonusCard?.card_number ?? user?.cardNumber ?? '---- ---- ----') as string;
  const balance = user?.balance as number | undefined;
  const userName = user?.name as string | undefined;
  const userSurname = user?.surname as string | undefined;

  // Format as "BC - 2026 -\n9844673317" if it's just digits, otherwise use as-is
  const isDigitsOnly = /^\d+$/.test(cardNumberRaw.replace(/\D/g, ''));
  const cardPrefix = "BC - 2026 -";
  const cardSuffix = cardNumberRaw.replace(/\D/g, '');

  return (
    <Modal visible={visible} animationType="none" transparent statusBarTranslucent onRequestClose={onClose}>
      {/* Dark gradient backdrop */}
      <View style={s.overlay}>
        {/* bg-gradient-to-br from-brand-black/90 via-brand-green/30 to-brand-black/95 backdrop-blur-xl */}
        <TouchableOpacity style={[s.backdrop, { backgroundColor: 'rgba(10, 20, 15, 0.95)' }]} activeOpacity={1} onPress={onClose} />
        
        {/* Floating animated blobs on backdrop */}
        {/* Top-left, lime */}
        <Animated.View style={{
          position: 'absolute', top: 80, left: 40, width: 128, height: 128,
          backgroundColor: '#D4F238', opacity: Animated.multiply(pulse1, 0.1), borderRadius: 64,
          shadowColor: '#D4F238', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 30,
        }} />
        {/* Bottom-right, green */}
        <Animated.View style={{
          position: 'absolute', bottom: 160, right: 40, width: 160, height: 160,
          backgroundColor: '#004D3B', opacity: Animated.multiply(pulse2, 0.2), borderRadius: 80,
          shadowColor: '#004D3B', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 30,
        }} />

        <Animated.View
          style={[s.cardOuter, { opacity, transform: [{ translateY }, { scale }] }]}
        >
          {/* Horizontal Card Layout: bg-white rounded-[32px] shadow-2xl overflow-hidden relative flex, min-height: 520px */}
          <View style={s.cardBody}>

            {/* ── LEFT SIDE — Barcode Section ──
                w-[130px] bg-white flex items-center justify-center py-8 px-2 border-r-2 border-gray-100 */}
            <View style={s.barcodeColumn}>
              {barcodeDigits ? (
                <View style={{ width: 100, height: 420, alignItems: 'center', justifyContent: 'center' }}>
                  {/* html rotated barcode with Libre Barcode 39 */}
                  <View style={{ transform: [{ rotate: '90deg' }], width: 420, height: 130, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{
                      fontFamily: 'LibreBarcode39_400Regular',
                      fontSize: 64,
                      lineHeight: 64,
                      letterSpacing: 0,
                      color: '#000000',
                      textAlign: 'center',
                    }}>
                      *{barcodeDigits}*
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={{ alignItems: 'center' }}>
                  <FontAwesome5 name="exclamation-circle" size={28} color="#FCA5A5" style={{ marginBottom: 12 }} />
                  <Text style={s.cardNotFound}>{getText('card_not_found')}</Text>
                </View>
              )}
            </View>

            {/* ── RIGHT SIDE — User Information ── */}
            <View style={{ flex: 1, position: 'relative' }}>

              {/* Close Button: absolute top-3 right-3 z-30 w-9 h-9 bg-gray-800/80 rounded-full */}
              <TouchableOpacity style={s.closeBtn} onPress={onClose} activeOpacity={0.8}>
                <FontAwesome5 name="times" size={14} color="#FFFFFF" />
              </TouchableOpacity>

              {/* ── Header — Green Section ── */}
              <View style={[s.greenHeader, { overflow: 'hidden' }]}>
                {/* Shining Animation Layer */}
                <Animated.View style={[
                  StyleSheet.absoluteFill,
                  {
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    width: '300%',
                    height: '300%',
                    top: '-100%',
                    left: '-100%',
                    transform: [
                      { rotate: '35deg' },
                      {
                        translateX: shine.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-400, 400],
                        })
                      }
                    ]
                  }
                ]} />

                {/* Top Row: OBA Logo */}
                <View style={s.headerTopRow}>
                  <View>
                    <Text style={s.obaLogo}>OBA</Text>
                    <Text style={s.obaMarket}>MARKET</Text>
                  </View>
                </View>

                {/* User Info Row: Avatar + Name + Pill */}
                <View style={s.userRow}>
                  <View style={s.avatar}>
                    <Text style={s.avatarText}>
                      {((userName || 'U').charAt(0)).toLowerCase()}
                    </Text>
                  </View>
                  <View style={{ flex: 1, minWidth: 0, marginLeft: 16 }}>
                    <Text style={s.userName} numberOfLines={1}>
                      {userName} {userSurname}
                    </Text>
                    <View style={s.activePillRow}>
                      <View style={s.activePill}>
                        <View style={s.activeDot} />
                        <Text style={s.activePillText}>{getText('active_status') || 'ACTIVE'}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {/* ── Card Number Section ──
                  px-5 py-6 bg-white flex-1 flex flex-col */}
              <View style={s.whiteSection}>
                <View>
                  {/* text-[11px] text-gray-400 uppercase tracking-[0.1em] mb-2 font-bold */}
                  <Text style={s.labelText}>{getText('card_number') || 'CARD NUMBER'}</Text>
                  {/* text-lg font-bold font-mono tracking-[0.08em] text-gray-800 */}
                  <Text style={s.cardNumberText}>
                    {isDigitsOnly && cardSuffix.length > 5 ? (
                      <Text>
                        <Text style={{ letterSpacing: 3 }}>{cardPrefix}</Text>
                        {'\n'}
                        <Text style={{ letterSpacing: 2 }}>{cardSuffix}</Text>
                      </Text>
                    ) : (
                      <Text style={{ letterSpacing: 2 }}>{cardNumberRaw}</Text>
                    )}
                  </Text>
                </View>

                {/* Balance Section: mt-auto pt-6 */}
                <View style={{ marginTop: 'auto', paddingTop: 24 }}>
                  {/* bg-gradient-to-r from-brand-green/5 to-emerald-50 rounded-2xl p-4 border-2 border-brand-green/20 */}
                  <View style={s.balanceBox}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <View style={{ flex: 1 }}>
                        {/* text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-semibold */}
                        <Text style={s.balanceLabel}>{getText('balance') || 'BALANCE'}</Text>
                        {/* text-2xl font-black text-brand-green + text-sm font-bold text-brand-green/70 */}
                        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                          <Text style={s.balanceAmount}>
                            {(balance ?? 0).toFixed(2)}
                          </Text>
                          <Text style={s.balanceCurrency}> ₼</Text>
                        </View>
                      </View>
                      {/* w-10 h-10 rounded-xl bg-brand-green/10 */}
                      <View style={s.walletIconBox}>
                        <FontAwesome5 name="wallet" size={16} color="#004D3B" />
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {/* ── Footer — Instruction ──
                  px-5 py-4 bg-gradient-to-b from-white to-gray-50 border-t-2 border-gray-100 */}
              <View style={s.footer}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  {/* w-8 h-8 rounded-xl bg-brand-green/10 */}
                  <View style={s.footerIconBox}>
                    <FontAwesome5 name="barcode" size={16} color="#004D3B" />
                  </View>
                  {/* text-xs text-gray-700 font-bold */}
                  <Text style={s.footerText}>{getText('show_to_cashier')}</Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  // from-brand-black/90 via-brand-green/30 to-brand-black/95
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
  },
  cardOuter: {
    width: '100%',
    maxWidth: 340,
  },
  // bg-white rounded-[32px] shadow-2xl overflow-hidden relative flex, min-height: 520px
  cardBody: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    overflow: 'hidden',
    minHeight: 520,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 20,
  },

  // ── LEFT: w-[130px] bg-white border-r-2 border-gray-100 py-8 px-2 ──
  barcodeColumn: {
    width: 130,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 2,
    borderRightColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 8,
  },
  barcodeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 420,
  },
  barcodeBox: {
    flexDirection: 'row',
    width: 200,
    height: 60,
    alignItems: 'stretch',
    transform: [{ rotate: '90deg' }],
  },
  barcodeDigitText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 12,
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  cardNotFound: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 14,
  },

  // ── Close: absolute top-3 right-3 z-30 w-9 h-9 bg-gray-800/80 rounded-full ──
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 30,
    width: 36,
    height: 36,
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },

  // ── Header: bg-gradient from-brand-green via-emerald-600 to-brand-green px-5 py-5 ──
  greenHeader: {
    backgroundColor: '#004D3B',
    paddingHorizontal: 20,
    paddingVertical: 20,
    overflow: 'hidden',
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  // text-2xl font-black text-white tracking-tight leading-none
  obaLogo: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    lineHeight: 24,
  },
  // text-[9px] font-semibold text-white/80 uppercase tracking-[0.2em] mt-1
  obaMarket: {
    fontSize: 9,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 3.5,
    marginTop: 4,
  },
  // flex items-center space-x-3
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // w-12 h-12 rounded-full bg-white/25 border-2 border-white/40
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 9999,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  // text-white font-bold text-xl
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 20,
  },
  // text-white font-bold text-base leading-tight
  userName: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 20,
  },
  activePillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  // bg-white/30 backdrop-blur-sm rounded-full px-2.5 py-1
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    gap: 6,
  },
  // w-2 h-2 bg-brand-lime rounded-full (animate-pulse effect via shadow)
  activeDot: {
    width: 8,
    height: 8,
    backgroundColor: '#D4F238',
    borderRadius: 9999,
    shadowColor: 'rgba(212, 242, 56, 0.9)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
  // text-[9px] font-bold text-white uppercase tracking-wide
  activePillText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // ── White Section: px-5 py-6 bg-white flex-1 ──
  whiteSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
  },
  // text-[11px] text-gray-400 uppercase tracking-[0.1em] mb-2 font-bold
  labelText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  // text-lg font-bold font-mono tracking-[0.08em] text-gray-800
  cardNumberText: {
    fontWeight: '700',
    fontSize: 18,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 1,
    color: '#1F2937',
    lineHeight: 26,
  },
  // bg-gradient from-brand-green/5 to-emerald-50 rounded-2xl p-4 border-2 border-brand-green/20
  balanceBox: {
    backgroundColor: 'rgba(0, 77, 59, 0.05)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(0, 77, 59, 0.2)',
  },
  // text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-semibold
  balanceLabel: {
    fontSize: 10,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
    fontWeight: '600',
  },
  // text-2xl font-black text-brand-green
  balanceAmount: {
    fontSize: 24,
    fontWeight: '900',
    color: '#004D3B',
  },
  // text-sm font-bold text-brand-green/70
  balanceCurrency: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(0, 77, 59, 0.7)',
  },
  // w-10 h-10 rounded-xl bg-brand-green/10
  walletIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 77, 59, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Footer: px-5 py-4 bg-gradient from-white to-gray-50 border-t-2 border-gray-100 ──
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 2,
    borderTopColor: '#F3F4F6',
  },
  // w-8 h-8 rounded-xl bg-brand-green/10
  footerIconBox: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 77, 59, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // text-xs text-gray-700 font-bold
  footerText: {
    fontWeight: '700',
    fontSize: 12,
    color: '#374151',
  },
});
