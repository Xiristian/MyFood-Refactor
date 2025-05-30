import {
  Text as DefaultText,
  View as DefaultView,
  Button as DefaultButton,
  TextInput as DefaultInput,
  TouchableOpacity as DefaulTouchableOpacity,
  ColorValue,
} from 'react-native';

import { THEME } from '@/constants/theme';
import { useColorScheme } from './useColorScheme';

type ThemeProps = { lightColor?: ColorValue; darkColor?: ColorValue };

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];
export type ButtonProps = ThemeProps & DefaultButton['props'];
export type InputProps = ThemeProps & DefaultInput['props'];
export type TouchableOpacityProps = ThemeProps & DefaulTouchableOpacity['props'];

export function useThemeColor(props: { light?: ColorValue; dark?: ColorValue }) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return theme === 'light' ? THEME.COLORS.BACKGROUND.LIGHT : THEME.COLORS.BACKGROUND.DARK;
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor });

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor });

  return (
    <DefaultView
      style={[{ backgroundColor: lightColor || darkColor ? backgroundColor : undefined }, style]}
      {...otherProps}
    />
  );
}

export function Button(props: ButtonProps) {
  const { lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor });

  return <DefaultButton color={color} {...otherProps} />;
}

export function TextInput(props: InputProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor });

  return <DefaultInput style={[{ color }, style]} {...otherProps} />;
}

export function TouchableOpacity(props: TouchableOpacityProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor });

  return (
    <DefaulTouchableOpacity
      style={[{ backgroundColor: lightColor || darkColor ? backgroundColor : undefined }, style]}
      {...otherProps}
    />
  );
}
