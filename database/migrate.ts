import { DatabaseService } from './services/DatabaseService';
import * as initial from './migrations/001_initial';

interface Migration {
  up: () => Promise<void>;
  down: () => Promise<void>;
}

const migrations: Array<Migration & { name: string }> = [{ ...initial, name: '001_initial' }];

interface Logger {
  info: (message: string) => void;
  error: (message: string, error?: unknown) => void;
}

const logger: Logger = {
  info: (message: string) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Database] ${message}`);
    }
  },
  error: (message: string, error?: unknown) => {
    console.error(`[Database Error] ${message}`, error);
  },
};

async function migrate() {
  const db = DatabaseService.getInstance();

  try {
    // Criar tabela de migrações se não existir
    await db.executeQuery(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Executar migrações pendentes
    for (const migration of migrations) {
      const migrationName = migration.name;
      const executed = await db.executeQuery<{ id: number }>(
        'SELECT id FROM migrations WHERE name = ?',
        [migrationName],
      );

      if (executed.length === 0) {
        logger.info(`Executando migração: ${migrationName}`);
        await migration.up();
        await db.executeQuery('INSERT INTO migrations (name) VALUES (?)', [migrationName]);
        logger.info(`Migração ${migrationName} executada com sucesso`);
      }
    }

    logger.info('Todas as migrações foram executadas com sucesso');
  } catch (error) {
    logger.error('Erro ao executar migrações', error);
    process.exit(1);
  }
}

migrate();
