import { AppError } from "../../domain/entities/emailEntity.ts";
import type { ISMTPClientRepository } from "../../domain/repositories/clientRespository.ts";
import type { ILoggingProvider } from "../../domain/repositories/smtpRepository.ts";

export class FetchSMTPClientUseCase {
    private logger: ILoggingProvider;
    private smtpClientRepository: ISMTPClientRepository;
    constructor(logger: ILoggingProvider, smtpClientRepository: ISMTPClientRepository) {
        this.logger = logger;
        this.smtpClientRepository = smtpClientRepository;
    }
    async findAll(query: Record<string, any>) {
        try {
            return await this.smtpClientRepository.findAll(query);
        } catch (error: any) {
            this.logger.error(error.message, error.stack);
            throw error;
        }
    }
    async findByPk(client: string) {
        try {
            if (!client || typeof client !== "string") {
                throw new AppError("Invalid client id", 400);
            }
            return await this.smtpClientRepository.findByPk(client);
        } catch (error: any) {
            this.logger.error(error.message, error.stack);
            throw error;
        }
    }
}