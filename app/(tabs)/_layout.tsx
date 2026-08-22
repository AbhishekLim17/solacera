import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  SafeAreaView,
} from "react-native";
import { useRouter, useSegments, Slot } from "expo-router";
import { Home, MessageCircle, Heart, Users, Sparkles } from "lucide-react-native";
import { Colors, FontFamily, FontSize, Radii } from "../../constants/theme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useBreakpoint } from "../../hooks/useBreakpoint";

const NAV_ITEMS = [
  { name: "index",     label: "Home",        Icon: Home,          path: "/(tabs)" },
  { name: "companion", label: "Companion",   Icon: MessageCircle, path: "/(tabs)/companion" },
  { name: "wellness",  label: "Wellness",    Icon: Heart,         path: "/(tabs)/wellness" },
  { name: "family",    label: "Family",      Icon: Users,         path: "/(tabs)/family" },
  { name: "solace",    label: "Solace Time", Icon: Sparkles,      path: "/(tabs)/solace" },
];

export default function TabsLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { isMobile } = useBreakpoint();

  const currentSegment = segments[segments.length - 1] ?? "index";

  const isActive = (name: string) =>
    currentSegment === name ||
    (name === "index" && (currentSegment === "(tabs)" || currentSegment === ""));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f2ea" }}>
        <View style={styles.root}>
          {/* ─── TOP NAV (tablet + desktop) ─── */}
          {!isMobile && (
            <View style={styles.navbar}>
              <TouchableOpacity
                style={styles.logo}
                onPress={() => router.push("/(tabs)")}
                activeOpacity={0.8}
              >
                <View style={styles.logoIcon}>
                  <Text style={styles.logoEmoji}>🌿</Text>
                </View>
                <Text style={styles.logoText}>Solacera</Text>
              </TouchableOpacity>

              <View style={styles.navLinks}>
                {NAV_ITEMS.map(({ name, label, Icon, path }) => (
                  <TouchableOpacity
                    key={name}
                    style={[styles.navItem, isActive(name) && styles.navItemActive]}
                    onPress={() => router.push(path as any)}
                    activeOpacity={0.7}
                  >
                    <Icon
                      size={14}
                      color={isActive(name) ? Colors.white : Colors.textSecondary}
                      strokeWidth={1.8}
                    />
                    <Text style={[styles.navLabel, isActive(name) && styles.navLabelActive]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* ─── MOBILE HEADER BAR ─── */}
          {isMobile && (
            <View style={styles.mobileHeader}>
              <View style={styles.logo}>
                <View style={styles.logoIcon}>
                  <Text style={styles.logoEmoji}>🌿</Text>
                </View>
                <Text style={styles.logoText}>Solacera</Text>
              </View>
            </View>
          )}

          {/* ─── PAGE CONTENT ─── */}
          <ScrollView
            style={styles.body}
            contentContainerStyle={[
              styles.bodyContent,
              isMobile && styles.bodyContentMobile,
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={[styles.centerCol, isMobile && styles.centerColMobile]}>
              <Slot />
            </View>
          </ScrollView>

          {/* ─── BOTTOM TAB BAR (mobile only) ─── */}
          {isMobile && (
            <View style={styles.bottomBar}>
              {NAV_ITEMS.map(({ name, label, Icon, path }) => (
                <TouchableOpacity
                  key={name}
                  style={styles.bottomTab}
                  onPress={() => router.push(path as any)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.bottomTabIcon,
                      isActive(name) && styles.bottomTabIconActive,
                    ]}
                  >
                    <Icon
                      size={20}
                      color={isActive(name) ? Colors.white : Colors.textSecondary}
                      strokeWidth={1.8}
                    />
                  </View>
                  <Text
                    style={[
                      styles.bottomTabLabel,
                      isActive(name) && styles.bottomTabLabelActive,
                    ]}
                    numberOfLines={1}
                  >
                    {name === "solace" ? "Solace" : label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#ece9e0",
  },

  // ── Top nav (tablet / desktop) ──────────────────────
  navbar: {
    height: 60,
    backgroundColor: "#f5f2ea",
    borderBottomWidth: 1,
    borderBottomColor: "#e0ddd4",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    zIndex: 10,
  },

  // ── Mobile header ────────────────────────────────────
  mobileHeader: {
    height: 54,
    backgroundColor: "#f5f2ea",
    borderBottomWidth: 1,
    borderBottomColor: "#e0ddd4",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  // ── Logo ─────────────────────────────────────────────
  logo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  logoEmoji: { fontSize: 14 },
  logoText: {
    fontFamily: FontFamily.sansSemiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },

  // ── Top nav links ────────────────────────────────────
  navLinks: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
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

  // ── Scrollable body ──────────────────────────────────
  body: {
    flex: 1,
  },
  bodyContent: {
    flexGrow: 1,
    paddingVertical: 40,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  bodyContentMobile: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  centerCol: {
    width: "100%",
    maxWidth: 820,
  },
  centerColMobile: {
    maxWidth: "100%",
  },

  // ── Bottom tab bar (mobile) ──────────────────────────
  bottomBar: {
    height: 68,
    backgroundColor: "#f5f2ea",
    borderTopWidth: 1,
    borderTopColor: "#e0ddd4",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 4,
    paddingBottom: Platform.OS === "ios" ? 8 : 0,
  },
  bottomTab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    gap: 3,
  },
  bottomTabIcon: {
    width: 40,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomTabIconActive: {
    backgroundColor: Colors.primary,
    width: 52,
  },
  bottomTabLabel: {
    fontFamily: FontFamily.sansMedium,
    fontSize: 10,
    color: Colors.textSecondary,
  },
  bottomTabLabelActive: {
    color: Colors.primary,
    fontFamily: FontFamily.sansSemiBold,
  },
});