import request from 'supertest';
import app from '../src/app';
import { SequelizeDatabaseProvider } from '../src/infrastructure/database/sequelizeDatabaseProvider';
import { PinoLogger } from '../src/infrastructure/logging/pinoLogger';
import { emailQueue } from '../src/infrastructure/queue/emailQueueProvider';

jest.mock('../src/infrastructure/database/sequelizeDatabaseProvider');
jest.mock('../src/infrastructure/logging/pinoLogger');
jest.mock('../src/infrastructure/queue/emailQueueProvider');

describe('Email Integration Flow', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should send an email and store it (POST /smtp/send)', async () => {
        (SequelizeDatabaseProvider.prototype.save as jest.Mock).mockResolvedValue(undefined);
        (emailQueue.add as jest.Mock).mockResolvedValue(undefined);
        const email = {
            to: 'test@example.com',
            from: 'sender@example.com',
            subject: 'Integration Test',
            body: 'Hello world',
        };
        const res = await request(app)
            .post('/smtp/send')
            .send(email)
            .expect(200);
        expect(res.body.message).toMatch(/Email sent successfully/);
        expect(SequelizeDatabaseProvider.prototype.save).toHaveBeenCalledWith('emails', email);
        expect(emailQueue.add).toHaveBeenCalled();
    });

    it('should return 400 for missing fields', async () => {
        const res = await request(app)
            .post('/smtp/send')
            .send({ to: '', from: '', subject: '', body: '' })
            .expect(400);
        expect(res.body.message).toMatch(/Missing required email fields/);
    });

    it('should retrieve all emails (GET /smtp/emails)', async () => {
        const emails = [
            { to: 'a@b.com', from: 'b@a.com', subject: 's', body: 'b' },
        ];
        (SequelizeDatabaseProvider.prototype.findAll as jest.Mock).mockResolvedValue(emails);
        const res = await request(app)
            .get('/smtp/emails')
            .expect(200);
        expect(res.body.emails).toEqual(emails);
    });

    it('should handle DB errors gracefully', async () => {
        (SequelizeDatabaseProvider.prototype.findAll as jest.Mock).mockRejectedValue(new Error('DB fail'));
        const res = await request(app)
            .get('/smtp/emails')
            .expect(500);
        expect(res.body.message).toMatch(/Failed to retrieve emails/);
    });

    it('should send an email with attachments, cc, bcc (POST /smtp/send)', async () => {
        (SequelizeDatabaseProvider.prototype.save as jest.Mock).mockResolvedValue(undefined);
        (emailQueue.add as jest.Mock).mockResolvedValue(undefined);
        const email = {
            to: 'test@example.com',
            from: 'sender@example.com',
            subject: 'Advanced Test',
            cc: ['cc1@example.com', 'cc2@example.com'],
            bcc: 'bcc@example.com',
            replyTo: 'reply@example.com',
            attachments: [
                {
                    filename: 'file.txt',
                    content: Buffer.from('Hello world').toString('base64'),
                    encoding: 'base64',
                },
            ],
            html: '<b>HTML Body</b>',
            text: 'Plain text body',
        };
        const res = await request(app)
            .post('/smtp/send')
            .send(email)
            .expect(200);
        expect(res.body.message).toMatch(/Email sent successfully/);
        expect(SequelizeDatabaseProvider.prototype.save).toHaveBeenCalledWith('emails', email);
        expect(emailQueue.add).toHaveBeenCalled();
    });

    it('should return 400 for invalid attachments', async () => {
        const email = {
            to: 'test@example.com',
            from: 'sender@example.com',
            subject: 'Invalid Attachments',
            attachments: [{ foo: 'bar' }],
        };
        const res = await request(app)
            .post('/smtp/send')
            .send(email)
            .expect(400);
        expect(res.body.message).toMatch(/Each attachment must have at least a filename, path, or content/);
    });
});
