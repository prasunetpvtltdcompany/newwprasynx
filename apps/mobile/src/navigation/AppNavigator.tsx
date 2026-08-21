import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from '../screens/auth/SplashScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { OTPVerificationScreen } from '../screens/auth/OTPVerificationScreen';
import { StudentTabs } from './StudentTabs';
import { ParentTabs } from './ParentTabs';
import { StaffTabs } from './StaffTabs';
import { ManagementTabs } from './ManagementTabs';
import { JobProviderTabs } from './JobProviderTabs';
import { AdminTabs } from './AdminTabs';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { lightColors, darkColors } from '../theme';

// Import Student Detail Screens
import { StudentResultsScreen } from '../screens/student/StudentResultsScreen';
import { StudentAcademicsScreen } from '../screens/student/StudentAcademicsScreen';
import { StudentExamsScreen } from '../screens/student/StudentExamsScreen';
import { StudentFinanceScreen } from '../screens/student/StudentFinanceScreen';
import { StudentLibraryScreen } from '../screens/student/StudentLibraryScreen';
import { StudentMessagesScreen } from '../screens/student/StudentMessagesScreen';
import { StudentProfileScreen } from '../screens/student/StudentProfileScreen';
import { StudentHealthScreen } from '../screens/student/StudentHealthScreen';
import { StudentSettingsScreen } from '../screens/student/StudentSettingsScreen';

// Import Parent Detail Screens
import { ParentChildrenScreen } from '../screens/parent/ParentChildrenScreen';
import { ParentAssignmentsScreen } from '../screens/parent/ParentAssignmentsScreen';
import { ParentExamsScreen } from '../screens/parent/ParentExamsScreen';
import { ParentHealthScreen } from '../screens/parent/ParentHealthScreen';
import { ParentMessagesScreen } from '../screens/parent/ParentMessagesScreen';
import { ParentTransportScreen } from '../screens/parent/ParentTransportScreen';
import { ParentJobsScreen } from '../screens/parent/ParentJobsScreen';
import { ParentProfileScreen } from '../screens/parent/ParentProfileScreen';
import { ParentSettingsScreen } from '../screens/parent/ParentSettingsScreen';
import { ParentSupportScreen } from '../screens/parent/ParentSupportScreen';

// Import Staff Detail Screens
import { StaffProfileScreen } from '../screens/staff/StaffProfileScreen';
import { StaffSettingsScreen } from '../screens/staff/StaffSettingsScreen';
import { StaffMessagesScreen } from '../screens/staff/StaffMessagesScreen';
import { StaffNotificationsScreen } from '../screens/staff/StaffNotificationsScreen';

const Stack = createNativeStackNavigator();

function AuthStack() {
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
    </Stack.Navigator>
  );
}

function RoleRouter() {
  const role = useAuthStore((s) => s.role);

  switch (role) {
    case 'student': return <StudentTabs />;
    case 'parent': return <ParentTabs />;
    case 'staff': return <StaffTabs />;
    case 'management': return <ManagementTabs />;
    case 'job_provider': return <JobProviderTabs />;
    case 'admin': return <AdminTabs />;
    default: return <StudentTabs />;
  }
}

export function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;

  if (isLoading) {
    return <SplashScreen onFinish={() => {}} />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Home" component={RoleRouter} />
          <Stack.Screen name="StudentResults" component={StudentResultsScreen} />
          <Stack.Screen name="StudentAcademics" component={StudentAcademicsScreen} />
          <Stack.Screen name="StudentExams" component={StudentExamsScreen} />
          <Stack.Screen name="StudentFinance" component={StudentFinanceScreen} />
          <Stack.Screen name="StudentLibrary" component={StudentLibraryScreen} />
          <Stack.Screen name="StudentMessages" component={StudentMessagesScreen} />
          <Stack.Screen name="StudentProfile" component={StudentProfileScreen} />
          <Stack.Screen name="StudentHealth" component={StudentHealthScreen} />
          <Stack.Screen name="StudentSettings" component={StudentSettingsScreen} />
          
          <Stack.Screen name="ParentChildren" component={ParentChildrenScreen} />
          <Stack.Screen name="ParentAssignments" component={ParentAssignmentsScreen} />
          <Stack.Screen name="ParentExams" component={ParentExamsScreen} />
          <Stack.Screen name="ParentHealth" component={ParentHealthScreen} />
          <Stack.Screen name="ParentMessages" component={ParentMessagesScreen} />
          <Stack.Screen name="ParentTransport" component={ParentTransportScreen} />
          <Stack.Screen name="ParentJobs" component={ParentJobsScreen} />
          <Stack.Screen name="ParentProfile" component={ParentProfileScreen} />
          <Stack.Screen name="ParentSettings" component={ParentSettingsScreen} />
          <Stack.Screen name="ParentSupport" component={ParentSupportScreen} />

          <Stack.Screen name="StaffProfile" component={StaffProfileScreen} />
          <Stack.Screen name="StaffSettings" component={StaffSettingsScreen} />
          <Stack.Screen name="StaffMessages" component={StaffMessagesScreen} />
          <Stack.Screen name="StaffNotifications" component={StaffNotificationsScreen} />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}
