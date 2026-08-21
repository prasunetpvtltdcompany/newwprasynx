import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, borderRadius, fontSize, spacing, shadows } from '../../theme';
import { Card, Badge } from '../../components';

export function ParentResultsScreen({ navigation }: any) {
  const { selectedChild } = useAuthStore();
  const { parentResults, fetchParentResults } = useDataStore();
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;

  useEffect(() => {
    if (selectedChild?.id) {
      fetchParentResults(selectedChild.id);
    }
  }, [selectedChild?.id]);

  const grades = parentResults?.grades || [];
  const gpa = grades.length > 0 ? (grades.reduce((sum: number, item: any) => sum + parseFloat(item.grade_point || 0), 0) / grades.length).toFixed(2) : '0.00';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Exam Results</Text>
        <View style={styles.placeholderButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* GPA Summary Card */}
        <Card style={styles.summaryCard}>
          <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Grade Point Average</Text>
          <View style={styles.row}>
            <Text style={[styles.gpaText, { color: colors.text }]}>{gpa}</Text>
            <View style={styles.badgeCol}>
              <Badge label="Active Term" variant="success" />
              <Text style={[styles.subLabel, { color: colors.textMuted }]}>
                Based on {grades.length} Subjects
              </Text>
            </View>
          </View>
        </Card>

        {/* Subjects breakdown */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Subject Grades</Text>
          {grades.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
              <Ionicons name="ribbon-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No grades posted for this term</Text>
            </View>
          ) : (
            grades.map((item: any) => (
              <View {...{key: item.id}} style={[styles.gradeCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs] as any}>
                <View style={styles.gradeHeader}>
                  <View style={styles.subjectInfo}>
                    <Text style={[styles.subjectName, { color: colors.text }]}>{item.subject_name || item.subject || 'Course'}</Text>
                    <Text style={[styles.instructor, { color: colors.textMuted }]}>
                      Grade Point: {item.grade_point || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.badgeWrapper}>
                    <Text style={[styles.gradeText, { color: '#6D4CFF' }]}>{item.grade || 'N/A'}</Text>
                  </View>
                </View>
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
  summaryLabel: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs },
  gpaText: { fontSize: 32, fontWeight: '800', marginRight: spacing.lg },
  badgeCol: { justifyContent: 'center' },
  subLabel: { fontSize: 9, marginTop: 4 },
  section: { paddingHorizontal: spacing.lg },
  sectionTitle: { fontSize: fontSize.xs, fontWeight: '600', letterSpacing: 0.5, marginBottom: spacing.sm, textTransform: 'uppercase' },
  emptyCard: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.xl, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: fontSize.sm, marginTop: spacing.sm, fontWeight: '500' },
  gradeCard: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.md, marginBottom: spacing.sm },
  gradeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  subjectInfo: { flex: 1 },
  subjectName: { fontSize: fontSize.sm, fontWeight: '600' },
  instructor: { fontSize: 10, marginTop: 2 },
  badgeWrapper: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F0FF', justifyContent: 'center', alignItems: 'center' },
  gradeText: { fontSize: 14, fontWeight: '800' },
});
