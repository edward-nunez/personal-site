import winston from 'winston';
import config from '../../configs/index.js';

const { combine, timestamp, printf, colorize, errors } = winston.format;

/**
 * Custom log format
 */
const logFormat = printf(({ level, message, timestamp: ts, stack }) => {
  return `${ts} [${level}]: ${stack || message}`;
});

/**
 * Winston logger configuration
 */
const logger = winston.createLogger({
  level: config.logLevel,
  format: combine(
    // Only include stack traces in logs when NODE_ENV is development or test
    errors({ stack: config.isDevOrTest }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    }),

    // File transport for errors
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),

    // File transport for all logs
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
  exceptionHandlers: [new winston.transports.File({ filename: 'logs/exceptions.log' })],
  rejectionHandlers: [new winston.transports.File({ filename: 'logs/rejections.log' })],
});

/**
 * In production, we might want to send logs to external service
 */
if (config.nodeEnv === 'production') {
  // Add production transports here (e.g., CloudWatch, Datadog)
  logger.level = 'warn';
}

export default logger;
