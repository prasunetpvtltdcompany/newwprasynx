import { create } from 'zustand';
import * as api from '../services/api';
import {
  AttendanceRecord,
  FeeRecord,
  ExamResult,
  Assignment,
  TimetableEntry,
  Notification,
  PartTimeJob,
  JobApplication,
} from '../types';

interface DataState {
  // Student State
  dashboard: any | null;
  attendance: AttendanceRecord[];
  fees: FeeRecord[];
  results: ExamResult[];
  assignments: Assignment[];
  timetable: TimetableEntry[];
  notifications: any[];
  jobs: PartTimeJob[];
  applications: JobApplication[];
  exams: any[];
  library: any[];
  messages: any[];
  health: any | null;

  // Parent State
  parentDashboard: any | null;
  parentAttendance: any[];
  parentFees: any[];
  parentResults: any | null;
  parentAssignments: any[];
  parentExams: any[];
  parentTransport: any | null;
  parentHealth: any | null;
  parentMessages: any[];
  parentNotifications: any[];
  parentComplaints: any[];

  // Staff State
  staffDashboard: any | null;
  staffStudents: any[];
  staffClasses: any[];
  staffTimetable: any[];
  staffAssignments: any[];
  staffConversations: any[];
  staffNotifications: any[];

  // Management State
  managementDashboard: any | null;
  managementFinance: any | null;
  managementStaff: any[];
  managementReports: any[];

  // Admin State
  adminOverview: any | null;
  adminOrganisations: any[];
  adminUsers: any[];
  adminUserStats: any | null;
  adminAuditLogs: any[];
  adminAnalytics: any | null;
  adminTopOrgs: any[];

  // Student Actions
  fetchDashboard: (role: string, id: string, orgId?: string) => Promise<void>;
  fetchAttendance: (studentId: string) => Promise<void>;
  fetchFees: (studentId: string) => Promise<void>;
  resultsOfStudent: (studentId: string) => Promise<void>;
  fetchResults: (studentId: string) => Promise<void>;
  fetchAssignments: (studentId: string) => Promise<void>;
  fetchTimetable: (studentId: string) => Promise<void>;
  fetchNotifications: (studentId: string, orgId: string) => Promise<void>;
  fetchExams: (studentId: string) => Promise<void>;
  fetchLibrary: (userId: string) => Promise<void>;
  fetchMessages: (userId: string) => Promise<void>;
  fetchHealth: (studentId: string) => Promise<void>;
  fetchJobs: (orgId: string) => Promise<void>;
  fetchApplications: (userId: string) => Promise<void>;

  // Parent Actions
  fetchParentDashboard: (parentId: string) => Promise<void>;
  fetchParentAttendance: (studentId: string) => Promise<void>;
  fetchParentFees: (studentId: string) => Promise<void>;
  fetchParentResults: (studentId: string) => Promise<void>;
  fetchParentAssignments: (studentId: string) => Promise<void>;
  fetchParentExams: (studentId: string) => Promise<void>;
  fetchParentTransport: (studentId: string) => Promise<void>;
  fetchParentHealth: (studentId: string) => Promise<void>;
  fetchParentMessages: (userId: string) => Promise<void>;
  fetchParentNotifications: (parentId: string) => Promise<void>;
  fetchParentComplaints: (parentId: string) => Promise<void>;

  // Staff Actions
  fetchStaffDashboard: (teacherId: string) => Promise<void>;
  fetchStaffStudents: (teacherId: string) => Promise<void>;
  fetchStaffClasses: (teacherId: string) => Promise<void>;
  fetchStaffTimetable: (teacherId: string) => Promise<void>;
  fetchStaffAssignments: (teacherId: string) => Promise<void>;
  fetchStaffConversations: (userId: string) => Promise<void>;
  fetchStaffNotifications: (orgId: string) => Promise<void>;

  // Management Actions
  fetchManagementDashboard: (orgId: string) => Promise<void>;
  fetchManagementFinance: (orgId: string) => Promise<void>;
  fetchManagementStaff: (orgId: string) => Promise<void>;
  fetchManagementReports: (orgId: string) => Promise<void>;

  // Admin Actions
  fetchAdminOverview: () => Promise<void>;
  fetchAdminOrganisations: (params?: { q?: string; status?: string }) => Promise<void>;
  fetchAdminUsers: (params?: { q?: string; group?: string; status?: string }) => Promise<void>;
  fetchAdminUserStats: () => Promise<void>;
  fetchAdminAuditLogs: () => Promise<void>;
  fetchAdminAnalytics: () => Promise<void>;
  fetchAdminTopOrgs: () => Promise<void>;
  createOrganisation: (data: any) => Promise<{ success: boolean; error?: string; data?: any }>;
  createUser: (data: any) => Promise<{ success: boolean; error?: string; data?: any }>;
  updateUserStatus: (id: string, status: string) => Promise<{ success: boolean; error?: string }>;
}

export const useDataStore = create<DataState>((set) => ({
  // Student State
  dashboard: null,
  attendance: [],
  fees: [],
  results: [],
  assignments: [],
  timetable: [],
  notifications: [],
  jobs: [],
  applications: [],
  exams: [],
  library: [],
  messages: [],
  health: null,

  // Parent State
  parentDashboard: null,
  parentAttendance: [],
  parentFees: [],
  parentResults: null,
  parentAssignments: [],
  parentExams: [],
  parentTransport: null,
  parentHealth: null,
  parentMessages: [],
  parentNotifications: [],
  parentComplaints: [],

  // Staff State
  staffDashboard: null,
  staffStudents: [],
  staffClasses: [],
  staffTimetable: [],
  staffAssignments: [],
  staffConversations: [],
  staffNotifications: [],

  // Management State
  managementDashboard: null,
  managementFinance: null,
  managementStaff: [],
  managementReports: [],

  // Admin State
  adminOverview: null,
  adminOrganisations: [],
  adminUsers: [],
  adminUserStats: null,
  adminAuditLogs: [],
  adminAnalytics: null,
  adminTopOrgs: [],

  // Student Actions
  fetchDashboard: async (role, id, orgId) => {
    let url = '';
    switch (role) {
      case 'admin': url = `/v2/admin/analytics/dashboard`; break;
      case 'management': url = `/v2/management/dashboard/${orgId}`; break;
      case 'staff': url = `/staff/dashboard/${id}`; break;
      case 'student': url = `/student/dashboard/${id}`; break;
      case 'parent': url = `/parent/dashboard/${id}`; break;
      case 'job_provider': url = `/job-provider/dashboard`; break;
      default: return;
    }
    const result = await api.apiGet<any>(url);
    if (result.success && result.data) {
      if (role === 'parent') {
        set({ parentDashboard: result.data });
      } else if (role === 'staff') {
        set({ staffDashboard: result.data });
      } else if (role === 'management') {
        set({ managementDashboard: result.data });
      } else if (role === 'admin') {
        set({ adminAnalytics: result.data, dashboard: result.data });
      } else {
        set({ dashboard: result.data });
      }
    }
  },

  fetchAttendance: async (studentId) => {
    const result = await api.apiGet<AttendanceRecord[]>(`/student/attendance/${studentId}`);
    if (result.success && result.data) {
      set({ attendance: result.data });
    }
  },

  fetchFees: async (studentId) => {
    const result = await api.apiGet<FeeRecord[]>(`/student/fees/${studentId}`);
    if (result.success && result.data) {
      set({ fees: result.data });
    }
  },

  resultsOfStudent: async (studentId) => {
    const result = await api.apiGet<ExamResult[]>(`/student/marks/${studentId}`);
    if (result.success && result.data) {
      set({ results: result.data });
    }
  },

  fetchResults: async (studentId) => {
    const result = await api.apiGet<ExamResult[]>(`/student/marks/${studentId}`);
    if (result.success && result.data) {
      set({ results: result.data });
    }
  },

  fetchAssignments: async (studentId) => {
    const result = await api.apiGet<Assignment[]>(`/student/assignments/${studentId}`);
    if (result.success && result.data) {
      set({ assignments: result.data });
    }
  },

  fetchTimetable: async (studentId) => {
    const result = await api.apiGet<TimetableEntry[]>(`/student/timetable/student/${studentId}`);
    if (result.success && result.data) {
      set({ timetable: result.data });
    }
  },

  fetchNotifications: async (studentId, orgId) => {
    const result = await api.apiGet<any[]>(`/student/announcements/${studentId}/${orgId}`);
    if (result.success && result.data) {
      set({ notifications: result.data });
    }
  },

  fetchExams: async (studentId) => {
    const result = await api.apiGet<any[]>(`/student/exams/${studentId}`);
    if (result.success && result.data) {
      set({ exams: result.data });
    }
  },

  fetchLibrary: async (userId) => {
    const result = await api.apiGet<any[]>(`/student/library/${userId}`);
    if (result.success && result.data) {
      set({ library: result.data });
    }
  },

  fetchMessages: async (userId) => {
    const result = await api.apiGet<any[]>(`/student/conversations/${userId}`);
    if (result.success && result.data) {
      set({ messages: result.data });
    }
  },

  fetchHealth: async (studentId) => {
    const result = await api.apiGet<any>(`/student/health/${studentId}`);
    if (result.success && result.data) {
      set({ health: result.data });
    }
  },

  fetchJobs: async (orgId) => {
    const result = await api.apiGet<PartTimeJob[]>(`/student/part-time-jobs/${orgId}`);
    if (result.success && result.data) {
      set({ jobs: result.data });
    }
  },

  fetchApplications: async (userId) => {
    const result = await api.apiGet<JobApplication[]>(`/student/part-time-jobs/applications/${userId}`);
    if (result.success && result.data) {
      set({ applications: result.data });
    }
  },

  // Parent Actions
  fetchParentDashboard: async (parentId) => {
    const result = await api.apiGet<any>(`/parent/dashboard/${parentId}`);
    if (result.success && result.data) {
      set({ parentDashboard: result.data });
    }
  },

  fetchParentAttendance: async (studentId) => {
    const result = await api.apiGet<any>(`/parent/attendance/${studentId}`);
    if (result.success && result.data) {
      set({ parentAttendance: result.data.records || [] });
    }
  },

  fetchParentFees: async (studentId) => {
    const result = await api.apiGet<any>(`/parent/fees/${studentId}`);
    if (result.success && result.data) {
      set({ parentFees: result.data.studentFees || [] });
    }
  },

  fetchParentResults: async (studentId) => {
    const result = await api.apiGet<any>(`/parent/performance/${studentId}`);
    if (result.success && result.data) {
      set({ parentResults: result.data });
    }
  },

  fetchParentAssignments: async (studentId) => {
    const result = await api.apiGet<any>(`/parent/assignments/${studentId}`);
    if (result.success && result.data) {
      set({ parentAssignments: result.data.assignments || [] });
    }
  },

  fetchParentExams: async (studentId) => {
    const result = await api.apiGet<any>(`/parent/exams/${studentId}`);
    if (result.success && result.data) {
      set({ parentExams: result.data.schedules || [] });
    }
  },

  fetchParentTransport: async (studentId) => {
    const result = await api.apiGet<any>(`/parent/transport/${studentId}`);
    if (result.success && result.data) {
      set({ parentTransport: result.data });
    }
  },

  fetchParentHealth: async (studentId) => {
    const result = await api.apiGet<any>(`/parent/health/${studentId}`);
    if (result.success && result.data) {
      const vaccinationsRes = await api.apiGet<any>(`/parent/vaccinations/${studentId}`);
      set({
        parentHealth: {
          reports: result.data.reports || [],
          vaccinations: vaccinationsRes.data || []
        }
      });
    }
  },

  fetchParentMessages: async (userId) => {
    const result = await api.apiGet<any[]>(`/parent/conversations/${userId}`);
    if (result.success && result.data) {
      set({ parentMessages: result.data });
    }
  },

  fetchParentNotifications: async (parentId) => {
    const result = await api.apiGet<any>(`/parent/notifications/${parentId}`);
    if (result.success && result.data) {
      set({ parentNotifications: result.data.notifications || [] });
    }
  },

  fetchParentComplaints: async (parentId) => {
    const result = await api.apiGet<any[]>(`/parent/complaints/${parentId}`);
    if (result.success && result.data) {
      set({ parentComplaints: result.data });
    }
  },

  // Staff Actions
  fetchStaffDashboard: async (teacherId) => {
    const result = await api.apiGet<any>(`/staff/dashboard/${teacherId}`);
    if (result.success && result.data) {
      set({ staffDashboard: result.data });
    }
  },

  fetchStaffStudents: async (teacherId) => {
    const result = await api.apiGet<any[]>(`/staff/students/${teacherId}`);
    if (result.success && result.data) {
      set({ staffStudents: result.data });
    }
  },

  fetchStaffClasses: async (teacherId) => {
    const result = await api.apiGet<any[]>(`/staff/classes/${teacherId}`);
    if (result.success && result.data) {
      set({ staffClasses: result.data });
    }
  },

  fetchStaffTimetable: async (teacherId) => {
    const result = await api.apiGet<any[]>(`/staff/timetable/${teacherId}`);
    if (result.success && result.data) {
      set({ staffTimetable: result.data });
    }
  },

  fetchStaffAssignments: async (teacherId) => {
    const result = await api.apiGet<any[]>(`/staff/assignments/${teacherId}`);
    if (result.success && result.data) {
      set({ staffAssignments: result.data });
    }
  },

  fetchStaffConversations: async (userId) => {
    const result = await api.apiGet<any[]>(`/staff/conversations/${userId}`);
    if (result.success && result.data) {
      set({ staffConversations: result.data });
    }
  },

  fetchStaffNotifications: async (orgId) => {
    const result = await api.apiGet<any[]>(`/staff/announcements/${orgId}`);
    if (result.success && result.data) {
      set({ staffNotifications: result.data });
    }
  },

  // Management Actions
  fetchManagementDashboard: async (orgId) => {
    const result = await api.apiGet<any>(`/v2/management/dashboard/${orgId}`);
    if (result.success && result.data) {
      set({ managementDashboard: result.data });
    }
  },

  fetchManagementFinance: async (orgId) => {
    const result = await api.apiGet<any>(`/v2/accounts/dashboard/${orgId}`);
    if (result.success && result.data) {
      set({ managementFinance: result.data });
    }
  },

  fetchManagementStaff: async (orgId) => {
    const result = await api.apiGet<any>(`/v2/management/staff/${orgId}`);
    if (result.success && result.data) {
      const records = result.data.staff || result.data || [];
      set({ managementStaff: records });
    }
  },

  fetchManagementReports: async (orgId) => {
    const result = await api.apiGet<any[]>(`/v2/accounts/reports/${orgId}`);
    if (result.success && result.data) {
      set({ managementReports: result.data });
    }
  },

  // Admin Actions
  fetchAdminOverview: async () => {
    const result = await api.apiGet<any>('/v2/admin/gcc/overview');
    if (result.success && result.data) {
      set({ adminOverview: result.data });
    }
  },

  fetchAdminOrganisations: async (params) => {
    let url = '/v2/admin/gcc/organisations';
    const queryParts: string[] = [];
    if (params?.q) queryParts.push(`q=${encodeURIComponent(params.q)}`);
    if (params?.status) queryParts.push(`status=${encodeURIComponent(params.status)}`);
    if (queryParts.length > 0) url += `?${queryParts.join('&')}`;

    const result = await api.apiGet<any>(url);
    if (result.success && result.data) {
      const orgs = Array.isArray(result.data)
        ? result.data
        : (result.data.organisations || result.data.data || []);
      set({ adminOrganisations: orgs });
    }
  },

  fetchAdminUsers: async (params) => {
    let url = '/v2/admin/users?pageSize=100';
    if (params?.q) url += `&q=${encodeURIComponent(params.q)}`;
    if (params?.group && params.group !== 'All') url += `&group=${encodeURIComponent(params.group.toLowerCase())}`;
    if (params?.status && params.status !== 'All') url += `&status=${encodeURIComponent(params.status.toLowerCase())}`;

    const result = await api.apiGet<any>(url);
    if (result.success && result.data) {
      const users = Array.isArray(result.data)
        ? result.data
        : (result.data.users || result.data.data || []);
      set({ adminUsers: users });
    }
  },

  fetchAdminUserStats: async () => {
    const result = await api.apiGet<any>('/v2/admin/users/stats');
    if (result.success && result.data) {
      set({ adminUserStats: result.data });
    }
  },

  fetchAdminAuditLogs: async () => {
    const result = await api.apiGet<any>('/v2/admin/gcc/audit-logs');
    if (result.success && result.data) {
      const logs = Array.isArray(result.data)
        ? result.data
        : (result.data.logs || result.data.data || []);
      set({ adminAuditLogs: logs });
    }
  },

  fetchAdminAnalytics: async () => {
    const result = await api.apiGet<any>('/v2/admin/analytics/dashboard');
    if (result.success && result.data) {
      set({ adminAnalytics: result.data });
    }
  },

  fetchAdminTopOrgs: async () => {
    const result = await api.apiGet<any>('/v2/admin/analytics/top-organisations');
    if (result.success && result.data) {
      const top = Array.isArray(result.data)
        ? result.data
        : (result.data.organisations || result.data.data || []);
      set({ adminTopOrgs: top });
    }
  },

  createOrganisation: async (data: any) => {
    const result = await api.apiPost<any>('/v2/admin/create-organisation', data);
    return result;
  },

  createUser: async (data: any) => {
    const result = await api.apiPost<any>('/v2/admin/users', data);
    return result;
  },

  updateUserStatus: async (id: string, status: string) => {
    const result = await api.apiPut<any>(`/v2/admin/users/${id}/status`, { status });
    return result;
  },
}));
