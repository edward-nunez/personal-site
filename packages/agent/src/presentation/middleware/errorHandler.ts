import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/errors/AppError.js';
import { logger } from '../../shared/utils/logger.js';

export interface ErrorResponse {
  success: boolean;
  error: string;
  message?: string;
  statusCode?: number;
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof AppError) {
    const statusCode = error.statusCode || 500;
    logger.error('AppError caught', {
      statusCode,
      message: error.message,
      details: error.details,
    });

    res.status(statusCode).json({
      success: false,
      error: error.message,
      ...(error.details ? { message: JSON.stringify(error.details) } : {}),
    } as ErrorResponse);
  } else if (error instanceof Error) {
    logger.error('Unexpected error', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined,
    } as ErrorResponse);
  } else {
    logger.error('Unknown error type', { error });

    res.status(500).json({
      success: false,
      error: 'Internal server error',
    } as ErrorResponse);
  }
}
