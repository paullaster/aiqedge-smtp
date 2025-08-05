import type { SMTPClient, SMTPClientWithId, SMTPConfig } from "../../types/index.ts";
import type { ISMTPClientRepository } from "../../domain/repositories/clientRespository.ts";
import type { ILoggingProvider } from "../../domain/repositories/smtpRepository.ts";
import { AppError } from "../../domain/entities/emailEntity.ts";
import { generateSecureRandomAlphanumeric } from "../../infrastructure/utils/randomAlphanumeric.ts";
import { SMTPClient as Client } from "../../domain/entities/smtpClient.ts";

export class CreateClientUseCase {
    private logger: ILoggingProvider;
    private smtpClientRepository: ISMTPClientRepository;
    constructor(logger: ILoggingProvider,
        smtpClientRepository: ISMTPClientRepository
    ) {
        this.smtpClientRepository = smtpClientRepository;
        this.logger = logger;
    }
    async executeCreateSMTPClient(clientData: SMTPClient): Promise<Client> {
        try {
            let validClient = true;
            const missing = [];
            const nested = [];
            for (const prop of Object.keys(clientData) as (keyof SMTPClient)[]) {
                if (typeof clientData[prop] === "undefined") {
                    validClient = false;
                    missing.push(prop);
                }
                if (typeof clientData[prop] === 'object') {
                    for (const key of Object.keys(clientData[prop]) as (keyof SMTPConfig)[]) {
                        if (clientData[prop][key] === "undefined") {
                            validClient = false;
                            nested.push(key);
                        }
                    }
                }
            }
            if (!validClient) {
                if (missing.length) {
                    throw new AppError(`Missing required fields. ${missing.join(', ')}`);
                }
                if (nested.length) {
                    throw new AppError(`Missing required config properties: ${nested.join(', ')}`)
                }
            }
            const id = generateSecureRandomAlphanumeric(48);
            const clientDataWithId: SMTPClientWithId = { id, ...clientData };
            const newClient = Client.smtpClientCustomObject(clientDataWithId);
            return await this.smtpClientRepository.save(newClient);
        } catch (error: any) {
            this.logger.error(error.message, error.stack);
            throw error;
        }
    }
}