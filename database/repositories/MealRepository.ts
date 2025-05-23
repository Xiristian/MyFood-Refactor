import { DataSource, Repository, In } from 'typeorm';
import { Meal } from '../entities/meal-entity';
import { Food } from '../entities/food-entity';

export class MealRepository {
  private mealRepository: Repository<Meal>;
  private foodRepository: Repository<Food>;
  private queryCache: Map<string, any>;

  constructor(dataSource: DataSource, queryCache: Map<string, any>) {
    try {
      this.mealRepository = dataSource.getRepository(Meal);
      this.foodRepository = dataSource.getRepository(Food);
      this.queryCache = queryCache;
    } catch (error) {
      console.error('Erro ao inicializar MealRepository:', error);
      throw error;
    }
  }

  private getCacheKey(method: string, params: any): string {
    return `${method}:${JSON.stringify(params)}`;
  }

  private setCache(key: string, data: any): void {
    try {
      this.queryCache.set(key, {
        data,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Erro ao definir cache:', error);
    }
  }

  private getCache(key: string): any | null {
    try {
      const cached = this.queryCache.get(key);
      if (!cached) return null;

      const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
      if (Date.now() - cached.timestamp > CACHE_DURATION) {
        this.queryCache.delete(key);
        return null;
      }

      return cached.data;
    } catch (error) {
      console.error('Erro ao obter cache:', error);
      return null;
    }
  }

  async findAll(): Promise<Meal[]> {
    try {
      const cacheKey = this.getCacheKey('findAll', {});
      const cached = this.getCache(cacheKey);
      if (cached) return cached;

      const meals = await this.mealRepository
        .createQueryBuilder('meal')
        .leftJoinAndSelect('meal.foods', 'foods')
        .cache(true)
        .getMany();

      this.setCache(cacheKey, meals);
      return meals;
    } catch (error) {
      console.error('Erro ao buscar todas as refeições:', error);
      return [];
    }
  }

  async findByDate(date: Date): Promise<Meal[]> {
    try {
      const cacheKey = this.getCacheKey('findByDate', { date });
      const cached = this.getCache(cacheKey);
      if (cached) return cached;

      const startDate = new Date(date);
      startDate.setUTCHours(0, 0, 0, 0);

      const endDate = new Date(date);
      endDate.setUTCHours(23, 59, 59, 999);

      const meals = await this.mealRepository
        .createQueryBuilder('meal')
        .leftJoinAndSelect('meal.foods', 'foods')
        .where('meal.date BETWEEN :startDate AND :endDate', { startDate, endDate })
        .cache(true)
        .getMany();

      this.setCache(cacheKey, meals);
      return meals;
    } catch (error) {
      console.error('Erro ao buscar refeições por data:', error);
      return [];
    }
  }

  async createMeal(meal: Partial<Meal>): Promise<Meal | null> {
    try {
      const createdMeal = await this.mealRepository.save(meal);
      this.queryCache.clear();
      return createdMeal;
    } catch (error) {
      console.error('Erro ao criar refeição:', error);
      return null;
    }
  }

  async createMeals(meals: Partial<Meal>[]): Promise<Meal[]> {
    try {
      return await this.mealRepository.manager.transaction(async (transactionalEntityManager) => {
        const createdMeals = await transactionalEntityManager.save(Meal, meals);
        this.queryCache.clear();
        return createdMeals;
      });
    } catch (error) {
      console.error('Erro ao criar múltiplas refeições:', error);
      return [];
    }
  }

  async createFood(
    name: string,
    quantity: number,
    calories: number,
    date: Date,
    mealId: number,
    unit: string,
  ): Promise<Food | null> {
    try {
      return await this.mealRepository.manager.transaction(async (transactionalEntityManager) => {
        const meal = await transactionalEntityManager.findOne(Meal, {
          where: { id: mealId },
          relations: ['foods'],
        });

        if (!meal) throw new Error('Meal not found');

        const food = transactionalEntityManager.create(Food, {
          name,
          quantity,
          calories,
          date,
          unit,
          meal,
        });

        const savedFood = await transactionalEntityManager.save(Food, food);
        this.queryCache.clear();
        return savedFood;
      });
    } catch (error) {
      console.error('Erro ao criar alimento:', error);
      return null;
    }
  }

  async update(id: number, name: string, order: number): Promise<Meal | null> {
    try {
      return await this.mealRepository.manager.transaction(async (transactionalEntityManager) => {
        const meal = await transactionalEntityManager.findOne(Meal, {
          where: { id },
          relations: ['foods'],
        });

        if (!meal) throw new Error('Meal not found');

        meal.name = name;
        meal.order = order;

        const updatedMeal = await transactionalEntityManager.save(Meal, meal);
        this.queryCache.clear();
        return updatedMeal;
      });
    } catch (error) {
      console.error('Erro ao atualizar refeição:', error);
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.mealRepository.delete(id);
      this.queryCache.clear();
      return true;
    } catch (error) {
      console.error('Erro ao deletar refeição:', error);
      return false;
    }
  }
}
