import nodemailer from 'nodemailer';
import type { Email, SmtpConfigShape } from '../../types/index.ts';

export class EmailTransportProvider {
    private transporter;

    constructor(smtpConfig: SmtpConfigShape) {
        this.transporter = nodemailer.createTransport(smtpConfig);
    }

    async sendMail(email: Email): Promise<any> {
        return await this.transporter.sendMail(email);
    }
}