import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, borderRadius, fontSize, spacing, shadows } from '../../theme';

export function StaffNotificationsScreen({ navigation }: any) {
  const { user } = useAuthStore();
  const { staffNotifications, fetchStaffNotifications } = useDataStore();
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;

  useEffect(() => {
    if (user?.organisation_id || user?.id) {
      fetchStaffNotifications(user.organisation_id || 'all');
    }
  }, [user]);

  const items = staffNotifications || [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Announcements</Text>
        <View style={styles.placeholderButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>School Notices</Text>
          {items.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
              <Ionicons name="notifications-off-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No notifications posted yet</Text>
            </View>
          ) : (
            items.map((item: any) => (
              <View {...{key: item.id}} style={[styles.notifCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs] as any}>
                <View style={styles.notifHeader}>
                  <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
                    <Ionicons name="megaphone" size={18} color={colors.primary} />
                  </View>
                  <View style={styles.notifInfo}>
                    <Text style={[styles.notifTitleText, { color: colors.text }]}>{item.title || 'Announcement'}</Text>
                    <Text style={[styles.notifDate, { color: colors.textMuted }]}>
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.notifDesc, { color: colors.text }]}>{item.message || item.body || ''}</Text>
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
  notifCard: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.md, marginBottom: spacing.md },
  notifHeader: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  notifInfo: { flex: 1 },
  notifTitleText: { fontSize: fontSize.sm, fontWeight: '600' },
  notifDate: { fontSize: 10, marginTop: 2 },
  notifDesc: { fontSize: fontSize.xs, marginTop: spacing.md, lineHeight: 18 },
});
