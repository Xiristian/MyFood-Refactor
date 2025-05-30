import { SQLiteDatabase } from 'expo-sqlite';

export interface ExtendedSQLiteDatabase extends SQLiteDatabase {}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  height: number;
  weight: number;
  age: number;
  gender: 'M' | 'F';
}

export interface Food {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealId?: number;
  date?: Date;
}

export interface Meal {
  id: number;
  name: string;
  date: Date;
  iconName: string;
  position: number;
  userId: number;
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
    errorCallback?: (transaction: SQLTransaction, error: SQLError) => boolean,
  ) => void;
}

export interface DatabaseTransaction extends SQLTransaction {
  executeSql(
    sqlStatement: string,
    args?: (string | number)[],
    callback?: (transaction: SQLTransaction, resultSet: SQLResultSet) => void,
    errorCallback?: (transaction: SQLTransaction, error: Error) => boolean,
  ): void;
}

export interface DatabaseConnection extends ExtendedSQLiteDatabase {
  transaction(
    callback: (transaction: DatabaseTransaction) => void,
    errorCallback?: (error: Error) => void,
    successCallback?: () => void,
  ): void;
}
