import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from './Themed';
import { Feather } from '@expo/vector-icons';
import { Food } from '@/database/types';
import { MealService } from '@/database/services/MealService';

interface RenderFoodItemProps {
  food: Food;
  loadData: () => Promise<void>;
}

export default function RenderFoodItem({ food, loadData }: RenderFoodItemProps) {
  const mealService = MealService.getInstance();

  const handleDelete = async () => {
    try {
      await mealService.removeFoodFromMeal(food.id);
      await loadData();
    } catch (error) {
      console.error('Erro ao deletar alimento:', error);
    }
  };

  return (
    <View style={styles.foodContainer}>
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{food.name}</Text>
        <Text style={styles.foodCalories}>
          {food.calories ? `${food.calories} kcal` : 'Calorias não informadas'}
        </Text>
      </View>
      <TouchableOpacity onPress={handleDelete}>
        <Feather name="trash-2" size={24} color="#76A689" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  foodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#547260',
  },
  foodCalories: {
    fontSize: 14,
    color: '#76A689',
    marginTop: 4,
  },
});
