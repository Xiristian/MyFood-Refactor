import * as SQLite from 'expo-sqlite';
import { Text, View } from '@/components/Themed';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { DataSource, QueryRunner } from 'typeorm';
import { FoodRepository } from './repositories/FoodRepository';
import { MealRepository } from './repositories/MealRepository';
import { Meal } from './entities/meal-entity';
import { Food } from './entities/food-entity';
import { UserRepository } from './repositories/UserRepository';
import { User } from './entities/user-entity';

interface DatabaseConnectionContextData {
  foodRepository: FoodRepository;
  mealRepository: MealRepository;
  userRepository: UserRepository;
  connection: DataSource | null;
  queryRunner: QueryRunner | null;
}

const DatabaseConnectionContext = createContext<DatabaseConnectionContextData>(
  {} as DatabaseConnectionContextData,
);

const queryCache = new Map<string, any>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const DatabaseConnectionProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [connection, setConnection] = useState<DataSource | null>(null);
  const [queryRunner, setQueryRunner] = useState<QueryRunner | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  const connect = useCallback(async () => {
    try {
      const createdConnection = new DataSource({
        type: 'expo',
        database: 'myfood.db',
        driver: SQLite,
        entities: [Meal, Food, User],
        synchronize: true,
        logging: false, 
        cache: {
          duration: CACHE_DURATION,
        },
      });

      const initializedConnection = await createdConnection.initialize();
      
      // Criar índices em uma transação única
      const runner = initializedConnection.createQueryRunner();
      await runner.connect();
      await runner.startTransaction();
      
      try {
        await runner.query('CREATE INDEX IF NOT EXISTS idx_meal_date ON meal (date)');
        await runner.query('CREATE INDEX IF NOT EXISTS idx_food_meal ON food (mealId)');
        await runner.commitTransaction();
      } catch (error) {
        await runner.rollbackTransaction();
        console.error('Erro ao criar índices:', error);
      }

      // Configurar PRAGMAs após inicialização
      await runner.query('PRAGMA journal_mode = WAL');
      await runner.query('PRAGMA synchronous = NORMAL');
      await runner.query('PRAGMA temp_store = MEMORY');
      await runner.query('PRAGMA cache_size = 10000');
      
      setConnection(initializedConnection);
      setQueryRunner(runner);
    } catch (error) {
      console.error('Erro na conexão com o banco:', error);
      setIsError(true);
    }
  }, []);

  useEffect(() => {
    if (!connection) {
      connect();
    }

    return () => {
      const cleanup = async () => {
        try {
          if (queryRunner) {
            await queryRunner.release();
          }
          if (connection) {
            await connection.destroy();
          }
        } catch (error) {
          console.error('Erro no cleanup:', error);
        }
      };
      cleanup();
    };
  }, [connect, connection]);

  if (isError) {
    return (
      <View
        style={{
          backgroundColor: '#7a3687',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}>
        <Text lightColor="#eee" darkColor="rgba(255,255,255,0.1)">
          Erro ao conectar ao banco de dados. Tente novamente.
        </Text>
      </View>
    );
  }

  if (!connection || !queryRunner) {
    return (
      <View
        style={{
          backgroundColor: '#7a3687',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}>
        <Text lightColor="#eee" darkColor="rgba(255,255,255,0.1)">
          Carregando...
        </Text>
      </View>
    );
  }

  return (
    <DatabaseConnectionContext.Provider
      value={{
        foodRepository: new FoodRepository(connection),
        mealRepository: new MealRepository(connection, queryCache),
        userRepository: new UserRepository(connection),
        connection,
        queryRunner,
      }}>
      {children}
    </DatabaseConnectionContext.Provider>
  );
};

export function useDatabaseConnection() {
  const context = useContext(DatabaseConnectionContext);

  if (!context) {
    throw new Error('useDatabaseConnection must be used within a DatabaseConnectionProvider');
  }

  return context;
}

// Função utilitária para limpar o cache
export function clearQueryCache() {
  queryCache.clear();
}
