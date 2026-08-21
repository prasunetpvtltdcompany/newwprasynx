import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, borderRadius, fontSize, spacing, shadows } from '../../theme';

export function StudentMessagesScreen({ navigation }: any) {
  const { user } = useAuthStore();
  const { messages, fetchMessages } = useDataStore();
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;

  useEffect(() => {
    if (user?.id) {
      fetchMessages(user.id);
    }
  }, [user?.id]);

  const conversations = messages || [];

  const getInitials = (name: string) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'T';
  };

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
          {conversations.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
              <Ionicons name="chatbubbles-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No active conversations</Text>
            </View>
          ) : (
            conversations.map((item: any) => (
              <TouchableOpacity key={item.id} style={[styles.chatRow, { borderBottomColor: colors.borderLight }]}>
                <View style={styles.avatarContainer}>
                  {item.avatar_url ? (
                    <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
                  ) : (
                    <View style={[styles.avatarFallback, { backgroundColor: colors.primaryLight }]}>
                      <Text style={[styles.avatarText, { color: colors.primary }]}>{getInitials(item.teacher_name || item.name || '')}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.chatInfo}>
                  <View style={styles.chatHeader}>
                    <Text style={[styles.chatName, { color: colors.text }]}>{item.teacher_name || item.name || 'Teacher'}</Text>
                    <Text style={[styles.chatTime, { color: colors.textMuted }]}>{item.last_message_time || '10:30 AM'}</Text>
                  </View>
                  <Text style={[styles.chatPreview, { color: colors.textMuted }]} numberOfLines={1}>
                    {item.last_message || 'No messages yet'}
                  </Text>
                </View>
              </TouchableOpacity>
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
  section: { paddingHorizontal: spacing.lg, marginTop: spacing.md },
  emptyCard: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.xl, alignItems: 'center', justifyContent: 'center', marginTop: spacing.xl },
  emptyText: { fontSize: fontSize.sm, marginTop: spacing.sm, fontWeight: '500' },
  chatRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, borderBottomWidth: 1 },
  avatarContainer: { width: 50, height: 50, borderRadius: 25, overflow: 'hidden', marginRight: spacing.md },
  avatar: { width: '100%', height: '100%' },
  avatarFallback: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: fontSize.md, fontWeight: '700' },
  chatInfo: { flex: 1 },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  chatName: { fontSize: fontSize.md, fontWeight: '600' },
  chatTime: { fontSize: fontSize.xxs },
  chatPreview: { fontSize: fontSize.xs },
});
