import { MaterialCommunityIcons, Entypo, FontAwesome } from '@expo/vector-icons';
import { THEME } from './theme';

type MaterialCommunityIconName = keyof typeof MaterialCommunityIcons.glyphMap;
type EntypoIconName = keyof typeof Entypo.glyphMap;
type FontAwesomeIconName = keyof typeof FontAwesome.glyphMap;

export const TAB_CONFIG = {
  MEALS: {
    name: 'meals',
    icon: 'carrot' as MaterialCommunityIconName,
    size: THEME.ICON.SIZE.MEALS,
  },
  GRAPHICS: {
    name: 'graphics',
    icon: 'bar-graph' as EntypoIconName,
    size: THEME.ICON.SIZE.GRAPHICS,
  },
  USER: {
    name: 'user',
    icon: 'user' as FontAwesomeIconName,
    size: THEME.ICON.SIZE.USER,
  },
} as const;
