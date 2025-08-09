import type { ILoggingProvider } from "../../domain/repositories/smtpRepository.ts";
import { CreateClientUseCase } from "../../application/usecases/createClient.ts";
import type { NextFunction, Request, Response } from "express";
import type { SMTPClient } from "../../types/index.ts";
import type { FetchSMTPClientUseCase } from "../../application/usecases/fetchSMTPCLient.ts";
import type { UpdateSMTPClientUseCase } from "../../application/usecases/updateSMTPClient.ts";

export class ClientController {
    public readonly createClientUseCase: CreateClientUseCase;
    public readonly fetchSMTPClientUseCase: FetchSMTPClientUseCase;
    public readonly updateClientUseCase: UpdateSMTPClientUseCase;
    public readonly logger: ILoggingProvider;

    constructor(logger: ILoggingProvider, createClientUseCase: CreateClientUseCase, fetchSMTPClientUseCase: FetchSMTPClientUseCase, updateClientUseCase: UpdateSMTPClientUseCase) {
        this.createClientUseCase = createClientUseCase;
        this.fetchSMTPClientUseCase = fetchSMTPClientUseCase;
        this.updateClientUseCase = updateClientUseCase;
        this.logger = logger;
    }
    async createSMTPClient(req: Request, res: Response, next: NextFunction) {
        try {
            const smtClientData: SMTPClient = { ...req.body };
            const smtpClient = await this.createClientUseCase.executeCreateSMTPClient(smtClientData);
            res.status(201).json({ message: 'Client created successfully', client: smtpClient });
        } catch (error) {
            (req as any).logger = this.logger;
            next(error);
        }
    }
    async updateClient(req: Request, res: Response, next: NextFunction) {
        try {
            const client: string = req.params.client;
            const smtClientData: Partial<SMTPClient> = { ...req.body };
            const smtpClient = await this.updateClientUseCase.execute(client, smtClientData);
            res.status(200).json({ message: 'Client updated successfully', client: smtpClient });
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
            const client: string = req.params.client;
            const clients = await this.fetchSMTPClientUseCase.findByPk(client);
            res.status(200).json({ message: 'Success', clients })
        } catch (error) {
            (req as any).logger = this.logger;
            next(error);
        }
    }
}