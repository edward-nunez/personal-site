import DbService from './infrastructure/persistence/db.js';
import logger from './shared/utils/logger.js';
import config from './configs/index.js';
import { createApp } from './app.js';
import { initializeLDClient, closeLDClient } from './infrastructure/feature-flags/ldClient.js';

const app = createApp();
const port = config.port;

const startServer = async (): Promise<void> => {
  try {
    await DbService.connect();

    // Initialize LaunchDarkly client
    await initializeLDClient();
    logger.info('✨ Feature flags initialized');

    const server = app.listen(port, () => {
      logger.info(' Server started successfully');
      logger.info(`📦 Environment: ${config.nodeEnv}`);
      logger.info(`🔌 Port: ${port}`);
      logger.info(`🌐 CORS Origin: ${config.corsOrigin}`);
      logger.info(`📊 API available at: http://localhost:${port}/api`);
    });

    // Graceful shutdown handler
    const shutdown = async (signal: string) => {
      logger.info(`\n${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        logger.info('HTTP server closed');

        try {
          await closeLDClient();
          logger.info('LaunchDarkly client closed');
          await DbService.disconnect();
          logger.info('Database disconnected');
          logger.info('Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          logger.error('Error during shutdown:', error);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
