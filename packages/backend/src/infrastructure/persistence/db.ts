import pg from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import config from '../../configs/index.js';
import * as schema from './schema.js';
import logger from '../../shared/utils/logger.js';

/**
 * Drizzle DB singleton instance
 * Replaces PrismaService — manages the PostgreSQL connection pool and Drizzle client.
 */
class DbService {
  private static pool: pg.Pool | null = null;
  private static instance: NodePgDatabase<typeof schema> | null = null;

  /**
   * Get the Drizzle DB instance (singleton).
   */
  static getInstance(): NodePgDatabase<typeof schema> {
    if (!DbService.instance) {
      const connectionString = config.databaseUrl;
      if (!connectionString) {
        throw new Error('DATABASE_URL environment variable is not set');
      }

      DbService.pool = new pg.Pool({ connectionString });
      DbService.instance = drizzle(DbService.pool, { schema });

      // Graceful shutdown handlers
      process.on('SIGINT', async () => {
        await DbService.disconnect();
        process.exit(0);
      });

      process.on('SIGTERM', async () => {
        await DbService.disconnect();
        process.exit(0);
      });
    }

    return DbService.instance;
  }

  /**
   * Connect to the database (verify connectivity).
   */
  static async connect(): Promise<void> {
    try {
      DbService.getInstance();
      const client = await DbService.pool!.connect();
      client.release();
      logger.info('✅ PostgreSQL connected successfully via Drizzle');
    } catch (error) {
      console.error(
        '❌ PostgreSQL connection failed:',
        error instanceof Error ? error.message : error
      );
      throw error;
    }
  }

  /**
   * Disconnect from the database.
   */
  static async disconnect(): Promise<void> {
    if (DbService.pool) {
      await DbService.pool.end();
      DbService.pool = null;
      DbService.instance = null;
      logger.info('PostgreSQL disconnected');
    }
  }

  /**
   * Health check — verify database connectivity.
   */
  static async healthCheck(): Promise<boolean> {
    try {
      const client = await DbService.pool!.connect();
      await client.query('SELECT 1');
      client.release();
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }
}

export default DbService;
export const db = DbService.getInstance();
