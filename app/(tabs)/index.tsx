import React from 'react';
import { StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { THEME } from '@/constants/theme';
import { useMeal } from '@/hooks/useMeal';
import { RootStackParamList } from '@/types/navigation';
import { DateSelector } from '@/components/DateSelector';
import { MealItem } from '@/components/MealItem';
import { EventEmitter } from '@/utils/EventEmitter';

export default function MealsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { meals, selectedDate, setSelectedDate, loadMeals, toggleMealExpansion } = useMeal(
    new Date(),
  );

  React.useEffect(() => {
    const subscription = EventEmitter.addListener('mealCreated', loadMeals);
    return () => {
      subscription.remove();
    };
  }, [loadMeals]);

  const handleNavigateToModal = () => {
    navigation.navigate('modal');
  };

  return (
    <View
      style={styles.container}
      lightColor={THEME.COLORS.BACKGROUND.LIGHT}
      darkColor={THEME.COLORS.BACKGROUND.DARK}>
      <View
        style={styles.header}
        lightColor={THEME.COLORS.BACKGROUND.LIGHT}
        darkColor={THEME.COLORS.BACKGROUND.DARK}>
        <Text style={styles.title}>Minhas refeições</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleNavigateToModal}>
          <Feather name="plus" size={24} color={THEME.COLORS.SECONDARY} />
        </TouchableOpacity>
      </View>

      <DateSelector date={selectedDate} onDateChange={setSelectedDate} />

      <View
        style={styles.listContainer}
        lightColor={THEME.COLORS.BACKGROUND.LIGHT}
        darkColor={THEME.COLORS.BACKGROUND.DARK}>
        <FlatList
          data={meals}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <MealItem
              meal={item}
              date={selectedDate}
              onToggleExpansion={toggleMealExpansion}
              loadData={loadMeals}
            />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    marginLeft: THEME.SPACING.MARGIN.HORIZONTAL,
    marginTop: THEME.SPACING.MARGIN.VERTICAL,
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: THEME.SPACING.PADDING.HORIZONTAL,
    width: '100%',
  },
  listContainer: {
    flexGrow: 1,
    marginHorizontal: '5%',
    width: '90%',
  },
  title: {
    color: THEME.COLORS.PRIMARY,
    fontSize: THEME.FONT.SIZE.TITLE,
    fontWeight: 'bold',
    marginBottom: THEME.SPACING.MARGIN.VERTICAL,
    marginTop: THEME.SPACING.MARGIN.TOP,
  },
});
