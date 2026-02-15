import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import config from '../../configs/index.js';

/**
 * Prisma Client singleton instance
 * Prevents multiple instances in development due to hot reload
 */
class PrismaService {
  private static instance: PrismaClient | null = null;

  /**
   * Get Prisma Client instance (singleton pattern)
   */
  static getInstance(): PrismaClient {
    if (!PrismaService.instance) {
      const connectionString = config.databaseUrl;
      if (!connectionString) {
        throw new Error('DATABASE_URL environment variable is not set');
      }
      const adapter = new PrismaPg({ connectionString });
      PrismaService.instance = new PrismaClient({
        adapter,
        log: config.nodeEnv === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
      });

      // Graceful shutdown handlers
      process.on('SIGINT', async () => {
        await PrismaService.disconnect();
        process.exit(0);
      });

      process.on('SIGTERM', async () => {
        await PrismaService.disconnect();
        process.exit(0);
      });
    }

    return PrismaService.instance;
  }

  /**
   * Connect to the database
   */
  static async connect(): Promise<void> {
    try {
      const prisma = PrismaService.getInstance();
      await prisma.$connect();
      console.log('✅ PostgreSQL connected successfully via Prisma');
    } catch (error) {
      console.error(
        '❌ PostgreSQL connection failed:',
        error instanceof Error ? error.message : error
      );
      throw error;
    }
  }

  /**
   * Disconnect from the database
   */
  static async disconnect(): Promise<void> {
    if (PrismaService.instance) {
      await PrismaService.instance.$disconnect();
      PrismaService.instance = null;
      console.log('PostgreSQL disconnected');
    }
  }

  /**
   * Health check - verify database connectivity
   */
  static async healthCheck(): Promise<boolean> {
    try {
      const prisma = PrismaService.getInstance();
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    }
  }
}

export default PrismaService;
export const prisma = PrismaService.getInstance();
