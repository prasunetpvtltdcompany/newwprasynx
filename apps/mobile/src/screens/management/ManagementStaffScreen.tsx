import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, borderRadius, fontSize, spacing, shadows } from '../../theme';
import { Loader } from '../../components';

export function ManagementStaffScreen({ navigation }: any) {
  const { user } = useAuthStore();
  const { managementStaff, fetchManagementStaff } = useDataStore();
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;

  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<'All' | 'teacher' | 'staff'>('All');
  const [loading, setLoading] = useState(false);
  const [activeStaff, setActiveStaff] = useState<any>(null);

  const loadData = async () => {
    if (user?.organisation_id || user?.id) {
      setLoading(true);
      await fetchManagementStaff(user.organisation_id || 'all');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const staff = managementStaff || [];

  const filtered = staff.filter((item: any) => {
    const searchLower = search.toLowerCase();
    const nameMatch = item.full_name?.toLowerCase().includes(searchLower);
    const emailMatch = item.email?.toLowerCase().includes(searchLower);
    const matchesSearch = nameMatch || emailMatch;

    const matchesRole = selectedRole === 'All' ? true : item.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  const getInitials = (name: string) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'ST';
  };

  if (loading) return <Loader fullScreen message="Loading staff directory..." />;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Staff Registry</Text>
        <View style={styles.placeholderButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchBlock}>
          <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
            <Ionicons name="search-outline" size={20} color={colors.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search by employee name or email..."
              placeholderTextColor={colors.textMuted}
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        {/* Role filters */}
        <View style={styles.selectorBlock}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Filter by Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
            {(['All', 'teacher', 'staff'] as const).map((role) => {
              const isSelected = selectedRole === role;
              return (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isSelected ? '#F3F0FF' : colors.surface,
                      borderColor: isSelected ? '#6D4CFF' : colors.borderLight,
                    }
                  ]}
                  onPress={() => setSelectedRole(role)}
                >
                  <Text style={[styles.chipText, { color: isSelected ? '#6D4CFF' : colors.text }]}>
                    {role === 'All' ? 'All Roles' : role === 'teacher' ? 'Teachers' : 'Staff'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Staff list */}
        <View style={styles.listBlock}>
          <Text style={[styles.resultCountText, { color: colors.textMuted }]}>{filtered.length} Employees found</Text>
          {filtered.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
              <Ionicons name="people-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No employees found for this query</Text>
            </View>
          ) : (
            filtered.map((item: any) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => setActiveStaff(item)}
                style={[styles.staffCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}
              >
                <View style={[styles.avatarCircle, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.avatarText, { color: colors.primary }]}>{getInitials(item.full_name)}</Text>
                </View>
                <View style={styles.staffInfo}>
                  <Text style={[styles.staffName, { color: colors.text }]}>{item.full_name}</Text>
                  <Text style={[styles.staffMeta, { color: colors.textMuted }]}>
                    {item.role?.toUpperCase() || 'EMPLOYEE'} • {item.email || 'No email'}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Staff profile Modal */}
      {activeStaff && (
        <Modal visible={!!activeStaff} animationType="slide" transparent>
          <View style={styles.modalBackdrop}>
            <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Employee Profile</Text>
                <TouchableOpacity onPress={() => setActiveStaff(null)}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <View style={styles.profileHero}>
                <View style={[styles.heroAvatarCircle, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.heroAvatarText, { color: colors.primary }]}>
                    {getInitials(activeStaff.full_name)}
                  </Text>
                </View>
                <Text style={[styles.profileName, { color: colors.text }]}>{activeStaff.full_name}</Text>
                <Text style={[styles.profileRole, { color: colors.textMuted }]}>
                  {activeStaff.role?.toUpperCase() || 'STAFF'}
                </Text>
              </View>

              <View style={styles.profileSection}>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.textMuted }]}>User ID</Text>
                  <Text style={[styles.detailVal, { color: colors.text }]} numberOfLines={1}>{activeStaff.id}</Text>
                </View>
                <View style={[styles.detailRow, styles.borderTop, { borderTopColor: colors.borderLight }]}>
                  <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Email address</Text>
                  <Text style={[styles.detailVal, { color: colors.text }]}>{activeStaff.email || 'N/A'}</Text>
                </View>
                <View style={[styles.detailRow, styles.borderTop, { borderTopColor: colors.borderLight }]}>
                  <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Status</Text>
                  <Text style={[styles.detailVal, { color: activeStaff.status === 'active' ? '#10B981' : '#F59E0B' }]}>
                    {activeStaff.status?.toUpperCase() || 'ACTIVE'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}
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
  searchBlock: { paddingHorizontal: spacing.lg, marginTop: spacing.md },
  searchBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: borderRadius.xl, paddingHorizontal: spacing.md, height: 46 },
  searchInput: { flex: 1, marginLeft: spacing.sm, fontSize: fontSize.sm },
  selectorBlock: { paddingHorizontal: spacing.lg, marginTop: spacing.lg },
  sectionTitle: { fontSize: fontSize.xs, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.sm },
  chipsScroll: { gap: spacing.sm },
  chip: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full, borderWidth: 1 },
  chipText: { fontSize: fontSize.xs, fontWeight: '700' },
  listBlock: { paddingHorizontal: spacing.lg, marginTop: spacing.lg },
  resultCountText: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', marginBottom: spacing.sm },
  emptyCard: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.xl, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: fontSize.sm, marginTop: spacing.sm, fontWeight: '500' },
  staffCard: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderRadius: borderRadius.xl, borderWidth: 1, marginBottom: spacing.sm },
  avatarCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  avatarText: { fontSize: 14, fontWeight: '700' },
  staffInfo: { flex: 1 },
  staffName: { fontSize: fontSize.sm, fontWeight: '700' },
  staffMeta: { fontSize: 11, marginTop: 2 },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end', zIndex: 1000 },
  modalCard: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: spacing.lg, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  profileHero: { alignItems: 'center', marginVertical: spacing.lg },
  heroAvatarCircle: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md },
  heroAvatarText: { fontSize: 22, fontWeight: '700' },
  profileName: { fontSize: 18, fontWeight: '700', marginBottom: 2 },
  profileRole: { fontSize: fontSize.xs },
  profileSection: { borderRadius: borderRadius.xl, borderWidth: 1, borderColor: '#F3F4F6', overflow: 'hidden' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', padding: spacing.md },
  borderTop: { borderTopWidth: 1 },
  detailLabel: { fontSize: fontSize.xs, fontWeight: '500' },
  detailVal: { fontSize: fontSize.sm, fontWeight: '700' },
});
