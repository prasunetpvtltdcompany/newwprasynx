import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, borderRadius, fontSize, spacing, shadows } from '../../theme';

export function StaffDashboardScreen({ navigation }: any) {
  const { user, staff } = useAuthStore();
  const { staffDashboard, fetchStaffDashboard, staffTimetable, fetchStaffTimetable } = useDataStore();
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;

  const loadData = async () => {
    if (staff?.id) {
      await fetchStaffDashboard(staff.id);
      await fetchStaffTimetable(staff.id);
    }
  };

  useEffect(() => {
    loadData();
  }, [staff?.id]);

  // Compute stats
  const studentsCount = staffDashboard?.assignedStudents || 0;
  const classesCount = staffDashboard?.classes?.length || 0;
  const assignmentsCount = staffDashboard?.totalAssignments || 0;

  // Filter timetable for today
  // JavaScript getDay() returns 0 for Sunday, 1 for Monday... 6 for Saturday
  const todayDayNum = new Date().getDay();
  // Map JS day to timetable day_of_week
  const todayClasses = (staffTimetable || []).filter((item: any) => item.day_of_week === todayDayNum);

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good Morning';
    if (hr < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getInitials = (name: string) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'TR';
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    const hr = parseInt(parts[0], 10);
    const min = parts[1];
    const ampm = hr >= 12 ? 'PM' : 'AM';
    const formattedHr = hr % 12 || 12;
    return `${formattedHr}:${min} ${ampm}`;
  };

  // Determine if active slot
  const isActiveSlot = (start: string, end: string) => {
    try {
      const now = new Date();
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Curved Gradient Header */}
        <LinearGradient
          colors={['#7C3AED', '#6D4CFF', '#5B21B6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroRow}>
            <View style={[styles.avatarCircle, { backgroundColor: '#FFFFFF30' }]}>
              <Text style={styles.avatarText}>{getInitials(user?.full_name || 'PR')}</Text>
            </View>
            <View style={styles.heroText}>
              <Text style={styles.heroGreeting}>{getGreeting()},</Text>
              <Text style={styles.heroName}>{user?.full_name || 'Instructor'} 👋</Text>
              <Text style={styles.heroSub}>Welcome back!</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('StaffNotifications')} style={styles.iconBtn}>
              <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Overview Cards Row */}
        <View style={styles.metricsContainer}>
          <View style={[styles.metricCard, { backgroundColor: colors.surface }, shadows.sm]}>
            <Ionicons name="calendar-outline" size={18} color="#6D4CFF" />
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {todayClasses.length.toString().padStart(2, '0')}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Today's Classes</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: colors.surface }, shadows.sm]}>
            <Ionicons name="people-outline" size={18} color="#10B981" />
            <Text style={[styles.metricValue, { color: colors.text }]}>{studentsCount}</Text>
            <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Total Students</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: colors.surface }, shadows.sm]}>
            <Ionicons name="document-text-outline" size={18} color="#EF4444" />
            <Text style={[styles.metricValue, { color: colors.text }]}>{assignmentsCount}</Text>
            <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Homework Tasks</Text>
          </View>
        </View>

        {/* Schedule */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Schedule</Text>
          {todayClasses.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
              <Ionicons name="calendar-clear-outline" size={40} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No classes scheduled for today</Text>
            </View>
          ) : (
            todayClasses.map((item: any) => {
              const active = isActiveSlot(item.start_time, item.end_time);
              return (
                <View {...{key: item.id}} style={[styles.classCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs] as any}>
                  <View style={styles.classTimeCol}>
                    <Text style={[styles.classTimeText, { color: colors.text }]}>{formatTime(item.start_time)}</Text>
                    {active && (
                      <View style={styles.nowBadge}>
                        <Text style={styles.nowText}>NOW</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.classInfoCol}>
                    <Text style={[styles.classSubject, { color: colors.text }]}>{item.subject?.name || 'Class Period'}</Text>
                    <Text style={[styles.classMeta, { color: colors.textMuted }]}>
                      Class {item.class?.name || 'N/A'} • {item.room_number || 'Room 101'}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity onPress={() => navigation.navigate('Attendance')} style={[styles.actionBtn, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
              <Ionicons name="checkbox-outline" size={24} color="#6D4CFF" />
              <Text style={[styles.actionLabelText, { color: colors.text }]}>Mark Attendance</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Assignments')} style={[styles.actionBtn, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
              <Ionicons name="add-circle-outline" size={24} color="#6D4CFF" />
              <Text style={[styles.actionLabelText, { color: colors.text }]}>Add Homework</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('StaffMessages')} style={[styles.actionBtn, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
              <Ionicons name="chatbubble-ellipses-outline" size={24} color="#6D4CFF" />
              <Text style={[styles.actionLabelText, { color: colors.text }]}>Send Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Portal Shortcuts */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Portal Services</Text>
          <View style={[styles.shortcutCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
            <View style={styles.shortcutRow}>
              <TouchableOpacity onPress={() => navigation.navigate('StaffProfile')} style={styles.shortcutItem}>
                <Ionicons name="person-outline" size={22} color="#6D4CFF" />
                <Text style={[styles.shortcutText, { color: colors.text }]}>My Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Timetable')} style={styles.shortcutItem}>
                <Ionicons name="time-outline" size={22} color="#6D4CFF" />
                <Text style={[styles.shortcutText, { color: colors.text }]}>Timetable</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('StaffSettings')} style={styles.shortcutItem}>
                <Ionicons name="settings-outline" size={22} color="#6D4CFF" />
                <Text style={[styles.shortcutText, { color: colors.text }]}>Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: spacing.xxl },
  hero: {
    padding: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 60,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  heroText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  heroGreeting: {
    fontSize: fontSize.xs,
    color: '#E8E5FF',
    fontWeight: '500',
  },
  heroName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  heroSub: {
    fontSize: fontSize.xs,
    color: '#E8E5FF',
    marginTop: 2,
  },
  iconBtn: {
    padding: spacing.xs,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginTop: -30,
    gap: spacing.sm,
  },
  metricCard: {
    flex: 1,
    borderRadius: 20,
    padding: spacing.md,
    alignItems: 'center',
    elevation: 3,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 2,
  },
  section: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  emptyCard: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: fontSize.sm,
    marginTop: spacing.sm,
    fontWeight: '500',
  },
  classCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  classTimeCol: {
    width: 90,
    alignItems: 'flex-start',
  },
  classTimeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  nowBadge: {
    backgroundColor: '#6D4CFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  nowText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
  },
  classInfoCol: {
    flex: 1,
    marginLeft: spacing.md,
  },
  classSubject: {
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  classMeta: {
    fontSize: 11,
    marginTop: 2,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
  },
  actionLabelText: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  shortcutCard: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.md,
  },
  shortcutRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  shortcutItem: {
    alignItems: 'center',
  },
  shortcutText: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
});
