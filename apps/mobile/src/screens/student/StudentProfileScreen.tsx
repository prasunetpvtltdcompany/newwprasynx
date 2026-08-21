import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, borderRadius, fontSize, spacing, shadows } from '../../theme';

export function StudentProfileScreen({ navigation }: any) {
  const { student, user } = useAuthStore();
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;

  const getInitials = (name: string) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'ST';
  };

  const getProfileImage = () => {
    if (student?.avatar_url) return { uri: student.avatar_url };
    if (student?.avatar) return { uri: student.avatar };
    return null;
  };

  const profileImg = getProfileImage();

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
          colors={['#6D4CFF', '#7C3AED', '#2D1B69']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.avatarContainer}>
            {profileImg ? (
              <Image source={profileImg} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarFallback, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.avatarFallbackText, { color: colors.primary }]}>
                  {getInitials(student?.full_name || user?.full_name || '')}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.name}>{student?.full_name || user?.full_name || 'Loading...'}</Text>
          <Text style={styles.roll}>Roll No: {student?.roll_number || 'N/A'}</Text>
          <Text style={styles.course}>{student?.student_class || 'B.Tech CSE'} - Active</Text>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Personal Information</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
            <View style={styles.infoRow}>
              <Ionicons name="person" size={20} color={colors.primary} style={styles.infoIcon} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Gender</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{student?.gender || 'Male'}</Text>
              </View>
            </View>
            <View style={[styles.infoRow, styles.borderTop, { borderTopColor: colors.borderLight }]}>
              <Ionicons name="calendar" size={20} color={colors.primary} style={styles.infoIcon} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Date of Birth</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{student?.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString() : 'N/A'}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Contact Details</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
            <View style={styles.infoRow}>
              <Ionicons name="mail" size={20} color={colors.primary} style={styles.infoIcon} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Email Address</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{student?.email || user?.email || 'N/A'}</Text>
              </View>
            </View>
            <View style={[styles.infoRow, styles.borderTop, { borderTopColor: colors.borderLight }]}>
              <Ionicons name="call" size={20} color={colors.primary} style={styles.infoIcon} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Phone Number</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{student?.phone || user?.phone || 'N/A'}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Parent / Guardian Information</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
            <View style={styles.infoRow}>
              <Ionicons name="people" size={20} color={colors.primary} style={styles.infoIcon} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Parent Name</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{student?.parent_name || 'N/A'}</Text>
              </View>
            </View>
            <View style={[styles.infoRow, styles.borderTop, { borderTopColor: colors.borderLight }]}>
              <Ionicons name="mail" size={20} color={colors.primary} style={styles.infoIcon} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Parent Email</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{student?.parent_email || 'N/A'}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Residential Address</Text>
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
            <View style={styles.infoRow}>
              <Ionicons name="home" size={20} color={colors.primary} style={styles.infoIcon} />
              <View style={styles.infoTextContainer}>
                <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Home Address</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{student?.address || 'N/A'}</Text>
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
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    marginBottom: spacing.md,
    backgroundColor: '#FFFFFF',
  },
  avatar: { width: '100%', height: '100%' },
  avatarFallback: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  avatarFallbackText: { fontSize: 28, fontWeight: '700' },
  name: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', marginBottom: 2 },
  roll: { fontSize: fontSize.xs, color: '#FFFFFFCC', marginBottom: 4 },
  course: { fontSize: fontSize.sm, color: '#FFFFFFCC', fontWeight: '500' },
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
