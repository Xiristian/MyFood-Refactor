import { THEME } from './theme';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: THEME.COLORS.TINT.LIGHT,
    tabIconDefault: THEME.COLORS.TAB_ICON.DEFAULT,
    tabIconSelected: THEME.COLORS.TAB_ICON.SELECTED.LIGHT,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: THEME.COLORS.TINT.DARK,
    tabIconDefault: THEME.COLORS.TAB_ICON.DEFAULT,
    tabIconSelected: THEME.COLORS.TAB_ICON.SELECTED.DARK,
  },
} as const;
