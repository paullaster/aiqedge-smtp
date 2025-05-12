import type { IDatabaseProvider } from '../../domain/repositories/smtpRepository.ts';
import { EmailEntity } from '../../domain/entities/emailEntity.ts';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { extension as mimeExtension } from 'mime-types';

interface SaveAttachmentParams {
    base64Content: string;
    filename?: string;
    clientId: string;
    mimetype: string;
}

export class EmailStorageService {
    private db: IDatabaseProvider
    constructor(db: IDatabaseProvider) {
        this.db = db;
    }

    async saveEmail(email: EmailEntity): Promise<void> {
        await this.db.save<EmailEntity>('emails', email);
    }

    async getAllEmails(): Promise<EmailEntity[]> {
        return this.db.findAll<EmailEntity>('emails');
    }

    async saveAttachmentFromBase64({ base64Content, filename = 'random', clientId, mimetype }: SaveAttachmentParams): Promise<{ path: string, finalFilename: string, ext: string }> {
        const storageDir = resolve(process.cwd(), 'storage/emails/attachment');
        await mkdir(storageDir, { recursive: true });
        const timestamp = Date.now();
        const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
        const ext = mimeExtension(mimetype) || 'bin';
        const finalFilename = `${clientId}_${timestamp}_${safeFilename}.${ext}`;
        const filePath = join(storageDir, finalFilename);
        const buffer = Buffer.from(base64Content, 'base64');
        await writeFile(filePath, buffer);
        return { path: filePath, finalFilename, ext };
    }
}
