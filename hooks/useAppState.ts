// hooks/useAppState.ts
// Central app state hook — all useState, useEffect, and top-level computed values

import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../constants/api';
import { getRank } from '../constants/helpers';
import type { Lang, User, BonusCard, Notification as AppNotification } from '../types';
import { ProductItem } from '../components/ProductCard';
import { Order } from '../components/screens/HomeScreen';
import { loadOrdersFromApi, loadTopProductsFromApi } from './useOrders';
import { TranslationDict } from '../i18n/useTranslation';

export type ActiveTab = 'home' | 'products' | 'top10' | 'settings';
export type CurrentView = 'auth' | 'app';

interface UseAppStateProps {
  getText: (key: string) => string;
  t: TranslationDict;
  setLangState: (l: Lang) => void;
}

export function useAppState({ getText, t, setLangState }: UseAppStateProps) {
  const [currentView, setCurrentView] = useState<CurrentView>('auth');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [animateBalance, setAnimateBalance] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [topProducts, setTopProducts] = useState<ProductItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [loginForm, setLoginForm] = useState({ phone: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '', surname: '', phone: '', dateOfBirth: '', password: '',
  });

  const [showAllReceipts, setShowAllReceipts] = useState(false);
  const [instructionsModalOpen, setInstructionsModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [productDetailModalOpen, setProductDetailModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [cardsModalOpen, setCardsModalOpen] = useState(false);
  const [barcodeModalOpen, setBarcodeModalOpen] = useState(false);
  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(null);
  const selectedReceipt = useMemo(() => orders.find(o => o.fullId === selectedReceiptId) || null, [orders, selectedReceiptId]);

  const setSelectedReceipt = useCallback((order: Order | null) => {
    setSelectedReceiptId(order ? order.fullId : null);
  }, []);

  const [selectedProductDetail, setSelectedProductDetail] = useState<ProductItem | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [receiptFilters] = useState({ startDate: '', endDate: '' });
  const [receiptPagination, setReceiptPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const savedCards = [
    { id: 1, number: '**** **** **** 3826', type: 'visa' as const, bank: 'Kapital Bank' },
    { id: 2, number: '**** **** **** 1092', type: 'master' as const, bank: 'ABB' },
  ];

  function showToast(msg: string, type: string): void {
    setToast({ visible: true, message: msg, type });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 2000);
  }

  function setLang(l: Lang): void {
    setLangState(l);
    AsyncStorage.setItem('lang', l);
    setSelectedCategory('All');
  }

  const barcodeDigits = useMemo(() => {
    const card = (user?.bonusCard ?? user?.bonus_card) as BonusCard | undefined;
    const num = (card?.cardNumber ?? card?.card_number ?? user?.cardNumber ?? user?.bonusCardNumber ?? '') as string;
    return num.toString().replace(/\D/g, '');
  }, [user]);

  const notifications = useMemo<AppNotification[]>(
    () => [
      { id: 1, title: getText('notif_cashback_title'), msg: getText('notif_cashback_msg'), time: getText('time_2h'), type: 'reward' },
      { id: 2, title: getText('notif_new_prod_title'), msg: getText('notif_new_prod_msg'), time: getText('time_5h'), type: 'info' },
    ],
    [getText],
  );

  const loadUserData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);

      try {
        const response = await api.getUserProfile();
        const updatedUser = (response.data ?? response) as User;
        if (updatedUser) {
          const currentCard = user?.bonusCard ?? user?.bonus_card;
          if (currentCard && !updatedUser.bonusCard && !updatedUser.bonus_card) {
            updatedUser.bonusCard = currentCard;
          }
          setUser((prev) => ({ ...(prev ?? {}), ...updatedUser }));
          await AsyncStorage.setItem('oba_user', JSON.stringify(updatedUser));
        }
      } catch {
        logout();
        return;
      }

      try {
        const params: { page: number; limit: number; startDate?: string; endDate?: string } = {
          page: receiptPagination.page,
          limit: receiptPagination.limit,
        };
        if (receiptFilters.startDate) {
          const s = new Date(receiptFilters.startDate);
          s.setHours(0, 0, 0, 0);
          params.startDate = s.toISOString();
        }
        if (receiptFilters.endDate) {
          const e = new Date(receiptFilters.endDate);
          e.setHours(23, 59, 59, 999);
          params.endDate = e.toISOString();
        }

        const result = await loadOrdersFromApi(params, t);
        setReceiptPagination((prev) => ({ ...prev, totalPages: result.totalPages }));
        setOrders(result.orders);
        setProducts(result.products);
      } catch (e) {
        console.error('orders error', e);
        setOrders([]);
      }

      try {
        const profileResponse = await api.getUserProfile();
        const profileData = (profileResponse.data ?? profileResponse) as User;
        setUser((prev) => ({
          ...(prev ?? {}),
          name: profileData.name ?? 'Epsilon',
          surname: profileData.surname ?? 'User',
          phone: profileData.phone ?? '50 555 55 55',
          balance: parseFloat(String(profileData.bonusBalance ?? 0)),
          monthlyEarned: parseFloat(String(profileData.bonusBalance ?? 0)),
          rank: getRank(parseFloat(String(profileData.bonusBalance ?? 0))),
        }));
      } catch (e) {
        console.error('profile final', e);
      }
    } catch {
      showToast(getText('data_error'), 'error');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receiptPagination.page, receiptPagination.limit, receiptFilters, t]);

  async function loadTopProducts(): Promise<void> {
    try {
      if (!(await api.getToken())) return;
      const mapped = await loadTopProductsFromApi();
      setTopProducts(mapped);
    } catch (e) {
      console.error('loadTopProducts', e);
    }
  }

  async function loadProductDetail(product: ProductItem): Promise<void> {
    try {
      setLoading(true);
      try {
        const response = await api.getProduct(product.id);
        const data = (response.data ?? response) as Record<string, unknown>;
        const detailedProduct = {
          ...product,
          sku: data.sku as string | undefined,
          averageRating: parseFloat(String(data.averageRating ?? product.rating ?? 0)),
          ratingCount: (data.ratingCount as number | undefined) ?? product.reviews ?? 0,
          comments: (data.comments as Array<{ id: string; name: string; score: number; comment: string }> | undefined) ?? [],
        };
        setSelectedProductDetail(detailedProduct);
      } catch (e: any) {
        // Fallback for permissions error or offline
        console.log('Using local data for product detail due to API error:', e.message);
        const detailedProduct = {
          ...product,
          sku: undefined,
          name: product.name,
          averageRating: product.rating ?? 0,
          ratingCount: product.reviews ?? 0,
          comments: [
            {
              id: 'fallback_comment_1',
              name: 'Əziz',
              score: 4,
              comment: '' // No comment text visible in mockup, just stars and date
            }
          ],
        };
        setSelectedProductDetail(detailedProduct);
      }
      setProductDetailModalOpen(true);
    } catch (e) {
      console.error('loadProductDetail error:', e);
      showToast(getText('data_error'), 'error');
    } finally {
      setLoading(false);
    }
  }

  async function login(): Promise<void> {
    try {
      setLoading(true);
      const response = await api.login(loginForm.phone, loginForm.password);
      const respUser = response.user as User;
      setUser({
        name: respUser.name ?? 'Epsilon',
        surname: respUser.surname ?? 'User',
        phone: respUser.phone,
        balance: parseFloat(String(respUser.bonusBalance ?? 0)),
        monthlyEarned: parseFloat(String(respUser.bonusBalance ?? 0)),
        rank: getRank(parseFloat(String(respUser.bonusBalance ?? 0))),
      });
      await loadUserData();
      loadTopProducts();
      setCurrentView('app');
      showToast(getText('welcome'), 'success');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : getText('login_fail');
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }

  async function register(): Promise<void> {
    try {
      setLoading(true);
      if (!registerForm.name || !registerForm.surname) throw new Error(getText('val_name'));
      if (!registerForm.phone) throw new Error(getText('val_phone'));
      if (!registerForm.dateOfBirth) throw new Error(getText('val_dob'));
      if (!registerForm.password || registerForm.password.length < 6) throw new Error(getText('val_pass'));

      const response = await api.register(registerForm);
      const respUser = response.user as User;
      setUser({
        name: respUser.name ?? registerForm.name,
        surname: respUser.surname ?? registerForm.surname,
        phone: respUser.phone,
        balance: parseFloat(String(respUser.bonusBalance ?? 0)),
        monthlyEarned: 0,
        rank: 'Bronze',
      });
      await loadUserData();
      loadTopProducts();
      setCurrentView('app');
      showToast(getText('reg_success'), 'success');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : getText('reg_fail');
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }

  function logout(): void {
    api.clearToken();
    setUser(null);
    setProducts([]);
    setOrders([]);
    setCurrentView('auth');
    setAuthMode('login');
  }

  async function onRefresh(): Promise<void> {
    setRefreshing(true);
    try {
      if (await api.getToken()) {
        await Promise.all([loadUserData(), loadTopProducts()]);
        showToast(getText('updated'), 'success');
      }
    } finally {
      setRefreshing(false);
    }
  }

  // Init: restore session on mount
  useEffect(() => {
    (async () => {
      const savedLang = await AsyncStorage.getItem('lang');
      if (savedLang) setLangState(savedLang as Lang);
      const token = await api.getToken();
      const savedUser = await AsyncStorage.getItem('oba_user');
      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser) as User);
          await loadUserData();
          loadTopProducts();
          setCurrentView('app');
        } catch {
          api.clearToken();
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ITEMS_PER_PAGE = 20;
  const filteredProducts = useMemo(() => {
    const filtered = products.filter((p) => {
      const matchesCat = selectedCategory === 'All' || p.catKey === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
    return filtered.sort((a, b) => {
      const aU = a.rateable && !a.rated;
      const bU = b.rateable && !b.rated;
      if (aU && !bU) return -1;
      if (!aU && bU) return 1;
      if (aU && bU) return (b.rewardAmount ?? 0) - (a.rewardAmount ?? 0);
      const aR = a.rateable && a.rated;
      const bR = b.rateable && b.rated;
      if (aR && !bR) return -1;
      if (!aR && bR) return 1;
      if (aR && bR) return (b.rewardAmount ?? 0) - (a.rewardAmount ?? 0);
      return 0;
    });
  }, [products, selectedCategory, searchQuery]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  return {
    // View state
    currentView,
    authMode,
    setAuthMode,
    activeTab,
    setActiveTab,
    loading,
    setLoading,
    refreshing,
    animateBalance,
    setAnimateBalance,
    // User & data
    user,
    setUser,
    products,
    setProducts,
    topProducts,
    orders,
    setOrders,
    // Forms
    loginForm,
    setLoginForm,
    registerForm,
    setRegisterForm,
    // Modal state
    showAllReceipts,
    setShowAllReceipts,
    instructionsModalOpen,
    setInstructionsModalOpen,
    notificationsOpen,
    setNotificationsOpen,
    productDetailModalOpen,
    setProductDetailModalOpen,
    profileModalOpen,
    setProfileModalOpen,
    cardsModalOpen,
    setCardsModalOpen,
    barcodeModalOpen,
    setBarcodeModalOpen,
    selectedReceipt,
    setSelectedReceipt,
    selectedProductDetail,
    setSelectedProductDetail,
    // Filters & pagination
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    currentPage,
    setCurrentPage,
    receiptPagination,
    setReceiptPagination,
    notificationsEnabled,
    setNotificationsEnabled,
    toast,
    // Computed
    barcodeDigits,
    notifications,
    filteredProducts,
    paginatedProducts,
    totalPages,
    savedCards,
    // Actions
    showToast,
    setLang,
    login,
    register,
    logout,
    loadUserData,
    loadTopProducts,
    loadProductDetail,
    onRefresh,
  };
}
