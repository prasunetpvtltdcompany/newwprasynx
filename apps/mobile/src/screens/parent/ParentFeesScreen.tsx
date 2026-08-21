import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, borderRadius, fontSize, spacing, shadows } from '../../theme';
import { Card, Badge, Button } from '../../components';

export function ParentFeesScreen({ navigation }: any) {
  const { selectedChild } = useAuthStore();
  const { parentFees, fetchParentFees } = useDataStore();
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;

  useEffect(() => {
    if (selectedChild?.id) {
      fetchParentFees(selectedChild.id);
    }
  }, [selectedChild?.id]);

  const invoices = parentFees || [];
  const outstanding = invoices
    .filter((f: any) => f.status === 'pending')
    .reduce((sum: number, f: any) => sum + parseFloat(f.amount || 0), 0);

  const paidAmount = invoices
    .filter((f: any) => f.status === 'paid')
    .reduce((sum: number, f: any) => sum + parseFloat(f.amount || 0), 0);

  const total = outstanding + paidAmount;
  const payPercentage = total > 0 ? Math.round((paidAmount / total) * 100) : 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Tuition Fees</Text>
        <View style={styles.placeholderButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Fee Hero Summary */}
        <Card style={styles.summaryCard}>
          <Text style={[styles.summaryTitle, { color: colors.text }]}>Fee Summary</Text>
          <View style={styles.row}>
            <View style={styles.block}>
              <Text style={[styles.label, { color: colors.textMuted }]}>Outstanding</Text>
              <Text style={[styles.value, { color: '#EF4444' }]}>₹{outstanding}</Text>
            </View>
            <View style={[styles.block, styles.borderLeft, { borderColor: colors.borderLight }]}>
              <Text style={[styles.label, { color: colors.textMuted }]}>Paid Balance</Text>
              <Text style={[styles.value, { color: '#10B981' }]}>₹{paidAmount}</Text>
            </View>
          </View>
          <View style={styles.progressContainer}>
            <View style={[styles.barBg, { backgroundColor: colors.borderLight }]}>
              <View style={[styles.barFill, { width: `${payPercentage}%`, backgroundColor: '#6D4CFF' }]} />
            </View>
            <Text style={[styles.progressText, { color: colors.textMuted }]}>{payPercentage}% Paid</Text>
          </View>
        </Card>

        {/* Invoice List */}
        <View style={styles.listSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Fee Invoices</Text>
          {invoices.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
              <Ionicons name="wallet-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No outstanding invoices found</Text>
            </View>
          ) : (
            invoices.map((item: any) => {
              const isPending = item.status === 'pending';
              return (
                <View {...{key: item.id}} style={[styles.invoiceCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs] as any}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardInfo}>
                      <Text style={[styles.invoiceTitle, { color: colors.text }]}>{item.fee_type || item.title || 'Tuition Fee'}</Text>
                      <Text style={[styles.invoiceSub, { color: colors.textMuted }]}>
                        Due Date: {item.due_date ? new Date(item.due_date).toLocaleDateString() : 'N/A'}
                      </Text>
                    </View>
                    <Badge
                      label={isPending ? 'Pending' : 'Paid'}
                      variant={isPending ? 'warning' : 'success'}
                    />
                  </View>
                  <View style={[styles.cardFooter, { borderTopColor: colors.borderLight }]}>
                    <Text style={[styles.invoiceAmount, { color: colors.text }]}>₹{item.amount}</Text>
                    {isPending && (
                      <Button title="Pay Now" onPress={() => {}} style={styles.payButton} />
                    )}
                  </View>
                </View>
              );
            })
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
  summaryTitle: { fontSize: fontSize.sm, fontWeight: '700', marginBottom: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  block: { flex: 1, alignItems: 'center' },
  borderLeft: { borderLeftWidth: 1, paddingLeft: spacing.md },
  label: { fontSize: 10, fontWeight: '600' },
  value: { fontSize: fontSize.md, fontWeight: '700', marginTop: 2 },
  progressContainer: { marginTop: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  barBg: { flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  progressText: { fontSize: 10, fontWeight: '600' },
  listSection: { paddingHorizontal: spacing.lg },
  sectionTitle: { fontSize: fontSize.xs, fontWeight: '600', letterSpacing: 0.5, marginBottom: spacing.sm, textTransform: 'uppercase' },
  emptyCard: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.xl, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: fontSize.sm, marginTop: spacing.sm, fontWeight: '500' },
  invoiceCard: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.md, marginBottom: spacing.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardInfo: { flex: 1 },
  invoiceTitle: { fontSize: fontSize.sm, fontWeight: '600' },
  invoiceSub: { fontSize: 10, marginTop: 2 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, marginTop: spacing.md, paddingTop: spacing.md },
  invoiceAmount: { fontSize: fontSize.sm, fontWeight: '700' },
  payButton: { paddingHorizontal: spacing.md, paddingVertical: 6 },
});
