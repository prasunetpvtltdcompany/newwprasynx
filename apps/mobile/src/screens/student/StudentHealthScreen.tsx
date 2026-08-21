import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, borderRadius, fontSize, spacing, shadows } from '../../theme';

export function StudentHealthScreen({ navigation }: any) {
  const { student } = useAuthStore();
  const { health, fetchHealth } = useDataStore();
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;

  useEffect(() => {
    if (student?.id) {
      fetchHealth(student.id);
    }
  }, [student?.id]);

  const vaccinations = health?.vaccinations || [];
  const medicalRecords = health?.medicalRecords || [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Health Records</Text>
        <View style={styles.placeholderButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#6D4CFF', '#7C3AED', '#2D1B69']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Text style={styles.heroLabel}>MEDICAL ID</Text>
          <Text style={styles.heroAmount}>#HS{student?.roll_number || '211023'}</Text>
          <View style={styles.bloodGroupBadge}>
            <Text style={styles.bloodGroupText}>Blood Group: O+</Text>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Medical Records</Text>
          {medicalRecords.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
              <Ionicons name="medical-outline" size={32} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No clinical records available</Text>
            </View>
          ) : (
            medicalRecords.map((item: any) => (
              <View key={item.id} style={[styles.itemCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
                <Ionicons name="pulse" size={20} color={colors.primary} style={styles.itemIcon} />
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemName, { color: colors.text }]}>{item.condition || item.diagnosis || 'General Checkup'}</Text>
                  <Text style={[styles.itemDate, { color: colors.textMuted }]}>{item.record_date ? new Date(item.record_date).toLocaleDateString() : 'N/A'}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Vaccinations</Text>
          {vaccinations.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
              <Ionicons name="shield-checkmark-outline" size={32} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No recorded vaccinations</Text>
            </View>
          ) : (
            vaccinations.map((item: any) => (
              <View key={item.id} style={[styles.itemCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
                <Ionicons name="shield-checkmark" size={20} color={colors.primary} style={styles.itemIcon} />
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemName, { color: colors.text }]}>{item.vaccine_name || 'Vaccine'}</Text>
                  <Text style={[styles.itemDate, { color: colors.textMuted }]}>{item.vaccination_date ? new Date(item.vaccination_date).toLocaleDateString() : 'N/A'}</Text>
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
  heroAmount: { fontSize: 32, fontWeight: '700', color: '#FFFFFF', marginBottom: spacing.sm },
  bloodGroupBadge: { backgroundColor: '#FFFFFF30', borderRadius: borderRadius.lg, paddingVertical: 4, paddingHorizontal: spacing.md },
  bloodGroupText: { fontSize: fontSize.xs, fontWeight: '700', color: '#FFFFFF' },
  section: { paddingHorizontal: spacing.lg, marginTop: spacing.lg },
  sectionTitle: { fontSize: fontSize.xs, fontWeight: '600', letterSpacing: 0.5, marginBottom: spacing.sm, textTransform: 'uppercase' },
  emptyCard: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.lg, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: fontSize.xs, marginTop: spacing.xs, fontWeight: '500' },
  itemCard: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.md, marginBottom: spacing.sm, flexDirection: 'row', alignItems: 'center' },
  itemIcon: { marginRight: spacing.md },
  itemInfo: { flex: 1 },
  itemName: { fontSize: fontSize.sm, fontWeight: '600' },
  itemDate: { fontSize: fontSize.xxs, marginTop: 2 },
});
