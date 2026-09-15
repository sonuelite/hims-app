import NursingButton from '../../../../components/nursing/NursingButton';
import { Fontconstants } from '../../../../constants/fontConstants';
import { fontScale } from '../../../../utils/scale';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AlertTriangle,
  CheckCircle2,
  Search,
  ShieldAlert,
  Syringe,
  Volume2,
  X,
} from 'lucide-react-native';
import {
  Colors,
  FontSize,
  FontWeight,
  Radius,
  Shadows,
  Spacing,
} from '../../../../constants/theme';
import {
  NurseHeader,
  UrgentAlert,
} from '../../../../components/nursing/NurseDashboardHeader';
import { useApp } from '../../../../context/AppContext';

type MedicationStatus = 'overdue' | 'due' | 'upcoming' | 'given';
type TimelineFilter = 'all' | MedicationStatus;
type Medication = {
  id: string;
  bed: string;
  patient: string;
  name: string;
  generic: string;
  dose: string;
  route: string;
  frequency: string;
  doctor: string;
  status: MedicationStatus;
  time: string;
  instructions: string;
  warning?: string;
};

// Reference fixtures, matching the assigned patients. Replace with eMAR orders when available.
const medications: Medication[] = [
  {
    id: 'heparin',
    bed: '402-A',
    patient: 'Arthur Pendelton',
    name: 'Heparin Sodium IV Infusion',
    generic: 'Heparin Sodium (100 units/mL in 0.9% NaCl)',
    dose: '1,000 units/hr (10 mL/hr)',
    route: 'IV Infusion',
    frequency: 'Continuous Titration Protocol',
    doctor: 'Alistair Ross',
    status: 'overdue',
    time: '07:30 AM',
    warning:
      'Anticoagulant - Severe bleeding hazard. Mandatory 2-Nurse Independent Double Check required before infusion rate changes.',
    instructions:
      'Verify Anti-Xa lab draws. Check pump volume infused, rate, and line clarity with witness.',
  },
  {
    id: 'lasix',
    bed: '404-B',
    patient: 'Eleanor Zhang',
    name: 'Furosemide (Lasix) IV Push',
    generic: 'Furosemide Injection USP',
    dose: '40 mg (4 mL)',
    route: 'IV Push',
    frequency: 'BID PRN for Acute Dyspnea',
    doctor: 'Maya Patel',
    status: 'due',
    time: '08:00 AM',
    instructions:
      'Push slowly over 2 minutes (20 mg/min max). Check BP and lung sounds prior to administration. Monitor strict urine output.',
  },
  {
    id: 'insulin',
    bed: '407',
    patient: 'Marcus Davies',
    name: 'Humulin R (Regular Insulin)',
    generic: 'Insulin Human Regular (100 units/mL)',
    dose: '6 Units Subcutaneous',
    route: 'Subcutaneous',
    frequency: 'Pre-Meal Sliding Scale',
    doctor: 'Kenneth Cole',
    status: 'due',
    time: '08:15 AM',
    warning:
      'Insulin Product - Severe hypoglycemia risk. Dual nurse sign-off required for units drawn.',
    instructions:
      'Confirmed CBG 172 mg/dL. Administer 15 mins before breakfast tray. Rotate abdominal site.',
  },
  {
    id: 'metoprolol',
    bed: '402-A',
    patient: 'Arthur Pendelton',
    name: 'Metoprolol Tartrate Oral Tablet',
    generic: 'Metoprolol Tartrate',
    dose: '25 mg Oral',
    route: 'Oral',
    frequency: 'Q12H with meals',
    doctor: 'Alistair Ross',
    status: 'upcoming',
    time: '09:00 AM',
    instructions: 'Hold if Heart Rate < 60 bpm or Systolic BP < 100 mmHg.',
  },
  {
    id: 'ceftriaxone',
    bed: '410',
    patient: 'Teresa Morales',
    name: 'Ceftriaxone IV Piggyback',
    generic: 'Ceftriaxone Sodium for Injection',
    dose: '1,000 mg in 50 mL D5W',
    route: 'IV Infusion',
    frequency: 'Q24H Infusion',
    doctor: 'Susan Lin',
    status: 'upcoming',
    time: '10:00 AM',
    instructions:
      'Infuse over 30 minutes. Monitor for hypersensitivity reactions and phlebitis at peripheral site.',
  },
  {
    id: 'potassium',
    bed: '407',
    patient: 'Marcus Davies',
    name: 'Potassium Chloride (Klor-Con) Oral',
    generic: 'Potassium Chloride Extended-Release',
    dose: '20 mEq Oral Tablet',
    route: 'Oral',
    frequency: 'Daily Post-Meal',
    doctor: 'Kenneth Cole',
    status: 'upcoming',
    time: '12:00 PM',
    warning:
      'Potassium Electrolyte - Cardiac dysrhythmia risk if administered inappropriately.',
    instructions:
      'Administer with full glass of water. Do not crush or chew. Take with food.',
  },
  {
    id: 'lisinopril',
    bed: '402-A',
    patient: 'Arthur Pendelton',
    name: 'Lisinopril Oral Tablet',
    generic: 'Lisinopril USP',
    dose: '10 mg Oral',
    route: 'Oral',
    frequency: 'Daily at 07:00 AM',
    doctor: 'Alistair Ross',
    status: 'given',
    time: '06:50 AM',
    instructions: 'Swallowed with water. Pre-dose BP 134/82 verified.',
  },
];
const filterOptions: { key: TimelineFilter; label: string }[] = [
  { key: 'all', label: 'All Timeline' },
  { key: 'overdue', label: 'Overdue' },
  { key: 'due', label: 'Due Now' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'given', label: 'Signed / Given' },
];
const statusLabels: Record<MedicationStatus, string> = {
  overdue: 'OVERDUE',
  due: 'DUE',
  upcoming: 'UPCOMING',
  given: 'GIVEN',
};
const statusColors: Record<TimelineFilter, string> = {
  all: Colors.neutral[900],
  overdue: Colors.error[600],
  due: Colors.warning[600],
  upcoming: Colors.primary[700],
  given: Colors.success[700],
};
const statusBackgrounds: Record<TimelineFilter, string> = {
  all: Colors.neutral[100],
  overdue: Colors.error[50],
  due: Colors.warning[50],
  upcoming: Colors.primary[50],
  given: Colors.success[50],
};

function openDosePreview(medication: Medication, hold = false) {
  Alert.alert(
    hold
      ? 'Hold / Omit Dose'
      : medication.warning
      ? 'Dual-Verify & Administer'
      : 'Administer Dose',
    `${medication.patient} · Bed ${medication.bed}\n${medication.name}\n${
      medication.dose
    }\n\n${
      hold
        ? 'A reason must be recorded before holding or omitting a dose.'
        : medication.warning
        ? 'An independent second-nurse verification is required before administration.'
        : 'Patient identity and medication checks are required before administration.'
    }\n\nPreview only. Medication recording is not connected and no record has been changed.`,
  );
}

const NurseEmar = () => {
  const insets = useSafeAreaInsets();
  const { notifications, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<TimelineFilter>('all');
  const visibleMedications = useMemo(
    () =>
      medications.filter(medication => {
        const matchesQuery =
          `${medication.name} ${medication.generic} ${medication.dose} ${medication.bed} ${medication.patient}`
            .toLowerCase()
            .includes(search.trim().toLowerCase());
        return (
          matchesQuery && (filter === 'all' || medication.status === filter)
        );
      }),
    [search, filter],
  );
  const highAlertCount = medications.filter(
    medication => medication.warning && medication.status !== 'given',
  ).length;
  const focusUrgentDose = () => {
    setFilter('due');
    setSearch('Eleanor Zhang');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        <NurseHeader
          topInset={insets.top}
          unread={notifications.filter(item => !item.read).length}
          onAlert={() =>
            showToast(
              'Urgent medication alert: Lasix IV Push, Bed 404-B.',
              'info',
            )
          }
        />
        <UrgentAlert onAction={focusUrgentDose} />
        <View style={styles.body}>
          <View style={styles.dashboardCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContent}>
                <View style={styles.titleRow}>
                  <Text style={styles.sectionTitle}>Mobile eMAR Timeline</Text>
                  <Text style={styles.unitBadge}>W-4B Unit</Text>
                </View>
                <Text style={styles.sectionSub}>
                  Electronic Medication Administration Record · Time-Sorted
                  Floor Tasks
                </Text>
              </View>
              <NursingButton
                title="Test Urgent Alert"
                variant="outline"
                icon={<Volume2 size={16} color={Colors.primary[600]} />}
                style={styles.testAction}
                onPress={() =>
                  showToast(
                    'Test urgent alert: Lasix IV Push is due for Eleanor Zhang, Bed 404-B.',
                    'info',
                  )
                }
              />
            </View>
            <View style={styles.safetyBanner}>
              <ShieldAlert size={16} color={Colors.error[600]} />
              <Text style={styles.safetyText}>
                {highAlertCount} High Alert Medications on Floor (Dual-Nurse
                Sign-off Enforced)
              </Text>
              <Text style={styles.safetyBadge}>Safety PIN</Text>
            </View>
            <View style={styles.rule} />
            <View style={styles.filters}>
              {filterOptions.map(option => {
                const count =
                  option.key === 'all'
                    ? medications.length
                    : medications.filter(
                        medication => medication.status === option.key,
                      ).length;
                const active = filter === option.key;
                return (
                  <TouchableOpacity
                    key={option.key}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    onPress={() => setFilter(option.key)}
                    style={[
                      styles.filter,
                      { backgroundColor: statusBackgrounds[option.key] },
                      active && styles.filterActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        { color: statusColors[option.key] },
                        active && styles.filterActiveText,
                      ]}
                    >
                      {option.key === 'overdue' || option.key === 'due'
                        ? '● '
                        : ''}
                      {option.label}
                      {option.key !== 'given' ? ` (${count})` : ''}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={styles.searchBox}>
              <Search size={17} color={Colors.neutral[400]} />
              <TextInput
                accessibilityLabel="Search medication, dosage, bed or patient"
                value={search}
                onChangeText={setSearch}
                placeholder="Search medication, dosage, bed, patient..."
                placeholderTextColor={Colors.neutral[400]}
                style={styles.searchInput}
              />
              {search.length > 0 && (
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel="Clear search"
                  hitSlop={8}
                  onPress={() => setSearch('')}
                >
                  <X size={16} color={Colors.neutral[400]} />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={styles.timeline}>
            {visibleMedications.map(medication => (
              <MedicationCard key={medication.id} medication={medication} />
            ))}
          </View>
          {visibleMedications.length === 0 && (
            <View style={styles.empty}>
              <Search size={24} color={Colors.neutral[400]} />
              <Text style={styles.emptyTitle}>No medications found</Text>
              <Text style={styles.sectionSub}>
                Try changing the search term or filter.
              </Text>
              <NursingButton
                title="Reset filters"
                variant="outline"
                style={styles.resetAction}
                onPress={() => {
                  setSearch('');
                  setFilter('all');
                }}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

function MedicationCard({ medication }: { medication: Medication }) {
  const highAlert = Boolean(medication.warning);
  const given = medication.status === 'given';
  const due = medication.status === 'due';
  const overdue = medication.status === 'overdue';
  return (
    <View style={styles.timelineItem}>
      <View
        style={[
          styles.timelineDot,
          { backgroundColor: statusColors[medication.status] },
          (due || overdue) && styles.priorityDot,
        ]}
      />
      <View style={[styles.medicationCard, highAlert && styles.highAlertCard]}>
        <View
          style={[
            styles.cardHeader,
            highAlert && styles.highAlertHeader,
            due && !highAlert && styles.dueHeader,
          ]}
        >
          <View style={styles.patientRow}>
            <Text style={styles.bed}>Bed {medication.bed}</Text>
            <Text style={styles.patientName}>{medication.patient}</Text>
          </View>
          <View style={styles.badges}>
            {highAlert && (
              <View style={styles.highAlertBadge}>
                <ShieldAlert size={11} color={Colors.error[600]} />
                <Text style={styles.highAlertText}>HIGH ALERT</Text>
              </View>
            )}
            <Text
              style={[
                styles.statusBadge,
                given
                  ? styles.givenBadge
                  : overdue
                  ? styles.overdueBadge
                  : due
                  ? styles.dueBadge
                  : styles.upcomingBadge,
              ]}
            >
              {statusLabels[medication.status]}
              {!given && ` (${medication.time})`}
            </Text>
          </View>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.medicationRow}>
            <View style={styles.medicationTitleContent}>
              <Text style={styles.medicationName}>{medication.name}</Text>
              <Text style={styles.generic}>{medication.generic}</Text>
            </View>
            <View style={styles.doseColumn}>
              <Text style={styles.dose}>{medication.dose}</Text>
              <Text style={styles.route}>Route: {medication.route}</Text>
            </View>
          </View>
          <View style={styles.orderRow}>
            <Text style={styles.meta}>
              Frequency:{' '}
              <Text style={styles.strong}>{medication.frequency}</Text>
            </Text>
            <Text style={styles.meta}>Order: Dr. {medication.doctor}, MD</Text>
          </View>
          {highAlert && (
            <View style={styles.warning}>
              <AlertTriangle size={14} color={Colors.error[600]} />
              <Text style={styles.warningText}>{medication.warning}</Text>
            </View>
          )}
          <View style={styles.instructions}>
            <Text style={styles.instructionText}>
              <Text style={styles.strong}>Instructions: </Text>
              {medication.instructions}
            </Text>
          </View>
          {given ? (
            <View style={styles.signed}>
              <CheckCircle2 size={16} color={Colors.success[600]} />
              <Text style={styles.signedText}>
                Administered by Sister Clara Vance, RN at {medication.time}
              </Text>
            </View>
          ) : (
            <View style={styles.actions}>
              <NursingButton
                title={
                  highAlert ? 'Dual-Verify & Administer' : 'Administer Dose'
                }
                variant={highAlert ? 'danger' : 'primary'}
                icon={<Syringe size={16} color={Colors.neutral[0]} />}
                style={styles.doseAction}
                onPress={() => openDosePreview(medication)}
                accessibilityLabel={`${
                  highAlert ? 'Dual-verify and administer' : 'Administer'
                } ${medication.name} for ${medication.patient}`}
              />
              <NursingButton
                title="Hold / Omit"
                variant="outline"
                style={styles.doseAction}
                onPress={() => openDosePreview(medication, true)}
                accessibilityLabel={`Hold or omit ${medication.name} for ${medication.patient}`}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
export default NurseEmar;

const styles = StyleSheet.create({
  testAction: { alignSelf: 'flex-end', marginLeft: 'auto' },
  resetAction: { marginTop: Spacing.md },
  doseAction: { flexGrow: 1, flexBasis: 180 },
  container: { flex: 1, backgroundColor: Colors.neutral[50] },
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
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    marginBottom: Spacing.base,
    ...Shadows.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sectionTitleContent: { flexGrow: 1, flexBasis: 235 },
  titleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontFamily: Fontconstants.BOLD,
    fontSize: fontScale(FontSize.lg),
    color: Colors.neutral[900],
    fontWeight: FontWeight.bold,
  },
  unitBadge: {
    fontFamily: Fontconstants.BOLD,
    fontSize: fontScale(11),
    color: Colors.primary[700],
    backgroundColor: Colors.primary[50],
    borderWidth: 1,
    borderColor: Colors.primary[200],
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: Radius.pill,
    fontWeight: FontWeight.bold,
  },
  sectionSub: {
    fontFamily: Fontconstants.REGULAR,
    fontSize: fontScale(13),
    lineHeight: fontScale(19),
    color: Colors.neutral[500],
    marginTop: 3,
  },

  safetyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.error[200],
    backgroundColor: Colors.error[50],
    borderRadius: Radius.md,
    marginTop: Spacing.md,
  },
  safetyText: {
    fontFamily: Fontconstants.SEMIBOLD,
    flex: 1,
    fontSize: fontScale(13),
    lineHeight: fontScale(19),
    color: Colors.error[600],
    fontWeight: FontWeight.semibold,
  },
  safetyBadge: {
    fontFamily: Fontconstants.BOLD,
    fontSize: fontScale(11),
    fontWeight: FontWeight.bold,
    color: Colors.error[700],
    backgroundColor: Colors.error[100],
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: Radius.pill,
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
    borderRadius: Radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 7,
  },
  filterActive: { backgroundColor: Colors.primary[600] },
  filterText: {
    fontFamily: Fontconstants.SEMIBOLD,
    fontSize: fontScale(13),
    fontWeight: FontWeight.semibold,
  },
  filterActiveText: { color: Colors.neutral[0] },
  searchBox: {
    minHeight: 48,
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
    fontFamily: Fontconstants.REGULAR,
    flex: 1,
    fontSize: fontScale(FontSize.base),
    color: Colors.neutral[700],
    paddingVertical: Spacing.sm,
  },
  timeline: { marginLeft: Spacing.base },
  timelineItem: {
    borderLeftWidth: 2,
    borderLeftColor: Colors.neutral[200],
    paddingLeft: Spacing.md,
    paddingBottom: Spacing.md,
  },
  timelineDot: {
    position: 'absolute',
    left: -6,
    top: 19,
    height: 10,
    width: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: Colors.neutral[0],
  },
  priorityDot: { height: 14, width: 14, left: -8, top: 17, borderRadius: 7 },
  medicationCard: {
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    backgroundColor: Colors.neutral[0],
    borderRadius: Radius.md,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  highAlertCard: { borderColor: Colors.error[300] },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.neutral[50],
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },
  highAlertHeader: {
    backgroundColor: Colors.error[50],
    borderBottomColor: Colors.error[100],
  },
  dueHeader: {
    backgroundColor: Colors.warning[50],
    borderBottomColor: Colors.warning[100],
  },
  patientRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  bed: {
    fontFamily: Fontconstants.BOLD,
    fontSize: fontScale(13),
    fontWeight: FontWeight.bold,
    color: Colors.neutral[0],
    backgroundColor: Colors.neutral[800],
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: Radius.xs,
  },
  patientName: {
    fontFamily: Fontconstants.BOLD,
    fontSize: fontScale(13),
    fontWeight: FontWeight.bold,
    color: Colors.neutral[800],
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 5,
  },
  highAlertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 5,
    paddingVertical: 3,
    backgroundColor: Colors.error[100],
    borderColor: Colors.error[200],
    borderWidth: 1,
    borderRadius: Radius.xs,
  },
  highAlertText: {
    fontFamily: Fontconstants.BOLD,
    fontSize: fontScale(11),
    fontWeight: FontWeight.bold,
    color: Colors.error[600],
  },
  statusBadge: {
    fontFamily: Fontconstants.BOLD,
    fontSize: fontScale(11),
    fontWeight: FontWeight.bold,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  overdueBadge: {
    backgroundColor: Colors.error[600],
    color: Colors.neutral[0],
  },
  dueBadge: {
    backgroundColor: Colors.warning[500],
    color: Colors.warning[900],
  },
  upcomingBadge: {
    backgroundColor: Colors.neutral[100],
    color: Colors.neutral[600],
  },
  givenBadge: {
    backgroundColor: Colors.success[100],
    color: Colors.success[700],
  },
  cardBody: { padding: Spacing.md, gap: Spacing.sm },
  medicationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  medicationTitleContent: { flexGrow: 1, flexBasis: 180 },
  medicationName: {
    fontFamily: Fontconstants.BOLD,
    fontSize: fontScale(FontSize.base),
    lineHeight: fontScale(22),
    fontWeight: FontWeight.bold,
    color: Colors.neutral[900],
  },
  generic: {
    fontFamily: Fontconstants.REGULAR,
    fontSize: fontScale(13),
    lineHeight: fontScale(19),
    color: Colors.neutral[500],
    marginTop: 2,
  },
  doseColumn: { alignItems: 'flex-end', marginLeft: 'auto', maxWidth: '100%' },
  dose: {
    fontFamily: Fontconstants.BOLD,
    fontSize: fontScale(13),
    fontWeight: FontWeight.bold,
    color: Colors.primary[700],
    backgroundColor: Colors.primary[50],
    borderWidth: 1,
    borderColor: Colors.primary[200],
    borderRadius: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  route: {
    fontFamily: Fontconstants.REGULAR,
    fontSize: fontScale(11),
    color: Colors.neutral[500],
    marginTop: 3,
  },
  orderRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 5,
    marginTop: Spacing.sm,
  },
  meta: {
    fontFamily: Fontconstants.REGULAR,
    fontSize: fontScale(11),
    lineHeight: fontScale(16),
    color: Colors.neutral[500],
  },
  strong: {
    fontFamily: Fontconstants.SEMIBOLD,
    color: Colors.neutral[700],
    fontWeight: FontWeight.semibold,
  },
  warning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.error[200],
    borderRadius: Radius.sm,
    backgroundColor: Colors.error[50],
  },
  warningText: {
    fontFamily: Fontconstants.REGULAR,
    flex: 1,
    fontSize: fontScale(13),
    lineHeight: fontScale(19),
    color: Colors.error[600],
  },
  instructions: {
    padding: Spacing.sm,
    borderRadius: Radius.sm,
    backgroundColor: Colors.neutral[50],
  },
  instructionText: {
    fontFamily: Fontconstants.REGULAR,
    fontSize: fontScale(13),
    lineHeight: fontScale(19),
    color: Colors.neutral[500],
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    flexWrap: 'wrap',
  },

  signed: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.success[300],
    borderRadius: Radius.sm,
    backgroundColor: Colors.success[50],
    padding: Spacing.sm,
  },
  signedText: {
    fontFamily: Fontconstants.SEMIBOLD,
    flex: 1,
    fontSize: fontScale(13),
    lineHeight: fontScale(19),
    fontWeight: FontWeight.semibold,
    color: Colors.success[700],
  },
  empty: {
    padding: Spacing.xl,
    alignItems: 'center',
    borderRadius: Radius.md,
    backgroundColor: Colors.neutral[0],
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  emptyTitle: {
    fontFamily: Fontconstants.BOLD,
    fontSize: fontScale(FontSize.base),
    color: Colors.neutral[800],
    fontWeight: FontWeight.bold,
    marginTop: Spacing.sm,
  },
});
