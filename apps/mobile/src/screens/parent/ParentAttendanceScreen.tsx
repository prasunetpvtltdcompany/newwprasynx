import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, borderRadius, fontSize, spacing, shadows } from '../../theme';
import { Card, Badge } from '../../components';

export function ParentAttendanceScreen({ navigation }: any) {
  const { selectedChild } = useAuthStore();
  const { parentAttendance, fetchParentAttendance } = useDataStore();
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;

  useEffect(() => {
    if (selectedChild?.id) {
      fetchParentAttendance(selectedChild.id);
    }
  }, [selectedChild?.id]);

  const records = parentAttendance || [];
  const total = records.length;
  const present = records.filter((r: any) => r.status === 'present').length;
  const absent = records.filter((r: any) => r.status === 'absent').length;
  const percentage = total ? Math.round((present / total) * 100) : 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Attendance History</Text>
        <View style={styles.placeholderButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Overall Ring Card */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.circleOuter}>
              <View style={[styles.circleInner, { borderColor: '#6D4CFF' }]}>
                <Text style={[styles.percentText, { color: colors.text }]}>{percentage}%</Text>
                <Text style={[styles.labelText, { color: colors.textMuted }]}>Overall</Text>
              </View>
            </View>
            <View style={styles.detailsCol}>
              <Text style={[styles.title, { color: colors.text }]}>Overall Record</Text>
              <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                {selectedChild?.full_name ? selectedChild.full_name.split(' ')[0] : 'Student'} Attendance
              </Text>
              <View style={styles.breakdownRow}>
                <View style={styles.statBox}>
                  <Text style={[styles.statValue, { color: '#10B981' }]}>{present}</Text>
                  <Text style={[styles.statLabel, { color: colors.textMuted }]}>Present</Text>
                </View>
                <View style={[styles.statBox, styles.statBorder, { borderColor: colors.borderLight }]}>
                  <Text style={[styles.statValue, { color: '#EF4444' }]}>{absent}</Text>
                  <Text style={[styles.statLabel, { color: colors.textMuted }]}>Absent</Text>
                </View>
              </View>
            </View>
          </View>
        </Card>

        {/* History List */}
        <View style={styles.historySection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Day-by-Day Logs</Text>
          {records.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
              <Ionicons name="calendar-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No attendance records found</Text>
            </View>
          ) : (
            records.map((item: any) => (
              <View {...{key: item.id}} style={[styles.logCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs] as any}>
                <View style={styles.logHeader}>
                  <Text style={[styles.logDate, { color: colors.text }]}>
                    {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}
                  </Text>
                  <Badge
                    label={item.status === 'present' ? 'Present' : 'Absent'}
                    variant={item.status === 'present' ? 'success' : 'danger'}
                  />
                </View>
                {item.notes ? (
                  <Text style={[styles.logNotes, { color: colors.textMuted }]}>Remarks: {item.notes}</Text>
                ) : null}
              </View>
            ))
          )}
        </View>
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
  scroll: { paddingBottom: spacing.xxl },
  summaryCard: { margin: spacing.lg, padding: spacing.md },
  summaryRow: { flexDirection: 'row', alignItems: 'center' },
  circleOuter: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 8,
    borderColor: '#F3F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  circleInner: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 8,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentText: { fontSize: fontSize.md, fontWeight: '800' },
  labelText: { fontSize: 8, fontWeight: '600', marginTop: 1 },
  detailsCol: { flex: 1 },
  title: { fontSize: fontSize.md, fontWeight: '700' },
  subtitle: { fontSize: fontSize.xs, marginTop: 2 },
  breakdownRow: { flexDirection: 'row', marginTop: spacing.md, gap: spacing.md },
  statBox: { flex: 1, alignItems: 'center' },
  statBorder: { borderLeftWidth: 1, paddingLeft: spacing.md },
  statValue: { fontSize: fontSize.sm, fontWeight: '700' },
  statLabel: { fontSize: 8, marginTop: 2 },
  historySection: { paddingHorizontal: spacing.lg },
  sectionTitle: { fontSize: fontSize.xs, fontWeight: '600', letterSpacing: 0.5, marginBottom: spacing.sm, textTransform: 'uppercase' },
  emptyCard: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.xl, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: fontSize.sm, marginTop: spacing.sm, fontWeight: '500' },
  logCard: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.md, marginBottom: spacing.sm },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logDate: { fontSize: fontSize.sm, fontWeight: '600' },
  logNotes: { fontSize: fontSize.xs, marginTop: spacing.xs },
});
