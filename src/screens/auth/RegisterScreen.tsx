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

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    setError(null);
    setLoading(true);
    try {
      await register(email, password, name);
      router.replace('/(app)');
    } catch (err: any) {
      setError(err?.message || 'Failed to register account. Please try again.');
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
              Create Account
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
              Join Digital Ekub and start saving together
            </ThemedText>
          </View>

          <ThemedView type="backgroundElement" style={styles.card}>
            {error && (
              <View style={styles.errorBox}>
                <ThemedText style={styles.errorText}>{error}</ThemedText>
              </View>
            )}

            <View style={styles.inputContainer}>
              <ThemedText type="smallBold" themeColor="textSecondary">
                FULL NAME
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
                placeholder="Enter your full name"
                placeholderTextColor={colorScheme === 'dark' ? '#80848C' : '#90949C'}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText type="smallBold" themeColor="textSecondary">
                EMAIL ADDRESS
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
                placeholder="Enter your email"
                placeholderTextColor={colorScheme === 'dark' ? '#80848C' : '#90949C'}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

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
                placeholder="Create a strong password"
                placeholderTextColor={colorScheme === 'dark' ? '#80848C' : '#90949C'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                {
                  backgroundColor: '#4A3AFF', // Vibrant modern brand color
                  opacity: pressed || loading ? 0.8 : 1,
                },
              ]}
              onPress={handleRegister}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <ThemedText style={styles.buttonText}>Register</ThemedText>
              )}
            </Pressable>

            <View style={styles.footer}>
              <ThemedText type="small" themeColor="textSecondary">
                Already have an account?{' '}
              </ThemedText>
              <Pressable onPress={() => router.push('/(auth)/login')}>
                <ThemedText type="smallBold" style={styles.linkText}>
                  Sign in here
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
