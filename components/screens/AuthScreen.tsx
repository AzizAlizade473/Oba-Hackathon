// components/screens/AuthScreen.tsx
// Pixel-perfect match to index.html auth section

import React from 'react';
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
  return (
    <SafeAreaView style={s.authContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* bg-brand-green/[0.06] w-96 h-96 rounded-full absolute -top-32 -left-32 */}
        <View style={s.authBgShape1} />
        {/* bg-brand-lime/[0.12] w-96 h-96 rounded-full absolute -bottom-32 -right-32 */}
        <View style={s.authBgShape2} />
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', padding: 32 }}>
          {/* Logo */}
          <View style={{ marginTop: 40 }}>
            {/* w-16 h-16 bg-brand-green rounded-2xl shadow-xl shadow-brand-green/30 */}
            <View style={s.logoBox}>
              {/* text-xl font-black tracking-wide text-white */}
              <Text style={s.logoText}>OBA</Text>
            </View>
            {/* text-[32px] font-extrabold text-gray-900 tracking-tight */}
            <Text style={s.authTitle}>{getText('welcome_title')}</Text>
            {/* text-gray-400 font-medium text-base */}
            <Text style={s.authSub}>{getText('welcome_sub')}</Text>
          </View>

          {/* Login */}
          {authMode === 'login' && (
            <View style={{ marginBottom: 40 }}>
              {/* bg-gray-50 rounded-2xl px-5 py-4 text-sm font-medium text-gray-900 */}
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
              {/* bg-brand-green text-white font-bold rounded-2xl py-4 px-6 shadow-xl shadow-brand-green/25 */}
              <TouchableOpacity style={s.primaryBtn} onPress={onLogin} disabled={loading}>
                <Text style={s.primaryBtnText}>{getText('login_btn')}</Text>
                {/* fas fa-arrow-right text-white */}
                <FontAwesome5 name="arrow-right" size={16} color="#FFFFFF" />
              </TouchableOpacity>
              {/* text-brand-green font-bold text-sm */}
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
              <TextInput
                style={[s.input, { marginTop: 12 }]}
                placeholder="Date of Birth (YYYY-MM-DD)"
                placeholderTextColor="#9CA3AF"
                value={registerForm.dateOfBirth}
                onChangeText={(v) => setRegisterForm((p) => ({ ...p, dateOfBirth: v }))}
              />
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
