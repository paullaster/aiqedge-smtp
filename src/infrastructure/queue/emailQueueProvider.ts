import { Queue, Worker, Job } from 'bullmq';
import { SmtpProvider } from '../mail/smtpProvider';
import { Email } from '../../types';
import IORedis from 'ioredis';

const connection = new IORedis();

export const emailQueue = new Queue('emailQueue', { connection });

const smtpProvider = new SmtpProvider();

new Worker('emailQueue', async (job: Job) => {
    const email: Email = job.data;
    await smtpProvider.sendMail('nodemailer', email);
}, { connection });
