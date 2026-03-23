// components/OBAApp.tsx
// Main OBA App component — orchestrates screens, modals, and state

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Modal,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useFonts, LibreBarcode39_400Regular } from '@expo-google-fonts/libre-barcode-39';

import { C } from '../constants/colors';
import { s } from '../styles/styles';
import { useTranslation } from '../i18n/useTranslation';
import type { Lang } from '../types';
import { useAppState } from '../hooks/useAppState';
import { useRating } from '../hooks/useRating';

import { Toast } from './Toast';
import { NavBar } from './NavBar';
import { BarcodeModal } from './BarcodeModal';
import { FeedbackModal } from './FeedbackModal';
import { NotificationsPanel } from './NotificationsPanel';
import { InstructionsModal } from './InstructionsModal';

import { AuthScreen } from './screens/AuthScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ProductsScreen } from './screens/ProductsScreen';
import { Top10Screen } from './screens/Top10Screen';
import { SettingsScreen } from './screens/SettingsScreen';

export default function OBAApp() {
  const [fontsLoaded] = useFonts({
    LibreBarcode39_400Regular,
  });

  const [lang, setLangState] = useState<Lang>('az');
  const [reliabilityInfoOpen, setReliabilityInfoOpen] = useState(false);
  const { t, getText, getExactMonth, getCategoryLabel } = useTranslation(lang);

  const state = useAppState({ getText, t, setLangState });

  const rating = useRating({
    orders: state.orders,
    products: state.products,
    setOrders: state.setOrders,
    setProducts: state.setProducts,
    setUser: state.setUser,
    getText,
    showToast: state.showToast,
    setLoading: state.setLoading,
    setAnimateBalance: state.setAnimateBalance,
  });

  if (!fontsLoaded) {
    return null;
  }

  // ── Auth View ───────────────────────────────────────────────────────────────
  if (state.currentView === 'auth') {
    return (
      <AuthScreen
        authMode={state.authMode}
        setAuthMode={state.setAuthMode}
        loginForm={state.loginForm}
        setLoginForm={state.setLoginForm}
        registerForm={state.registerForm}
        setRegisterForm={state.setRegisterForm}
        onLogin={state.login}
        onRegister={state.register}
        loading={state.loading}
        getText={getText}
      />
    );
  }

  // ── App View ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={s.appContainer}>
      {/* Header */}
      <View style={s.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={s.avatarBox}>
            <Text style={{ color: C.green, fontWeight: '700', fontSize: 18 }}>
              {((state.user?.name as string | undefined)?.charAt(0) || 'O').toUpperCase()}
            </Text>
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={s.welcomeLabel}>{getText('welcome')}</Text>
            <Text style={s.headerName}>{(state.user?.name as string | undefined) || 'User'}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Trust score badge — touchable, opens info modal */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              paddingHorizontal: 12,
              paddingVertical: 6,
              backgroundColor: '#fff',
              borderRadius: 999,
              borderWidth: 1,
              borderColor: '#F3F4F6',
              marginRight: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.03,
              shadowRadius: 4,
              elevation: 1,
            }}
            onPress={() => setReliabilityInfoOpen(true)}
            activeOpacity={0.9}
          >
            {/* SVG shield matching HTML exactly */}
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                stroke="#004D3B"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '700',
                color: '#374151',
              }}
            >
              {`${Math.round((((state.user?.reliability as number | undefined) || 0) * 100))}%`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.notifBtn} onPress={() => state.setNotificationsOpen(true)}>
            <FontAwesome5 name="bell" size={18} solid color="#1A1A1A" />
            <View style={s.notifDot} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120, paddingTop: 12 }}
        refreshControl={<RefreshControl refreshing={state.refreshing} onRefresh={state.onRefresh} tintColor={C.green} />}
        showsVerticalScrollIndicator={false}
      >
        {state.activeTab === 'home' && (
          <HomeScreen
            user={state.user}
            orders={state.orders}
            loading={state.loading}
            animateBalance={state.animateBalance}
            barcodeDigits={state.barcodeDigits}
            showAllReceipts={state.showAllReceipts}
            selectedReceipt={state.selectedReceipt}
            receiptPagination={state.receiptPagination}
            getText={getText}
            getExactMonth={getExactMonth}
            t={t}
            onShowAllReceipts={state.setShowAllReceipts}
            onSelectReceipt={state.setSelectedReceipt}
            onBarcodePress={() => state.setBarcodeModalOpen(true)}
            onInstructionsPress={() => state.setInstructionsModalOpen(true)}
            onProductsTabPress={() => state.setActiveTab('products')}
            onReceiptPageChange={(page) => state.setReceiptPagination((p) => ({ ...p, page }))}
            onRateItem={rating.handleRate}
            onEditItem={rating.handleEditRating}
            onLoadUserData={state.loadUserData}
          />
        )}
        {state.activeTab === 'products' && (
          <ProductsScreen
            paginatedProducts={state.paginatedProducts}
            searchQuery={state.searchQuery}
            selectedCategory={state.selectedCategory}
            currentPage={state.currentPage}
            totalPages={state.totalPages}
            getText={getText}
            getCategoryLabel={getCategoryLabel}
            t={t}
            onSearchChange={state.setSearchQuery}
            onCategoryChange={state.setSelectedCategory}
            onPageChange={state.setCurrentPage}
            onRate={rating.handleRate}
            onEdit={rating.handleEditRating}
          />
        )}
        {state.activeTab === 'top10' && (
          <Top10Screen
            topProducts={state.topProducts as Parameters<typeof Top10Screen>[0]['topProducts']}
            selectedProductDetail={state.selectedProductDetail as Parameters<typeof Top10Screen>[0]['selectedProductDetail']}
            productDetailModalOpen={state.productDetailModalOpen}
            onSelectProduct={state.loadProductDetail}
            onCloseDetail={() => state.setProductDetailModalOpen(false)}
          />
        )}
        {state.activeTab === 'settings' && (
          <SettingsScreen
            user={state.user}
            lang={lang}
            notificationsEnabled={state.notificationsEnabled}
            profileModalOpen={state.profileModalOpen}
            cardsModalOpen={state.cardsModalOpen}
            savedCards={state.savedCards}
            getText={getText}
            onToggleNotifications={() => state.setNotificationsEnabled((p) => !p)}
            onLangChange={state.setLang}
            onLogout={state.logout}
            onProfileModalOpen={state.setProfileModalOpen}
            onCardsModalOpen={state.setCardsModalOpen}
            onUserChange={(updater) => state.setUser((prev) => updater(prev))}
            showToast={state.showToast}
          />
        )}
      </ScrollView>

      {/* Bottom NavBar */}
      <NavBar
        activeTab={state.activeTab}
        onTabChange={state.setActiveTab}
        onBarcodePress={() => state.setBarcodeModalOpen(true)}
      />

      {/* Modals */}
      <BarcodeModal
        visible={state.barcodeModalOpen}
        onClose={() => state.setBarcodeModalOpen(false)}
        barcodeDigits={state.barcodeDigits}
        user={state.user}
        getText={getText}
        t={t}
      />
      <FeedbackModal
        visible={rating.feedbackModalOpen}
        onClose={() => rating.setFeedbackModalOpen(false)}
        feedbackReason={rating.feedbackReason}
        feedbackComment={rating.feedbackComment}
        onReasonChange={rating.setFeedbackReason}
        onCommentChange={rating.setFeedbackComment}
        onSubmit={rating.submitFeedback}
        getText={getText}
        t={t}
      />
      <NotificationsPanel
        visible={state.notificationsOpen}
        onClose={() => state.setNotificationsOpen(false)}
        notifications={state.notifications}
        getText={getText}
      />
      <InstructionsModal
        visible={state.instructionsModalOpen}
        onClose={() => state.setInstructionsModalOpen(false)}
        getText={getText}
      />

      {/* Loading Overlay */}
      {state.loading && (
        <View style={s.loadingOverlay}>
          <ActivityIndicator size="large" color={C.green} />
        </View>
      )}

      {/* Toast */}
      <Toast visible={state.toast.visible} message={state.toast.message} type={state.toast.type} />

      {/* Reliability Info Modal */}
      <Modal
        visible={reliabilityInfoOpen}
        animationType="fade"
        transparent
        onRequestClose={() => setReliabilityInfoOpen(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={() => setReliabilityInfoOpen(false)}
          >
            <View style={{ flex: 1, backgroundColor: 'rgba(26,26,26,0.55)' }} />
          </TouchableOpacity>
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 32,
            padding: 32,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.15,
            shadowRadius: 30,
            elevation: 20,
            alignItems: 'center',
          }}>
            {/* Top rounded square with shield icon */}
            <View style={{
              width: 72,
              height: 72,
              borderRadius: 24,
              backgroundColor: '#ECFDF5',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
            }}>
              <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                  stroke="#004D3B"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>

            {/* Title */}
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 16 }}>
              {getText('reliability_title') || 'Reliability'}
            </Text>

            {/* Description Text */}
            <Text style={{ fontSize: 15, color: '#6B7280', lineHeight: 24, textAlign: 'center', marginBottom: 32 }}>
              {getText('reliability_desc') || 'Spam-like behavior (random or dishonest ratings) will lower your reliability score. Your reliability directly affects the reward money you earn from products. To keep it high, always provide honest and thoughtful ratings.'}
            </Text>

            {/* "Got it" Button */}
            <TouchableOpacity
              style={{
                backgroundColor: '#004D3B',
                width: '100%',
                paddingVertical: 18,
                borderRadius: 16,
                alignItems: 'center',
              }}
              onPress={() => setReliabilityInfoOpen(false)}
              activeOpacity={0.9}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700' }}>
                {getText('got_it') || 'Got it'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
