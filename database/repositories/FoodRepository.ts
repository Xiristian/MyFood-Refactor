import { BaseRepository } from './BaseRepository';
import { Food } from '../types';

export class FoodRepository extends BaseRepository<Food> {
  constructor() {
    super('foods');
  }

  async findFoodsByDate(date: Date): Promise<Food[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.db.executeQuery<Food>(
      'SELECT * FROM foods WHERE date >= ? AND date <= ?',
      [startOfDay.toISOString(), endOfDay.toISOString()]
    );
  }

  async create(food: Omit<Food, 'id'>): Promise<Food> {
    const id = await this.db.executeInsert(
      'INSERT INTO foods (name, calories, mealId, date) VALUES (?, ?, ?, ?)',
      [food.name, food.calories || null, food.mealId, food.date.toISOString()]
    );
    return { ...food, id };
  }

  async update(id: number, food: Partial<Food>): Promise<void> {
    const currentFood = await this.findById(id);
    if (!currentFood) throw new Error('Alimento não encontrado');

    const updates: string[] = [];
    const values: any[] = [];

    if (food.name) {
      updates.push('name = ?');
      values.push(food.name);
    }
    if (food.calories !== undefined) {
      updates.push('calories = ?');
      values.push(food.calories);
    }
    if (food.mealId) {
      updates.push('mealId = ?');
      values.push(food.mealId);
    }
    if (food.date) {
      updates.push('date = ?');
      values.push(food.date.toISOString());
    }

    if (updates.length > 0) {
      values.push(id);
      await this.db.executeQuery(
        `UPDATE foods SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }
  }
}
