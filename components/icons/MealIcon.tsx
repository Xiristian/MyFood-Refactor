import React from 'react';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { THEME } from '@/constants/theme';

interface MealIconProps {
  name: keyof typeof MaterialCommunityIcons.glyphMap;
  size?: number;
  color?: string;
}

export default function MealIcon({
  name,
  size = 24,
  color = THEME.ICON.COLOR as string,
}: MealIconProps) {
  return <Feather name={name as any} size={size} color={color} />;
}
