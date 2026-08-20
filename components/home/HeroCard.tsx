import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock, Bell } from 'lucide-react-native';
import { Colors, Radii, FontFamily, FontSize, Spacing } from '../../constants/theme';

interface Props {
  greeting: string;
  done: number;
  remaining: number;
}

export function HeroCard({ greeting, done, remaining }: Props) {
  return (
    <View style={styles.card}>
      {/* Solacera brand row inside card */}
      <View style={styles.brandRow}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>🌿</Text>
        </View>
        <Text style={styles.brandName}>Solacera</Text>
      </View>

      <Text style={styles.greeting}>{greeting}</Text>
      <Text style={styles.tagline}>
        {"You spend so much of yourself caring for others. This is a quiet space that looks after you for a while."}
      </Text>

      <View style={styles.pills}>
        <View style={styles.pillGreen}>
          <Clock size={11} color={Colors.textSecondary} strokeWidth={2} />
          <Text style={styles.pillGreenText}>{done} done today</Text>
        </View>
        <View style={styles.pillBeige}>
          <Bell size={11} color="#8a7560" strokeWidth={2} />
          <Text style={styles.pillBeigeText}>{remaining} reminders left</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.base,
  },
  logoCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: { fontSize: 16 },
  brandName: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  greeting: {
    fontFamily: FontFamily.serif,
    fontSize: FontSize['2xl'] + 4,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  tagline: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.base,
  },
  pills: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  pillGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.pageBg,
  },
  pillGreenText: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  pillBeige: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: '#d5c9b5',
    backgroundColor: '#f5f0e8',
  },
  pillBeigeText: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.xs,
    color: '#8a7560',
  },
});