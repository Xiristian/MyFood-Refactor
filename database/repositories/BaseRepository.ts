import { DatabaseService } from '../services/DatabaseService';

export abstract class BaseRepository<T> {
  protected db: DatabaseService;
  protected tableName: string;

  constructor(tableName: string) {
    this.db = DatabaseService.getInstance();
    this.tableName = tableName;
  }

  public async findAll(): Promise<T[]> {
    return this.db.executeQuery<T>(`SELECT * FROM ${this.tableName}`);
  }

  protected async findById(id: number): Promise<T | null> {
    const results = await this.db.executeQuery<T>(`SELECT * FROM ${this.tableName} WHERE id = ?`, [
      id,
    ]);
    return results[0] || null;
  }

  public async delete(id: number): Promise<void> {
    await this.db.executeQuery(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]);
  }
}
