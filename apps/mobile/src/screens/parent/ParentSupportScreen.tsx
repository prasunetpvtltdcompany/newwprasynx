import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, borderRadius, fontSize, spacing, shadows } from '../../theme';
import { Card } from '../../components';

export function ParentSupportScreen({ navigation }: any) {
  const { user } = useAuthStore();
  const { parentComplaints, fetchParentComplaints } = useDataStore();
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;

  useEffect(() => {
    if (user?.id) {
      fetchParentComplaints(user.id);
    }
  }, [user?.id]);

  const complaints = parentComplaints || [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Support Desk</Text>
        <View style={styles.placeholderButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Complaint Logs</Text>
          {complaints.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
              <Ionicons name="help-buoy-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No active complaint tickets filed</Text>
            </View>
          ) : (
            complaints.map((item: any) => (
              <View {...{key: item.id}} style={[styles.complaintCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs] as any}>
                <View style={styles.complaintHeader}>
                  <Text style={[styles.complaintTitle, { color: colors.text }]}>{item.subject || 'Complaint Ticket'}</Text>
                  <View style={[styles.badge, { backgroundColor: item.status === 'resolved' ? '#D1FAE5' : '#FEF3C7' }]}>
                    <Text style={[styles.badgeText, { color: item.status === 'resolved' ? '#065F46' : '#92400E' }]}>
                      {item.status || 'Pending'}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.complaintDesc, { color: colors.textMuted }]}>{item.description || 'Under review.'}</Text>
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
  complaintCard: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.md, marginBottom: spacing.md },
  complaintHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  complaintTitle: { fontSize: fontSize.sm, fontWeight: '600', flex: 1, marginRight: spacing.md },
  complaintDesc: { fontSize: fontSize.xs, lineHeight: 16 },
  badge: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: borderRadius.full },
  badgeText: { fontSize: 10, fontWeight: '700' },
});
