import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AdminDashboardScreen } from '../screens/admin/AdminDashboardScreen';
import { AdminSchoolManagementScreen } from '../screens/admin/AdminSchoolManagementScreen';
import { AdminUserManagementScreen } from '../screens/admin/AdminUserManagementScreen';
import { AdminReportsScreen } from '../screens/admin/AdminReportsScreen';
import { AdminSettingsScreen } from '../screens/admin/AdminSettingsScreen';
import { useThemeStore } from '../store/themeStore';
import { lightColors, darkColors } from '../theme';

const Tab = createBottomTabNavigator();

const ICONS: Record<string, { focused: keyof typeof Ionicons.glyphMap; unfocused: keyof typeof Ionicons.glyphMap }> = {
  Dashboard: { focused: 'grid', unfocused: 'grid-outline' },
  Schools: { focused: 'business', unfocused: 'business-outline' },
  Users: { focused: 'people', unfocused: 'people-outline' },
  Reports: { focused: 'bar-chart', unfocused: 'bar-chart-outline' },
  Settings: { focused: 'settings', unfocused: 'settings-outline' },
};

export function AdminTabs() {
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? darkColors : lightColors;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarActiveTintColor: '#6D4CFF',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginTop: -2 },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = ICONS[route.name] || { focused: 'grid', unfocused: 'grid-outline' };
          return <Ionicons name={focused ? icons.focused : icons.unfocused} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={AdminDashboardScreen} />
      <Tab.Screen name="Schools" component={AdminSchoolManagementScreen} />
      <Tab.Screen name="Users" component={AdminUserManagementScreen} />
      <Tab.Screen name="Reports" component={AdminReportsScreen} />
      <Tab.Screen name="Settings" component={AdminSettingsScreen} />
    </Tab.Navigator>
  );
}
