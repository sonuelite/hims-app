import Toast from 'react-native-toast-message';

export type ToastType = 'success' | 'error' | 'info';

export const showToast = (
  message: string,
  type: ToastType = 'info'
) => {
  Toast.show({
    type,
    text1: message,
  });
};