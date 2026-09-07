import React, { useState } from 'react';
import 'react-native-get-random-values';
import CryptoJS from 'crypto-js';
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

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Colors,
  Spacing,
  FontSize,
  FontWeight,
  Radius,
  Shadows,
} from '../../../constants/theme';

import { Input, Chip } from '../../../components/input/Input';


import {
  HeartPulse,
  Mail,
  Phone,
  Lock,
  ChevronLeft,
} from 'lucide-react-native';
import { UserRole } from '../../../types';
import { Button } from '../../../components/button/Button';
import Toast from 'react-native-toast-message';
import { showToast } from '../../../utils/toast';
import type { RootStackParamList } from '../../../types';
import CustomButton from '../../../components/customButton/CustomButton';
import { ColorConstants } from '../../../constants/colorConstants';
import { Fontconstants } from '../../../constants/fontConstants';
import { scale } from '../../../utils/scale';
import BackHeader from '../../../components/backHeader/BackHeader';
import Divider from '../../../components/divider/Divider';
import { loginUser } from '../../../network/api';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'LoginScreen'
>;


export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const insets = useSafeAreaInsets();

  const [mode, setMode] = useState<'email' | 'mobile'>('email');

  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');

  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');

  const [selectedRole, setSelectedRole] =
    useState<UserRole>('patient');

  const navigateAfterLogin = () => {
    if (selectedRole === 'patient') {
      navigation.replace('PatientTabs');
    } else if (selectedRole === 'doctor') {
      navigation.replace('DoctorTabs');
    } else {
      navigation.replace('AdminTabs');
    }
  };

  // const handleLogin = async() => {
  //   console.log("In handleLogin");
    
  //   if (mode === 'email' && !email) {
  //     showToast('Please enter your email', 'error');
  //     return;
  //   }

  //   if (mode === 'mobile' && !mobile) {
  //     showToast('Please enter your mobile number', 'error');
  //     return;
  //   }

  //   if (!password && !showOTP && mode === 'email') {
  //     showToast('Please enter your password', 'error');
  //     return;
  //   }

  //   // OTP verification
  //   if (showOTP) {
  //     if (otp.length !== 4) {
  //       showToast('Please enter the 4-digit OTP', 'error');
  //       return;
  //     }

  //     showToast('Login successful!', 'success');
  //     navigateAfterLogin();
  //     return;
  //   }
  //   // showToast('Login successful!', 'success');
  //   // navigateAfterLogin();
  //     if (mode === 'email') {
  //       console.log("In mode === email");
        
  //   try {
  //     const response = await loginUser({
  //       encryptedEmail: email,
  //       encryptedPassword: password,
  //     });

  //     console.log('LOGIN RESPONSE:', response);

  //     showToast('Login successful!', 'success');

  //     navigateAfterLogin();
  //   } catch (error: any) {
  //     console.log('LOGIN ERROR:', error);

  //     showToast(
  //       error?.response?.data?.message || 'Login failed',
  //       'error'
  //     );
  //   }
  // }
  // };


  // --------------------------------------------------
  // Send OTP
  // --------------------------------------------------

  const handleLogin = async () => {
  console.log('In handleLogin');

  if (mode === 'email' && !email) {
    showToast('Please enter your email', 'error');
    return;
  }

  if (mode === 'mobile' && !mobile) {
    showToast('Please enter your mobile number', 'error');
    return;
  }

  if (!password && !showOTP && mode === 'email') {
    showToast('Please enter your password', 'error');
    return;
  }

  // OTP verification
  if (showOTP) {
    if (otp.length !== 4) {
      showToast('Please enter the 4-digit OTP', 'error');
      return;
    }

    showToast('Login successful!', 'success');
    navigateAfterLogin();
    return;
  }

  // Email login
  if (mode === 'email') {
    console.log('In mode === email');

    try {
      // Same encryption as Angular web application
      const encryptedEmail = CryptoJS.AES.encrypt(
        email,
        'email'
      ).toString();

      const encryptedPassword = CryptoJS.AES.encrypt(
        password,
        'password'
      ).toString();

      console.log('Encrypted Email:', encryptedEmail);
      console.log('Encrypted Password:', encryptedPassword);

      const response = await loginUser({
        encryptedEmail,
        encryptedPassword,
      });

      console.log('LOGIN RESPONSE:', response);

      showToast('Login successful!', 'success');

      navigateAfterLogin();

    } catch (error: any) {
      console.log('LOGIN ERROR:', error);

      showToast(
        error?.response?.data?.message || 'Login failed',
        'error'
      );
    }
  }
};

  const handleSendOTP = () => {
    if (!mobile) {
      showToast('Please enter your mobile number', 'error');
      return;
    }

    setShowOTP(true);

    showToast('OTP sent: 1234 (demo)', 'info');
  };


  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      <BackHeader />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.logoRow}>
        <Image source={require('../../../assets/image/himsLogo.png')}
          style={styles.himsLogoStyle}
          />
          {/* <View style={styles.iconCircle}>
            <HeartPulse
              size={28}
              color="#fff"
              strokeWidth={2.5}
            />
          </View> */}
          {/* <Text style={styles.appName}>
            MediCare
          </Text> */}

        </View>


        {/* Heading */}
        <Text style={styles.title}>
          Sign In
        </Text>

        <Text style={styles.subtitle}>
          Access your healthcare account
        </Text>


        {/* Role Selector */}
        <View style={styles.roleSelector}>

          {(
            ['patient', 'doctor', 'admin'] as UserRole[]
          ).map(role => (

            <Chip
              key={role}
              label={
                role.charAt(0).toUpperCase() +
                role.slice(1)
              }
              selected={selectedRole === role}
              onPress={() => setSelectedRole(role)}
            />

          ))}

        </View>


        {/* Email / Mobile Selector */}
        <View style={styles.modeSelector}>

          <TouchableOpacity
            onPress={() => {
              setMode('email');
              setShowOTP(false);
              setOtp('');
            }}
            style={[
              styles.modeBtn,
              mode === 'email' &&
              styles.modeBtnActive,
            ]}
          >

            <Text
              style={[
                styles.modeText,
                mode === 'email' &&
                styles.modeTextActive,
              ]}
            >
              Email
            </Text>

          </TouchableOpacity>


          <TouchableOpacity
            onPress={() => {
              setMode('mobile');
              setPassword('');
            }}
            style={[
              styles.modeBtn,
              mode === 'mobile' &&
              styles.modeBtnActive,
            ]}
          >

            <Text
              style={[
                styles.modeText,
                mode === 'mobile' &&
                styles.modeTextActive,
              ]}
            >
              Mobile + OTP
            </Text>

          </TouchableOpacity>

        </View>


        {/* Email Login */}
        {mode === 'email' ? (

          <Input
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            // autoCapitalize="none"
            icon={
              <Mail
                size={20}
                color={Colors.neutral[400]}
              />
            }
          />

        ) : (

          <>
            {/* Mobile Number */}

            <Input
              label="Mobile Number"
              value={mobile}
              onChangeText={setMobile}
              placeholder="+91 98765 43210"
              keyboardType="phone-pad"
              icon={
                <Phone
                  size={20}
                  color={Colors.neutral[400]}
                />
              }
            />


            {/* OTP */}

            {showOTP && (

              <Input
                label="Enter OTP"
                value={otp}
                onChangeText={setOtp}
                placeholder="1234"
                keyboardType="numeric"
              // maxLength={4}
              />

            )}

          </>

        )}


        {/* Password */}
        {mode === 'email' && (

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            icon={
              <Lock
                size={20}
                color={Colors.neutral[400]}
              />
            }
          />

        )}


        {/* Forgot Password */}
        <TouchableOpacity
          onPress={() =>
            showToast(
              'Password reset link sent (demo)',
              'info'
            )
          }
        >

          <Text style={styles.forgotText}>
            Forgot Password?
          </Text>

        </TouchableOpacity>


        {/* Send OTP */}
        {mode === 'mobile' && !showOTP && (

          <CustomButton
            disable={false}
            title="Send OTP"
            // width={343}
            topHeight={22}
            bgColor={ColorConstants.BTNCOLOR}
            fontsize={14}
            fontfamily={Fontconstants.SEMIBOLD}
            bordRadius={scale(12)}
            onPress={() => console.log('Send OTP')}
          />

        )}


        <View
          style={{
            height:
              mode === 'mobile' && !showOTP
                ? 0
                : Spacing.md,
          }}
        />


        {/* Email Login Button */}
        {mode === 'email' && (

          <CustomButton
            disable={false}
            title="Sign In"
            // width={343}
            topHeight={22}
            bgColor={ColorConstants.BTNCOLOR}
            fontsize={14}
            fontfamily={Fontconstants.SEMIBOLD}
            bordRadius={scale(12)}
            onPress={handleLogin}
          />
        )}


        {/* OTP Login Button */}
        {showOTP && mode === 'mobile' && (

          // <Button
          //   label="Verify & Login"
          //   onPress={handleLogin}
          //   fullWidth
          //   size="lg"
          // />
          <CustomButton
            disable={false}
            title="Verify & Login"
            // width={343}
            topHeight={22}
            bgColor={ColorConstants.BLACK}
            fontsize={14}
            fontfamily={Fontconstants.SEMIBOLD}
            bordRadius={scale(12)}
            onPress={() => console.log('Verify & Login')}
          />

        )}

        <Divider
          txt='OR'
          topHeight={24}
        />


        {/* Register */}

        <View style={styles.registerView}>
          <Text style={styles.dontAccountTxt}>Don't have an account?{' '}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.registerTxt}>Register</Text>
          </TouchableOpacity>
        </View>


        {/* Guest */}
        {/* <TouchableOpacity
          onPress={() =>
            navigation.navigate('RoleSelect')
          }
          style={styles.demoBtn}
        >

          <Text style={styles.demoBtnText}>
            Continue as Guest (Demo)
          </Text>

        </TouchableOpacity> */}

        <CustomButton
          disable={false}
          title="Continue as Guest (Demo)"
          // width={343}
          topHeight={14}
          bgColor={Colors.neutral[200]}
          txtColor={ColorConstants.BLACK}
          fontsize={14}
          fontfamily={Fontconstants.SEMIBOLD}
          bordRadius={scale(12)}
          onPress={() => console.log('Continue as Guest (Demo)')}
        />
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    paddingHorizontal: scale(24),
    backgroundColor: Colors.neutral[50],
  },

  // backBtn: {
  //   position: 'absolute',
  //   top: 50,
  //   left: Spacing.base,
  //   zIndex: 10,
  //   padding: Spacing.xs,
  // },

  scroll: {
    // padding: Spacing.xl,
    // paddingTop: Spacing.xxxl,
    // paddingHorizontal: scale(24),
  },
  himsLogoStyle: {
    width: scale(60),
    height: scale(60),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  logoRow: {
    // flexDirection: 'row',
    // alignItems: 'center',
    // gap: Spacing.sm,
    // marginBottom: Spacing.xxl,
  },

  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
  },

  appName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.neutral[900],
  },

  title: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    color: Colors.neutral[900],
  },

  subtitle: {
    fontSize: FontSize.base,
    color: Colors.neutral[400],
    marginTop: Spacing.xs,
  },

  roleSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing.lg,
  },

  modeSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral[100],
    borderRadius: Radius.md,
    padding: 3,
    marginVertical: Spacing.md,
  },

  modeBtn: {
    flex: 1,
    paddingVertical: Spacing.md - 2,
    alignItems: 'center',
    borderRadius: Radius.sm,
  },

  modeBtnActive: {
    backgroundColor: Colors.neutral[0],
    ...Shadows.sm,
  },

  modeText: {
    fontSize: FontSize.sm,
    color: Colors.neutral[500],
    fontWeight: FontWeight.medium,
  },

  modeTextActive: {
    color: Colors.primary[700],
    fontWeight: FontWeight.semibold,
  },

  forgotText: {
    fontSize: FontSize.sm,
    color: Colors.primary[600],
    fontWeight: FontWeight.semibold,
    textAlign: 'right',
    marginBottom: Spacing.lg,
  },
  registerView: {
    flexDirection: 'row',
    marginTop: scale(16),
    alignSelf: 'center',
  },
  dontAccountTxt: {
    fontSize: 14,
    fontFamily: Fontconstants.MEDIUM,
    color: ColorConstants.GRAY_Heading,
  },
  registerTxt: {
    fontSize: 14,
    fontFamily: Fontconstants.BOLD,
    color: ColorConstants.BTNCOLOR,
  },

  // demoBtn: {
  //   alignItems: 'center',
  //   padding: Spacing.md,
  //   backgroundColor: Colors.neutral[100],
  //   borderRadius: Radius.md,
  // },

  // demoBtnText: {
  //   fontSize: FontSize.sm,
  //   color: Colors.neutral[600],
  //   fontWeight: FontWeight.medium,
  // },

});