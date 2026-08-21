import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, borderRadius, fontSize, spacing, shadows } from '../../theme';
import { Card } from '../../components';

export function ParentChildrenScreen({ navigation }: any) {
  const { children, selectedChild, setSelectedChild } = useAuthStore();
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;

  const handleSelectChild = (child: any) => {
    setSelectedChild(child);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Children</Text>
        <View style={styles.placeholderButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          {children.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No children linked to this account</Text>
            </View>
          ) : (
            children.map((child: any) => {
              const isSelected = selectedChild?.id === child.id;

              return (
                <TouchableOpacity
                  key={child.id}
                  style={[
                    styles.childCard,
                    {
                      backgroundColor: colors.surface,
                      borderColor: isSelected ? '#6D4CFF' : colors.borderLight,
                      borderLeftColor: isSelected ? '#6D4CFF' : colors.borderLight,
                      borderLeftWidth: isSelected ? 4 : 1,
                    },
                    shadows.xs
                  ]}
                  onPress={() => handleSelectChild(child)}
                >
                  <View style={styles.cardHeader}>
                    <View style={[styles.avatarCircle, { backgroundColor: colors.primaryLight }]}>
                      <Text style={[styles.avatarText, { color: colors.primary }]}>
                        {child.full_name ? child.full_name[0] : 'S'}
                      </Text>
                    </View>
                    <View style={styles.cardInfo}>
                      <Text style={[styles.childName, { color: colors.text }]}>{child.full_name}</Text>
                      <Text style={[styles.childClass, { color: colors.textMuted }]}>
                        Class: {child.student_class || 'B.Tech CSE'}
                      </Text>
                      <Text style={[styles.childRoll, { color: colors.textMuted }]}>
                        Roll No: {child.roll_number || 'N/A'}
                      </Text>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={24} color="#6D4CFF" style={styles.checkIcon} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })
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
  childCard: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.md, marginBottom: spacing.md },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  avatarCircle: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  avatarText: { fontSize: fontSize.md, fontWeight: '700' },
  cardInfo: { flex: 1 },
  childName: { fontSize: fontSize.md, fontWeight: '600' },
  childClass: { fontSize: fontSize.xs, marginTop: 2 },
  childRoll: { fontSize: fontSize.xs, marginTop: 1 },
  checkIcon: { marginLeft: spacing.md },
  emptyContainer: { paddingVertical: spacing.xxl * 2, alignItems: 'center' },
  emptyText: { fontSize: fontSize.sm, fontWeight: '500' },
});
