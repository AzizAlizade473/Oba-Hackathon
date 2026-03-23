// components/StarRow.tsx

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { C } from '../constants/colors';

interface StarRowProps {
  value: number;
  onRate: (n: number) => void;
  disabled?: boolean;
}

export function StarRow({ value, onRate, disabled }: StarRowProps) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <TouchableOpacity
          key={i}
          onPress={() => !disabled && onRate(i)}
          style={{ paddingHorizontal: 2 }}
        >
          <Text style={{ fontSize: 20, color: i <= value ? C.lime : '#E5E7EB' }}>★</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
