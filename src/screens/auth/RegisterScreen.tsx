import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/services/authContext';
import { ThemedText } from '@/components/themed-text';
import { Brand, Spacing, Radius, Shadow } from '@/constants/theme';

const ROLES = [
  { value: 'user',  label: 'Member',   emoji: '👤', desc: 'Join and participate in ekub groups' },
  { value: 'admin', label: 'Organizer', emoji: '🔑', desc: 'Create and manage ekub groups' },
] as const;

type Role = 'user' | 'admin';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!name || !phone || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await register(phone, password, name, role);
      router.replace('/(app)');
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">

          {/* ── Logo ── */}
          <View style={styles.logoWrap}>
            <View style={styles.logoBadge}>
              <ThemedText style={styles.logoText}>🏦</ThemedText>
            </View>
            <ThemedText style={styles.appName}>Create Account</ThemedText>
            <ThemedText style={styles.appTagline}>
              Join Digital Ekub and start saving together
            </ThemedText>
          </View>

          {/* ── Card ── */}
          <View style={styles.card}>

            {/* Error */}
            {error && (
              <View style={styles.errorBox}>
                <ThemedText style={styles.errorText}>⚠️ {error}</ThemedText>
              </View>
            )}

            {/* Name */}
            <View style={styles.fieldWrap}>
              <ThemedText style={styles.fieldLabel}>FULL NAME</ThemedText>
              <View style={styles.inputWrap}>
                <ThemedText style={styles.inputIcon}>✏️</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="Your full name"
                  placeholderTextColor={Brand.textMuted}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Phone */}
            <View style={styles.fieldWrap}>
              <ThemedText style={styles.fieldLabel}>PHONE NUMBER</ThemedText>
              <View style={styles.inputWrap}>
                <ThemedText style={styles.inputIcon}>📞</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="+251 9XX XXX XXX"
                  placeholderTextColor={Brand.textMuted}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.fieldWrap}>
              <ThemedText style={styles.fieldLabel}>PASSWORD</ThemedText>
              <View style={styles.inputWrap}>
                <ThemedText style={styles.inputIcon}>🔑</ThemedText>
                <TextInput
                  style={styles.input}
                  placeholder="Create a strong password"
                  placeholderTextColor={Brand.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Role selector */}
            <View style={styles.fieldWrap}>
              <ThemedText style={styles.fieldLabel}>ACCOUNT ROLE</ThemedText>
              <View style={styles.roleRow}>
                {ROLES.map(r => (
                  <Pressable
                    key={r.value}
                    style={[
                      styles.roleCard,
                      role === r.value && styles.roleCardActive,
                    ]}
                    onPress={() => setRole(r.value)}>
                    <ThemedText style={styles.roleEmoji}>{r.emoji}</ThemedText>
                    <ThemedText style={[styles.roleLabel, role === r.value && styles.roleLabelActive]}>
                      {r.label}
                    </ThemedText>
                    <ThemedText style={styles.roleDesc}>{r.desc}</ThemedText>
                    {role === r.value && (
                      <View style={styles.checkBadge}>
                        <ThemedText style={styles.checkText}>✓</ThemedText>
                      </View>
                    )}
                  </Pressable>
                ))}
              </View>
            </View>

            {/* OTP hint */}
            <View style={styles.otpHintBox}>
              <ThemedText style={styles.otpHintText}>
                📱 Your default OTP code will be <ThemedText style={styles.otpCode}>123456</ThemedText> — change it after login
              </ThemedText>
            </View>

            {/* Submit */}
            <Pressable
              style={({ pressed }) => [styles.submitBtn, { opacity: pressed || loading ? 0.8 : 1 }]}
              onPress={handleRegister}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color={Brand.black} size="small" />
              ) : (
                <ThemedText style={styles.submitText}>Create Account</ThemedText>
              )}
            </Pressable>

            {/* Footer */}
            <View style={styles.footer}>
              <ThemedText style={styles.footerText}>Already have an account? </ThemedText>
              <Pressable onPress={() => router.push('/(auth)/login')}>
                <ThemedText style={styles.footerLink}>Sign in here</ThemedText>
              </Pressable>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Brand.bg1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.four,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },

  // Logo
  logoWrap: {
    alignItems: 'center',
    marginBottom: Spacing.four,
    gap: Spacing.two,
  },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: Radius.xl,
    backgroundColor: Brand.accentMuted,
    borderWidth: 2,
    borderColor: Brand.accentBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.one,
    ...Shadow.accent,
  },
  logoText: { fontSize: 36 },
  appName: {
    color: Brand.textPrimary,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  appTagline: {
    color: Brand.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: Spacing.four,
  },

  // Card
  card: {
    backgroundColor: Brand.bg2,
    borderRadius: Radius.xl,
    padding: Spacing.four,
    gap: Spacing.three,
    borderWidth: 1,
    borderColor: Brand.bg3,
    ...Shadow.card,
  },

  // Error
  errorBox: {
    backgroundColor: 'rgba(224,82,82,0.12)',
    borderRadius: Radius.md,
    padding: Spacing.two + 4,
    borderWidth: 1,
    borderColor: 'rgba(224,82,82,0.3)',
  },
  errorText: {
    color: Brand.error,
    fontSize: 13,
    fontWeight: '600',
  },

  // Field
  fieldWrap: { gap: Spacing.one },
  fieldLabel: {
    color: Brand.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Brand.bg1,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Brand.bg3,
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
    height: 50,
  },
  inputIcon: { fontSize: 16 },
  input: {
    flex: 1,
    color: Brand.textPrimary,
    fontSize: 15,
    padding: 0,
  },

  // Role selector
  roleRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  roleCard: {
    flex: 1,
    backgroundColor: Brand.bg1,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Brand.bg3,
    padding: Spacing.two + 4,
    alignItems: 'center',
    gap: 4,
    position: 'relative',
  },
  roleCardActive: {
    borderColor: Brand.accent,
    backgroundColor: Brand.accentMuted,
  },
  roleEmoji: { fontSize: 26, marginBottom: 2 },
  roleLabel: {
    color: Brand.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
  roleLabelActive: {
    color: Brand.accent,
  },
  roleDesc: {
    color: Brand.textMuted,
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 14,
  },
  checkBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: Radius.full,
    backgroundColor: Brand.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkText: {
    color: Brand.black,
    fontSize: 10,
    fontWeight: '800',
  },

  // OTP hint
  otpHintBox: {
    backgroundColor: Brand.accentMuted,
    borderRadius: Radius.md,
    padding: Spacing.two + 4,
    borderWidth: 1,
    borderColor: Brand.accentBorder,
  },
  otpHintText: {
    color: Brand.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  otpCode: {
    color: Brand.accent,
    fontWeight: '800',
  },

  // Submit
  submitBtn: {
    backgroundColor: Brand.accent,
    borderRadius: Radius.md,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.accent,
  },
  submitText: {
    color: Brand.black,
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.3,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: Brand.textSecondary,
    fontSize: 13,
  },
  footerLink: {
    color: Brand.accent,
    fontSize: 13,
    fontWeight: '700',
  },
});
