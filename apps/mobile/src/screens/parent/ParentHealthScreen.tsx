import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, borderRadius, fontSize, spacing, shadows } from '../../theme';
import { Card } from '../../components';

export function ParentHealthScreen({ navigation }: any) {
  const { selectedChild } = useAuthStore();
  const { parentHealth, fetchParentHealth } = useDataStore();
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;

  useEffect(() => {
    if (selectedChild?.id) {
      fetchParentHealth(selectedChild.id);
    }
  }, [selectedChild?.id]);

  const reports = parentHealth?.reports || [];
  const vaccinations = parentHealth?.vaccinations || [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Health Profile</Text>
        <View style={styles.placeholderButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Medical Profile</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
            <View style={styles.infoRow}>
              <Ionicons name="heart" size={20} color="#EF4444" style={styles.infoIcon} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Blood Group</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{selectedChild?.blood_group || 'O+'}</Text>
              </View>
            </View>
            <View style={[styles.infoRow, styles.borderTop, { borderTopColor: colors.borderLight }]}>
              <Ionicons name="alert-circle" size={20} color="#F59E0B" style={styles.infoIcon} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Allergies</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{selectedChild?.allergies || 'None Reported'}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Vaccinations Log</Text>
          {vaccinations.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
              <Ionicons name="shield-checkmark" size={36} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>All clear, no outstanding vaccinations</Text>
            </View>
          ) : (
            vaccinations.map((item: any) => (
              <View {...{key: item.id}} style={[styles.vaccineCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs] as any}>
                <View style={styles.vaccineHeader}>
                  <Ionicons name="ellipse" size={12} color="#10B981" style={styles.statusDot} />
                  <View style={styles.vaccineInfo}>
                    <Text style={[styles.vaccineName, { color: colors.text }]}>{item.vaccine_name || item.name || 'Vaccination'}</Text>
                    <Text style={[styles.vaccineDate, { color: colors.textMuted }]}>
                      Administered: {item.administered_date || item.date ? new Date(item.administered_date || item.date).toLocaleDateString() : 'N/A'}
                    </Text>
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
  sectionTitle: { fontSize: fontSize.xs, fontWeight: '600', letterSpacing: 0.5, marginBottom: spacing.xs, textTransform: 'uppercase' },
  card: { borderRadius: borderRadius.xl, borderWidth: 1, overflow: 'hidden' },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md },
  infoIcon: { marginRight: spacing.md },
  infoTextContainer: { flex: 1 },
  infoLabel: { fontSize: fontSize.xs, fontWeight: '500', marginBottom: 2 },
  infoValue: { fontSize: fontSize.sm, fontWeight: '600' },
  borderTop: { borderTopWidth: 1 },
  emptyCard: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.md, alignItems: 'center' },
  emptyText: { fontSize: fontSize.xs, marginTop: spacing.sm, fontWeight: '500' },
  vaccineCard: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.md, marginBottom: spacing.sm },
  vaccineHeader: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { marginRight: spacing.md },
  vaccineInfo: { flex: 1 },
  vaccineName: { fontSize: fontSize.sm, fontWeight: '600' },
  vaccineDate: { fontSize: fontSize.xs, marginTop: 2 },
});
