import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, borderRadius, fontSize, spacing, shadows } from '../../theme';

export function StaffMessagesScreen({ navigation }: any) {
  const { user } = useAuthStore();
  const { staffConversations, fetchStaffConversations } = useDataStore();
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;

  useEffect(() => {
    if (user?.id) {
      fetchStaffConversations(user.id);
    }
  }, [user?.id]);

  const chats = staffConversations || [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Messages</Text>
        <View style={styles.placeholderButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Recent Conversations</Text>
          {chats.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
              <Ionicons name="chatbubbles-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No direct messages yet</Text>
            </View>
          ) : (
            chats.map((item: any) => (
              <View {...{key: item.id}} style={[styles.chatCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs] as any}>
                <View style={styles.chatHeader}>
                  <View style={[styles.avatarCircle, { backgroundColor: colors.primaryLight }]}>
                    <Text style={[styles.avatarText, { color: colors.primary }]}>
                      {item.other_user_name ? item.other_user_name[0].toUpperCase() : 'P'}
                    </Text>
                  </View>
                  <View style={styles.chatInfo}>
                    <Text style={[styles.chatName, { color: colors.text }]}>{item.other_user_name || 'Parent Guardian'}</Text>
                    <Text style={[styles.chatMessage, { color: colors.textMuted }]} numberOfLines={1}>
                      {item.last_message || 'No messages in this chat.'}
                    </Text>
                  </View>
                  {item.unread_count > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{item.unread_count}</Text>
                    </View>
                  )}
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
  chatCard: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.md, marginBottom: spacing.sm },
  chatHeader: { flexDirection: 'row', alignItems: 'center' },
  avatarCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  avatarText: { fontSize: fontSize.md, fontWeight: '700' },
  chatInfo: { flex: 1 },
  chatName: { fontSize: fontSize.sm, fontWeight: '600' },
  chatMessage: { fontSize: fontSize.xs, marginTop: 2 },
  unreadBadge: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#6D4CFF', justifyContent: 'center', alignItems: 'center', marginLeft: spacing.md },
  unreadText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
});
