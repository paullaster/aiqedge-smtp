import { EmailTransportProvider } from './emailTransportProvider.ts';
import type { Email, EmailProviders } from '../../types/index.ts';
import type { ISmtpProvider } from '../../domain/repositories/smtpRepository.ts';

export class SmtpProvider implements ISmtpProvider {
    async sendMail(provider: EmailProviders, email: Email) {
        if (!provider) throw new Error('Missing email provider');
        switch (provider) {
            case 'nodemailer': {
                try {
                    const nodeMilerProvider = new EmailTransportProvider();
                    const info = await nodeMilerProvider.sendMail(email);
                    return { success: true, message: 'Email sent via infrastructure SMTP', info };
                } catch (error) {
                    throw error;
                }

            }
        }
    }
}
