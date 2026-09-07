import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../types'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  HeartPulse,
  Shield,
  Users,
  Stethoscope,
  ChevronRight,
} from 'lucide-react-native';
// import { Spacing } from '../../../constants/theme';

import {
  Colors,
  Spacing,
  FontSize,
  FontWeight,
  Radius,
  Shadows,
} from '../../../constants/theme';
import { scale } from '../../../utils/scale';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Welcome'
>;
export default function Welcome() {
  // const navigation = useNavigation();
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          {/* <View style={styles.iconCircle}>
            <HeartPulse
              size={40}
              color="#fff"
              strokeWidth={2.5}
            />
          </View> */}
                <Image
        source={require('../../../assets/image/himsLogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

          <Text style={styles.title}>
            Welcome to Zyno HIMS
          </Text>

          <Text style={styles.subtitle}>
            Complete hospital management in your hands.
            Book appointments, consult doctors, access
            records, and manage your healthcare journey.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <View style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <Stethoscope
                size={20}
                color={Colors.primary[600]}
              />
            </View>

            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>
                Expert Consultation
              </Text>

              <Text style={styles.featureDesc}>
                Connect with specialists instantly
              </Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <Shield
                size={20}
                color={Colors.success[600]}
              />
            </View>

            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>
                Secure Records
              </Text>

              <Text style={styles.featureDesc}>
                Your health data, always protected
              </Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <Users
                size={20}
                color={Colors.accent[600]}
              />
            </View>

            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>
                Family Care
              </Text>

              <Text style={styles.featureDesc}>
                Manage health for your loved ones
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Area */}
      <View
        style={[
          styles.bottomArea,
          {
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
        //   onPress={() => navigation.navigate('RoleSelect' as never)}
          style={styles.getStartedBtn}
        >
          <Text style={styles.getStartedText}>
            Get Started
          </Text>

          <ChevronRight
            size={20}
            color="#fff"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('LoginScreen')}
        >
          <Text style={styles.alreadyText}>
            Already have an account?{' '}
            <Text style={styles.signInText}>
              Sign In
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[0],
  },
  logo: {
    width: scale(60),
    height: scale(60),
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
  },

  hero: {
    alignItems: 'center',
    // paddingTop: Spacing.xxxl + Spacing.xl,
    // paddingTop: Spacing.xxxl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },

  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.md,
  },

  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.neutral[900],
    textAlign: 'center',
    marginTop: scale(24)
  },

  subtitle: {
    fontSize: FontSize.base,
    color: Colors.neutral[500],
    textAlign: 'center',
    marginTop: Spacing.md,
    lineHeight: 24,
    paddingHorizontal: Spacing.md,
  },

  features: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },

  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[50],
    borderRadius: Radius.lg,
    padding: Spacing.base,
    gap: Spacing.md,
  },

  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.neutral[0],
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },

  featureText: {
    flex: 1,
  },

  featureTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.neutral[900],
  },

  featureDesc: {
    fontSize: FontSize.sm,
    color: Colors.neutral[400],
    marginTop: 2,
  },

  bottomArea: {
    paddingHorizontal: Spacing.xl,
    // paddingTop: Spacing.lg,
  },

  getStartedBtn: {
    flexDirection: 'row',
    backgroundColor: Colors.primary[600],
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md + 4,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },

  getStartedText: {
    color: '#fff',
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },

  alreadyText: {
    fontSize: FontSize.sm,
    color: Colors.neutral[500],
    textAlign: 'center',
  },

  signInText: {
    color: Colors.primary[600],
    fontWeight: FontWeight.semibold,
  },
});