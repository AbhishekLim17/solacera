// Solacera Design Tokens
// Source: Merged Build Spec — Section 2

import { Platform } from 'react-native';

export const Colors = {
  pageBg: '#f7f5ed',
  surface: '#ffffff',
  primary: '#5d9461',
  primaryDark: '#456f4a',
  primaryLight: '#e7f1e7',
  textPrimary: '#304b35',
  textSecondary: '#5c875f',
  textMuted: '#83a984',
  border: '#dce8dc',
  cardCompanion: '#eef5ee',
  cardWellness: '#f9f6ed',
  cardFamily: '#f2f5f0',
  cardSolace: '#edf3ed',
  white: '#ffffff',
  error: '#c0392b',
  errorLight: '#fdecea',
} as const;

export const Radii = {
  sm: 12,
  md: 18,
  lg: 26,
  xl: 34,
  pill: 999,
} as const;

export const Shadows = {
  card: Platform.select({
    ios: {
      shadowColor: '#37523a',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.07,
      shadowRadius: 24,
    },
    android: { elevation: 3 },
    default: {},
  }),
} as const;

export const FontFamily = {
  serif: Platform.select({ ios: 'Georgia', default: 'serif' }),
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemiBold: 'Inter_600SemiBold',
} as const;

export const FontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  '2xl': 28,
  '3xl': 34,
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
} as const;
