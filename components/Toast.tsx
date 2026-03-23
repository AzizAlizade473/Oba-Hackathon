// components/Toast.tsx

import React, { useRef, useEffect } from 'react';
import { Animated, Text } from 'react-native';
import { s } from '../styles/styles';

interface ToastProps {
  visible: boolean;
  message: string;
  type: string;
}

export function Toast({ visible, message }: ToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [visible, opacity]);

  return (
    <Animated.View style={[s.toast, { opacity }]} pointerEvents="none">
      <Text style={s.toastIcon}>✓</Text>
      <Text style={s.toastText}>{message}</Text>
    </Animated.View>
  );
}
