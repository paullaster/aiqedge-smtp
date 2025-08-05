import type { Request, Response } from 'express';
import { executeSendEmail } from '../../application/usecases/sendEmail.ts';
import { SmtpService } from '../../application/services/smtpService.ts';
import { EmailStorageService } from '../../application/services/emailStorageService.ts';
import type { SmtpConfigShape } from '../../types/index.ts';
import type { ILoggingProvider } from '../../domain/repositories/smtpRepository.ts';

class SmtpController {
    private smtpService: SmtpService;
    private emailStorageService: EmailStorageService;
    public readonly logger: ILoggingProvider;

    constructor(
        logger: ILoggingProvider,
        smtpService: SmtpService,
        emailStorageService: EmailStorageService
    ) {
        this.smtpService = smtpService;
        this.emailStorageService = emailStorageService;
        this.logger = logger;
    }

    async sendEmail(req: Request, res: Response, next: Function): Promise<void> {
        try {
            const clientId = req.params.clientId;
            const emailData = req.body;
            const smtpconfig: SmtpConfigShape = req.smtpConfig;
            const result = await executeSendEmail(
                emailData,
                clientId,
                this.smtpService,
                this.emailStorageService,
                smtpconfig
            );
            res.status(200).json({ message: 'Email sent successfully', result });
        } catch (error) {
            (req as any).logger = (this as any).logger || undefined;
            next(error);
        }
    }
}

export default SmtpController;