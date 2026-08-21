import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, borderRadius, fontSize, spacing, shadows } from '../../theme';
import { Card, Badge, Button, Loader } from '../../components';
import { apiPost } from '../../services/api';

const STATUS_OPTIONS: { label: string; value: string; color: string }[] = [
  { label: 'P', value: 'present', color: '#10B981' },
  { label: 'A', value: 'absent', color: '#EF4444' },
  { label: 'L', value: 'leave', color: '#3B82F6' },
];

export function StaffAttendanceScreen({ navigation }: any) {
  const { staff } = useAuthStore();
  const { staffClasses, fetchStaffClasses, staffStudents, fetchStaffStudents } = useDataStore();
  
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;

  const [activeClass, setActiveClass] = useState<any>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const loadData = async () => {
    if (staff?.id) {
      setLoading(true);
      await fetchStaffClasses(staff.id);
      await fetchStaffStudents(staff.id);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [staff?.id]);

  // Set default class once loaded
  useEffect(() => {
    if (staffClasses.length > 0 && !activeClass) {
      setActiveClass(staffClasses[0]);
    }
  }, [staffClasses]);

  // Initialize records when students / class change
  const classStudents = activeClass
    ? staffStudents.filter((s: any) => s.class_id === activeClass.class_id)
    : [];

  useEffect(() => {
    const records: Record<string, string> = {};
    classStudents.forEach((student: any) => {
      records[student.id] = 'present'; // default present
    });
    setAttendanceRecords(records);
  }, [activeClass, staffStudents]);

  const updateStatus = (studentId: string, status: string) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const markAllPresent = () => {
    const updated = { ...attendanceRecords };
    classStudents.forEach((s: any) => {
      updated[s.id] = 'present';
    });
    setAttendanceRecords(updated);
  };

  // Compute counts
  const presentCount = Object.values(attendanceRecords).filter(v => v === 'present').length;
  const absentCount = Object.values(attendanceRecords).filter(v => v === 'absent').length;
  const leaveCount = Object.values(attendanceRecords).filter(v => v === 'leave').length;

  const handleSubmit = async () => {
    if (!activeClass || !staff?.id) return;
    setSubmitting(true);
    setShowConfirm(false);

    try {
      const dateStr = new Date().toISOString().split('T')[0];
      const records = Object.entries(attendanceRecords).map(([student_id, status]) => ({
        student_id,
        status: status.toUpperCase()
      }));

      const res = await apiPost('/staff/attendance/bulk', {
        teacher_id: staff.id,
        class_id: activeClass.class_id,
        date: dateStr,
        attendance_records: records
      });

      if (res.success) {
        alert('Attendance submitted successfully!');
        navigation.goBack();
      } else {
        alert(res.error || 'Failed to submit attendance');
      }
    } catch (e: any) {
      alert(e.message || 'Error occurred while saving attendance');
    } finally {
      setSubmitting(false);
    }
  };

  const todayStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const getInitials = (name: string) => {
    return name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'ST';
  };

  if (loading) return <Loader fullScreen message="Loading classes..." />;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Mark Attendance</Text>
        <View style={styles.placeholderButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Class Selection chips */}
        <View style={styles.selectorBlock}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Select Class</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
            {staffClasses.map((item: any) => {
              const isSelected = activeClass?.class_id === item.class_id;
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
                  onPress={() => setActiveClass(item)}
                >
                  <Text style={[styles.chipText, { color: isSelected ? '#6D4CFF' : colors.text }]}>
                    Class {item.class?.name || 'Period'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Date / Info Header */}
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color="#6D4CFF" />
            <Text style={[styles.dateText, { color: colors.text }]}>{todayStr}</Text>
          </View>
          <View style={[styles.summaryContainer, { marginTop: spacing.md }]}>
            <View style={styles.summaryCol}>
              <Text style={[styles.summaryNum, { color: '#10B981' }]}>{presentCount}</Text>
              <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Present</Text>
            </View>
            <View style={styles.summaryCol}>
              <Text style={[styles.summaryNum, { color: '#EF4444' }]}>{absentCount}</Text>
              <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Absent</Text>
            </View>
            <View style={styles.summaryCol}>
              <Text style={[styles.summaryNum, { color: '#3B82F6' }]}>{leaveCount}</Text>
              <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Leave</Text>
            </View>
          </View>
        </Card>

        {/* Actions bar */}
        <View style={styles.actionsBar}>
          <Text style={[styles.studentCountText, { color: colors.text }]}>{classStudents.length} Students</Text>
          <TouchableOpacity onPress={markAllPresent} style={styles.allPresentBtn}>
            <Text style={styles.allPresentBtnText}>Mark All Present</Text>
          </TouchableOpacity>
        </View>

        {/* Student Register list */}
        {classStudents.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
            <Ionicons name="people-outline" size={48} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>No students mapped to this class</Text>
          </View>
        ) : (
          classStudents.map((student: any) => {
            const status = attendanceRecords[student.id] || 'present';
            return (
              <View {...{key: student.id}} style={[styles.studentCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs] as any}>
                <View style={[styles.avatarCircle, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.avatarText, { color: colors.primary }]}>{getInitials(student.full_name)}</Text>
                </View>
                <View style={styles.studentDetails}>
                  <Text style={[styles.studentName, { color: colors.text }]}>{student.full_name}</Text>
                  <Text style={[styles.studentRoll, { color: colors.textMuted }]}>Roll: {student.roll_number || 'N/A'}</Text>
                </View>
                <View style={styles.statusButtonsGroup}>
                  {STATUS_OPTIONS.map((opt) => {
                    const isActive = status === opt.value;
                    return (
                      <TouchableOpacity
                        key={opt.value}
                        style={[
                          styles.statusBtn,
                          {
                            backgroundColor: isActive ? opt.color : colors.surface,
                            borderColor: isActive ? opt.color : colors.borderLight,
                          }
                        ]}
                        onPress={() => updateStatus(student.id, opt.value)}
                      >
                        <Text style={[styles.statusBtnLabel, { color: isActive ? '#FFFFFF' : colors.text }]}>
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            );
          })
        )}

        {/* Submit */}
        {classStudents.length > 0 && (
          <Button
            title="Submit Attendance"
            onPress={() => setShowConfirm(true)}
            size="lg"
            style={styles.submitButton}
            loading={submitting}
          />
        )}
      </ScrollView>

      {/* Confirmation Modal */}
      {showConfirm && (
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Submit Attendance?</Text>
            <Text style={[styles.modalDesc, { color: colors.textMuted }]}>
              Please verify counts before submitting:
            </Text>
            <View style={styles.modalCounts}>
              <Text style={{ color: '#10B981', fontWeight: '700' }}>Present: {presentCount}</Text>
              <Text style={{ color: '#EF4444', fontWeight: '700', marginVertical: 4 }}>Absent: {absentCount}</Text>
              <Text style={{ color: '#3B82F6', fontWeight: '700' }}>Leave: {leaveCount}</Text>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setShowConfirm(false)} style={styles.cancelBtn}>
                <Text style={[styles.cancelText, { color: colors.textMuted }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSubmit} style={styles.confirmBtn}>
                <Text style={styles.confirmText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
  selectorBlock: { paddingHorizontal: spacing.lg, marginTop: spacing.md },
  sectionTitle: { fontSize: fontSize.xs, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: spacing.sm },
  chipsScroll: { gap: spacing.sm },
  chip: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full, borderWidth: 1 },
  chipText: { fontSize: fontSize.xs, fontWeight: '700' },
  infoCard: { marginHorizontal: spacing.lg, marginTop: spacing.lg, padding: spacing.md },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  dateText: { fontSize: fontSize.sm, fontWeight: '600' },
  summaryContainer: { flexDirection: 'row', justifyContent: 'space-around' },
  summaryCol: { alignItems: 'center' },
  summaryNum: { fontSize: 20, fontWeight: '800' },
  summaryLabel: { fontSize: 10, fontWeight: '500', marginTop: 2 },
  actionsBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, marginTop: spacing.lg, marginBottom: spacing.xs },
  studentCountText: { fontSize: fontSize.sm, fontWeight: '700' },
  allPresentBtn: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: borderRadius.md, backgroundColor: '#E8E5FF' },
  allPresentBtnText: { color: '#6D4CFF', fontSize: 11, fontWeight: '700' },
  emptyCard: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.xl, alignItems: 'center', justifyContent: 'center', margin: spacing.lg },
  emptyText: { fontSize: fontSize.sm, marginTop: spacing.sm, fontWeight: '500' },
  studentCard: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, marginHorizontal: spacing.lg, marginBottom: spacing.sm, borderRadius: borderRadius.xl, borderWidth: 1 },
  avatarCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  avatarText: { fontSize: 13, fontWeight: '700' },
  studentDetails: { flex: 1 },
  studentName: { fontSize: fontSize.sm, fontWeight: '700' },
  studentRoll: { fontSize: 11, marginTop: 2 },
  statusButtonsGroup: { flexDirection: 'row', gap: 6 },
  statusBtn: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  statusBtnLabel: { fontSize: 11, fontWeight: '800' },
  submitButton: { marginHorizontal: spacing.lg, marginTop: spacing.md },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalCard: { width: '80%', padding: spacing.lg, borderRadius: 24, elevation: 5 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: spacing.xs },
  modalDesc: { fontSize: fontSize.xs, marginBottom: spacing.md },
  modalCounts: { padding: spacing.md, backgroundColor: '#F9F8FF', borderRadius: borderRadius.lg, marginBottom: spacing.lg },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.md },
  cancelBtn: { padding: spacing.sm },
  cancelText: { fontWeight: '700' },
  confirmBtn: { padding: spacing.sm, backgroundColor: '#6D4CFF', borderRadius: borderRadius.md },
  confirmText: { color: '#FFFFFF', fontWeight: '700' },
});
