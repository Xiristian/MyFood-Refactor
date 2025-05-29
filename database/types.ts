import { SQLiteDatabase } from 'expo-sqlite';

export interface ExtendedSQLiteDatabase extends SQLiteDatabase {
  // Adicione aqui quaisquer métodos adicionais que você precise
}

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  image?: string | null;
}

export interface Food {
  id: number;
  name: string;
  calories: number | null;
  mealId: number;
  date: Date;
}

export interface Meal {
  id: number;
  name: string;
  iconName: string;
  position: number;
  foods?: Food[];
}

export interface ItemMeal extends Meal {
  isExpanded?: boolean;
}

export interface SQLError {
  message: string;
}

export interface SQLResultSet {
  insertId?: number;
  rowsAffected: number;
  rows: {
    _array: any[];
    length: number;
    item: (index: number) => any;
  };
}

export interface SQLTransaction {
  executeSql: (
    sqlStatement: string,
    args?: any[],
    callback?: (transaction: SQLTransaction, resultSet: SQLResultSet) => void,
    errorCallback?: (transaction: SQLTransaction, error: SQLError) => boolean
  ) => void;
} 