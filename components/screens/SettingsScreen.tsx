// components/screens/SettingsScreen.tsx
// Every icon, color, spacing maps 1:1 to index.html Tailwind classes

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import type { Lang, SavedCard, User } from '../../types';

// ─── Exact colors from tailwind.config in index.html ─────────────────────────
const C = {
  brandBlack: '#1A1A1A',
  brandGreen: '#004D3B',
  brandSurface: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray900: '#111827',
  blue50: '#EFF6FF',
  blue600: '#2563EB',
  blue900: '#1E3A5F',
  green50: '#F0FDF4',
  green600: '#16A34A',
  purple50: '#FAF5FF',
  purple600: '#9333EA',
  red100: '#FEE2E2',
  red500: '#EF4444',
};

// ─── Props ────────────────────────────────────────────────────────────────────
interface SettingsScreenProps {
  user: User | null;
  lang: Lang;
  notificationsEnabled: boolean;
  profileModalOpen: boolean;
  cardsModalOpen: boolean;
  savedCards: SavedCard[];
  getText: (key: string) => string;
  onToggleNotifications: () => void;
  onLangChange: (l: Lang) => void;
  onLogout: () => void;
  onProfileModalOpen: (open: boolean) => void;
  onCardsModalOpen: (open: boolean) => void;
  onUserChange: (updater: (prev: User | null) => User) => void;
  showToast: (msg: string, type: string) => void;
}

// ─── animate-enter: opacity 0→1, translateY 10→0, scale 0.98→1 ───────────────
function useEnterAnimation(trigger: boolean) {
  const translateY = useRef(new Animated.Value(10)).current;
  const scale = useRef(new Animated.Value(0.98)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (trigger) {
      translateY.setValue(10);
      scale.setValue(0.98);
      opacity.setValue(0);
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, damping: 20, stiffness: 300 }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, damping: 20, stiffness: 300 }),
        Animated.timing(opacity, { toValue: 1, useNativeDriver: true, duration: 180 }),
      ]).start();
    }
  }, [trigger]);

  return { translateY, scale, opacity };
}

// ─── SettingsScreen ───────────────────────────────────────────────────────────
export function SettingsScreen({
  user, lang, notificationsEnabled,
  profileModalOpen, cardsModalOpen, savedCards,
  getText, onToggleNotifications, onLangChange, onLogout,
  onProfileModalOpen, onCardsModalOpen, onUserChange, showToast,
}: SettingsScreenProps) {

  const [editName, setEditName] = useState(user?.name ?? '');
  const [editSurname, setEditSurname] = useState(user?.surname ?? '');
  const [editPhone, setEditPhone] = useState(user?.phone ?? '');

  useEffect(() => {
    setEditName(user?.name ?? '');
    setEditSurname(user?.surname ?? '');
    setEditPhone(user?.phone ?? '');
  }, [user?.name, user?.surname, user?.phone]);

  const enter = useEnterAnimation(true);

  return (
    <Animated.View style={[s.container, { opacity: enter.opacity, transform: [{ translateY: enter.translateY }, { scale: enter.scale }] }]}>

      {/* ── Avatar ── text-center py-6 ──────────────────────────────────────
          w-24 h-24 bg-brand-green rounded-full border-4 border-white shadow-xl mb-4
          text-2xl font-bold text-gray-900
      ─────────────────────────────────────────────────────────────────────── */}
      <View style={s.avatarSection}>
        <View style={s.avatar}>
          <Text style={s.avatarText}>{user?.name?.charAt(0) ?? 'E'}</Text>
        </View>
        <Text style={s.userName}>{user?.name ?? 'Epsilon'} {user?.surname ?? 'User'}</Text>
      </View>

      {/* ── Settings card ───────────────────────────────────────────────────
          bg-white rounded-3xl shadow-soft border border-gray-50 overflow-hidden divide-y divide-gray-50
      ─────────────────────────────────────────────────────────────────────── */}
      <View style={s.settingsCard}>

        {/* ── Row 1: Personal info ──────────────────────────────────────────
            Icon: fas fa-user-pen / bg-blue-50 / text-blue-600
            Chevron: fas fa-chevron-right / text-gray-300 / text-xs
        ─────────────────────────────────────────────────────────────────── */}
        <TouchableOpacity style={s.row} onPress={() => onProfileModalOpen(true)} activeOpacity={0.7}>
          <View style={s.rowLeft}>
            <View style={[s.iconBox, { backgroundColor: C.blue50 }]}>
              <FontAwesome6 name="user-pen" size={16} color={C.blue600} />
            </View>
            <Text style={s.rowLabel}>{getText('settings_personal')}</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={12} color={C.gray300} />
        </TouchableOpacity>

        <View style={s.divider} />

        {/* ── Row 2: Cards ──────────────────────────────────────────────────
            Icon: fas fa-wallet / bg-green-50 / text-green-600
        ─────────────────────────────────────────────────────────────────── */}
        <TouchableOpacity style={s.row} onPress={() => onCardsModalOpen(true)} activeOpacity={0.7}>
          <View style={s.rowLeft}>
            <View style={[s.iconBox, { backgroundColor: C.green50 }]}>
              <FontAwesome5 name="wallet" size={16} color={C.green600} />
            </View>
            <Text style={s.rowLabel}>{getText('settings_cards')}</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={12} color={C.gray300} />
        </TouchableOpacity>

        <View style={s.divider} />

        {/* ── Row 3: Notifications ──────────────────────────────────────────
            Icon: fas fa-bell / bg-purple-50 / text-purple-600
            Toggle: w-10 h-6 rounded-full
                    bg-brand-green (on) / bg-gray-300 (off)
                    Thumb w-4 h-4: right-1 (on) / left-1 (off)
        ─────────────────────────────────────────────────────────────────── */}
        <View style={s.row}>
          <View style={s.rowLeft}>
            <View style={[s.iconBox, { backgroundColor: C.purple50 }]}>
              <FontAwesome5 name="bell" size={16} color={C.purple600} />
            </View>
            <Text style={s.rowLabel}>{getText('settings_notif')}</Text>
          </View>
          <TouchableOpacity
            style={[s.toggle, { backgroundColor: notificationsEnabled ? C.brandGreen : C.gray300 }]}
            onPress={onToggleNotifications}
            activeOpacity={0.8}
          >
            <View style={[s.toggleThumb, notificationsEnabled ? s.thumbOn : s.thumbOff]} />
          </TouchableOpacity>
        </View>

        <View style={s.divider} />

        {/* ── Row 4: Language ───────────────────────────────────────────────
            Icon: fas fa-globe / bg-gray-100 / text-gray-600
            Buttons: text-[10px] font-bold px-2 py-1 rounded
                     active: bg-brand-green text-white
                     inactive: bg-gray-100 text-gray-400
        ─────────────────────────────────────────────────────────────────── */}
        <View style={s.row}>
          <View style={s.rowLeft}>
            <View style={[s.iconBox, { backgroundColor: C.gray100 }]}>
              <FontAwesome5 name="globe" size={16} color={C.gray600} />
            </View>
            <Text style={s.rowLabel}>{getText('settings_lang')}</Text>
          </View>
          <View style={s.langRow}>
            {(['az', 'en', 'ru'] as Lang[]).map((l) => (
              <TouchableOpacity
                key={l}
                style={[s.langBtn, { backgroundColor: lang === l ? C.brandGreen : C.gray100 }]}
                onPress={() => onLangChange(l)}
                activeOpacity={0.7}
              >
                <Text style={[s.langBtnText, { color: lang === l ? '#fff' : C.gray400 }]}>
                  {l.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </View>

      {/* ── Logout ──────────────────────────────────────────────────────────
          w-full bg-white border border-red-100 text-red-500 font-bold py-4 rounded-2xl shadow-sm
      ─────────────────────────────────────────────────────────────────────── */}
      <TouchableOpacity style={s.logoutBtn} onPress={onLogout} activeOpacity={0.8}>
        <Text style={s.logoutText}>{getText('logout')}</Text>
      </TouchableOpacity>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      <ProfileModal
        visible={profileModalOpen}
        editName={editName} editSurname={editSurname} editPhone={editPhone}
        setEditName={setEditName} setEditSurname={setEditSurname} setEditPhone={setEditPhone}
        getText={getText}
        onClose={() => onProfileModalOpen(false)}
        onSave={() => {
          onUserChange((prev) => ({ ...(prev ?? {}), name: editName, surname: editSurname, phone: editPhone }));
          onProfileModalOpen(false);
          showToast('Məlumatlar yeniləndi', 'success');
        }}
      />
      <CardsModal
        visible={cardsModalOpen}
        savedCards={savedCards}
        getText={getText}
        onClose={() => onCardsModalOpen(false)}
      />
    </Animated.View>
  );
}

// ─── Profile Modal ────────────────────────────────────────────────────────────
interface ProfileModalProps {
  visible: boolean;
  editName: string; editSurname: string; editPhone: string;
  setEditName: (v: string) => void; setEditSurname: (v: string) => void; setEditPhone: (v: string) => void;
  getText: (key: string) => string;
  onClose: () => void; onSave: () => void;
}

function ProfileModal({ visible, editName, editSurname, editPhone, setEditName, setEditSurname, setEditPhone, getText, onClose, onSave }: ProfileModalProps) {
  const anim = useEnterAnimation(visible);
  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <KeyboardAvoidingView style={m.overlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableOpacity style={StyleSheet.absoluteFillObject} activeOpacity={1} onPress={onClose}>
          <View style={m.backdrop} />
        </TouchableOpacity>
        <Animated.View style={[m.card, { opacity: anim.opacity, transform: [{ translateY: anim.translateY }, { scale: anim.scale }] }]}>
          <Text style={m.title}>{getText('settings_personal')}</Text>
          <View style={m.inputGroup}>
            <TextInput style={m.input} value={editName} onChangeText={setEditName} placeholder="Ad" placeholderTextColor={C.gray400} />
            <TextInput style={m.input} value={editSurname} onChangeText={setEditSurname} placeholder="Soyad" placeholderTextColor={C.gray400} />
            <TextInput style={m.input} value={editPhone} onChangeText={setEditPhone} placeholder="Telefon" placeholderTextColor={C.gray400} keyboardType="phone-pad" />
          </View>
          <View style={m.btnRow}>
            <TouchableOpacity style={[m.btn, m.cancelBtn]} onPress={onClose} activeOpacity={0.8}>
              <Text style={m.cancelText}>{getText('cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[m.btn, m.saveBtn]} onPress={onSave} activeOpacity={0.8}>
              <Text style={m.saveText}>{getText('save')}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Cards Modal ──────────────────────────────────────────────────────────────
interface CardsModalProps {
  visible: boolean; savedCards: SavedCard[];
  getText: (key: string) => string; onClose: () => void;
}

function CardsModal({ visible, savedCards, getText, onClose }: CardsModalProps) {
  const anim = useEnterAnimation(visible);
  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <View style={m.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFillObject} activeOpacity={1} onPress={onClose}>
          <View style={m.backdrop} />
        </TouchableOpacity>
        <Animated.View style={[m.card, { opacity: anim.opacity, transform: [{ translateY: anim.translateY }, { scale: anim.scale }] }]}>
          <Text style={m.title}>{getText('settings_cards')}</Text>
          <View style={m.inputGroup}>
            {savedCards.map((card) => (
              <View key={card.id} style={cm.cardRow}>
                <View style={cm.cardLeft}>
                  {/* fab fa-cc-visa text-2xl text-blue-900
                      fab fa-cc-mastercard text-2xl text-red-500 */}
                  <FontAwesome5
                    name={card.type === 'visa' ? 'cc-visa' : 'cc-mastercard'}
                    size={28}
                    color={card.type === 'visa' ? C.blue900 : C.red500}
                  />
                  <View>
                    <Text style={cm.cardBank}>{card.bank}</Text>
                    <Text style={cm.cardNumber}>{card.number}</Text>
                  </View>
                </View>
              </View>
            ))}
            {/* p-4 border border-dashed border-gray-300 rounded-2xl flex justify-center */}
            <TouchableOpacity style={cm.addCardRow} activeOpacity={0.7}>
              <FontAwesome5 name="plus" size={12} color={C.gray400} style={{ marginRight: 8 }} />
              <Text style={cm.addCardText}>Kart Əlavə Et</Text>
            </TouchableOpacity>
          </View>
          {/* mt-6 w-full bg-brand-black text-white font-bold py-3 rounded-xl */}
          <TouchableOpacity style={cm.closeBtn} onPress={onClose} activeOpacity={0.8}>
            <Text style={cm.closeBtnText}>{getText('save')}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { gap: 24 },
  avatarSection: { alignItems: 'center', paddingVertical: 24 },
  avatar: {
    width: 96, height: 96, backgroundColor: C.brandGreen,
    borderRadius: 48, alignItems: 'center', justifyContent: 'center',
    marginBottom: 16, borderWidth: 4, borderColor: '#FFFFFF',
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25, shadowRadius: 20, elevation: 12,
  },
  avatarText: { fontSize: 36, color: '#FFFFFF', fontWeight: '700' },
  userName: { fontSize: 24, fontWeight: '700', color: C.gray900 },
  settingsCard: {
    backgroundColor: '#FFFFFF', borderRadius: 24,
    borderWidth: 1, borderColor: '#F9FAFB', overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05, shadowRadius: 20, elevation: 3,
  },
  row: { padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  iconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { fontSize: 14, fontWeight: '700', color: C.gray700 },
  divider: { height: 1, backgroundColor: '#F9FAFB' },
  toggle: { width: 40, height: 24, borderRadius: 12, justifyContent: 'center' },
  toggleThumb: {
    width: 16, height: 16, backgroundColor: '#FFFFFF', borderRadius: 8,
    position: 'absolute', top: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15, shadowRadius: 2, elevation: 2,
  },
  thumbOn: { right: 4 },
  thumbOff: { left: 4 },
  langRow: { flexDirection: 'row', gap: 4 },
  langBtn: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  langBtnText: { fontSize: 10, fontWeight: '700' },
  logoutBtn: {
    width: '100%', backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: C.red100,
    paddingVertical: 16, borderRadius: 16, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
  },
  logoutText: { color: C.red500, fontWeight: '700', fontSize: 14 },
});

const m = StyleSheet.create({
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(26, 26, 26, 0.6)' },
  card: {
    backgroundColor: '#FFFFFF', width: '100%', maxWidth: 384,
    borderRadius: 32, padding: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 20, elevation: 8,
  },
  title: { fontSize: 20, fontWeight: '700', color: C.brandBlack, marginBottom: 16 },
  inputGroup: { gap: 12 },
  input: {
    backgroundColor: C.gray50, borderWidth: 0, borderRadius: 12,
    padding: 12, fontSize: 14, fontWeight: '700', color: C.brandBlack,
  },
  btnRow: { flexDirection: 'row', gap: 12, marginTop: 24 },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cancelBtn: { backgroundColor: C.gray100 },
  saveBtn: { backgroundColor: C.brandGreen },
  cancelText: { color: C.gray500, fontWeight: '700', fontSize: 14 },
  saveText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
});

const cm = StyleSheet.create({
  cardRow: {
    padding: 16, borderWidth: 1, borderColor: C.gray100,
    borderRadius: 16, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: C.gray50,
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardBank: { fontWeight: '700', fontSize: 14, color: C.brandBlack },
  cardNumber: { fontSize: 12, color: C.gray400 },
  addCardRow: {
    padding: 16, borderWidth: 1, borderStyle: 'dashed',
    borderColor: C.gray300, borderRadius: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  addCardText: { fontSize: 14, fontWeight: '700', color: C.gray400 },
  closeBtn: {
    marginTop: 24, width: '100%', backgroundColor: C.brandBlack,
    paddingVertical: 12, borderRadius: 12, alignItems: 'center',
  },
  closeBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
});