import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, borderRadius, fontSize, spacing, shadows } from '../../theme';

export function StudentLibraryScreen({ navigation }: any) {
  const { user } = useAuthStore();
  const { library, fetchLibrary } = useDataStore();
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;

  useEffect(() => {
    if (user?.id) {
      fetchLibrary(user.id);
    }
  }, [user?.id]);

  const activeBooks = library || [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Library</Text>
        <View style={styles.placeholderButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#6D4CFF', '#7C3AED', '#2D1B69']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Text style={styles.heroLabel}>BOOKS ISSUED</Text>
          <Text style={styles.heroAmount}>{activeBooks.length}</Text>
          <Text style={styles.heroSub}>Always return books on or before due date</Text>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Issued Books</Text>
          {activeBooks.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
              <Ionicons name="book-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No books currently issued</Text>
            </View>
          ) : (
            activeBooks.map((item: any) => (
              <View key={item.id} style={[styles.bookCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
                <View style={styles.bookHeader}>
                  <View style={[styles.bookIcon, { backgroundColor: colors.primaryLight }]}>
                    <Ionicons name="book" size={22} color={colors.primary} />
                  </View>
                  <View style={styles.bookInfo}>
                    <Text style={[styles.bookTitleText, { color: colors.text }]}>{item.book_title || item.title || 'Book Title'}</Text>
                    <Text style={[styles.bookAuthor, { color: colors.textMuted }]}>Author: {item.author || 'Unknown Author'}</Text>
                  </View>
                </View>
                <View style={[styles.bookDetails, { borderTopColor: colors.borderLight }]}>
                  <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, { color: colors.textMuted }]}>ISSUE DATE</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>{item.issue_date ? new Date(item.issue_date).toLocaleDateString() : 'N/A'}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, { color: colors.textMuted }]}>DUE DATE</Text>
                    <Text style={[styles.detailValue, { color: '#EF4444' }]}>{item.due_date ? new Date(item.due_date).toLocaleDateString() : 'N/A'}</Text>
                  </View>
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
  hero: {
    padding: spacing.xl,
    alignItems: 'center',
    borderBottomLeftRadius: borderRadius.xxl,
    borderBottomRightRadius: borderRadius.xxl,
  },
  heroLabel: { fontSize: 10, fontWeight: '700', color: '#FFFFFFCC', letterSpacing: 1, marginBottom: 4 },
  heroAmount: { fontSize: 48, fontWeight: '700', color: '#FFFFFF', marginBottom: 2 },
  heroSub: { fontSize: fontSize.xs, color: '#FFFFFFCC', marginTop: spacing.sm },
  section: { paddingHorizontal: spacing.lg, marginTop: spacing.lg },
  sectionTitle: { fontSize: fontSize.xs, fontWeight: '600', letterSpacing: 0.5, marginBottom: spacing.sm, textTransform: 'uppercase' },
  emptyCard: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.xl, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: fontSize.sm, marginTop: spacing.sm, fontWeight: '500' },
  bookCard: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.md, marginBottom: spacing.md },
  bookHeader: { flexDirection: 'row', alignItems: 'center' },
  bookIcon: { width: 44, height: 44, borderRadius: borderRadius.lg, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  bookInfo: { flex: 1 },
  bookTitleText: { fontSize: fontSize.md, fontWeight: '600' },
  bookAuthor: { fontSize: fontSize.xs, marginTop: 2 },
  bookDetails: { flexDirection: 'row', borderTopWidth: 1, marginTop: spacing.md, paddingTop: spacing.md, justifyContent: 'space-between' },
  detailItem: { flex: 1 },
  detailLabel: { fontSize: 8, fontWeight: '600', letterSpacing: 0.5, marginBottom: 2 },
  detailValue: { fontSize: fontSize.xs, fontWeight: '600' },
});
