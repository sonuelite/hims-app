import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import {
  LayoutDashboard,
  Users,
  Activity,
  BarChart3,
  MoreHorizontal,
} from 'lucide-react-native';

import { Colors } from '../constants/theme';
import AdminDashboardScreen from '../screens/admin/home/AdminDashboardScreen';
import AdminPatientsScreen from '../screens/admin/patients/AdminPatientsScreen';
import AdminOperationsScreen from '../screens/admin/operations/AdminOperationsScreen';
import AdminReportsScreen from '../screens/admin/reports/AdminReportsScreen';
import AdminMoreScreen from '../screens/admin/more/AdminMoreScreen';

// import AdminDashboardScreen from '../screens/admin/dashboard/AdminDashboardScreen';
// import AdminPatientsScreen from '../screens/admin/patients/AdminPatientsScreen';
// import AdminOperationsScreen from '../screens/admin/operations/AdminOperationsScreen';
// import AdminReportsScreen from '../screens/admin/reports/AdminReportsScreen';
// import AdminMoreScreen from '../screens/admin/more/AdminMoreScreen';

const Tab = createBottomTabNavigator();

const AdminBottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: Colors.primary[600],
        tabBarInactiveTintColor: Colors.neutral[400],

        tabBarStyle: {
          backgroundColor: Colors.neutral[0],
          borderTopColor: Colors.neutral[100],
          height: 60,
          paddingBottom: 8,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <LayoutDashboard size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="AdminPatients"
        component={AdminPatientsScreen}
        options={{
          title: 'Patients',
          tabBarIcon: ({ color, size }) => (
            <Users size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="AdminOperations"
        component={AdminOperationsScreen}
        options={{
          title: 'Operations',
          tabBarIcon: ({ color, size }) => (
            <Activity size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="AdminReports"
        component={AdminReportsScreen}
        options={{
          title: 'Reports',
          tabBarIcon: ({ color, size }) => (
            <BarChart3 size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="AdminMore"
        component={AdminMoreScreen}
        options={{
          title: 'More',
          tabBarIcon: ({ color, size }) => (
            <MoreHorizontal size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AdminBottomTabNavigator;