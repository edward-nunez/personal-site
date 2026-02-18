import DbService from './infrastructure/persistence/db.js';
import logger from './shared/utils/logger.js';
import config from './configs/index.js';
import { createApp } from './app.js';

const app = createApp();
const port = config.port;

const startServer = async (): Promise<void> => {
  try {
    await DbService.connect();

    app.listen(port, () => {
      logger.info('🚀 Server started successfully');
      logger.info(`📦 Environment: ${config.nodeEnv}`);
      logger.info(`🔌 Port: ${port}`);
      logger.info(`🌐 CORS Origin: ${config.corsOrigin}`);
      logger.info(`📊 API available at: http://localhost:${port}/api`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
