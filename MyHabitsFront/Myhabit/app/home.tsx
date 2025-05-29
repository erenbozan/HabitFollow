import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState, useEffect } from 'react';
import { 
  FlatList, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  ActivityIndicator,
  ViewStyle,
  SectionList,
} from 'react-native';
import { habitsApi, Habit } from '../services/api';
import { authApi } from '../services/api';
import { getColors, spacing, typography, shadows, borderRadius } from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext';

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
      backgroundColor: colors.surface,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.md,
      elevation: 2,
      shadowColor: colors.text.primary,
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
    navbar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      borderTopWidth: 1,
      paddingVertical: spacing.md,
    },
    navItem: {
      alignItems: 'center',
    },
    navText: {
      fontSize: typography.caption.fontSize,
      fontWeight: typography.caption.fontWeight,
      lineHeight: typography.caption.lineHeight,
      marginTop: spacing.xs,
    },
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getTimeUntilReset = (frequency: 'daily' | 'weekly') => {
    const now = currentTime;
    let targetDate = new Date(now);

    if (frequency === 'daily') {
      targetDate.setHours(23, 59, 59, 999);
    } else {
      const daysUntilSunday = 7 - now.getDay();
      targetDate.setDate(now.getDate() + daysUntilSunday);
      targetDate.setHours(23, 59, 59, 999);
    }

    const timeDiff = targetDate.getTime() - now.getTime();
    
    if (timeDiff <= 0) return { hours: 0, minutes: 0, seconds: 0 };

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  };

  const loadHabits = async () => {
    try {
      const habits = await habitsApi.getHabits();
      setHabits(habits);
    } catch (err) {
      setError('Failed to load habits');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadHabits();
    }, [])
  );

  const handleLogout = async () => {
    await authApi.logout();
    router.replace('/login');
  };

  const handleTrackHabit = async (habit: Habit) => {
    try {
      const updatedHabit = await habitsApi.trackHabit(habit.id);
      setHabits(habits.map(h => h.id === habit.id ? updatedHabit : h));
    } catch (err) {
      console.error('Failed to track habit:', err);
    }
  };

  const shouldResetHabit = (habit: Habit) => {
    if (!habit.last_tracked) return false;

    const lastTracked = new Date(habit.last_tracked);
    const now = new Date();

    if (habit.frequency === 'daily') {
      return lastTracked.getDate() !== now.getDate() ||
             lastTracked.getMonth() !== now.getMonth() ||
             lastTracked.getFullYear() !== now.getFullYear();
    }
    
    if (habit.frequency === 'weekly') {
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      return now.getTime() - lastTracked.getTime() >= oneWeek;
    }

    return false;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderHabit = ({ item }: { item: Habit }) => (
    <View style={[styles.habitItem, { backgroundColor: colors.surface }]}>
      <TouchableOpacity
        style={[
          styles.checkbox,
          { borderColor: colors.primary },
          item.isCompleted && { backgroundColor: colors.primary }
        ]}
        onPress={() => handleTrackHabit(item)}
      >
        {item.isCompleted && <Ionicons name="checkmark" size={18} color={colors.text.inverse} />}
      </TouchableOpacity>
      <View style={styles.habitInfo}>
        <Text style={[styles.habitText, { color: colors.text.primary }]}>{item.title}</Text>
        <Text style={[styles.habitFrequency, { color: colors.text.secondary }]}>
          {item.frequency === 'daily' ? 'Every day' : 'Every week'}
        </Text>
        {item.last_tracked && (
          <Text style={[styles.lastTracked, { color: colors.text.disabled }]}>
            Last done: {formatDateTime(item.last_tracked)}
          </Text>
        )}
      </View>
    </View>
  );

  const getSections = (): Section[] => {
    const dailyHabits = habits.filter(h => h.frequency === 'daily');
    const weeklyHabits = habits.filter(h => h.frequency === 'weekly');
    
    return [
      { title: 'Daily Habits', data: dailyHabits },
      { title: 'Weekly Habits', data: weeklyHabits }
    ];
  };

  const renderSectionHeader = ({ section }: { section: Section }) => {
    const timeLeft = getTimeUntilReset(section.title.toLowerCase().includes('daily') ? 'daily' : 'weekly');
    
    return (
      <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
        <View style={styles.sectionHeaderContent}>
          <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
            {section.title}
          </Text>
          <View style={styles.countdownContainer}>
            <Ionicons name="time-outline" size={20} color={colors.text.secondary} style={styles.clockIcon} />
            <Text style={[styles.countdownText, { color: colors.text.secondary }]}>
              {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
            </Text>
          </View>
        </View>
      </View>
    );
  };

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
          style={[styles.retryButton, { backgroundColor: colors.primary }]} 
          onPress={loadHabits}
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
          <Text style={[styles.title, { color: colors.text.primary }]}>Habit Checklist</Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>Track your progress</Text>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={toggleTheme}
          >
            <Ionicons 
              name={theme === 'light' ? 'moon' : 'sunny'} 
              size={24} 
              color={colors.text.secondary} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>
      </View>

      {habits.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="list" size={48} color={colors.text.disabled} />
          <Text style={[styles.emptyStateText, { color: colors.text.secondary }]}>No habits yet</Text>
          <Text style={[styles.emptyStateSubtext, { color: colors.text.disabled }]}>
            Start by adding your first habit
          </Text>
        </View>
      ) : (
        <SectionList
          sections={getSections()}
          renderItem={renderHabit}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={item => item.id.toString()}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled={true}
        />
      )}

      <View style={[styles.navbar, { 
        backgroundColor: colors.surface,
        borderTopColor: colors.border.light 
      }]}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color={colors.primary} />
          <Text style={[styles.navText, { color: colors.primary }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/add-habit')}
        >
          <Ionicons name="add-circle-outline" size={24} color={colors.text.secondary} />
          <Text style={[styles.navText, { color: colors.text.secondary }]}>Add Habit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 