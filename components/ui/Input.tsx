import React from 'react';
import { TextInput, Text, View, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { Colors, Radii, FontFamily, FontSize, Spacing } from '../../constants/theme';

interface Props extends TextInputProps {
  label?: string;
  containerStyle?: ViewStyle;
  rightElement?: React.ReactNode;
}

export function Input({ label, containerStyle, rightElement, style, ...props }: Props) {
  return (
    <View style={containerStyle}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.wrapper}>
        <TextInput
          style={[styles.input, rightElement ? { paddingRight: 44 } : undefined, style]}
          placeholderTextColor={Colors.textMuted}
          {...props}
        />
        {rightElement && <View style={styles.right}>{rightElement}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  wrapper: { position: 'relative' },
  input: {
    height: 48,
    borderRadius: Radii.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.base,
    fontFamily: FontFamily.sans,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    backgroundColor: Colors.surface,
  },
  right: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
});