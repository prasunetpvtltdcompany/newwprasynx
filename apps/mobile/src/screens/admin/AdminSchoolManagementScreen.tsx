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

export function AdminSchoolManagementScreen({ navigation }: any) {
  const { adminOrganisations, fetchAdminOrganisations, createOrganisation } = useDataStore();
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Modals state
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form fields for Add School
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formDomain, setFormDomain] = useState('');

  const loadData = async () => {
    setLoading(true);
    await fetchAdminOrganisations();
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAdminOrganisations();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const getInitials = (name: string) => {
    return name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'SC';
  };

  const handleCreateOrg = async () => {
    if (!formName.trim() || !formEmail.trim()) {
      alert('Please fill in Organisation Name and Email.');
      return;
    }
    setSubmitting(true);
    const result = await createOrganisation({
      name: formName.trim(),
      email: formEmail.trim(),
      phone: formPhone.trim(),
      address: formAddress.trim(),
      domain: formDomain.trim() || undefined,
    });
    setSubmitting(false);
    if (result.success) {
      alert('Organisation created successfully!');
      setShowAddModal(false);
      setFormName('');
      setFormEmail('');
      setFormPhone('');
      setFormAddress('');
      setFormDomain('');
      fetchAdminOrganisations();
    } else {
      alert(result.error || 'Failed to create organisation');
    }
  };

  const orgsList = adminOrganisations || [];

  const filteredOrgs = orgsList.filter((org: any) => {
    const searchLower = search.toLowerCase();
    const nameMatch = (org.name || '').toLowerCase().includes(searchLower);
    const domainMatch = (org.domain || org.slug || '').toLowerCase().includes(searchLower);
    const emailMatch = (org.email || '').toLowerCase().includes(searchLower);
    const matchesSearch = nameMatch || domainMatch || emailMatch;

    const matchesStatus =
      selectedStatus === 'All'
        ? true
        : (org.status || 'active').toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status?: string) => {
    const st = (status || 'active').toLowerCase();
    if (st === 'active' || st === 'verified') return { label: 'Active', variant: 'success' as const };
    if (st === 'pending') return { label: 'Pending', variant: 'warning' as const };
    if (st === 'suspended' || st === 'inactive') return { label: 'Suspended', variant: 'danger' as const };
    return { label: status || 'Active', variant: 'default' as const };
  };

  if (loading && !refreshing && orgsList.length === 0) {
    return <Loader fullScreen message="Loading schools directory..." />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Schools & Tenants</Text>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: '#6D4CFF' }]}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={18} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6D4CFF']} />}
      >
        {/* Search */}
        <View style={styles.searchBlock}>
          <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs]}>
            <Ionicons name="search-outline" size={20} color={colors.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search schools by name or domain..."
              placeholderTextColor={colors.textMuted}
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        {/* Status filters */}
        <View style={styles.selectorBlock}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>Filter by Status</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
            {['All', 'Active', 'Pending', 'Suspended'].map((status) => {
              const isSelected = selectedStatus === status;
              return (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isSelected ? '#F3F0FF' : colors.surface,
                      borderColor: isSelected ? '#6D4CFF' : colors.borderLight,
                    },
                  ]}
                  onPress={() => setSelectedStatus(status)}
                >
                  <Text style={[styles.chipText, { color: isSelected ? '#6D4CFF' : colors.text }]}>{status}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Schools List */}
        <View style={styles.listBlock}>
          <Text style={[styles.resultCountText, { color: colors.textMuted }]}>
            {filteredOrgs.length} Schools found
          </Text>

          {filteredOrgs.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
              <Ionicons name="business-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No schools match this filter</Text>
            </View>
          ) : (
            filteredOrgs.map((org: any) => {
              const badge = getStatusBadge(org.status);
              const students = org.student_count ?? org.studentsCount ?? org.usersCount ?? null;
              return (
                <TouchableOpacity
                  {...{ key: org.id }}
                  onPress={() => setSelectedOrg(org)}
                  style={[styles.schoolCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }, shadows.xs] as any}
                  activeOpacity={0.7}
                >
                  <View style={[styles.avatarCircle, { backgroundColor: colors.primaryLight }]}>
                    <Text style={[styles.avatarText, { color: colors.primary }]}>{getInitials(org.name)}</Text>
                  </View>
                  <View style={styles.schoolInfo}>
                    <Text style={[styles.schoolName, { color: colors.text }]}>{org.name || 'Unnamed School'}</Text>
                    <Text style={[styles.schoolDomain, { color: colors.textMuted }]}>
                      {org.domain || org.slug || org.email || 'No domain configured'}
                    </Text>
                    {students !== null && (
                      <Text style={[styles.schoolMeta, { color: colors.textMuted }]}>
                        {students} enrolled members
                      </Text>
                    )}
                  </View>
                  <Badge label={badge.label} variant={badge.variant} />
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* School Details Modal */}
      {selectedOrg && (
        <Modal visible={!!selectedOrg} animationType="slide" transparent>
          <View style={styles.modalBackdrop}>
            <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>School Information</Text>
                <TouchableOpacity onPress={() => setSelectedOrg(null)}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <View style={styles.profileHero}>
                <View style={[styles.heroAvatarCircle, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.heroAvatarText, { color: colors.primary }]}>
                    {getInitials(selectedOrg.name)}
                  </Text>
                </View>
                <Text style={[styles.profileName, { color: colors.text }]}>{selectedOrg.name}</Text>
                <Text style={[styles.profileDomain, { color: colors.textMuted }]}>
                  {selectedOrg.domain || selectedOrg.slug || 'Tenant ID: ' + selectedOrg.id}
                </Text>
              </View>

              <View style={styles.profileSection}>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Contact Email</Text>
                  <Text style={[styles.detailVal, { color: colors.text }]}>{selectedOrg.email || 'N/A'}</Text>
                </View>
                <View style={[styles.detailRow, styles.borderTop, { borderTopColor: colors.borderLight }]}>
                  <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Phone Number</Text>
                  <Text style={[styles.detailVal, { color: colors.text }]}>{selectedOrg.phone || 'N/A'}</Text>
                </View>
                <View style={[styles.detailRow, styles.borderTop, { borderTopColor: colors.borderLight }]}>
                  <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Address</Text>
                  <Text style={[styles.detailVal, { color: colors.text }]}>{selectedOrg.address || 'N/A'}</Text>
                </View>
                <View style={[styles.detailRow, styles.borderTop, { borderTopColor: colors.borderLight }]}>
                  <Text style={[styles.detailLabel, { color: colors.textMuted }]}>Status</Text>
                  <Text style={[styles.detailVal, { color: colors.text }]}>
                    {(selectedOrg.status || 'Active').toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Add School Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Register New School</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.lg }}>
              <View style={styles.fieldBlock}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>School Name *</Text>
                <TextInput
                  style={[styles.inputField, { backgroundColor: colors.background, color: colors.text, borderColor: colors.borderLight }]}
                  placeholder="e.g. St. Xavier International"
                  placeholderTextColor={colors.textMuted}
                  value={formName}
                  onChangeText={setFormName}
                />
              </View>

              <View style={styles.fieldBlock}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Admin Email *</Text>
                <TextInput
                  style={[styles.inputField, { backgroundColor: colors.background, color: colors.text, borderColor: colors.borderLight }]}
                  placeholder="admin@school.com"
                  placeholderTextColor={colors.textMuted}
                  value={formEmail}
                  onChangeText={setFormEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
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

              <View style={styles.fieldBlock}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Subdomain / Domain</Text>
                <TextInput
                  style={[styles.inputField, { backgroundColor: colors.background, color: colors.text, borderColor: colors.borderLight }]}
                  placeholder="schoolname"
                  placeholderTextColor={colors.textMuted}
                  value={formDomain}
                  onChangeText={setFormDomain}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.fieldBlock}>
                <Text style={[styles.fieldLabel, { color: colors.text }]}>Campus Address</Text>
                <TextInput
                  style={[styles.inputField, { backgroundColor: colors.background, color: colors.text, borderColor: colors.borderLight }]}
                  placeholder="City, State"
                  placeholderTextColor={colors.textMuted}
                  value={formAddress}
                  onChangeText={setFormAddress}
                />
              </View>

              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: '#6D4CFF' }]}
                onPress={handleCreateOrg}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitButtonText}>Create School</Text>
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
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
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
  schoolCard: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderRadius: borderRadius.xl, borderWidth: 1, marginBottom: spacing.sm },
  avatarCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  avatarText: { fontSize: 14, fontWeight: '700' },
  schoolInfo: { flex: 1 },
  schoolName: { fontSize: fontSize.sm, fontWeight: '700' },
  schoolDomain: { fontSize: 11, marginTop: 2 },
  schoolMeta: { fontSize: 10, marginTop: 2 },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end', zIndex: 1000 },
  modalCard: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: spacing.lg, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  profileHero: { alignItems: 'center', marginVertical: spacing.md },
  heroAvatarCircle: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm },
  heroAvatarText: { fontSize: 22, fontWeight: '700' },
  profileName: { fontSize: 18, fontWeight: '700', marginBottom: 2, textAlign: 'center' },
  profileDomain: { fontSize: fontSize.xs, textAlign: 'center' },
  profileSection: { borderRadius: borderRadius.xl, borderWidth: 1, borderColor: '#F3F4F6', overflow: 'hidden' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', padding: spacing.md },
  borderTop: { borderTopWidth: 1 },
  detailLabel: { fontSize: fontSize.xs, fontWeight: '500' },
  detailVal: { fontSize: fontSize.sm, fontWeight: '700' },
  fieldBlock: { marginBottom: spacing.md },
  fieldLabel: { fontSize: fontSize.xs, fontWeight: '600', marginBottom: 6 },
  inputField: { borderWidth: 1, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, fontSize: fontSize.sm },
  submitButton: { borderRadius: borderRadius.xl, paddingVertical: spacing.md, alignItems: 'center', marginTop: spacing.sm },
  submitButtonText: { color: '#FFFFFF', fontSize: fontSize.sm, fontWeight: '700' },
});
