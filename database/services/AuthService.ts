import { User } from '../types';
import { UserRepository } from '../repositories/UserRepository';
import { ERROR_MESSAGES } from '@/constants/app';

interface UserBuilder {
  withEmail(email: string): UserBuilder;
  withPassword(password: string): UserBuilder;
  withName(name: string): UserBuilder;
  build(): Omit<User, 'id' | 'height' | 'weight' | 'age' | 'gender'>;
}

class UserBuilderImpl implements UserBuilder {
  private user: Partial<Omit<User, 'id'>> = {};

  withEmail(email: string): UserBuilder {
    this.user.email = email;
    return this;
  }

  withPassword(password: string): UserBuilder {
    this.user.password = password;
    return this;
  }

  withName(name: string): UserBuilder {
    this.user.name = name;
    return this;
  }

  build(): Omit<User, 'id'> {
    if (!this.user.email || !this.user.password || !this.user.name) {
      throw new Error('User is missing required properties');
    }
    return this.user as Omit<User, 'id'>;
  }
}

export class AuthService {
  private static instance: AuthService;
  private userRepository: UserRepository;
  private currentUser: User | null = null;

  private constructor() {
    this.userRepository = new UserRepository();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private createUserBuilder(): UserBuilder {
    return new UserBuilderImpl();
  }

  private async validateCredentials(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user || user.password !== password) {
      throw new Error(ERROR_MESSAGES.LOGIN.INVALID_CREDENTIALS);
    }
    return user;
  }

  private async validateNewUser(email: string): Promise<void> {
    return;
  }

  public async login(email: string, password: string): Promise<User> {
    try {
      const user = await this.validateCredentials(email, password);
      this.currentUser = user;
      return user;
    } catch (error) {
      console.error(ERROR_MESSAGES.LOGIN.LOGIN_PROCESS, error);
      throw error;
    }
  }

  public async register(
    userData: Omit<User, 'id' | 'calories' | 'height' | 'weight' | 'age' | 'gender'>,
  ): Promise<User> {
    try {
      await this.validateNewUser(userData.email);
      const newUser = this.createUserBuilder()
        .withEmail(userData.email)
        .withPassword(userData.password)
        .withName(userData.name)
        .build();

      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        return existingUser;
      }

      const createdUser = await this.userRepository.create(newUser);
      this.currentUser = createdUser;
      return createdUser;
    } catch (error) {
      console.error(ERROR_MESSAGES.USER.REGISTER_ERROR, error);
      throw error;
    }
  }

  public async updateUser(id: number, userData: Partial<User>): Promise<void> {
    try {
      if (userData.email) {
        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser && existingUser.id !== id) {
          throw new Error('E-mail já está em uso');
        }
      }

      await this.userRepository.update(id, userData);

      if (this.currentUser?.id === id) {
        this.currentUser = {
          ...this.currentUser,
          ...userData,
        };
      }
    } catch (error) {
      console.error(ERROR_MESSAGES.USER.UPDATE_ERROR, error);
      throw error;
    }
  }

  public async getCurrentUser(): Promise<User | null> {
    try {
      if (this.currentUser) {
        return this.currentUser;
      }

      const users = await this.userRepository.findAll();
      this.currentUser = users[0] || null;
      return this.currentUser;
    } catch (error) {
      console.error('Erro ao buscar usuário atual:', error);
      throw error;
    }
  }

  public async logout(): Promise<void> {
    this.currentUser = null;
  }
}
