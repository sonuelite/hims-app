import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import {
  Colors,
  Spacing,
  FontSize,
  FontWeight,
  Radius,
} from '../../../constants/theme';

import {
  Card,
  SectionHeader,
} from '../../../components/ui/Card';

import {
  BedDouble,
  Siren,
  FlaskConical,
  Pill,
  Activity,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react-native';

import { useApp } from '../../../context/AppContext';

const AdminOperationsScreen = () => {
  const insets = useSafeAreaInsets();

  // React Native CLI / React Navigation
  const navigation = useNavigation<any>();

  const {
    beds,
    emergencyCases,
    otCases,
    labOrders,
    prescriptions,
    insuranceClaims,
  } = useApp();

  const opsSections = [
    {
      title: 'Bed Management',
      icon: BedDouble,
      color: Colors.primary[600],
      route: 'BedManagement',
      items: [
        {
          label: 'Occupied',
          value: beds.filter(
            b => b.status === 'occupied',
          ).length,
          color: Colors.error[600],
        },
        {
          label: 'Available',
          value: beds.filter(
            b => b.status === 'available',
          ).length,
          color: Colors.success[600],
        },
        {
          label: 'Cleaning',
          value: beds.filter(
            b => b.status === 'cleaning',
          ).length,
          color: Colors.warning[600],
        },
        {
          label: 'Maintenance',
          value: beds.filter(
            b => b.status === 'maintenance',
          ).length,
          color: Colors.neutral[500],
        },
      ],
    },

    {
      title: 'Emergency',
      icon: Siren,
      color: Colors.error[600],
      route: 'Emergency',
      items: [
        {
          label: 'Waiting',
          value: emergencyCases.filter(
            e => e.status === 'waiting',
          ).length,
          color: Colors.error[600],
        },
        {
          label: 'In Treatment',
          value: emergencyCases.filter(
            e => e.status === 'in-treatment',
          ).length,
          color: Colors.warning[600],
        },
        {
          label: 'Admitted',
          value: emergencyCases.filter(
            e => e.status === 'admitted',
          ).length,
          color: Colors.primary[600],
        },
        {
          label: 'Discharged',
          value: emergencyCases.filter(
            e => e.status === 'discharged',
          ).length,
          color: Colors.success[600],
        },
      ],
    },

    {
      title: 'Operation Theater',
      icon: Activity,
      color: Colors.accent[600],
      route: 'OT',
      items: [
        {
          label: 'Scheduled',
          value: otCases.filter(
            o => o.status === 'scheduled',
          ).length,
          color: Colors.primary[600],
        },
        {
          label: 'In Surgery',
          value: otCases.filter(
            o => o.status === 'surgery',
          ).length,
          color: Colors.error[600],
        },
        {
          label: 'Recovery',
          value: otCases.filter(
            o => o.status === 'recovery',
          ).length,
          color: Colors.warning[600],
        },
        {
          label: 'Completed',
          value: otCases.filter(
            o => o.status === 'completed',
          ).length,
          color: Colors.success[600],
        },
      ],
    },

    {
      title: 'Laboratory',
      icon: FlaskConical,
      color: Colors.warning[600],
      route: 'Lab',
      items: [
        {
          label: 'Ordered',
          value: labOrders.filter(
            l => l.status === 'ordered',
          ).length,
          color: Colors.warning[600],
        },
        {
          label: 'Processing',
          value: labOrders.filter(
            l => l.status === 'processing',
          ).length,
          color: Colors.primary[600],
        },
        {
          label: 'Verified',
          value: labOrders.filter(
            l => l.status === 'verified',
          ).length,
          color: Colors.success[600],
        },
        {
          label: 'Total',
          value: labOrders.length,
          color: Colors.neutral[500],
        },
      ],
    },

    {
      title: 'Pharmacy',
      icon: Pill,
      color: Colors.primary[600],
      route: 'Pharmacy',
      items: [
        {
          label: 'Active Rx',
          value: prescriptions.filter(
            p => p.status === 'finalized',
          ).length,
          color: Colors.success[600],
        },
        {
          label: 'Drafts',
          value: prescriptions.filter(
            p => p.status === 'draft',
          ).length,
          color: Colors.warning[600],
        },
        {
          label: 'Dispensed',
          value: prescriptions.filter(
            p => p.status === 'dispensed',
          ).length,
          color: Colors.primary[600],
        },
        {
          label: 'Total',
          value: prescriptions.length,
          color: Colors.neutral[500],
        },
      ],
    },

    {
      title: 'Insurance',
      icon: ShieldCheck,
      color: Colors.success[600],
      route: 'Insurance',
      items: [
        {
          label: 'Pending',
          value: insuranceClaims.filter(
            i => i.status === 'pending',
          ).length,
          color: Colors.warning[600],
        },
        {
          label: 'Approved',
          value: insuranceClaims.filter(
            i => i.status === 'approved',
          ).length,
          color: Colors.success[600],
        },
        {
          label: 'Rejected',
          value: insuranceClaims.filter(
            i => i.status === 'rejected',
          ).length,
          color: Colors.error[600],
        },
        {
          label: 'Settled',
          value: insuranceClaims.filter(
            i => i.status === 'settled',
          ).length,
          color: Colors.primary[600],
        },
      ],
    },
  ];

  const handleNavigate = (route: string) => {
    navigation.navigate(route);
  };

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
          Operations
        </Text>

        <Text style={styles.subtitle}>
          Manage hospital operations
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: Spacing.base,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {opsSections.map(section => {
          const Icon = section.icon;

          return (
            <View key={section.title}>
              {/* Section Header */}
              <SectionHeader
                title={section.title}
                action="Manage"
                onAction={() =>
                  handleNavigate(section.route)
                }
              />

              {/* Operation Card */}
              <TouchableOpacity
                onPress={() =>
                  handleNavigate(section.route)
                }
                activeOpacity={0.8}
              >
                <Card style={styles.opsCard}>
                  <View
                    style={styles.opsCardHeader}
                  >
                    {/* Icon */}
                    <View
                      style={[
                        styles.opsIcon,
                        {
                          backgroundColor:
                            section.color +
                            '15',
                        },
                      ]}
                    >
                      <Icon
                        size={22}
                        color={section.color}
                      />
                    </View>

                    {/* Stats */}
                    <View
                      style={styles.opsStats}
                    >
                      {section.items.map(
                        (item, index) => (
                          <View
                            key={index}
                            style={
                              styles.opsStat
                            }
                          >
                            <Text
                              style={
                                styles.opsStatValue
                              }
                            >
                              {item.value}
                            </Text>

                            <Text
                              style={
                                styles.opsStatLabel
                              }
                            >
                              {item.label}
                            </Text>
                          </View>
                        ),
                      )}
                    </View>

                    {/* Arrow */}
                    <ChevronRight
                      size={18}
                      color={
                        Colors.neutral[300]
                      }
                    />
                  </View>
                </Card>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default AdminOperationsScreen;

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
  },

  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.neutral[400],
    marginTop: 2,
  },

  opsCard: {
    marginBottom: Spacing.md,
  },

  opsCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },

  opsIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  opsStats: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },

  opsStat: {
    minWidth: 60,
  },

  opsStatValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.neutral[900],
  },

  opsStatLabel: {
    fontSize: FontSize.xs,
    color: Colors.neutral[400],
  },
});