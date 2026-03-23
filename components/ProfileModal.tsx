// components/ProfileModal.tsx

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

interface User {
  name?: string;
  surname?: string;
  phone?: string;
}

interface ProfileModalProps {
  visible: boolean;
  user: User;
  onClose: () => void;
  onSave: (updated: User) => void;
  showToast?: (message: string, type: string) => void;
  getText: (key: string) => string;
}

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

export default function ProfileModal({
  visible,
  user,
  onClose,
  onSave,
  showToast,
  getText,
}: ProfileModalProps) {
  const [name, setName] = useState(user.name ?? '');
  const [surname, setSurname] = useState(user.surname ?? '');
  const [phone, setPhone] = useState(user.phone ?? '');

  useEffect(() => {
    setName(user.name ?? '');
    setSurname(user.surname ?? '');
    setPhone(user.phone ?? '');
  }, [user.name, user.surname, user.phone]);

  const { translateY, scale, opacity } = useEnterAnimation(visible);

  const handleSave = () => {
    onSave({ name, surname, phone });
    onClose();
    showToast?.('Məlumatlar yeniləndi', 'success');
  };

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
      {/* fixed inset-0 z-[70] flex items-center justify-center p-6 */}
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* absolute inset-0 bg-brand-black/60 backdrop-blur-sm */}
        <TouchableOpacity
          style={StyleSheet.absoluteFillObject}
          activeOpacity={1}
          onPress={onClose}
        >
          <View style={styles.backdrop} />
        </TouchableOpacity>

        {/* bg-white w-full max-w-sm rounded-[32px] p-6 relative z-10 animate-enter */}
        <Animated.View
          style={[
            styles.card,
            { opacity, transform: [{ translateY }, { scale }] },
          ]}
        >
          {/* text-xl font-bold mb-4 */}
          <Text style={styles.title}>{getText('settings_personal')}</Text>

          {/* space-y-3 */}
          <View style={styles.inputGroup}>
            {/* w-full bg-gray-50 border-0 rounded-xl p-3 text-sm font-bold */}
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Ad"
              placeholderTextColor="#9CA3AF"
            />
            <TextInput
              style={styles.input}
              value={surname}
              onChangeText={setSurname}
              placeholder="Soyad"
              placeholderTextColor="#9CA3AF"
            />
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Telefon"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
            />
          </View>

          {/* flex space-x-3 mt-6 */}
          <View style={styles.buttonRow}>
            {/* flex-1 bg-gray-100 text-gray-500 font-bold py-3 rounded-xl */}
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelText}>{getText('cancel')}</Text>
            </TouchableOpacity>

            {/* flex-1 bg-brand-green text-white font-bold py-3 rounded-xl */}
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Text style={styles.saveText}>{getText('save')}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // fixed inset-0 z-[70] flex items-center justify-center p-6
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24, // p-6
  },
  // absolute inset-0 bg-brand-black/60 backdrop-blur-sm
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 26, 26, 0.6)', // bg-brand-black/60
  },
  // bg-white w-full max-w-sm rounded-[32px] p-6 relative z-10 animate-enter
  card: {
    backgroundColor: '#FFFFFF', // bg-white
    width: '100%',
    maxWidth: 384, // max-w-sm
    borderRadius: 32, // rounded-[32px]
    padding: 24, // p-6
  },
  // text-xl font-bold mb-4
  title: {
    fontSize: 20, // text-xl
    fontWeight: '700', // font-bold
    color: '#111827', // text-gray-900
    marginBottom: 16, // mb-4
  },
  // space-y-3
  inputGroup: {
    gap: 12, // space-y-3
  },
  // w-full bg-gray-50 border-0 rounded-xl p-3 text-sm font-bold
  input: {
    backgroundColor: '#F9FAFB', // bg-gray-50
    borderWidth: 0,
    borderRadius: 12, // rounded-xl
    padding: 12, // p-3
    fontSize: 14, // text-sm
    fontWeight: '700', // font-bold
    color: '#111827', // text-gray-900
  },
  // flex space-x-3 mt-6
  buttonRow: {
    flexDirection: 'row',
    gap: 12, // space-x-3
    marginTop: 24, // mt-6
  },
  // flex-1 py-3 rounded-xl items-center justify-center
  button: {
    flex: 1,
    paddingVertical: 12, // py-3
    borderRadius: 12, // rounded-xl
    alignItems: 'center',
    justifyContent: 'center',
  },
  // bg-gray-100
  cancelButton: {
    backgroundColor: '#F3F4F6', // bg-gray-100
  },
  // bg-brand-green
  saveButton: {
    backgroundColor: '#004D3B', // bg-brand-green
  },
  // text-gray-500 font-bold
  cancelText: {
    color: '#6B7280', // text-gray-500
    fontWeight: '700', // font-bold
    fontSize: 14,
  },
  // text-white font-bold
  saveText: {
    color: '#FFFFFF', // text-white
    fontWeight: '700', // font-bold
    fontSize: 14,
  },
});
