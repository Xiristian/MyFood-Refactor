import { BaseRepository } from './BaseRepository';
import { Food, Meal } from '../types';

export class MealRepository extends BaseRepository<Meal> {
  constructor() {
    super('meals');
  }

  async findAllWithFoods(): Promise<Meal[]> {
    const meals = await this.db.executeQuery<Meal>('SELECT * FROM meals ORDER BY `position`');
    const foods = await this.db.executeQuery<Food>('SELECT * FROM foods');

    return meals.map((meal) => ({
      ...meal,
      foods: foods.filter((food) => food.mealId === meal.id),
    }));
  }

  async create(meal: Omit<Meal, 'id' | 'foods' | 'date' | 'userId'>): Promise<Partial<Meal>> {
    const id = await this.db.executeInsert(
      'INSERT INTO meals (name, iconName, `position`) VALUES (?, ?, ?)',
      [meal.name, meal.iconName, meal.position],
    );
    return { ...meal, id, foods: [] };
  }

  async update(id: number, meal: Partial<Omit<Meal, 'foods'>>): Promise<void> {
    const currentMeal = await this.findById(id);
    if (!currentMeal) throw new Error('Refeição não encontrada');

    const updates: string[] = [];
    const values: any[] = [];

    if (meal.name) {
      updates.push('name = ?');
      values.push(meal.name);
    }
    if (meal.iconName) {
      updates.push('iconName = ?');
      values.push(meal.iconName);
    }
    if (meal.position !== undefined) {
      updates.push('`position` = ?');
      values.push(meal.position);
    }

    if (updates.length > 0) {
      values.push(id);
      await this.db.executeQuery(`UPDATE meals SET ${updates.join(', ')} WHERE id = ?`, values);
    }
  }

  async findByDateWithFoods(date: Date): Promise<Meal[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const meals = await this.db.executeQuery<Meal>('SELECT * FROM meals ORDER BY `position`');
    const foods = await this.db.executeQuery<Food>(
      'SELECT * FROM foods WHERE date >= ? AND date <= ?',
      [startOfDay.toISOString(), endOfDay.toISOString()],
    );

    return meals.map((meal) => ({
      ...meal,
      foods: foods.filter((food) => food.mealId === meal.id),
    }));
  }
}
