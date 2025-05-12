import type { ILoggingProvider, IQueueProvider } from '../../domain/repositories/smtpRepository.ts';
import type { Email } from '../../types/index.ts';

/**
 * SmtpService handles the orchestration of email sending, logging, and queueing.
 * It uses dependency injection for all providers, enabling full testability and scalability.
 */
export class SmtpService {
    private logger: ILoggingProvider;
    private queueProvider: IQueueProvider;
    constructor(
        logger: ILoggingProvider,
        queueProvider: IQueueProvider
    ) {
        this.logger = logger;
        this.queueProvider = queueProvider;
    }

    /**
     * Enqueue an email job for background sending using the injected queue provider.
     * @param email The email object containing all Nodemailer options.
     */
    async send(email: Email) {
        this.logger.log(`Queueing email to: ${email.to}`);
        try {
            await this.queueProvider.add('emailQueue', email);
            this.logger.log('Email enqueued successfully');
            return { success: true, message: 'Email enqueued for background sending' };
        } catch (err: any) {
            this.logger.error('Failed to enqueue email: ' + err.message);
            throw err;
        }
    }
}