import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeftRight,
  CalendarDays,
  Check,
  Send,
  ShieldAlert,
} from 'lucide-react-native';
import {
  NurseHeader,
  UrgentAlert,
} from '../../../../components/nursing/NurseDashboardHeader';
import CustomButton from '../../../../components/customButton/CustomButton';
import {
  Colors,
  FontSize,
  Radius,
  Shadows,
  Spacing,
} from '../../../../constants/theme';
import { Fontconstants } from '../../../../constants/fontConstants';
import { fontScale } from '../../../../utils/scale';
import { useApp } from '../../../../context/AppContext';

// Reference fixtures, matching the nursing dashboard. Services are not connected.
const categories = [
  {
    name: 'Casual Leave',
    code: 'CL',
    days: 4,
    note: 'Short notice leave',
    color: Colors.teal[700],
    background: Colors.teal[50],
    border: Colors.teal[200],
  },
  {
    name: 'Sick Leave',
    code: 'SL',
    days: 7,
    note: 'Medical fitness cert',
    color: Colors.primary[700],
    background: Colors.primary[50],
    border: Colors.primary[200],
  },
  {
    name: 'Earned Leave',
    code: 'EL',
    days: 12,
    note: 'Annual privilege',
    color: '#4338ca',
    background: '#eef2ff',
    border: '#c7d2fe',
  },
];
const blackouts = [
  {
    title: 'JCI Global Hospital Accreditation Audit Week',
    start: '2026-09-18',
    end: '2026-09-25',
    note: 'Mandatory 100% floor unit staffing required for Joint Commission International surveyors.',
  },
  {
    title: 'Annual Winter Surge & Post-Op High Occupancy',
    start: '2026-10-24',
    end: '2026-11-04',
    note: 'Seasonal respiratory surge & high elective surgery schedule. Ratio ceiling active.',
  },
];

function parseDate(value: string): number | null {
  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value);
  if (!match) {
    return null;
  }
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
    ? date.getTime()
    : null;
}

export default function NurseLeave() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<{ NurseEmar: undefined }>>();
  const { notifications, showToast } = useApp();
  const [tab, setTab] = useState<'leave' | 'swap'>('leave');
  const [category, setCategory] = useState(0);
  const [start, setStart] = useState('20-09-2026');
  const [end, setEnd] = useState('22-09-2026');
  const [peer, setPeer] = useState('Staff Nurse David Miller, RN');
  const [reason, setReason] = useState(
    'Family medical obligation and personal urgent requirement.',
  );
  const [acknowledged, setAcknowledged] = useState(false);
  const startTime = parseDate(start);
  const endTime = parseDate(end);
  const duration =
    startTime !== null && endTime !== null && endTime >= startTime
      ? Math.round((endTime - startTime) / 86400000) + 1
      : 0;
  const selected = categories[category];
  const overlaps =
    startTime !== null &&
    endTime !== null &&
    duration > 0 &&
    blackouts.some(
      period =>
        startTime <= Date.parse(period.end) &&
        endTime >= Date.parse(period.start),
    );
  const dateError =
    startTime === null || endTime === null
      ? 'Enter valid dates in DD-MM-YYYY format.'
      : duration === 0
      ? 'End date must be on or after the start date.'
      : duration > selected.days
      ? `This request exceeds your ${
          selected.days
        }-day ${selected.name.toLowerCase()} balance.`
      : '';
  const canSubmit =
    !dateError &&
    peer.trim().length > 0 &&
    reason.trim().length > 0 &&
    (!overlaps || acknowledged);
  const submit = () => {
    if (!canSubmit) {
      return;
    }
    Alert.alert(
      'Leave Request Preview',
      `${
        selected.name
      }: ${start} to ${end} (${duration} days)\nCovering peer: ${peer.trim()}\nReason: ${reason.trim()}${
        overlaps
          ? '\n\nStaffing advisory acknowledged; superintendent triage required.'
          : ''
      }\n\nSubmission is not connected. No request has been sent and your balance has not changed.`,
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
        <UrgentAlert onAction={() => navigation.navigate('NurseEmar')} />
        <View style={styles.body}>
          <View style={styles.tabs} accessibilityRole="tablist">
            {(['leave', 'swap'] as const).map(key => (
              <TouchableOpacity
                key={key}
                accessibilityRole="tab"
                accessibilityState={{ selected: tab === key }}
                style={[styles.tab, tab === key && styles.tabActive]}
                onPress={() => setTab(key)}
              >
                <Text style={[styles.tabText, tab === key && styles.tealText]}>
                  {key === 'leave'
                    ? 'Leave Balances & Superintendent Portal'
                    : 'Peer Shift Swap (Competency-Checked)'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {tab === 'leave' ? (
            <>
              <View style={styles.card}>
                <View style={styles.row}>
                  <Text style={styles.title}>
                    Nursing Superintendent Leave Portal
                  </Text>
                  <Text style={styles.portalBadge}>Staff Portal</Text>
                </View>
                <Text style={styles.copy}>
                  View entitlement balances and submit direct leave requests
                  with automated surge ratio triage.
                </Text>
                <View style={styles.balances}>
                  {categories.map(item => (
                    <View
                      key={item.code}
                      style={[
                        styles.balance,
                        {
                          backgroundColor: item.background,
                          borderColor: item.border,
                        },
                      ]}
                    >
                      <Text
                        style={[styles.balanceLabel, { color: item.color }]}
                      >
                        {item.name.toUpperCase()} ({item.code})
                      </Text>
                      <Text style={styles.balanceValue}>
                        {item.days} <Text style={styles.days}>Days</Text>
                      </Text>
                      <Text style={[styles.balanceNote, { color: item.color }]}>
                        {item.note}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
              <View style={styles.blackoutCard}>
                <View style={styles.row}>
                  <CalendarDays size={17} color={Colors.warning[700]} />
                  <Text style={styles.warningTitle}>
                    Hospital Critical Surge & Blackout Calendar (2026)
                  </Text>
                </View>
                {blackouts.map(period => (
                  <View key={period.start} style={styles.blackoutItem}>
                    <View style={styles.row}>
                      <Text style={styles.eventTitle}>{period.title}</Text>
                      <Text style={styles.dateBadge}>
                        {period.start} to {period.end}
                      </Text>
                    </View>
                    <Text style={styles.smallCopy}>{period.note}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.card}>
                <View style={styles.row}>
                  <Send size={18} color={Colors.teal[600]} />
                  <Text style={styles.sectionTitle}>
                    Submit Request to Nursing Superintendent
                  </Text>
                </View>
                <Text style={styles.label}>Select Leave Category</Text>
                <View style={styles.categories}>
                  {categories.map((item, index) => (
                    <TouchableOpacity
                      key={item.code}
                      accessibilityRole="button"
                      accessibilityState={{ selected: category === index }}
                      onPress={() => {
                        setCategory(index);
                        setAcknowledged(false);
                      }}
                      style={[
                        styles.category,
                        category === index && styles.categoryActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.categoryText,
                          category === index && styles.whiteText,
                        ]}
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.dateRow}>
                  <View style={styles.dateColumn}>
                    <Text style={styles.label}>Start Date</Text>
                    <View style={styles.dateInput}>
                      <TextInput
                        accessibilityLabel="Start date, DD-MM-YYYY"
                        value={start}
                        onChangeText={value => {
                          setStart(value);
                          setAcknowledged(false);
                        }}
                        placeholder="DD-MM-YYYY"
                        placeholderTextColor={Colors.neutral[400]}
                        maxLength={10}
                        keyboardType="numbers-and-punctuation"
                        style={styles.dateText}
                      />
                      <CalendarDays size={15} color={Colors.neutral[500]} />
                    </View>
                  </View>
                  <View style={styles.dateColumn}>
                    <Text style={styles.label}>End Date</Text>
                    <View style={styles.dateInput}>
                      <TextInput
                        accessibilityLabel="End date, DD-MM-YYYY"
                        value={end}
                        onChangeText={value => {
                          setEnd(value);
                          setAcknowledged(false);
                        }}
                        placeholder="DD-MM-YYYY"
                        placeholderTextColor={Colors.neutral[400]}
                        maxLength={10}
                        keyboardType="numbers-and-punctuation"
                        style={styles.dateText}
                      />
                      <CalendarDays size={15} color={Colors.neutral[500]} />
                    </View>
                  </View>
                </View>
                <View style={styles.summary}>
                  <Text style={styles.smallCopy}>
                    Total Duration:{' '}
                    <Text style={styles.strong}>{duration || '—'} Days</Text>
                  </Text>
                  <Text style={styles.smallCopy}>
                    Entitlement: Remaining {selected.days} Days
                  </Text>
                </View>
                {!!dateError && (
                  <Text accessibilityRole="alert" style={styles.error}>
                    {dateError}
                  </Text>
                )}
                {overlaps && (
                  <View style={styles.advisory}>
                    <View style={styles.advisoryHeading}>
                      <ShieldAlert size={20} color={Colors.warning[700]} />
                      <View style={styles.flex}>
                        <Text style={styles.warningTitle}>
                          LOW STAFFING RATIO ADVISORY
                        </Text>
                        <Text style={styles.warningTitle}>
                          Critical Hospital Blackout / High-Occupancy Surge Week
                          Detected
                        </Text>
                        <Text style={styles.warningCopy}>
                          Critical Hospital Blackout Period: Low staffing ratio
                          advisory. Leave requests during these dates require
                          direct emergency triage by the Nursing Superintendent.
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: acknowledged }}
                      accessibilityLabel="I understand low staffing ratios apply during this surge and request superintendent triage"
                      onPress={() => setAcknowledged(!acknowledged)}
                      style={styles.acknowledgment}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          acknowledged && styles.categoryActive,
                        ]}
                      >
                        {acknowledged && (
                          <Check size={14} color={Colors.neutral[0]} />
                        )}
                      </View>
                      <Text style={styles.acknowledgmentText}>
                        I understand low staffing ratios apply during this surge
                        and request superintendent triage.
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                <Text style={styles.label}>
                  Designated Covering Peer (Ward Handover)
                </Text>
                <TextInput
                  accessibilityLabel="Designated covering peer"
                  value={peer}
                  onChangeText={setPeer}
                  style={styles.input}
                  placeholder="Enter covering nurse name"
                  placeholderTextColor={Colors.neutral[400]}
                />
                <Text style={styles.label}>
                  Reason for Leave (Nursing Superintendent Justification)
                </Text>
                <TextInput
                  accessibilityLabel="Reason for leave"
                  value={reason}
                  onChangeText={setReason}
                  multiline
                  textAlignVertical="top"
                  style={[styles.input, styles.reason]}
                  placeholder="Describe the reason for your request"
                  placeholderTextColor={Colors.neutral[400]}
                />
                <CustomButton
                  title="Submit Request to Nursing Superintendent"
                  onPress={submit}
                  disable={!canSubmit}
                  fontsize={13}
                  bgColor={canSubmit ? Colors.teal[600] : Colors.neutral[200]}
                  txtColor={canSubmit ? Colors.neutral[0] : Colors.neutral[400]}
                  leftIcon={
                    <Send
                      size={17}
                      color={
                        canSubmit ? Colors.neutral[0] : Colors.neutral[400]
                      }
                    />
                  }
                  containerStyle={styles.submit}
                  buttonStyle={styles.submitButton}
                  textStyle={styles.submitText}
                />
              </View>
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>
                  Leave History & Superintendent Review Status
                </Text>
                <View style={styles.history}>
                  <View style={styles.row}>
                    <Text style={styles.strong}>Earned Leave</Text>
                    <Text style={styles.historyDays}>5 Days</Text>
                    <Text style={styles.approved}>Approved</Text>
                  </View>
                  <Text style={styles.historyCopy}>
                    2026-08-10 to 2026-08-14 • Reason: Annual family leave
                    post-orientation.
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.card}>
              <View style={styles.row}>
                <ArrowLeftRight size={19} color={Colors.teal[600]} />
                <Text style={styles.title}>Peer Shift Swap</Text>
              </View>
              <Text style={styles.copy}>
                Coordinate a shift exchange with a qualified covering nurse.
              </Text>
              <View style={styles.history}>
                <Text style={styles.sectionTitle}>
                  Competency verification required
                </Text>
                <Text style={styles.copy}>
                  Peer availability, unit competencies and shift coverage must
                  be verified before a swap can be requested. Shift swap
                  requests are not connected yet.
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.neutral[50] },
  content: { paddingBottom: Spacing.xl },
  body: {
    padding: Spacing.base,
    gap: Spacing.base,
    maxWidth: 920,
    width: '100%',
    alignSelf: 'center',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral[200],
    borderRadius: Radius.md,
    padding: Spacing.xs,
    gap: Spacing.xs,
  },
  tab: {
    flex: 1,
    padding: Spacing.sm,
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: Radius.sm,
  },
  tabActive: { backgroundColor: Colors.neutral[0], ...Shadows.xs },
  tabText: {
    fontFamily: Fontconstants.SEMIBOLD,
    fontSize: fontScale(12),
    color: Colors.neutral[600],
    textAlign: 'center',
  },
  tealText: { color: Colors.teal[800] },
  whiteText: { color: Colors.neutral[0] },
  card: {
    backgroundColor: Colors.neutral[0],
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    borderRadius: Radius.base,
    padding: Spacing.base,
    ...Shadows.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  title: {
    flexShrink: 1,
    fontFamily: Fontconstants.BOLD,
    fontSize: fontScale(FontSize.md),
    color: Colors.neutral[900],
  },
  sectionTitle: {
    flexShrink: 1,
    fontFamily: Fontconstants.BOLD,
    fontSize: fontScale(FontSize.sm),
    color: Colors.neutral[900],
  },
  portalBadge: {
    fontFamily: Fontconstants.SEMIBOLD,
    fontSize: fontScale(11),
    color: Colors.teal[700],
    backgroundColor: Colors.teal[50],
    borderWidth: 1,
    borderColor: Colors.teal[200],
    borderRadius: Radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  copy: {
    fontFamily: Fontconstants.REGULAR,
    fontSize: fontScale(12),
    lineHeight: fontScale(18),
    color: Colors.neutral[500],
    marginTop: Spacing.xs,
  },
  balances: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  balance: {
    flexGrow: 1,
    flexBasis: 95,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.base,
    gap: Spacing.sm,
  },
  balanceLabel: {
    fontFamily: Fontconstants.SEMIBOLD,
    fontSize: fontScale(10),
    textAlign: 'center',
  },
  balanceValue: {
    fontFamily: Fontconstants.BOLD,
    fontSize: fontScale(FontSize.xl),
    color: Colors.neutral[900],
  },
  days: { fontFamily: Fontconstants.REGULAR, fontSize: fontScale(12) },
  balanceNote: {
    fontFamily: Fontconstants.REGULAR,
    fontSize: fontScale(10),
    textAlign: 'center',
  },
  blackoutCard: {
    borderWidth: 1,
    borderColor: Colors.warning[300],
    borderRadius: Radius.base,
    padding: Spacing.md,
    backgroundColor: Colors.warning[50],
    gap: Spacing.sm,
  },
  warningTitle: {
    flexShrink: 1,
    fontFamily: Fontconstants.SEMIBOLD,
    fontSize: fontScale(12),
    lineHeight: fontScale(18),
    color: Colors.warning[800],
  },
  blackoutItem: {
    backgroundColor: Colors.neutral[0],
    borderWidth: 1,
    borderColor: Colors.warning[200],
    borderRadius: Radius.sm,
    padding: Spacing.sm,
  },
  eventTitle: {
    flexGrow: 1,
    flexBasis: 230,
    fontFamily: Fontconstants.SEMIBOLD,
    fontSize: fontScale(12),
    color: Colors.neutral[900],
  },
  dateBadge: {
    fontFamily: Fontconstants.REGULAR,
    fontSize: fontScale(10),
    color: Colors.warning[800],
    backgroundColor: Colors.warning[100],
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  smallCopy: {
    fontFamily: Fontconstants.REGULAR,
    fontSize: fontScale(11),
    lineHeight: fontScale(17),
    color: Colors.neutral[500],
  },
  label: {
    fontFamily: Fontconstants.SEMIBOLD,
    fontSize: fontScale(12),
    color: Colors.neutral[800],
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  category: {
    flexGrow: 1,
    flexBasis: 85,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    borderRadius: Radius.md,
    backgroundColor: Colors.neutral[50],
  },
  categoryActive: {
    backgroundColor: Colors.teal[600],
    borderColor: Colors.teal[700],
  },
  categoryText: {
    fontFamily: Fontconstants.SEMIBOLD,
    fontSize: fontScale(12),
    color: Colors.neutral[800],
    textAlign: 'center',
  },
  dateRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  dateColumn: { flexGrow: 1, flexBasis: 145 },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: Radius.md,
    backgroundColor: Colors.neutral[50],
  },
  dateText: {
    flex: 1,
    minHeight: 44,
    paddingVertical: Spacing.sm,
    fontFamily: Fontconstants.REGULAR,
    fontSize: fontScale(12),
    color: Colors.neutral[900],
  },
  summary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.xs,
    marginVertical: Spacing.md,
  },
  strong: {
    fontFamily: Fontconstants.SEMIBOLD,
    fontSize: fontScale(12),
    color: Colors.neutral[900],
  },
  error: {
    fontFamily: Fontconstants.REGULAR,
    fontSize: fontScale(12),
    color: Colors.error[600],
    marginBottom: Spacing.sm,
  },
  advisory: {
    borderWidth: 1,
    borderColor: Colors.warning[400],
    borderRadius: Radius.md,
    backgroundColor: Colors.warning[50],
    padding: Spacing.md,
  },
  advisoryHeading: { flexDirection: 'row', gap: Spacing.sm },
  flex: { flex: 1 },
  warningCopy: {
    fontFamily: Fontconstants.REGULAR,
    fontSize: fontScale(12),
    lineHeight: fontScale(19),
    color: Colors.warning[800],
    marginTop: Spacing.xs,
  },
  acknowledgment: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.warning[200],
    paddingTop: Spacing.sm,
    marginTop: Spacing.sm,
    minHeight: 44,
  },
  checkbox: {
    height: 19,
    width: 19,
    borderWidth: 1,
    borderColor: Colors.neutral[400],
    borderRadius: 3,
    backgroundColor: Colors.neutral[0],
    alignItems: 'center',
    justifyContent: 'center',
  },
  acknowledgmentText: {
    flex: 1,
    fontFamily: Fontconstants.REGULAR,
    fontSize: fontScale(11),
    lineHeight: fontScale(17),
    color: Colors.warning[800],
  },
  input: {
    minHeight: 44,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.neutral[300],
    borderRadius: Radius.md,
    backgroundColor: Colors.neutral[50],
    fontFamily: Fontconstants.REGULAR,
    fontSize: fontScale(12),
    color: Colors.neutral[900],
  },
  reason: { minHeight: 76 },
  submit: { marginTop: Spacing.base },
  submitButton: {
    height: 'auto',
    minHeight: 44,
    padding: Spacing.md,
    gap: Spacing.sm,
    borderRadius: Radius.md,
  },
  submitText: { flexShrink: 1, textAlign: 'center' },
  history: {
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    borderRadius: Radius.md,
    padding: Spacing.md,
    backgroundColor: Colors.neutral[50],
  },
  historyDays: {
    fontFamily: Fontconstants.REGULAR,
    fontSize: fontScale(10),
    backgroundColor: Colors.neutral[200],
    color: Colors.neutral[600],
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
  },
  approved: {
    marginLeft: 'auto',
    fontFamily: Fontconstants.SEMIBOLD,
    fontSize: fontScale(10),
    color: Colors.teal[800],
    backgroundColor: Colors.success[100],
    borderRadius: Radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  historyCopy: {
    fontFamily: Fontconstants.REGULAR,
    fontSize: fontScale(11),
    lineHeight: fontScale(17),
    color: Colors.neutral[600],
    marginTop: Spacing.sm,
  },
});
