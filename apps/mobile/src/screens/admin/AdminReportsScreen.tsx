import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDataStore } from '../../store/dataStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, borderRadius, fontSize, spacing, shadows } from '../../theme';
import { Badge, Loader } from '../../components';

const TABS = ['System Analytics', 'Audit Trail', 'Top Schools'] as const;

export function AdminReportsScreen({ navigation }: any) {
  const {
    adminAnalytics,
    fetchAdminAnalytics,
    adminAuditLogs,
    fetchAdminAuditLogs,
    adminTopOrgs,
    fetchAdminTopOrgs,
  } = useDataStore();
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;

  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('System Analytics');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([
      fetchAdminAnalytics(),
      fetchAdminAuditLogs(),
      fetchAdminTopOrgs(),
    ]);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchAdminAnalytics(),
      fetchAdminAuditLogs(),
      fetchAdminTopOrgs(),
    ]);
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const analytics = adminAnalytics || {};
  const logs = adminAuditLogs || [];
  const topOrgs = adminTopOrgs || [];

  if (loading && !refreshing && !adminAnalytics && logs.length === 0) {
    return <Loader fullScreen message="Loading system reports & analytics..." />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Reports & Analytics</Text>
        <View style={styles.placeholderButton} />
      </View>

      {/* Category Tabs */}
      <View style={[styles.tabBar, { borderBottomColor: colors.borderLight }]}>
        {TABS.map((tab) => {
          const isSelected = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tabItem, isSelected && { borderBottomColor: '#6D4CFF' }]}
            >
              <Text style={[styles.tabLabel, { color: isSelected ? '#6D4CFF' : colors.textMuted }]}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6D4CFF']} />}
      >
        {activeTab === 'System Analytics' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Platform Summary Metrics</Text>
            <View style={styles.metricsGrid}>
              <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
                <Ionicons name="trending-up-outline" size={20} color="#6D4CFF" />
                <Text style={[styles.metricVal, { color: colors.text }]}>
                  {analytics.totalOrganisations ?? analytics.orgCount ?? 0}
                </Text>
                <Text style={[styles.metricLbl, { color: colors.textMuted }]}>Registered Schools</Text>
              </View>

              <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
                <Ionicons name="people-outline" size={20} color="#10B981" />
                <Text style={[styles.metricVal, { color: colors.text }]}>
                  {analytics.totalUsers ?? analytics.userCount ?? 0}
                </Text>
                <Text style={[styles.metricLbl, { color: colors.textMuted }]}>Active Accounts</Text>
              </View>

              <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#F59E0B" />
                <Text style={[styles.metricVal, { color: colors.text }]}>
                  {analytics.securityEventsCount ?? logs.length}
                </Text>
                <Text style={[styles.metricLbl, { color: colors.textMuted }]}>Security Audits</Text>
              </View>

              <View style={[styles.metricCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
                <Ionicons name="server-outline" size={20} color="#EF4444" />
                <Text style={[styles.metricVal, { color: '#10B981' }]}>100%</Text>
                <Text style={[styles.metricLbl, { color: colors.textMuted }]}>System Uptime</Text>
              </View>
            </View>

            <Text style={[styles.sectionTitle, { color: colors.text, marginTop: spacing.lg }]}>User Role Distribution</Text>
            <View style={[styles.cardContainer, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
              {[
                { role: 'Student Portal Users', key: 'student', color: '#6D4CFF' },
                { role: 'Staff / Faculty Accounts', key: 'staff', color: '#10B981' },
                { role: 'School Management Admins', key: 'management', color: '#F59E0B' },
                { role: 'Parent Accounts', key: 'parent', color: '#3B82F6' },
              ].map((item, idx) => {
                const count = analytics.portalBreakdown?.[item.key] ?? analytics[item.key] ?? 0;
                return (
                  <View
                    {...{ key: item.key }}
                    style={[styles.distributionRow, idx > 0 && { borderTopWidth: 1, borderTopColor: colors.borderLight }] as any}
                  >
                    <View style={styles.distribLeft}>
                      <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                      <Text style={[styles.distribRole, { color: colors.text }]}>{item.role}</Text>
                    </View>
                    <Text style={[styles.distribCount, { color: colors.text }]}>{count}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {activeTab === 'Audit Trail' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Real-Time Audit Stream</Text>
            {logs.length === 0 ? (
              <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
                <Ionicons name="list-outline" size={48} color={colors.textMuted} />
                <Text style={[styles.emptyText, { color: colors.textMuted }]}>No audit log events available</Text>
              </View>
            ) : (
              logs.map((log: any, idx: number) => {
                const action = log.action || log.event || 'System Action';
                const actor = log.user_email || log.user || log.actor || 'System Engine';
                const time = log.created_at || log.timestamp;
                return (
                  <View
                    {...{ key: log.id || idx }}
                    style={[styles.logCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs] as any}
                  >
                    <View style={styles.logHeader}>
                      <Text style={[styles.logActionText, { color: colors.text }]}>{action}</Text>
                      {time && (
                        <Text style={[styles.logTimeText, { color: colors.textMuted }]}>
                          {new Date(time).toLocaleDateString()} {new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      )}
                    </View>
                    <Text style={[styles.logActorText, { color: colors.textMuted }]}>Actor: {actor}</Text>
                    {log.ip_address && (
                      <Text style={[styles.logIpText, { color: colors.textMuted }]}>IP: {log.ip_address}</Text>
                    )}
                  </View>
                );
              })
            )}
          </View>
        )}

        {activeTab === 'Top Schools' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Ranked Institutions</Text>
            {topOrgs.length === 0 ? (
              <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
                <Ionicons name="business-outline" size={48} color={colors.textMuted} />
                <Text style={[styles.emptyText, { color: colors.textMuted }]}>No institutional rankings available</Text>
              </View>
            ) : (
              topOrgs.map((org: any, idx: number) => (
                <View
                  {...{ key: org.id || idx }}
                  style={[styles.topOrgCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs] as any}
                >
                  <View style={[styles.rankCircle, { backgroundColor: idx === 0 ? '#FEF3C7' : '#F3F4F6' }]}>
                    <Text style={[styles.rankText, { color: idx === 0 ? '#D97706' : colors.text }]}>#{idx + 1}</Text>
                  </View>
                  <View style={styles.topOrgInfo}>
                    <Text style={[styles.topOrgName, { color: colors.text }]}>{org.name || 'Unnamed Institution'}</Text>
                    <Text style={[styles.topOrgSub, { color: colors.textMuted }]}>{org.domain || org.slug || 'Active Tenant'}</Text>
                  </View>
                  <Badge label={`${org.user_count ?? org.usersCount ?? 0} Users`} variant="info" />
                </View>
              ))
            )}
          </View>
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
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  section: { marginBottom: spacing.lg },
  sectionTitle: { fontSize: fontSize.xs, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.md },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  metricCard: { flex: 1, minWidth: '45%', borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.md, alignItems: 'center' },
  metricVal: { fontSize: 20, fontWeight: '800', marginVertical: 4 },
  metricLbl: { fontSize: 10, fontWeight: '600', textAlign: 'center' },
  cardContainer: { borderRadius: borderRadius.xl, borderWidth: 1, overflow: 'hidden' },
  distributionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md },
  distribLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  colorDot: { width: 10, height: 10, borderRadius: 5 },
  distribRole: { fontSize: fontSize.xs, fontWeight: '600' },
  distribCount: { fontSize: fontSize.sm, fontWeight: '700' },
  emptyCard: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.xl, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: fontSize.sm, marginTop: spacing.sm, fontWeight: '500' },
  logCard: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.md, marginBottom: spacing.sm },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  logActionText: { fontSize: fontSize.sm, fontWeight: '700' },
  logTimeText: { fontSize: 10 },
  logActorText: { fontSize: 11, marginTop: 2 },
  logIpText: { fontSize: 10, marginTop: 2 },
  topOrgCard: { flexDirection: 'row', alignItems: 'center', borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.md, marginBottom: spacing.sm },
  rankCircle: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  rankText: { fontSize: 12, fontWeight: '800' },
  topOrgInfo: { flex: 1 },
  topOrgName: { fontSize: fontSize.sm, fontWeight: '700' },
  topOrgSub: { fontSize: 11, marginTop: 2 },
});
