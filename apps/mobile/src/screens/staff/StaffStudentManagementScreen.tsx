import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, borderRadius, fontSize, spacing, shadows } from '../../theme';
import { Card, Badge, Loader } from '../../components';

export function StaffStudentManagementScreen({ navigation }: any) {
  const { staff } = useAuthStore();
  const { staffStudents, fetchStaffStudents, staffClasses, fetchStaffClasses } = useDataStore();
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;

  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeStudent, setActiveStudent] = useState<any>(null);

  const loadData = async () => {
    if (staff?.id) {
      setLoading(true);
      await fetchStaffStudents(staff.id);
      await fetchStaffClasses(staff.id);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [staff?.id]);

  const students = staffStudents || [];

  const filtered = students.filter((student: any) => {
    const nameMatch = student.full_name?.toLowerCase().includes(search.toLowerCase());
    const rollMatch = student.roll_number?.includes(search);
    const classMatch = selectedClass ? student.class_id === selectedClass.class_id : true;
    return (nameMatch || rollMatch) && classMatch;
  });

  const getInitials = (name: string) => {
    return name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'ST';
  };

  if (loading) return <Loader fullScreen message="Loading student list..." />;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Students Directory</Text>
        <View style={styles.placeholderButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchBlock}>
          <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
            <Ionicons name="search-outline" size={20} color={colors.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search students by name or roll number..."
              placeholderTextColor={colors.textMuted}
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        {/* Class filters */}
        <View style={styles.selectorBlock}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Filter by Class</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
            <TouchableOpacity
              style={[
                styles.chip,
                {
                  backgroundColor: !selectedClass ? '#F3F0FF' : colors.surface,
                  borderColor: !selectedClass ? '#6D4CFF' : colors.borderLight,
                }
              ]}
              onPress={() => setSelectedClass(null)}
            >
              <Text style={[styles.chipText, { color: !selectedClass ? '#6D4CFF' : colors.text }]}>All Classes</Text>
            </TouchableOpacity>
            {staffClasses.map((item: any) => {
              const isSelected = selectedClass?.class_id === item.class_id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isSelected ? '#F3F0FF' : colors.surface,
                      borderColor: isSelected ? '#6D4CFF' : colors.borderLight,
                    }
                  ]}
                  onPress={() => setSelectedClass(item)}
                >
                  <Text style={[styles.chipText, { color: isSelected ? '#6D4CFF' : colors.text }]}>
                    Class {item.class?.name || 'Class'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Student card list */}
        <View style={styles.listBlock}>
          <Text style={[styles.resultCountText, { color: colors.textMuted }]}>{filtered.length} Students found</Text>
          {filtered.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
              <Ionicons name="people-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No students matched this filter</Text>
            </View>
          ) : (
            filtered.map((student: any) => (
              <TouchableOpacity
                key={student.id}
                onPress={() => setActiveStudent(student)}
                style={[styles.studentCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}
              >
                <View style={[styles.avatarCircle, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.avatarText, { color: colors.primary }]}>{getInitials(student.full_name)}</Text>
                </View>
                <View style={styles.studentInfo}>
                  <Text style={[styles.studentName, { color: colors.text }]}>{student.full_name}</Text>
                  <Text style={[styles.studentMeta, { color: colors.textMuted }]}>
                    Roll: {student.roll_number || 'N/A'} • Class {student.student_class || 'N/A'}
                  </Text>
                </View>
                <View style={styles.arrowIcon}>
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Details modal */}
      {activeStudent && (
        <Modal visible={!!activeStudent} animationType="slide" transparent>
          <View style={styles.modalBackdrop}>
            <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Student Profile</Text>
                <TouchableOpacity onPress={() => setActiveStudent(null)}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <View style={styles.profileHero}>
                <View style={[styles.heroAvatarCircle, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.heroAvatarText, { color: colors.primary }]}>
                    {getInitials(activeStudent.full_name)}
                  </Text>
                </View>
                <Text style={[styles.profileName, { color: colors.text }]}>{activeStudent.full_name}</Text>
                <Text style={[styles.profileClass, { color: colors.textMuted }]}>
                  Class {activeStudent.student_class || 'N/A'}
                </Text>
              </View>

              <View style={styles.profileSection}>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Roll Number</Text>
                  <Text style={[styles.detailVal, { color: colors.text }]}>{activeStudent.roll_number || 'N/A'}</Text>
                </View>
                <View style={[styles.detailRow, styles.borderTop, { borderTopColor: colors.borderLight }]}>
                  <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Contact Email</Text>
                  <Text style={[styles.detailVal, { color: colors.text }]}>{activeStudent.email || 'N/A'}</Text>
                </View>
                <View style={[styles.detailRow, styles.borderTop, { borderTopColor: colors.borderLight }]}>
                  <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Blood Group</Text>
                  <Text style={[styles.detailVal, { color: colors.text }]}>{activeStudent.blood_group || 'N/A'}</Text>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}
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
  searchBlock: { paddingHorizontal: spacing.lg, marginTop: spacing.md },
  searchBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: borderRadius.xl, paddingHorizontal: spacing.md, height: 46 },
  searchInput: { flex: 1, marginLeft: spacing.sm, fontSize: fontSize.sm },
  selectorBlock: { paddingHorizontal: spacing.lg, marginTop: spacing.lg },
  sectionTitle: { fontSize: fontSize.xs, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: spacing.sm },
  chipsScroll: { gap: spacing.sm },
  chip: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full, borderWidth: 1 },
  chipText: { fontSize: fontSize.xs, fontWeight: '700' },
  listBlock: { paddingHorizontal: spacing.lg, marginTop: spacing.lg },
  resultCountText: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', marginBottom: spacing.sm },
  emptyCard: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.xl, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: fontSize.sm, marginTop: spacing.sm, fontWeight: '500' },
  studentCard: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderRadius: borderRadius.xl, borderWidth: 1, marginBottom: spacing.sm },
  avatarCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  avatarText: { fontSize: 14, fontWeight: '700' },
  studentInfo: { flex: 1 },
  studentName: { fontSize: fontSize.sm, fontWeight: '700' },
  studentMeta: { fontSize: 11, marginTop: 2 },
  arrowIcon: { padding: spacing.xs },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end', zIndex: 1000 },
  modalCard: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: spacing.lg, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  profileHero: { alignItems: 'center', marginVertical: spacing.lg },
  heroAvatarCircle: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md },
  heroAvatarText: { fontSize: 22, fontWeight: '700' },
  profileName: { fontSize: 18, fontWeight: '700', marginBottom: 2 },
  profileClass: { fontSize: fontSize.xs },
  profileSection: { borderRadius: borderRadius.xl, borderWidth: 1, borderColor: '#F3F4F6', overflow: 'hidden' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', padding: spacing.md },
  borderTop: { borderTopWidth: 1 },
  detailLabel: { fontSize: fontSize.xs, fontWeight: '500' },
  detailVal: { fontSize: fontSize.sm, fontWeight: '600' },
});
