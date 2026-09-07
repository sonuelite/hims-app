import React, { useEffect, useRef } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Animated,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types';
import { Colors } from '../../../constants/theme';
import { scale } from '../../../utils/scale';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SplashScreen'
>;

const SplashScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const scaleAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 1500, // slower animation
      useNativeDriver: true,
    }).start();
  
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 2000);
  
    return () => clearTimeout(timer);
  }, [navigation, scaleAnim]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../../assets/image/himsLogo.png')}
        style={[
          styles.logo,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[0],
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    width: scale(150),
    height: scale(150),
  },
});