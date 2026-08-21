import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, borderRadius, fontSize, spacing, shadows } from '../../theme';
import { Card } from '../../components';

export function ParentTransportScreen({ navigation }: any) {
  const { selectedChild } = useAuthStore();
  const { parentTransport, fetchParentTransport } = useDataStore();
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;

  useEffect(() => {
    if (selectedChild?.id) {
      fetchParentTransport(selectedChild.id);
    }
  }, [selectedChild?.id]);

  const route = parentTransport;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Transport Route</Text>
        <View style={styles.placeholderButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Assigned Bus Route</Text>
          {!route ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
              <Ionicons name="bus-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No bus transport route assigned</Text>
            </View>
          ) : (
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
              <View style={styles.infoRow}>
                <Ionicons name="bus" size={20} color={colors.primary} style={styles.infoIcon} />
                <View style={styles.infoTextContainer}>
                  <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Bus Number</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{route.bus_no || 'Route 42'}</Text>
                </View>
              </View>
              <View style={[styles.infoRow, styles.borderTop, { borderTopColor: colors.borderLight }]}>
                <Ionicons name="pin" size={20} color={colors.primary} style={styles.infoIcon} />
                <View style={styles.infoTextContainer}>
                  <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Pickup Location</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{route.pickup_point || 'Main Gate Hub'}</Text>
                </View>
              </View>
              <View style={[styles.infoRow, styles.borderTop, { borderTopColor: colors.borderLight }]}>
                <Ionicons name="person" size={20} color={colors.primary} style={styles.infoIcon} />
                <View style={styles.infoTextContainer}>
                  <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Driver Name</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{route.driver_name || 'Raj Kumar'}</Text>
                </View>
              </View>
            </View>
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
  emptyCard: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.xl, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: fontSize.sm, marginTop: spacing.sm, fontWeight: '500' },
});
