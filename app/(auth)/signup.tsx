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

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [householdName, setHouseholdName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password || !householdName) {
      Alert.alert('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error || !data.user) throw error ?? new Error('Signup failed');

      // Create household
      const { data: household, error: hhErr } = await supabase
        .from('households')
        .insert({ name: householdName })
        .select()
        .single();
      if (hhErr || !household) throw hhErr ?? new Error('Could not create household');

      // Create profile
      await supabase.from('profiles').insert({
        id: data.user.id,
        name,
        household_id: household.id,
      });

      // Seed default household members
      const defaultMembers = ['Mom', 'Dad', 'Sister', 'Brother', 'Grandma', 'Grandpa'];
      await supabase.from('household_members').insert(
        defaultMembers.map((n) => ({ household_id: household.id, display_name: n }))
      );
    } catch (err: any) {
      Alert.alert('Signup failed', err?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
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
          <Text style={styles.tagline}>Begin your quiet space.</Text>
        </View>
        <View style={styles.form}>
          <Text style={styles.title}>Create your account</Text>
          <Input label="Your name" value={name} onChangeText={setName} placeholder="e.g. Priya" containerStyle={styles.field} />
          <Input label="Email" value={email} onChangeText={setEmail} placeholder="you@example.com" autoCapitalize="none" keyboardType="email-address" containerStyle={styles.field} />
          <Input label="Password" value={password} onChangeText={setPassword} placeholder="Choose a password" secureTextEntry containerStyle={styles.field} />
          <Input label="Household name" value={householdName} onChangeText={setHouseholdName} placeholder="e.g. The Sharma Home" containerStyle={styles.field} />
          <Button label="Create account" onPress={handleSignup} loading={loading} style={styles.cta} />
          <TouchableOpacity onPress={() => router.back()} style={styles.switchLink}>
            <Text style={styles.switchText}>Already have an account? <Text style={styles.switchAccent}>Sign in</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.pageBg },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: Spacing.xl },
  brand: { alignItems: 'center', marginBottom: Spacing['2xl'] },
  brandName: { fontFamily: FontFamily.serif, fontSize: FontSize['3xl'], color: Colors.primary, letterSpacing: 1 },
  tagline: { fontFamily: FontFamily.sans, fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 6 },
  form: { backgroundColor: Colors.surface, borderRadius: Radii.xl, padding: Spacing.xl, borderWidth: 1, borderColor: Colors.border },
  title: { fontFamily: FontFamily.serif, fontSize: FontSize.xl, color: Colors.textPrimary, marginBottom: Spacing.xl },
  field: { marginBottom: Spacing.base },
  cta: { marginTop: Spacing.md },
  switchLink: { marginTop: Spacing.base, alignItems: 'center' },
  switchText: { fontFamily: FontFamily.sans, fontSize: FontSize.sm, color: Colors.textMuted },
  switchAccent: { color: Colors.primary },
});