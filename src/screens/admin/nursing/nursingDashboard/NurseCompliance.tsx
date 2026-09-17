import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Award,
  Camera,
  CheckCircle2,
  Clock3,
  FileCheck2,
  GraduationCap,
  Laptop,
  MapPin,
  ShieldCheck,
  Stethoscope,
  Volume2,
} from 'lucide-react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import {
  NurseHeader,
  UrgentAlert,
} from '../../../../components/nursing/NurseDashboardHeader';
import CustomButton from '../../../../components/customButton/CustomButton';
import { Colors, Radius, Shadows, Spacing } from '../../../../constants/theme';
import { Fontconstants } from '../../../../constants/fontConstants';
import { fontScale } from '../../../../utils/scale';
import { useApp } from '../../../../context/AppContext';

// Reference fixtures matching the nursing dashboard; HR services are not connected.
const competencies = [
  'ACLS Certified',
  'BLS Certified',
  'IV Cannulation L3',
  'Cardiac Telemetry Monitoring',
  'Biomedical Waste Protocol',
];
const courses = [
  {
    title: 'Hospital Infection Control (HIC) & Sepsis Prevention',
    code: 'HIC-2026-ANNUAL',
    description: 'Patient Safety & Infection Prevention',
    hours: 4,
    validUntil: '2026-09-28',
    due: true,
  },
  {
    title: 'Fire Safety, Disaster Code Red & Evacuation Protocols',
    code: 'FIRE-2026-MANDATORY',
    description: 'Hospital Emergency Readiness',
    hours: 2,
    validUntil: '2027-04-15',
    due: false,
  },
  {
    title: 'Biomedical Waste Management (BMW) & Needle-Stick Protocol',
    code: 'BMW-2026-STATUTORY',
    description: 'Occupational Health & Environmental Safety',
    hours: 3,
    validUntil: '2026-10-08',
    due: true,
  },
  {
    title: 'Advanced Cardiovascular Life Support (ACLS - AHA)',
    code: 'AHA-ACLS-2025',
    description: 'Critical Resuscitation Competency',
    hours: 16,
    validUntil: '2027-08-20',
    due: false,
  },
];
const summary = [
  {
    label: 'Completed & Verified',
    value: '2 Modules',
    color: Colors.success[600],
  },
  {
    label: 'Due Soon (< 30 Days)',
    value: '2 Modules',
    color: Colors.warning[600],
  },
  { label: 'Total CEU Credits', value: '25 Earned', color: Colors.teal[600] },
];
function Action({
  title,
  onPress,
  icon,
  outline = false,
  dark = false,
}: {
  title: string;
  onPress: () => void;
  icon: React.ReactNode;
  outline?: boolean;
  dark?: boolean;
}) {
  return (
    <CustomButton
      title={title}
      onPress={onPress}
      disable={false}
      leftIcon={icon}
      bgColor={
        outline
          ? Colors.teal[50]
          : dark
          ? Colors.neutral[900]
          : Colors.teal[600]
      }
      txtColor={outline ? Colors.teal[700] : Colors.neutral[0]}
      borderWidth={outline ? 1 : 0}
      borderColor={Colors.teal[300]}
      fontsize={12}
      buttonStyle={styles.button}
      textStyle={styles.buttonText}
      accessibilityLabel={title}
    />
  );
}
export default function NurseCompliance() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<{ NurseEmar: undefined }>>();
  const { notifications, showToast } = useApp();
  const enroll = (title: string, mode: string) =>
    Alert.alert(
      `${mode} Enrollment`,
      `${title}\n\nTraining enrollment is not connected yet. Please contact the nursing education team to book this course. No enrollment has been submitted.`,
    );
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
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
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.avatar}>
                <Stethoscope size={28} color={Colors.teal[600]} />
              </View>
              <View style={styles.identity}>
                <View style={styles.row}>
                  <Text style={styles.title}>Sister Clara Vance, RN, BSN</Text>
                  <Text style={styles.badge}>RN-8492</Text>
                </View>
                <Text style={styles.copy}>
                  Senior Staff Nurse (Cardiac Step-Down)
                </Text>
                <Text style={styles.tealCopy}>
                  Division of Inpatient Medicine
                </Text>
              </View>
              <View style={styles.status}>
                <Text style={styles.overline}>STATUS</Text>
                <View style={styles.statusBadge}>
                  <ShieldCheck size={14} color={Colors.teal[700]} />
                  <Text style={styles.badgeText}>Active Staff RN</Text>
                </View>
              </View>
            </View>
            <View style={styles.divider} />
            <Text style={styles.overline}>
              VERIFIED CORE CLINICAL COMPETENCIES:
            </Text>
            <View style={styles.chips}>
              {competencies.map(item => (
                <View key={item} style={styles.chip}>
                  <CheckCircle2 size={13} color={Colors.teal[600]} />
                  <Text style={styles.chipText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.row}>
              <Award size={18} color={Colors.teal[600]} />
              <Text style={styles.title}>
                Mandatory Training Compliance Status
              </Text>
              <Text style={styles.badge}>Target: 100%</Text>
            </View>
            <Text style={styles.copy}>
              Annual Statutory & Clinical Competency Fulfillment
            </Text>
            <View style={styles.summary}>
              <View
                style={styles.ring}
                accessibilityRole="progressbar"
                accessibilityLabel="Training compliance"
                accessibilityValue={{ min: 0, max: 100, now: 84 }}
              >
                <Svg width={124} height={124} viewBox="0 0 124 124">
                  <Circle
                    cx={62}
                    cy={62}
                    r={53}
                    fill="none"
                    stroke={Colors.neutral[200]}
                    strokeWidth={10}
                  />
                  <Circle
                    cx={62}
                    cy={62}
                    r={53}
                    fill="none"
                    stroke={Colors.teal[600]}
                    strokeWidth={10}
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 53}`}
                    strokeDashoffset={2 * Math.PI * 53 * 0.16}
                    rotation={-90}
                    origin="62, 62"
                  />
                </Svg>
                <View style={styles.ringLabel}>
                  <Text style={styles.percentage}>84%</Text>
                  <Text style={styles.ringCaption}>COMPLIANT</Text>
                </View>
              </View>
              <View style={styles.metrics}>
                {summary.map(item => (
                  <View key={item.label} style={styles.metric}>
                    <View
                      style={[styles.dot, { backgroundColor: item.color }]}
                    />
                    <Text style={styles.metricLabel}>{item.label}</Text>
                    <Text style={[styles.metricValue, { color: item.color }]}>
                      {item.value}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
          <View style={styles.licenseCard}>
            <Svg
              width="100%"
              height="100%"
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            >
              <Defs>
                <LinearGradient
                  id="licenseBackground"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <Stop offset="0" stopColor={Colors.teal[900]} />
                  <Stop offset="0.55" stopColor={Colors.neutral[900]} />
                  <Stop offset="1" stopColor="#043b35" />
                </LinearGradient>
              </Defs>
              <Rect width="100%" height="100%" fill="url(#licenseBackground)" />
            </Svg>
            <View style={styles.row}>
              <Clock3 size={17} color={Colors.teal[300]} />
              <Text style={styles.countdownTitle}>
                THE COMPLIANCE COUNTDOWN
              </Text>
              <Text style={styles.renewalBadge}>Renewal Window Open</Text>
            </View>
            <Text style={[styles.title, styles.white, styles.topGap]}>
              Active State Nursing Council License Validity
            </Text>
            <Text style={styles.lightCopy}>
              State Nursing & Midwives Council · Registration #RN-SNC-2021-93821
            </Text>
            <View style={styles.licenseStats}>
              <View style={styles.licenseStat}>
                <Text style={styles.statLabel}>REMAINING</Text>
                <Text style={styles.remaining}>78</Text>
                <Text style={styles.lightCopy}>Days</Text>
              </View>
              <View style={styles.licenseStat}>
                <Text style={styles.statLabel}>EXPIRES ON</Text>
                <Text style={styles.statValue}>Nov 28, 2026</Text>
                <Text style={styles.lightCopy}>Statutory Term</Text>
              </View>
              <View style={styles.licenseStat}>
                <Text style={styles.statLabel}>CLINICAL PRIVILEGES</Text>
                <View style={styles.row}>
                  <ShieldCheck size={14} color={Colors.teal[300]} />
                  <Text style={styles.active}>Active</Text>
                </View>
                <Text style={styles.lightCopy}>Full Bedside</Text>
              </View>
            </View>
            <View style={styles.licenseFooter}>
              <Text style={styles.lightCopy}>
                Automatic push notifications before expiration date:
              </Text>
              <Text style={styles.alertBadge}>Alerts Active (90/60/30d)</Text>
            </View>
            <Action
              title="Simulate License Expiration Push Notification"
              dark
              icon={<Volume2 size={16} color={Colors.teal[300]} />}
              onPress={() =>
                showToast(
                  'Simulation: Your nursing license expires on November 28, 2026. Please contact HR to renew.',
                  'info',
                )
              }
            />
          </View>
          <View style={styles.card}>
            <View style={styles.row}>
              <Camera size={18} color={Colors.teal[600]} />
              <Text style={styles.title}>
                Certificate Camera Upload (Central HR Verification)
              </Text>
              <Text style={styles.badge}>Direct to HR</Text>
            </View>
            <Text style={styles.copy}>
              Snap a photo of newly printed BLS, ACLS, or NRP certificates using
              your phone camera.
            </Text>
            <View style={styles.topSpace}>
              <Action
                title="Launch Camera to Snap Certificate Photo"
                icon={<Camera size={17} color={Colors.neutral[0]} />}
                onPress={() =>
                  Alert.alert(
                    'Certificate Camera Upload',
                    'Camera capture and HR uploads are not connected yet. Please submit your certificate to HR through your existing hospital process.',
                  )
                }
              />
            </View>
            <View style={styles.divider} />
            <Text style={styles.overline}>
              RECENT CERTIFICATE CAMERA UPLOADS TO HR:
            </Text>
            <View style={styles.certificate}>
              <View style={styles.fileIcon}>
                <FileCheck2 size={22} color={Colors.teal[700]} />
              </View>
              <View style={styles.identity}>
                <Text style={styles.courseTitle}>
                  ACLS Certificate (#AHA-ACLS-994102)
                </Text>
                <Text style={styles.copy}>
                  Uploaded on 2025-08-22 · Valid through 2027-08-20
                </Text>
              </View>
              <Text style={styles.verified}>Verified</Text>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.row}>
              <GraduationCap size={19} color={Colors.teal[600]} />
              <Text style={styles.title}>
                Mandatory Annual Re-Certifications
              </Text>
            </View>
            <Text style={styles.copy}>
              Hospital Infection Control, Fire Safety, and Biomedical Waste
              Management with 1-Click Enrollment.
            </Text>
            {courses.map(course => (
              <View
                key={course.code}
                style={[styles.course, course.due && styles.dueCourse]}
              >
                <View style={styles.row}>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                  <Text style={course.due ? styles.dueBadge : styles.verified}>
                    {course.due ? 'Due Soon' : 'Compliant'}
                  </Text>
                </View>
                <Text style={styles.courseCode}>{course.code}</Text>
                <Text style={styles.copy}>
                  {course.description} · {course.hours} CEU Hours
                </Text>
                <Text style={[styles.copy, styles.topSpace]}>
                  Valid Until:{' '}
                  <Text style={styles.strong}>{course.validUntil}</Text>
                </Text>
                <View style={styles.divider} />
                <View style={styles.enrollActions}>
                  <View style={styles.enrollAction}>
                    <Action
                      title="1-Click Enroll (Classroom)"
                      outline
                      icon={<MapPin size={15} color={Colors.teal[600]} />}
                      onPress={() => enroll(course.title, 'Classroom')}
                    />
                  </View>
                  <View style={styles.enrollAction}>
                    <Action
                      title="1-Click Enroll (E-Learning)"
                      dark
                      icon={<Laptop size={15} color={Colors.teal[300]} />}
                      onPress={() => enroll(course.title, 'E-Learning')}
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.neutral[50] },
  content: { paddingBottom: Spacing.xl },
  body: { padding: Spacing.base, gap: Spacing.base },
  card: {
    backgroundColor: Colors.neutral[0],
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    borderRadius: Radius.base,
    padding: Spacing.base,
    ...Shadows.xs,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  title: {
    flexGrow: 1,
    flexShrink: 1,
    fontFamily: Fontconstants.BOLD,
    fontSize: fontScale(14),
    color: Colors.neutral[900],
  },
  copy: {
    fontFamily: Fontconstants.REGULAR,
    fontSize: fontScale(11),
    lineHeight: fontScale(17),
    color: Colors.neutral[500],
    marginTop: 3,
  },
  tealCopy: {
    fontFamily: Fontconstants.MEDIUM,
    fontSize: fontScale(11),
    color: Colors.teal[700],
    marginTop: 3,
  },
  identity: { flexGrow: 1, flexBasis: 180 },
  avatar: {
    width: 54,
    height: 54,
    borderWidth: 2,
    borderColor: Colors.teal[500],
    borderRadius: Radius.base,
    backgroundColor: Colors.teal[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  status: { gap: 5 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 6,
    borderWidth: 1,
    borderColor: Colors.teal[200],
    backgroundColor: Colors.teal[50],
    borderRadius: Radius.sm,
  },
  badgeText: {
    fontFamily: Fontconstants.SEMIBOLD,
    fontSize: fontScale(11),
    color: Colors.teal[700],
  },
  badge: {
    fontFamily: Fontconstants.SEMIBOLD,
    fontSize: fontScale(10),
    color: Colors.teal[700],
    backgroundColor: Colors.teal[50],
    borderRadius: Radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
    overflow: 'hidden',
  },
  overline: {
    fontFamily: Fontconstants.SEMIBOLD,
    fontSize: fontScale(10),
    color: Colors.neutral[500],
    letterSpacing: 0.4,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.neutral[100],
    marginVertical: Spacing.md,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.neutral[50],
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: Radius.sm,
  },
  chipText: {
    fontFamily: Fontconstants.MEDIUM,
    fontSize: fontScale(10),
    color: Colors.neutral[700],
    flexShrink: 1,
  },
  summary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.base,
    padding: Spacing.md,
    marginTop: Spacing.md,
    backgroundColor: Colors.neutral[50],
    borderRadius: Radius.base,
    borderWidth: 1,
    borderColor: Colors.neutral[100],
  },
  ring: { width: 124, height: 124 },
  ringLabel: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentage: {
    fontFamily: Fontconstants.BOLD,
    fontSize: fontScale(23),
    color: Colors.neutral[900],
  },
  ringCaption: {
    fontFamily: Fontconstants.BOLD,
    fontSize: fontScale(9),
    letterSpacing: 0.7,
    color: Colors.teal[700],
  },
  metrics: { flexGrow: 1, flexBasis: 220, gap: Spacing.sm },
  metric: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    padding: Spacing.sm,
    backgroundColor: Colors.neutral[0],
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    borderRadius: Radius.sm,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  metricLabel: {
    flexGrow: 1,
    fontFamily: Fontconstants.REGULAR,
    fontSize: fontScale(11),
    color: Colors.neutral[500],
  },
  metricValue: { fontFamily: Fontconstants.SEMIBOLD, fontSize: fontScale(11) },
  licenseCard: {
    backgroundColor: Colors.neutral[900],
    padding: Spacing.base,
    borderRadius: Radius.base,
    overflow: 'hidden',
  },
  countdownTitle: {
    flexGrow: 1,
    flexShrink: 1,
    fontFamily: Fontconstants.BOLD,
    fontSize: fontScale(12),
    color: Colors.teal[300],
    letterSpacing: 0.4,
  },
  renewalBadge: {
    fontFamily: Fontconstants.BOLD,
    fontSize: fontScale(9),
    color: Colors.neutral[900],
    backgroundColor: Colors.warning[500],
    borderRadius: Radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
    overflow: 'hidden',
  },
  white: { color: Colors.neutral[0] },
  topGap: { marginTop: 6 },
  lightCopy: {
    fontFamily: Fontconstants.REGULAR,
    fontSize: fontScale(10),
    lineHeight: fontScale(16),
    color: Colors.neutral[300],
    flexShrink: 1,
  },
  licenseStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    backgroundColor: '#ffffff18',
    borderWidth: 1,
    borderColor: '#ffffff20',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginTop: Spacing.md,
  },
  licenseStat: {
    flexGrow: 1,
    flexBasis: 85,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statLabel: {
    fontFamily: Fontconstants.SEMIBOLD,
    fontSize: fontScale(9),
    color: Colors.neutral[300],
    textAlign: 'center',
  },
  remaining: {
    fontFamily: Fontconstants.BOLD,
    fontSize: fontScale(23),
    color: Colors.warning[400],
  },
  statValue: {
    fontFamily: Fontconstants.BOLD,
    fontSize: fontScale(12),
    color: Colors.neutral[0],
  },
  active: {
    fontFamily: Fontconstants.SEMIBOLD,
    fontSize: fontScale(12),
    color: Colors.teal[300],
  },
  licenseFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#ffffff20',
    marginTop: Spacing.md,
    paddingVertical: Spacing.md,
  },
  alertBadge: {
    fontFamily: Fontconstants.SEMIBOLD,
    fontSize: fontScale(9),
    color: Colors.neutral[0],
    backgroundColor: Colors.teal[600],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  button: {
    height: 'auto',
    minHeight: 44,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    gap: 6,
  },
  buttonText: { flexShrink: 1, textAlign: 'center' },
  topSpace: { marginTop: Spacing.md },
  certificate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    backgroundColor: Colors.neutral[50],
    borderRadius: Radius.md,
  },
  fileIcon: {
    width: 38,
    height: 38,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.teal[100],
  },
  verified: {
    fontFamily: Fontconstants.SEMIBOLD,
    fontSize: fontScale(9),
    color: Colors.teal[800],
    backgroundColor: Colors.teal[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  course: {
    padding: Spacing.md,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    borderRadius: Radius.md,
  },
  dueCourse: { borderColor: Colors.warning[300], backgroundColor: '#fffdf5' },
  courseTitle: {
    flexGrow: 1,
    flexShrink: 1,
    fontFamily: Fontconstants.SEMIBOLD,
    fontSize: fontScale(12),
    lineHeight: fontScale(18),
    color: Colors.neutral[900],
  },
  courseCode: {
    alignSelf: 'flex-start',
    marginTop: 5,
    fontFamily: Fontconstants.REGULAR,
    fontSize: fontScale(9),
    color: Colors.neutral[500],
    backgroundColor: Colors.neutral[100],
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
  },
  dueBadge: {
    fontFamily: Fontconstants.SEMIBOLD,
    fontSize: fontScale(9),
    color: Colors.warning[800],
    backgroundColor: Colors.warning[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  strong: { fontFamily: Fontconstants.SEMIBOLD, color: Colors.neutral[800] },
  enrollActions: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  enrollAction: { flexGrow: 1, flexBasis: 200 },
});
