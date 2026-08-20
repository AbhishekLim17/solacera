import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MessageCircle, Heart, Users, Sparkles } from 'lucide-react-native';
import { Colors, FontFamily, FontSize, Spacing, Radii } from '../../constants/theme';
import { getGreeting } from '../../lib/time';

const DEMO_REMINDERS = [
  { id: '1', category: 'Medicine',  name: 'Vitamin D',             time: '08:30', completed: false },
  { id: '2', category: 'Hydration', name: 'Drink a glass of water', time: '10:00', completed: false },
  { id: '3', category: 'Medicine',  name: 'Blood pressure tablet',  time: '13:00', completed: false },
  { id: '4', category: 'Activity',  name: '5-minute stretch',       time: '16:00', completed: false },
  { id: '5', category: 'Medicine',  name: 'Calcium supplement',     time: '20:00', completed: false },
];

const HELP_CARDS = [
  { title: 'AI Companion',        desc: "Talk through how you're feeling",  bg: '#e8ede8', IconComp: MessageCircle, emoji: String.fromCodePoint(0x2764, 0xFE0F), href: '/(tabs)/companion' },
  { title: 'Personal Wellness',   desc: 'Medicine & self-care reminders',   bg: '#f0e8dc', IconComp: Heart,         emoji: String.fromCodePoint(0x1FA7A), href: '/(tabs)/wellness' },
  { title: 'Family Coordination', desc: 'Share the caregiving load',        bg: '#e4eae4', IconComp: Users,         emoji: String.fromCodePoint(0x1F3E0), href: '/(tabs)/family' },
  { title: 'Solace Time',         desc: 'A few moments just for you',       bg: '#eae6d8', IconComp: Sparkles,      emoji: String.fromCodePoint(0x1F338), href: '/(tabs)/solace' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [reminders, setReminders] = useState(DEMO_REMINDERS);

  const toggleReminder = (id: string) => {
    setReminders((prev) => prev.map((r) => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  const done = reminders.filter((r) => r.completed).length;
  const left = reminders.filter((r) => !r.completed).length;

  return (
    <View style={styles.page}>
      {/* Hero card */}
      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View style={styles.heroLogo}>
            <Text style={styles.heroLogoEmoji}>{String.fromCodePoint(0x1F33F)}</Text>
          </View>
          <Text style={styles.heroLogoText}>Solacera</Text>
        </View>
        <Text style={styles.heroGreeting}>{getGreeting()}.</Text>
        <Text style={styles.heroSubtitle}>
          You spend so much of yourself caring for others. This is a quiet space that looks after you for a while.
        </Text>
        <View style={styles.heroPills}>
          <View style={styles.heroPill}>
            <Text style={styles.heroPillText}>{String.fromCodePoint(0x1F550)} {done} done today</Text>
          </View>
          <View style={styles.heroPill}>
            <Text style={styles.heroPillText}>{String.fromCodePoint(0x1F514)} {left} reminders left</Text>
          </View>
        </View>
      </View>

      {/* Reminders */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's reminders</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/wellness')}>
            <Text style={styles.viewAll}>View all {String.fromCodePoint(0x2192)}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.remindersCard}>
          {reminders.map((r, i) => (
            <View key={r.id}>
              {i > 0 && <View style={styles.divider} />}
              <View style={styles.reminderRow}>
                <TouchableOpacity
                  style={[styles.circle, r.completed && styles.circleChecked]}
                  onPress={() => toggleReminder(r.id)}
                />
                <Text style={styles.reminderCategory}>{r.category}</Text>
                <Text style={[styles.reminderName, r.completed && styles.strikethrough]}>{r.name}</Text>
                <Text style={styles.reminderTime}>{r.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Help grid */}
      <View style={styles.section}>
        <Text style={styles.helpTitle}>How can we help today?</Text>
        <View style={styles.helpGrid}>
          {HELP_CARDS.map((h) => (
            <TouchableOpacity
              key={h.title}
              style={[styles.helpCard, { backgroundColor: h.bg }]}
              onPress={() => router.push(h.href as any)}
              activeOpacity={0.8}
            >
              <View style={styles.helpCardTop}>
                <View style={styles.helpIconCircle}>
                  <h.IconComp size={18} color={Colors.primary} strokeWidth={1.6} />
                </View>
                <Text style={styles.helpEmoji}>{h.emoji}</Text>
              </View>
              <Text style={styles.helpCardTitle}>{h.title}</Text>
              <Text style={styles.helpCardDesc}>{h.desc}</Text>
              <Text style={styles.helpOpen}>Open {String.fromCodePoint(0x2192)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  heroCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: 28,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#e8e4d8',
  },
  heroTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  heroLogo: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  heroLogoEmoji: { fontSize: 16 },
  heroLogoText: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.sm, color: Colors.textSecondary },
  heroGreeting: { fontFamily: FontFamily.serif, fontSize: 36, color: Colors.textPrimary, marginBottom: 8 },
  heroSubtitle: { fontFamily: FontFamily.sans, fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20, marginBottom: 16, maxWidth: 420 },
  heroPills: { flexDirection: 'row', gap: 8 },
  heroPill: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: Radii.pill, borderWidth: 1, borderColor: '#d8d4c8' },
  heroPillText: { fontFamily: FontFamily.sans, fontSize: FontSize.xs, color: Colors.textSecondary },
  section: { marginBottom: 28 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontFamily: FontFamily.serif, fontSize: FontSize.lg, color: Colors.textPrimary },
  viewAll: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.sm, color: Colors.primary },
  remindersCard: { backgroundColor: Colors.surface, borderRadius: Radii.lg, borderWidth: 1, borderColor: '#e8e4d8', paddingHorizontal: 20, paddingVertical: 4 },
  divider: { height: 1, backgroundColor: '#f0ede4' },
  reminderRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 12 },
  circle: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: '#c8c4b8', flexShrink: 0 },
  circleChecked: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  reminderCategory: { fontFamily: FontFamily.sans, fontSize: FontSize.sm, color: Colors.textMuted, width: 76 },
  reminderName: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.sm, color: Colors.textPrimary, flex: 1 },
  strikethrough: { textDecorationLine: 'line-through', color: Colors.textMuted },
  reminderTime: { fontFamily: FontFamily.sans, fontSize: FontSize.sm, color: Colors.textMuted },
  helpTitle: { fontFamily: FontFamily.serif, fontSize: FontSize.lg, color: Colors.textPrimary, marginBottom: 12 },
  helpGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  helpCard: { width: '47.5%', borderRadius: Radii.xl, padding: 20, borderWidth: 1, borderColor: '#e0ddd4', minHeight: 140 },
  helpCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  helpIconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center' },
  helpEmoji: { fontSize: 20 },
  helpCardTitle: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.base, color: Colors.textPrimary, marginBottom: 4 },
  helpCardDesc: { fontFamily: FontFamily.sans, fontSize: FontSize.xs, color: Colors.textSecondary, lineHeight: 16, flex: 1 },
  helpOpen: { fontFamily: FontFamily.sansMedium, fontSize: FontSize.xs, color: Colors.primary, marginTop: 10 },
});