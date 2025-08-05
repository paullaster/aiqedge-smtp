import type { SMTPClient } from "../../domain/entities/smtpClient.ts";

export interface ISMTPClientRepository {
    save(client: SMTPClient): Promise<SMTPClient>;
    findByPk(clientId: string): Promise<SMTPClient>;
    findAll(query: any | null): Promise<SMTPClient[]>;
    delete(clientId: string): Promise<boolean>
}