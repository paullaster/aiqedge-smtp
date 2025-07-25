import { EmailEntity } from "../entities/emailEntity.ts";
import type { EmailPayload, EmailProviders } from "../../types/index.ts";

export interface ISmtpProvider {
    sendMail(provider: EmailProviders, email: EmailPayload): Promise<{ success: boolean; message: string }>;
}

export interface ILoggingProvider {
    /**
     * Log a message with optional structured metadata.
     * @param message The log message
     * @param meta Optional structured metadata for business/technical context
     */
    log(message: string, meta?: Record<string, any>): void;
    /**
     * Log an error with optional structured metadata.
     * @param message The error message
     * @param meta Optional structured metadata for business/technical context
     */
    error(message: string, meta?: Record<string, any>): void;
}

export interface IDatabaseProvider {
    save<T>(collection: string, item: T): Promise<void>;
    findAll<T>(collection: string): Promise<T[]>;
}

export interface IQueueProvider {
    add<T>(queueName: string, data: T): Promise<void>;
}


class SmtpRepository {
    private emails: EmailEntity[] = [];

    public save(email: EmailEntity): void {
        this.emails.push(email);
    }

    public findAll(): EmailEntity[] {
        return this.emails;
    }

    public findById(id: number): EmailEntity | undefined {
        return this.emails.find(email => email.id === id);
    }

    public deleteById(id: number): void {
        this.emails = this.emails.filter(email => email.id !== id);
    }
}

export default SmtpRepository;