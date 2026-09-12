import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Colors,
  Spacing,
  FontSize,
  FontWeight,
} from '../../constants/theme';

import {
  ChevronLeft,
  Bell,
} from 'lucide-react-native';

import {
  useNavigation,
} from '@react-navigation/native';


interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightIcon?: React.ReactNode;
  onRightPress?: () => void;
  notificationRoute?: string;
}

export function ScreenHeader({
  title,
  subtitle,
  showBack,
  rightIcon,
  onRightPress,
  notificationRoute,
}: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + Spacing.md,
        },
      ]}
    >
      <View style={styles.row}>

        {/* Back Button */}
        {showBack && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <ChevronLeft
              size={24}
              color={Colors.neutral[900]}
            />
          </TouchableOpacity>
        )}

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text
            style={styles.title}
            numberOfLines={1}
          >
            {title}
          </Text>

          {subtitle && (
            <Text
              style={styles.subtitle}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          )}
        </View>

        {/* Custom Right Icon */}
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightPress}
            style={styles.rightBtn}
            activeOpacity={0.7}
          >
            {rightIcon}
          </TouchableOpacity>
        )}

        {/* Notification Icon */}
        {notificationRoute && !rightIcon && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(notificationRoute as never)
            }
            style={styles.rightBtn}
            activeOpacity={0.7}
          >
            <Bell
              size={22}
              color={Colors.neutral[700]}
            />
          </TouchableOpacity>
        )}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.neutral[0],
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[100],
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  backBtn: {
    marginRight: Spacing.sm,
    padding: Spacing.xs,
  },

  titleContainer: {
    flex: 1,
  },

  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.neutral[900],
  },

  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.neutral[400],
    marginTop: 2,
  },

  rightBtn: {
    padding: Spacing.xs,
  },
});
