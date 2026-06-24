/**
 * Ekub Design System — Dark fintech aesthetic.
 * Primary accent: electric blue. Background: deep charcoal.
 */

import '@/global.css';
import { Platform } from 'react-native';

// ─── Brand Palette ────────────────────────────────────────────────────────────
export const Brand = {
  /** Core blues */
  accent:       '#4361EE',   // electric royal blue
  accentHover:  '#5A78F5',   // lighter on press
  accentDeep:   '#2E4DD4',   // darker variant
  accentMuted:  'rgba(67,97,238,0.14)',
  accentBorder: 'rgba(67,97,238,0.32)',

  /** Background layers — deep black charcoal */
  bg0: '#08090C',   // deepest
  bg1: '#0E0F14',   // main screen
  bg2: '#15161D',   // cards / panels
  bg3: '#1D1E28',   // elevated elements / inputs
  bg4: '#252733',   // selected / hover

  /** Text */
  textPrimary:   '#ECEDF5',
  textSecondary: '#7A7E99',
  textMuted:     '#3E4157',

  /** Status */
  success: '#27AE78',
  error:   '#E05C5C',
  warning: '#E0A34A',

  white: '#FFFFFF',
  black: '#000000',
} as const;

// ─── Theme tokens (keeps ThemedView / ThemedText working) ─────────────────────
export const Colors = {
  light: {
    text: '#12131A',
    background: '#F0F1F8',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#E2E4F0',
    textSecondary: '#5A5E78',
  },
  dark: {
    text: Brand.textPrimary,
    background: Brand.bg1,
    backgroundElement: Brand.bg2,
    backgroundSelected: Brand.bg4,
    textSecondary: Brand.textSecondary,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

// ─── Fonts ────────────────────────────────────────────────────────────────────
export const Fonts = Platform.select({
  ios:     { sans: 'system-ui', serif: 'ui-serif', rounded: 'ui-rounded', mono: 'ui-monospace' },
  default: { sans: 'normal',    serif: 'serif',    rounded: 'normal',     mono: 'monospace'    },
  web: {
    sans:    'var(--font-display)',
    serif:   'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono:    'var(--font-mono)',
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
  xs:   6,
  sm:   10,
  md:   14,
  lg:   20,
  xl:   26,
  xxl:  32,
  full: 9999,
} as const;

// ─── Shadows ──────────────────────────────────────────────────────────────────
export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 8,
  },
  accent: {
    shadowColor: '#4361EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.40,
    shadowRadius: 14,
    elevation: 8,
  },
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
