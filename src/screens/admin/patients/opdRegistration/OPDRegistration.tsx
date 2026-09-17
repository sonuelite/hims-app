import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { isAxiosError } from 'axios';
import { Calendar, ChevronLeft, ChevronRight, User } from 'lucide-react-native';

import {
  getAllPatients,
  getAllDepartments,
  getAllDoctors,
} from '../../../../network/api';
import {
  departmentOptions,
  doctorOptions,
  DepartmentOption,
  DoctorOption,
} from '../../../../utils/opdOptions';
import { Button } from '../../../../components/ui/Button';
import { Card } from '../../../../components/ui/Card';
import { Chip, Input } from '../../../../components/ui/Input';
import {
  Colors,
  FontSize,
  FontWeight,
  Radius,
  Shadows,
  Spacing,
} from '../../../../constants/theme';

type RootStackParamList = {
  OPDRegistration: { patientId?: string } | undefined;
  PatientOnboarding: undefined;
  AppointmentDetail: { id: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'OPDRegistration'>;

type ConsultationType = 'opd' | 'follow-up' | 'online' | 'video' | 'physical';

type Patient = {
  id: string;
  name: string;
  mobile: string;
  gender?: string;
  age?: string | number;
  bloodGroup?: string;
};

const CONSULTATION_TYPES: { label: string; value: ConsultationType }[] = [
  { label: 'OPD', value: 'opd' },
  { label: 'Follow-up', value: 'follow-up' },
  { label: 'Online', value: 'online' },
  { label: 'Video', value: 'video' },
  { label: 'Physical', value: 'physical' },
];

const TIME_SLOTS = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
];

const toPatientList = (response: any): Patient[] => {
  const raw =
    response?.data ?? response?.result ?? response?.patients ?? response;
  if (response?.success === false) {
    throw new Error('Unable to load patients');
  }
  const list = Array.isArray(raw) ? raw : raw?.patients ?? raw?.data;
  if (!Array.isArray(list)) {
    throw new Error('Invalid patient list response');
  }

  return list.map((item: any) => ({
    id: String(item.id ?? item.patient_id ?? item.patientId ?? item.uhid ?? ''),
    name:
      item.name ??
      item.patient_name ??
      item.full_name ??
      [item.firstName ?? item.first_name, item.lastName ?? item.last_name]
        .filter(Boolean)
        .join(' '),
    mobile: String(item.mobile ?? item.phone ?? item.contact_number ?? ''),
    gender: item.gender,
    age: item.age,
    bloodGroup: item.bloodGroup ?? item.blood_group,
  }));
};

export default function OPDRegistration({ navigation }: Props) {
  const [patientResults, setPatientResults] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [mobile, setMobile] = useState('');
  const [searching, setSearching] = useState(true);
  const [patientError, setPatientError] = useState('');
  const [patientRetry, setPatientRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setSearching(true);
    setPatientError('');
    getAllPatients(controller.signal)
      .then(response => {
        if (!controller.signal.aborted) {
          setPatientResults(toPatientList(response));
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setPatientError('Unable to load patients. Please try again.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setSearching(false);
        }
      });
    return () => controller.abort();
  }, [patientRetry]);

  const filteredPatients = useMemo(() => {
    const query = mobile.trim().toLowerCase();
    return patientResults.filter(
      patient =>
        patient.name.toLowerCase().includes(query) ||
        patient.mobile
          .replace(/\D/g, '')
          .includes(query.replace(/\D/g, '') || query),
    );
  }, [mobile, patientResults]);
  const [department, setDepartment] = useState<DepartmentOption | null>(null);
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [departmentLoading, setDepartmentLoading] = useState(true);
  const [departmentError, setDepartmentError] = useState('');
  const [departmentRetry, setDepartmentRetry] = useState(0);
  const [availableDoctors, setAvailableDoctors] = useState<DoctorOption[]>([]);
  const [doctorLoading, setDoctorLoading] = useState(false);
  const [doctorError, setDoctorError] = useState('');
  const [doctorRetry, setDoctorRetry] = useState(0);
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('');
  const [consultationType, setConsultationType] =
    useState<ConsultationType>('opd');
  const [reason, setReason] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setDepartmentLoading(true);
    setDepartmentError('');
    getAllDepartments(1, controller.signal)
      .then(response => {
        if (!controller.signal.aborted) {
          setDepartments(departmentOptions(response));
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setDepartmentError('Unable to load departments. Please try again.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setDepartmentLoading(false);
        }
      });
    return () => controller.abort();
  }, [departmentRetry]);

  useEffect(() => {
    const controller = new AbortController();
    setAvailableDoctors([]);
    setDoctorId('');
    setDoctorError('');
    setDoctorLoading(Boolean(department));
    if (!department) {
      return () => controller.abort();
    }
    getAllDoctors(department.entityId, department.id, controller.signal)
      .then(response => {
        if (!controller.signal.aborted) {
          try {
            setAvailableDoctors(doctorOptions(response));
          } catch {
            setDoctorError(
              'The doctor response could not be read. Please check the returned doctor IDs and names.',
            );
          }
        }
      })
      .catch(error => {
        if (!controller.signal.aborted) {
          const status = isAxiosError(error) ? error.response?.status : undefined;
          setDoctorError(
            status
              ? `Unable to load doctors (HTTP ${status}). Please try again.`
              : 'Unable to reach the doctors API. Please try again.',
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setDoctorLoading(false);
        }
      });
    return () => controller.abort();
  }, [department, doctorRetry]);

  const handleRegister = () => {
    if (!selectedPatient) {
      Alert.alert('Patient required', 'Please select a patient.');
      return;
    }
    if (
      doctorLoading ||
      !availableDoctors.some(doctor => doctor.id === doctorId)
    ) {
      Alert.alert('Doctor required', 'Please select a doctor.');
      return;
    }
    if (!time) {
      Alert.alert('Time required', 'Please select a time slot.');
      return;
    }
    if (!reason.trim()) {
      Alert.alert('Reason required', 'Please enter the reason for visit.');
      return;
    }

    // Call the appointment-registration API here and navigate using its ID.
    Alert.alert('Ready to register', 'Connect the OPD registration API here.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={navigation.goBack}>
          <ChevronLeft size={24} color={Colors.neutral[900]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>OPD Registration</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Select Patient</Text>

        {!selectedPatient ? (
          <Card style={styles.patientSelectionCard}>
            <Input
              label="Search Patients"
              value={mobile}
              onChangeText={setMobile}
              placeholder="Search by name or phone number"
              icon={<User size={20} color={Colors.neutral[400]} />}
            />

            {searching ? (
              <ActivityIndicator
                style={styles.loader}
                color={Colors.primary[600]}
              />
            ) : patientError ? (
              <ScrollView
                style={styles.patientList}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
              >
                <Text style={styles.emptyText} accessibilityRole="alert">
                  {patientError}
                </Text>
                <Button
                  label="Retry"
                  onPress={() => setPatientRetry(value => value + 1)}
                  fullWidth
                />
              </ScrollView>
            ) : (
              <ScrollView
                style={styles.patientList}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator
              >
                {filteredPatients.length === 0 && (
                  <Text style={styles.emptyText}>
                    {patientResults.length
                      ? 'No patients match your search.'
                      : 'No patients available.'}
                  </Text>
                )}
                {filteredPatients.map(patient => (
                  <TouchableOpacity
                    key={`${patient.id}-${patient.mobile}`}
                    accessibilityRole="button"
                    style={styles.patientItem}
                    onPress={() => {
                      setSelectedPatient(patient);
                    }}
                  >
                    <View style={styles.patientItemLeft}>
                      <Text style={styles.patientItemName}>{patient.name}</Text>
                      <Text style={styles.patientItemMeta}>
                        Age: {patient.age ?? 'N/A'} | Phone:{' '}
                        {patient.mobile || 'N/A'}
                      </Text>
                    </View>
                    <ChevronRight size={18} color={Colors.neutral[300]} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            <TouchableOpacity
              style={styles.onboardLink}
              onPress={() => navigation.navigate('PatientOnboarding')}
            >
              <Text style={styles.onboardLinkText}>+ Register New Patient</Text>
            </TouchableOpacity>
          </Card>
        ) : (
          <Card style={styles.selectedPatientCard}>
            <View style={styles.selectedPatientRow}>
              <View style={styles.selectedPatientAvatar}>
                <User size={24} color={Colors.primary[700]} />
              </View>
              <View style={styles.selectedPatientInfo}>
                <Text style={styles.selectedPatientName}>
                  {selectedPatient.name}
                </Text>
                <Text style={styles.selectedPatientMeta}>
                  Age: {selectedPatient.age ?? 'N/A'} | Phone:{' '}
                  {selectedPatient.mobile || 'N/A'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedPatient(null)}>
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}

        <Text style={styles.sectionTitle}>Department</Text>
        {departmentLoading && <ActivityIndicator color={Colors.primary[600]} />}
        {!!departmentError && (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>{departmentError}</Text>
            <Button
              label="Retry Departments"
              onPress={() => setDepartmentRetry(value => value + 1)}
            />
          </Card>
        )}
        {!departmentLoading && !departmentError && !departments.length && (
          <Text style={styles.emptyText}>No departments available.</Text>
        )}
        <View style={styles.chipRow}>
          {departments.map(item => (
            <Chip
              key={item.id}
              label={item.name}
              selected={department?.id === item.id}
              onPress={() => {
                if (department?.id !== item.id) {
                  setAvailableDoctors([]);
                  setDoctorLoading(true);
                  setDoctorError('');
                }
                setDepartment(item);
                setDoctorId('');
              }}
            />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Select Doctor</Text>
        {doctorLoading ? (
          <ActivityIndicator
            style={styles.loader}
            color={Colors.primary[600]}
          />
        ) : doctorError ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>{doctorError}</Text>
            <Button
              label="Retry Doctors"
              onPress={() => setDoctorRetry(value => value + 1)}
            />
          </Card>
        ) : availableDoctors.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              {department
                ? 'No doctors available for ' + department.name + '.'
                : 'Select a department to view doctors.'}
            </Text>
          </Card>
        ) : (
          <View style={styles.doctorList}>
            {availableDoctors.map(doctor => (
              <TouchableOpacity
                key={doctor.id}
                style={[
                  styles.doctorCard,
                  doctorId === doctor.id && styles.doctorCardSelected,
                ]}
                onPress={() => setDoctorId(doctor.id)}
              >
                <View style={styles.doctorInfo}>
                  <Text style={styles.doctorName}>{doctor.name}</Text>
                  {!!doctor.qualification && (
                    <Text style={styles.doctorQual}>
                      {doctor.qualification}
                    </Text>
                  )}
                </View>
                {doctorId === doctor.id && <View style={styles.checkDot} />}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.sectionTitle}>Date & Time</Text>
        <Card style={styles.formCard}>
          <Input
            label="Appointment Date (YYYY-MM-DD)"
            value={date}
            onChangeText={setDate}
            placeholder="e.g. 2026-09-16"
            keyboardType="numeric"
          />
          <Text style={styles.fieldLabel}>Time Slot</Text>
          <View style={styles.timeGrid}>
            {TIME_SLOTS.map(slot => (
              <TouchableOpacity
                key={slot}
                style={[
                  styles.timeSlot,
                  time === slot && styles.timeSlotSelected,
                ]}
                onPress={() => setTime(slot)}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    time === slot && styles.timeSlotTextSelected,
                  ]}
                >
                  {slot}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Consultation Type</Text>
        <View style={styles.chipRow}>
          {CONSULTATION_TYPES.map(item => (
            <Chip
              key={item.value}
              label={item.label}
              selected={consultationType === item.value}
              onPress={() => setConsultationType(item.value)}
            />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Reason for Visit</Text>
        <Card style={styles.formCard}>
          <Input
            label="Chief Complaint"
            value={reason}
            onChangeText={setReason}
            placeholder="e.g. Chest pain, fever, headache"
            multiline
          />
        </Card>

        <Button
          label="Register OPD Appointment"
          onPress={handleRegister}
          fullWidth
          size="lg"
          icon={<Calendar size={20} color="#fff" />}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.neutral[50] },
  header: {
    minHeight: 56,
    paddingHorizontal: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[0],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.neutral[200],
  },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.neutral[900],
  },
  headerSpacer: { width: 40 },
  scrollView: { flex: 1 },
  content: { padding: Spacing.base, paddingBottom: 100 },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.neutral[700],
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },
  formCard: { marginBottom: Spacing.md },
  patientSelectionCard: { height: 380, marginBottom: Spacing.md },
  fieldLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.neutral[700],
    marginBottom: Spacing.sm,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: Spacing.sm },
  loader: { flex: 1, marginVertical: Spacing.md },
  patientList: { flex: 1, marginTop: Spacing.sm },
  patientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[50],
  },
  patientItemLeft: { flex: 1 },
  patientItemName: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.neutral[900],
  },
  patientItemMeta: {
    fontSize: FontSize.xs,
    color: Colors.neutral[400],
    marginTop: 2,
  },
  onboardLink: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    backgroundColor: Colors.primary[50],
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.primary[200],
    borderStyle: 'dashed',
  },
  onboardLinkText: {
    fontSize: FontSize.sm,
    color: Colors.primary[700],
    fontWeight: FontWeight.semibold,
  },
  selectedPatientCard: {
    marginBottom: Spacing.md,
    backgroundColor: Colors.primary[50],
    borderColor: Colors.primary[200],
  },
  selectedPatientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  selectedPatientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedPatientInfo: { flex: 1 },
  selectedPatientName: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.neutral[900],
  },
  selectedPatientMeta: {
    fontSize: FontSize.sm,
    color: Colors.neutral[500],
    marginTop: 2,
  },
  changeText: {
    fontSize: FontSize.sm,
    color: Colors.primary[600],
    fontWeight: FontWeight.semibold,
  },
  doctorList: { gap: Spacing.sm, marginBottom: Spacing.md },
  doctorCard: {
    backgroundColor: Colors.neutral[0],
    borderRadius: Radius.md,
    padding: Spacing.base,
    borderWidth: 1.5,
    borderColor: Colors.neutral[200],
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadows.sm,
  },
  doctorCardSelected: {
    borderColor: Colors.primary[500],
    backgroundColor: Colors.primary[50],
  },
  doctorInfo: { flex: 1 },
  doctorName: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.neutral[900],
  },
  doctorQual: {
    fontSize: FontSize.xs,
    color: Colors.neutral[500],
    marginTop: 2,
  },
  doctorHours: {
    fontSize: FontSize.xs,
    color: Colors.neutral[400],
    marginTop: 2,
  },
  checkDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary[600],
  },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  timeSlot: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.md,
    backgroundColor: Colors.neutral[50],
    borderWidth: 1.5,
    borderColor: Colors.neutral[200],
  },
  timeSlotSelected: {
    backgroundColor: Colors.primary[600],
    borderColor: Colors.primary[600],
  },
  timeSlotText: {
    fontSize: FontSize.sm,
    color: Colors.neutral[600],
    fontWeight: FontWeight.medium,
  },
  timeSlotTextSelected: { color: '#fff', fontWeight: FontWeight.semibold },
  emptyCard: {
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  emptyText: { fontSize: FontSize.sm, color: Colors.neutral[400] },
});
