/**
 * Ekub Design System — inspired by premium dark-mode financial apps.
 * Primary accent: warm amber/gold. Background: near-black charcoal.
 */

import '@/global.css';
import { Platform } from 'react-native';

// ─── Brand Palette ────────────────────────────────────────────────────────────
export const Brand = {
  /** Primary amber gold */
  accent: '#C9A84C',
  accentLight: '#E6C878',
  accentMuted: 'rgba(201,168,76,0.15)',
  accentBorder: 'rgba(201,168,76,0.35)',

  /** Background layers */
  bg0: '#111214',   // deepest background
  bg1: '#1A1B1E',   // main screen background
  bg2: '#242629',   // card / element background
  bg3: '#2E3035',   // elevated / selected element

  /** Text */
  textPrimary: '#F4F4F5',
  textSecondary: '#8A8D96',
  textMuted: '#4E5259',

  /** Status */
  success: '#3DBE7A',
  error: '#E05252',
  warning: '#E09A4A',

  /** White / Black */
  white: '#FFFFFF',
  black: '#000000',
} as const;

// ─── Theme Colors (light / dark) ──────────────────────────────────────────────
export const Colors = {
  light: {
    text: '#1A1B1E',
    background: '#F4F4F6',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#E8E9EC',
    textSecondary: '#60636D',
  },
  dark: {
    text: Brand.textPrimary,
    background: Brand.bg1,
    backgroundElement: Brand.bg2,
    backgroundSelected: Brand.bg3,
    textSecondary: Brand.textSecondary,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

// ─── Fonts ────────────────────────────────────────────────────────────────────
export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

// ─── Spacing ──────────────────────────────────────────────────────────────────
export const Spacing = {
  half: 2,
  one:  4,
  two:  8,
  three: 16,
  four: 24,
  five: 32,
  six:  48,
  seven: 64,
} as const;

// ─── Radii ────────────────────────────────────────────────────────────────────
export const Radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  full: 999,
} as const;

// ─── Shadows ──────────────────────────────────────────────────────────────────
export const Shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 6,
  },
  accent: {
    shadowColor: Brand.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
