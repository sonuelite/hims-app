import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SplashScreen from '../screens/auth/splashScreen/SplashScreen';
import Welcome from '../screens/auth/welcome/Welcome';
import LoginScreen from '../screens/auth/signIn/LoginScreen';
import Signup from '../screens/auth/signup/Signup';
import BottomTabNavigator from './BottomTabNavigator';
import Otp from '../screens/auth/otp/Otp';

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
        </Stack.Navigator>
    )
}

export default StackNavigator

const styles = StyleSheet.create({})