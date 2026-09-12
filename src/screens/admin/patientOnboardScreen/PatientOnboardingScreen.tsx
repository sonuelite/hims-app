import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  Colors,
  Spacing,
  FontSize,
  FontWeight,
  Radius,
  Shadows,
} from '../../../constants/theme';

import { ScreenHeader } from '../../../components/screenHeader/ScreenHeader';
import { Input, Chip } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

import {
  UserPlus,
  ScanLine,
  CheckCircle,
  Shield,
} from 'lucide-react-native';

import { useApp } from '../../../context/AppContext';
import type { Patient } from '../../../types';

import {
  createPatient,
  getAllActiveCountry,
} from '../../../network/api';

import CustomButton from '../../../components/customButton/CustomButton';
import { scale } from '../../../utils/scale';
import { Fontconstants } from '../../../constants/fontConstants';
import { ColorConstants } from '../../../constants/colorConstants';
import CustomDropdown from '../../../components/customDropdown/CustomDropdown';

import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';

type RootStackParamList = {
  PatientOnboarding: undefined;

  PatientDetail: {
    patientId: string;
  };
};

type NavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

const GENDERS = ['Male', 'Female', 'Other'] as const;

const TITLE_OPTIONS = ['Mr', 'Ms', 'Mrs'];

interface Country {
  country_code?: string;
  countryss_id?: number | string;
  countryss_name?: string;
  phone_code?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  filter_status?: string;
}

export default function PatientOnboardingScreen() {
  const navigation = useNavigation<NavigationProp>();

  const { showToast } = useApp();

  /*
   * Get access token from Redux
   */
  const accessToken = useSelector(
    (state: RootState) => state.auth.accessToken,
  );

  console.log(
    'accessTokenFromRedux-->',
    accessToken,
  );

  const [mode, setMode] =
    useState<'manual' | 'abha'>('manual');

  const [abhaNumber, setAbhaNumber] = useState('');
  const [abhaVerifying, setAbhaVerifying] =
    useState(false);
  const [abhaVerified, setAbhaVerified] =
    useState(false);

  const [abhaData, setAbhaData] =
    useState<Partial<Patient> | null>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');

  const [gender, setGender] =
    useState<'Male' | 'Female' | 'Other'>('Male');

  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [bloodGroup, setBloodGroup] =
    useState('O+');

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [area, setArea] = useState('');
  const [pincode, setPincode] = useState('');

  const [phone, setPhone] = useState('');

  const [title, setTitle] = useState('Mr');

  /*
   * Country state
   */
  const [country, setCountry] = useState('');
  const [countries, setCountries] =
    useState<Country[]>([]);
  const [countryLoading, setCountryLoading] =
    useState(false);
  const [countryId, setCountryId] = useState('');

  /*
   * Convert API country data into dropdown options.
   *
   * API:
   * countryss_name: "India"
   *
   * Result:
   * ["India"]
   */
  const countryOptions = countries
    .map(item => item.countryss_name)
    .filter(
      (name): name is string =>
        Boolean(name),
    );

  /*
   * Calculate patient age
   */
  const calculateAge = (dobStr: string) => {
    const parts = dobStr.split('-');

    if (parts.length !== 3) {
      return 0;
    }

    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    const birth = new Date(
      year,
      month - 1,
      day,
    );

    const diff =
      Date.now() - birth.getTime();

    return Math.floor(
      diff /
        (365.25 *
          24 *
          60 *
          60 *
          1000),
    );
  };

  /*
   * Load countries
   */
  useEffect(() => {
    if (!accessToken) {
      console.log(
        'Access token not available yet',
      );
      return;
    }

    loadCountries();
  }, [accessToken]);

  const loadCountries = async () => {
    try {
      console.log('loadCountries try');

      setCountryLoading(true);

      /*
       * Use access token directly from Redux
       */
      console.log(
        'Access token -->',
        accessToken,
      );

      const response =
        await getAllActiveCountry(
          accessToken || '',
        );

      console.log(
        'Country API Response:',
        response,
      );

      /*
       * Your API response is:
       *
       * {
       *   code: 200,
       *   message: "...",
       *   data: [
       *     {
       *       countryss_id: 101,
       *       countryss_name: "India"
       *     }
       *   ]
       * }
       */

      const countryList =
        response?.data || [];

      if (Array.isArray(countryList)) {
        setCountries(countryList);
      } else {
        setCountries([]);
      }
    } catch (error: any) {
      console.log(
        'Country Load Error:',
        error?.response?.data ||
          error?.message,
      );

      setCountries([]);

      showToast(
        'Failed to load countries',
        'error',
      );
    } finally {
      setCountryLoading(false);
    }
  };

  /*
   * ABHA verification
   */
  const verifyAbha = () => {
    if (abhaNumber.length < 14) {
      showToast(
        'ABHA number must be 14 digits',
        'error',
      );

      return;
    }

    setAbhaVerifying(true);

    setTimeout(() => {
      setAbhaVerifying(false);
      setAbhaVerified(true);

      const mockData: Partial<Patient> = {
        name: 'Aditya Verma',
        dob: '1990-05-12',
        gender: 'Male',
        mobile: '+91 98765 12345',
        email: 'aditya.verma@abdm.gov.in',
        bloodGroup: 'B+',
        address: 'No. 45, Brigade Road',
        city: 'Bengaluru',
        state: 'Karnataka',
      };

      setAbhaData(mockData);

      setDob(mockData.dob || '');

      setGender(
        mockData.gender || 'Male',
      );

      setMobile(
        mockData.mobile || '',
      );

      setEmail(
        mockData.email || '',
      );

      setBloodGroup(
        mockData.bloodGroup || 'O+',
      );

      setAddress(
        mockData.address || '',
      );

      setCity(
        mockData.city || '',
      );

      setState(
        mockData.state || '',
      );

      showToast(
        'ABHA verified successfully',
        'success',
      );
    }, 1500);
  };

  /*
   * Validate patient form
   */
  const validate = (): string | null => {
    if (!firstName.trim()) {
      return 'First name is required';
    }

    if (!lastName.trim()) {
      return 'Last name is required';
    }

    if (!dob.trim()) {
      return 'Date of birth is required';
    }

    if (!mobile.trim()) {
      return 'Mobile number is required';
    }

    if (!countryId) {
      return 'Country is required';
    }

    return null;
  };

  /*
   * Register patient
   */
  const handleRegister = async () => {
    const error = validate();

    if (error) {
      showToast(error, 'error');
      return;
    }

    try {
      const age = calculateAge(dob);

      const patientData = {
        title,

        firstName: firstName.trim(),

        lastName: lastName.trim(),

        dob,

        age: `${age} years 0 months 0 days`,

        gender,

        phone: mobile.trim(),

        consentRequired: 'No',

        address: address.trim(),

        /*
         * Use selected country ID
         */
        countryId,

        /*
         * Keep these until State/City APIs
         * are connected.
         */
        stateId: '38',

        cityId: '1401',

        typeReference: 'NONE',

        trusteeStaff: 'OTHER',

        contacts: [
          {
            phone: mobile.trim(),
            email: email.trim(),
            is_primary: true,
          },
        ],
      };

      console.log(
        'Create Patient Data:',
        patientData,
      );

      const result =
        await createPatient(
          patientData,
        );

      console.log(
        'Patient Created:',
        result,
      );

      showToast(
        `Patient ${firstName} ${lastName} registered successfully`,
        'success',
      );

      const patientId =
        result?.id ||
        result?.patientId ||
        result?.data?.id ||
        result?.data?.patientId;

      if (patientId) {
        navigation.replace(
          'PatientDetail',
          {
            patientId: String(patientId),
          },
        );
      }
    } catch (error: any) {
      console.log(
        'Create Patient Error:',
        error?.response?.data ||
          error?.message,
      );

      showToast(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          'Failed to register patient',
        'error',
      );
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Patient Onboarding"
        showBack
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Mode Selector */}

        <View style={styles.modeRow}>
          <TouchableOpacity
            style={[
              styles.modeBtn,
              mode === 'manual' &&
                styles.modeBtnActive,
            ]}
            onPress={() =>
              setMode('manual')
            }
            activeOpacity={0.8}
          >
            <UserPlus
              size={20}
              color={
                mode === 'manual'
                  ? Colors.primary[700]
                  : Colors.neutral[400]
              }
            />

            <Text
              style={[
                styles.modeText,
                mode === 'manual' &&
                  styles.modeTextActive,
              ]}
            >
              Manual Entry
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeBtn,
              mode === 'abha' &&
                styles.modeBtnActive,
            ]}
            onPress={() =>
              setMode('abha')
            }
            activeOpacity={0.8}
          >
            <Shield
              size={20}
              color={
                mode === 'abha'
                  ? Colors.primary[700]
                  : Colors.neutral[400]
              }
            />

            <Text
              style={[
                styles.modeText,
                mode === 'abha' &&
                  styles.modeTextActive,
              ]}
            >
              ABHA
            </Text>
          </TouchableOpacity>
        </View>

        {/* ABHA */}

        {mode === 'abha' && (
          <Card style={styles.abhaCard}>
            <View
              style={styles.abhaHeader}
            >
              <Shield
                size={24}
                color={
                  Colors.success[600]
                }
              />

              <View
                style={
                  styles.abhaHeaderText
                }
              >
                <Text
                  style={styles.abhaTitle}
                >
                  Ayushman Bharat Health
                  Account
                </Text>

                <Text
                  style={styles.abhaSub}
                >
                  Enter the 14-digit ABHA
                  number to auto-fill
                  patient details
                </Text>
              </View>
            </View>

            <Input
              label="ABHA Number"
              value={abhaNumber}
              onChangeText={text => {
                setAbhaNumber(
                  text.replace(
                    /[^0-9]/g,
                    '',
                  ),
                );

                setAbhaVerified(false);
              }}
              placeholder="Enter 14-digit ABHA number"
              keyboardType="numeric"
              icon={
                <ScanLine
                  size={20}
                  color={
                    Colors.neutral[400]
                  }
                />
              }
            />

            {abhaVerified && (
              <View
                style={
                  styles.verifiedBox
                }
              >
                <CheckCircle
                  size={18}
                  color={
                    Colors.success[600]
                  }
                />

                <Text
                  style={
                    styles.verifiedText
                  }
                >
                  ABHA verified - Patient
                  data fetched
                </Text>
              </View>
            )}

            <Button
              label={
                abhaVerifying
                  ? 'Verifying...'
                  : 'Verify ABHA'
              }
              onPress={verifyAbha}
              loading={abhaVerifying}
              disabled={abhaVerified}
              variant={
                abhaVerified
                  ? 'success'
                  : 'primary'
              }
              fullWidth
              icon={
                abhaVerified ? (
                  <CheckCircle
                    size={18}
                    color="#fff"
                  />
                ) : undefined
              }
            />
          </Card>
        )}

        {/* Personal Information */}

        <Text
          style={styles.sectionTitle}
        >
          Personal Information
        </Text>

        <Card style={styles.formCard}>
          <CustomDropdown
            label="Title *"
            value={title}
            options={TITLE_OPTIONS}
            placeholder="Select title"
            onSelect={setTitle}
          />

          <Input
            label="First Name *"
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter first name"
          />

          <Input
            label="Last Name *"
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter last name"
          />

          <Input
            label="Date of Birth (YYYY-MM-DD) *"
            value={dob}
            onChangeText={setDob}
            placeholder="e.g. 1990-05-12"
          />

          <Text
            style={styles.fieldLabel}
          >
            Gender
          </Text>

          <View
            style={styles.chipRow}
          >
            {GENDERS.map(item => (
              <Chip
                key={item}
                label={item}
                selected={
                  gender === item
                }
                onPress={() =>
                  setGender(item)
                }
              />
            ))}
          </View>

          <Input
            label="Phone Number *"
            value={mobile}
            onChangeText={setMobile}
            placeholder="+91 XXXXX XXXXX"
            keyboardType="phone-pad"
          />
        </Card>

        {/* Address */}

        <Text
          style={styles.sectionTitle}
        >
          Address
        </Text>

        <Card style={styles.formCard}>
          <Input
            label="Address"
            value={address}
            onChangeText={setAddress}
            placeholder="Street address"
            multiline
          />

          {/* COUNTRY DROPDOWN */}

          <CustomDropdown
            label="Country *"
            value={country}
            options={countryOptions}
            placeholder={
              countryLoading
                ? 'Loading countries...'
                : countryOptions.length > 0
                ? 'Select country'
                : 'No countries found'
            }
            onSelect={selectedCountry => {
              /*
               * Set country name
               */
              setCountry(
                selectedCountry,
              );

              /*
               * Find complete API object
               */
              const selectedCountryData =
                countries.find(
                  item =>
                    item.countryss_name ===
                    selectedCountry,
                );

              if (
                selectedCountryData
              ) {
                /*
                 * API field:
                 * countryss_id
                 */
                const selectedId =
                  selectedCountryData.countryss_id;

                setCountryId(
                  String(
                    selectedId ?? '',
                  ),
                );

                console.log(
                  'Selected Country:',
                  selectedCountryData,
                );

                console.log(
                  'Selected Country Name:',
                  selectedCountryData.countryss_name,
                );

                console.log(
                  'Selected Country ID:',
                  selectedId,
                );
              }
            }}
          />

          <Input
            label="State"
            value={state}
            onChangeText={setState}
            placeholder="State"
          />

          <Input
            label="City"
            value={city}
            onChangeText={setCity}
            placeholder="City"
          />

          <Input
            label="Area"
            value={area}
            onChangeText={setArea}
            placeholder="Area"
          />

          <Input
            label="Pincode"
            value={pincode}
            onChangeText={setPincode}
            placeholder="Pincode"
            keyboardType="numeric"
          />
        </Card>

        {/* Contact Details */}

        <Text
          style={styles.sectionTitle}
        >
          Contact Details
        </Text>

        <Card style={styles.formCard}>
          <Input
            label="Phone *"
            value={phone}
            onChangeText={setPhone}
            placeholder="+91 XXXXX XXXXX"
            keyboardType="phone-pad"
          />

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="patient@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </Card>

        {/* Register */}

        <CustomButton
          disable={false}
          title="Register Patient"
          topHeight={22}
          bgColor={ColorConstants.BTNCOLOR}
          fontsize={14}
          fontfamily={
            Fontconstants.SEMIBOLD
          }
          bordRadius={scale(12)}
          onPress={handleRegister}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      Colors.neutral[50],
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    padding: Spacing.base,
    paddingBottom: 100,
  },

  modeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },

  modeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical:
      Spacing.md + 2,
    borderRadius: Radius.md,
    backgroundColor:
      Colors.neutral[0],
    borderWidth: 1.5,
    borderColor:
      Colors.neutral[200],
    ...Shadows.sm,
  },

  modeBtnActive: {
    borderColor:
      Colors.primary[500],
    backgroundColor:
      Colors.primary[50],
  },

  modeText: {
    fontSize: FontSize.base,
    fontWeight:
      FontWeight.medium,
    color:
      Colors.neutral[500],
  },

  modeTextActive: {
    color:
      Colors.primary[700],
    fontWeight:
      FontWeight.semibold,
  },

  abhaCard: {
    marginBottom: Spacing.md,
  },

  abhaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },

  abhaHeaderText: {
    flex: 1,
  },

  abhaTitle: {
    fontSize: FontSize.base,
    fontWeight:
      FontWeight.bold,
    color:
      Colors.neutral[900],
  },

  abhaSub: {
    fontSize: FontSize.xs,
    color:
      Colors.neutral[400],
    marginTop: 2,
  },

  verifiedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor:
      Colors.success[50],
    borderRadius: Radius.sm,
    padding:
      Spacing.sm + 2,
    marginBottom: Spacing.md,
  },

  verifiedText: {
    fontSize: FontSize.sm,
    color:
      Colors.success[700],
    fontWeight:
      FontWeight.semibold,
  },

  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight:
      FontWeight.bold,
    color:
      Colors.neutral[700],
    marginBottom:
      Spacing.sm,
    marginTop: Spacing.md,
  },

  formCard: {
    marginBottom: Spacing.md,
  },

  fieldLabel: {
    fontSize: FontSize.sm,
    fontWeight:
      FontWeight.semibold,
    color:
      Colors.neutral[700],
    marginBottom:
      Spacing.sm,
  },

  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom:
      Spacing.md,
  },
});