import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, borderRadius, fontSize, spacing, shadows } from '../../theme';

export function StaffProfileScreen({ navigation }: any) {
  const { user, staff } = useAuthStore();
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
        <View style={styles.placeholderButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#7C3AED', '#6D4CFF', '#5B21B6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={[styles.avatarCircle, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.avatarText, { color: colors.primary }]}>
              {user?.full_name ? user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'TR'}
            </Text>
          </View>
          <Text style={styles.name}>{user?.full_name || 'Instructor'}</Text>
          <Text style={styles.role}>{staff?.designation || 'Staff Faculty'}</Text>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Employee Details</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
            <View style={styles.infoRow}>
              <Ionicons name="card" size={20} color={colors.primary} style={styles.infoIcon} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Employee ID</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{staff?.employee_id || 'EMP-1002'}</Text>
              </View>
            </View>
            <View style={[styles.infoRow, styles.borderTop, { borderTopColor: colors.borderLight }]}>
              <Ionicons name="briefcase" size={20} color={colors.primary} style={styles.infoIcon} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Department</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{staff?.department || 'Academic Department'}</Text>
              </View>
            </View>
            <View style={[styles.infoRow, styles.borderTop, { borderTopColor: colors.borderLight }]}>
              <Ionicons name="mail" size={20} color={colors.primary} style={styles.infoIcon} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Email Address</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{user?.email || 'N/A'}</Text>
              </View>
            </View>
          </View>
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
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarText: { fontSize: 24, fontWeight: '700' },
  name: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', marginBottom: 2 },
  role: { fontSize: fontSize.xs, color: '#FFFFFFCC', fontWeight: '500' },
  section: { paddingHorizontal: spacing.lg, marginTop: spacing.lg },
  sectionTitle: { fontSize: fontSize.xs, fontWeight: '600', letterSpacing: 0.5, marginBottom: spacing.xs, textTransform: 'uppercase' },
  card: { borderRadius: borderRadius.xl, borderWidth: 1, overflow: 'hidden' },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: spacing.md },
  infoIcon: { marginRight: spacing.md },
  infoTextContainer: { flex: 1 },
  infoLabel: { fontSize: fontSize.xs, fontWeight: '500', marginBottom: 2 },
  infoValue: { fontSize: fontSize.sm, fontWeight: '600' },
  borderTop: { borderTopWidth: 1 },
});
