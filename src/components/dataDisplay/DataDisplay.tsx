import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Colors, Radius, Spacing, FontSize, FontWeight, Shadows } from '../../constants/theme';
import { Star, Clock, MapPin, Video, Calendar } from 'lucide-react-native';


export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <View style={styles.stepper}>
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          <View style={styles.step}>
            <View style={[styles.stepCircle, i <= current ? styles.stepActive : null, i < current ? styles.stepDone : null]}>
              <Text style={[styles.stepText, i <= current ? styles.stepTextActive : null]}>
                {i < current ? '✓' : i + 1}
              </Text>
            </View>
            <Text style={[styles.stepLabel, i <= current ? styles.stepLabelActive : null]}>{step}</Text>
          </View>
          {i < steps.length - 1 && (
            <View style={[styles.stepConnector, i < current ? styles.stepConnectorActive : null]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stepper: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md },
  step: { alignItems: 'center', width: 60 },
  stepCircle: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.neutral[100],
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.neutral[200],
  },
  stepActive: { borderColor: Colors.primary[500], backgroundColor: Colors.primary[50] },
  stepDone: { backgroundColor: Colors.primary[600], borderColor: Colors.primary[600] },
  stepText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.neutral[400] },
  stepTextActive: { color: Colors.primary[700] },
  stepLabel: { fontSize: 9, color: Colors.neutral[400], marginTop: Spacing.xs, textAlign: 'center', fontWeight: FontWeight.medium },
  stepLabelActive: { color: Colors.primary[700] },
  stepConnector: { flex: 1, height: 2, backgroundColor: Colors.neutral[200], marginBottom: Spacing.xl },
  stepConnectorActive: { backgroundColor: Colors.primary[500] },
});
