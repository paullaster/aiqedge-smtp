import type { ILoggingProvider } from "../../domain/repositories/smtpRepository.ts";
import { CreateClientUseCase } from "../../application/usecases/createClient.ts";
import type { NextFunction, Request, Response } from "express";
import type { SMTPClient } from "../../types/index.ts";
import type { FetchSMTPClientUseCase } from "../../application/usecases/fetchSMTPCLient.ts";

export class ClientController {
    public readonly createClientUseCase: CreateClientUseCase;
    public readonly fetchSMTPClientUseCase: FetchSMTPClientUseCase
    public readonly logger: ILoggingProvider;

    constructor(logger: ILoggingProvider, createClientUseCase: CreateClientUseCase, fetchSMTPClientUseCase: FetchSMTPClientUseCase) {
        this.createClientUseCase = createClientUseCase;
        this.fetchSMTPClientUseCase = fetchSMTPClientUseCase;
        this.logger = logger;
    }
    async createSMTPClient(req: Request, res: Response, next: NextFunction) {
        try {
            const smtClientData: SMTPClient = { ...req.body };
            const smtpClient = await this.createClientUseCase.executeCreateSMTPClient(smtClientData);
            res.status(200).json({ message: 'Client created successfully', client: smtpClient });
        } catch (error) {
            (req as any).logger = this.logger;
            next(error);
        }
    }
    async fetchAll(req: Request, res: Response, next: NextFunction) {
        try {
            const query = req.query;
            const clients = await this.fetchSMTPClientUseCase.findAll(query);
            res.status(200).json({ message: 'Success', clients })
        } catch (error) {
            (req as any).logger = this.logger;
            next(error);
        }
    }
    async fetchOne(req: Request, res: Response, next: NextFunction) {
        try {
            const client = req.params.client;
            const clients = await this.fetchSMTPClientUseCase.findByPk(client);
            res.status(200).json({ message: 'Success', clients })
        } catch (error) {
            (req as any).logger = this.logger;
            next(error);
        }
    }
}