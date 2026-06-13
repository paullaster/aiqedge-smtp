import type { SMTPClient } from "../../types/index.ts";
import { AppError } from "../../domain/entities/emailEntity.ts";
import type { ISMTPClientRepository } from "../../domain/repositories/clientRespository.ts";
import type { ILoggingProvider } from "../../domain/repositories/smtpRepository.ts";

export class UpdateSMTPClientUseCase {
    private logger: ILoggingProvider;
    private smtpClientRepositories: ISMTPClientRepository;
    constructor(logger: ILoggingProvider, smtpClientRepository: ISMTPClientRepository) {
        this.logger = logger;
        this.smtpClientRepositories = smtpClientRepository;
    }
    async execute(client: string, payload: Partial<SMTPClient>) {
        try {
            if (!client || typeof client !== 'string') {
                throw new AppError("Invalid client id", 400);
            }
            const existingClient = await this.smtpClientRepositories.findByPk(client);

            if (!existingClient) {
                throw new AppError("Client not found", 404);
            }

            // Dynamically update client properties based on payload
            for (const key in payload) {
                if (key === 'config' && typeof payload.config === 'object' && payload.config !== null) {
                    for (const configKey in payload.config) {
                        if (Object.prototype.hasOwnProperty.call(existingClient.smtpconfig, configKey)) {
                            (existingClient.smtpconfig as any)[configKey] = (payload.config as any)[configKey];
                        }
                    }
                } else if (Object.prototype.hasOwnProperty.call(existingClient, key) && key !== 'id' && key !== 'smtpconfig') {
                    (existingClient as any)[key] = (payload as any)[key];
                }
            }

            const updatedClient = await this.smtpClientRepositories.save(existingClient);

            return updatedClient;

        } catch (error: any) {
            this.logger.error(error.message, error.stack);
            throw error;
        }
    }
}