import { Colors, Spacing, FontSize } from '../../../../constants/theme';
import { Fontconstants } from '../../../../constants/fontConstants';
import { fontScale } from '../../../../utils/scale';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const NurseCompliance = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>NurseCompliance</Text>
    </View>
  );
};

export default NurseCompliance;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
    padding: Spacing.base,
  },
  title: {
    fontFamily: Fontconstants.REGULAR,
    fontSize: fontScale(FontSize.base),
    color: Colors.neutral[900],
  },
});
