import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, Radii } from '../../constants/theme';
import type { Reminder } from '../../hooks/useReminders';
import { formatTimeFromString } from '../../lib/time';

const CATEGORY_LABELS: Record<string, string> = {
  medicine: 'Medicine',
  hydration: 'Hydration',
  sleep: 'Sleep',
  activity: 'Activity',
};

interface Props {
  reminder: Reminder;
  onToggle: (id: string, completed: boolean) => void;
}

export function ReminderRow({ reminder, onToggle }: Props) {
  return (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={0.7}
      onPress={() => onToggle(reminder.id, !reminder.completed)}
    >
      <View style={[styles.checkbox, reminder.completed && styles.checked]}>
        {reminder.completed && <View style={styles.checkDot} />}
      </View>
      <Text style={styles.category}>{CATEGORY_LABELS[reminder.type] ?? reminder.type}</Text>
      <Text style={[styles.name, reminder.completed && styles.strikethrough]} numberOfLines={1}>
        {reminder.name}
      </Text>
      <Text style={styles.time}>{formatTimeFromString(reminder.reminder_time)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm + 2,
    gap: Spacing.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checked: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  checkDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.white },
  category: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    width: 64,
    flexShrink: 0,
  },
  name: {
    flex: 1,
    fontFamily: FontFamily.sans,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    color: Colors.textMuted,
  },
  time: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    flexShrink: 0,
  },
});