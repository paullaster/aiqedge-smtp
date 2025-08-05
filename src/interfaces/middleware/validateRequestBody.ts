import { AppError } from "../../domain/entities/emailEntity.ts";
import type { NextFunction, Request, Response } from "express";
import Joi from 'joi';

export function ValidateRequestBody(schema: Joi.Schema) {
    return async (req: Request, _res: Response, next: NextFunction) => {
        const { error, value } = schema.validate(req.body);
        if (error) {
            throw new AppError(error.details[0].message, 400);
        }
        req.body = value;
        next();
    }
}