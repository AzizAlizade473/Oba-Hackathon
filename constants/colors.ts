// constants/colors.ts

import { Dimensions } from 'react-native';

export const COLORS = {
  black: '#1A1A1A',
  green: '#004D3B',
  lime: '#D4F238',
  gray: '#F8F9FB',
  surface: '#FFFFFF',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#F3F4F6',
  orange: '#F97316',
  blue: '#3B82F6',
  red: '#EF4444',
  purple: '#8B5CF6',
  teal: '#14B8A6',
} as const;

export const C = COLORS;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export { SCREEN_WIDTH, SCREEN_HEIGHT };
