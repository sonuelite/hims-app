import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
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

import { Card } from '../../../components/ui/Card';

import {
  BedDouble,
  Siren,
  FlaskConical,
  Pill,
  Activity,
  ShieldCheck,
  Stethoscope,
  CreditCard,
  FileText,
  Settings,
  LogOut,
  ChevronRight,
  User,
  Bell,
  Shield,
  HelpCircle,
  Download,
  UserPlus,
} from 'lucide-react-native';

import { useApp } from '../../../context/AppContext';

const AdminMoreScreen = () => {
  const insets = useSafeAreaInsets();

  const navigation = useNavigation<any>();

  const { user, logout, showToast } = useApp();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();

            // React Navigation replacement
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'Welcome',
                },
              ],
            });
          },
        },
      ],
    );
  };

  const sections = [
    {
      title: 'Hospital Management',
      items: [
        {
          icon: UserPlus,
          label: 'Onboard Patient',
          route: 'PatientOnboarding',
          color: Colors.success[600],
        },
        {
          icon: Stethoscope,
          label: 'Manage Doctors',
          route: 'Doctors',
          color: Colors.primary[600],
        },
        {
          icon: BedDouble,
          label: 'Bed Management',
          route: 'BedManagement',
          color: Colors.warning[600],
        },
        {
          icon: Siren,
          label: 'Emergency Cases',
          route: 'Emergency',
          color: Colors.error[600],
        },
        {
          icon: Activity,
          label: 'Operation Theater',
          route: 'OT',
          color: Colors.accent[600],
        },
      ],
    },

    {
      title: 'Departments',
      items: [
        {
          icon: FlaskConical,
          label: 'Laboratory',
          route: 'Lab',
          color: Colors.warning[600],
        },
        {
          icon: Pill,
          label: 'Pharmacy',
          route: 'Pharmacy',
          color: Colors.primary[600],
        },
        {
          icon: ShieldCheck,
          label: 'Insurance Claims',
          route: 'Insurance',
          color: Colors.success[600],
        },
        {
          icon: CreditCard,
          label: 'Billing & Payments',
          route: 'Billing',
          color: Colors.accent[600],
        },
      ],
    },

    {
      title: 'System',
      items: [
        {
          icon: FileText,
          label: 'Appointments',
          route: 'Appointments',
          color: Colors.primary[600],
        },
        {
          icon: Download,
          label: 'Export Reports',
          route: 'Reports',
          color: Colors.success[600],
        },
        {
          icon: Bell,
          label: 'Notifications',
          route: '',
          color: Colors.warning[600],
        },
        {
          icon: Settings,
          label: 'Settings',
          route: '',
          color: Colors.neutral[500],
        },
      ],
    },

    {
      title: 'Account',
      items: [
        {
          icon: Shield,
          label: 'Privacy & Security',
          route: '',
          color: Colors.neutral[500],
        },
        {
          icon: HelpCircle,
          label: 'Help & Support',
          route: '',
          color: Colors.neutral[500],
        },
      ],
    },
  ];

  const handleMenuPress = (route: string) => {
    if (route) {
      navigation.navigate(route);
    } else {
      showToast('Coming soon', 'info');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + Spacing.md,
          },
        ]}
      >
        <Text style={styles.title}>More</Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: Spacing.base,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile */}
        <Card style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.profileAvatar}>
              <User
                size={28}
                color={Colors.primary[700]}
              />
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {user?.name || 'Admin User'}
              </Text>

              <Text style={styles.profileEmail}>
                {user?.email ||
                  'admin@medicare.health'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Menu Sections */}
        {sections.map(section => (
          <View key={section.title}>
            <Text style={styles.sectionTitle}>
              {section.title}
            </Text>

            <View style={styles.menuList}>
              {section.items.map((item, index) => {
                const Icon = item.icon;

                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.menuItem}
                    onPress={() =>
                      handleMenuPress(
                        item.route,
                      )
                    }
                    activeOpacity={0.7}
                  >
                    <View style={styles.menuLeft}>
                      <View
                        style={[
                          styles.menuIcon,
                          {
                            backgroundColor:
                              item.color +
                              '15',
                          },
                        ]}
                      >
                        <Icon
                          size={20}
                          color={item.color}
                        />
                      </View>

                      <Text
                        style={styles.menuLabel}
                      >
                        {item.label}
                      </Text>
                    </View>

                    <ChevronRight
                      size={18}
                      color={Colors.neutral[300]}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <LogOut
            size={20}
            color={Colors.error[600]}
          />

          <Text style={styles.logoutText}>
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default AdminMoreScreen;

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

  profileCard: {
    marginBottom: Spacing.lg,
  },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },

  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileInfo: {
    flex: 1,
  },

  profileName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.neutral[900],
  },

  profileEmail: {
    fontSize: FontSize.sm,
    color: Colors.neutral[400],
    marginTop: 2,
  },

  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.neutral[400],
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },

  menuList: {
    backgroundColor: Colors.neutral[0],
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },

  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[50],
  },

  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },

  menuLabel: {
    fontSize: FontSize.base,
    color: Colors.neutral[800],
    fontWeight: FontWeight.medium,
  },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.error[50],
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    marginTop: Spacing.xl,
  },

  logoutText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.error[600],
  },
});