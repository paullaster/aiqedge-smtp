import nodemailer from 'nodemailer';
import config from '../config/index.ts';
import type { Email } from '../../types/index.ts';

export class EmailTransportProvider {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: config.smtp.host,
            port: config.smtp.port || 587,
            secure: config.smtp.secure === 'true' || false,
            auth: {
                user: config.smtp.user,
                pass: config.smtp.pass,
            },
        });
    }

    async sendMail(email: Email): Promise<any> {
        return await this.transporter.sendMail(email);
    }
}