import { useState, useEffect, useCallback } from 'react';
import { MealService } from '@/database/services/MealService';
import { ItemMeal, Food, Meal } from '@/database/types';
import { FoodDTO } from '@/backend/get-foods';
import { DEFAULT_MEALS, ERROR_MESSAGES } from '@/constants/app';

interface MealBuilder {
  withName(name: string): MealBuilder;
  withIcon(iconName: string): MealBuilder;
  withPosition(position: number): MealBuilder;
  build(): Omit<Meal, 'id' | 'foods'>;
}

class MealBuilderImpl implements MealBuilder {
  private meal: Partial<Omit<Meal, 'id' | 'foods'>> = {};

  withName(name: string): MealBuilder {
    this.meal.name = name.trim();
    return this;
  }

  withIcon(iconName: string): MealBuilder {
    this.meal.iconName = iconName;
    return this;
  }

  withPosition(position: number): MealBuilder {
    this.meal.position = position;
    return this;
  }

  build(): Omit<Meal, 'id' | 'foods'> {
    if (!this.meal.name || !this.meal.iconName || this.meal.position === undefined) {
      throw new Error('Meal is missing required properties');
    }
    return this.meal as Omit<Meal, 'id' | 'foods'>;
  }
}

interface FoodBuilder {
  withName(name: string): FoodBuilder;
  withCalories(calories: number): FoodBuilder;
  withMealId(mealId: number): FoodBuilder;
  withDate(date: Date): FoodBuilder;
  build(): Omit<Food, 'id'>;
}

class FoodBuilderImpl implements FoodBuilder {
  private food: Partial<Omit<Food, 'id'>> = {};

  withName(name: string): FoodBuilder {
    this.food.name = name;
    return this;
  }

  withCalories(calories: number): FoodBuilder {
    this.food.calories = calories;
    return this;
  }

  withMealId(mealId: number): FoodBuilder {
    this.food.mealId = mealId;
    return this;
  }

  withDate(date: Date): FoodBuilder {
    this.food.date = date;
    return this;
  }

  build(): Omit<Food, 'id'> {
    if (!this.food.name || !this.food.mealId || !this.food.date) {
      throw new Error('Food is missing required properties');
    }
    return this.food as Omit<Food, 'id'>;
  }
}

export const useMeal = (initialDate: Date) => {
  const [meals, setMeals] = useState<ItemMeal[]>([]);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const mealService = MealService.getInstance();

  const createMealBuilder = (): MealBuilder => new MealBuilderImpl();
  const createFoodBuilder = (): FoodBuilder => new FoodBuilderImpl();

  const loadMeals = useCallback(async (): Promise<void> => {
    try {
      await mealService.initializeDefaultMeals([...DEFAULT_MEALS]);
      const mealsWithFoods = await mealService.getMealsWithFoods(selectedDate);

      setMeals((prevMeals) =>
        mealsWithFoods.map((meal, index) => ({
          ...meal,
          isExpanded: prevMeals[index]?.isExpanded ?? false,
        })),
      );
    } catch (error) {
      console.error(ERROR_MESSAGES.MEALS.LOAD_ERROR, error);
      throw error;
    }
  }, [mealService, selectedDate]);

  useEffect(() => {
    loadMeals();
  }, [selectedDate, loadMeals]);

  const toggleMealExpansion = (id: number): void => {
    setMeals((prevMeals) =>
      prevMeals.map((meal) => ({
        ...meal,
        isExpanded: meal.id === id ? !meal.isExpanded : meal.isExpanded,
      })),
    );
  };

  const addFoodsToMeal = async (
    mealId: number,
    selectedFoods: FoodDTO[],
    date: Date,
  ): Promise<void> => {
    try {
      await Promise.all(
        selectedFoods.map((food) => {
          const foodData = createFoodBuilder()
            .withName(food.food_name)
            .withCalories(food.calories)
            .withMealId(mealId)
            .withDate(date)
            .build();
          return mealService.addFoodToMeal(mealId, foodData);
        }),
      );
      await loadMeals();
    } catch (error) {
      console.error(ERROR_MESSAGES.MEALS.ADD_FOOD_ERROR, error);
      throw error;
    }
  };

  const createMeal = async (mealName: string): Promise<void> => {
    if (!mealName.trim()) {
      throw new Error('Meal name cannot be empty');
    }

    try {
      const mealData = createMealBuilder()
        .withName(mealName)
        .withIcon('sunrise')
        .withPosition(meals.length)
        .build();

      await mealService.createMeal(mealData);
      await loadMeals();
    } catch (error) {
      console.error(ERROR_MESSAGES.MEALS.CREATE_ERROR, error);
      throw error;
    }
  };

  return {
    meals,
    selectedDate,
    setSelectedDate,
    loadMeals,
    toggleMealExpansion,
    addFoodsToMeal,
    createMeal,
  };
};
