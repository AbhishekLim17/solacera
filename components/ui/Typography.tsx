import React from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize } from '../../constants/theme';

type Variant = 'heading' | 'subheading' | 'cardTitle' | 'body' | 'caption' | 'label' | 'muted';

interface Props {
  variant?: Variant;
  children: React.ReactNode;
  style?: TextStyle | TextStyle[];
  numberOfLines?: number;
}

export function Typography({ variant = 'body', children, style, numberOfLines }: Props) {
  return (
    <Text style={[styles[variant], style]} numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontFamily: FontFamily.serif,
    fontSize: FontSize['2xl'],
    color: Colors.textPrimary,
    lineHeight: 36,
  },
  subheading: {
    fontFamily: FontFamily.serif,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    lineHeight: 28,
  },
  cardTitle: {
    fontFamily: FontFamily.serif,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  body: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  caption: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  label: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    letterSpacing: 0.2,
  },
  muted: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
});