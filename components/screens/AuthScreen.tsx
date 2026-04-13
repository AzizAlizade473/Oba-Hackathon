// components/screens/AuthScreen.tsx

import React, { useState, useRef } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StyleSheet,
  Modal,
  FlatList,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';

interface LoginForm {
  phone: string;
  password: string;
}

interface RegisterForm {
  name: string;
  surname: string;
  phone: string;
  dateOfBirth: string;
  password: string;
}

interface AuthScreenProps {
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;
  loginForm: LoginForm;
  setLoginForm: React.Dispatch<React.SetStateAction<LoginForm>>;
  registerForm: RegisterForm;
  setRegisterForm: React.Dispatch<React.SetStateAction<RegisterForm>>;
  onLogin: () => void;
  onRegister: () => void;
  loading: boolean;
  getText: (key: string) => string;
}

// ── Drum Picker Column ──────────────────────────────────────────────────────
const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;

function DrumColumn({ data, selectedIndex, onSelect }: { data: string[]; selectedIndex: number; onSelect: (idx: number) => void }) {
  const flatListRef = useRef<FlatList>(null);

  const onMomentumScrollEnd = (e: any) => {
    const idx = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    if (idx >= 0 && idx < data.length) {
      onSelect(idx);
    }
  };

  return (
    <View style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS, flex: 1, overflow: 'hidden' }}>
      {/* Highlight band for selected row */}
      <View style={{
        position: 'absolute', top: ITEM_HEIGHT * 2, left: 4, right: 4,
        height: ITEM_HEIGHT, backgroundColor: 'rgba(0,77,59,0.08)', borderRadius: 12, zIndex: 0,
      }} />
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(_, i) => i.toString()}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={onMomentumScrollEnd}
        contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
        getItemLayout={(_, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
        initialScrollIndex={selectedIndex}
        renderItem={({ item, index }) => {
          const isSelected = index === selectedIndex;
          return (
            <TouchableOpacity
              onPress={() => {
                onSelect(index);
                flatListRef.current?.scrollToIndex({ index, animated: true });
              }}
              style={{ height: ITEM_HEIGHT, justifyContent: 'center', alignItems: 'center' }}
            >
              <Text style={{
                fontSize: isSelected ? 20 : 15,
                fontWeight: isSelected ? '700' : '400',
                color: isSelected ? '#004D3B' : '#9CA3AF',
              }}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const MONTHS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 80 }, (_, i) => String(currentYear - i));

export function AuthScreen({
  authMode,
  setAuthMode,
  loginForm,
  setLoginForm,
  registerForm,
  setRegisterForm,
  onLogin,
  onRegister,
  loading,
  getText,
}: AuthScreenProps) {
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  // Parse existing date or use defaults
  const parts = registerForm.dateOfBirth?.split('-') || [];
  const [selYear, setSelYear] = useState(() => {
    const yi = YEARS.indexOf(parts[0] || '2000');
    return yi >= 0 ? yi : YEARS.indexOf('2000');
  });
  const [selMonth, setSelMonth] = useState(() => {
    const mi = MONTHS.indexOf(parts[1] || '01');
    return mi >= 0 ? mi : 0;
  });
  const [selDay, setSelDay] = useState(() => {
    const di = DAYS.indexOf(parts[2] || '01');
    return di >= 0 ? di : 0;
  });

  const confirmDate = () => {
    const dateStr = `${YEARS[selYear]}-${MONTHS[selMonth]}-${DAYS[selDay]}`;
    setRegisterForm((p) => ({ ...p, dateOfBirth: dateStr }));
    setDatePickerOpen(false);
  };

  return (
    <SafeAreaView style={s.authContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={s.authBgShape1} />
        <View style={s.authBgShape2} />
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', padding: 32 }}>
          {/* Logo */}
          <View style={{ marginTop: 40 }}>
            <View style={s.logoBox}>
              <Text style={s.logoText}>OBA</Text>
            </View>
            <Text style={s.authTitle}>{getText('welcome_title')}</Text>
            <Text style={s.authSub}>{getText('welcome_sub')}</Text>
          </View>

          {/* Login */}
          {authMode === 'login' && (
            <View style={{ marginBottom: 40 }}>
              <TextInput
                style={s.input}
                placeholder={getText('phone_placeholder')}
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                value={loginForm.phone}
                onChangeText={(v) => setLoginForm((p) => ({ ...p, phone: v }))}
              />
              <TextInput
                style={[s.input, { marginTop: 12 }]}
                placeholder={getText('password_placeholder')}
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                value={loginForm.password}
                onChangeText={(v) => setLoginForm((p) => ({ ...p, password: v }))}
              />
              <TouchableOpacity style={s.primaryBtn} onPress={onLogin} disabled={loading}>
                <Text style={s.primaryBtnText}>{getText('login_btn')}</Text>
                <FontAwesome5 name="arrow-right" size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setAuthMode('register')}>
                <Text style={s.switchAuthText}>{getText('no_account')}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Register */}
          {authMode === 'register' && (
            <View style={{ marginBottom: 40 }}>
              <TextInput
                style={s.input}
                placeholder={getText('name_placeholder')}
                placeholderTextColor="#9CA3AF"
                value={registerForm.name}
                onChangeText={(v) => setRegisterForm((p) => ({ ...p, name: v }))}
              />
              <TextInput
                style={[s.input, { marginTop: 12 }]}
                placeholder={getText('surname_placeholder')}
                placeholderTextColor="#9CA3AF"
                value={registerForm.surname}
                onChangeText={(v) => setRegisterForm((p) => ({ ...p, surname: v }))}
              />
              <TextInput
                style={[s.input, { marginTop: 12 }]}
                placeholder={getText('phone_placeholder')}
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                value={registerForm.phone}
                onChangeText={(v) => setRegisterForm((p) => ({ ...p, phone: v }))}
              />
              {/* Date of Birth — Tap to open drum picker */}
              <TouchableOpacity
                style={[s.input, { marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
                onPress={() => setDatePickerOpen(true)}
                activeOpacity={0.7}
              >
                <Text style={{ color: registerForm.dateOfBirth ? '#111827' : '#9CA3AF', fontSize: 15, fontWeight: '500' }}>
                  {registerForm.dateOfBirth || 'Date of Birth'}
                </Text>
                <FontAwesome5 name="calendar-alt" size={16} color="#9CA3AF" />
              </TouchableOpacity>
              <TextInput
                style={[s.input, { marginTop: 12 }]}
                placeholder={getText('password_placeholder')}
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                value={registerForm.password}
                onChangeText={(v) => setRegisterForm((p) => ({ ...p, password: v }))}
              />
              <TouchableOpacity style={s.primaryBtn} onPress={onRegister} disabled={loading}>
                <Text style={s.primaryBtnText}>{getText('register_btn')}</Text>
                <FontAwesome5 name="arrow-right" size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setAuthMode('login')}>
                <Text style={s.switchAuthText}>{getText('has_account')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      {loading && (
        <View style={s.loadingOverlay}>
          <ActivityIndicator size="large" color="#004D3B" />
        </View>
      )}

      {/* ── Date Picker Modal ──────────────────────────────────────────────── */}
      <Modal visible={datePickerOpen} transparent animationType="fade" onRequestClose={() => setDatePickerOpen(false)}>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={() => setDatePickerOpen(false)}
          >
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }} />
          </TouchableOpacity>
          <View style={{
            backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28,
            paddingTop: 16, paddingBottom: 32, paddingHorizontal: 20,
            shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 20,
          }}>
            {/* Handle */}
            <View style={{ width: 48, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2, alignSelf: 'center', marginBottom: 16 }} />
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 16 }}>
              Date of Birth
            </Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <DrumColumn data={DAYS} selectedIndex={selDay} onSelect={setSelDay} />
              <DrumColumn data={MONTH_LABELS} selectedIndex={selMonth} onSelect={setSelMonth} />
              <DrumColumn data={YEARS} selectedIndex={selYear} onSelect={setSelYear} />
            </View>
            <TouchableOpacity
              style={{ backgroundColor: '#004D3B', borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 20 }}
              onPress={confirmDate}
              activeOpacity={0.9}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  // flex: 1, bg-white
  authContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // bg-brand-green/[0.06] w-96 h-96 rounded-full absolute -top-32 -left-32
  authBgShape1: {
    position: 'absolute',
    top: -128,
    left: -128,
    width: 384,
    height: 384,
    backgroundColor: 'rgba(0, 77, 59, 0.06)',
    borderRadius: 192,
  },
  // bg-brand-lime/[0.12] w-96 h-96 rounded-full absolute -bottom-32 -right-32
  authBgShape2: {
    position: 'absolute',
    bottom: -128,
    right: -128,
    width: 384,
    height: 384,
    backgroundColor: 'rgba(212, 242, 56, 0.12)',
    borderRadius: 192,
  },
  // w-16 h-16 bg-brand-green rounded-2xl shadow-xl shadow-brand-green/30
  logoBox: {
    width: 64,
    height: 64,
    backgroundColor: '#004D3B',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#004D3B',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  // text-xl font-black tracking-wide text-white
  logoText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 20,
    letterSpacing: 1,
  },
  // text-[32px] font-extrabold text-gray-900 tracking-tight
  authTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  // text-gray-400 font-medium text-base
  authSub: {
    color: '#9CA3AF',
    fontWeight: '500',
    fontSize: 16,
  },
  // bg-gray-50 rounded-2xl px-5 py-4 text-sm font-medium text-gray-900
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    marginTop: 12,
  },
  // bg-brand-green text-white font-bold rounded-2xl py-4 px-6 shadow-xl shadow-brand-green/25
  primaryBtn: {
    backgroundColor: '#004D3B',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#004D3B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  // text-white font-bold
  primaryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  // text-brand-green font-bold text-sm text-center mt-3
  switchAuthText: {
    textAlign: 'center',
    color: '#004D3B',
    fontWeight: '700',
    marginTop: 12,
    fontSize: 13,
  },
  // loading overlay
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
  },
});
