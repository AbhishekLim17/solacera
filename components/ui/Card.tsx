import React from 'react';
import { View, ViewStyle, StyleSheet, Platform } from 'react-native';
import { Colors, Radii } from '../../constants/theme';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  bg?: string;
}

export function Card({ children, style, bg }: Props) {
  return (
    <View style={[styles.card, bg ? { backgroundColor: bg } : {}, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#37523a',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.07,
        shadowRadius: 24,
      },
      android: { elevation: 2 },
    }),
  },
});