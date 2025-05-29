import { DatabaseService } from '../services/DatabaseService';

export async function up() {
  const db = DatabaseService.getInstance();
  await db.initializeDatabase();
}

export async function down() {
  const db = DatabaseService.getInstance();
  
  const dropTables = [
    'DROP TABLE IF EXISTS foods',
    'DROP TABLE IF EXISTS meals',
    'DROP TABLE IF EXISTS users'
  ];

  for (const query of dropTables) {
    await db.executeQuery(query);
  }
} 