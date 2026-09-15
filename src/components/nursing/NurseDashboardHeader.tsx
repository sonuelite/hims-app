import NursingButton from './NursingButton';
import { Fontconstants } from '../../constants/fontConstants';
import { fontScale } from '../../utils/scale';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  AlertTriangle,
  Bell,
  MapPin,
  SlidersHorizontal,
  Stethoscope,
} from 'lucide-react-native';
import {
  Colors,
  FontSize,
  FontWeight,
  Radius,
  Spacing,
} from '../../constants/theme';

export function NurseHeader({
  topInset,
  unread,
  onAlert,
}: {
  topInset: number;
  unread: number;
  onAlert: () => void;
}) {
  return (
    <View style={[styles.headerWrap, { paddingTop: topInset }]}>
      <View style={styles.identity}>
        <View style={styles.avatar}>
          <Stethoscope size={25} color={Colors.primary[700]} />
        </View>
        <View style={styles.unitContent}>
          <View style={styles.nameRow}>
            <Text style={styles.nurseName}>Sister Clara Vance, RN, BSN</Text>
            <Text style={styles.rnBadge}>RN-8492</Text>
          </View>
          <Text style={styles.role}>
            Senior Staff Nurse (Cardiac Step-Down)
          </Text>
        </View>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Show nursing alerts"
          style={styles.bell}
          onPress={onAlert}
        >
          <Bell size={20} color={Colors.neutral[700]} />
          {unread > 0 && <Text style={styles.badge}>{unread}</Text>}
        </TouchableOpacity>
        <NursingButton
          title="Admin"
          variant="outline"
          icon={<SlidersHorizontal size={16} color={Colors.primary[600]} />}
          style={styles.adminAction}
          onPress={() =>
            Alert.alert(
              'Nursing Administration',
              'Staff ID: RN-8492\nDesignated unit: W-4B\nShift started: 07:00 AM',
            )
          }
        />
      </View>
      <View style={styles.unitRow}>
        <View style={styles.unit}>
          <MapPin size={16} color={Colors.primary[600]} />
          <View style={styles.unitContent}>
            <Text style={styles.overline}>DESIGNATED UNIT</Text>
            <Text style={styles.unitValue}>
              W-4B · Ward 4B - Step-Down & Acute Cardiology
            </Text>
          </View>
        </View>
        <Text style={styles.duty}>● On Duty (07:00 AM)</Text>
      </View>
    </View>
  );
}

export function UrgentAlert({ onAction }: { onAction: () => void }) {
  return (
    <View style={styles.urgent}>
      <View style={styles.urgentMain}>
        <View style={styles.alertIcon}>
          <AlertTriangle size={18} color={Colors.error[600]} />
        </View>
        <View style={styles.unitContent}>
          <View style={styles.alertMeta}>
            <Text style={styles.alertLabel}>URGENT PUSH ALERT</Text>
            <Text style={styles.alertTime}>Just now (08:00 AM)</Text>
          </View>
          <Text style={styles.alertTitle}>
            URGENT MEDICATION ALERT: Lasix IV Push
          </Text>
          <Text style={styles.alertCopy}>
            Bed 404-B (Eleanor Zhang): Furosemide 40mg IV Push is due now for
            acute dyspnea and tachycardia.
          </Text>
        </View>
        <NursingButton
          title="Take Action"
          variant="danger"
          style={styles.urgentAction}
          onPress={onAction}
        />
      </View>
      <View style={styles.urgentFooter}>
        <Text style={styles.moreAlerts}>
          +1 more active clinical push alerts awaiting attention
        </Text>
        <Text style={styles.queue}>Priority Queue</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  adminAction: { marginLeft: Spacing.sm },
  urgentAction: { width: '100%' },

  unitContent: { flexGrow: 1, flexBasis: 180 },
  headerWrap: {
    backgroundColor: Colors.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  identity: {
    padding: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    rowGap: Spacing.sm,
  },
  avatar: {
    height: 46,
    width: 46,
    borderRadius: 23,
    backgroundColor: Colors.primary[50],
    borderWidth: 1,
    borderColor: Colors.primary[300],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  nurseName: {
    fontFamily: Fontconstants.BOLD,
    fontSize: fontScale(FontSize.base),
    fontWeight: FontWeight.bold,
    color: Colors.neutral[900],
  },
  rnBadge: {
    fontFamily: Fontconstants.BOLD,
    fontSize: fontScale(11),
    fontWeight: FontWeight.bold,
    color: Colors.primary[700],
    backgroundColor: Colors.primary[100],
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: Radius.xs,
  },
  role: {
    fontFamily: Fontconstants.REGULAR,
    fontSize: fontScale(13),
    color: Colors.neutral[500],
    marginTop: 2,
  },
  bell: {
    height: 44,
    width: 44,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    backgroundColor: Colors.neutral[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    fontFamily: Fontconstants.BOLD,
    position: 'absolute',
    top: -6,
    right: -5,
    minWidth: 18,
    borderRadius: 8,
    backgroundColor: Colors.error[500],
    color: Colors.neutral[0],
    fontSize: fontScale(11),
    fontWeight: FontWeight.bold,
    textAlign: 'center',
    lineHeight: fontScale(16),
    minHeight: 18,
  },
  unitRow: {
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  unit: {
    flexGrow: 1,
    flexBasis: 230,
    backgroundColor: Colors.neutral[50],
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    padding: Spacing.sm,
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  overline: {
    fontFamily: Fontconstants.BOLD,
    fontSize: fontScale(11),
    color: Colors.primary[700],
    fontWeight: FontWeight.bold,
  },
  unitValue: {
    fontFamily: Fontconstants.SEMIBOLD,
    fontSize: fontScale(13),
    color: Colors.neutral[700],
    fontWeight: FontWeight.semibold,
  },
  duty: {
    fontFamily: Fontconstants.BOLD,
    fontSize: fontScale(13),
    color: Colors.success[700],
    fontWeight: FontWeight.bold,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.success[300],
    backgroundColor: Colors.success[50],
    paddingHorizontal: Spacing.sm,
    paddingVertical: 9,
  },
  urgent: {
    marginHorizontal: Spacing.base,
    marginTop: Spacing.base,
    backgroundColor: Colors.error[50],
    borderWidth: 1,
    borderColor: Colors.error[200],
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  urgentMain: {
    padding: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  alertIcon: {
    width: 31,
    height: 31,
    borderRadius: 10,
    backgroundColor: Colors.error[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertMeta: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: 7,
    alignItems: 'center',
  },
  alertLabel: {
    fontFamily: Fontconstants.BOLD,
    fontSize: fontScale(13),
    color: Colors.error[600],
    fontWeight: FontWeight.bold,
  },
  alertTime: {
    fontFamily: Fontconstants.REGULAR,
    fontSize: fontScale(11),
    color: Colors.neutral[500],
  },
  alertTitle: {
    fontFamily: Fontconstants.BOLD,
    fontSize: fontScale(13),
    color: Colors.error[900],
    fontWeight: FontWeight.bold,
    marginTop: 2,
  },
  alertCopy: {
    fontFamily: Fontconstants.REGULAR,
    fontSize: fontScale(11),
    color: Colors.error[800],
    marginTop: 2,
  },

  urgentFooter: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.error[100],
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  moreAlerts: {
    fontFamily: Fontconstants.SEMIBOLD,
    flex: 1,
    marginRight: Spacing.sm,
    fontSize: fontScale(11),
    color: Colors.error[600],
    fontWeight: FontWeight.semibold,
  },
  queue: {
    fontFamily: Fontconstants.BOLD,
    fontSize: fontScale(11),
    color: Colors.error[700],
    backgroundColor: Colors.error[100],
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: Radius.xs,
    fontWeight: FontWeight.bold,
    alignSelf: 'flex-start',
  },
});
