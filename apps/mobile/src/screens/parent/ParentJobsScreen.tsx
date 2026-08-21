import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, borderRadius, fontSize, spacing, shadows } from '../../theme';
import { Card } from '../../components';

export function ParentJobsScreen({ navigation }: any) {
  const { user } = useAuthStore();
  const { jobs, fetchJobs } = useDataStore();
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;

  useEffect(() => {
    if (user?.organisation_id || user?.id) {
      fetchJobs(user.organisation_id || 'all');
    }
  }, [user]);

  const items = jobs || [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Career Hub</Text>
        <View style={styles.placeholderButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Recommended Positions</Text>
          {items.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
              <Ionicons name="briefcase-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No student job listings available</Text>
            </View>
          ) : (
            items.map((item: any) => (
              <View {...{key: item.id}} style={[styles.jobCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs] as any}>
                <Text style={[styles.jobTitle, { color: colors.text }]}>{item.title || 'Role'}</Text>
                <Text style={[styles.jobCompany, { color: colors.primary }]}>{item.company || 'Host Organization'}</Text>
                <View style={styles.badgeRow}>
                  <View style={[styles.badge, { backgroundColor: colors.primaryLight }]}>
                    <Text style={[styles.badgeText, { color: colors.primary }]}>{item.type || 'Part Time'}</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: '#E0F2FE' }]}>
                    <Text style={[styles.badgeText, { color: '#0369A1' }]}>{item.location || 'Campus'}</Text>
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
  jobCard: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.md, marginBottom: spacing.md },
  jobTitle: { fontSize: fontSize.md, fontWeight: '600' },
  jobCompany: { fontSize: fontSize.xs, fontWeight: '600', marginTop: 2 },
  badgeRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  badge: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: borderRadius.full },
  badgeText: { fontSize: 10, fontWeight: '700' },
});
