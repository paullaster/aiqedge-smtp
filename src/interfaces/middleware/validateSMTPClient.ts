import type { NextFunction, Request, Response } from "express";
import { errorHandler } from "../controllers/errorHandler.ts";
import type { IValidateClientTokenUseCase } from "../../domain/interfaces/useCases.ts";
import { AppError } from "../../domain/entities/emailEntity.ts";
import type { ILoggingProvider } from "../../domain/repositories/smtpRepository.ts";


// Middleware factory: inject use case/service
export function validateSMTPClient(validateClientTokenUseCase: IValidateClientTokenUseCase, logger: ILoggingProvider) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers["authorization"] || req.headers["Authorization"];
            if (!authHeader || typeof authHeader !== "string") {
                throw new AppError("Authorization header missing", 403);
            }
            const token = authHeader.replace(/^Bearer /i, "").trim();
            if (!token) {
                throw new AppError("Token missing in Authorization header", 403);
            }
            // Use injected use case/service
            const result = await validateClientTokenUseCase.execute(token);
            if (!result || !result.smtpConfig) {
                throw new AppError("Invalid client or missing SMTP config", 401);
            }
            req.body = req.body || {};
            req.body.customSMTPConf = result.smtpConfig;
            return next();
        } catch (err) {
            (req as any).logger = logger;
            return errorHandler(err, req, res, next);
        }
    };
}