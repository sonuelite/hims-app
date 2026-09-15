import { Colors } from '../../constants/theme';
import { Fontconstants } from '../../constants/fontConstants';
import { fontScale } from '../../utils/scale';
import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import NursingButton from './NursingButton';

type Props = {
  patient: {
    bed: string;
    name: string;
    mrn: string;
    diagnosis: string;
    flags: string[];
  };
  onClose: () => void;
  onEmar: () => void;
};

// Reference fixture from the supplied design; replace with patient records when available.
const referenceRecord = {
  admitted: '2026-09-08',
  attending: 'Dr. Alistair Ross, MD (Cardiology)',
  diet: '2g Sodium Cardiac Diet',
  telemetry: [
    { time: '02:00', hr: 82, spo2: 97 },
    { time: '04:00', hr: 84, spo2: 96 },
    { time: '06:00', hr: 86, spo2: 95 },
    { time: '07:45', hr: 88, spo2: 96 },
  ],
  notes: [
    {
      author: 'Dr. Ross, MD',
      time: '07:30 AM',
      text: 'Continue Heparin infusion protocol. Titrate per anti-Xa lab result at 10:00 AM.',
    },
    {
      author: 'Night RN David',
      time: '06:15 AM',
      text: 'Patient tolerated night well without chest discomfort. Radial puncture site dry and intact.',
    },
  ],
};

export default function MedicalRecordsModal({
  patient,
  onClose,
  onEmar,
}: Props) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const compact = width < 600;
  const record = patient.mrn === 'MRN-884902' ? referenceRecord : undefined;
  const codeStatus = patient.flags.find(
    flag => flag === 'FULL CODE' || flag === 'DNR',
  );

  return (
    <Modal transparent visible animationType="fade" onRequestClose={onClose}>
      <View
        style={[
          styles.overlay,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 },
        ]}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessible={false}
        />
        <View
          accessibilityViewIsModal
          style={[
            styles.modal,
            {
              maxHeight: Math.max(
                0,
                (height - insets.top - insets.bottom - 32) * 0.9,
              ),
            },
          ]}
        >
          <View style={[styles.header, compact && styles.compactPadding]}>
            <View style={styles.headerContent}>
              <View style={styles.identity}>
                <Text style={styles.bed}>Bed {patient.bed}</Text>
                <Text accessibilityRole="header" style={styles.name}>
                  {patient.name}
                </Text>
                <Text style={styles.metadata}>MRN: {patient.mrn}</Text>
              </View>
              <Text style={styles.metadata}>
                Admitted: {record?.admitted ?? 'Not available'}
                {' • '}
                Attending: {record?.attending ?? 'Not available'}
              </Text>
            </View>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Close medical records"
              onPress={onClose}
              style={styles.close}
            >
              <X size={21} color={Colors.neutral[400]} />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[
              styles.content,
              compact && styles.compactPadding,
            ]}
          >
            <View style={[styles.card, styles.shaded]}>
              <Text style={[styles.sectionTitle, styles.teal]}>
                PRIMARY DIAGNOSIS & CLINICAL SUMMARY
              </Text>
              <Text style={styles.diagnosis}>{patient.diagnosis}</Text>
              <View style={styles.summaryFields}>
                <View style={styles.field}>
                  <Text style={styles.label}>Dietary Order:</Text>
                  <Text style={styles.value}>
                    {record?.diet ?? 'Not available'}
                  </Text>
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Code Status:</Text>
                  <Text style={[styles.value, styles.teal]}>
                    {codeStatus ?? 'Not available'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>
                TELEMETRY TREND HISTORY (LAST 6 HOURS)
              </Text>
              {record ? (
                <View style={styles.telemetry}>
                  {record.telemetry.map(reading => (
                    <View
                      key={reading.time}
                      style={[styles.reading, compact && styles.compactReading]}
                    >
                      <Text style={styles.time}>{reading.time}</Text>
                      <Text style={styles.heartRate}>HR: {reading.hr}</Text>
                      <Text style={styles.oxygen}>SpO2: {reading.spo2}%</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.empty}>
                  No telemetry history available.
                </Text>
              )}
            </View>

            <View style={styles.notes}>
              <Text style={styles.sectionTitle}>
                PHYSICIAN & HANDOVER CLINICAL NOTES
              </Text>
              {record ? (
                record.notes.map(note => (
                  <View
                    key={`${note.author}-${note.time}`}
                    style={[styles.card, styles.shaded]}
                  >
                    <View style={styles.noteHeader}>
                      <Text style={styles.author}>{note.author}</Text>
                      <Text style={styles.oxygen}>{note.time}</Text>
                    </View>
                    <Text style={styles.noteText}>{note.text}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.empty}>No clinical notes available.</Text>
              )}
            </View>

            <NursingButton
              title={`Open eMAR Schedule for ${patient.name}`}
              onPress={onEmar}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.62)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modal: {
    width: '100%',
    maxWidth: 680,
    backgroundColor: Colors.neutral[0],
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[50],
    padding: 22,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
    gap: 12,
  },
  headerContent: { flex: 1, gap: 6 },
  identity: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
  },
  bed: {
    fontFamily: Fontconstants.BOLD,
    backgroundColor: Colors.primary[600],
    color: Colors.neutral[0],
    fontSize: fontScale(13),
    fontWeight: '700',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 5,
  },
  name: {
    fontFamily: Fontconstants.BOLD,
    fontSize: fontScale(20),
    fontWeight: '700',
    color: Colors.neutral[900],
    flexShrink: 1,
  },
  metadata: {
    fontFamily: Fontconstants.REGULAR,
    color: Colors.neutral[500],
    fontSize: fontScale(14),
    lineHeight: fontScale(21),
  },
  close: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: { flexShrink: 1 },
  content: { padding: 22, gap: 18 },
  compactPadding: { padding: 14 },
  card: {
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    borderRadius: 12,
    padding: 14,
  },
  shaded: { backgroundColor: Colors.neutral[50] },
  sectionTitle: {
    fontFamily: Fontconstants.BOLD,
    color: Colors.neutral[500],
    fontSize: fontScale(12),
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  teal: { color: Colors.primary[700] },
  diagnosis: {
    fontFamily: Fontconstants.BOLD,
    color: Colors.neutral[900],
    fontSize: fontScale(15),
    fontWeight: '700',
    marginTop: 10,
    lineHeight: fontScale(21),
  },
  summaryFields: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral[200],
    paddingTop: 12,
    marginTop: 8,
  },
  field: { flex: 1, minWidth: 120, gap: 3 },
  label: {
    fontFamily: Fontconstants.REGULAR,
    fontSize: fontScale(13),
    color: Colors.neutral[500],
  },
  value: {
    fontFamily: Fontconstants.MEDIUM,
    fontSize: fontScale(13),
    fontWeight: '500',
    color: Colors.neutral[800],
  },
  telemetry: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 12 },
  reading: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
    borderWidth: 1,
    borderColor: Colors.neutral[100],
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 10,
    gap: 4,
  },
  compactReading: { flexBasis: '40%' },
  time: {
    fontFamily: Fontconstants.REGULAR,
    color: Colors.neutral[400],
    fontSize: fontScale(12),
    fontVariant: ['tabular-nums'],
  },
  heartRate: {
    fontFamily: Fontconstants.BOLD,
    color: Colors.neutral[800],
    fontSize: fontScale(15),
    fontWeight: '700',
    marginTop: 3,
  },
  oxygen: {
    fontFamily: Fontconstants.REGULAR,
    color: Colors.neutral[500],
    fontSize: fontScale(12),
  },
  notes: { gap: 12 },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  author: {
    fontFamily: Fontconstants.BOLD,
    color: Colors.primary[700],
    fontSize: fontScale(12),
    fontWeight: '700',
  },
  noteText: {
    fontFamily: Fontconstants.REGULAR,
    color: Colors.neutral[600],
    fontSize: fontScale(14),
    lineHeight: fontScale(23),
    marginTop: 8,
  },
  empty: {
    fontFamily: Fontconstants.REGULAR,
    color: Colors.neutral[500],
    fontSize: fontScale(13),
    marginTop: 12,
  },
});
