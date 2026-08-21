import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, borderRadius, fontSize, spacing, shadows } from '../../theme';

export function StudentSettingsScreen({ navigation }: any) {
  const { logout, user } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const colors = isDark ? darkColors : lightColors;

  const handleLogout = async () => {
    await logout();
  };

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
            <View style={styles.settingRow}>
              <View style={styles.settingLabelContainer}>
                <Ionicons name="moon-outline" size={20} color={colors.primary} style={styles.settingIcon} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
              </View>
              <Switch value={isDark} onValueChange={toggleTheme} trackColor={{ false: '#D1D5DB', true: '#C084FC' }} thumbColor={isDark ? '#7C3AED' : '#F3F4F6'} />
            </View>
            <View style={[styles.settingRow, styles.borderTop, { borderTopColor: colors.borderLight }]}>
              <View style={styles.settingLabelContainer}>
                <Ionicons name="notifications-outline" size={20} color={colors.primary} style={styles.settingIcon} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>Push Notifications</Text>
              </View>
              <Switch value={true} onValueChange={() => {}} trackColor={{ false: '#D1D5DB', true: '#C084FC' }} thumbColor={'#7C3AED'} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Account Settings</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLabelContainer}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.primary} style={styles.settingIcon} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>Change Password</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.settingRow, styles.borderTop, { borderTopColor: colors.borderLight }]}>
              <View style={styles.settingLabelContainer}>
                <Ionicons name="shield-outline" size={20} color={colors.primary} style={styles.settingIcon} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>Privacy Policy</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' }]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out" size={20} color="#EF4444" style={styles.logoutIcon} />
            <Text style={styles.logoutText}>Logout</Text>
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
  sectionTitle: { fontSize: fontSize.xs, fontWeight: '600', letterSpacing: 0.5, marginBottom: spacing.sm, textTransform: 'uppercase' },
  card: { borderRadius: borderRadius.xl, borderWidth: 1, overflow: 'hidden' },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.md },
  settingLabelContainer: { flexDirection: 'row', alignItems: 'center' },
  settingIcon: { marginRight: spacing.md },
  settingLabel: { fontSize: fontSize.sm, fontWeight: '500' },
  borderTop: { borderTopWidth: 1 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    marginTop: spacing.md,
  },
  logoutIcon: { marginRight: spacing.xs },
  logoutText: { fontSize: fontSize.sm, fontWeight: '700', color: '#EF4444' },
});
