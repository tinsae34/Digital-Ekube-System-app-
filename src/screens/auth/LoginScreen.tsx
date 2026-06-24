import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/services/authContext';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('123456'); // Pre-fill with placeholder OTP for convenience
  const [authMode, setAuthMode] = useState<'password' | 'otp'>('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!phone) {
      setError('Please enter your phone number.');
      return;
    }
    
    if (authMode === 'password' && !password) {
      setError('Please enter your password.');
      return;
    }

    if (authMode === 'otp' && !otp) {
      setError('Please enter your OTP code.');
      return;
    }
    
    setError(null);
    setLoading(true);
    try {
      if (authMode === 'password') {
        await login(phone, password, undefined);
      } else {
        await login(phone, undefined, otp);
      }
      router.replace('/(app)');
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <ThemedText style={styles.logoText}>🇪</ThemedText>
            </View>
            <ThemedText type="title" style={styles.title}>
              Digital Ekub
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
              Save and pool money securely with your trusted groups
            </ThemedText>
          </View>

          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedText type="subtitle" style={styles.cardTitle}>
              Welcome Back
            </ThemedText>

            {/* Password vs OTP Mode Selector */}
            <View style={[
              styles.modeSelector,
              { backgroundColor: colorScheme === 'dark' ? '#18191B' : '#E6E7EB' }
            ]}>
              <Pressable
                style={[
                  styles.modeButton,
                  authMode === 'password' && {
                    backgroundColor: colorScheme === 'dark' ? '#2E3135' : '#FFFFFF',
                  }
                ]}
                onPress={() => {
                  setError(null);
                  setAuthMode('password');
                }}>
                <ThemedText type={authMode === 'password' ? 'smallBold' : 'small'}>
                  Password
                </ThemedText>
              </Pressable>
              
              <Pressable
                style={[
                  styles.modeButton,
                  authMode === 'otp' && {
                    backgroundColor: colorScheme === 'dark' ? '#2E3135' : '#FFFFFF',
                  }
                ]}
                onPress={() => {
                  setError(null);
                  setAuthMode('otp');
                }}>
                <ThemedText type={authMode === 'otp' ? 'smallBold' : 'small'}>
                  OTP Placeholder
                </ThemedText>
              </Pressable>
            </View>
            
            {error && (
              <View style={styles.errorBox}>
                <ThemedText style={styles.errorText}>{error}</ThemedText>
              </View>
            )}

            <View style={styles.inputContainer}>
              <ThemedText type="smallBold" themeColor="textSecondary">
                PHONE NUMBER
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.text,
                    backgroundColor: colorScheme === 'dark' ? '#18191B' : '#E6E7EB',
                    borderColor: colorScheme === 'dark' ? '#2E3135' : '#D1D3D8',
                  },
                ]}
                placeholder="e.g. +251912345678"
                placeholderTextColor={colorScheme === 'dark' ? '#80848C' : '#90949C'}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                autoCapitalize="none"
              />
            </View>

            {authMode === 'password' ? (
              <View style={styles.inputContainer}>
                <ThemedText type="smallBold" themeColor="textSecondary">
                  PASSWORD
                </ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: theme.text,
                      backgroundColor: colorScheme === 'dark' ? '#18191B' : '#E6E7EB',
                      borderColor: colorScheme === 'dark' ? '#2E3135' : '#D1D3D8',
                    },
                  ]}
                  placeholder="Enter your password"
                  placeholderTextColor={colorScheme === 'dark' ? '#80848C' : '#90949C'}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            ) : (
              <View style={styles.inputContainer}>
                <View style={styles.otpHeader}>
                  <ThemedText type="smallBold" themeColor="textSecondary">
                    OTP CODE
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary" style={styles.otpHint}>
                    (Use placeholder: 123456)
                  </ThemedText>
                </View>
                <TextInput
                  style={[
                    styles.input,
                    {
                      color: theme.text,
                      backgroundColor: colorScheme === 'dark' ? '#18191B' : '#E6E7EB',
                      borderColor: colorScheme === 'dark' ? '#2E3135' : '#D1D3D8',
                    },
                  ]}
                  placeholder="Enter 6-digit OTP code"
                  placeholderTextColor={colorScheme === 'dark' ? '#80848C' : '#90949C'}
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  maxLength={6}
                  autoCapitalize="none"
                />
              </View>
            )}

            <Pressable
              style={({ pressed }) => [
                styles.button,
                {
                  backgroundColor: '#4A3AFF',
                  opacity: pressed || loading ? 0.8 : 1,
                },
              ]}
              onPress={handleLogin}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <ThemedText style={styles.buttonText}>
                  {authMode === 'password' ? 'Sign In with Password' : 'Sign In with OTP'}
                </ThemedText>
              )}
            </Pressable>

            <View style={styles.footer}>
              <ThemedText type="small" themeColor="textSecondary">
                Don't have an account?{' '}
              </ThemedText>
              <Pressable onPress={() => router.push('/(auth)/register')}>
                <ThemedText type="smallBold" style={styles.linkText}>
                  Register here
                </ThemedText>
              </Pressable>
            </View>
          </ThemedView>

        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.four,
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.five,
    gap: Spacing.two,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#4A3AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.two,
    shadowColor: '#4A3AFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    paddingHorizontal: Spacing.three,
    lineHeight: 18,
  },
  card: {
    padding: Spacing.four,
    borderRadius: 24,
    gap: Spacing.three,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: Spacing.one,
  },
  modeSelector: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginBottom: Spacing.one,
  },
  modeButton: {
    flex: 1,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  errorBox: {
    backgroundColor: '#FFEBEE',
    padding: Spacing.three,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 13,
    fontWeight: '500',
  },
  inputContainer: {
    gap: Spacing.one,
  },
  otpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  otpHint: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    fontSize: 15,
  },
  button: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  linkText: {
    color: '#4A3AFF',
  },
});
