import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import CustomButton from '../customButton/CustomButton';
import { Colors, Spacing } from '../../constants/theme';
import { scale } from '../../utils/scale';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'danger';
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

// Keep nursing actions on the app's shared button, with room for multiline labels.
export default function NursingButton({
  title,
  onPress,
  variant = 'primary',
  icon,
  style,
  accessibilityLabel,
}: Props) {
  const outline = variant === 'outline';
  return (
    <CustomButton
      title={title}
      onPress={onPress}
      disable={false}
      fontsize={13}
      bgColor={
        outline
          ? Colors.neutral[0]
          : variant === 'danger'
          ? Colors.error[600]
          : undefined
      }
      txtColor={outline ? Colors.primary[600] : Colors.neutral[0]}
      borderWidth={outline ? 1 : 0}
      borderColor={outline ? Colors.primary[200] : undefined}
      leftIcon={icon}
      containerStyle={style}
      buttonStyle={styles.button}
      textStyle={styles.text}
      accessibilityLabel={accessibilityLabel}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    height: 'auto',
    minHeight: scale(48),
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  text: { flexShrink: 1, textAlign: 'center' },
});
