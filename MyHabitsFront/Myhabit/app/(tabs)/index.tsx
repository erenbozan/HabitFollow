import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  ActivityIndicator,
  SectionList,
} from 'react-native';
import { habitsApi, Habit } from '@/services/api';
import { authApi } from '@/services/api';
import { getColors, spacing, typography, shadows, borderRadius } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface Section {
  title: string;
  data: Habit[];
}

export default function HomeScreen() {
  const { theme, toggleTheme } = useTheme();
  const colors = getColors(theme);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHabits();
    }, [])
  );

  const loadHabits = async () => {
    try {
      const data = await habitsApi.getHabits();
      setHabits(data);
      setError('');
    } catch (err) {
      console.error('Failed to load habits:', err);
      setError('Failed to load habits');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await authApi.logout();
    router.replace('/login');
  };

  const handleTrackHabit = async (habit: Habit) => {
    try {
      await habitsApi.trackHabit(habit.id);
      loadHabits();
    } catch (err) {
      console.error('Failed to track habit:', err);
    }
  };

  const getTimeUntilReset = (frequency: 'daily' | 'weekly') => {
    const now = currentTime;
    let resetTime = new Date(now);
    
    if (frequency === 'daily') {
      resetTime.setHours(24, 0, 0, 0);
    } else {
      // For weekly, reset on Sunday at midnight
      const daysUntilSunday = 7 - now.getDay();
      resetTime.setDate(now.getDate() + daysUntilSunday);
      resetTime.setHours(0, 0, 0, 0);
    }
    
    const diff = resetTime.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderHabit = ({ item }: { item: Habit }) => (
    <TouchableOpacity
      onPress={() => handleTrackHabit(item)}
      style={[styles.habitItem, { backgroundColor: colors.surface }]}
    >
      <View style={[
        styles.checkbox,
        { 
          borderColor: item.isCompleted ? colors.secondary : colors.text.disabled,
          backgroundColor: item.isCompleted ? colors.secondary : 'transparent'
        }
      ]}>
        {item.isCompleted && (
          <Ionicons name="checkmark" size={16} color={colors.text.inverse} />
        )}
      </View>
      <View style={styles.habitInfo}>
        <Text style={[styles.habitText, { color: colors.text.primary }]}>{item.title}</Text>
        <Text style={[styles.habitFrequency, { color: colors.text.secondary }]}>
          {item.frequency.charAt(0).toUpperCase() + item.frequency.slice(1)}
        </Text>
        <Text style={[styles.lastTracked, { color: colors.text.disabled }]}>
          Last tracked: {formatDateTime(item.last_tracked)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const getSections = (): Section[] => {
    return [
      { title: 'Daily Habits', data: habits.filter(h => h.frequency === 'daily') },
      { title: 'Weekly Habits', data: habits.filter(h => h.frequency === 'weekly') },
    ];
  };

  const renderSectionHeader = ({ section }: { section: Section }) => (
    <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
      <View style={styles.sectionHeaderContent}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>{section.title}</Text>
        <View style={styles.countdownContainer}>
          <Ionicons name="time-outline" size={16} color={colors.text.primary} style={styles.clockIcon} />
          <Text style={[styles.countdownText, { color: colors.text.primary }]}>
            {getTimeUntilReset(section.title.toLowerCase().includes('daily') ? 'daily' : 'weekly')}
          </Text>
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
        <TouchableOpacity
          onPress={loadHabits}
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.retryText, { color: colors.text.inverse }]}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View>
          <Text style={[styles.title, { color: colors.text.primary }]}>My Habits</Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            Track your daily and weekly habits
          </Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={toggleTheme}
            style={[styles.iconButton, { backgroundColor: colors.surface }]}
          >
            <Ionicons 
              name={theme === 'dark' ? 'moon' : 'sunny'}
              size={24}
              color={colors.text.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLogout}
            style={[styles.iconButton, { backgroundColor: colors.surface }]}
          >
            <Ionicons name="log-out-outline" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {habits.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="add-circle-outline" size={64} color={colors.text.disabled} />
          <Text style={[styles.emptyStateText, { color: colors.text.primary }]}>
            No habits yet
          </Text>
          <Text style={[styles.emptyStateSubtext, { color: colors.text.secondary }]}>
            Add your first habit to get started
          </Text>
        </View>
      ) : (
        <SectionList
          sections={getSections()}
          renderItem={renderHabit}
          renderSectionHeader={renderSectionHeader}
          style={styles.list}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
    ...shadows.sm,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.full,
    marginLeft: spacing.sm,
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
  sectionHeader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    lineHeight: typography.h3.lineHeight,
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  clockIcon: {
    marginRight: spacing.sm,
  },
  countdownText: {
    fontSize: typography.body1.fontSize,
    fontWeight: typography.body1.fontWeight,
    lineHeight: typography.body1.lineHeight,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: spacing.lg,
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    marginRight: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitInfo: {
    flex: 1,
  },
  habitText: {
    fontSize: typography.body1.fontSize,
    fontWeight: typography.body1.fontWeight,
    lineHeight: typography.body1.lineHeight,
    marginBottom: spacing.xs,
  },
  habitFrequency: {
    fontSize: typography.body2.fontSize,
    fontWeight: typography.body2.fontWeight,
    lineHeight: typography.body2.lineHeight,
    marginBottom: spacing.xs,
  },
  lastTracked: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,
    lineHeight: typography.caption.lineHeight,
  },
  error: {
    fontSize: typography.body1.fontSize,
    fontWeight: typography.body1.fontWeight,
    lineHeight: typography.body1.lineHeight,
    marginBottom: spacing.md,
  },
  retryButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  retryText: {
    fontSize: typography.body2.fontSize,
    fontWeight: typography.body2.fontWeight,
    lineHeight: typography.body2.lineHeight,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyStateText: {
    fontSize: typography.h3.fontSize,
    fontWeight: typography.h3.fontWeight,
    lineHeight: typography.h3.lineHeight,
    marginTop: spacing.lg,
  },
  emptyStateSubtext: {
    fontSize: typography.body2.fontSize,
    fontWeight: typography.body2.fontWeight,
    lineHeight: typography.body2.lineHeight,
    marginTop: spacing.xs,
  },
});
