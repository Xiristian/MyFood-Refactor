import React, { createContext, useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DatabaseService } from './services/DatabaseService';
import { THEME } from '@/constants/theme';

interface DatabaseContextType {
  isInitialized: boolean;
}

const DatabaseContext = createContext<DatabaseContextType>({ isInitialized: false });

export function DatabaseConnectionProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initDatabase = async () => {
      try {
        const databaseService = DatabaseService.getInstance();
        await databaseService.initializeDatabase();
        setIsInitialized(true);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro ao inicializar banco de dados'));
      }
    };

    initDatabase();
  }, []);

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Erro ao conectar ao banco de dados: {error.message}</Text>
      </View>
    );
  }

  if (!isInitialized) {
    return (
      <View style={styles.container}>
        <Text>Inicializando banco de dados...</Text>
      </View>
    );
  }

  return <DatabaseContext.Provider value={{ isInitialized }}>{children}</DatabaseContext.Provider>;
}

export function useDatabaseConnection() {
  return useContext(DatabaseContext);
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: THEME.COLORS.PRIMARY,
    flex: 1,
    justifyContent: 'center',
  },
});
