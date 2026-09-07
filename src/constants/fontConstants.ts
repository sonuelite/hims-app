// export const Fontconstants = {
//     REGULAR: 'Inter_24pt-Regular', //400
//     MEDIUM: 'Inter_24pt-Medium', //500
//     SEMIBOLD: 'Inter_24pt-SemiBold', //600
//     BOLD: 'Inter_24pt-Bold', //700
//     ITALIC: 'Inter_24pt-Italic',
// }

import { Platform } from "react-native";

export const Fontconstants = {
  REGULAR: Platform.select({
    ios: 'Inter24pt-Regular',      // PostScript Name
    android: 'Inter_24pt-Regular', // Filename
  }),
  MEDIUM: Platform.select({
    ios: 'Inter24pt-Medium',
    android: 'Inter_24pt-Medium',
  }),
  SEMIBOLD: Platform.select({
    ios: 'Inter24pt-SemiBold',
    android: 'Inter_24pt-SemiBold',
  }),
  BOLD: Platform.select({
    ios: 'Inter24pt-Bold',
    android: 'Inter_24pt-Bold',
  }),
  ITALIC: Platform.select({
    ios: 'Inter24pt-Italic',
    android: 'Inter_24pt-Italic',
  }),
};