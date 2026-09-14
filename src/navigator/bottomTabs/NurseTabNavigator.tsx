import { Colors, FontWeight } from '../../constants/theme';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import {
  Syringe,
  Users,
  Clock3,
  CalendarDays,
  Award,
} from 'lucide-react-native';
import NursePatients from '../../screens/admin/nursing/nursingDashboard/NursePatients';
import NurseEmar from '../../screens/admin/nursing/nursingDashboard/NurseEmar';
import NurseShift from '../../screens/admin/nursing/nursingDashboard/NurseShift';
import NurseCompliance from '../../screens/admin/nursing/nursingDashboard/NurseCompliance';
import NurseLeave from '../../screens/admin/nursing/nursingDashboard/NurseLeave';

const Tab = createBottomTabNavigator();

const NurseTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.teal[600],
        tabBarInactiveTintColor: Colors.neutral[400],
        tabBarStyle: {
          backgroundColor: Colors.neutral[0],
          borderTopColor: Colors.neutral[200],
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: FontWeight.semibold },
      }}
    >
      <Tab.Screen
        name="NursePatients"
        component={NursePatients}
        options={{
          title: 'Patients',
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />,
        }}
      />

      <Tab.Screen
        name="NurseEmar"
        component={NurseEmar}
        options={{
          title: 'eMAR',
          tabBarIcon: ({ color, size }) => (
            <Syringe size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="NurseShift"
        component={NurseShift}
        options={{
          title: 'Shift / SBAR',
          tabBarIcon: ({ color, size }) => <Clock3 size={size} color={color} />,
        }}
      />

      <Tab.Screen
        name="NurseLeave"
        component={NurseLeave}
        options={{
          title: 'Leave & Swap',
          tabBarIcon: ({ color, size }) => (
            <CalendarDays size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="NurseCompliance"
        component={NurseCompliance}
        options={{
          title: 'Compliance',
          tabBarIcon: ({ color, size }) => <Award size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default NurseTabNavigator;
