import { User } from '../types';
import { UserRepository } from '../repositories/UserRepository';

export class AuthService {
  private static instance: AuthService;
  private userRepository: UserRepository;

  private constructor() {
    this.userRepository = new UserRepository();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async login(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (user && user.password === password) {
        return user;
      }
      return null;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  }

  public async register(userData: Omit<User, 'id'>): Promise<User> {
    try {
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('Usuário já existe');
      }
      return this.userRepository.create(userData);
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      throw error;
    }
  }

  public async updateUser(id: number, userData: Partial<User>): Promise<void> {
    try {
      await this.userRepository.update(id, userData);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  }

  public async getCurrentUser(): Promise<User | null> {
    try {
      const users = await this.userRepository.findAll();
      return users[0] || null;
    } catch (error) {
      console.error('Erro ao buscar usuário atual:', error);
      throw error;
    }
  }
} 