import { AppError } from '../../domain/entities/emailEntity.ts';
import type { Request, Response, NextFunction } from 'express';

/**
 * Centralized error handler middleware for all controllers.
 * Handles AppError, generic Error, and unknown errors with optimal efficiency and extensibility.
 * Logs error details if logger is attached to request, otherwise uses console.error.
 */
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
    // Use logger if available on request, else fallback to console
    const logger = (req as any).logger;
    if (err instanceof AppError) {
        logger ? logger.error(err.message, { stack: err.stack, source: 'AppError' }) : console.error(err);
        return res.status(err.statusCode).json({ message: err.message, error: true });
    }
    if (err instanceof Error) {
        logger ? logger.error(err.message, { stack: err.stack, source: 'Error' }) : console.error(err);
        return res.status(500).json({ message: err.message, error: true });
    }
    logger ? logger.error('Unknown error', { error: err, source: 'Unknown' }) : console.error('Unknown error', err);
    return res.status(500).json({ message: 'Internal Server Error', error: true });
}