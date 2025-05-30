import * as SQLite from 'expo-sqlite';
import { ExtendedSQLiteDatabase } from '../types';

export class DatabaseService {
  private static instance: DatabaseService;
  private db: ExtendedSQLiteDatabase;

  private constructor() {
    this.db = SQLite.openDatabaseSync('myfood.db');
    this.db.execSync('PRAGMA journal_mode = WAL');
    this.db.execSync('PRAGMA foreign_keys = ON');
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async executeQuery<T>(query: string, params: any[] = []): Promise<T[]> {
    return await this.db.getAllAsync(query, params);
  }

  public async executeInsert(query: string, params: any[] = []): Promise<number> {
    const result = await this.db.runAsync(query, params);
    return result.lastInsertRowId;
  }

  public async initializeDatabase(): Promise<void> {
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        image TEXT
      )
    `;

    const createMealsTable = `
      CREATE TABLE IF NOT EXISTS meals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        iconName TEXT NOT NULL,
        position INTEGER NOT NULL
      )
    `;

    const createFoodsTable = `
      CREATE TABLE IF NOT EXISTS foods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        calories INTEGER,
        mealId INTEGER NOT NULL,
        date TEXT NOT NULL,
        FOREIGN KEY (mealId) REFERENCES meals (id)
      )
    `;

    try {
      await this.executeQuery(createUsersTable);
      await this.executeQuery(createMealsTable);
      await this.executeQuery(createFoodsTable);
    } catch (error) {
      console.error('Erro ao inicializar banco de dados:', error);
      throw error;
    }
  }
}
