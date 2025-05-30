import { BaseRepository } from './BaseRepository';
import { User } from '../types';

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super('users');
  }

  async findByEmail(email: string): Promise<User | null> {
    const results = await this.db.executeQuery<User>('SELECT * FROM users WHERE email = ?', [
      email,
    ]);
    return results[0] || null;
  }

  async create(user: Omit<User, 'id' | 'height' | 'weight' | 'age' | 'gender'>): Promise<User> {
    const id = await this.db.executeInsert(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      [user.email, user.password, user.name],
    );
    return { ...user, id } as User;
  }

  async update(id: number, user: Partial<User>): Promise<void> {
    const currentUser = await this.findById(id);
    if (!currentUser) throw new Error('Usuário não encontrado');

    const updates: string[] = [];
    const values: any[] = [];

    if (user.email) {
      updates.push('email = ?');
      values.push(user.email);
    }
    if (user.password) {
      updates.push('password = ?');
      values.push(user.password);
    }
    if (user.name) {
      updates.push('name = ?');
      values.push(user.name);
    }

    if (updates.length > 0) {
      values.push(id);
      await this.db.executeQuery(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
    }
  }

  async deleteAll(): Promise<void> {
    await this.db.executeQuery(`DELETE FROM ${this.tableName}`);
  }
}
