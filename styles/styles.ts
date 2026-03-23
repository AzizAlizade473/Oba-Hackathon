// styles/styles.ts

import { StyleSheet, Dimensions, Platform } from 'react-native';
import { C } from '../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const s = StyleSheet.create({
  // Auth
  authContainer: { flex: 1, backgroundColor: '#fff' },
  authBgShape1: { position: 'absolute', top: -128, left: -128, width: 384, height: 384, backgroundColor: 'rgba(0,77,59,0.06)', borderRadius: 192 },
  authBgShape2: { position: 'absolute', bottom: -128, right: -128, width: 384, height: 384, backgroundColor: 'rgba(212,242,56,0.12)', borderRadius: 192 },
  logoBox: { width: 64, height: 64, backgroundColor: C.green, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 20, shadowColor: C.green, shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  logoText: { color: '#fff', fontWeight: '900', fontSize: 20, letterSpacing: 1 },
  authTitle: { fontSize: 32, fontWeight: '800', color: C.textPrimary, letterSpacing: -0.5, marginBottom: 6 },
  authSub: { color: C.textMuted, fontWeight: '500', fontSize: 16 },
  input: { backgroundColor: '#F9FAFB', borderRadius: 16, paddingHorizontal: 18, paddingVertical: 14, fontSize: 15, fontWeight: '500', color: C.textPrimary, marginTop: 12 },
  primaryBtn: { backgroundColor: C.green, borderRadius: 16, paddingVertical: 16, paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, shadowColor: C.green, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16 },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  switchAuthText: { textAlign: 'center', color: C.green, fontWeight: '700', marginTop: 12, fontSize: 13 },

  // App
  appContainer: { flex: 1, backgroundColor: C.gray },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: 'rgba(248,249,251,0.95)', borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  avatarBox: { width: 40, height: 40, backgroundColor: '#fff', borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  welcomeLabel: { fontSize: 10, color: C.textMuted, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  headerName: { fontSize: 17, fontWeight: '700', color: C.textPrimary },
  notifBtn: { width: 40, height: 40, backgroundColor: '#fff', borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  notifDot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, backgroundColor: C.lime, borderRadius: 4, borderWidth: 1.5, borderColor: '#fff' },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: C.textPrimary },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  // Wallet
  walletCard: { backgroundColor: C.green, borderRadius: 32, padding: 24, marginBottom: 4, aspectRatio: 1.7, overflow: 'hidden', justifyContent: 'space-between', shadowColor: C.green, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 30, elevation: 10 },
  walletBgShape1: { position: 'absolute', top: -64, right: -64, width: 256, height: 256, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 128 },
  walletBgShape2: { position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, backgroundColor: 'rgba(212,242,56,0.1)', borderRadius: 80 },
  walletLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  walletBalance: { color: '#fff', fontSize: 40, fontWeight: '800', letterSpacing: -1 },
  walletCurrency: { fontSize: 20, fontWeight: '500', color: 'rgba(255,255,255,0.8)' },
  activePill: { backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  activePillText: { fontSize: 9, fontWeight: '700', color: C.lime, textTransform: 'uppercase', letterSpacing: 0.5 },
  barcodeBtn: { width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  cardLastDigits: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', letterSpacing: 3, fontWeight: '500' },

  // Cards / Widgets
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 20, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 3, borderWidth: 1, borderColor: '#FAFAFA' },
  cardHighlight: { borderColor: C.lime, shadowColor: C.lime, shadowOpacity: 0.4, shadowRadius: 15, shadowOffset: { width: 0, height: 0 }, elevation: 5 },
  catIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  productName: { fontSize: 14, fontWeight: '700', color: C.textPrimary },
  productSub: { fontSize: 10, color: C.textMuted, fontWeight: '600', textTransform: 'uppercase', marginTop: 2 },
  productPrice: { fontSize: 15, fontWeight: '700', color: C.textPrimary },
  ratingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  editBtn: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  editBtnText: { fontSize: 10, fontWeight: '700', color: C.textMuted },
  rewardBadge: { backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  rewardBadgeText: { fontSize: 10, fontWeight: '700', color: C.green },
  floatingBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: C.lime, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4, zIndex: 10, borderWidth: 2, borderColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  floatingBadgeText: { fontSize: 10, fontWeight: '900', color: C.black },

  // Solved
  solvedIconBox: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center' },
  solvedTitle: { fontSize: 13, fontWeight: '700', color: C.textPrimary },
  solvedDesc: { fontSize: 12, color: C.textMuted, marginTop: 4, lineHeight: 18 },
  newBadge: { fontSize: 10, backgroundColor: '#F3F4F6', color: C.textMuted, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },

  // Widgets
  widgetCard: { borderRadius: 24, padding: 20, minHeight: 148, justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 3, borderWidth: 1, borderColor: '#FAFAFA', overflow: 'hidden' },
  widgetTitle: { fontSize: 18, fontWeight: '800', lineHeight: 22 },
  widgetSub: { fontSize: 10, color: C.textMuted, marginTop: 4, fontWeight: '700' },

  // Receipts
  allBtn: { backgroundColor: '#ECFDF5', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  allBtnText: { fontSize: 12, fontWeight: '700', color: C.green },
  emptyBox: { backgroundColor: '#fff', borderRadius: 24, padding: 32, alignItems: 'center', marginTop: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 10 },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: C.textPrimary, marginBottom: 4 },
  emptyDesc: { fontSize: 12, color: C.textMuted, textAlign: 'center' },
  receiptRow: { backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2, borderWidth: 1, borderColor: '#FAFAFA' },
  dateBadge: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  dateBadgeMonth: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase', color: C.textMuted },
  dateBadgeDay: { fontSize: 16, fontWeight: '700', color: C.textPrimary },
  receiptTitle: { fontSize: 14, fontWeight: '700', color: C.textPrimary },
  receiptSub: { fontSize: 12, color: C.textMuted, marginTop: 2 },
  receiptAmount: { fontSize: 15, fontWeight: '700', color: C.textPrimary },
  statusBadge: { fontSize: 10, fontWeight: '700', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, overflow: 'hidden', marginTop: 4 },
  statusRated: { backgroundColor: '#ECFDF5', color: '#059669' },
  statusPending: { backgroundColor: '#FFF7ED', color: '#EA580C' },

  // Search
  searchInput: { backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, fontSize: 14, fontWeight: '500', color: C.textPrimary, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8 },
  catBtn: { backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, marginRight: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4 },
  catBtnActive: { backgroundColor: C.black },
  catBtnText: { fontSize: 12, fontWeight: '700', color: C.textSecondary },

  // Pagination
  pageBtn: { width: 40, height: 40, backgroundColor: '#fff', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginHorizontal: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4 },
  pageBtnText: { fontSize: 14, fontWeight: '700', color: C.textSecondary },

  // Settings
  settingsAvatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#fff', shadowColor: C.green, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12 },
  settingsCard: { backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8 },
  settingsRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
  settingsRowText: { fontSize: 14, fontWeight: '700', color: C.textSecondary },
  toggle: { width: 44, height: 26, borderRadius: 13, position: 'relative' },
  toggleThumb: { position: 'absolute', width: 18, height: 18, backgroundColor: '#fff', borderRadius: 9, top: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.15, shadowRadius: 2 },
  langBtn: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginLeft: 4, backgroundColor: '#F3F4F6' },
  langBtnText: { fontSize: 10, fontWeight: '700', color: C.textMuted },
  logoutBtn: { marginTop: 16, backgroundColor: '#fff', borderRadius: 16, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: '#FEE2E2' },
  logoutBtnText: { color: C.red, fontWeight: '700', fontSize: 16 },

  // NavBar
  navBar: { position: 'absolute', bottom: 24, alignSelf: 'center', width: '90%', backgroundColor: C.black, borderRadius: 32, paddingHorizontal: 28, paddingVertical: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.4, shadowRadius: 30, elevation: 16 },
  navQR: { width: 64, height: 64, backgroundColor: C.green, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginTop: -40, borderWidth: 4, borderColor: '#FAFAFA', shadowColor: C.green, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.4, shadowRadius: 20 },

  // Modals
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(26,26,26,0.55)' },
  bottomSheet: { flex: 1, justifyContent: 'flex-end' },
  bottomSheetContent: { backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, maxHeight: '80%', shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 20 },
  sheetHandle: { width: 48, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  centeredModal: { flex: 1, justifyContent: 'center', padding: 24 },
  centeredModalContent: { backgroundColor: '#fff', borderRadius: 32, padding: 28, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 30 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: 'rgba(255,255,255,0.9)', borderBottomWidth: 1, borderBottomColor: C.border },
  modalTitle: { fontSize: 20, fontWeight: '700', color: C.textPrimary },
  closeBtn: { width: 36, height: 36, backgroundColor: '#F3F4F6', borderRadius: 18, alignItems: 'center', justifyContent: 'center' },

  // Notifications
  notifPanel: { width: SCREEN_WIDTH * 0.78, backgroundColor: '#fff', height: '100%', padding: 24, shadowColor: '#000', shadowOffset: { width: -4, height: 0 }, shadowOpacity: 0.1, shadowRadius: 16 },
  notifItem: { flexDirection: 'row', backgroundColor: '#F9FAFB', borderRadius: 16, padding: 14, marginBottom: 12, gap: 12 },
  notifDotBig: { width: 8, height: 8, borderRadius: 4, marginTop: 4 },

  // Feedback
  feedbackOption: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 2, borderColor: C.border, marginRight: 8, marginBottom: 8 },
  textArea: { backgroundColor: '#F9FAFB', borderRadius: 16, padding: 14, fontSize: 14, fontWeight: '500', color: C.textPrimary, minHeight: 80, textAlignVertical: 'top' },

  // Instructions
  stepNum: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },

  // Secondary button
  secondaryBtn: { backgroundColor: '#F3F4F6', borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  secondaryBtnText: { color: C.textSecondary, fontWeight: '700', fontSize: 15 },

  // Cards modal
  addCardBtn: { borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#D1D5DB', borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 8 },

  // Barcode
  barcodeColumn: { width: 100, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 8, borderRightWidth: 2, borderRightColor: '#F3F4F6' },
  barcodeBox: { width: 60, height: 200, flexDirection: 'row', alignItems: 'stretch' },
  barcodeDigitText: { fontSize: 8, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', marginTop: 8, color: C.textSecondary, textAlign: 'center' },
  barcodeHeader: { backgroundColor: C.green, padding: 16, paddingTop: 20 },
  barcodeClose: { position: 'absolute', top: 10, right: 10, width: 32, height: 32, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  barcodeOBA: { color: '#fff', fontWeight: '900', fontSize: 22, letterSpacing: -0.5 },
  barcodeAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' },
  barcodeBalance: { backgroundColor: `${C.green}0D`, borderRadius: 16, padding: 12, borderWidth: 1.5, borderColor: `${C.green}33`, flexDirection: 'row', alignItems: 'center', marginTop: 'auto' },
  barcodeFooter: { flexDirection: 'row', alignItems: 'center', padding: 14, backgroundColor: '#F9FAFB', borderTopWidth: 2, borderTopColor: '#F3F4F6' },

  // Loading & Toast
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.8)', alignItems: 'center', justifyContent: 'center', zIndex: 200 },
  toast: { position: 'absolute', top: 50, alignSelf: 'center', backgroundColor: 'rgba(26,26,26,0.9)', borderRadius: 30, paddingHorizontal: 20, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', zIndex: 300, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12 },
  toastIcon: { color: C.lime, marginRight: 8, fontSize: 16 },
  toastText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
