import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  SectionHeader,
} from '../../../components/ui/Card';

import {
  SimpleChart,
  DonutChart,
  ProgressBar,
} from '../../../components/ui/Charts';

import {
  TrendingUp,
  Users,
  Calendar,
  Stethoscope,
  Pill,
  FlaskConical,
  Download,
} from 'lucide-react-native';

import { useApp } from '../../../context/AppContext';

const AdminReportsScreen = () => {
  const insets = useSafeAreaInsets();

  const {
    patients,
    appointments,
    doctors,
    prescriptions,
    labOrders,
    bills,
    showToast,
  } = useApp();

  // Department appointment counts
  const deptCounts = {
    Cardiology: appointments.filter(
      a => a.department === 'Cardiology',
    ).length,

    Neurology: appointments.filter(
      a => a.department === 'Neurology',
    ).length,

    Orthopedics: appointments.filter(
      a => a.department === 'Orthopedics',
    ).length,

    General: appointments.filter(
      a => a.department === 'General Surgery',
    ).length,

    Pediatrics: appointments.filter(
      a => a.department === 'Pediatrics',
    ).length,
  };

  const deptData = [
    deptCounts.Cardiology,
    deptCounts.Neurology,
    deptCounts.Orthopedics,
    deptCounts.General,
    deptCounts.Pediatrics,
  ];

  const deptLabels = [
    'Card',
    'Neuro',
    'Ortho',
    'Gen',
    'Ped',
  ];

  // Monthly appointment data
  const monthlyData = [
    45,
    52,
    38,
    61,
    55,
    72,
    68,
    80,
  ];

  const monthlyLabels = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
  ];

  // Donut chart data
  const donutSegments = [
    {
      value: deptCounts.Cardiology || 1,
      color: Colors.primary[500],
      label: 'Cardiology',
    },
    {
      value: deptCounts.Neurology || 1,
      color: Colors.success[500],
      label: 'Neurology',
    },
    {
      value: deptCounts.Orthopedics || 1,
      color: Colors.warning[500],
      label: 'Orthopedics',
    },
    {
      value: deptCounts.General || 1,
      color: Colors.accent[500],
      label: 'General',
    },
    {
      value: deptCounts.Pediatrics || 1,
      color: Colors.error[500],
      label: 'Pediatrics',
    },
  ];

  // Revenue
  const totalRevenue = bills.reduce(
    (sum, bill) => sum + bill.paid,
    0,
  );

  const outstanding = bills.reduce(
    (sum, bill) => sum + bill.outstanding,
    0,
  );

  // Report cards
  const reportCards = [
    {
      label: 'Patient Growth',
      value: `${patients.length}`,
      sub: 'Total registered',
      icon: Users,
      color: Colors.primary[600],
    },
    {
      label: 'Appointments',
      value: `${appointments.length}`,
      sub: 'All time',
      icon: Calendar,
      color: Colors.success[600],
    },
    {
      label: 'Active Doctors',
      value: `${doctors.filter(d => d.active).length}`,
      sub: 'Currently active',
      icon: Stethoscope,
      color: Colors.accent[600],
    },
    {
      label: 'Prescriptions',
      value: `${prescriptions.length}`,
      sub: 'Total written',
      icon: Pill,
      color: Colors.primary[500],
    },
    {
      label: 'Lab Tests',
      value: `${labOrders.length}`,
      sub: 'Total ordered',
      icon: FlaskConical,
      color: Colors.warning[600],
    },
    {
      label: 'Revenue',
      value: `₹${(totalRevenue / 1000).toFixed(1)}K`,
      sub: 'Collected',
      icon: TrendingUp,
      color: Colors.success[600],
    },
  ];

  const collectionRate =
    totalRevenue + outstanding > 0
      ? Math.round(
          (totalRevenue /
            (totalRevenue + outstanding)) *
            100,
        )
      : 0;

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
          Reports & Analytics
        </Text>

        <TouchableOpacity
          style={styles.exportBtn}
          onPress={() =>
            showToast(
              'Report exported successfully',
              'success',
            )
          }
          activeOpacity={0.8}
        >
          <Download
            size={18}
            color={Colors.primary[600]}
          />

          <Text style={styles.exportText}>
            Export
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: Spacing.base,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Report Cards */}
        <View style={styles.reportGrid}>
          {reportCards.map((report, index) => {
            const Icon = report.icon;

            return (
              <View
                key={index}
                style={styles.reportCard}
              >
                <View
                  style={[
                    styles.reportIcon,
                    {
                      backgroundColor:
                        report.color + '15',
                    },
                  ]}
                >
                  <Icon
                    size={18}
                    color={report.color}
                  />
                </View>

                <Text style={styles.reportValue}>
                  {report.value}
                </Text>

                <Text style={styles.reportLabel}>
                  {report.label}
                </Text>

                <Text style={styles.reportSub}>
                  {report.sub}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Appointments by Department */}
        <SectionHeader
          title="Appointments by Department"
        />

        <Card style={styles.chartCard}>
          <SimpleChart
            data={deptData}
            labels={deptLabels}
            color={Colors.primary[500]}
            height={140}
          />
        </Card>

        {/* Monthly Appointment Trend */}
        <SectionHeader
          title="Monthly Appointment Trend"
        />

        <Card style={styles.chartCard}>
          <SimpleChart
            data={monthlyData}
            labels={monthlyLabels}
            color={Colors.success[500]}
            height={140}
          />
        </Card>

        {/* Department Distribution */}
        <SectionHeader
          title="Department Distribution"
        />

        <Card style={styles.chartCard}>
          <DonutChart
            segments={donutSegments}
            size={160}
          />
        </Card>

        {/* Revenue Collection */}
        <SectionHeader
          title="Revenue Collection"
        />

        <Card style={styles.chartCard}>
          <Text style={styles.revenueLabel}>
            Collected vs Outstanding
          </Text>

          <View style={styles.revenueRow}>
            {/* Collected */}
            <View style={styles.revenueItem}>
              <Text
                style={styles.revenueAmount}
              >
                ₹
                {totalRevenue.toLocaleString(
                  'en-IN',
                )}
              </Text>

              <Text style={styles.revenueSub}>
                Collected
              </Text>
            </View>

            {/* Outstanding */}
            <View style={styles.revenueItem}>
              <Text
                style={[
                  styles.revenueAmount,
                  {
                    color:
                      Colors.error[600],
                  },
                ]}
              >
                ₹
                {outstanding.toLocaleString(
                  'en-IN',
                )}
              </Text>

              <Text style={styles.revenueSub}>
                Outstanding
              </Text>
            </View>
          </View>

          {/* Collection Rate */}
          <View style={styles.progressSection}>
            <View style={styles.progressRow}>
              <Text
                style={styles.progressLabel}
              >
                Collection Rate
              </Text>

              <Text
                style={styles.progressValue}
              >
                {collectionRate}%
              </Text>
            </View>

            <ProgressBar
              value={totalRevenue}
              max={
                totalRevenue + outstanding
              }
              color={Colors.success[500]}
              height={10}
            />
          </View>
        </Card>
      </ScrollView>
    </View>
  );
};

export default AdminReportsScreen;

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.neutral[900],
  },

  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.primary[50],
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },

  exportText: {
    fontSize: FontSize.sm,
    color: Colors.primary[700],
    fontWeight: FontWeight.semibold,
  },

  reportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },

  reportCard: {
    width: '48%',
    backgroundColor: Colors.neutral[0],
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },

  reportIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },

  reportValue: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.neutral[900],
  },

  reportLabel: {
    fontSize: FontSize.sm,
    color: Colors.neutral[700],
    fontWeight: FontWeight.medium,
    marginTop: 2,
  },

  reportSub: {
    fontSize: FontSize.xs,
    color: Colors.neutral[400],
  },

  chartCard: {
    marginBottom: Spacing.md,
  },

  revenueLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.neutral[700],
    marginBottom: Spacing.md,
  },

  revenueRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.md,
  },

  revenueItem: {
    flex: 1,
  },

  revenueAmount: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.success[600],
  },

  revenueSub: {
    fontSize: FontSize.xs,
    color: Colors.neutral[400],
    marginTop: 2,
  },

  progressSection: {
    marginTop: Spacing.sm,
  },

  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },

  progressLabel: {
    fontSize: FontSize.sm,
    color: Colors.neutral[600],
    fontWeight: FontWeight.medium,
  },

  progressValue: {
    fontSize: FontSize.sm,
    color: Colors.neutral[900],
    fontWeight: FontWeight.bold,
  },
});