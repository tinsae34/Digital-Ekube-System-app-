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
import { Ionicons } from '@expo/vector-icons';
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
  const [showPass, setShowPass] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!phone) { setError('Phone number is required.'); return; }
    if (authMode === 'password' && !password) { setError('Password is required.'); return; }
    if (authMode === 'otp' && !otp) { setError('OTP code is required.'); return; }
    setError(null);
    setLoading(true);
    try {
      await login(
        phone,
        authMode === 'password' ? password : undefined,
        authMode === 'otp' ? otp : undefined,
      );
      router.replace('/(app)');
    } catch (err: any) {
      setError(err?.message || 'Sign in failed. Check your credentials.');
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

          {/* ── Brand mark ── */}
          <View style={styles.brand}>
            <View style={styles.logoRing}>
              <Ionicons name="trending-up" size={28} color={Brand.accent} />
            </View>
            <ThemedText style={styles.wordmark}>ekub</ThemedText>
            <ThemedText style={styles.tagline}>Save and grow together</ThemedText>
          </View>

          {/* ── Main card ── */}
          <View style={styles.card}>
            <ThemedText style={styles.cardHeading}>Welcome back</ThemedText>
            <ThemedText style={styles.cardSub}>Sign in to continue</ThemedText>

            {/* Mode selector */}
            <View style={styles.segmented}>
              {(['password', 'otp'] as AuthMode[]).map(m => (
                <Pressable
                  key={m}
                  style={[styles.seg, authMode === m && styles.segActive]}
                  onPress={() => { setError(null); setAuthMode(m); }}>
                  <Ionicons
                    name={m === 'password' ? 'lock-closed-outline' : 'phone-portrait-outline'}
                    size={14}
                    color={authMode === m ? Brand.white : Brand.textSecondary}
                  />
                  <ThemedText style={[styles.segText, authMode === m && styles.segTextActive]}>
                    {m === 'password' ? 'Password' : 'OTP Code'}
                  </ThemedText>
                </Pressable>
              ))}
            </View>

            {/* Error */}
            {error && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle-outline" size={16} color={Brand.error} />
                <ThemedText style={styles.errorText}>{error}</ThemedText>
              </View>
            )}

            {/* Phone */}
            <View style={styles.fieldGroup}>
              <ThemedText style={styles.label}>PHONE NUMBER</ThemedText>
              <View style={styles.inputRow}>
                <Ionicons name="call-outline" size={18} color={Brand.textSecondary} />
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

            {/* Password / OTP */}
            {authMode === 'password' ? (
              <View style={styles.fieldGroup}>
                <ThemedText style={styles.label}>PASSWORD</ThemedText>
                <View style={styles.inputRow}>
                  <Ionicons name="lock-closed-outline" size={18} color={Brand.textSecondary} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor={Brand.textMuted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPass}
                    autoCapitalize="none"
                  />
                  <Pressable onPress={() => setShowPass(v => !v)}>
                    <Ionicons
                      name={showPass ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color={Brand.textSecondary}
                    />
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={styles.fieldGroup}>
                <View style={styles.labelRow}>
                  <ThemedText style={styles.label}>OTP CODE</ThemedText>
                  <ThemedText style={styles.labelHint}>placeholder: 123456</ThemedText>
                </View>
                <View style={styles.inputRow}>
                  <Ionicons name="keypad-outline" size={18} color={Brand.textSecondary} />
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

            {/* CTA */}
            <Pressable
              style={({ pressed }) => [styles.cta, { opacity: pressed || loading ? 0.85 : 1 }]}
              onPress={handleLogin}
              disabled={loading}>
              {loading
                ? <ActivityIndicator color={Brand.white} size="small" />
                : <>
                  <ThemedText style={styles.ctaText}>Sign In</ThemedText>
                  <Ionicons name="arrow-forward" size={18} color={Brand.white} />
                </>
              }
            </Pressable>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <ThemedText style={styles.dividerText}>or</ThemedText>
              <View style={styles.dividerLine} />
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <ThemedText style={styles.footerText}>Don't have an account? </ThemedText>
              <Pressable onPress={() => router.push('/(auth)/register')}>
                <ThemedText style={styles.footerLink}>Register</ThemedText>
              </Pressable>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.bg0 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.four,
    maxWidth: 460,
    alignSelf: 'center',
    width: '100%',
    gap: Spacing.five,
  },

  // Brand
  brand: { alignItems: 'center', gap: Spacing.two },
  logoRing: {
    width: 64,
    height: 64,
    borderRadius: Radius.xl,
    backgroundColor: Brand.accentMuted,
    borderWidth: 1.5,
    borderColor: Brand.accentBorder,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.accent,
  },
  wordmark: {
    color: Brand.textPrimary,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -1,
  },
  tagline: { color: Brand.textSecondary, fontSize: 13 },

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
  cardHeading: { color: Brand.textPrimary, fontSize: 22, fontWeight: '800', letterSpacing: -0.4 },
  cardSub: { color: Brand.textSecondary, fontSize: 14, marginTop: -Spacing.two },

  // Segmented control
  segmented: {
    flexDirection: 'row',
    backgroundColor: Brand.bg1,
    borderRadius: Radius.sm,
    padding: 3,
    gap: 3,
  },
  seg: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: Spacing.one + 3,
    borderRadius: Radius.xs + 2,
  },
  segActive: { backgroundColor: Brand.accent, ...Shadow.accent },
  segText: { color: Brand.textSecondary, fontSize: 13, fontWeight: '600' },
  segTextActive: { color: Brand.white, fontWeight: '700' },

  // Error
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one + 2,
    backgroundColor: 'rgba(224,92,92,0.10)',
    borderRadius: Radius.sm,
    padding: Spacing.two + 4,
    borderWidth: 1,
    borderColor: 'rgba(224,92,92,0.25)',
  },
  errorText: { color: Brand.error, fontSize: 13, fontWeight: '500', flex: 1 },

  // Fields
  fieldGroup: { gap: Spacing.one + 2 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { color: Brand.textSecondary, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  labelHint: { color: Brand.accent, fontSize: 11, fontStyle: 'italic' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Brand.bg3,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Brand.bg4,
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
    height: 52,
  },
  input: { flex: 1, color: Brand.textPrimary, fontSize: 15, padding: 0 },

  // CTA button
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    backgroundColor: Brand.accent,
    borderRadius: Radius.md,
    height: 54,
    ...Shadow.accent,
  },
  ctaText: { color: Brand.white, fontWeight: '800', fontSize: 16, letterSpacing: 0.2 },

  // Divider
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  dividerLine: { flex: 1, height: 1, backgroundColor: Brand.bg3 },
  dividerText: { color: Brand.textMuted, fontSize: 12 },

  // Footer
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { color: Brand.textSecondary, fontSize: 14 },
  footerLink: { color: Brand.accent, fontSize: 14, fontWeight: '700' },
});
