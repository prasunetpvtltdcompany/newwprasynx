import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, borderRadius, fontSize, spacing, shadows } from '../../theme';

export function StudentAcademicsScreen({ navigation }: any) {
  const { student, user } = useAuthStore();
  const { timetable, fetchTimetable } = useDataStore();
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;

  useEffect(() => {
    if (student?.id) {
      fetchTimetable(student.id);
    }
  }, [student?.id]);

  // Extract unique subjects from timetable
  const uniqueSubjects = Array.from(
    new Map(
      (timetable || [])
        .filter(t => t.subject)
        .map(item => [item.subject, item])
    ).values()
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Academics</Text>
        <View style={styles.placeholderButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#6D4CFF', '#7C3AED', '#2D1B69']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Text style={styles.heroTitle}>Academic Profile</Text>
          <View style={[styles.heroCard, shadows.md]}>
            <View style={styles.heroRow}>
              <View style={styles.heroCol}>
                <Text style={styles.heroLabel}>COURSE</Text>
                <Text style={styles.heroValue}>{student?.student_class || 'B.Tech CSE'}</Text>
              </View>
              <View style={styles.heroCol}>
                <Text style={styles.heroLabel}>ROLL NO</Text>
                <Text style={styles.heroValue}>{student?.roll_number || 'N/A'}</Text>
              </View>
            </View>
            <View style={[styles.heroRow, styles.marginTop]}>
              <View style={styles.heroCol}>
                <Text style={styles.heroLabel}>DEPARTMENT</Text>
                <Text style={styles.heroValue}>Computer Science</Text>
              </View>
              <View style={styles.heroCol}>
                <Text style={styles.heroLabel}>SEMESTER</Text>
                <Text style={styles.heroValue}>Semester 5</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Registered Subjects</Text>
          {uniqueSubjects.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
              <Ionicons name="journal-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No registered subjects found</Text>
            </View>
          ) : (
            uniqueSubjects.map((item: any) => (
              <View key={item.id} style={[styles.subjectCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
                <View style={styles.subjectRow}>
                  <View style={[styles.subjectIcon, { backgroundColor: colors.primaryLight }]}>
                    <Ionicons name="book" size={20} color={colors.primary} />
                  </View>
                  <View style={styles.subjectInfo}>
                    <Text style={[styles.subjectName, { color: colors.text }]}>{item.subject}</Text>
                    <Text style={[styles.subjectInstructor, { color: colors.textMuted }]}>Instructor: {item.teacher_name || 'Prof. Mehta'}</Text>
                  </View>
                  <View style={styles.creditBadge}>
                    <Text style={styles.creditText}>4 Credits</Text>
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
  hero: {
    padding: spacing.xl,
    borderBottomLeftRadius: borderRadius.xxl,
    borderBottomRightRadius: borderRadius.xxl,
    paddingBottom: spacing.xxl,
  },
  heroTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', marginBottom: spacing.md, textAlign: 'center' },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  heroRow: { flexDirection: 'row', justifyContent: 'space-between' },
  heroCol: { flex: 1 },
  heroLabel: { fontSize: 10, fontWeight: '600', color: '#9CA3AF', letterSpacing: 0.5, marginBottom: 2 },
  heroValue: { fontSize: 15, fontWeight: '700', color: '#1F2937' },
  marginTop: { marginTop: spacing.md },
  section: { paddingHorizontal: spacing.lg, marginTop: spacing.lg },
  sectionTitle: { fontSize: fontSize.xs, fontWeight: '600', letterSpacing: 0.5, marginBottom: spacing.sm, textTransform: 'uppercase' },
  emptyCard: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.xl, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: fontSize.sm, marginTop: spacing.sm, fontWeight: '500' },
  subjectCard: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.md, marginBottom: spacing.md },
  subjectRow: { flexDirection: 'row', alignItems: 'center' },
  subjectIcon: { width: 42, height: 42, borderRadius: borderRadius.lg, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  subjectInfo: { flex: 1 },
  subjectName: { fontSize: fontSize.md, fontWeight: '600' },
  subjectInstructor: { fontSize: fontSize.xs, marginTop: 2 },
  creditBadge: { backgroundColor: '#F3F0FF', borderRadius: borderRadius.lg, paddingVertical: 4, paddingHorizontal: spacing.sm },
  creditText: { fontSize: fontSize.xs, fontWeight: '600', color: '#6D4CFF' },
});
