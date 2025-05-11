import { Request, Response } from 'express';
import { AppError } from '../../domain/entities/emailEntity';
import { executeSendEmail } from '../../application/usecases/sendEmail';
import { SmtpService } from '../../application/services/smtpService';
import { EmailStorageService } from '../../application/services/emailStorageService';

class SmtpController {
    constructor(
        private smtpService: SmtpService,
        private emailStorageService: EmailStorageService
    ) { }

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