import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, borderRadius, fontSize, spacing, shadows } from '../../theme';

export function ParentDashboardScreen({ navigation }: any) {
  const { user, children, selectedChild, setSelectedChild, logout } = useAuthStore();
  const { parentDashboard, fetchParentDashboard, parentAttendance, fetchParentAttendance, parentFees, fetchParentFees } = useDataStore();
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;

  const loadData = async () => {
    if (user?.id) {
      await fetchParentDashboard(user.id);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  useEffect(() => {
    if (selectedChild?.id) {
      fetchParentAttendance(selectedChild.id);
      fetchParentFees(selectedChild.id);
    }
  }, [selectedChild?.id]);

  // Compute stats
  const selectedAttendance = parentAttendance || [];
  const presentCount = selectedAttendance.filter((r: any) => r.status === 'present').length;
  const totalAttendanceCount = selectedAttendance.length;
  const attendancePercent = totalAttendanceCount ? Math.round((presentCount / totalAttendanceCount) * 100) : 0;

  const totalOutstandingFees = (parentFees || [])
    .filter((f: any) => f.status === 'pending')
    .reduce((sum: number, f: any) => sum + parseFloat(f.amount || 0), 0);

  const grades = parentDashboard?.recentMarks || [];
  const gpa = grades.length > 0 ? (grades.reduce((sum: number, item: any) => sum + parseFloat(item.grade_point || 0), 0) / grades.length).toFixed(1) : '0';
  const gpaPercentage = grades.length > 0 ? Math.round((parseFloat(gpa) / 10) * 100) : 0;

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good Morning';
    if (hr < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getInitials = (name: string) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'ST';
  };

  const upcomingExams = parentDashboard?.upcomingExams || [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Purple Curved Hero Section */}
        <LinearGradient
          colors={['#7C3AED', '#6D4CFF', '#5B21B6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroHeaderRow}>
            <View style={[styles.avatarCircle, { backgroundColor: '#FFFFFF30' }]}>
              <Text style={styles.avatarText}>{getInitials(user?.full_name || 'PR')}</Text>
            </View>
            <View style={styles.heroTextContainer}>
              <Text style={styles.heroGreeting}>{getGreeting()},</Text>
              <Text style={styles.heroName}>{user?.full_name || 'Parent'} 👋</Text>
              <Text style={styles.heroSub}>Welcome back!</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity onPress={() => navigation.navigate('ParentNotifications')} style={styles.notificationButton}>
                <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={logout} style={styles.notificationButton}>
                <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* My Children Overlapping Card */}
        <View style={[styles.childrenCard, { backgroundColor: colors.surface }, shadows.sm]}>
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>My Children</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ParentChildren')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.childrenScroll}>
            {children.length === 0 ? (
              <View style={styles.emptyChildren}>
                <Text style={{ color: colors.textMuted }}>No children linked</Text>
              </View>
            ) : (
              children.map((child: any) => {
                const isSelected = selectedChild?.id === child.id;
                return (
                  <TouchableOpacity
                    key={child.id}
                    style={[
                      styles.childCardItem,
                      {
                        backgroundColor: isSelected ? '#F9F8FF' : colors.surface,
                        borderColor: isSelected ? '#6D4CFF' : colors.borderLight,
                      }
                    ]}
                    onPress={() => setSelectedChild(child)}
                  >
                    <View style={[styles.childAvatarCircle, { backgroundColor: isSelected ? '#E8E5FF' : '#F3F4F6' }]}>
                      <Text style={[styles.childAvatarText, { color: isSelected ? '#6D4CFF' : colors.text }]}>
                        {getInitials(child.full_name)}
                      </Text>
                    </View>
                    <View style={styles.childInfoContainer}>
                      <Text style={[styles.childNameText, { color: colors.text }]} numberOfLines={1}>
                        {child.full_name}
                      </Text>
                      <Text style={[styles.childClassText, { color: colors.textMuted }]}>
                        Class {child.student_class || 'N/A'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        </View>

        {/* Overview Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Overview</Text>
          <View style={styles.overviewRow}>
            {/* Card 1: Attendance */}
            <TouchableOpacity
              style={[styles.overviewCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}
              onPress={() => navigation.navigate('ParentAttendance')}
            >
              <View style={[styles.iconBox, { backgroundColor: '#F3F0FF' }]}>
                <Ionicons name="calendar" size={18} color="#6D4CFF" />
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>{attendancePercent}%</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Attendance</Text>
              <Text style={[styles.statSubLabel, { color: colors.textMuted }]}>This Month</Text>
            </TouchableOpacity>

            {/* Card 2: Fees Due */}
            <TouchableOpacity
              style={[styles.overviewCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}
              onPress={() => navigation.navigate('ParentFees')}
            >
              <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="wallet" size={18} color="#EF4444" />
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>₹{totalOutstandingFees.toLocaleString()}</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Fees Due</Text>
              <Text style={[styles.actionLinkText, { color: '#6D4CFF' }]}>Pay Now</Text>
            </TouchableOpacity>

            {/* Card 3: Overall Performance */}
            <TouchableOpacity
              style={[styles.overviewCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}
              onPress={() => navigation.navigate('ParentResults')}
            >
              <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="trophy" size={18} color="#10B981" />
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>{gpaPercentage > 0 ? `${gpaPercentage}%` : '0%'}</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Overall Grade</Text>
              <Text style={[styles.statSubLabel, { color: colors.textMuted }]}>This Term</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upcoming Section */}
        <View style={styles.section}>
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Upcoming</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ParentExams')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {upcomingExams.length === 0 ? (
            <View style={[styles.upcomingCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
              <View style={[styles.eventIconContainer, { backgroundColor: '#F3F0FF' }]}>
                <Ionicons name="calendar-outline" size={20} color="#6D4CFF" />
              </View>
              <View style={styles.eventInfo}>
                <Text style={[styles.eventTitle, { color: colors.text }]}>PTM Meeting</Text>
                <Text style={[styles.eventSubtitle, { color: colors.textMuted }]}>With Class Teacher</Text>
                <Text style={[styles.eventDate, { color: colors.textMuted }]}>16 May, 2025</Text>
              </View>
              <Text style={[styles.eventTime, { color: colors.text }]}>10:00 AM</Text>
            </View>
          ) : (
            upcomingExams.slice(0, 2).map((item: any) => (
              <View {...{key: item.id}} style={[styles.upcomingCard, { backgroundColor: colors.surface, borderColor: colors.borderLight, marginBottom: spacing.sm }, shadows.xs] as any}>
                <View style={[styles.eventIconContainer, { backgroundColor: '#F3F0FF' }]}>
                  <Ionicons name="document-text-outline" size={20} color="#6D4CFF" />
                </View>
                <View style={styles.eventInfo}>
                  <Text style={[styles.eventTitle, { color: colors.text }]}>{item.subject_name || item.title || 'Exam'}</Text>
                  <Text style={[styles.eventSubtitle, { color: colors.textMuted }]}>{item.exam_name || 'Semester Examination'}</Text>
                  <Text style={[styles.eventDate, { color: colors.textMuted }]}>
                    {item.exam_date || item.date ? new Date(item.exam_date || item.date).toLocaleDateString() : 'N/A'}
                  </Text>
                </View>
                <Text style={[styles.eventTime, { color: colors.text }]}>{item.time || '10:00 AM'}</Text>
              </View>
            ))
          )}
        </View>

        {/* Shortcuts Portal Services Menu */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Portal Services</Text>
          <View style={[styles.servicesGridCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
            <View style={styles.quickActionsRow}>
              <TouchableOpacity onPress={() => navigation.navigate('ParentChildren')} style={[styles.quickAction, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
                <Ionicons name="people-outline" size={22} color="#6D4CFF" />
                <Text style={[styles.quickActionLabel, { color: colors.text }]}>Children</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('ParentAssignments')} style={[styles.quickAction, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
                <Ionicons name="document-text-outline" size={22} color="#6D4CFF" />
                <Text style={[styles.quickActionLabel, { color: colors.text }]}>Homework</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('ParentExams')} style={[styles.quickAction, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
                <Ionicons name="calendar-outline" size={22} color="#6D4CFF" />
                <Text style={[styles.quickActionLabel, { color: colors.text }]}>Exams</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.quickActionsRow, { marginTop: spacing.md }]}>
              <TouchableOpacity onPress={() => navigation.navigate('ParentHealth')} style={[styles.quickAction, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
                <Ionicons name="heart-outline" size={22} color="#6D4CFF" />
                <Text style={[styles.quickActionLabel, { color: colors.text }]}>Health</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('ParentTransport')} style={[styles.quickAction, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
                <Ionicons name="bus-outline" size={22} color="#6D4CFF" />
                <Text style={[styles.quickActionLabel, { color: colors.text }]}>Transport</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('ParentMessages')} style={[styles.quickAction, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
                <Ionicons name="chatbubbles-outline" size={22} color="#6D4CFF" />
                <Text style={[styles.quickActionLabel, { color: colors.text }]}>Messages</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.quickActionsRow, { marginTop: spacing.md }]}>
              <TouchableOpacity onPress={() => navigation.navigate('ParentJobs')} style={[styles.quickAction, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
                <Ionicons name="briefcase-outline" size={22} color="#6D4CFF" />
                <Text style={[styles.quickActionLabel, { color: colors.text }]}>Careers</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('ParentSupport')} style={[styles.quickAction, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
                <Ionicons name="help-buoy-outline" size={22} color="#6D4CFF" />
                <Text style={[styles.quickActionLabel, { color: colors.text }]}>Support</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('ParentProfile')} style={[styles.quickAction, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
                <Ionicons name="person-outline" size={22} color="#6D4CFF" />
                <Text style={[styles.quickActionLabel, { color: colors.text }]}>Profile</Text>
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
    paddingBottom: 75,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroHeaderRow: {
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
  childrenCard: {
    marginHorizontal: spacing.lg,
    marginTop: -55,
    borderRadius: 24,
    padding: spacing.lg,
    elevation: 3,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  viewAllText: {
    fontSize: fontSize.xs,
    color: '#6D4CFF',
    fontWeight: '700',
  },
  childrenScroll: {
    paddingVertical: spacing.xs,
    gap: spacing.md,
  },
  emptyChildren: {
    padding: spacing.md,
    alignItems: 'center',
  },
  childCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    minWidth: 190,
    gap: spacing.md,
  },
  childAvatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  childAvatarText: {
    fontSize: 14,
    fontWeight: '700',
  },
  childInfoContainer: {
    flex: 1,
  },
  childNameText: {
    fontSize: 14,
    fontWeight: '700',
  },
  childClassText: {
    fontSize: 11,
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
  },
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  overviewCard: {
    width: '31%',
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.md,
    alignItems: 'center',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  statSubLabel: {
    fontSize: 9,
    marginTop: 2,
    textAlign: 'center',
  },
  actionLinkText: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
    textDecorationLine: 'underline',
  },
  upcomingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    marginTop: spacing.md,
  },
  eventIconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  eventSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  eventDate: {
    fontSize: 10,
    marginTop: 2,
  },
  eventTime: {
    fontSize: fontSize.xs,
    fontWeight: '700',
  },
  servicesGridCard: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.md,
    marginTop: spacing.md,
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
  quickActionLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
});
