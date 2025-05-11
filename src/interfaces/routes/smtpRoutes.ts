import { Application, Request, Response, Router as ExpressRouter } from 'express';
import SmtpController from '../controllers/smtpController';
import { SequelizeDatabaseProvider } from '../../infrastructure/database/sequelizeDatabaseProvider';
import { BullMQQueueProvider } from '../../infrastructure/queue/bullmqQueueProvider';
import { SmtpService } from '../../application/services/smtpService';
import { EmailStorageService } from '../../application/services/emailStorageService';
import { PinoLogger } from '../../infrastructure/logging/pinoLogger';
import config from '../../infrastructure/config';
import emailModel from '../../infrastructure/database/emailModel';

interface IApp extends Application { }

interface ILogger {
  log(message: string): void;
  error(message: string): void;
}

export const setRoutes = (app: IApp): void => {
  const router: ExpressRouter = ExpressRouter({ caseSensitive: true });
  const logger: ILogger = new PinoLogger();
  const dbProvider = new SequelizeDatabaseProvider({ Email: emailModel },);
  const queueProvider = new BullMQQueueProvider('emailQueue', { ...config.redis });
  const smtpService = new SmtpService(logger, queueProvider);
  const emailStorageService = new EmailStorageService(dbProvider);
  const smtpController = new SmtpController(smtpService, emailStorageService);

  router.post('/:clientId/send', smtpController.sendEmail.bind(smtpController));
  router.get('/:clientId/emails', async (_req: Request, res: Response) => {
    try {
      const emails = await emailStorageService.getAllEmails();
      res.status(200).json({ emails });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to retrieve emails', error: true });
    }
  });
  // Health endpoint
  router.get('/health', async (_req: Request, res: Response) => {
    try {
      logger.log('Health check requested');
      // Optionally check DB/queue connectivity here
      res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    } catch (error: any) {
      logger.error('Health check failed: ' + error.message);
      res.status(500).json({ status: 'error', error: error.message });
    }
  });
  app.use('/smtp', router);
};