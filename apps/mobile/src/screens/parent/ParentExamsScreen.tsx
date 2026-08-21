import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, borderRadius, fontSize, spacing, shadows } from '../../theme';
import { Card } from '../../components';

export function ParentExamsScreen({ navigation }: any) {
  const { selectedChild } = useAuthStore();
  const { parentExams, fetchParentExams } = useDataStore();
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;

  useEffect(() => {
    if (selectedChild?.id) {
      fetchParentExams(selectedChild.id);
    }
  }, [selectedChild?.id]);

  const exams = parentExams || [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Exams</Text>
        <View style={styles.placeholderButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Upcoming Exam Schedule</Text>
          {exams.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
              <Ionicons name="calendar-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No upcoming exams scheduled</Text>
            </View>
          ) : (
            exams.map((item: any) => (
              <View {...{key: item.id}} style={[styles.examCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs] as any}>
                <View style={styles.examHeader}>
                  <View style={[styles.examIcon, { backgroundColor: colors.primaryLight }]}>
                    <Ionicons name="document-text" size={22} color={colors.primary} />
                  </View>
                  <View style={styles.examInfo}>
                    <Text style={[styles.examSubject, { color: colors.text }]}>{item.subject_name || item.title || 'Exam'}</Text>
                    <Text style={[styles.examName, { color: colors.textMuted }]}>{item.exam_name || 'Mid Sem Exam'}</Text>
                  </View>
                </View>
                <View style={[styles.examDetails, { borderTopColor: colors.borderLight }]}>
                  <View style={styles.detailItem}>
                    <Ionicons name="time-outline" size={16} color={colors.textMuted} style={styles.detailIcon} />
                    <Text style={[styles.detailText, { color: colors.text }]}>
                      {item.exam_date || item.date ? new Date(item.exam_date || item.date).toLocaleDateString() : 'TBD'}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="pin-outline" size={16} color={colors.textMuted} style={styles.detailIcon} />
                    <Text style={[styles.detailText, { color: colors.text }]}>{item.room_no || 'Room 101'}</Text>
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
  section: { paddingHorizontal: spacing.lg, marginTop: spacing.lg },
  sectionTitle: { fontSize: fontSize.xs, fontWeight: '600', letterSpacing: 0.5, marginBottom: spacing.sm, textTransform: 'uppercase' },
  emptyCard: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.xl, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: fontSize.sm, marginTop: spacing.sm, fontWeight: '500' },
  examCard: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.md, marginBottom: spacing.md },
  examHeader: { flexDirection: 'row', alignItems: 'center' },
  examIcon: { width: 44, height: 44, borderRadius: borderRadius.lg, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  examInfo: { flex: 1 },
  examSubject: { fontSize: fontSize.md, fontWeight: '600' },
  examName: { fontSize: fontSize.xs, marginTop: 2 },
  examDetails: { flexDirection: 'row', borderTopWidth: 1, marginTop: spacing.md, paddingTop: spacing.md, justifyContent: 'space-between' },
  detailItem: { flexDirection: 'row', alignItems: 'center' },
  detailIcon: { marginRight: 4 },
  detailText: { fontSize: fontSize.xs, fontWeight: '500' },
});
