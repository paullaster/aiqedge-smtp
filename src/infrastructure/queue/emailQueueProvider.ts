import { Queue, Worker, Job } from 'bullmq';
import { SmtpProvider } from '../mail/smtpProvider.ts';
import IORedis from 'ioredis';
import type { Email, ILogger } from '../../types/index.ts';
import { PinoLogger } from '../logging/pinoLogger.ts';

const logger: ILogger = new PinoLogger('jobs')

const connection = new IORedis.default({ maxRetriesPerRequest: null });

export const emailQueue = new Queue('emailQueue', { connection });

const smtpProvider = new SmtpProvider();

const worker = new Worker('emailQueue', async (job: Job) => {
    const email: Email = job.data;
    await smtpProvider.sendMail('nodemailer', email);
}, { connection });

worker.on('active', async (_job: Job, _prev: string) => {
    logger.log('Active Jobs', { 'running jobs': await emailQueue.getActive() })
});
worker.on('completed', (job: Job, result: any, prev: string) => {
    logger.log('Job completed', { 'job': job.data, result, status: prev })
});

worker.on('error', (failedReason: Error) => {
    logger.error('Error running job', { failedReason })
});