import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useRouter, useSegments, Slot } from 'expo-router';
import { Home, MessageCircle, Heart, Users, Sparkles } from 'lucide-react-native';
import { Colors, FontFamily, FontSize, Spacing, Radii } from '../../constants/theme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const NAV_ITEMS = [
  { name: 'index',     label: 'Home',       Icon: Home,          href: '/(tabs)/' },
  { name: 'companion', label: 'Companion',  Icon: MessageCircle, href: '/(tabs)/companion' },
  { name: 'wellness',  label: 'Wellness',   Icon: Heart,         href: '/(tabs)/wellness' },
  { name: 'family',    label: 'Family',     Icon: Users,         href: '/(tabs)/family' },
  { name: 'solace',    label: 'Solace Time',Icon: Sparkles,      href: '/(tabs)/solace' },
];

export default function TabsLayout() {
  const router = useRouter();
  const segments = useSegments();

  // Determine active tab from segments
  const lastSegment = segments[segments.length - 1] ?? 'index';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.root}>
        {/* ── Top navbar ───────────────────────────────────── */}
        <View style={styles.navbar}>
          <TouchableOpacity style={styles.logo} onPress={() => router.push('/(tabs)/')}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoEmoji}>🌿</Text>
            </View>
            <Text style={styles.logoText}>Solacera</Text>
          </TouchableOpacity>

          <View style={styles.navLinks}>
            {NAV_ITEMS.map(({ name, label, Icon, href }) => {
              const isActive = lastSegment === name || (name === 'index' && (lastSegment === '(tabs)' || lastSegment === ''));
              return (
                <TouchableOpacity
                  key={name}
                  style={[styles.navItem, isActive && styles.navItemActive]}
                  onPress={() => router.push(href as any)}
                  activeOpacity={0.7}
                >
                  <Icon
                    size={14}
                    color={isActive ? Colors.white : Colors.textSecondary}
                    strokeWidth={1.8}
                  />
                  <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Page content ─────────────────────────────────── */}
        <ScrollView
          style={styles.body}
          contentContainerStyle={styles.bodyContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.centerCol}>
            <Slot />
          </View>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ece9e0',
  },
  // ── Navbar ──────────────────────────────────────────────────
  navbar: {
    height: 60,
    backgroundColor: '#f5f2ea',
    borderBottomWidth: 1,
    borderBottomColor: '#e0ddd4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    zIndex: 10,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: { fontSize: 14 },
  logoText: {
    fontFamily: FontFamily.sansSemiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radii.pill,
  },
  navItemActive: {
    backgroundColor: Colors.primary,
  },
  navLabel: {
    fontFamily: FontFamily.sansMedium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  navLabelActive: {
    color: Colors.white,
  },
  // ── Body ────────────────────────────────────────────────────
  body: {
    flex: 1,
  },
  bodyContent: {
    flexGrow: 1,
    paddingVertical: 40,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  centerCol: {
    width: '100%',
    maxWidth: 820,
  },
});