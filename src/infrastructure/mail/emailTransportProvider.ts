import nodemailer from 'nodemailer';
import { Email } from '../../types';
import config from '../config';

export class EmailTransportProvider {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: config.smtp.host,
            port: config.smtp.port || 587,
            secure: checkSecurityType(),
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

const checkSecurityType = (): boolean => {
    if (config.smtp.secure) throw new Error("Added Email security");
    if (config.smtp.secure === 'true' || config.smtp.secure === 'false') {
        return JSON.parse(config.smtp.secure);
    } else {
        return false
    }
}