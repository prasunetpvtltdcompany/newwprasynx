import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, RefreshControl, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, borderRadius, fontSize, spacing, shadows } from '../../theme';

const { width } = Dimensions.get('window');
const STAT_CARD_WIDTH = (width - spacing.lg * 2 - spacing.md * 2) / 3;

export function StudentDashboardScreen({ navigation }: any) {
  const { student, user } = useAuthStore();
  const {
    dashboard,
    timetable,
    assignments,
    results,
    fetchDashboard,
    fetchTimetable,
    fetchAssignments,
    fetchResults
  } = useDataStore();
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;
  const [refreshing, setRefreshing] = useState(false);

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good Morning';
    if (hr < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getInitials = (name: string) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'ST';
  };

  const loadData = async () => {
    if (student?.id) {
      await Promise.all([
        fetchDashboard('student', student.id),
        fetchTimetable(student.id),
        fetchAssignments(student.id),
        fetchResults(student.id)
      ]);
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

  // Determine current day of week
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDayName = dayNames[new Date().getDay()];

  // Filter timetable for today
  const todayClasses = (timetable || []).filter(
    (t) => t.day?.toLowerCase() === currentDayName.toLowerCase() || t.day === currentDayName.slice(0, 3)
  );

  // Stats Calculations
  const attendanceVal = dashboard?.attendance?.percentage != null ? dashboard.attendance.percentage : 0;
  const attendancePercentageText = `${attendanceVal}%`;
  
  const completedAssignmentsCount = assignments?.filter((a) => a.status === 'submitted' || a.status === 'graded').length || 0;
  const totalAssignmentsCount = assignments?.length || 0;
  const assignmentRatioText = `${completedAssignmentsCount}/${totalAssignmentsCount}`;
  const assignmentPercentage = totalAssignmentsCount > 0 ? Math.round((completedAssignmentsCount / totalAssignmentsCount) * 100) : 0;

  const classesCountText = `${todayClasses.length}`;

  const profileImg = student?.avatar_url || student?.avatar ? { uri: student.avatar_url || student.avatar } : null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6D4CFF']} />}
      >
        {/* Purple Hero Section */}
        <LinearGradient
          colors={['#7C3AED', '#6D4CFF', '#5B21B6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroHeaderRow}>
            {profileImg ? (
              <Image source={profileImg} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarFallback, { backgroundColor: '#FFFFFF30' }]}>
                <Text style={styles.avatarFallbackText}>
                  {getInitials(student?.full_name || user?.full_name || 'ST')}
                </Text>
              </View>
            )}
            <View style={styles.heroTextContainer}>
              <Text style={styles.heroGreeting}>{getGreeting()},</Text>
              <Text style={styles.heroName}>
                {student?.full_name || user?.full_name || 'Student'} 👋
              </Text>
              <Text style={styles.heroSub}>{student?.student_class || 'PRASYNX Student'}</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('StudentNotifications')} style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Overall Progress Card (Overlapping) */}
        <View style={[styles.progressCard, { backgroundColor: colors.surface }, shadows.sm]}>
          <Text style={[styles.progressCardTitle, { color: colors.text }]}>Overall Progress</Text>
          <View style={styles.progressCardContent}>
            {/* Circular Gauge */}
            <View style={styles.circleGaugeOuter}>
              <View style={[styles.circleGaugeInner, { borderColor: '#6D4CFF' }]}>
                <Text style={[styles.circleGaugePercent, { color: colors.text }]}>{attendancePercentageText}</Text>
                <Text style={[styles.circleGaugeLabel, { color: colors.textMuted }]}>Great Job!</Text>
              </View>
            </View>
            {/* Mini Graduation Illustration */}
            <View style={styles.illustrationContainer}>
              <View style={styles.mortarboardCap}>
                <View style={styles.capDiamond} />
                <View style={styles.capBand} />
                <View style={styles.capTassel} />
              </View>
              <View style={styles.booksStack}>
                <View style={[styles.bookSpine, { backgroundColor: '#C084FC', width: 70 }]} />
                <View style={[styles.bookSpine, { backgroundColor: '#818CF8', width: 75 }]} />
                <View style={[styles.bookSpine, { backgroundColor: '#A78BFA', width: 68 }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Dynamic Stats Cards Row */}
        <View style={styles.statsRow}>
          {/* Card 1: Attendance */}
          <View style={[styles.statCard, { backgroundColor: colors.surface }, shadows.xs]}>
            <View style={[styles.statIconContainer, { backgroundColor: '#F3F0FF' }]}>
              <Ionicons name="calendar" size={18} color="#6D4CFF" />
            </View>
            <Text style={[styles.statCardValue, { color: colors.text }]}>{attendancePercentageText}</Text>
            <Text style={[styles.statCardLabel, { color: colors.textMuted }]}>Attendance</Text>
            <View style={[styles.trendBadge, { backgroundColor: '#ECFDF5' }]}>
              <Text style={[styles.trendBadgeText, { color: '#059669' }]}>+5%</Text>
            </View>
          </View>

          {/* Card 2: Assignments */}
          <View style={[styles.statCard, { backgroundColor: colors.surface }, shadows.xs]}>
            <View style={[styles.statIconContainer, { backgroundColor: '#F3F0FF' }]}>
              <Ionicons name="checkbox" size={18} color="#6D4CFF" />
            </View>
            <Text style={[styles.statCardValue, { color: colors.text }]}>{assignmentRatioText}</Text>
            <Text style={[styles.statCardLabel, { color: colors.textMuted }]}>Assignments</Text>
            <View style={[styles.trendBadge, { backgroundColor: '#ECFDF5' }]}>
              <Text style={[styles.trendBadgeText, { color: '#059669' }]}>{assignmentPercentage}%</Text>
            </View>
          </View>

          {/* Card 3: Classes Today */}
          <View style={[styles.statCard, { backgroundColor: colors.surface }, shadows.xs]}>
            <View style={[styles.statIconContainer, { backgroundColor: '#F3F0FF' }]}>
              <Ionicons name="time" size={18} color="#6D4CFF" />
            </View>
            <Text style={[styles.statCardValue, { color: colors.text }]}>{classesCountText}</Text>
            <Text style={[styles.statCardLabel, { color: colors.textMuted }]}>Classes Today</Text>
            <View style={[styles.trendBadge, { backgroundColor: '#F3F4F6' }]}>
              <Text style={[styles.trendBadgeText, { color: '#4B5563' }]}>Active</Text>
            </View>
          </View>
        </View>

        {/* Today's Schedule Card */}
        <Card title="Today's Schedule" subtitle={currentDayName}>
          {todayClasses.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No classes scheduled for today</Text>
            </View>
          ) : (
            todayClasses.map((item, index) => {
              const itemStyle = [
                styles.scheduleItem,
                index > 0 ? { borderTopWidth: 1, borderTopColor: colors.borderLight } : null
              ];
              return (
                <View {...{key: item.id || String(index)}} style={itemStyle as any}>
                  <View style={[styles.scheduleDot, { backgroundColor: index % 2 === 0 ? '#6D4CFF' : colors.chart2 }]} />
                  <View style={styles.scheduleInfo}>
                    <Text style={[styles.scheduleSubject, { color: colors.text }]}>{item.subject}</Text>
                    <Text style={[styles.scheduleTime, { color: colors.textMuted }]}>{item.time || '10:00 AM - 11:00 AM'}</Text>
                  </View>
                  <Badge label={item.room || 'Room 201'} variant="info" />
                </View>
              );
            })
          )}
        </Card>

        {/* Portal Services Quick Actions */}
        <Card title="Portal Services">
          <View style={styles.quickActionsGrid}>
            <View style={styles.quickActionsRow}>
              <TouchableOpacity onPress={() => navigation.navigate('StudentAcademics')} style={[styles.quickAction, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
                <Ionicons name="school-outline" size={24} color="#7C3AED" />
                <Text style={[styles.quickActionLabel, { color: colors.text }]}>Academics</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('StudentExams')} style={[styles.quickAction, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
                <Ionicons name="calendar-outline" size={24} color="#7C3AED" />
                <Text style={[styles.quickActionLabel, { color: colors.text }]}>Exams</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('StudentFinance')} style={[styles.quickAction, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
                <Ionicons name="wallet-outline" size={24} color="#7C3AED" />
                <Text style={[styles.quickActionLabel, { color: colors.text }]}>Finance</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.quickActionsRow}>
              <TouchableOpacity onPress={() => navigation.navigate('StudentLibrary')} style={[styles.quickAction, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
                <Ionicons name="book-outline" size={24} color="#7C3AED" />
                <Text style={[styles.quickActionLabel, { color: colors.text }]}>Library</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('StudentMessages')} style={[styles.quickAction, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
                <Ionicons name="chatbubbles-outline" size={24} color="#7C3AED" />
                <Text style={[styles.quickActionLabel, { color: colors.text }]}>Messages</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('StudentHealth')} style={[styles.quickAction, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
                <Ionicons name="heart-outline" size={24} color="#7C3AED" />
                <Text style={[styles.quickActionLabel, { color: colors.text }]}>Health</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.quickActionsRow}>
              <TouchableOpacity onPress={() => navigation.navigate('StudentResults')} style={[styles.quickAction, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
                <Ionicons name="ribbon-outline" size={24} color="#7C3AED" />
                <Text style={[styles.quickActionLabel, { color: colors.text }]}>Results</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('StudentSettings')} style={[styles.quickAction, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
                <Ionicons name="settings-outline" size={24} color="#7C3AED" />
                <Text style={[styles.quickActionLabel, { color: colors.text }]}>Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('AI Tutor')} style={[styles.quickAction, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
                <Ionicons name="chatbox-ellipses-outline" size={24} color="#7C3AED" />
                <Text style={[styles.quickActionLabel, { color: colors.text }]}>AI Tutor</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>
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
    paddingBottom: 75,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#EAEAEA',
  },
  avatarFallback: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarFallbackText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  heroTextContainer: {
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
  notificationButton: {
    padding: spacing.xs,
  },
  progressCard: {
    marginHorizontal: spacing.lg,
    marginTop: -55,
    borderRadius: 24,
    padding: spacing.lg,
    elevation: 3,
  },
  progressCardTitle: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  progressCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circleGaugeOuter: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 8,
    borderColor: '#F3F0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleGaugeInner: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleGaugePercent: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },
  circleGaugeLabel: {
    fontSize: 8,
    fontWeight: '600',
    marginTop: 2,
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 90,
  },
  mortarboardCap: {
    alignItems: 'center',
    marginBottom: 8,
  },
  capDiamond: {
    width: 32,
    height: 18,
    backgroundColor: '#4B5563',
    transform: [{ rotate: '45deg' }],
  },
  capBand: {
    width: 16,
    height: 6,
    backgroundColor: '#374151',
    marginTop: -2,
  },
  capTassel: {
    position: 'absolute',
    right: 4,
    top: 8,
    width: 2,
    height: 12,
    backgroundColor: '#FBBF24',
  },
  booksStack: {
    alignItems: 'center',
    gap: 2,
  },
  bookSpine: {
    height: 6,
    borderRadius: 3,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  statCard: {
    width: STAT_CARD_WIDTH,
    borderRadius: 20,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F0FF',
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statCardValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  statCardLabel: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  trendBadge: {
    paddingVertical: 2,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.sm,
    marginTop: spacing.sm,
  },
  trendBadgeText: {
    fontSize: 9,
    fontWeight: '700',
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  scheduleDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.md,
  },
  scheduleInfo: { flex: 1 },
  scheduleSubject: { fontSize: fontSize.md, fontWeight: '600' },
  scheduleTime: { fontSize: fontSize.xs, marginTop: 2 },
  emptyContainer: { paddingVertical: spacing.xl, alignItems: 'center' },
  emptyText: { fontSize: fontSize.sm, fontWeight: '500' },
  quickActionsGrid: {
    flexDirection: 'column',
    gap: spacing.md,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    ...shadows.xs,
  },
  quickActionLabel: { fontSize: 10, fontWeight: '600', marginTop: spacing.xs },
});
