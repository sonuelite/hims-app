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
  Shadows,
} from '../../../constants/theme';

import { Card, SectionHeader } from '../../../components/ui/Card';
import { StatusBadge } from '../../../components/ui/DataDisplay';
import {
  StatTile,
  MetricBar,
  SectionCard,
  ProgressRing,
  InfoRow,
} from '../../../components/ui/Widgets';

import {
  Users,
  Calendar,
  BedDouble,
  FlaskConical,
  Pill,
  Siren,
  CreditCard,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Activity,
  Stethoscope,
  ShieldCheck,
  BedSingle,
  Scissors,
  Building2,
  UserPlus,
  CalendarPlus,
} from 'lucide-react-native';

import { useApp } from '../../../context/AppContext';

const AdminDashboardScreen = () => {
  const insets = useSafeAreaInsets();

  // React Navigation instead of expo-router
  const navigation = useNavigation<any>();

  const {
    patients,
    appointments,
    doctors,
    beds,
    bills,
    emergencyCases,
    otCases,
    labOrders,
    medicineStock,
  } = useApp();

  const today = new Date().toISOString().split('T')[0];

  const todayAppts = appointments.filter(
    appointment => appointment.date === today,
  );

  const occupiedBeds = beds.filter(
    bed => bed.status === 'occupied',
  ).length;

  const totalBeds = beds.length;

  const bedOccupancyRate =
    totalBeds > 0
      ? Math.round((occupiedBeds / totalBeds) * 100)
      : 0;

  const pendingBills = bills.filter(
    bill => bill.status === 'pending',
  ).length;

  const totalRevenue = bills.reduce(
    (sum, bill) => sum + bill.paid,
    0,
  );

  const outstanding = bills.reduce(
    (sum, bill) => sum + bill.outstanding,
    0,
  );

  const activeEmergency = emergencyCases.filter(
    emergency =>
      emergency.status === 'waiting' ||
      emergency.status === 'in-treatment',
  ).length;

  const activeOT = otCases.filter(
    ot => ot.status !== 'completed',
  ).length;

  const pendingLabs = labOrders.filter(
    lab => lab.status === 'ordered',
  ).length;

  const lowStockMeds = medicineStock.filter(
    medicine =>
      medicine.stock <= medicine.lowStockThreshold,
  ).length;

  const activeDoctors = doctors.filter(
    doctor => doctor.active,
  ).length;

  /*
   * --------------------------------
   * Navigation helper
   * --------------------------------
   *
   * Replace these screen names with
   * the exact names registered in
   * your StackNavigator/BottomTabNavigator.
   */
  const navigateTo = (screenName: string) => {
    navigation.navigate(screenName);
  };

  const adminType = [
    {
      title: 'Nursing',
      icon: <Users size={20} color="#fff" />,
      boxColor: Colors.success[600],
      screen: 'Nursing',
    },
    {
      title: 'HouseKeeping',
      icon: <Users size={20} color="#fff" />,
      boxColor: Colors.primary[600],
      screen: 'HouseKeeping',
    },
    {
      title: 'Pharmacy OPD',
      icon: <Users size={20} color="#fff" />,
      boxColor: Colors.warning[600],
      screen: 'PharmacyOPD',
    },
    {
      title: 'Pharmacy IPD',
      icon: <Users size={20} color="#fff" />,
      boxColor: Colors.accent[600],
      screen: 'PharmacyIPD',
    },
    {
      title: 'Inventory',
      icon: <Users size={20} color="#fff" />,
      boxColor: Colors.success[600],
      screen: 'Inventory',
    },
    {
      title: 'Hr',
      icon: <Users size={20} color="#fff" />,
      boxColor: Colors.primary[600],
      screen: 'Hr',
    },
  ];

  const stats = [
    {
      label: 'Total Patients',
      value: patients.length,
      icon: (
        <Users
          size={20}
          color={Colors.primary[600]}
        />
      ),
      color: 'primary' as const,
      route: 'Patients',
    },
    {
      label: "Today's Appts",
      value: todayAppts.length,
      icon: (
        <Calendar
          size={20}
          color={Colors.success[600]}
        />
      ),
      color: 'success' as const,
      route: 'Appointments',
    },
    {
      label: 'Active Doctors',
      value: activeDoctors,
      icon: (
        <Stethoscope
          size={20}
          color={Colors.accent[600]}
        />
      ),
      color: 'accent' as const,
      route: 'Doctors',
    },
    {
      label: 'Beds Occupied',
      value: `${occupiedBeds}/${totalBeds}`,
      icon: (
        <BedDouble
          size={20}
          color={Colors.warning[600]}
        />
      ),
      color: 'warning' as const,
      route: 'BedManagement',
    },
  ];

  const revenueStats = [
    {
      label: 'Total Revenue',
      value: `₹${(totalRevenue / 1000).toFixed(1)}K`,
      icon: (
        <TrendingUp
          size={18}
          color={Colors.success[600]}
        />
      ),
      color: 'success' as const,
    },
    {
      label: 'Outstanding',
      value: `₹${(outstanding / 1000).toFixed(1)}K`,
      icon: (
        <TrendingDown
          size={18}
          color={Colors.error[600]}
        />
      ),
      color: 'error' as const,
    },
    {
      label: 'Pending Bills',
      value: pendingBills,
      icon: (
        <CreditCard
          size={18}
          color={Colors.warning[600]}
        />
      ),
      color: 'warning' as const,
    },
  ];

  const opsItems = [
    {
      label: 'Emergency',
      value: activeEmergency,
      icon: Siren,
      color: Colors.error[600],
      route: 'Emergency',
    },
    {
      label: 'Lab Orders',
      value: pendingLabs,
      icon: FlaskConical,
      color: Colors.warning[600],
      route: 'Lab',
    },
    {
      label: 'OT Cases',
      value: activeOT,
      icon: Activity,
      color: Colors.accent[600],
      route: 'OT',
    },
    {
      label: 'Low Stock',
      value: lowStockMeds,
      icon: Pill,
      color: Colors.error[500],
      route: 'Pharmacy',
    },
  ];

  // Department-wise appointment distribution
  const deptCounts: Record<string, number> = {};

  todayAppts.forEach(appointment => {
    deptCounts[appointment.department] =
      (deptCounts[appointment.department] || 0) + 1;
  });

  const deptStats = Object.entries(deptCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const maxDeptCount = Math.max(
    ...Object.values(deptCounts),
    1,
  );

  const activeOTCases = otCases.filter(
    ot => ot.status !== 'completed',
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
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
          <View>
            <Text style={styles.greeting}>
              Admin Dashboard
            </Text>

            <Text style={styles.subGreeting}>
              MediCare Health · {today}
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <ShieldCheck
              size={28}
              color={Colors.neutral[0]}
            />
          </View>
        </View>

        <View style={styles.body}>
          {/* Quick Actions */}
          {/* <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionBtn}
              onPress={() =>
                navigateTo('PatientOnboardingScreen')
              }
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  {
                    backgroundColor:
                      Colors.success[600],
                  },
                ]}
              >
                <UserPlus
                  size={20}
                  color="#fff"
                />
              </View>

              <Text style={styles.quickActionText}>
                Onboard
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionBtn}
              onPress={() =>
                navigateTo('OPDRegistration')
              }
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  {
                    backgroundColor:
                      Colors.primary[600],
                  },
                ]}
              >
                <CalendarPlus
                  size={20}
                  color="#fff"
                />
              </View>

              <Text style={styles.quickActionText}>
                OPD Reg.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionBtn}
              onPress={() =>
                navigateTo('IPDAdmission')
              }
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  {
                    backgroundColor:
                      Colors.warning[600],
                  },
                ]}
              >
                <BedDouble
                  size={20}
                  color="#fff"
                />
              </View>

              <Text style={styles.quickActionText}>
                IPD Admit
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionBtn}
              onPress={() =>
                navigateTo('Patients')
              }
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  {
                    backgroundColor:
                      Colors.accent[600],
                  },
                ]}
              >
                <Users
                  size={20}
                  color="#fff"
                />
              </View>

              <Text style={styles.quickActionText}>
                Patients
              </Text>
            </TouchableOpacity>
          </View> */}

          {/* Key Stats */}
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View
                key={index}
                style={styles.statTileWrap}
              >
                <StatTile
                  label={stat.label}
                  value={stat.value}
                  icon={stat.icon}
                  color={stat.color}
                  onPress={() =>
                    navigateTo(stat.route)
                  }
                />
              </View>
            ))}
          </View>

          {/* <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionBtn}
              onPress={() =>
                navigateTo('PatientOnboardingScreen')
              }
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  {
                    backgroundColor:
                      Colors.success[600],
                  },
                ]}
              >
                <UserPlus
                  size={20}
                  color="#fff"
                />
              </View>

              <Text style={styles.quickActionText}>
                Nursing
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionBtn}
              onPress={() =>
                navigateTo('OPDRegistration')
              }
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  {
                    backgroundColor:
                      Colors.primary[600],
                  },
                ]}
              >
                <CalendarPlus
                  size={20}
                  color="#fff"
                />
              </View>

              <Text style={styles.quickActionText}>
                HouseKeeping
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionBtn}
              onPress={() =>
                navigateTo('IPDAdmission')
              }
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  {
                    backgroundColor:
                      Colors.warning[600],
                  },
                ]}
              >
                <BedDouble
                  size={20}
                  color="#fff"
                />
              </View>

              <Text style={styles.quickActionText}>
                Pharmacy OPD
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionBtn}
              onPress={() =>
                navigateTo('Patients')
              }
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  {
                    backgroundColor:
                      Colors.accent[600],
                  },
                ]}
              >
                <Users
                  size={20}
                  color="#fff"
                />
              </View>

              <Text style={styles.quickActionText}>
                Pharmacy IPD
              </Text>
            </TouchableOpacity>
          </View> */}
          <View style={styles.quickActions}>
            {adminType.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickActionBtn}
                onPress={() => navigateTo(item.screen)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.quickActionIcon,
                    {
                      backgroundColor: item.boxColor,
                    },
                  ]}
                >
                  {item.icon}
                </View>

                <Text style={styles.quickActionText}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Hospital Overview */}
          <SectionHeader title="Hospital Overview" />

          <View style={styles.overviewRow}>
            {/* Bed Occupancy */}
            <Card
              style={styles.occupancyCard}
              shadow="md"
            >
              <Text style={styles.cardTitle}>
                Bed Occupancy
              </Text>

              <View style={styles.ringRow}>
                <ProgressRing
                  size={90}
                  progress={bedOccupancyRate}
                  color={
                    bedOccupancyRate > 80
                      ? Colors.error[500]
                      : bedOccupancyRate > 60
                        ? Colors.warning[500]
                        : Colors.success[500]
                  }
                  label={`${bedOccupancyRate}%`}
                />

                <View
                  style={styles.occupancyInfo}
                >
                  <InfoRow
                    icon={
                      <BedDouble
                        size={12}
                        color={Colors.neutral[600]}
                      />
                    }
                    label="Occupied"
                    value={`${occupiedBeds}`}
                  />

                  <InfoRow
                    icon={
                      <BedSingle
                        size={12}
                        color={Colors.neutral[600]}
                      />
                    }
                    label="Available"
                    value={`${totalBeds - occupiedBeds}`}
                  />
                </View>
              </View>
            </Card>

            {/* Revenue */}
            <Card
              style={styles.revenueCard}
              shadow="md"
            >
              <Text style={styles.cardTitle}>
                Revenue
              </Text>

              {revenueStats.map(
                (stat, index) => (
                  <View
                    key={index}
                    style={styles.revenueItem}
                  >
                    <View
                      style={[
                        styles.revenueIcon,
                        {
                          backgroundColor:
                            stat.color ===
                              'success'
                              ? Colors.success[50]
                              : stat.color ===
                                'error'
                                ? Colors.error[50]
                                : Colors.warning[50],
                        },
                      ]}
                    >
                      {stat.icon}
                    </View>

                    <View>
                      <Text
                        style={
                          styles.revenueValue
                        }
                      >
                        {stat.value}
                      </Text>

                      <Text
                        style={
                          styles.revenueLabel
                        }
                      >
                        {stat.label}
                      </Text>
                    </View>
                  </View>
                ),
              )}
            </Card>
          </View>

          {/* Operations Status */}
          <SectionHeader title="Operations Status" />

          <View style={styles.opsGrid}>
            {opsItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <TouchableOpacity
                  key={index}
                  style={styles.opsCard}
                  onPress={() =>
                    navigateTo(item.route)
                  }
                  activeOpacity={0.85}
                >
                  <View
                    style={[
                      styles.opsIcon,
                      {
                        backgroundColor:
                          item.color + '15',
                      },
                    ]}
                  >
                    <Icon
                      size={20}
                      color={item.color}
                    />
                  </View>

                  <Text style={styles.opsValue}>
                    {item.value}
                  </Text>

                  <Text style={styles.opsLabel}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Emergency Alert */}
          {activeEmergency > 0 && (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>
                navigateTo('Emergency')
              }
            >
              <View
                style={styles.emergencyAlert}
              >
                <View
                  style={
                    styles.emergencyAlertIcon
                  }
                >
                  <Siren
                    size={20}
                    color={Colors.error[600]}
                  />
                </View>

                <View
                  style={
                    styles.emergencyAlertInfo
                  }
                >
                  <Text
                    style={
                      styles.emergencyAlertTitle
                    }
                  >
                    {activeEmergency} Active
                    Emergency Case
                    {activeEmergency > 1
                      ? 's'
                      : ''}
                  </Text>

                  <Text
                    style={
                      styles.emergencyAlertDesc
                    }
                  >
                    Immediate attention
                    required
                  </Text>
                </View>

                <ChevronRight
                  size={18}
                  color={Colors.error[600]}
                />
              </View>
            </TouchableOpacity>
          )}

          {/* Department Load */}
          {deptStats.length > 0 && (
            <>
              <SectionHeader
                title="Department Load Today"
              />

              <SectionCard
                title="Appointments by Department"
                icon={
                  <Building2
                    size={16}
                    color={Colors.primary[600]}
                  />
                }
              >
                {deptStats.map(
                  ([department, count], index) => (
                    <MetricBar
                      key={index}
                      label={department}
                      value={count}
                      max={maxDeptCount}
                      color={
                        index === 0
                          ? Colors.primary[600]
                          : index === 1
                            ? Colors.success[600]
                            : index === 2
                              ? Colors.accent[600]
                              : Colors.teal[600]
                      }
                    />
                  ),
                )}
              </SectionCard>
            </>
          )}

          {/* OT Schedule */}
          {activeOTCases.length > 0 && (
            <>
              <SectionHeader
                title="OT Schedule"
                action="View All"
                onAction={() =>
                  navigateTo('OT')
                }
              />

              <SectionCard
                title="Today's Surgeries"
                icon={
                  <Scissors
                    size={16}
                    color={Colors.accent[600]}
                  />
                }
              >
                {activeOTCases
                  .slice(0, 3)
                  .map(ot => (
                    <View
                      key={ot.id}
                      style={styles.otItem}
                    >
                      <View
                        style={styles.otIcon}
                      >
                        <Activity
                          size={16}
                          color={
                            Colors.accent[600]
                          }
                        />
                      </View>

                      <View
                        style={styles.otInfo}
                      >
                        <Text
                          style={
                            styles.otProcedure
                          }
                        >
                          {ot.procedure}
                        </Text>

                        <Text
                          style={styles.otPatient}
                        >
                          {ot.patientName} · OT-
                          {ot.otNumber}
                        </Text>
                      </View>

                      <View
                        style={styles.otRight}
                      >
                        <Text
                          style={styles.otTime}
                        >
                          {ot.time}
                        </Text>

                        <StatusBadge
                          status={ot.status}
                        />
                      </View>
                    </View>
                  ))}
              </SectionCard>
            </>
          )}

          {/* Recent Appointments */}
          <SectionHeader
            title="Recent Appointments"
            action="View All"
            onAction={() =>
              navigateTo('Appointments')
            }
          />

          <View>
            {todayAppts
              .slice(0, 5)
              .map(appointment => (
                <Card
                  key={appointment.id}
                  style={styles.apptCard}
                  shadow="sm"
                >
                  <View style={styles.apptRow}>
                    <View
                      style={styles.apptLeft}
                    >
                      <Text
                        style={styles.apptToken}
                      >
                        #{appointment.token}
                      </Text>

                      <Text
                        style={styles.apptTime}
                      >
                        {appointment.time}
                      </Text>
                    </View>

                    <View
                      style={styles.apptInfo}
                    >
                      <Text
                        style={
                          styles.apptPatient
                        }
                      >
                        {appointment.patientName}
                      </Text>

                      <Text
                        style={
                          styles.apptDoctor
                        }
                      >
                        {appointment.doctorName}{' '}
                        · {appointment.department}
                      </Text>
                    </View>

                    <StatusBadge
                      status={appointment.status}
                    />
                  </View>
                </Card>
              ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AdminDashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },

  header: {
    backgroundColor: Colors.primary[700],
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
    ...Shadows.lg,
  },

  greeting: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.neutral[0],
  },

  subGreeting: {
    fontSize: FontSize.sm,
    color: Colors.primary[200],
    marginTop: 2,
  },

  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor:
      'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  body: {
    padding: Spacing.base,
    paddingTop: Spacing.md,
  },

  // quickActions: {
  //   flexDirection: 'row',
  //   gap: Spacing.sm,
  //   marginBottom: Spacing.md,
  // },
    quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    // gap: Spacing.sm,
    // marginBottom: Spacing.md,
  },

  // quickActionBtn: {
  //   flex: 1,
  //   alignItems: 'center',
  //   gap: Spacing.xs,
  // },
    quickActionBtn: {
  width: '31%',
  alignItems: 'center',
  marginBottom: Spacing.md,
  },

  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },

  quickActionText: {
    fontSize: FontSize.xs,
    color: Colors.neutral[600],
    fontWeight: FontWeight.semibold,
    textAlign: 'center',
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    // justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },

  statTileWrap: {
    // width: '48%',
    // backgroundColor: 'red'
  },

  overviewRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },

  occupancyCard: {
    flex: 1,
    padding: Spacing.base,
  },

  revenueCard: {
    flex: 1,
    padding: Spacing.base,
  },

  cardTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.neutral[900],
    marginBottom: Spacing.md,
  },

  ringRow: {
    // flexDirection: 'row',
    // alignItems: 'center',
    gap: Spacing.md,
  },

  occupancyInfo: {
    flex: 1,
  },

  revenueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },

  revenueIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  revenueValue: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.extrabold,
    color: Colors.neutral[900],
  },

  revenueLabel: {
    fontSize: FontSize.xs,
    color: Colors.neutral[400],
    marginTop: 1,
  },

  opsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },

  opsCard: {
    width: '48%',
    backgroundColor: Colors.neutral[0],
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadows.sm,
  },

  opsIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },

  opsValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: Colors.neutral[900],
  },

  opsLabel: {
    fontSize: 10,
    color: Colors.neutral[600],
    fontWeight: FontWeight.medium,
    textAlign: 'center',
    marginTop: 2,
  },

  emergencyAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error[50],
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.error[200],
  },

  emergencyAlertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.error[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },

  emergencyAlertInfo: {
    flex: 1,
  },

  emergencyAlertTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.error[800],
  },

  emergencyAlertDesc: {
    fontSize: FontSize.sm,
    color: Colors.error[700],
    marginTop: 2,
  },

  otItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[50],
  },

  otIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.accent[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },

  otInfo: {
    flex: 1,
  },

  otProcedure: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.neutral[900],
  },

  otPatient: {
    fontSize: FontSize.xs,
    color: Colors.neutral[400],
    marginTop: 2,
  },

  otRight: {
    alignItems: 'flex-end',
    gap: Spacing.xs,
  },

  otTime: {
    fontSize: FontSize.xs,
    color: Colors.neutral[400],
    fontWeight: FontWeight.medium,
  },

  apptCard: {
    marginBottom: Spacing.sm,
  },

  apptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },

  apptLeft: {
    width: 50,
  },

  apptToken: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.primary[700],
  },

  apptTime: {
    fontSize: FontSize.xs,
    color: Colors.neutral[400],
    marginTop: 2,
  },

  apptInfo: {
    flex: 1,
  },

  apptPatient: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.neutral[900],
  },

  apptDoctor: {
    fontSize: FontSize.xs,
    color: Colors.neutral[400],
    marginTop: 2,
  },
});