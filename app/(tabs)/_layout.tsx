import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useSegments, Slot } from 'expo-router';
import { Home, MessageCircle, Heart, Users, Sparkles } from 'lucide-react-native';
import { Colors, FontFamily, FontSize, Radii } from '../../constants/theme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const NAV_ITEMS = [
  { name: 'index',     label: 'Home',        Icon: Home,           path: '/(tabs)' },
  { name: 'companion', label: 'Companion',   Icon: MessageCircle,  path: '/(tabs)/companion' },
  { name: 'wellness',  label: 'Wellness',    Icon: Heart,          path: '/(tabs)/wellness' },
  { name: 'family',    label: 'Family',      Icon: Users,          path: '/(tabs)/family' },
  { name: 'solace',    label: 'Solace Time', Icon: Sparkles,       path: '/(tabs)/solace' },
];

export default function TabsLayout() {
  const router = useRouter();
  const segments = useSegments();

  const currentSegment = segments[segments.length - 1] ?? 'index';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.root}>
        {/* Top Navbar */}
        <View style={styles.navbar}>
          <TouchableOpacity style={styles.logo} onPress={() => router.push('/(tabs)')} activeOpacity={0.8}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoEmoji}>🌿</Text>
            </View>
            <Text style={styles.logoText}>Solacera</Text>
          </TouchableOpacity>

          <View style={styles.navLinks}>
            {NAV_ITEMS.map(({ name, label, Icon, path }) => {
              const isActive = currentSegment === name || (name === 'index' && (currentSegment === '(tabs)' || currentSegment === ''));
              return (
                <TouchableOpacity
                  key={name}
                  style={[styles.navItem, isActive && styles.navItemActive]}
                  onPress={() => router.push(path as any)}
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

        {/* Content */}
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