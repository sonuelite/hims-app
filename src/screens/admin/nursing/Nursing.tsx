import { Fontconstants } from '../../../constants/fontConstants';
import { fontScale } from '../../../utils/scale';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stethoscope } from 'lucide-react-native';
import {
  Colors,
  FontSize,
  FontWeight,
  Radius,
  Shadows,
  Spacing,
} from '../../../constants/theme';

// const nurses = [
//   'Sister Clara Vance, RN, BSN',
//   'David Miller, RN',
//   'Priya Sharma, RN',
//   'Olivia Bennett, RN',
//   'Marcus Reid, RN',
//   'Aisha Patel, RN',
//   'Eleanor Brooks, RN',
//   'Noah Williams, RN',
//   'Sofia Martinez, RN',
//   'James Anderson, RN',
// ];
const nurses = [
  'Sister Clara Vance',
  'David Miller',
  'Priya Sharma',
  'Olivia Bennett',
  'Marcus Reid',
  'Aisha Patel',
  'Eleanor Brooks',
  'Noah Williams',
  'Sofia Martinez',
  'James Anderson',
];
const Nursing = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Stethoscope size={24} color={Colors.primary[700]} />
          <View>
            <Text style={styles.title}>Nursing Team</Text>
            <Text style={styles.subtitle}>
              {nurses.length} nurses on the roster
            </Text>
          </View>
        </View>

        {nurses.map((nurse, index) => (
          <TouchableOpacity
            key={nurse}
            style={styles.nurseRow}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('StaffIdScreen', { nurseName: nurse })
            }
          >
            <View style={styles.number}>
              <Text style={styles.numberText}>{index + 1}</Text>
            </View>
            <Text style={styles.nurseName}>{nurse}</Text>
            {/* <Text style={styles.onDuty}>On Duty</Text> */}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Nursing;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.neutral[50] },
  content: { padding: Spacing.base },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  title: {
    fontFamily: Fontconstants.BOLD,
    fontSize: fontScale(FontSize.lg),
    fontWeight: FontWeight.bold,
    color: Colors.neutral[900],
  },
  subtitle: {
    fontFamily: Fontconstants.REGULAR,
    fontSize: fontScale(FontSize.sm),
    color: Colors.neutral[500],
    marginTop: 2,
  },
  nurseRow: {
    backgroundColor: Colors.neutral[0],
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    ...Shadows.sm,
    flexWrap: 'wrap',
    rowGap: Spacing.sm,
  },
  number: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary[100],
    marginRight: Spacing.sm,
  },
  numberText: {
    fontFamily: Fontconstants.BOLD,
    fontSize: fontScale(FontSize.sm),
    fontWeight: FontWeight.bold,
    color: Colors.primary[700],
  },
  nurseName: {
    fontFamily: Fontconstants.SEMIBOLD,
    flex: 1,
    fontSize: fontScale(FontSize.base),
    fontWeight: FontWeight.semibold,
    color: Colors.neutral[800],
    minWidth: 150,
  },
  onDuty: {
    fontFamily: Fontconstants.BOLD,
    fontSize: fontScale(FontSize.xs),
    fontWeight: FontWeight.bold,
    color: Colors.success[700],
    backgroundColor: Colors.success[100],
    paddingHorizontal: Spacing.sm,
    paddingVertical: 5,
    borderRadius: Radius.pill,
  },
});
