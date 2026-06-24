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

type Role = 'user' | 'admin';

const ROLES: { value: Role; label: string; desc: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: 'user',  label: 'Member',    desc: 'Join & participate in groups',  icon: 'person-outline'           },
  { value: 'admin', label: 'Organizer', desc: 'Create & manage ekub groups',   icon: 'shield-checkmark-outline' },
];

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName]           = useState('');
  const [phone, setPhone]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [role, setRole]           = useState<Role>('user');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const handleRegister = async () => {
    if (!name || !phone || !password) { setError('Please fill in all fields.'); return; }
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

          {/* ── Brand ── */}
          <View style={styles.brand}>
            <View style={styles.logoRing}>
              <Ionicons name="trending-up" size={28} color={Brand.accent} />
            </View>
            <ThemedText style={styles.wordmark}>ekub</ThemedText>
            <ThemedText style={styles.tagline}>Create your account</ThemedText>
          </View>

          {/* ── Card ── */}
          <View style={styles.card}>
            <ThemedText style={styles.cardHeading}>Get started</ThemedText>
            <ThemedText style={styles.cardSub}>Join thousands saving together</ThemedText>

            {/* Error */}
            {error && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle-outline" size={16} color={Brand.error} />
                <ThemedText style={styles.errorText}>{error}</ThemedText>
              </View>
            )}

            {/* Full name */}
            <View style={styles.fieldGroup}>
              <ThemedText style={styles.label}>FULL NAME</ThemedText>
              <View style={styles.inputRow}>
                <Ionicons name="person-outline" size={18} color={Brand.textSecondary} />
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

            {/* Password */}
            <View style={styles.fieldGroup}>
              <ThemedText style={styles.label}>PASSWORD</ThemedText>
              <View style={styles.inputRow}>
                <Ionicons name="lock-closed-outline" size={18} color={Brand.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="Create a strong password"
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

            {/* Role selector */}
            <View style={styles.fieldGroup}>
              <ThemedText style={styles.label}>ACCOUNT ROLE</ThemedText>
              <View style={styles.roleRow}>
                {ROLES.map(r => {
                  const isActive = role === r.value;
                  return (
                    <Pressable
                      key={r.value}
                      style={[styles.roleCard, isActive && styles.roleCardActive]}
                      onPress={() => setRole(r.value)}>
                      <View style={[styles.roleIconWrap, isActive && styles.roleIconWrapActive]}>
                        <Ionicons
                          name={r.icon}
                          size={20}
                          color={isActive ? Brand.white : Brand.textSecondary}
                        />
                      </View>
                      <ThemedText style={[styles.roleLabel, isActive && styles.roleLabelActive]}>
                        {r.label}
                      </ThemedText>
                      <ThemedText style={styles.roleDesc}>{r.desc}</ThemedText>
                      {isActive && (
                        <View style={styles.checkMark}>
                          <Ionicons name="checkmark" size={10} color={Brand.white} />
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* OTP info */}
            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={16} color={Brand.accent} />
              <ThemedText style={styles.infoText}>
                Your default OTP code will be{' '}
                <ThemedText style={styles.infoCode}>123456</ThemedText>
                {' '}— update it in settings after login.
              </ThemedText>
            </View>

            {/* CTA */}
            <Pressable
              style={({ pressed }) => [styles.cta, { opacity: pressed || loading ? 0.85 : 1 }]}
              onPress={handleRegister}
              disabled={loading}>
              {loading
                ? <ActivityIndicator color={Brand.white} size="small" />
                : <>
                    <ThemedText style={styles.ctaText}>Create Account</ThemedText>
                    <Ionicons name="arrow-forward" size={18} color={Brand.white} />
                  </>
              }
            </Pressable>

            {/* Footer */}
            <View style={styles.footer}>
              <ThemedText style={styles.footerText}>Already have an account? </ThemedText>
              <Pressable onPress={() => router.push('/(auth)/login')}>
                <ThemedText style={styles.footerLink}>Sign in</ThemedText>
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

  brand: { alignItems: 'center', gap: Spacing.two },
  logoRing: {
    width: 64, height: 64,
    borderRadius: Radius.xl,
    backgroundColor: Brand.accentMuted,
    borderWidth: 1.5,
    borderColor: Brand.accentBorder,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.accent,
  },
  wordmark: { color: Brand.textPrimary, fontSize: 30, fontWeight: '800', letterSpacing: -1 },
  tagline:  { color: Brand.textSecondary, fontSize: 13 },

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
  cardSub:     { color: Brand.textSecondary, fontSize: 14, marginTop: -Spacing.two },

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

  fieldGroup: { gap: Spacing.one + 2 },
  label: { color: Brand.textSecondary, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
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

  // Role
  roleRow: { flexDirection: 'row', gap: Spacing.two },
  roleCard: {
    flex: 1,
    backgroundColor: Brand.bg3,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Brand.bg4,
    padding: Spacing.three,
    alignItems: 'center',
    gap: Spacing.one,
    position: 'relative',
  },
  roleCardActive: { borderColor: Brand.accent, backgroundColor: Brand.accentMuted },
  roleIconWrap: {
    width: 40, height: 40,
    borderRadius: Radius.md,
    backgroundColor: Brand.bg4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.one,
  },
  roleIconWrapActive: { backgroundColor: Brand.accent, ...Shadow.accent },
  roleLabel:        { color: Brand.textSecondary, fontSize: 13, fontWeight: '700' },
  roleLabelActive:  { color: Brand.textPrimary },
  roleDesc:         { color: Brand.textMuted, fontSize: 10, textAlign: 'center', lineHeight: 14 },
  checkMark: {
    position: 'absolute', top: 8, right: 8,
    width: 18, height: 18,
    borderRadius: Radius.full,
    backgroundColor: Brand.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Info box
  infoBox: {
    flexDirection: 'row',
    gap: Spacing.one + 2,
    alignItems: 'flex-start',
    backgroundColor: Brand.accentMuted,
    borderRadius: Radius.md,
    padding: Spacing.two + 4,
    borderWidth: 1,
    borderColor: Brand.accentBorder,
  },
  infoText: { color: Brand.textSecondary, fontSize: 12, lineHeight: 18, flex: 1 },
  infoCode: { color: Brand.accent, fontWeight: '700' },

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

  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { color: Brand.textSecondary, fontSize: 14 },
  footerLink: { color: Brand.accent, fontSize: 14, fontWeight: '700' },
});
