import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { Colors, Radii, FontFamily, FontSize, Spacing } from '../../constants/theme';

interface Props {
  title: string;
  description: string;
  bg: string;
  icon: React.ReactNode;
  emoji: string;
  onPress: () => void;
}

export function HelpCard({ title, description, bg, icon, emoji, onPress }: Props) {
  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: bg }]} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.topRow}>
        <View style={styles.iconWrap}>{icon}</View>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.desc} numberOfLines={2}>{description}</Text>
      <View style={styles.link}>
        <Text style={styles.linkText}>Open</Text>
        <ArrowRight size={12} color={Colors.primary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radii.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    flex: 1,
    minHeight: 160,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  iconWrap: {},
  emoji: { fontSize: 22 },
  title: {
    fontFamily: FontFamily.serif,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  desc: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
    flex: 1,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: Spacing.sm,
  },
  linkText: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.xs,
    color: Colors.primary,
  },
});