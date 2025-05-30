import { Food, Meal } from '../types';
import { MealRepository } from '../repositories/MealRepository';
import { FoodRepository } from '../repositories/FoodRepository';
import { readFoodsFromImage } from '@/backend/read-foods-from-image';
import { FoodDTO } from '@/backend/get-foods';

export class MealService {
  private static instance: MealService;
  private mealRepository: MealRepository;
  private foodRepository: FoodRepository;

  private constructor() {
    this.mealRepository = new MealRepository();
    this.foodRepository = new FoodRepository();
  }

  public static getInstance(): MealService {
    if (!MealService.instance) {
      MealService.instance = new MealService();
    }
    return MealService.instance;
  }

  public async getMealsWithFoods(date: Date): Promise<Meal[]> {
    try {
      return this.mealRepository.findByDateWithFoods(date);
    } catch (error) {
      console.error('Erro ao buscar refeições:', error);
      throw error;
    }
  }

  public async createMeal(
    mealData: Omit<Meal, 'id' | 'foods' | 'date' | 'userId'>,
  ): Promise<Partial<Meal>> {
    try {
      return this.mealRepository.create(mealData);
    } catch (error) {
      console.error('Erro ao criar refeição:', error);
      throw error;
    }
  }

  public async updateMeal(id: number, mealData: Partial<Omit<Meal, 'foods'>>): Promise<void> {
    try {
      await this.mealRepository.update(id, mealData);
    } catch (error) {
      console.error('Erro ao atualizar refeição:', error);
      throw error;
    }
  }

  public async deleteMeal(id: number): Promise<void> {
    try {
      const foods = await this.foodRepository.findFoodsByMealId(id);
      for (const food of foods) {
        await this.foodRepository.delete(food.id);
      }
      
      await this.mealRepository.delete(id);
    } catch (error) {
      console.error('Erro ao deletar refeição:', error);
      throw error;
    }
  }

  public async addFoodToMeal(mealId: number, foodData: Omit<Food, 'id'>): Promise<Food> {
    try {
      return this.foodRepository.create(foodData);
    } catch (error) {
      console.error('Erro ao adicionar alimento:', error);
      throw error;
    }
  }

  public async removeFoodFromMeal(foodId: number): Promise<void> {
    try {
      await this.foodRepository.delete(foodId);
    } catch (error) {
      console.error('Erro ao remover alimento:', error);
      throw error;
    }
  }

  public async getFoodsByDate(date: Date): Promise<Food[]> {
    try {
      return this.foodRepository.findFoodsByDate(date);
    } catch (error) {
      console.error('Erro ao buscar alimentos:', error);
      throw error;
    }
  }

  public async initializeDefaultMeals(
    defaultMeals: Array<Omit<Meal, 'id' | 'foods' | 'date' | 'userId'>>,
  ): Promise<void> {
    try {
      const meals = await this.mealRepository.findAll();
      if (meals.length === 0) {
        for (const meal of defaultMeals) {
          await this.createMeal(meal);
        }
      }
    } catch (error) {
      console.error('Erro ao inicializar refeições padrão:', error);
      throw error;
    }
  }

  public async handleImageCapture(mealId: number, imageUri: string, date: Date): Promise<void> {
    try {
      const foods = await readFoodsFromImage(imageUri);
      if (foods.length === 0) {
        throw new Error('Nenhum alimento foi identificado na imagem');
      }

      await Promise.all(
        foods.map((food: FoodDTO) =>
          this.addFoodToMeal(mealId, {
            name: food.food_name,
            calories: food.calories,
            protein: food.protein,
            carbs: food.carbs,
            fat: food.fat,
            mealId: mealId,
            date: date,
          }),
        ),
      );
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      throw error;
    }
  }
}
