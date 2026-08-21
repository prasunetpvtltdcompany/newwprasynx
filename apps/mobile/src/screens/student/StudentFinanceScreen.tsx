import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, borderRadius, fontSize, spacing, shadows } from '../../theme';

export function StudentFinanceScreen({ navigation }: any) {
  const { student } = useAuthStore();
  const { fees, fetchFees } = useDataStore();
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;

  useEffect(() => {
    if (student?.id) {
      fetchFees(student.id);
    }
  }, [student?.id]);

  const outstandingInvoices = fees || [];
  const totalOutstanding = outstandingInvoices.reduce((sum, item) => sum + (item.pending || (item.total - item.paid) || 0), 0);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Finance</Text>
        <View style={styles.placeholderButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#6D4CFF', '#7C3AED', '#2D1B69']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Text style={styles.heroLabel}>OUTSTANDING FEES</Text>
          <Text style={styles.heroAmount}>₹{totalOutstanding.toLocaleString()}</Text>
          <TouchableOpacity style={styles.payButton}>
            <Text style={styles.payButtonText}>Pay Outstanding</Text>
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Fee Summary</Text>
          {outstandingInvoices.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
              <Ionicons name="receipt-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No outstanding invoice balances</Text>
            </View>
          ) : (
            outstandingInvoices.map((item: any) => (
              <View key={item.id} style={[styles.invoiceCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
                <View style={styles.invoiceHeader}>
                  <View style={styles.invoiceInfo}>
                    <Text style={[styles.invoiceName, { color: colors.text }]}>{item.fee_type || 'Tuition Fee'}</Text>
                    <Text style={[styles.invoiceDue, { color: colors.textMuted }]}>Due: {item.due_date ? new Date(item.due_date).toLocaleDateString() : 'TBD'}</Text>
                  </View>
                  <Text style={[styles.invoiceAmount, { color: colors.text }]}>₹{item.total?.toLocaleString() || '0'}</Text>
                </View>
                <View style={styles.invoiceStatusRow}>
                  <View style={styles.statusCol}>
                    <Text style={[styles.statusLabel, { color: colors.textMuted }]}>PAID</Text>
                    <Text style={[styles.statusValue, { color: '#10B981' }]}>₹{item.paid?.toLocaleString() || '0'}</Text>
                  </View>
                  <View style={styles.statusCol}>
                    <Text style={[styles.statusLabel, { color: colors.textMuted }]}>PENDING</Text>
                    <Text style={[styles.statusValue, { color: '#EF4444' }]}>₹{item.pending?.toLocaleString() || (item.total - item.paid)?.toLocaleString() || '0'}</Text>
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
    alignItems: 'center',
    borderBottomLeftRadius: borderRadius.xxl,
    borderBottomRightRadius: borderRadius.xxl,
  },
  heroLabel: { fontSize: 10, fontWeight: '700', color: '#FFFFFFCC', letterSpacing: 1, marginBottom: 4 },
  heroAmount: { fontSize: 36, fontWeight: '700', color: '#FFFFFF', marginBottom: spacing.md },
  payButton: { backgroundColor: '#FFFFFF', borderRadius: borderRadius.xl, paddingVertical: 10, paddingHorizontal: spacing.xl, ...shadows.sm },
  payButtonText: { fontSize: fontSize.sm, fontWeight: '700', color: '#6D4CFF' },
  section: { paddingHorizontal: spacing.lg, marginTop: spacing.lg },
  sectionTitle: { fontSize: fontSize.xs, fontWeight: '600', letterSpacing: 0.5, marginBottom: spacing.sm, textTransform: 'uppercase' },
  emptyCard: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.xl, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: fontSize.sm, marginTop: spacing.sm, fontWeight: '500' },
  invoiceCard: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.md, marginBottom: spacing.md },
  invoiceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  invoiceInfo: { flex: 1 },
  invoiceName: { fontSize: fontSize.md, fontWeight: '600' },
  invoiceDue: { fontSize: fontSize.xs, marginTop: 2 },
  invoiceAmount: { fontSize: fontSize.md, fontWeight: '700' },
  invoiceStatusRow: { flexDirection: 'row', marginTop: spacing.md, borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: spacing.sm },
  statusCol: { flex: 1 },
  statusLabel: { fontSize: 8, fontWeight: '600', letterSpacing: 0.5, marginBottom: 2 },
  statusValue: { fontSize: fontSize.sm, fontWeight: '700' },
});
