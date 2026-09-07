import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Home, CalendarDays, FileText, Video, User } from 'lucide-react-native';

import { Colors } from '../constants/theme';
import Appointments from '../screens/patient/appointments/Appointments';
import Records from '../screens/patient/records/Records';
import Consult from '../screens/patient/consult/Consult';
import Profile from '../screens/patient/profile/Profile';
import HomeScreen from '../screens/patient/home/HomeScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,

        // tabBarActiveTintColor: Colors.primary[600],
        // tabBarInactiveTintColor: Colors.neutral[400],

        // tabBarStyle: {
        //   backgroundColor: Colors.neutral[0],
        //   borderTopColor: Colors.neutral[100],
        //   height: 60,
        //   paddingBottom: 8,
        // },

        // tabBarLabelStyle: {
        //   fontSize: 11,
        //   fontWeight: '600',
        // },
      }}
    >
      <Tab.Screen
        name="index"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="appointments"
        component={Appointments}
        options={{
          title: 'Appointment',
          tabBarIcon: ({ color, size }) => (
            <CalendarDays size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="records"
        component={Records}
        options={{
          title: 'Records',
          tabBarIcon: ({ color, size }) => (
            <FileText size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="consult"
        component={Consult}
        options={{
          title: 'Consult',
          tabBarIcon: ({ color, size }) => (
            <Video size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="profile"
        component={Profile}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;

const styles = StyleSheet.create({});