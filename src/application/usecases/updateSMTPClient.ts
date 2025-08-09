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

        } catch (error: any) {
            this.logger.error(error.message, error.stack);
            throw error;
        }
    }
}