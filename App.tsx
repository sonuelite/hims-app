import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import Welcome from './src/screens/auth/welcome/Welcome';
// import LoginScreen from './src/screens/auth/signIn/LoginScreen';
// import SplashScreen from './src/screens/auth/splashScreen/SplashScreen';
// import Signup from './src/screens/auth/signup/Signup';
import StackNavigator from './src/navigator/StackNavigator';


// const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {/* <Stack.Navigator initialRouteName='SplashScreen' screenOptions={{ headerShown: false }}>
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
        </Stack.Navigator> */}
        <StackNavigator/>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({});