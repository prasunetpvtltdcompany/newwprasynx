import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, borderRadius, fontSize, spacing, shadows } from '../../theme';

export function StaffSettingsScreen({ navigation }: any) {
  const { logout } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const colors = isDark ? darkColors : lightColors;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
        <View style={styles.placeholderButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Preferences</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
            <View style={styles.row}>
              <View style={styles.rowLabelGroup}>
                <Ionicons name="moon-outline" size={20} color={colors.primary} style={styles.icon} />
                <Text style={[styles.rowLabel, { color: colors.text }]}>Dark Mode</Text>
              </View>
              <Switch value={isDark} onValueChange={toggleTheme} trackColor={{ true: '#6D4CFF' }} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Account Action</Text>
          <TouchableOpacity
            style={[styles.card, styles.logoutButton, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}
            onPress={logout}
          >
            <Ionicons name="log-out-outline" size={20} color="#EF4444" style={styles.icon} />
            <Text style={[styles.rowLabel, { color: '#EF4444' }]}>Log Out</Text>
          </TouchableOpacity>
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
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.md },
  rowLabelGroup: { flexDirection: 'row', alignItems: 'center' },
  icon: { marginRight: spacing.md },
  rowLabel: { fontSize: fontSize.sm, fontWeight: '600' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', padding: spacing.md },
});
