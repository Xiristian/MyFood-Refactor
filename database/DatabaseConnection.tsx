import React, { createContext, useContext, useEffect, useState } from 'react';
import { Text, View } from '@/components/Themed';
import { DatabaseService } from './services/DatabaseService';

interface DatabaseConnectionContextData {
  db: DatabaseService;
}

const DatabaseConnectionContext = createContext<DatabaseConnectionContextData>(
  {} as DatabaseConnectionContextData
);

export const DatabaseConnectionProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isError, setIsError] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const db = DatabaseService.getInstance();
        await db.initializeDatabase();
        setIsInitialized(true);
      } catch (error) {
        console.error('Erro na inicialização do banco:', error);
        setIsError(true);
      }
    };

    initializeDatabase();
  }, []);

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

  if (!isInitialized) {
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
        db: DatabaseService.getInstance(),
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
