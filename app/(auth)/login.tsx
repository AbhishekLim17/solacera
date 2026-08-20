import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, KeyboardAvoidingView,
  Platform, TouchableOpacity, Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '../../lib/supabase';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Colors, Radii, FontFamily, FontSize, Spacing } from '../../constants/theme';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Please fill in all fields');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) Alert.alert('Sign in failed', error.message);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.brand}>
          <Text style={styles.brandName}>Solacera</Text>
          <Text style={styles.tagline}>A quiet space that looks after you.</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.title}>Welcome back</Text>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
            containerStyle={styles.field}
          />
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Your password"
            secureTextEntry
            containerStyle={styles.field}
          />
          <Button label="Sign in" onPress={handleLogin} loading={loading} style={styles.cta} />
          <TouchableOpacity onPress={() => router.push('/(auth)/signup')} style={styles.switchLink}>
            <Text style={styles.switchText}>Don't have an account? <Text style={styles.switchAccent}>Create one</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.pageBg },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: Spacing.xl },
  brand: { alignItems: 'center', marginBottom: Spacing['3xl'] },
  brandName: {
    fontFamily: FontFamily.serif,
    fontSize: FontSize['3xl'],
    color: Colors.primary,
    letterSpacing: 1,
  },
  tagline: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 6,
  },
  form: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    fontFamily: FontFamily.serif,
    fontSize: FontSize.xl,
    color: Colors.textPrimary,
    marginBottom: Spacing.xl,
  },
  field: { marginBottom: Spacing.base },
  cta: { marginTop: Spacing.md },
  switchLink: { marginTop: Spacing.base, alignItems: 'center' },
  switchText: {
    fontFamily: FontFamily.sans,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  switchAccent: { color: Colors.primary },
});