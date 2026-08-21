import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, fontSize, spacing, borderRadius, shadows } from '../../theme';
import { Card, Badge } from '../../components';

export function StudentAttendanceScreen() {
  const { student } = useAuthStore();
  const { attendance, fetchAttendance } = useDataStore();
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;
  const [selectedTab, setSelectedTab] = useState<'overview' | 'subject'>('overview');
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    if (student?.id) {
      await fetchAttendance(student.id);
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

  // Dynamic calculations
  const total = attendance?.length || 0;
  const present = attendance?.filter(r => r.status === 'present').length || 0;
  const absent = attendance?.filter(r => r.status === 'absent').length || 0;
  const leave = attendance?.filter(r => r.status === 'leave' || r.status === 'late').length || 0;
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

  // Subject-wise breakdown from remarks
  const subjectGroups: Record<string, { present: number; total: number }> = {};
  (attendance || []).forEach(record => {
    const subjectName = record.notes?.replace('QR scan - ', '') || 'General';
    if (!subjectGroups[subjectName]) {
      subjectGroups[subjectName] = { present: 0, total: 0 };
    }
    subjectGroups[subjectName].total += 1;
    if (record.status === 'present') {
      subjectGroups[subjectName].present += 1;
    }
  });

  const subjectBreakdown = Object.entries(subjectGroups).map(([name, stats]) => ({
    name,
    present: stats.present,
    total: stats.total,
    percentage: stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0
  }));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present': return <Badge label="Present" variant="success" />;
      case 'absent': return <Badge label="Absent" variant="danger" />;
      default: return <Badge label="Leave" variant="warning" />;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Attendance</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      >
        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryMain}>
              <View style={styles.gaugeContainer}>
                <Text style={[styles.percentage, { color: colors.primary }]}>{percentage}%</Text>
              </View>
              <Text style={[styles.percentageLabel, { color: colors.textSecondary }]}>Overall Attendance</Text>
            </View>
            <View style={styles.summaryStats}>
              <View style={styles.summaryItem}>
                <View style={[styles.dot, { backgroundColor: colors.success }]} />
                <Text style={[styles.summaryText, { color: colors.text }]}>Present: {present}</Text>
              </View>
              <View style={styles.summaryItem}>
                <View style={[styles.dot, { backgroundColor: colors.error }]} />
                <Text style={[styles.summaryText, { color: colors.text }]}>Absent: {absent}</Text>
              </View>
              <View style={styles.summaryItem}>
                <View style={[styles.dot, { backgroundColor: colors.warning }]} />
                <Text style={[styles.summaryText, { color: colors.text }]}>Leave: {leave}</Text>
              </View>
            </View>
          </View>
        </Card>

        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'overview' && { backgroundColor: '#6D4CFF' }]}
            onPress={() => setSelectedTab('overview')}
          >
            <Text style={[styles.tabText, { color: selectedTab === 'overview' ? '#FFF' : '#6D4CFF' }]}>
              Recent Records
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'subject' && { backgroundColor: '#6D4CFF' }]}
            onPress={() => setSelectedTab('subject')}
          >
            <Text style={[styles.tabText, { color: selectedTab === 'subject' ? '#FFF' : '#6D4CFF' }]}>
              Subject Wise
            </Text>
          </TouchableOpacity>
        </View>

        {selectedTab === 'overview' ? (
          <Card title="Recent History">
            {total === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="calendar-outline" size={48} color={colors.textMuted} />
                <Text style={[styles.emptyText, { color: colors.textMuted }]}>No attendance records available</Text>
              </View>
            ) : (
              attendance.map((record, index) => (
                <View
                  key={record.id || index}
                  style={[styles.recordItem, { borderBottomColor: colors.borderLight }]}
                >
                  <View style={styles.recordLeft}>
                    <Text style={[styles.recordDate, { color: colors.text }]}>{record.date ? new Date(record.date).toLocaleDateString() : 'N/A'}</Text>
                    <Text style={[styles.recordSubject, { color: colors.textMuted }]}>{record.notes || 'General Attendance'}</Text>
                  </View>
                  {getStatusBadge(record.status)}
                </View>
              ))
            )}
          </Card>
        ) : (
          <Card title="Subject-wise Breakdown">
            {subjectBreakdown.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="journal-outline" size={48} color={colors.textMuted} />
                <Text style={[styles.emptyText, { color: colors.textMuted }]}>No subject-wise details available</Text>
              </View>
            ) : (
              subjectBreakdown.map((subject, index) => (
                <View
                  key={index}
                  style={[styles.subjectItem, { borderBottomColor: colors.borderLight }]}
                >
                  <View style={styles.subjectHeader}>
                    <Text style={[styles.subjectName, { color: colors.text }]}>{subject.name}</Text>
                    <Text style={[styles.subjectPercent, { color: subject.percentage >= 75 ? '#10B981' : '#EF4444' }]}>
                      {subject.percentage}%
                    </Text>
                  </View>
                  <View style={[styles.progressBar, { backgroundColor: colors.borderLight }]}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          backgroundColor: subject.percentage >= 75 ? '#10B981' : '#EF4444',
                          width: `${subject.percentage}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.subjectDetail, { color: colors.textMuted }]}>
                    {subject.present} / {subject.total} days present
                  </Text>
                </View>
              ))
            )}
          </Card>
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
  summaryCard: { marginBottom: spacing.md },
  summaryRow: { flexDirection: 'row', alignItems: 'center' },
  summaryMain: { flex: 1, alignItems: 'center' },
  gaugeContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    borderColor: '#6D4CFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentage: { fontSize: 20, fontWeight: '700' },
  percentageLabel: { fontSize: fontSize.xs, marginTop: spacing.sm },
  summaryStats: { flex: 1, gap: spacing.sm },
  summaryItem: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: spacing.sm },
  summaryText: { fontSize: fontSize.sm, fontWeight: '500' },
  tabRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  tab: { flex: 1, paddingVertical: spacing.sm, borderRadius: borderRadius.md, alignItems: 'center', backgroundColor: '#F3F0FF' },
  tabText: { fontSize: fontSize.sm, fontWeight: '600' },
  recordItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.md, borderBottomWidth: 1 },
  recordLeft: {},
  recordDate: { fontSize: fontSize.sm, fontWeight: '600' },
  recordSubject: { fontSize: fontSize.xs, marginTop: 2 },
  subjectItem: { paddingVertical: spacing.md, borderBottomWidth: 1 },
  subjectHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  subjectName: { fontSize: fontSize.sm, fontWeight: '600' },
  subjectPercent: { fontSize: fontSize.sm, fontWeight: '700' },
  progressBar: { height: 6, borderRadius: 3, marginTop: spacing.sm, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  subjectDetail: { fontSize: fontSize.xs, marginTop: spacing.xs },
  emptyContainer: { paddingVertical: spacing.xl, alignItems: 'center' },
  emptyText: { fontSize: fontSize.sm, fontWeight: '500', marginTop: spacing.xs },
});
