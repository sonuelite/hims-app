import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SplashScreen from '../screens/auth/splashScreen/SplashScreen';
import Welcome from '../screens/auth/welcome/Welcome';
import LoginScreen from '../screens/auth/signIn/LoginScreen';
import Signup from '../screens/auth/signup/Signup';
import BottomTabNavigator from './BottomTabNavigator';
import Otp from '../screens/auth/otp/Otp';
import AdminBottomTabNavigator from './AdminBottomTabNavigator';
import PatientOnboardingScreen from '../screens/admin/patientOnboardScreen/PatientOnboardingScreen';
import Nursing from '../screens/admin/nursing/Nursing';
import HouseKeeping from '../screens/admin/houseKeeping/HouseKeeping';
import PharmacyOPD from '../screens/admin/pharmacyOPD/PharmacyOPD';
import PharmacyIPD from '../screens/admin/pharmacyIPD/PharmacyIPD';
import Inventory from '../screens/admin/inventory/Inventory';
import Hr from '../screens/admin/hr/Hr';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
    return (
        <Stack.Navigator initialRouteName='SplashScreen' screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="SplashScreen"
                component={SplashScreen}
            />
            <Stack.Screen
                name="Welcome"
                component={Welcome}
            />
            <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
            />
            <Stack.Screen
                name="Signup"
                component={Signup}
            />
            <Stack.Screen
                name='Otp'
                component={Otp}
            />
            {/* Bottom Tab Navigation */}
            <Stack.Screen
                name="PatientTabs"
                component={BottomTabNavigator}
            />
            <Stack.Screen
                name="AdminTabs"
                component={AdminBottomTabNavigator}
            />
            <Stack.Screen
                name="PatientOnboardingScreen"
                component={PatientOnboardingScreen}
            />
            <Stack.Screen
                name="Nursing"
                component={Nursing}
            />
            <Stack.Screen
                name="HouseKeeping"
                component={HouseKeeping}
            />
            <Stack.Screen
                name="PharmacyOPD"
                component={PharmacyOPD}
            />
            <Stack.Screen
                name="PharmacyIPD"
                component={PharmacyIPD}
            />
            <Stack.Screen
                name="Inventory"
                component={Inventory}
            />
            <Stack.Screen
                name="Hr"
                component={Hr}
            />

        </Stack.Navigator>
    )
}

export default StackNavigator

const styles = StyleSheet.create({})