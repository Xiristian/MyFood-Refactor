import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from './Themed';
import { Feather } from '@expo/vector-icons';
import { THEME } from '@/constants/theme';
import { ItemMeal } from '@/database/types';
import MealIcon from './icons/MealIcon';
import { ExpandedActions } from './ExpandedActions';
import RenderFoods from './RenderFoods';

interface MealItemProps {
  meal: ItemMeal;
  date: Date;
  onToggleExpansion: (id: number) => void;
  loadData: () => Promise<void>;
}

export const MealItem: React.FC<MealItemProps> = ({ meal, date, onToggleExpansion, loadData }) => {
  return (
    <View lightColor={THEME.COLORS.BACKGROUND.LIGHT} darkColor={THEME.COLORS.BACKGROUND.DARK}>
      <View
        style={styles.listItem}
        lightColor={THEME.COLORS.BACKGROUND.LIGHT}
        darkColor={THEME.COLORS.BACKGROUND.DARK}>
        <MealIcon name={meal.iconName as any} />
        <Text numberOfLines={1} style={styles.itemText}>
          {meal.name}
        </Text>
        <TouchableOpacity onPress={() => onToggleExpansion(meal.id)}>
          <Feather
            name={meal.isExpanded ? 'chevron-down' : 'chevron-right'}
            size={24}
            color={THEME.COLORS.SECONDARY}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      {meal.isExpanded && (
        <>
          <RenderFoods foods={meal.foods || []} loadData={loadData} />
          <ExpandedActions id={meal.id} date={date} loadData={loadData} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    marginRight: THEME.SPACING.MARGIN.HORIZONTAL,
  },
  itemText: {
    color: THEME.COLORS.PRIMARY,
    flex: 1,
    fontSize: THEME.FONT.SIZE.NORMAL,
    marginLeft: THEME.SPACING.MARGIN.HORIZONTAL,
  },
  listItem: {
    alignItems: 'center',
    borderBottomColor: THEME.COLORS.SECONDARY,
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    paddingVertical: THEME.SPACING.PADDING.VERTICAL,
  },
});
