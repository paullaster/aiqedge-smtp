import { EmailTransportProvider } from './emailTransportProvider.ts';
import type { EmailPayload, EmailProviders } from '../../types/index.ts';
import type { ISmtpProvider } from '../../domain/repositories/smtpRepository.ts';

export class SmtpProvider implements ISmtpProvider {
    async sendMail(provider: EmailProviders, email: EmailPayload) {
        if (!provider) throw new Error('Missing email provider');
        switch (provider) {
            case 'nodemailer': {
                const nodeMilerProvider = new EmailTransportProvider(email.smtpConfig);
                const info = await nodeMilerProvider.sendMail(email.emailOptions).catch((reason) => {
                    console.log('reason for rejection: ', reason);
                });
                console.log('info: ', info);
                return { success: true, message: 'Email sent via infrastructure SMTP', info };
            }
        }
    }
}
