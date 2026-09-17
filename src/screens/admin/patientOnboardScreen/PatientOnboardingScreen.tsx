import React, { useEffect, useRef, useState } from 'react';
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
  FileUp,
  FileText,
} from 'lucide-react-native';

import { useApp } from '../../../context/AppContext';
import {
  AbhaProfile,
  parseAbhaProfiles,
} from '../../../utils/patientAbhaProfiles';

import {
  searchPatientProfile,
  createPatient,
  getAllActiveCountry,
  getStatesByCountryId,
  getCitiesByStateId,
} from '../../../network/api';
import {
  normalizePatientStates,
  PatientStateOption,
} from '../../../utils/patientStateOptions';
import {
  normalizePatientCities,
  PatientCityOption,
} from '../../../utils/patientCityOptions';

import CustomButton from '../../../components/customButton/CustomButton';
import { scale } from '../../../utils/scale';
import { Fontconstants } from '../../../constants/fontConstants';
import { ColorConstants } from '../../../constants/colorConstants';
import CustomDropdown from '../../../components/customDropdown/CustomDropdown';

import { pick, types, isCancel } from '@react-native-documents/picker';

type RootStackParamList = {
  PatientOnboarding: undefined;

  PatientDetail: {
    patientId: string;
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const GENDERS = ['Male', 'Female', 'Other'] as const;

const TITLE_OPTIONS = ['Mr', 'Ms', 'Mrs'];
const PANEL_OPTIONS = ['Yes', 'No'];

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

  const [mode, setMode] = useState<'manual' | 'abha'>('manual');

  const [abhaMobile, setAbhaMobile] = useState('');
  const abhaRequest = useRef<AbortController | null>(null);
  const [abhaProfiles, setAbhaProfiles] = useState<AbhaProfile[]>([]);
  const [selectedAbha, setSelectedAbha] = useState<AbhaProfile | null>(null);
  useEffect(() => () => abhaRequest.current?.abort(), []);
  const [abhaVerifying, setAbhaVerifying] = useState(false);
  const [abhaVerified, setAbhaVerified] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');

  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');

  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [cityId, setCityId] = useState('');
  const [cities, setCities] = useState<PatientCityOption[]>([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [cityError, setCityError] = useState('');
  const [cityRetry, setCityRetry] = useState(0);
  const [state, setState] = useState('');
  const [stateId, setStateId] = useState('');
  const [states, setStates] = useState<PatientStateOption[]>([]);
  const [stateLoading, setStateLoading] = useState(false);
  const [stateError, setStateError] = useState('');
  const [stateRetry, setStateRetry] = useState(0);
  const [area, setArea] = useState('');
  const [pincode, setPincode] = useState('');

  const [phone, setPhone] = useState('');

  const [title, setTitle] = useState('Mr');
  const [panelVal, setPanelVal] = useState('');
  const [selectedPdf, setSelectedPdf] = useState<{
    uri: string;
    name: string | null;
    type: string | null;
    size: number | null;
  } | null>(null);

  const [selectedConsentPdf, setSelectedConsentPdf] = useState<{
    uri: string;
    name: string | null;
    type: string | null;
    size: number | null;
  } | null>(null);

  /*
   * Country state
   */
  const [country, setCountry] = useState('');
  const [countries, setCountries] = useState<Country[]>([]);
  const [countryLoading, setCountryLoading] = useState(false);
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
    .filter((name): name is string => Boolean(name));

  useEffect(() => {
    const controller = new AbortController();
    setStates([]);
    setState('');
    setStateId('');
    setStateError('');
    setStateLoading(false);
    if (!countryId) {
      return () => controller.abort();
    }

    setStateLoading(true);
    getStatesByCountryId(countryId, controller.signal)
      .then(response => {
        if (!controller.signal.aborted) {
          setStates(normalizePatientStates(response));
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setStateError('Unable to load states. Please try again.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setStateLoading(false);
        }
      });

    return () => controller.abort();
  }, [countryId, stateRetry]);

  useEffect(() => {
    const controller = new AbortController();
    setCity('');
    setCityId('');
    setCities([]);
    setCityError('');
    setCityLoading(false);
    if (!stateId) {
      return () => controller.abort();
    }
    setCityLoading(true);
    getCitiesByStateId(stateId, controller.signal)
      .then(response => {
        if (!controller.signal.aborted) {
          setCities(normalizePatientCities(response));
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setCityError('Unable to load cities. Please try again.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setCityLoading(false);
        }
      });
    return () => controller.abort();
  }, [stateId, countryId, cityRetry]);

  /*
   * Calculate patient age
   */
  // const calculateAge = (dobStr: string) => {
  //   const parts = dobStr.split('-');

  //   if (parts.length !== 3) {
  //     return 0;
  //   }

  //   const year = parseInt(parts[0], 10);
  //   const month = parseInt(parts[1], 10);
  //   const day = parseInt(parts[2], 10);

  //   const birth = new Date(year, month - 1, day);

  //   const diff = Date.now() - birth.getTime();

  //   return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
  // };

  const calculateAge = (dobStr: string) => {
    if (!dobStr) {
      return {
        years: 0,
        months: 0,
        days: 0,
      };
    }

    const [year, month, day] = dobStr.split('-').map(Number);

    const birthDate = new Date(year, month - 1, day);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    // Borrow days from previous month
    if (days < 0) {
      months--;

      const daysInPreviousMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        0,
      ).getDate();

      days += daysInPreviousMonth;
    }

    // Borrow months from previous year
    if (months < 0) {
      years--;
      months += 12;
    }

    return {
      years,
      months,
      days,
    };
  };
  /*
   * Load countries
   */
  useEffect(() => {
    const controller = new AbortController();
    setCountryLoading(true);
    getAllActiveCountry(controller.signal)
      .then(response => {
        if (!controller.signal.aborted) {
          setCountries(Array.isArray(response?.data) ? response.data : []);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setCountries([]);
          showToast('Failed to load countries', 'error');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setCountryLoading(false);
        }
      });
    return () => controller.abort();
  }, [showToast]);

  /*
   * ABHA verification
   */
  const applyAbhaProfile = (profile: AbhaProfile) => {
    setFirstName(profile.firstName);
    setLastName(profile.lastName);
    if (profile.gender) {
      setGender(profile.gender);
    }
    setSelectedAbha(profile);
    setAbhaVerified(profile.verified);
    showToast(
      profile.verified
        ? 'ABHA profile verified. Patient details filled.'
        : 'Patient details filled. This profile is not KYC verified.',
      profile.verified ? 'success' : 'info',
    );
  };
  const verifyAbha = async () => {
    if (abhaRequest.current) {
      return;
    }
    if (!/^[0-9]{10}$/.test(abhaMobile)) {
      showToast('Enter a valid 10-digit mobile number', 'error');
      return;
    }
    const controller = new AbortController();
    abhaRequest.current = controller;
    setAbhaVerifying(true);
    setAbhaVerified(false);
    setSelectedAbha(null);
    setAbhaProfiles([]);
    try {
      const response = await searchPatientProfile(
        { mobile: abhaMobile },
        controller.signal,
      );
      if (controller.signal.aborted) {
        return;
      }
      const profiles = parseAbhaProfiles(response);
      setAbhaProfiles(profiles);
      if (profiles.length === 1) {
        applyAbhaProfile(profiles[0]);
      } else {
        showToast(
          profiles.length
            ? 'Select a patient profile to fill the form.'
            : 'No ABHA profiles found for this mobile number.',
          'info',
        );
      }
    } catch {
      if (!controller.signal.aborted) {
        showToast('Unable to fetch ABHA profiles. Please try again.', 'error');
      }
    } finally {
      if (abhaRequest.current === controller) {
        abhaRequest.current = null;
        setAbhaVerifying(false);
      }
    }
  };

  /*
   * Validate patient form
   */
  // const validate = (): string | null => {
  //   if (!firstName.trim()) {
  //     return 'First name is required';
  //   }

  //   if (!lastName.trim()) {
  //     return 'Last name is required';
  //   }

  //   if (!dob.trim()) {
  //     return 'Date of birth is required';
  //   }

  //   if (!mobile.trim()) {
  //     return 'Mobile number is required';
  //   }

  //   if (!countryId) {
  //     return 'Country is required';
  //   }

  //   if (!stateId || !states.some(item => item.id === stateId)) {
  //     return 'Please select a state for the selected country';
  //   }

  //   if (!cityId || !cities.some(item => item.id === cityId)) {
  //     return 'Please select a city for the selected state';
  //   }

  //   return null;
  // };

  const validateDob = (dob: string): string | null => {
    if (!dob.trim()) return 'Date of birth is required';

    // Must be exactly YYYY-MM-DD
    if (!/^\d{4}-\d{1,2}-\d{1,2}$/.test(dob)) {
      return 'Date of birth must be in YYYY-MM-DD format';
    }

    const [year, month, day] = dob.split('-').map(Number);
    const birthDate = new Date(year, month - 1, day);

    // Check invalid dates like 2026-02-31
    if (
      birthDate.getFullYear() !== year ||
      birthDate.getMonth() !== month - 1 ||
      birthDate.getDate() !== day
    ) {
      return 'Please enter a valid date of birth';
    }

    if (birthDate > new Date()) {
      return 'Date of birth cannot be in the future';
    }

    return null;
  };

  const validate = (): string | null => {
    // Personal Information
    if (!firstName.trim()) {
      return 'First name is required';
    }

    if (!lastName.trim()) {
      return 'Last name is required';
    }

    const dobError = validateDob(dob);
    if (dobError) return dobError;

    if (!mobile.trim()) {
      return 'Mobile number is required';
    }

    // Address
    if (!countryId) {
      return 'Country is required';
    }

    if (!stateId || !states.some(item => item.id === stateId)) {
      return 'Please select a state for the selected country';
    }

    if (!cityId || !cities.some(item => item.id === cityId)) {
      return 'Please select a city for the selected state';
    }

    // Contact Details
    if (!phone.trim()) {
      return 'Contact phone number is required';
    }

    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.length !== 10) {
      return 'Contact phone number must be 10 digits';
    }

    // Email is optional, but validate when entered
    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email.trim())) {
        return 'Please enter a valid email address';
      }
    }

    // Billing And Panel Details
    if (!panelVal) {
      return 'Please select whether panel is required';
    }

    if (panelVal === 'Yes' && !selectedPdf) {
      return 'Panel PDF is required when panel is selected';
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

        // age: `${age} years 0 months 0 days`,
        age: `${age.years} years ${age.months} months ${age.days} days`,

        gender,

        phone: mobile.trim(),

        consentRequired: 'No',

        address: address.trim(),

        /*
         * Use selected country ID
         */
        countryId,

        stateId,

        cityId,

        typeReference: 'NONE',

        trusteeStaff: 'OTHER',

        contacts: [
          {
            phone: phone.trim(),
            email: email.trim(),
            is_primary: true,
          },
        ],
      };

      console.log('Create Patient Data:', patientData);

      const result = await createPatient(patientData);

      console.log('Patient Created:', result);

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
        navigation.replace('PatientDetail', {
          patientId: String(patientId),
        });
      }
    } catch (error: any) {
      console.log(
        'Create Patient Error:',
        error?.response?.data || error?.message,
      );

      showToast(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          'Failed to register patient',
        'error',
      );
    }
  };

  const handlePdfUpload = async () => {
    try {
      const [file] = await pick({
        type: [types.pdf],
        allowMultiSelection: false,
      });

      console.log('Selected PDF:', file);

      setSelectedPdf({
        uri: file.uri,
        name: file.name,
        type: file.type,
        size: file.size,
      });

      showToast('PDF selected successfully', 'success');
    } catch (error) {
      if (isCancel(error)) {
        console.log('PDF selection cancelled');
        return;
      }

      console.log('PDF Picker Error:', error);
      showToast('Failed to select PDF', 'error');
    }
  };

  const handleConsentUpload = async () => {
    try {
      const [file] = await pick({
        type: [types.pdf],
        allowMultiSelection: false,
      });

      console.log('Selected Consent PDF:', file);

      setSelectedConsentPdf({
        uri: file.uri,
        name: file.name,
        type: file.type,
        size: file.size,
      });

      showToast('Consent PDF selected successfully', 'success');
    } catch (error) {
      if (isCancel(error)) {
        console.log('Consent PDF selection cancelled');
        return;
      }

      console.log('Consent PDF Picker Error:', error);
      showToast('Failed to select consent PDF', 'error');
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Patient Onboarding" showBack />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Mode Selector */}

        <View style={styles.modeRow}>
          <TouchableOpacity
            style={[styles.modeBtn, mode === 'manual' && styles.modeBtnActive]}
            onPress={() => setMode('manual')}
            activeOpacity={0.8}
          >
            <UserPlus
              size={20}
              color={
                mode === 'manual' ? Colors.primary[700] : Colors.neutral[400]
              }
            />

            <Text
              style={[
                styles.modeText,
                mode === 'manual' && styles.modeTextActive,
              ]}
            >
              Manual Entry
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modeBtn, mode === 'abha' && styles.modeBtnActive]}
            onPress={() => setMode('abha')}
            activeOpacity={0.8}
          >
            <Shield
              size={20}
              color={
                mode === 'abha' ? Colors.primary[700] : Colors.neutral[400]
              }
            />

            <Text
              style={[
                styles.modeText,
                mode === 'abha' && styles.modeTextActive,
              ]}
            >
              ABHA
            </Text>
          </TouchableOpacity>
        </View>

        {/* ABHA */}

        {mode === 'abha' && (
          <Card style={styles.abhaCard}>
            <View style={styles.abhaHeader}>
              <Shield size={24} color={Colors.success[600]} />

              <View style={styles.abhaHeaderText}>
                <Text style={styles.abhaTitle}>
                  Ayushman Bharat Health Account
                </Text>

                <Text style={styles.abhaSub}>
                  Enter the linked mobile number to find and auto-fill an ABHA
                  profile
                </Text>
              </View>
            </View>

            <Input
              label="ABHA-linked Mobile Number"
              value={abhaMobile}
              onChangeText={text => {
                abhaRequest.current?.abort();
                abhaRequest.current = null;
                setAbhaVerifying(false);
                setAbhaMobile(text.replace(/[^0-9]/g, '').slice(0, 10));
                setAbhaProfiles([]);
                setSelectedAbha(null);

                setAbhaVerified(false);
              }}
              placeholder="Enter 10-digit mobile number"
              keyboardType="numeric"
              icon={<ScanLine size={20} color={Colors.neutral[400]} />}
            />

            {abhaProfiles.length > 1 &&
              abhaProfiles.map(profile => (
                <TouchableOpacity
                  key={profile.index}
                  accessibilityRole="radio"
                  accessibilityState={{
                    checked: selectedAbha?.index === profile.index,
                  }}
                  onPress={() => applyAbhaProfile(profile)}
                  style={styles.verifiedBox}
                >
                  <Text style={styles.verifiedText}>
                    {selectedAbha?.index === profile.index ? 'Selected: ' : ''}
                    {profile.firstName} {profile.lastName} ?{' '}
                    {profile.abhaNumber}
                    {profile.verified
                      ? ' ? KYC verified'
                      : ' ? KYC not verified'}
                  </Text>
                </TouchableOpacity>
              ))}
            {selectedAbha && (
              <Text style={styles.abhaSub}>
                ABHA: {selectedAbha.abhaNumber}
              </Text>
            )}
            {abhaVerified && (
              <View style={styles.verifiedBox}>
                <CheckCircle size={18} color={Colors.success[600]} />

                <Text style={styles.verifiedText}>
                  ABHA verified - Patient data fetched
                </Text>
              </View>
            )}

            <Button
              label={abhaVerifying ? 'Verifying...' : 'Verify ABHA'}
              onPress={verifyAbha}
              loading={abhaVerifying}
              disabled={abhaVerifying || abhaVerified}
              variant={abhaVerified ? 'success' : 'primary'}
              fullWidth
              icon={
                abhaVerified ? (
                  <CheckCircle size={18} color="#fff" />
                ) : undefined
              }
            />
          </Card>
        )}

        {/* Personal Information */}

        <Text style={styles.sectionTitle}>Personal Information</Text>

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

          <Text style={styles.fieldLabel}>Gender</Text>

          <View style={styles.chipRow}>
            {GENDERS.map(item => (
              <Chip
                key={item}
                label={item}
                selected={gender === item}
                onPress={() => setGender(item)}
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

        <Text style={styles.sectionTitle}>Address</Text>

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
              if (selectedCountry !== country) {
                setState('');
                setStateId('');
                setStates([]);
                setCity('');
                setCityId('');
                setCities([]);
              }
              /*
               * Set country name
               */
              setCountry(selectedCountry);

              /*
               * Find complete API object
               */
              const selectedCountryData = countries.find(
                item => item.countryss_name === selectedCountry,
              );

              if (selectedCountryData) {
                /*
                 * API field:
                 * countryss_id
                 */
                const selectedId = selectedCountryData.countryss_id;

                setCountryId(String(selectedId ?? ''));

                console.log('Selected Country:', selectedCountryData);

                console.log(
                  'Selected Country Name:',
                  selectedCountryData.countryss_name,
                );

                console.log('Selected Country ID:', selectedId);
              }
            }}
          />

          <CustomDropdown
            label="State *"
            value={state}
            options={states.map(item => item.name)}
            disabled={!countryId || stateLoading || states.length === 0}
            placeholder={
              !countryId
                ? 'Select country first'
                : stateLoading
                ? 'Loading states...'
                : stateError
                ? 'Unable to load states'
                : states.length === 0
                ? 'No states found'
                : 'Select state'
            }
            onSelect={selectedName => {
              const selectedState = states.find(
                item => item.name === selectedName,
              );
              setState(selectedState?.name || '');
              setStateId(selectedState?.id || '');
              if (selectedState?.id !== stateId) {
                setCity('');
                setCityId('');
                setCities([]);
              }
            }}
          />
          {!!stateError && (
            <View>
              <Text accessibilityRole="alert">{stateError}</Text>
              <Button
                label="Retry loading states"
                onPress={() => setStateRetry(value => value + 1)}
              />
            </View>
          )}

          <CustomDropdown
            label="City *"
            value={city}
            options={cities.map(item => item.name)}
            disabled={!stateId || cityLoading || cities.length === 0}
            placeholder={
              !stateId
                ? 'Select state first'
                : cityLoading
                ? 'Loading cities...'
                : cityError
                ? 'Unable to load cities'
                : cities.length === 0
                ? 'No cities found'
                : 'Select city'
            }
            onSelect={selectedName => {
              const selectedCity = cities.find(
                item => item.name === selectedName,
              );
              setCity(selectedCity?.name || '');
              setCityId(selectedCity?.id || '');
            }}
          />
          {!!cityError && (
            <View>
              <Text accessibilityRole="alert">{cityError}</Text>
              <Button
                label="Retry loading cities"
                onPress={() => setCityRetry(value => value + 1)}
              />
            </View>
          )}

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

        <Text style={styles.sectionTitle}>Contact Details</Text>

        <Card style={styles.formCard}>
          {/* <Input
            label="Phone *"
            value={phone}
            onChangeText={setPhone}
            placeholder="+91 XXXXX XXXXX"
            keyboardType="phone-pad"
          /> */}
          <Input
            label="Phone *"
            value={phone}
            onChangeText={text => {
              const numericValue = text.replace(/[^0-9]/g, '');

              if (numericValue.length <= 10) {
                setPhone(numericValue);
              }
            }}
            placeholder="Enter 10-digit phone number"
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

        {/* Billing And Panel Details */}

        <Text style={styles.sectionTitle}>Billing And Panel Details</Text>

        <Card style={styles.formCard}>
          <CustomDropdown
            label="Panel Required"
            value={panelVal}
            options={PANEL_OPTIONS}
            placeholder="Select "
            onSelect={setPanelVal}
          />

          {/* {panelVal === 'Yes' && (
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={handlePdfUpload}
            >
              <FileUp size={20} color={Colors.primary[500]} />
              <Text style={styles.uploadPdfTxt}>Upload PDF</Text>
            </TouchableOpacity>
          )} */}
          {panelVal === 'Yes' && (
            <>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handlePdfUpload}
                activeOpacity={0.7}
              >
                <FileUp size={20} color={Colors.primary[500]} />

                <Text style={styles.uploadPdfTxt}>
                  {selectedPdf ? 'Change PDF' : 'Upload PDF'}
                </Text>
              </TouchableOpacity>

              {selectedPdf && (
                <View style={styles.selectedPdfContainer}>
                  <FileText size={18} color={Colors.success[600]} />

                  <View style={styles.pdfInfo}>
                    <Text style={styles.pdfName} numberOfLines={1}>
                      {selectedPdf.name}
                    </Text>

                    {selectedPdf.size != null && (
                      <Text style={styles.pdfSize}>
                        {(selectedPdf.size / 1024 / 1024).toFixed(2)} MB
                      </Text>
                    )}
                  </View>
                </View>
              )}
            </>
          )}
        </Card>

        {/* Consent Details */}
        <Text style={styles.sectionTitle}>Consent Details</Text>

        <Card style={styles.formCard}>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleConsentUpload}
            activeOpacity={0.7}
          >
            <FileUp size={20} color={Colors.primary[500]} />

            <Text style={styles.uploadPdfTxt}>
              {selectedConsentPdf ? 'Change Consent' : 'Upload Consent'}
            </Text>
          </TouchableOpacity>

          {selectedConsentPdf && (
            <View style={styles.selectedPdfContainer}>
              <FileText size={18} color={Colors.success[600]} />

              <View style={styles.pdfInfo}>
                <Text style={styles.pdfName} numberOfLines={1}>
                  {selectedConsentPdf.name}
                </Text>

                {selectedConsentPdf.size != null && (
                  <Text style={styles.pdfSize}>
                    {(selectedConsentPdf.size / 1024 / 1024).toFixed(2)} MB
                  </Text>
                )}
              </View>
            </View>
          )}
        </Card>

        {/* Register */}

        <CustomButton
          disable={false}
          title="Register Patient"
          topHeight={22}
          bgColor={ColorConstants.BTNCOLOR}
          fontsize={14}
          fontfamily={Fontconstants.SEMIBOLD}
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
    backgroundColor: Colors.neutral[50],
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
    paddingVertical: Spacing.md + 2,
    borderRadius: Radius.md,
    backgroundColor: Colors.neutral[0],
    borderWidth: 1.5,
    borderColor: Colors.neutral[200],
    ...Shadows.sm,
  },

  modeBtnActive: {
    borderColor: Colors.primary[500],
    backgroundColor: Colors.primary[50],
  },

  modeText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    color: Colors.neutral[500],
  },

  modeTextActive: {
    color: Colors.primary[700],
    fontWeight: FontWeight.semibold,
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
    fontWeight: FontWeight.bold,
    color: Colors.neutral[900],
  },

  abhaSub: {
    fontSize: FontSize.xs,
    color: Colors.neutral[400],
    marginTop: 2,
  },

  verifiedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.success[50],
    borderRadius: Radius.sm,
    padding: Spacing.sm + 2,
    marginBottom: Spacing.md,
  },

  verifiedText: {
    fontSize: FontSize.sm,
    color: Colors.success[700],
    fontWeight: FontWeight.semibold,
  },

  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.neutral[700],
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },

  formCard: {
    marginBottom: Spacing.md,
  },

  fieldLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.neutral[700],
    marginBottom: Spacing.sm,
  },

  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.md,
  },
  uploadButton: {
    borderColor: Colors.primary[500],
    borderWidth: 1.5,
    flexDirection: 'row',
    paddingHorizontal: Spacing.xs,
    alignSelf: 'flex-start',
    // width: scale(110),
  },
  uploadPdfTxt: {
    color: Colors.primary[500],
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  selectedPdfContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    padding: Spacing.sm,
    borderRadius: Radius.sm,
    backgroundColor: Colors.success[50],
    gap: Spacing.sm,
  },

  pdfInfo: {
    flex: 1,
  },

  pdfName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.neutral[800],
  },

  pdfSize: {
    fontSize: FontSize.xs,
    color: Colors.neutral[500],
    marginTop: 2,
  },
});
