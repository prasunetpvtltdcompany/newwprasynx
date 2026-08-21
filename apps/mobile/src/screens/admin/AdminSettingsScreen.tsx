import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, borderRadius, fontSize, spacing, shadows } from '../../theme';
import * as api from '../../services/api';

export function AdminSettingsScreen({ navigation }: any) {
  const { user, logout } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const colors = isDark ? darkColors : lightColors;

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const getInitials = (name?: string) => {
    return name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'AD';
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      alert('Please enter your current and new password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match.');
      return;
    }
    setUpdatingPassword(true);
    const result = await api.apiPost('/v2/admin/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    setUpdatingPassword(false);
    if (result.success) {
      alert('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      alert(result.error || 'Failed to update password');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Admin Settings</Text>
        <View style={styles.placeholderButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Admin Profile Overview */}
        <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
          <View style={[styles.avatarCircle, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.avatarText, { color: colors.primary }]}>{getInitials(user?.full_name || 'Admin')}</Text>
          </View>
          <Text style={[styles.profileName, { color: colors.text }]}>{user?.full_name || 'System Admin'}</Text>
          <Text style={[styles.profileEmail, { color: colors.textMuted }]}>{user?.email || 'admin@prasynx.com'}</Text>
          <View style={styles.roleBadgeWrap}>
            <Text style={styles.roleBadgeText}>{(user?.role || 'ADMIN').toUpperCase()}</Text>
          </View>
        </View>

        {/* Security & Password */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Security & Password</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
            <View style={styles.fieldBlock}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>Current Password</Text>
              <TextInput
                style={[styles.inputField, { backgroundColor: colors.background, color: colors.text, borderColor: colors.borderLight }]}
                placeholder="••••••••"
                placeholderTextColor={colors.textMuted}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>New Password</Text>
              <TextInput
                style={[styles.inputField, { backgroundColor: colors.background, color: colors.text, borderColor: colors.borderLight }]}
                placeholder="••••••••"
                placeholderTextColor={colors.textMuted}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>Confirm New Password</Text>
              <TextInput
                style={[styles.inputField, { backgroundColor: colors.background, color: colors.text, borderColor: colors.borderLight }]}
                placeholder="••••••••"
                placeholderTextColor={colors.textMuted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: '#6D4CFF' }]}
              onPress={handleChangePassword}
              disabled={updatingPassword}
            >
              {updatingPassword ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveBtnText}>Update Password</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* System Preferences */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Platform Preferences</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
            <View style={styles.settingRow}>
              <View style={styles.settingLabelGroup}>
                <Ionicons name="moon-outline" size={20} color="#6D4CFF" style={styles.icon} />
                <View>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>Dark Mode</Text>
                  <Text style={[styles.settingSub, { color: colors.textMuted }]}>Toggle dark aesthetic theme</Text>
                </View>
              </View>
              <Switch value={isDark} onValueChange={toggleTheme} trackColor={{ true: '#6D4CFF' }} />
            </View>

            <View style={[styles.settingRow, styles.borderTop, { borderTopColor: colors.borderLight }]}>
              <View style={styles.settingLabelGroup}>
                <Ionicons name="notifications-outline" size={20} color="#6D4CFF" style={styles.icon} />
                <View>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>System Alerts</Text>
                  <Text style={[styles.settingSub, { color: colors.textMuted }]}>Receive real-time security alerts</Text>
                </View>
              </View>
              <Switch value={notifications} onValueChange={setNotifications} trackColor={{ true: '#6D4CFF' }} />
            </View>
          </View>
        </View>

        {/* System Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>System Information</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Platform Engine</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>PRASYNX ERP 2.0.0</Text>
            </View>
            <View style={[styles.infoRow, styles.borderTop, { borderTopColor: colors.borderLight }]}>
              <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Environment</Text>
              <Text style={[styles.infoValue, { color: '#10B981' }]}>Production API</Text>
            </View>
          </View>
        </View>

        {/* Account Logout Action */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.card, styles.logoutButton, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}
            onPress={logout}
          >
            <Ionicons name="log-out-outline" size={20} color="#EF4444" style={styles.icon} />
            <Text style={[styles.logoutText, { color: '#EF4444' }]}>Log Out of Admin Panel</Text>
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
  profileCard: {
    margin: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.xl,
    alignItems: 'center',
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarText: { fontSize: 24, fontWeight: '800' },
  profileName: { fontSize: 18, fontWeight: '700', marginBottom: 2 },
  profileEmail: { fontSize: 12, marginBottom: spacing.sm },
  roleBadgeWrap: { backgroundColor: '#F3F0FF', paddingHorizontal: 12, paddingVertical: 4, borderRadius: borderRadius.full },
  roleBadgeText: { color: '#6D4CFF', fontSize: 10, fontWeight: '700' },
  section: { paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  sectionTitle: { fontSize: fontSize.xs, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.sm },
  card: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.md },
  fieldBlock: { marginBottom: spacing.md },
  fieldLabel: { fontSize: fontSize.xs, fontWeight: '600', marginBottom: 6 },
  inputField: { borderWidth: 1, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, fontSize: fontSize.sm },
  saveBtn: { borderRadius: borderRadius.xl, paddingVertical: spacing.sm, alignItems: 'center', marginTop: spacing.xs },
  saveBtnText: { color: '#FFFFFF', fontSize: fontSize.sm, fontWeight: '700' },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.sm },
  settingLabelGroup: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  icon: { marginRight: spacing.md },
  settingTitle: { fontSize: fontSize.sm, fontWeight: '600' },
  settingSub: { fontSize: 10, marginTop: 2 },
  borderTop: { borderTopWidth: 1 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm },
  infoLabel: { fontSize: fontSize.xs, fontWeight: '500' },
  infoValue: { fontSize: fontSize.xs, fontWeight: '700' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.md },
  logoutText: { fontSize: fontSize.sm, fontWeight: '700' },
});
