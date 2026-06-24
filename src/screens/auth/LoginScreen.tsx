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

type AuthMode = 'password' | 'otp';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [authMode, setAuthMode] = useState<AuthMode>('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!phone) { setError('Please enter your phone number.'); return; }
    if (authMode === 'password' && !password) { setError('Please enter your password.'); return; }
    if (authMode === 'otp' && !otp) { setError('Please enter the OTP code.'); return; }

    setError(null);
    setLoading(true);
    try {
      await login(phone, authMode === 'password' ? password : undefined, authMode === 'otp' ? otp : undefined);
      router.replace('/(app)');
    } catch (err: any) {
      setError(err?.message || 'Sign in failed. Please check your credentials.');
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
            <ThemedText style={styles.appName}>Digital Ekub</ThemedText>
            <ThemedText style={styles.appTagline}>
              Save and grow together
            </ThemedText>
          </View>

          {/* ── Card ── */}
          <View style={styles.card}>
            <ThemedText style={styles.cardTitle}>Welcome back</ThemedText>
            <ThemedText style={styles.cardSubtitle}>
              Sign in to your account
            </ThemedText>

            {/* Mode toggle */}
            <View style={styles.modeToggle}>
              {(['password', 'otp'] as AuthMode[]).map(mode => (
                <Pressable
                  key={mode}
                  style={[styles.modeBtn, authMode === mode && styles.modeBtnActive]}
                  onPress={() => { setError(null); setAuthMode(mode); }}>
                  <ThemedText style={[styles.modeBtnText, authMode === mode && styles.modeBtnTextActive]}>
                    {mode === 'password' ? '🔒 Password' : '📱 OTP Code'}
                  </ThemedText>
                </Pressable>
              ))}
            </View>

            {/* Error */}
            {error && (
              <View style={styles.errorBox}>
                <ThemedText style={styles.errorText}>⚠️ {error}</ThemedText>
              </View>
            )}

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

            {/* Password or OTP */}
            {authMode === 'password' ? (
              <View style={styles.fieldWrap}>
                <ThemedText style={styles.fieldLabel}>PASSWORD</ThemedText>
                <View style={styles.inputWrap}>
                  <ThemedText style={styles.inputIcon}>🔑</ThemedText>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor={Brand.textMuted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>
              </View>
            ) : (
              <View style={styles.fieldWrap}>
                <View style={styles.fieldLabelRow}>
                  <ThemedText style={styles.fieldLabel}>OTP CODE</ThemedText>
                  <ThemedText style={styles.fieldHint}>placeholder: 123456</ThemedText>
                </View>
                <View style={styles.inputWrap}>
                  <ThemedText style={styles.inputIcon}>🔢</ThemedText>
                  <TextInput
                    style={styles.input}
                    placeholder="6-digit code"
                    placeholderTextColor={Brand.textMuted}
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                </View>
              </View>
            )}

            {/* Submit */}
            <Pressable
              style={({ pressed }) => [styles.submitBtn, { opacity: pressed || loading ? 0.8 : 1 }]}
              onPress={handleLogin}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color={Brand.black} size="small" />
              ) : (
                <ThemedText style={styles.submitText}>
                  Sign In
                </ThemedText>
              )}
            </Pressable>

            {/* Footer */}
            <View style={styles.footer}>
              <ThemedText style={styles.footerText}>Don't have an account? </ThemedText>
              <Pressable onPress={() => router.push('/(auth)/register')}>
                <ThemedText style={styles.footerLink}>Register here</ThemedText>
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
    marginBottom: Spacing.five,
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
    fontSize: 14,
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
  cardTitle: {
    color: Brand.textPrimary,
    fontSize: 22,
    fontWeight: '800',
  },
  cardSubtitle: {
    color: Brand.textSecondary,
    fontSize: 14,
    marginTop: -Spacing.two,
  },

  // Mode toggle
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: Brand.bg1,
    borderRadius: Radius.md,
    padding: 4,
    gap: 4,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: Spacing.one + 2,
    borderRadius: Radius.sm + 2,
    alignItems: 'center',
  },
  modeBtnActive: {
    backgroundColor: Brand.accent,
  },
  modeBtnText: {
    color: Brand.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  modeBtnTextActive: {
    color: Brand.black,
    fontWeight: '800',
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
  fieldLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldLabel: {
    color: Brand.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
  },
  fieldHint: {
    color: Brand.accent,
    fontSize: 11,
    fontStyle: 'italic',
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

  // Submit button
  submitBtn: {
    backgroundColor: Brand.accent,
    borderRadius: Radius.md,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.one,
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
