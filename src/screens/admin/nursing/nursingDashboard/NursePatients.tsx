import {
  NurseHeader,
  UrgentAlert,
} from '../../../../components/nursing/NurseDashboardHeader';
import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AlertTriangle,
  FileText,
  HeartPulse,
  RefreshCw,
  Search,
} from 'lucide-react-native';
import {
  Colors,
  FontSize,
  FontWeight,
  Radius,
  Shadows,
  Spacing,
} from '../../../../constants/theme';
import { useApp } from '../../../../context/AppContext';

type Patient = {
  bed: string;
  name: string;
  age: string;
  mrn: string;
  diagnosis: string;
  rhythm: string;
  updated: string;
  status: 'Stable' | 'Critical Telemetry' | 'Borderline';
  flags: string[];
  allergy: string;
  precautions?: string;
  vitals: [string, string, string, string, string];
};

const assignedPatients: Patient[] = [
  {
    bed: '402-A',
    name: 'Arthur Pendelton',
    age: '68y / M',
    mrn: 'MRN-884902',
    diagnosis: 'Acute NSTEMI s/p LAD Stenting & CHF Exacerbation',
    rhythm: 'NSR',
    updated: '07:45 AM',
    status: 'Stable',
    flags: ['FULL CODE', 'Fall Risk'],
    allergy: 'Penicillin (Anaphylaxis), Sulfa Drugs',
    vitals: ['88', '136/84', '96%', '18', '98.6°F'],
  },
  {
    bed: '404-B',
    name: 'Eleanor Zhang',
    age: '54y / F',
    mrn: 'MRN-902144',
    diagnosis: 'Acute Decompensated Heart Failure & Bilateral Pleural Effusion',
    rhythm: 'Sinus Tach',
    updated: '07:55 AM',
    status: 'Critical Telemetry',
    flags: ['FULL CODE'],
    allergy: 'Latex (Moderate rash)',
    vitals: ['104', '154/96', '92%', '23', '99.2°F'],
  },
  {
    bed: '407',
    name: 'Marcus Davies',
    age: '42y / M',
    mrn: 'MRN-773129',
    diagnosis: 'Resolving Diabetic Ketoacidosis (DKA) & Hypokalemia',
    rhythm: 'NSR',
    updated: '07:30 AM',
    status: 'Stable',
    flags: ['FULL CODE'],
    allergy: 'No Known Drug Allergies (NKDA)',
    vitals: ['74', '118/74', '99%', '16', '98.4°F'],
  },
  {
    bed: '410',
    name: 'Teresa Morales',
    age: '71y / F',
    mrn: 'MRN-645012',
    diagnosis: 'Community-Acquired Pneumonia & Controlled AFib',
    rhythm: 'AFib Controlled',
    updated: '07:40 AM',
    status: 'Borderline',
    flags: ['DNR', 'Fall Risk'],
    allergy: 'Ciprofloxacin (Tendinitis), Codeine (Nausea)',
    precautions: 'Droplet Precautions',
    vitals: ['90', '126/80', '95%', '19', '100.1°F'],
  },
];

const NursePatients = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { notifications, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'critical' | 'isolation'>('all');
  const patients = useMemo(
    () =>
      assignedPatients.filter(patient => {
        const matchesQuery =
          `${patient.bed} ${patient.name} ${patient.mrn} ${patient.diagnosis}`
            .toLowerCase()
            .includes(search.toLowerCase());
        const matchesFilter =
          filter === 'all' ||
          (filter === 'critical' && patient.status === 'Critical Telemetry') ||
          (filter === 'isolation' && Boolean(patient.precautions));
        return matchesQuery && matchesFilter;
      }),
    [search, filter],
  );

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <NurseHeader
          topInset={insets.top}
          unread={notifications.filter(item => !item.read).length}
          onAlert={() => showToast('No new nursing alerts.', 'info')}
        />
        <UrgentAlert onAction={() => navigation.navigate('NurseEmar')} />
        <View style={styles.body}>
          <View style={styles.dashboardCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContent}>
                <View style={styles.titleRow}>
                  <Text style={styles.sectionTitle}>
                    Assigned Patients & Live Vitals
                  </Text>
                  <Text style={styles.bedCount}>4 Beds</Text>
                </View>
                <Text style={styles.sectionSub}>
                  Continuous Real-Time Telemetry & Electronic Medical Records
                </Text>
              </View>
              <TouchableOpacity
                style={styles.syncButton}
                onPress={() =>
                  showToast('Live monitors synchronised.', 'success')
                }
              >
                <RefreshCw size={14} color={Colors.teal[700]} />
                <Text numberOfLines={1} style={styles.syncText}>
                  Sync Monitors
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.rule} />
            <View style={styles.filters}>
              <Filter
                label="All Assigned (4)"
                active={filter === 'all'}
                onPress={() => setFilter('all')}
              />
              <Filter
                label="● Critical Vitals (1)"
                tone="critical"
                active={filter === 'critical'}
                onPress={() => setFilter('critical')}
              />
              <Filter
                label="Isolation Precaution"
                tone="isolation"
                active={filter === 'isolation'}
                onPress={() => setFilter('isolation')}
              />
            </View>
            <View style={styles.searchBox}>
              <Search size={17} color={Colors.neutral[400]} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search bed, patient name, MRN, diagnosis..."
                placeholderTextColor={Colors.neutral[400]}
                style={styles.searchInput}
              />
            </View>
          </View>
          {patients.map(patient => (
            <PatientCard
              key={patient.bed}
              patient={patient}
              onRecords={() =>
                showToast(`${patient.name}'s medical records opened.`, 'info')
              }
              onEmar={() => navigation.navigate('NurseEmar')}
            />
          ))}
          {patients.length === 0 && (
            <View style={styles.empty}>
              <Search size={24} color={Colors.neutral[400]} />
              <Text style={styles.emptyTitle}>No patients found</Text>
              <Text style={styles.emptyText}>
                Try changing the search term or filter.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

function Filter({
  label,
  active,
  tone,
  onPress,
}: {
  label: string;
  active: boolean;
  tone?: 'critical' | 'isolation';
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.filter,
        active && styles.filterActive,
        tone === 'critical' && !active && styles.filterCritical,
        tone === 'isolation' && !active && styles.filterIsolation,
      ]}
    >
      <Text
        style={[
          styles.filterText,
          active && styles.filterActiveText,
          tone === 'critical' && !active && styles.filterCriticalText,
          tone === 'isolation' && !active && styles.filterIsolationText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function PatientCard({
  patient,
  onRecords,
  onEmar,
}: {
  patient: Patient;
  onRecords: () => void;
  onEmar: () => void;
}) {
  const critical = patient.status === 'Critical Telemetry';
  const borderline = patient.status === 'Borderline';
  const measurements = [
    ['♡ HR', patient.vitals[0], 'bpm'],
    ['◌ BP', patient.vitals[1], 'mmHg'],
    ['✚ SpO2', patient.vitals[2], 'O2 Sat'],
    ['↪ RR', patient.vitals[3], '/min'],
    ['♨ Temp', patient.vitals[4], 'Oral'],
  ];
  return (
    <View style={[styles.patientCard, critical && styles.patientCritical]}>
      <View style={styles.patientTop}>
        <View style={{ flex: 1 }}>
          <View style={styles.patientNameRow}>
            <Text style={styles.bed}>Bed {patient.bed}</Text>
            <Text style={styles.patientName}>{patient.name}</Text>
            <Text style={styles.age}>{patient.age}</Text>
            <Text style={styles.mrn}>{patient.mrn}</Text>
          </View>
          <Text style={styles.diagnosis}>{patient.diagnosis}</Text>
        </View>
        <View style={styles.rightFlags}>
          <Text
            style={[
              styles.status,
              critical
                ? styles.criticalStatus
                : borderline
                ? styles.borderlineStatus
                : styles.stableStatus,
            ]}
          >
            ● {patient.status}
          </Text>
          <View style={styles.codeRow}>
            {patient.flags.map(flag => (
              <Text
                key={flag}
                style={[
                  styles.code,
                  flag === 'Fall Risk' && styles.fallRisk,
                  flag === 'DNR' && styles.dnr,
                ]}
              >
                {flag}
              </Text>
            ))}
          </View>
        </View>
      </View>
      <View style={styles.vitalsTitle}>
        <HeartPulse size={15} color={Colors.teal[600]} />
        <Text style={styles.vitalsTitleText}>
          Real-Time Vital Signs ({patient.rhythm})
        </Text>
        <Text style={styles.updated}>◷ Updated {patient.updated}</Text>
      </View>
      <View style={styles.vitals}>
        {measurements.map((measurement, index) => (
          <View
            key={measurement[0]}
            style={[
              styles.vital,
              critical && index < 4 && styles.vitalCritical,
              critical && (index === 1 || index === 3) && styles.vitalWarning,
            ]}
          >
            <Text style={styles.vitalLabel}>{measurement[0]}</Text>
            <Text style={styles.vitalValue}>{measurement[1]}</Text>
            <Text style={styles.vitalUnit}>{measurement[2]}</Text>
          </View>
        ))}
      </View>
      <View style={styles.allergyRow}>
        <AlertTriangle size={13} color={Colors.error[500]} />
        <Text style={styles.allergy}>
          Allergies: <Text style={styles.allergyValue}>{patient.allergy}</Text>
        </Text>
        {patient.precautions && (
          <Text style={styles.precaution}>{patient.precautions}</Text>
        )}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.recordsButton} onPress={onRecords}>
          <FileText size={15} color={Colors.neutral[500]} />
          <Text style={styles.recordsText}>Medical Records</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.emarButton} onPress={onEmar}>
          <Text style={styles.emarText}>⌕ View Mobile eMAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default NursePatients;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#edf2f7' },
  content: { paddingBottom: Spacing.xl },
  body: {
    padding: Spacing.base,
    maxWidth: 920,
    width: '100%',
    alignSelf: 'center',
  },
  dashboardCard: {
    backgroundColor: Colors.neutral[0],
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  sectionHeader: { flexDirection: 'column', alignItems: 'stretch' },
  sectionTitleContent: { minWidth: 0 },
  titleRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  sectionTitle: {
    fontSize: FontSize.base,
    color: Colors.neutral[900],
    fontWeight: FontWeight.bold,
    flexShrink: 1,
  },
  bedCount: {
    fontSize: 9,
    color: Colors.teal[700],
    backgroundColor: Colors.teal[50],
    borderWidth: 1,
    borderColor: Colors.teal[200],
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: Radius.pill,
    fontWeight: FontWeight.bold,
  },
  sectionSub: { fontSize: 10, color: Colors.neutral[500], marginTop: 3 },
  syncButton: {
    width: 118,
    height: 32,
    alignSelf: 'flex-end',
    marginTop: Spacing.sm,
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.teal[50],
    borderWidth: 1,
    borderColor: Colors.teal[300],
    borderRadius: Radius.pill,
  },
  syncText: {
    fontSize: 10,
    color: Colors.teal[700],
    fontWeight: FontWeight.bold,
  },
  rule: {
    height: 1,
    backgroundColor: Colors.neutral[100],
    marginVertical: Spacing.md,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: Spacing.sm,
  },
  filter: {
    borderRadius: Radius.sm,
    paddingHorizontal: 9,
    paddingVertical: 6,
    backgroundColor: Colors.neutral[50],
  },
  filterActive: { backgroundColor: Colors.neutral[900] },
  filterText: {
    fontSize: 10,
    color: Colors.neutral[600],
    fontWeight: FontWeight.semibold,
  },
  filterActiveText: { color: Colors.neutral[0] },
  filterCritical: { backgroundColor: Colors.error[50] },
  filterCriticalText: { color: Colors.error[600] },
  filterIsolation: { backgroundColor: '#faf5ff' },
  filterIsolationText: { color: '#7e22ce' },
  searchBox: {
    height: 39,
    backgroundColor: Colors.neutral[50],
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 11,
    color: Colors.neutral[700],
    padding: 0,
  },
  patientCard: {
    backgroundColor: Colors.neutral[0],
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  patientCritical: {
    borderColor: Colors.error[300],
    backgroundColor: '#fffdfd',
  },
  patientTop: { flexDirection: 'row' },
  patientNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  bed: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: Colors.neutral[0],
    backgroundColor: Colors.neutral[800],
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: Radius.xs,
  },
  patientName: {
    fontSize: FontSize.sm,
    color: Colors.neutral[900],
    fontWeight: FontWeight.bold,
  },
  age: { fontSize: 10, color: Colors.neutral[500] },
  mrn: {
    fontSize: 8,
    color: Colors.primary[700],
    backgroundColor: Colors.primary[50],
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: Radius.xs,
  },
  diagnosis: { fontSize: 10, color: Colors.primary[900], marginTop: 5 },
  rightFlags: { alignItems: 'flex-end', gap: 6 },
  status: {
    fontSize: 9,
    fontWeight: FontWeight.bold,
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: Radius.pill,
  },
  stableStatus: {
    backgroundColor: Colors.success[100],
    color: Colors.success[700],
  },
  criticalStatus: {
    backgroundColor: Colors.error[100],
    color: Colors.error[700],
  },
  borderlineStatus: {
    backgroundColor: Colors.warning[100],
    color: Colors.warning[800],
  },
  codeRow: { flexDirection: 'row', gap: 4 },
  code: {
    fontSize: 8,
    color: Colors.primary[700],
    backgroundColor: Colors.primary[50],
    borderWidth: 1,
    borderColor: Colors.primary[200],
    borderRadius: Radius.xs,
    paddingHorizontal: 5,
    paddingVertical: 3,
    fontWeight: FontWeight.bold,
  },
  fallRisk: {
    color: Colors.warning[800],
    backgroundColor: Colors.warning[50],
    borderColor: Colors.warning[200],
  },
  dnr: { color: '#7e22ce', backgroundColor: '#faf5ff', borderColor: '#e9d5ff' },
  vitalsTitle: {
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[100],
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  vitalsTitleText: { fontSize: 10, color: Colors.neutral[700] },
  updated: { marginLeft: 'auto', fontSize: 9, color: Colors.neutral[400] },
  vitals: { flexDirection: 'row', gap: 7, marginTop: Spacing.sm },
  vital: {
    flex: 1,
    minHeight: 78,
    borderRadius: Radius.md,
    backgroundColor: Colors.neutral[50],
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  vitalCritical: {
    backgroundColor: Colors.error[50],
    borderColor: Colors.error[200],
  },
  vitalWarning: {
    backgroundColor: Colors.warning[50],
    borderColor: Colors.warning[300],
  },
  vitalLabel: { fontSize: 9, color: Colors.primary[600] },
  vitalValue: {
    fontSize: FontSize.sm,
    color: Colors.neutral[900],
    fontWeight: FontWeight.bold,
    marginTop: 3,
  },
  vitalUnit: { fontSize: 8, color: Colors.neutral[400], marginTop: 3 },
  allergyRow: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[100],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  allergy: { fontSize: 9, color: Colors.error[600], flex: 1 },
  allergyValue: { color: Colors.neutral[700] },
  precaution: {
    fontSize: 9,
    fontWeight: FontWeight.bold,
    color: '#7e22ce',
    backgroundColor: '#f3e8ff',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: Radius.xs,
  },
  actions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  recordsButton: {
    flex: 1,
    minHeight: 35,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    backgroundColor: Colors.neutral[50],
    borderRadius: Radius.sm,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  recordsText: {
    fontSize: 10,
    color: Colors.neutral[600],
    fontWeight: FontWeight.bold,
  },
  emarButton: {
    flex: 1,
    minHeight: 35,
    backgroundColor: Colors.teal[600],
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emarText: {
    fontSize: 10,
    color: Colors.neutral[0],
    fontWeight: FontWeight.bold,
  },
  empty: {
    padding: Spacing.xl,
    alignItems: 'center',
    borderRadius: Radius.lg,
    backgroundColor: Colors.neutral[0],
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  emptyTitle: {
    fontSize: FontSize.base,
    color: Colors.neutral[800],
    fontWeight: FontWeight.bold,
    marginTop: Spacing.sm,
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: Colors.neutral[500],
    marginTop: 3,
  },
});
