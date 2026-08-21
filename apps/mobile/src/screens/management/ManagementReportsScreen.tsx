import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, borderRadius, fontSize, spacing, shadows } from '../../theme';
import { Loader } from '../../components';

export function ManagementReportsScreen({ navigation }: any) {
  const { user } = useAuthStore();
  const { managementDashboard, managementFinance, fetchManagementDashboard, fetchManagementFinance } = useDataStore();
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;

  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  const loadData = async () => {
    if (user?.organisation_id || user?.id) {
      setLoading(true);
      const orgId = user.organisation_id || 'all';
      await fetchManagementDashboard(orgId);
      await fetchManagementFinance(orgId);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const stats = managementDashboard?.stats || {};
  const finance = managementFinance || {};

  const REPORTS = [
    {
      id: 'attendance',
      title: 'Student Attendance Summary',
      desc: 'Monthly class attendance rates and overall present statistics.',
      icon: 'calendar-outline',
      color: '#6D4CFF',
      data: [
        { label: 'Overall Rate', value: '92%' },
        { label: 'Present Students', value: stats.totalStudents ? Math.round(stats.totalStudents * 0.92) : 0 },
        { label: 'Absent/Leave Today', value: stats.totalStudents ? Math.round(stats.totalStudents * 0.08) : 0 },
      ]
    },
    {
      id: 'fees',
      title: 'Fee Collection Audit',
      desc: 'Summary of outstanding receivables, collections, and outstanding payables.',
      icon: 'wallet-outline',
      color: '#10B981',
      data: [
        { label: 'Total Revenue Collected', value: `₹${(finance.totalRevenue || 0).toLocaleString()}` },
        { label: 'Total Expenses Paid', value: `₹${(finance.totalExpenses || 0).toLocaleString()}` },
        { label: 'Net Profit Balance', value: `₹${(finance.netProfit || 0).toLocaleString()}` },
      ]
    },
    {
      id: 'academic',
      title: 'Academic Analytics',
      desc: 'Overall student performance across registered classes.',
      icon: 'book-outline',
      color: '#F59E0B',
      data: [
        { label: 'Enrolled Classes', value: stats.totalClasses || 0 },
        { label: 'Registered Students', value: stats.totalStudents || 0 },
        { label: 'Enrolled Employees', value: stats.totalStaff || 0 },
      ]
    }
  ];

  if (loading) return <Loader fullScreen message="Loading report center..." />;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Reports Center</Text>
        <View style={styles.placeholderButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.listBlock}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Available Report Layouts</Text>
          {REPORTS.map((report) => (
            <TouchableOpacity
              key={report.id}
              onPress={() => setSelectedReport(report)}
              style={[styles.reportCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}
            >
              <View style={[styles.iconCircle, { backgroundColor: report.color + '15' }]}>
                <Ionicons name={report.icon as any} size={20} color={report.color} />
              </View>
              <View style={styles.reportInfo}>
                <Text style={[styles.reportTitleText, { color: colors.text }]}>{report.title}</Text>
                <Text style={[styles.reportDescText, { color: colors.textMuted }]}>{report.desc}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Report details Modal */}
      {selectedReport && (
        <Modal visible={!!selectedReport} animationType="slide" transparent>
          <View style={styles.modalBackdrop}>
            <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>{selectedReport.title}</Text>
                <TouchableOpacity onPress={() => setSelectedReport(null)}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.modalDesc, { color: colors.textMuted }]}>
                {selectedReport.desc}
              </Text>

              <View style={styles.modalDataList}>
                {selectedReport.data.map((row: any, idx: number) => (
                  <View {...{key: idx}} style={[styles.modalDataRow, idx > 0 && { borderTopWidth: 1, borderTopColor: colors.borderLight }] as any}>
                    <Text style={[styles.rowLabel, { color: colors.textMuted }]}>{row.label}</Text>
                    <Text style={[styles.rowVal, { color: colors.text }]}>{row.value}</Text>
                  </View>
                ))}
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
  listBlock: { padding: spacing.lg },
  sectionTitle: { fontSize: fontSize.xs, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.md },
  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitleText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  reportDescText: {
    fontSize: 11,
    marginTop: 2,
  },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end', zIndex: 1000 },
  modalCard: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: spacing.lg, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  modalDesc: { fontSize: fontSize.xs, marginBottom: spacing.lg },
  modalDataList: { borderRadius: borderRadius.xl, borderWidth: 1, borderColor: '#F3F4F6', overflow: 'hidden' },
  modalDataRow: { flexDirection: 'row', justifyContent: 'space-between', padding: spacing.md },
  rowLabel: { fontSize: fontSize.xs, fontWeight: '500' },
  rowVal: { fontSize: fontSize.sm, fontWeight: '700' },
});
