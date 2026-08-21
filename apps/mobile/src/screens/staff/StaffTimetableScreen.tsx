import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, borderRadius, fontSize, spacing, shadows } from '../../theme';
import { Card, Badge, Loader } from '../../components';

const DAYS = [
  { label: 'Mon', value: 1, name: 'Monday' },
  { label: 'Tue', value: 2, name: 'Tuesday' },
  { label: 'Wed', value: 3, name: 'Wednesday' },
  { label: 'Thu', value: 4, name: 'Thursday' },
  { label: 'Fri', value: 5, name: 'Friday' },
  { label: 'Sat', value: 6, name: 'Saturday' },
];

export function StaffTimetableScreen({ navigation }: any) {
  const { staff } = useAuthStore();
  const { staffTimetable, fetchStaffTimetable } = useDataStore();
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;

  const currentDayOfWeek = new Date().getDay() || 1; // fallback Monday if Sunday
  const [activeDay, setActiveDay] = useState(currentDayOfWeek > 6 ? 1 : currentDayOfWeek);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (staff?.id) {
      setLoading(true);
      fetchStaffTimetable(staff.id).finally(() => setLoading(false));
    }
  }, [staff?.id]);

  const filtered = (staffTimetable || []).filter((item: any) => item.day_of_week === activeDay);

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    const hr = parseInt(parts[0], 10);
    const min = parts[1];
    const ampm = hr >= 12 ? 'PM' : 'AM';
    const formattedHr = hr % 12 || 12;
    return `${formattedHr}:${min} ${ampm}`;
  };

  const isActiveSlot = (start: string, end: string) => {
    try {
      const now = new Date();
      if (now.getDay() !== activeDay) return false;

      const currentMin = now.getHours() * 60 + now.getMinutes();

      const startParts = start.split(':');
      const startMin = parseInt(startParts[0], 10) * 60 + parseInt(startParts[1], 10);

      const endParts = end.split(':');
      const endMin = parseInt(endParts[0], 10) * 60 + parseInt(endParts[1], 10);

      return currentMin >= startMin && currentMin <= endMin;
    } catch {
      return false;
    }
  };

  if (loading) return <Loader fullScreen message="Loading timetable..." />;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Timetable</Text>
        <View style={styles.placeholderButton} />
      </View>

      {/* Week Selector tabs */}
      <View style={[styles.tabBar, { borderBottomColor: colors.borderLight }]}>
        {DAYS.map((d) => {
          const isSelected = activeDay === d.value;
          return (
            <TouchableOpacity
              key={d.value}
              onPress={() => setActiveDay(d.value)}
              style={[styles.tabItem, isSelected && { borderBottomColor: '#6D4CFF' }]}
            >
              <Text style={[styles.tabLabel, { color: isSelected ? '#6D4CFF' : colors.textMuted }]}>
                {d.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
            <Ionicons name="calendar-outline" size={48} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>No classes scheduled for this day</Text>
          </View>
        ) : (
          filtered.map((item: any) => {
            const active = isActiveSlot(item.start_time, item.end_time);
            return (
              <View {...{key: item.id}} style={[styles.periodCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs] as any}>
                <View style={styles.periodHeader}>
                  <Text style={[styles.periodTime, { color: colors.text }]}>
                    {formatTime(item.start_time)} - {formatTime(item.end_time)}
                  </Text>
                  {active && <Badge label="NOW" variant="success" />}
                </View>
                <Text style={[styles.subjectName, { color: colors.text }]}>
                  {item.subject?.name || 'Class Period'}
                </Text>
                <View style={styles.periodFooter}>
                  <Text style={[styles.metaText, { color: colors.textMuted }]}>
                    Class: {item.class?.name || 'N/A'}
                  </Text>
                  <Text style={[styles.metaText, { color: colors.textMuted }]}>
                    Room: {item.room_number || 'N/A'}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
  },
  backButton: { padding: spacing.xs },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  placeholderButton: { width: 32 },
  tabBar: { flexDirection: 'row', height: 48, borderBottomWidth: 1 },
  tabItem: { flex: 1, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabLabel: { fontSize: fontSize.xs, fontWeight: '700' },
  scroll: { padding: spacing.lg },
  emptyCard: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.xl, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: fontSize.sm, marginTop: spacing.sm, fontWeight: '500' },
  periodCard: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.md, marginBottom: spacing.sm },
  periodHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  periodTime: { fontSize: 11, fontWeight: '700' },
  subjectName: { fontSize: fontSize.md, fontWeight: '700', marginVertical: 4 },
  periodFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs },
  metaText: { fontSize: 11 },
});
