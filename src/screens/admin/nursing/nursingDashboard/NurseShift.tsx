import {
  Colors,
  Spacing,
  FontSize,
  FontWeight,
  Radius,
  Shadows,
} from '../../../../constants/theme';
import { Fontconstants } from '../../../../constants/fontConstants';
import { fontScale } from '../../../../utils/scale';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FileText } from 'lucide-react-native';
import NursingButton from '../../../../components/nursing/NursingButton';
import {
  NurseHeader,
  UrgentAlert,
} from '../../../../components/nursing/NurseDashboardHeader';
import { useApp } from '../../../../context/AppContext';

// Reference shift data, consistent with the nursing dashboard fixtures.
const pendingMedicationCount = 6;

const NurseShift = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<{ NurseEmar: undefined }>>();
  const { notifications, showToast } = useApp();
  const openEmar = () => navigation.navigate('NurseEmar');
  const endShift = () => {
    Alert.alert(
      'End Shift & Clinical Handover',
      `${pendingMedicationCount} medication tasks remain on the floor. Review outstanding tasks and complete the Situation, Background, Assessment and Recommendation (SBAR) handover before ending your shift.\n\nPreview only. Shift validation and handover submission are not connected; your shift remains on duty.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Review eMAR', onPress: openEmar },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
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
        <UrgentAlert onAction={openEmar} />
        <View style={styles.body}>
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <View style={styles.titleContent}>
                <Text style={styles.title}>
                  Shift Management & Clinical Handover
                </Text>
                <Text style={styles.subtitle}>
                  Direct Bedside Shift Controls & Standardized SBAR Records
                </Text>
              </View>
              <View style={styles.dutyBadge}>
                <Text style={styles.dutyText}>On Duty (07:00 AM)</Text>
              </View>
            </View>
            <View style={styles.activeDuty}>
              <View style={styles.dutyContent}>
                <Text style={styles.label}>Active Floor Duty</Text>
                <Text style={styles.subtitle}>
                  {pendingMedicationCount} pending medication tasks left on
                  floor.
                </Text>
              </View>
              <NursingButton
                title="End Shift"
                variant="danger"
                onPress={endShift}
                accessibilityLabel="End shift and review clinical handover requirements"
              />
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.registryHeader}>
              <FileText size={18} color={Colors.teal[600]} />
              <Text style={styles.registryTitle}>
                SBAR Shift Handover Registry
              </Text>
            </View>
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>
                No handover logged for current shift
              </Text>
              <Text style={styles.emptyCopy}>
                Tapping "End Shift" will trigger the clinical handover
                validation check and SBAR submission.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default NurseShift;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  content: { paddingBottom: Spacing.xl },
  body: {
    padding: Spacing.base,
    gap: Spacing.base,
    maxWidth: 920,
    width: '100%',
    alignSelf: 'center',
  },
  card: {
    backgroundColor: Colors.neutral[0],
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    borderRadius: Radius.base,
    padding: Spacing.base,
    ...Shadows.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.base,
  },
  titleContent: { flexGrow: 1, flexBasis: 260 },
  title: {
    fontFamily: Fontconstants.BOLD,
    fontWeight: FontWeight.bold,
    fontSize: fontScale(FontSize.md),
    color: Colors.neutral[900],
  },
  subtitle: {
    fontFamily: Fontconstants.REGULAR,
    fontSize: fontScale(FontSize.sm),
    lineHeight: fontScale(19),
    color: Colors.neutral[500],
    marginTop: Spacing.xs,
  },
  dutyBadge: {
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.success[300],
    backgroundColor: Colors.success[100],
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  dutyText: {
    fontFamily: Fontconstants.SEMIBOLD,
    fontWeight: FontWeight.semibold,
    fontSize: fontScale(FontSize.sm),
    color: Colors.teal[700],
  },
  activeDuty: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.base,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    backgroundColor: Colors.neutral[50],
  },
  dutyContent: { flexGrow: 1, flexBasis: 180 },
  label: {
    fontFamily: Fontconstants.SEMIBOLD,
    fontWeight: FontWeight.semibold,
    fontSize: fontScale(FontSize.sm),
    color: Colors.neutral[900],
  },
  registryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  registryTitle: {
    flex: 1,
    fontFamily: Fontconstants.BOLD,
    fontWeight: FontWeight.bold,
    fontSize: fontScale(FontSize.base),
    color: Colors.neutral[900],
  },
  emptyState: {
    padding: Spacing.base,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    backgroundColor: Colors.neutral[50],
    alignItems: 'center',
  },
  emptyTitle: {
    fontFamily: Fontconstants.SEMIBOLD,
    fontWeight: FontWeight.semibold,
    fontSize: fontScale(FontSize.sm),
    color: Colors.neutral[800],
    textAlign: 'center',
  },
  emptyCopy: {
    fontFamily: Fontconstants.REGULAR,
    fontSize: fontScale(FontSize.sm),
    lineHeight: fontScale(19),
    color: Colors.neutral[500],
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
});
