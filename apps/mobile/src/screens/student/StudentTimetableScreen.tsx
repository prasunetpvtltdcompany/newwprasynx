import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, fontSize, spacing, borderRadius, shadows } from '../../theme';
import { Badge } from '../../components';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export function StudentTimetableScreen() {
  const { student } = useAuthStore();
  const { timetable, fetchTimetable } = useDataStore();
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;

  const todayIndex = new Date().getDay();
  const defaultDay = todayIndex >= 1 && todayIndex <= 5 ? DAYS[todayIndex - 1] : 'Monday';
  const [selectedDay, setSelectedDay] = useState(defaultDay);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    if (student?.id) {
      await fetchTimetable(student.id);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, [student?.id]);

  // Group classes dynamically by day
  const groupedTimetable: Record<string, any[]> = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
  };

  (timetable || []).forEach((item: any) => {
    let day = item.day || item.day_of_week || 'Monday';
    if (day.startsWith('Mon') || day === '1') day = 'Monday';
    else if (day.startsWith('Tue') || day === '2') day = 'Tuesday';
    else if (day.startsWith('Wed') || day === '3') day = 'Wednesday';
    else if (day.startsWith('Thu') || day === '4') day = 'Thursday';
    else if (day.startsWith('Fri') || day === '5') day = 'Friday';
    else return; // Ignore weekends or invalid days

    const timeString = item.time || `${item.start_time || '09:00 AM'} - ${item.end_time || '10:00 AM'}`;
    const subjectName = item.subject || item.subjects?.name || 'Class';
    const teacherName = item.teacher_name || item.staff_records?.full_name || 'Staff';

    groupedTimetable[day].push({
      id: item.id,
      time: timeString,
      subject: subjectName,
      teacher: teacherName,
      room: item.room || 'Room 101'
    });
  });

  const periods = groupedTimetable[selectedDay] || [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Timetable</Text>
      </View>

      <View style={[styles.dayTabs, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        {DAYS.map((day, idx) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayTab,
              selectedDay === day && { borderBottomColor: '#6D4CFF', borderBottomWidth: 3 },
            ]}
            onPress={() => setSelectedDay(day)}
          >
            <Text
              style={[
                styles.dayTabText,
                { color: selectedDay === day ? '#6D4CFF' : colors.textSecondary },
                selectedDay === day && { fontWeight: '700' },
              ]}
            >
              {DAYS_SHORT[idx]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      >
        {periods.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={48} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>No classes scheduled for {selectedDay}</Text>
          </View>
        ) : (
          periods.map((period, index) => (
            <View
              key={period.id || index}
              style={[
                styles.periodCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.borderLight,
                  borderLeftColor: '#6D4CFF',
                  borderLeftWidth: 4,
                },
                shadows.xs
              ]}
            >
              <View style={styles.periodHeader}>
                <Text style={[styles.periodTime, { color: colors.textMuted }]}>{period.time}</Text>
              </View>
              <Text style={[styles.periodSubject, { color: colors.text }]}>
                {period.subject}
              </Text>
              <View style={styles.periodDetails}>
                <Text style={[styles.periodTeacher, { color: colors.textMuted }]}>
                  👨‍🏫 {period.teacher}
                </Text>
                <Text style={[styles.periodRoom, { color: colors.textMuted }]}>
                  🏫 Room {period.room}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  scroll: { padding: spacing.md, paddingBottom: spacing.xxl },
  dayTabs: { flexDirection: 'row', borderBottomWidth: 1 },
  dayTab: { flex: 1, alignItems: 'center', paddingVertical: spacing.md },
  dayTabText: { fontSize: fontSize.sm, fontWeight: '600' },
  periodCard: {
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  periodHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  periodTime: { fontSize: fontSize.xs, fontWeight: '500' },
  periodSubject: { fontSize: fontSize.md, fontWeight: '600', marginTop: spacing.xs },
  periodDetails: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.sm },
  periodTeacher: { fontSize: fontSize.xs, fontWeight: '500' },
  periodRoom: { fontSize: fontSize.xs, fontWeight: '500' },
  emptyContainer: { paddingVertical: spacing.xxl * 2, alignItems: 'center' },
  emptyText: { fontSize: fontSize.sm, fontWeight: '500', marginTop: spacing.sm },
});
