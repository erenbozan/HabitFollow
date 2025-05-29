import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform } from 'react-native';
import { authApi } from '@/services/api';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { getColors, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';

export default function LoginScreen() {
  const { theme } = useTheme();
  const colors = getColors(theme);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async () => {
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      if (isRegistering) {
        await authApi.register(username, password);
      } else {
        await authApi.login(username, password);
      }
      router.replace('/(tabs)');
    } catch (err: any) {
      console.error('Auth error:', err.response?.data || err.message);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(isRegistering ? 'Registration failed. Please try again.' : 'Invalid credentials');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.primary }]}>MyHabits</Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            {isRegistering 
              ? 'Create an account to start tracking your habits'
              : 'Welcome back! Sign in to continue'
            }
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            editable={!isLoading}
          />
          
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />

          {error ? (
            <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
          ) : null}

          <Button
            title={isRegistering ? 'Create Account' : 'Sign In'}
            onPress={handleSubmit}
            loading={isLoading}
            disabled={isLoading}
            style={styles.submitButton}
          />

          <Button
            title={isRegistering ? 'Already have an account? Sign In' : 'Need an account? Register'}
            onPress={toggleMode}
            variant="outline"
            disabled={isLoading}
            style={styles.toggleButton}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  title: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight,
    lineHeight: typography.h1.lineHeight,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.body1.fontSize,
    fontWeight: typography.body1.fontWeight,
    lineHeight: typography.body1.lineHeight,
    textAlign: 'center',
  },
  form: {
    marginTop: spacing.xl,
  },
  error: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,
    lineHeight: typography.caption.lineHeight,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  submitButton: {
    marginTop: spacing.lg,
  },
  toggleButton: {
    marginTop: spacing.md,
  },
}); 