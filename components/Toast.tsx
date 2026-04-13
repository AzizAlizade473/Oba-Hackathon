// components/Toast.tsx

import React, { useRef, useEffect } from 'react';
import { Animated, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { s } from '../styles/styles';

interface ToastProps {
  visible: boolean;
  message: string;
  type: string;
}

const ICON_MAP: Record<string, { name: string; color: string }> = {
  success: { name: 'check-circle', color: '#D4F238' },
  error:   { name: 'clock',        color: '#FBBF24' },
  info:    { name: 'info-circle',   color: '#60A5FA' },
};

export function Toast({ visible, message, type }: ToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [visible, opacity]);

  const icon = ICON_MAP[type] || ICON_MAP.success;

  return (
    <Animated.View style={[s.toast, { opacity }]} pointerEvents="none">
      <FontAwesome5 name={icon.name} size={16} solid color={icon.color} style={{ marginRight: 8 }} />
      <Text style={s.toastText}>{message}</Text>
    </Animated.View>
  );
}
