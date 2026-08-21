import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, borderRadius, fontSize, spacing, shadows } from '../../theme';
import { Card, Badge, Button, Loader } from '../../components';
import { apiPost } from '../../services/api';

export function StaffAssignmentsScreen({ navigation }: any) {
  const { user, staff } = useAuthStore();
  const { staffAssignments, fetchStaffAssignments, staffClasses, fetchStaffClasses } = useDataStore();
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;

  const [activeTab, setActiveTab] = useState<'active' | 'closed'>('active');
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [dueDate, setDueDate] = useState('');

  const loadData = async () => {
    if (staff?.id) {
      setLoading(true);
      await fetchStaffAssignments(staff.id);
      await fetchStaffClasses(staff.id);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [staff?.id]);

  useEffect(() => {
    if (staffClasses.length > 0 && !selectedClass) {
      setSelectedClass(staffClasses[0]);
    }
  }, [staffClasses]);

  const assignments = staffAssignments || [];

  const filtered = assignments.filter((item: any) => {
    const isClosed = item.due_date ? new Date(item.due_date) < new Date() : false;
    return activeTab === 'closed' ? isClosed : !isClosed;
  });

  const handleCreate = async () => {
    if (!title || !dueDate || !selectedClass || !staff?.id) return;
    setSubmitting(true);
    try {
      const res = await apiPost('/staff/assignments', {
        teacher_id: staff.id,
        organisation_id: user?.organisation_id || 'all',
        class_id: selectedClass.class_id,
        subject_id: selectedClass.subject_id,
        title,
        description: desc,
        due_date: new Date(dueDate).toISOString()
      });

      if (res.success) {
        alert('Assignment created successfully!');
        setShowCreate(false);
        setTitle('');
        setDesc('');
        setDueDate('');
        fetchStaffAssignments(staff.id);
      } else {
        alert(res.error || 'Failed to create assignment');
      }
    } catch (e: any) {
      alert(e.message || 'Error occurred while saving');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader fullScreen message="Loading assignments..." />;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Homework</Text>
        <TouchableOpacity onPress={() => setShowCreate(true)} style={styles.rightButton}>
          <Ionicons name="add" size={24} color="#6D4CFF" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={[styles.tabBar, { borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity
          onPress={() => setActiveTab('active')}
          style={[styles.tabItem, activeTab === 'active' && { borderBottomColor: '#6D4CFF' }]}
        >
          <Text style={[styles.tabLabel, { color: activeTab === 'active' ? '#6D4CFF' : colors.textMuted }]}>
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('closed')}
          style={[styles.tabItem, activeTab === 'closed' && { borderBottomColor: '#6D4CFF' }]}
        >
          <Text style={[styles.tabLabel, { color: activeTab === 'closed' ? '#6D4CFF' : colors.textMuted }]}>
            Closed
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
            <Ionicons name="document-text-outline" size={48} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>No homework items listed</Text>
          </View>
        ) : (
          filtered.map((item: any) => (
            <View {...{key: item.id}} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs] as any}>
              <View style={styles.cardHeader}>
                <View style={styles.subjectIconBox}>
                  <Ionicons name="book-outline" size={20} color="#6D4CFF" />
                </View>
                <View style={styles.headerInfo}>
                  <Text style={[styles.cardTitleText, { color: colors.text }]}>{item.title || 'Assignment'}</Text>
                  <Text style={[styles.cardClass, { color: colors.textMuted }]}>
                    Due Date: {item.due_date ? new Date(item.due_date).toLocaleDateString() : 'N/A'}
                  </Text>
                </View>
              </View>
              {item.description ? (
                <Text style={[styles.cardDesc, { color: colors.text }]}>{item.description}</Text>
              ) : null}
            </View>
          ))
        )}
      </ScrollView>

      {/* Create Modal */}
      {showCreate && (
        <Modal visible={showCreate} animationType="slide" transparent>
          <View style={styles.modalBackdrop}>
            <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Add Assignment</Text>
                <TouchableOpacity onPress={() => setShowCreate(false)}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={[styles.inputLabel, { color: colors.textMuted }]}>Title</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.borderLight }]}
                  placeholder="e.g. Algebra Worksheet"
                  placeholderTextColor={colors.textMuted}
                  value={title}
                  onChangeText={setTitle}
                />

                <Text style={[styles.inputLabel, { color: colors.textMuted }]}>Description</Text>
                <TextInput
                  style={[styles.input, styles.multiline, { backgroundColor: colors.background, color: colors.text, borderColor: colors.borderLight }]}
                  placeholder="Provide task description..."
                  placeholderTextColor={colors.textMuted}
                  value={desc}
                  onChangeText={setDesc}
                  multiline
                />

                <Text style={[styles.inputLabel, { color: colors.textMuted }]}>Class & Subject Mapping</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
                  {staffClasses.map((item: any) => {
                    const isSelected = selectedClass?.id === item.id;
                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={[
                          styles.chip,
                          {
                            backgroundColor: isSelected ? '#F3F0FF' : colors.background,
                            borderColor: isSelected ? '#6D4CFF' : colors.borderLight,
                          }
                        ]}
                        onPress={() => setSelectedClass(item)}
                      >
                        <Text style={[styles.chipText, { color: isSelected ? '#6D4CFF' : colors.text }]}>
                          {item.class?.name || 'Class'} - {item.subject?.name || 'Subject'}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                <Text style={[styles.inputLabel, { color: colors.textMuted }]}>Due Date</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.borderLight }]}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.textMuted}
                  value={dueDate}
                  onChangeText={setDueDate}
                />

                <Button
                  title="Create Assignment"
                  onPress={handleCreate}
                  style={styles.submitBtn}
                  loading={submitting}
                  disabled={!title || !dueDate || !selectedClass}
                />
              </ScrollView>
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
  rightButton: { padding: spacing.xs },
  tabBar: { flexDirection: 'row', height: 48, borderBottomWidth: 1 },
  tabItem: { flex: 1, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabLabel: { fontSize: fontSize.sm, fontWeight: '700' },
  scroll: { padding: spacing.lg },
  emptyCard: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.xl, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: fontSize.sm, marginTop: spacing.sm, fontWeight: '500' },
  card: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.md, marginBottom: spacing.sm },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  subjectIconBox: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F0FF', justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  headerInfo: { flex: 1 },
  cardTitleText: { fontSize: fontSize.sm, fontWeight: '700' },
  cardClass: { fontSize: 11, marginTop: 2 },
  cardDesc: { fontSize: fontSize.xs, marginTop: spacing.sm, lineHeight: 18 },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end', zIndex: 1000 },
  modalCard: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: spacing.lg, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  inputLabel: { fontSize: fontSize.xs, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: spacing.xs, marginTop: spacing.sm },
  input: { borderRadius: borderRadius.md, borderWidth: 1, padding: spacing.sm, fontSize: fontSize.sm },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  chipsScroll: { gap: spacing.sm, paddingVertical: 4 },
  chip: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full, borderWidth: 1 },
  chipText: { fontSize: fontSize.xs, fontWeight: '700' },
  submitBtn: { marginTop: spacing.xl },
});
