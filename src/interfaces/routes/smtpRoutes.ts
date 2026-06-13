import { Router as ExpressRouter } from 'express';
import SmtpController from '../controllers/smtpController.ts';
import { sequelizeDatabaseProviderInstance } from '../../infrastructure/database/index.ts';
import { BullMQQueueProvider } from '../../infrastructure/queue/bullmqQueueProvider.ts';
import { SmtpService } from '../../application/services/smtpService.ts';
import { EmailStorageService } from '../../application/services/emailStorageService.ts';
import { logger } from '../../infrastructure/logging/index.ts';
import config from '../../infrastructure/config/index.ts';
import type { Application, Request, Response } from 'express';
import { useCustomSMTPConfig } from '../../interfaces/middleware/purgeCustomSmtpConfig.ts';
import { clientRoutes } from './clientRoutes.ts';
import { validateSMTPClient } from '../../interfaces/middleware/validateSMTPClient.ts';
import { ValidateClientToken } from '../../application/usecases/validateClientToken.ts';
import { SequelizeSMTPClientRepository } from '../../infrastructure/repositories/SequelizeClientRepository.ts';

interface IApp extends Application { }
// Helper to wrap async route handlers
export const asyncHandler = (fn: any) => (req: Request, res: Response, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const setRoutes = (app: IApp): void => {
  const router: ExpressRouter = ExpressRouter({ caseSensitive: true });
  const queueProvider = new BullMQQueueProvider('emailQueue', { ...config.redis });
  const smtpService = new SmtpService(logger, queueProvider);
  const emailStorageService = new EmailStorageService(sequelizeDatabaseProviderInstance);
  const smtpController = new SmtpController(logger, smtpService, emailStorageService);
  const smtClientRepository = new SequelizeSMTPClientRepository(logger, sequelizeDatabaseProviderInstance.sequelize, sequelizeDatabaseProviderInstance.models['Client']);
  const validateClientTokenUseCase = new ValidateClientToken(smtClientRepository);

  router.post(
    '/send',
    asyncHandler(validateSMTPClient(validateClientTokenUseCase, logger)),
    asyncHandler(useCustomSMTPConfig(config.smtp)),
    asyncHandler(smtpController.sendEmail.bind(smtpController))
  );
  router.get('/emails', async (_req: Request, res: Response) => {
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
      res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    } catch (error: any) {
      logger.error('Health check failed: ' + error.message);
      res.status(500).json({ status: 'error', error: error.message });
    }
  });



  // SMTP Client
  clientRoutes(router);



  app.use(`/api/${config.app.appName}/email/${config.app.appVersion}`, router);
};