import React from 'react';
import {
  TouchableOpacity, Text, StyleSheet, ActivityIndicator,
  ViewStyle, TextStyle,
} from 'react-native';
import { Colors, Radii, FontFamily, FontSize, Spacing } from '../../constants/theme';

type Variant = 'primary' | 'outlined' | 'ghost';

interface Props {
  onPress: () => void;
  label: string;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export function Button({
  onPress, label, variant = 'primary', loading, disabled, style, textStyle, icon,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      disabled={disabled || loading}
      style={[styles.base, styles[variant], disabled && styles.disabled, style]}
    >
      {icon}
      {loading
        ? <ActivityIndicator color={variant === 'primary' ? Colors.white : Colors.primary} />
        : <Text style={[styles.text, styles[`${variant}Text` as keyof typeof styles] as TextStyle, textStyle]}>{label}</Text>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 48,
    borderRadius: Radii.pill,
    paddingHorizontal: Spacing.xl,
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: { opacity: 0.5 },
  text: {
    fontFamily: FontFamily.sansSemiBold,
    fontSize: FontSize.base,
  },
  primaryText: { color: Colors.white },
  outlinedText: { color: Colors.primary },
  ghostText: { color: Colors.textMuted },
});