import React from 'react';
import { StyleProp, StyleSheet, ImageStyle, Image } from 'react-native';
import LogoImg from '../assets/images/icon.png';
import { View } from './Themed';
import { ViewStyle } from 'react-native';
import { THEME } from '@/constants/theme';

const Logo = ({
  style,
  imageStyle,
}: {
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
}) => {
  return (
    <View
      style={[styles.container, style]}
      lightColor={THEME.COLORS.BACKGROUND.LIGHT}
      darkColor={THEME.COLORS.BACKGROUND.DARK}>
      <Image source={LogoImg} style={[styles.logo, imageStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: THEME.SPACING.PADDING.VERTICAL,
  },
  logo: {
    height: THEME.IMAGE.SIZE.CONTAINER,
    resizeMode: 'contain',
    width: THEME.IMAGE.SIZE.CONTAINER,
  },
});

export default Logo;
