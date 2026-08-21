import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDataStore } from '../../store/dataStore';
import { useThemeStore } from '../../store/themeStore';
import { lightColors, darkColors, borderRadius, fontSize, spacing, shadows } from '../../theme';
import { Badge, Loader } from '../../components';

const ROLES = ['All', 'Admin', 'Management', 'Staff', 'Student', 'Parent'];

export function AdminUserManagementScreen({ navigation }: any) {
  const {
    adminUsers,
    fetchAdminUsers,
    adminUserStats,
    fetchAdminUserStats,
    updateUserStatus,
    createUser,
  } = useDataStore();
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;

  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Modals state
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form fields for Create User
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState('staff');

  const loadData = async () => {
    setLoading(true);
    await Promise.all([
      fetchAdminUsers(),
      fetchAdminUserStats(),
    ]);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchAdminUsers(),
      fetchAdminUserStats(),
    ]);
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const getInitials = (name?: string) => {
    return name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'US';
  };

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    const result = await updateUserStatus(userId, nextStatus);
    if (result.success) {
      fetchAdminUsers();
      fetchAdminUserStats();
    } else {
      alert(result.error || 'Failed to update user status');
    }
  };

  const handleCreateUser = async () => {
    if (!formName.trim() || !formEmail.trim() || !formPassword.trim()) {
      alert('Please fill in Name, Email, and Password.');
      return;
    }
    setSubmitting(true);
    const result = await createUser({
      full_name: formName.trim(),
      email: formEmail.trim(),
      phone: formPhone.trim(),
      password: formPassword.trim(),
      role: formRole,
    });
    setSubmitting(false);
    if (result.success) {
      alert('User created successfully!');
      setShowCreateModal(false);
      setFormName('');
      setFormEmail('');
      setFormPhone('');
      setFormPassword('');
      fetchAdminUsers();
      fetchAdminUserStats();
    } else {
      alert(result.error || 'Failed to create user');
    }
  };

  const usersList = adminUsers || [];

  const filteredUsers = usersList.filter((u: any) => {
    const searchLower = search.toLowerCase();
    const nameMatch = (u.full_name || u.name || '').toLowerCase().includes(searchLower);
    const emailMatch = (u.email || '').toLowerCase().includes(searchLower);
    const matchesSearch = nameMatch || emailMatch;

    const userRole = (u.role || '').toLowerCase();
    const matchesRole =
      selectedRole === 'All'
        ? true
        : userRole === selectedRole.toLowerCase();

    return matchesSearch && matchesRole;
  });

  const stats = adminUserStats || {};
  const totalCount = stats.total ?? usersList.length;
  const activeCount = stats.active ?? usersList.filter((u: any) => (u.status || 'active') === 'active').length;
  const suspendedCount = stats.suspended ?? usersList.filter((u: any) => u.status === 'suspended').length;

  if (loading && !refreshing && usersList.length === 0) {
    return <Loader fullScreen message="Loading user management directory..." />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>User Management</Text>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: '#6D4CFF' }]}
          onPress={() => setShowCreateModal(true)}
        >
          <Ionicons name="add" size={18} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Create</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6D4CFF']} />}
      >
        {/* User Summary Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
            <Text style={[styles.statVal, { color: colors.text }]}>{totalCount}</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Total Users</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
            <Text style={[styles.statVal, { color: '#10B981' }]}>{activeCount}</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Active</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
            <Text style={[styles.statVal, { color: '#EF4444' }]}>{suspendedCount}</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Suspended</Text>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchBlock}>
          <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
            <Ionicons name="search-outline" size={20} color={colors.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search users by name or email..."
              placeholderTextColor={colors.textMuted}
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        {/* Role Filters */}
        <View style={styles.selectorBlock}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Filter by Role</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
            {ROLES.map((role) => {
              const isSelected = selectedRole === role;
              return (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isSelected ? '#F3F0FF' : colors.surface,
                      borderColor: isSelected ? '#6D4CFF' : colors.borderLight,
                    },
                  ]}
                  onPress={() => setSelectedRole(role)}
                >
                  <Text style={[styles.chipText, { color: isSelected ? '#6D4CFF' : colors.text }]}>{role}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* User List */}
        <View style={styles.listBlock}>
          <Text style={[styles.resultCountText, { color: colors.textMuted }]}>
            {filteredUsers.length} Users found
          </Text>

          {filteredUsers.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
              <Ionicons name="people-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No users found</Text>
            </View>
          ) : (
            filteredUsers.map((u: any) => {
              const status = (u.status || 'active').toLowerCase();
              const isSuspended = status === 'suspended';
              return (
                <TouchableOpacity
                  {...{ key: u.id }}
                  onPress={() => setSelectedUser(u)}
                  style={[styles.userCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs] as any}
                  activeOpacity={0.7}
                >
                  <View style={[styles.avatarCircle, { backgroundColor: colors.primaryLight }]}>
                    <Text style={[styles.avatarText, { color: colors.primary }]}>{getInitials(u.full_name || u.name)}</Text>
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={[styles.userName, { color: colors.text }]}>{u.full_name || u.name || 'Unnamed User'}</Text>
                    <Text style={[styles.userEmail, { color: colors.textMuted }]}>{u.email || 'No email'}</Text>
                    <View style={styles.badgeRow}>
                      <Badge label={(u.role || 'user').toUpperCase()} variant="default" />
                    </View>
                  </View>

                  <View style={styles.actionsColumn}>
                    <Badge label={isSuspended ? 'Suspended' : 'Active'} variant={isSuspended ? 'danger' : 'success'} />
                    <TouchableOpacity
                      style={[styles.actionToggleBtn, { backgroundColor: isSuspended ? '#ECFDF5' : '#FEF2F2' }]}
                      onPress={() => handleStatusToggle(u.id, status)}
                    >
                      <Text style={[styles.actionToggleText, { color: isSuspended ? '#10B981' : '#EF4444' }]}>
                        {isSuspended ? 'Activate' : 'Suspend'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* User Details Modal */}
      {selectedUser && (
        <Modal visible={!!selectedUser} animationType="slide" transparent>
          <View style={styles.modalBackdrop}>
            <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>User Profile</Text>
                <TouchableOpacity onPress={() => setSelectedUser(null)}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <View style={styles.profileHero}>
                <View style={[styles.heroAvatarCircle, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.heroAvatarText, { color: colors.primary }]}>
                    {getInitials(selectedUser.full_name || selectedUser.name)}
                  </Text>
                </View>
                <Text style={[styles.profileName, { color: colors.text }]}>
                  {selectedUser.full_name || selectedUser.name || 'User Profile'}
                </Text>
                <Text style={[styles.profileRole, { color: colors.textMuted }]}>
                  {(selectedUser.role || 'User').toUpperCase()}
                </Text>
              </View>

              <View style={styles.profileSection}>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.textMuted }]}>User ID</Text>
                  <Text style={[styles.detailVal, { color: colors.text }]} numberOfLines={1}>
                    {selectedUser.id}
                  </Text>
                </View>
                <View style={[styles.detailRow, styles.borderTop, { borderTopColor: colors.borderLight }]}>
                  <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Email address</Text>
                  <Text style={[styles.detailVal, { color: colors.text }]}>{selectedUser.email || 'N/A'}</Text>
                </View>
                <View style={[styles.detailRow, styles.borderTop, { borderTopColor: colors.borderLight }]}>
                  <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Phone Number</Text>
                  <Text style={[styles.detailVal, { color: colors.text }]}>{selectedUser.phone || 'N/A'}</Text>
                </View>
                <View style={[styles.detailRow, styles.borderTop, { borderTopColor: colors.borderLight }]}>
                  <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Account Status</Text>
                  <Text
                    style={[
                      styles.detailVal,
                      { color: (selectedUser.status || 'active') === 'active' ? '#10B981' : '#EF4444' },
                    ]}
                  >
                    {(selectedUser.status || 'active').toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Create User Modal */}
      <Modal visible={showCreateModal} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Create System User</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.lg }}>
              <View style={styles.fieldBlock}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Full Name *</Text>
                <TextInput
                  style={[styles.inputField, { backgroundColor: colors.background, color: colors.text, borderColor: colors.borderLight }]}
                  placeholder="e.g. Rahul Sharma"
                  placeholderTextColor={colors.textMuted}
                  value={formName}
                  onChangeText={setFormName}
                />
              </View>

              <View style={styles.fieldBlock}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Email Address *</Text>
                <TextInput
                  style={[styles.inputField, { backgroundColor: colors.background, color: colors.text, borderColor: colors.borderLight }]}
                  placeholder="user@school.com"
                  placeholderTextColor={colors.textMuted}
                  value={formEmail}
                  onChangeText={setFormEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.fieldBlock}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Password *</Text>
                <TextInput
                  style={[styles.inputField, { backgroundColor: colors.background, color: colors.text, borderColor: colors.borderLight }]}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textMuted}
                  value={formPassword}
                  onChangeText={setFormPassword}
                  secureTextEntry
                />
              </View>

              <View style={styles.fieldBlock}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Role</Text>
                <View style={styles.roleSelectRow}>
                  {['management', 'staff', 'admin'].map((r) => {
                    const isSelected = formRole === r;
                    return (
                      <TouchableOpacity
                        key={r}
                        style={[
                          styles.roleSelectChip,
                          {
                            backgroundColor: isSelected ? '#6D4CFF' : colors.background,
                            borderColor: isSelected ? '#6D4CFF' : colors.borderLight,
                          },
                        ]}
                        onPress={() => setFormRole(r)}
                      >
                        <Text style={[styles.roleSelectText, { color: isSelected ? '#FFFFFF' : colors.text }]}>
                          {r.toUpperCase()}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.fieldBlock}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Contact Phone</Text>
                <TextInput
                  style={[styles.inputField, { backgroundColor: colors.background, color: colors.text, borderColor: colors.borderLight }]}
                  placeholder="+91-9876543210"
                  placeholderTextColor={colors.textMuted}
                  value={formPhone}
                  onChangeText={setFormPhone}
                  keyboardType="phone-pad"
                />
              </View>

              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: '#6D4CFF' }]}
                onPress={handleCreateUser}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitButtonText}>Create User</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  addBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  scroll: { paddingBottom: spacing.xxl },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.sm,
    alignItems: 'center',
  },
  statVal: { fontSize: 18, fontWeight: '800' },
  statLabel: { fontSize: 10, fontWeight: '600', marginTop: 2 },
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
  userCard: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderRadius: borderRadius.xl, borderWidth: 1, marginBottom: spacing.sm },
  avatarCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  avatarText: { fontSize: 14, fontWeight: '700' },
  userInfo: { flex: 1 },
  userName: { fontSize: fontSize.sm, fontWeight: '700' },
  userEmail: { fontSize: 11, marginTop: 2 },
  badgeRow: { flexDirection: 'row', marginTop: 4 },
  actionsColumn: { alignItems: 'flex-end', gap: 6 },
  actionToggleBtn: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: borderRadius.sm },
  actionToggleText: { fontSize: 10, fontWeight: '700' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end', zIndex: 1000 },
  modalCard: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: spacing.lg, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  profileHero: { alignItems: 'center', marginVertical: spacing.md },
  heroAvatarCircle: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm },
  heroAvatarText: { fontSize: 22, fontWeight: '700' },
  profileName: { fontSize: 18, fontWeight: '700', marginBottom: 2, textAlign: 'center' },
  profileRole: { fontSize: fontSize.xs, textAlign: 'center' },
  profileSection: { borderRadius: borderRadius.xl, borderWidth: 1, borderColor: '#F3F4F6', overflow: 'hidden' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', padding: spacing.md },
  borderTop: { borderTopWidth: 1 },
  detailLabel: { fontSize: fontSize.xs, fontWeight: '500' },
  detailVal: { fontSize: fontSize.sm, fontWeight: '700' },
  fieldBlock: { marginBottom: spacing.md },
  fieldLabel: { fontSize: fontSize.xs, fontWeight: '600', marginBottom: 6 },
  inputField: { borderWidth: 1, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, fontSize: fontSize.sm },
  roleSelectRow: { flexDirection: 'row', gap: spacing.sm },
  roleSelectChip: { flex: 1, paddingVertical: spacing.sm, borderRadius: borderRadius.lg, borderWidth: 1, alignItems: 'center' },
  roleSelectText: { fontSize: 11, fontWeight: '700' },
  submitButton: { borderRadius: borderRadius.xl, paddingVertical: spacing.md, alignItems: 'center', marginTop: spacing.sm },
  submitButtonText: { color: '#FFFFFF', fontSize: fontSize.sm, fontWeight: '700' },
});
