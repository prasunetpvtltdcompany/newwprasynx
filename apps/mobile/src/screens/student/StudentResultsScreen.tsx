import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, fontSize, spacing, borderRadius, shadows } from '../../theme';
import { Card, Badge } from '../../components';

export function StudentResultsScreen({ navigation }: any) {
  const { student } = useAuthStore();
  const { results, fetchResults } = useDataStore();
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    if (student?.id) {
      await fetchResults(student.id);
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

  const scores = results || [];
  const totalScore = scores.reduce((sum, s) => sum + (s.score || 0), 0);
  const totalMax = scores.reduce((sum, s) => sum + (s.max_score || 100), 0);
  const avgPercentage = totalMax > 0 ? ((totalScore / totalMax) * 100).toFixed(1) : '0';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Results</Text>
        <View style={styles.placeholderButton} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      >
        <Card style={styles.overallCard}>
          <Text style={[styles.overallLabel, { color: colors.textSecondary }]}>Overall Average</Text>
          <Text style={[styles.overallPercent, { color: '#6D4CFF' }]}>{avgPercentage}%</Text>
          <View style={[styles.overallProgress, { backgroundColor: colors.borderLight }]}>
            <View
              style={[
                styles.overallFill,
                { backgroundColor: '#6D4CFF', width: `${parseFloat(avgPercentage)}%` },
              ]}
            />
          </View>
          <Text style={[styles.overallScore, { color: colors.textSecondary }]}>
            {totalScore} / {totalMax} total marks
          </Text>
        </Card>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Subject-wise Performance</Text>

        {scores.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="ribbon-outline" size={48} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>No exam grades available</Text>
          </View>
        ) : (
          scores.map((subject, index) => {
            const max = subject.max_score || 100;
            const pct = Math.min(((subject.score || 0) / max) * 100, 100);

            return (
              <Card key={subject.id || index}>
                <View style={styles.subjectRow}>
                  <View style={styles.subjectInfo}>
                    <Text style={[styles.subjectName, { color: colors.text }]}>{subject.subject || 'General'}</Text>
                    <Text style={[styles.subjectScore, { color: colors.textSecondary }]}>
                      Marks: {subject.score || 0} / {max}
                    </Text>
                  </View>
                  <View style={styles.subjectRight}>
                    <Badge label={subject.grade || 'A'} variant="success" />
                  </View>
                </View>
                <View style={[styles.subjectBar, { backgroundColor: colors.borderLight }]}>
                  <View
                    style={[
                      styles.subjectFill,
                      {
                        backgroundColor: pct >= 85 ? '#10B981' : pct >= 50 ? '#6D4CFF' : '#EF4444',
                        width: `${pct}%`,
                      },
                    ]}
                  />
                </View>
              </Card>
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
  overallCard: { alignItems: 'center', paddingVertical: spacing.lg },
  overallLabel: { fontSize: fontSize.sm, fontWeight: '600' },
  overallPercent: { fontSize: 28, fontWeight: '700', marginTop: spacing.xs },
  overallProgress: { width: '100%', height: 8, borderRadius: 4, marginTop: spacing.md, overflow: 'hidden' },
  overallFill: { height: '100%', borderRadius: 4 },
  overallScore: { fontSize: fontSize.xs, marginTop: spacing.sm, fontWeight: '500' },
  sectionTitle: { fontSize: fontSize.md, fontWeight: '600', marginBottom: spacing.md, marginTop: spacing.md },
  subjectRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  subjectInfo: { flex: 1 },
  subjectName: { fontSize: fontSize.sm, fontWeight: '600' },
  subjectScore: { fontSize: fontSize.xs, marginTop: 2 },
  subjectRight: {},
  subjectBar: { height: 4, borderRadius: 2, marginTop: spacing.sm, overflow: 'hidden' },
  subjectFill: { height: '100%', borderRadius: 2 },
  emptyContainer: { paddingVertical: spacing.xxl * 2, alignItems: 'center' },
  emptyText: { fontSize: fontSize.sm, fontWeight: '500' },
});
