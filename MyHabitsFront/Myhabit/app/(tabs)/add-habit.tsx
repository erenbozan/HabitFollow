import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { habitsApi } from '@/services/api';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { getColors, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';

interface CreateHabitParams {
  title: string;
  frequency: 'daily' | 'weekly';
}

export default function AddHabitScreen() {
  const { theme } = useTheme();
  const colors = getColors(theme);
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Please enter a habit title');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const params: CreateHabitParams = {
        title: title.trim(),
        frequency,
      };
      await habitsApi.createHabit(params);
      router.replace('/(tabs)');
    } catch (err: any) {
      console.error('Failed to create habit:', err);
      setError(err.response?.data?.message || 'Failed to create habit');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.title, { color: colors.text.primary }]}>Add New Habit</Text>
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
          Create a new daily or weekly habit
        </Text>
      </View>
      
      <View style={styles.content}>
        <Input
          label="Habit Title"
          value={title}
          onChangeText={setTitle}
          placeholder="Enter your habit"
          autoFocus
          editable={!isLoading}
          error={error}
        />

        <View style={styles.frequencyContainer}>
          <Button
            title="Daily"
            variant={frequency === 'daily' ? 'primary' : 'outline'}
            onPress={() => setFrequency('daily')}
            disabled={isLoading}
            style={styles.frequencyButton}
          />
          <Button
            title="Weekly"
            variant={frequency === 'weekly' ? 'primary' : 'outline'}
            onPress={() => setFrequency('weekly')}
            disabled={isLoading}
            style={styles.frequencyButton}
          />
        </View>

        <Button
          title="Create Habit"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
          style={styles.submitButton}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    lineHeight: typography.h2.lineHeight,
  },
  subtitle: {
    fontSize: typography.body2.fontSize,
    fontWeight: typography.body2.fontWeight,
    lineHeight: typography.body2.lineHeight,
    marginTop: spacing.xs,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
  },
  frequencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  frequencyButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  submitButton: {
    marginTop: spacing.lg,
  },
}); 