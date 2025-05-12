import { AppError } from '../../domain/entities/emailEntity.ts';
import type { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({ message: err.message, error: true });
    } else {
        res.status(500).json({ message: 'Internal Server Error', error: true });
    }
}