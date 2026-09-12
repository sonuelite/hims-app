import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StackNavigator from './src/navigator/StackNavigator';
import { AppProvider } from './src/context/AppContext';
import { Provider } from 'react-redux';
import { store } from './src/store/store';


// const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <AppProvider>
          <NavigationContainer>
            <StackNavigator />
          </NavigationContainer>
        </AppProvider>
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({});