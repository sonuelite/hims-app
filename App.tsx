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
import { AppProvider } from './src/context/AppContext';


// const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({});