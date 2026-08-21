import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, borderRadius, fontSize, spacing, shadows } from '../../theme';
import { Card } from '../../components';

export function ManagementDashboardScreen({ navigation }: any) {
  const { user, logout } = useAuthStore();
  const { managementDashboard, fetchManagementDashboard, managementFinance, fetchManagementFinance } = useDataStore();
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;

  const loadData = async () => {
    if (user?.organisation_id || user?.id) {
      const orgId = user.organisation_id || 'all';
      await fetchManagementDashboard(orgId);
      await fetchManagementFinance(orgId);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const stats = managementDashboard?.stats || {};
  const announcements = managementDashboard?.recentAnnouncements || [];
  const revenue = managementFinance?.totalRevenue || 0;

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good Morning';
    if (hr < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getInitials = (name: string) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'MN';
  };

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
          <View style={styles.heroRow}>
            <View style={[styles.avatarCircle, { backgroundColor: '#FFFFFF30' }]}>
              <Text style={styles.avatarText}>{getInitials(user?.full_name || 'PR')}</Text>
            </View>
            <View style={styles.heroText}>
              <Text style={styles.heroGreeting}>{getGreeting()},</Text>
              <Text style={styles.heroName}>{user?.full_name || 'Administrator'} 👋</Text>
              <Text style={styles.heroSub}>Welcome back to PRASYNX</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={logout} style={styles.iconBtn}>
                <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Executive Metrics Overview Block */}
        <View style={styles.metricsContainer}>
          <View style={[styles.metricCard, { backgroundColor: colors.surface }, shadows.sm]}>
            <Ionicons name="people-outline" size={18} color="#6D4CFF" />
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {stats.totalStudents || 0}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Students</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: colors.surface }, shadows.sm]}>
            <Ionicons name="school-outline" size={18} color="#10B981" />
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {stats.totalClasses || 0}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Classes</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: colors.surface }, shadows.sm]}>
            <Ionicons name="person-outline" size={18} color="#F59E0B" />
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {stats.totalStaff || 0}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Total Staff</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: colors.surface }, shadows.sm]}>
            <Ionicons name="wallet-outline" size={18} color="#EF4444" />
            <Text style={[styles.metricValue, { color: colors.text }]} numberOfLines={1}>
              ₹{revenue.toLocaleString()}
            </Text>
            <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Revenue</Text>
          </View>
        </View>

        {/* Highlights Notices */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Highlights</Text>
          {announcements.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
              <Ionicons name="notifications-off-outline" size={32} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No highlights reported today</Text>
            </View>
          ) : (
            announcements.map((item: any) => (
              <View {...{key: item.id}} style={[styles.highlightRow, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs] as any}>
                <View style={[styles.iconDot, { backgroundColor: colors.primaryLight }]}>
                  <Ionicons name="megaphone-outline" size={16} color={colors.primary} />
                </View>
                <View style={styles.highlightContent}>
                  <Text style={[styles.highlightTitleText, { color: colors.text }]}>{item.title}</Text>
                  <Text style={[styles.highlightDate, { color: colors.textMuted }]}>
                    {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Quick Actions Shortcuts */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Portal Services</Text>
          <View style={[styles.shortcutsGridCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
            <View style={styles.shortcutRow}>
              <TouchableOpacity onPress={() => navigation.navigate('Finance')} style={styles.shortcutItem}>
                <Ionicons name="cash-outline" size={24} color="#6D4CFF" />
                <Text style={[styles.shortcutText, { color: colors.text }]}>Finance Desk</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Staff')} style={styles.shortcutItem}>
                <Ionicons name="people-outline" size={24} color="#6D4CFF" />
                <Text style={[styles.shortcutText, { color: colors.text }]}>Staff Directory</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Reports')} style={styles.shortcutItem}>
                <Ionicons name="bar-chart-outline" size={24} color="#6D4CFF" />
                <Text style={[styles.shortcutText, { color: colors.text }]}>Reports Center</Text>
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
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  heroSub: {
    fontSize: fontSize.xs,
    color: '#E8E5FF',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    padding: spacing.xs,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginTop: -30,
    gap: 8,
  },
  metricCard: {
    flex: 1,
    borderRadius: 20,
    padding: spacing.sm,
    alignItems: 'center',
    elevation: 3,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: spacing.xs,
    textAlign: 'center',
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
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  iconDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  highlightContent: {
    flex: 1,
  },
  highlightTitleText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  highlightDate: {
    fontSize: 10,
    marginTop: 2,
  },
  shortcutsGridCard: {
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
