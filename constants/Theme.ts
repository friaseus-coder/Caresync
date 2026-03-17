/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';


export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    card: '#fff',
    cardBorder: '#f0f0f0',
    backgroundLight: '#fdf8fb',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    card: '#202223',
    cardBorder: '#353636',
    backgroundLight: '#121c20',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const theme = {
  palette: {
    primary: '#89d0ec',
    white: '#ffffff',
    black: '#000000',
    backgroundLight: '#fdf8fb',
    backgroundDark: '#121c20',
    background: '#ffffff', // Variant
  },
  typography: {
    fontFamily: 'normal', // Use a safe default that works everywhere
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
    extraLarge: 32,
    spacingSmall: 8,
    spacingMedium: 16,
    spacingLarge: 24,
    spacingExtraLarge: 32,
  },
  borders: {
    radius: {
        small: 4,
        medium: 8,
        large: 12,
        full: 9999,
    },
    borderRadiusSmall: 4,
    borderRadiusMedium: 8,
    borderRadiusLarge: 12,
    borderRadiusFull: 9999,
  },
  shadows: {
    shadow: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    }
  }
};