import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BackHeader from '../../../components/backHeader/BackHeader';
import CustomButton from '../../../components/customButton/CustomButton';
import { Input } from '../../../components/input/Input';
import { Colors, FontSize, Radius, Spacing } from '../../../constants/theme';
import { Fontconstants } from '../../../constants/fontConstants';
import { fontScale } from '../../../utils/scale';

const StaffIdScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { nurseName } = (route.params ?? {}) as { nurseName?: string };
  const insets = useSafeAreaInsets();
  const [staffId, setStaffId] = useState('');
  const [error, setError] = useState('');

  const confirm = () => {
    const id = staffId.trim();
    if (!id) {
      setError('Please enter your Staff ID.');
      return;
    }
    Keyboard.dismiss();
    navigation.navigate('NurseTabNavigator', { staffId: id, nurseName });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <BackHeader title="Staff ID" />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + Spacing.base },
        ]}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Enter Staff ID</Text>
          <Text style={styles.description}>
            {nurseName
              ? `${nurseName}, enter your Staff ID to continue.`
              : 'Enter your Staff ID to continue to the nursing dashboard.'}
          </Text>
          <Input
            label="Staff ID"
            placeholder="Enter Staff ID"
            value={staffId}
            onChangeText={value => {
              setStaffId(value);
              setError('');
            }}
            error={error}
            style={styles.input}
          />
          <CustomButton title="Confirm" onPress={confirm} disable={false} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default StaffIdScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.neutral[50] },
  content: { padding: Spacing.base },
  card: {
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
    padding: Spacing.base,
    backgroundColor: Colors.neutral[0],
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  title: {
    fontFamily: Fontconstants.SEMIBOLD,
    fontSize: fontScale(FontSize.lg),
    color: Colors.neutral[900],
    marginBottom: Spacing.sm,
  },
  description: {
    fontFamily: Fontconstants.REGULAR,
    fontSize: fontScale(FontSize.sm),
    lineHeight: fontScale(20),
    color: Colors.neutral[500],
    marginBottom: Spacing.lg,
  },
  input: {
    fontFamily: Fontconstants.REGULAR,
    fontSize: fontScale(FontSize.base),
  },
});
