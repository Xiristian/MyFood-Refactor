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

    const query = `SELECT * FROM ${this.tableName} WHERE date BETWEEN ? AND ?`;
    const params = [startOfDay.toISOString(), endOfDay.toISOString()];

    return await this.db.executeQuery<Food>(query, params);
  }

  async findFoodsByMealId(mealId: number): Promise<Food[]> {
    const query = `SELECT * FROM ${this.tableName} WHERE mealId = ?`;
    return await this.db.executeQuery<Food>(query, [mealId]);
  }

  async create(food: Omit<Food, 'id'>): Promise<Food> {
    const id = await this.db.executeInsert(
      'INSERT INTO foods (name, calories, mealId, date) VALUES (?, ?, ?, ?)',
      [food.name, food.calories || null, food.mealId, food.date ? food.date.toISOString() : null],
    );
    return { ...food, id };
  }

  async update(id: number, food: Partial<Food>): Promise<void> {
    const fields = Object.keys(food)
      .map(key => `${key} = ?`)
      .join(', ');
    const values = Object.values(food);

    const query = `UPDATE ${this.tableName} SET ${fields} WHERE id = ?`;
    await this.db.executeQuery(query, [...values, id]);
  }
}
