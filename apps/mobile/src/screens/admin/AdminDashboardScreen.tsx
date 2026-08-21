import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, borderRadius, fontSize, spacing, shadows } from '../../theme';
import { Loader } from '../../components';

export function AdminDashboardScreen({ navigation }: any) {
  const { user, logout } = useAuthStore();
  const {
    adminOverview,
    fetchAdminOverview,
    adminAuditLogs,
    fetchAdminAuditLogs,
  } = useDataStore();
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([
      fetchAdminOverview(),
      fetchAdminAuditLogs(),
    ]);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchAdminOverview(),
      fetchAdminAuditLogs(),
    ]);
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good Morning';
    if (hr < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getInitials = (name: string) => {
    return name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'AD';
  };

  // Derive real overview metrics
  const totalOrgs =
    adminOverview?.summary?.totalOrganisations ??
    adminOverview?.totalOrganisations ??
    adminOverview?.organisationsCount ??
    0;

  const totalUsers =
    adminOverview?.summary?.totalUsers ??
    adminOverview?.totalUsers ??
    adminOverview?.usersCount ??
    0;

  const portalStats = adminOverview?.summary?.portalBreakdown || adminOverview?.portalBreakdown || {};
  const studentCount = portalStats.student ?? adminOverview?.studentsCount ?? 0;
  const staffCount = portalStats.staff ?? adminOverview?.staffCount ?? 0;

  // Derive recent activity logs
  const recentLogs =
    adminOverview?.recentActivity ||
    adminAuditLogs.slice(0, 6) ||
    [];

  if (loading && !refreshing && !adminOverview) {
    return <Loader fullScreen message="Loading Admin Command Center..." />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6D4CFF']} />}
      >
        {/* Purple Curved Hero Section */}
        <LinearGradient
          colors={['#7C3AED', '#6D4CFF', '#5B21B6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroRow}>
            <View style={[styles.avatarCircle, { backgroundColor: '#FFFFFF30' }]}>
              <Text style={styles.avatarText}>{getInitials(user?.full_name || 'Admin')}</Text>
            </View>
            <View style={styles.heroText}>
              <Text style={styles.heroGreeting}>{getGreeting()},</Text>
              <Text style={styles.heroName}>{user?.full_name || 'System Admin'} 👋</Text>
              <Text style={styles.heroSub}>Welcome back to PRASYNX</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={logout} style={styles.iconBtn}>
                <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Global Overview Metrics Block */}
        <View style={styles.metricsContainer}>
          <TouchableOpacity
            style={[styles.metricCard, { backgroundColor: colors.surface }, shadows.sm]}
            onPress={() => navigation.navigate('Schools')}
            activeOpacity={0.8}
          >
            <Ionicons name="business-outline" size={18} color="#6D4CFF" />
            <Text style={[styles.metricValue, { color: colors.text }]}>{totalOrgs}</Text>
            <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Schools</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.metricCard, { backgroundColor: colors.surface }, shadows.sm]}
            onPress={() => navigation.navigate('Users')}
            activeOpacity={0.8}
          >
            <Ionicons name="people-outline" size={18} color="#10B981" />
            <Text style={[styles.metricValue, { color: colors.text }]}>{totalUsers}</Text>
            <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Total Users</Text>
          </TouchableOpacity>

          <View style={[styles.metricCard, { backgroundColor: colors.surface }, shadows.sm]}>
            <Ionicons name="school-outline" size={18} color="#F59E0B" />
            <Text style={[styles.metricValue, { color: colors.text }]}>{studentCount}</Text>
            <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Students</Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: colors.surface }, shadows.sm]}>
            <Ionicons name="person-outline" size={18} color="#EF4444" />
            <Text style={[styles.metricValue, { color: colors.text }]}>{staffCount}</Text>
            <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Staff</Text>
          </View>
        </View>

        {/* System Health */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>System Health & Services</Text>
          <View style={[styles.healthCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
            <View style={styles.healthRow}>
              <View style={styles.healthItem}>
                <View style={styles.healthHeader}>
                  <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
                  <Text style={[styles.healthItemTitle, { color: colors.text }]}>API Gateway</Text>
                </View>
                <Text style={[styles.healthItemSub, { color: colors.textMuted }]}>Operational</Text>
              </View>

              <View style={[styles.vDivider, { backgroundColor: colors.borderLight }]} />

              <View style={styles.healthItem}>
                <View style={styles.healthHeader}>
                  <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
                  <Text style={[styles.healthItemTitle, { color: colors.text }]}>Database</Text>
                </View>
                <Text style={[styles.healthItemSub, { color: colors.textMuted }]}>Healthy</Text>
              </View>

              <View style={[styles.vDivider, { backgroundColor: colors.borderLight }]} />

              <View style={styles.healthItem}>
                <View style={styles.healthHeader}>
                  <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
                  <Text style={[styles.healthItemTitle, { color: colors.text }]}>Auth / RLS</Text>
                </View>
                <Text style={[styles.healthItemSub, { color: colors.textMuted }]}>Active</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Recent System Activity */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent System Activity</Text>
          {recentLogs.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
              <Ionicons name="shield-checkmark-outline" size={36} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No recent activity logged</Text>
            </View>
          ) : (
            recentLogs.map((log: any, idx: number) => {
              const actionTitle = log.action || log.event || log.title || 'System Event';
              const userEmail = log.user_email || log.user || log.actor || 'System';
              const logDate = log.created_at || log.timestamp;
              return (
                <View
                  {...{ key: log.id || idx }}
                  style={[styles.activityRow, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs] as any}
                >
                  <View style={[styles.iconDot, { backgroundColor: colors.primaryLight }]}>
                    <Ionicons name="time-outline" size={16} color={colors.primary} />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={[styles.activityTitleText, { color: colors.text }]}>{actionTitle}</Text>
                    <Text style={[styles.activitySubText, { color: colors.textMuted }]}>
                      {userEmail} {logDate ? `• ${new Date(logDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Global Admin Shortcuts */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Admin Command Modules</Text>
          <View style={[styles.shortcutsCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
            <View style={styles.shortcutRow}>
              <TouchableOpacity onPress={() => navigation.navigate('Schools')} style={styles.shortcutItem}>
                <View style={[styles.shortcutIconWrap, { backgroundColor: '#F3F0FF' }]}>
                  <Ionicons name="business-outline" size={22} color="#6D4CFF" />
                </View>
                <Text style={[styles.shortcutText, { color: colors.text }]}>Schools</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('Users')} style={styles.shortcutItem}>
                <View style={[styles.shortcutIconWrap, { backgroundColor: '#F3F0FF' }]}>
                  <Ionicons name="people-outline" size={22} color="#6D4CFF" />
                </View>
                <Text style={[styles.shortcutText, { color: colors.text }]}>Users</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('Reports')} style={styles.shortcutItem}>
                <View style={[styles.shortcutIconWrap, { backgroundColor: '#F3F0FF' }]}>
                  <Ionicons name="bar-chart-outline" size={22} color="#6D4CFF" />
                </View>
                <Text style={[styles.shortcutText, { color: colors.text }]}>Analytics</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.shortcutItem}>
                <View style={[styles.shortcutIconWrap, { backgroundColor: '#F3F0FF' }]}>
                  <Ionicons name="settings-outline" size={22} color="#6D4CFF" />
                </View>
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
  healthCard: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.md,
  },
  healthRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthItem: {
    flex: 1,
    alignItems: 'center',
  },
  healthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  healthItemTitle: {
    fontSize: fontSize.xs,
    fontWeight: '700',
  },
  healthItemSub: {
    fontSize: 10,
    marginTop: 2,
  },
  vDivider: {
    width: 1,
    height: 32,
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
  activityRow: {
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
  activityContent: {
    flex: 1,
  },
  activityTitleText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  activitySubText: {
    fontSize: 10,
    marginTop: 2,
  },
  shortcutsCard: {
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
  shortcutIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shortcutText: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
});
