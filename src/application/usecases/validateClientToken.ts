import type { ISMTPClientRepository } from "../../domain/repositories/clientRespository.ts";
import { SMTPClient } from "../../domain/entities/smtpClient.ts";
import { AppError } from "../../domain/entities/emailEntity.ts";
import type { IValidateClientTokenUseCase } from "../../domain/interfaces/useCases.ts";


export class ValidateClientToken implements IValidateClientTokenUseCase {
    private smtpClientRepository: ISMTPClientRepository;
    constructor(smtpClientRepository: ISMTPClientRepository) {
        this.smtpClientRepository = smtpClientRepository;
    }

    async execute(token: string): Promise<{ smtpConfig: any }> {
        if (!token || typeof token !== "string") {
            throw new AppError("Token is required for client validation", 401, true);
        }
        let client: SMTPClient;
        try {
            client = await this.smtpClientRepository.findByPk(token);
        } catch (err: any) {
            // Repository should throw AppError for not found, but catch and rethrow as unauthorized
            throw new AppError("Unauthorized: Invalid or expired token", 401, true);
        }
        if (!(client instanceof SMTPClient) || !client.smtpconfig) {
            throw new AppError("Unauthorized: Invalid client or missing SMTP config", 401, true);
        }
        return { smtpConfig: client.smtpconfig };
    }
}
