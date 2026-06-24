/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useTheme() {
  // App is always dark — our brand is built on the dark palette.
  useColorScheme(); // keep the hook call so it's not tree-shaken
  return Colors.dark;
}
