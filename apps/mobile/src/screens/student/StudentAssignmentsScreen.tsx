import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, fontSize, spacing, borderRadius, shadows } from '../../theme';
import { Card, Badge } from '../../components';

type Filter = 'all' | 'pending' | 'submitted' | 'graded';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'submitted', label: 'Submitted' },
  { key: 'graded', label: 'Graded' },
];

export function StudentAssignmentsScreen() {
  const { student } = useAuthStore();
  const { assignments, fetchAssignments } = useDataStore();
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;
  const [activeFilter, setActiveFilter] = useState<Filter>('all');
  const [selectedAssignment, setSelectedAssignment] = useState<any | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    if (student?.id) {
      await fetchAssignments(student.id);
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

  const getStatus = (assignment: any): Filter => {
    return assignment.submission_status || 'pending';
  };

  const statusVariant = (status: Filter) => {
    switch (status) {
      case 'pending': return 'warning' as const;
      case 'submitted': return 'info' as const;
      case 'graded': return 'success' as const;
      default: return 'default' as const;
    }
  };

  const filtered = (assignments || []).filter((a) => {
    const status = getStatus(a);
    return activeFilter === 'all' || status === activeFilter;
  });

  if (selectedAssignment) {
    const status = getStatus(selectedAssignment);
    const grade = selectedAssignment.submission?.grade;
    const maxScore = selectedAssignment.max_score || 100;
    const marksText = grade != null ? `${grade}/${maxScore}` : undefined;

    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
          <TouchableOpacity onPress={() => setSelectedAssignment(null)} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Assignment Details</Text>
          <View style={styles.placeholderButton} />
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          <Card>
            <Badge label={status.charAt(0).toUpperCase() + status.slice(1)} variant={statusVariant(status)} />
            <Text style={[styles.detailSubject, { color: '#6D4CFF', marginTop: spacing.md }]}>{selectedAssignment.subject || 'General'}</Text>
            <Text style={[styles.detailTitle, { color: colors.text }]}>{selectedAssignment.title}</Text>
            <View style={[styles.detailRow, { borderTopColor: colors.borderLight }]}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Due Date</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {selectedAssignment.due_date ? new Date(selectedAssignment.due_date).toLocaleDateString() : 'N/A'}
              </Text>
            </View>
            {marksText && (
              <View style={[styles.detailRow, { borderTopColor: colors.borderLight }]}>
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Marks</Text>
                <Text style={[styles.detailValue, { color: '#10B981' }]}>{marksText}</Text>
              </View>
            )}
            <View style={[styles.detailRow, { borderTopColor: colors.borderLight }]}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Description</Text>
              <Text style={[styles.detailValue, { color: colors.text, flex: 1 }]}>
                {selectedAssignment.description || 'Complete all instructions and submit before the deadline.'}
              </Text>
            </View>
          </Card>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Assignments</Text>
      </View>

      <View style={[styles.filterRow, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[
                styles.filterChip,
                {
                  backgroundColor: activeFilter === f.key ? '#6D4CFF' : colors.surface,
                  borderColor: activeFilter === f.key ? '#6D4CFF' : colors.borderLight,
                },
              ]}
              onPress={() => setActiveFilter(f.key)}
            >
              <Text style={[styles.filterText, { color: activeFilter === f.key ? '#FFF' : colors.text }]}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={48} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No assignments found</Text>
          </View>
        ) : (
          filtered.map((assignment) => {
            const status = getStatus(assignment);
            const grade = assignment.submission?.grade;
            const maxScore = assignment.max_score || 100;
            const marksText = grade != null ? `${grade}/${maxScore}` : undefined;

            return (
              <TouchableOpacity key={assignment.id} onPress={() => setSelectedAssignment(assignment)} activeOpacity={0.7}>
                <Card>
                  <View style={styles.assignmentHeader}>
                    <Text style={[styles.assignmentSubject, { color: '#6D4CFF' }]}>{assignment.subject || 'General'}</Text>
                    <Badge
                      label={status.charAt(0).toUpperCase() + status.slice(1)}
                      variant={statusVariant(status)}
                    />
                  </View>
                  <Text style={[styles.assignmentTitle, { color: colors.text }]}>{assignment.title}</Text>
                  <View style={styles.assignmentFooter}>
                    <Text style={[styles.assignmentDue, { color: colors.textSecondary }]}>
                      Due: {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'N/A'}
                    </Text>
                    {marksText && (
                      <Text style={[styles.assignmentMarks, { color: '#10B981' }]}>{marksText}</Text>
                    )}
                  </View>
                </Card>
              </TouchableOpacity>
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
  scroll: { padding: spacing.md, paddingBottom: spacing.xxl },
  filterRow: { borderBottomWidth: 1, paddingVertical: spacing.sm },
  filterScroll: { paddingHorizontal: spacing.md, gap: spacing.sm },
  filterChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full, borderWidth: 1 },
  filterText: { fontSize: fontSize.sm, fontWeight: '600' },
  assignmentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  assignmentSubject: { fontSize: fontSize.xs, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  assignmentTitle: { fontSize: fontSize.md, fontWeight: '600', marginTop: spacing.xs },
  assignmentFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm },
  assignmentDue: { fontSize: fontSize.xs },
  assignmentMarks: { fontSize: fontSize.sm, fontWeight: '700' },
  detailSubject: { fontSize: fontSize.xs, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  detailTitle: { fontSize: fontSize.xl, fontWeight: '700', marginTop: spacing.xs },
  detailRow: { flexDirection: 'row', paddingVertical: spacing.md, borderTopWidth: 1 },
  detailLabel: { fontSize: fontSize.sm, width: 100 },
  detailValue: { fontSize: fontSize.sm, fontWeight: '600' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xxl * 2 },
  emptyText: { fontSize: fontSize.md, marginTop: spacing.md, fontWeight: '500' },
});
