import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, borderRadius, fontSize, spacing, shadows } from '../../theme';
import { Badge, Loader } from '../../components';

export function ManagementFinanceScreen({ navigation }: any) {
  const { user } = useAuthStore();
  const { managementFinance, fetchManagementFinance } = useDataStore();
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    if (user?.organisation_id || user?.id) {
      setLoading(true);
      await fetchManagementFinance(user.organisation_id || 'all');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const finance = managementFinance || {};
  const revenue = finance.totalRevenue || 0;
  const expenses = finance.totalExpenses || 0;
  const profit = finance.netProfit || 0;
  const receivables = finance.outstandingReceivables || 0;
  const payables = finance.outstandingPayables || 0;

  if (loading) return <Loader fullScreen message="Loading financial overview..." />;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Finance Desk</Text>
        <View style={styles.placeholderButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Net Profit Banner */}
        <View style={[styles.profitBanner, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
          <Text style={[styles.bannerLabel, { color: colors.textMuted }]}>Net Operating Profit</Text>
          <Text style={[styles.bannerValue, { color: profit >= 0 ? '#10B981' : '#EF4444' }]}>
            ₹{profit.toLocaleString()}
          </Text>
        </View>

        {/* Income / Expense Overview Cards */}
        <View style={styles.cardsRow}>
          <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
            <Ionicons name="trending-up-outline" size={20} color="#10B981" />
            <Text style={[styles.cardVal, { color: colors.text }]}>₹{revenue.toLocaleString()}</Text>
            <Text style={[styles.cardLabel, { color: colors.textMuted }]}>Total Revenue</Text>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
            <Ionicons name="trending-down-outline" size={20} color="#EF4444" />
            <Text style={[styles.cardVal, { color: colors.text }]}>₹{expenses.toLocaleString()}</Text>
            <Text style={[styles.cardLabel, { color: colors.textMuted }]}>Total Expenses</Text>
          </View>
        </View>

        {/* Receivables vs Payables */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Balance Breakdown</Text>
          <View style={[styles.whiteCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={[styles.infoValText, { color: colors.text }]}>₹{receivables.toLocaleString()}</Text>
                <Text style={[styles.infoLabelText, { color: colors.textMuted }]}>Outstanding Receivables</Text>
              </View>
              <View style={[styles.verticalDivider, { backgroundColor: colors.borderLight }]} />
              <View style={styles.infoItem}>
                <Text style={[styles.infoValText, { color: colors.text }]}>₹{payables.toLocaleString()}</Text>
                <Text style={[styles.infoLabelText, { color: colors.textMuted }]}>Outstanding Payables</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Budget Utilization progress */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Budget Utilization</Text>
          <View style={[styles.whiteCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
            <View style={styles.budgetHeader}>
              <Text style={[styles.budgetText, { color: colors.text }]}>Overall Allocation Spent</Text>
              <Text style={[styles.budgetPercent, { color: colors.primary }]}>{finance.budgetUtilization || 0}%</Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: colors.primaryLight }]}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min(100, finance.budgetUtilization || 0)}%`, backgroundColor: '#6D4CFF' }
                ]}
              />
            </View>
            <View style={styles.budgetFooter}>
              <Text style={[styles.budgetFooterLabel, { color: colors.textMuted }]}>
                {finance.totalBudgets || 0} active department budgets
              </Text>
            </View>
          </View>
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
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  profitBanner: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  bannerLabel: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bannerValue: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  summaryCard: {
    flex: 1,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.md,
  },
  cardVal: {
    fontSize: fontSize.md,
    fontWeight: '800',
    marginVertical: spacing.xs,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  section: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  whiteCard: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoValText: {
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  infoLabelText: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  verticalDivider: {
    width: 1,
    height: '80%',
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  budgetText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  budgetPercent: {
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  budgetFooter: {
    marginTop: spacing.xs,
  },
  budgetFooterLabel: {
    fontSize: 9,
    fontWeight: '500',
  },
});
