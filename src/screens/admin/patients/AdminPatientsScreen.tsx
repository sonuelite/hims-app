import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import {
  Colors,
  Spacing,
  FontSize,
  FontWeight,
  Radius,
  Shadows,
} from '../../../constants/theme';

import {
  Card,
  EmptyState,
} from '../../../components/ui/Card';

import { Avatar } from '../../../components/ui/DataDisplay';

import {
  Search,
  Users,
  ChevronRight,
  UserPlus,
  CalendarPlus,
  BedDouble,
} from 'lucide-react-native';

import { useApp } from '../../../context/AppContext';

const AdminPatientsScreen = () => {
  const insets = useSafeAreaInsets();

  const navigation = useNavigation<any>();

  const { patients } = useApp();

  const [search, setSearch] = useState('');

  const filtered = patients.filter(
    patient =>
      patient.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      patient.id
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      patient.mobile.includes(search),
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop:
              insets.top + Spacing.md,
          },
        ]}
      >
        <Text style={styles.title}>
          Patients ({patients.length})
        </Text>

        {/* Search */}
        <View style={styles.searchBox}>
          <Search
            size={18}
            color={Colors.neutral[400]}
          />

          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, ID, or mobile"
            placeholderTextColor={
              Colors.neutral[400]
            }
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: Spacing.base,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Actions */}
        <View style={styles.actionRow}>
          {/* Onboard */}
          <TouchableOpacity
            style={[
              styles.actionBtn,
              {
                backgroundColor:
                  Colors.primary[50],
                borderColor:
                  Colors.primary[200],
              },
            ]}
            onPress={() =>
              navigation.navigate(
                'PatientOnboarding',
              )
            }
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.actionIcon,
                {
                  backgroundColor:
                    Colors.primary[600],
                },
              ]}
            >
              <UserPlus
                size={18}
                color="#fff"
              />
            </View>

            <Text
              style={[
                styles.actionText,
                {
                  color:
                    Colors.primary[700],
                },
              ]}
            >
              Onboard
            </Text>
          </TouchableOpacity>

          {/* OPD Registration */}
          <TouchableOpacity
            style={[
              styles.actionBtn,
              {
                backgroundColor:
                  Colors.success[50],
                borderColor:
                  Colors.success[200],
              },
            ]}
            onPress={() =>
              navigation.navigate(
                'OPDRegistration',
              )
            }
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.actionIcon,
                {
                  backgroundColor:
                    Colors.success[600],
                },
              ]}
            >
              <CalendarPlus
                size={18}
                color="#fff"
              />
            </View>

            <Text
              style={[
                styles.actionText,
                {
                  color:
                    Colors.success[700],
                },
              ]}
            >
              OPD Reg.
            </Text>
          </TouchableOpacity>

          {/* IPD Admission */}
          <TouchableOpacity
            style={[
              styles.actionBtn,
              {
                backgroundColor:
                  Colors.warning[50],
                borderColor:
                  Colors.warning[200],
              },
            ]}
            onPress={() =>
              navigation.navigate(
                'IPDAdmission',
              )
            }
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.actionIcon,
                {
                  backgroundColor:
                    Colors.warning[600],
                },
              ]}
            >
              <BedDouble
                size={18}
                color="#fff"
              />
            </View>

            <Text
              style={[
                styles.actionText,
                {
                  color:
                    Colors.warning[700],
                },
              ]}
            >
              IPD Admit
            </Text>
          </TouchableOpacity>
        </View>

        {/* Patient List */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={
              <Users
                size={48}
                color={Colors.neutral[300]}
              />
            }
            title="No patients found"
            message="Try a different search term or onboard a new patient."
          />
        ) : (
          filtered.map(patient => (
            <Card
              key={patient.id}
              style={styles.patientCard}
              onPress={() =>
                navigation.navigate(
                  'PatientDetail',
                  {
                    patientId: patient.id,
                  },
                )
              }
            >
              <View style={styles.patientRow}>
                {/* Avatar */}
                <Avatar
                  uri={patient.photo}
                  size={44}
                  name={patient.name}
                />

                {/* Patient Info */}
                <View
                  style={styles.patientInfo}
                >
                  <Text
                    style={styles.patientName}
                  >
                    {patient.name}
                  </Text>

                  <Text
                    style={styles.patientMeta}
                  >
                    {patient.id} ·{' '}
                    {patient.gender},{' '}
                    {patient.age}y ·{' '}
                    {patient.bloodGroup}
                  </Text>

                  <Text
                    style={
                      styles.patientContact
                    }
                  >
                    {patient.mobile}
                  </Text>
                </View>

                {/* IPD Badge */}
                {patient.ipdAdmission && (
                  <View
                    style={styles.ipdBadge}
                  >
                    <Text
                      style={
                        styles.ipdBadgeText
                      }
                    >
                      IPD
                    </Text>
                  </View>
                )}

                {/* Arrow */}
                <ChevronRight
                  size={18}
                  color={Colors.neutral[300]}
                />
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default AdminPatientsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },

  header: {
    backgroundColor: Colors.neutral[0],
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },

  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.neutral[900],
    marginBottom: Spacing.md,
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[50],
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    minHeight: 48,
    borderWidth: 1.5,
    borderColor: Colors.neutral[200],
  },

  searchInput: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: FontSize.base,
    color: Colors.neutral[900],
  },

  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },

  actionBtn: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    ...Shadows.sm,
  },

  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },

  patientCard: {
    marginBottom: Spacing.sm,
  },

  patientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },

  patientInfo: {
    flex: 1,
  },

  patientName: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.neutral[900],
  },

  patientMeta: {
    fontSize: FontSize.sm,
    color: Colors.neutral[400],
    marginTop: 2,
  },

  patientContact: {
    fontSize: FontSize.xs,
    color: Colors.neutral[500],
    marginTop: 2,
  },

  ipdBadge: {
    backgroundColor: Colors.error[50],
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
  },

  ipdBadgeText: {
    fontSize: FontSize.xs,
    color: Colors.error[700],
    fontWeight: FontWeight.bold,
  },
});