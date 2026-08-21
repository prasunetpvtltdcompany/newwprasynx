import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, fontSize, spacing, borderRadius, shadows } from '../../theme';
import { Card } from '../../components';

export function StudentNotificationsScreen() {
  const { student } = useAuthStore();
  const { notifications, fetchNotifications } = useDataStore();
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    if (student?.id && student?.organisation_id) {
      await fetchNotifications(student.id, student.organisation_id);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, [student?.id, student?.organisation_id]);

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'academic': return 'school-outline';
      case 'event': return 'gift-outline';
      case 'exam': return 'document-text-outline';
      case 'fee': return 'wallet-outline';
      case 'holiday': return 'airplane-outline';
      default: return 'megaphone-outline';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-outline" size={56} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Notifications</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
              You are all caught up! Check back later for updates.
            </Text>
          </View>
        ) : (
          notifications.map((notif) => (
            <Card key={notif.id} style={styles.notifCard}>
              <View style={styles.notifRow}>
                <View style={[styles.notifIconWrap, { backgroundColor: colors.primaryLight }]}>
                  <Ionicons name={getCategoryIcon(notif.category)} size={22} color={colors.primary} />
                </View>
                <View style={styles.notifContent}>
                  <Text style={[styles.notifTitle, { color: colors.text }]}>
                    {notif.title}
                  </Text>
                  <Text style={[styles.notifBody, { color: colors.textMuted }]} numberOfLines={3}>
                    {notif.content || notif.body || 'No description provided.'}
                  </Text>
                  <Text style={[styles.notifTime, { color: colors.textMuted }]}>
                    {notif.created_at ? new Date(notif.created_at).toLocaleDateString() : 'N/A'}
                  </Text>
                </View>
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  scroll: { padding: spacing.md, paddingBottom: spacing.xxl },
  notifCard: { marginBottom: spacing.md },
  notifRow: { flexDirection: 'row', alignItems: 'flex-start' },
  notifIconWrap: { width: 44, height: 44, borderRadius: borderRadius.xl, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  notifContent: { flex: 1 },
  notifTitle: { fontSize: fontSize.sm, fontWeight: '600' },
  notifBody: { fontSize: fontSize.xs, marginTop: 4, lineHeight: 16 },
  notifTime: { fontSize: 8, fontWeight: '600', marginTop: spacing.xs, textTransform: 'uppercase', letterSpacing: 0.5 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xxl * 2 },
  emptyTitle: { fontSize: fontSize.md, fontWeight: '600', marginTop: spacing.md },
  emptySubtitle: { fontSize: fontSize.xs, marginTop: spacing.xs, textAlign: 'center', paddingHorizontal: spacing.xl },
});
