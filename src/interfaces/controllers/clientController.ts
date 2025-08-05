import type { ILoggingProvider } from "../../domain/repositories/smtpRepository.ts";
import { CreateClientUseCase } from "../../application/usecases/createClient.ts";
import type { NextFunction, Request, Response } from "express";
import type { SMTPClient } from "../../types/index.ts";

export class ClientController {
    public readonly createClientUseCase: CreateClientUseCase;
    public readonly logger: ILoggingProvider;

    constructor(logger: ILoggingProvider, createClientUseCase: CreateClientUseCase) {
        this.createClientUseCase = createClientUseCase;
        this.logger = logger;
    }
    async createSMTPClient(req: Request, res: Response, next: NextFunction) {
        try {
            const smtClientData: SMTPClient = { ...req.body };
            const smtpClient = await this.createClientUseCase.executeCreateSMTPClient(smtClientData);
            res.send(200).json({ message: 'Client created successfully', client: smtpClient });
        } catch (error) {
            (req as any).logger = this.logger;
            next(error);
        }
    }
}