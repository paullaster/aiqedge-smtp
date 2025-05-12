import type { Request, Response } from 'express';
import { AppError } from '../../domain/entities/emailEntity.ts';
import { executeSendEmail } from '../../application/usecases/sendEmail.ts';
import { SmtpService } from '../../application/services/smtpService.ts';
import { EmailStorageService } from '../../application/services/emailStorageService.ts';

class SmtpController {
    private smtpService: SmtpService;
    private emailStorageService: EmailStorageService;

    constructor(
        smtpService: SmtpService,
        emailStorageService: EmailStorageService
    ) {
        this.smtpService = smtpService;
        this.emailStorageService = emailStorageService;
    }

    async sendEmail(req: Request, res: Response): Promise<void> {
        try {
            const clientId = req.params.clientId;
            const emailData = req.body;
            const result = await executeSendEmail(
                emailData,
                clientId,
                this.smtpService,
                this.emailStorageService
            );
            res.status(200).json({ message: 'Email sent successfully', result });
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message, error: true });
            } else if (error instanceof Error) {
                res.status(500).json({ message: error.message, error: true });
            } else {
                res.status(500).json({ message: 'Internal Server Error', error: true });
            }
        }
    }
}

export default SmtpController;