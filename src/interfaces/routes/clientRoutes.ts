import { type Router } from 'express';
import { ClientController } from '../controllers/clientController.ts';
import { CreateClientUseCase } from '../../application/usecases/createClient.ts';
import { sequelizeDatabaseProviderInstance } from '../../infrastructure/database/index.ts';
import { SequelizeSMTPClientRepository } from '../../infrastructure/repositories/SequelizeClientRepository.ts';
import { logger } from '../../infrastructure/logging/index.ts';
import { asyncHandler } from './smtpRoutes.ts';
import { ValidateRequestBody } from '../middleware/validateRequestBody.ts';
import Joi from 'joi';

export const clientRoutes = (mainRouter: Router): void => {
    const smtpClientRepository = new SequelizeSMTPClientRepository(logger, sequelizeDatabaseProviderInstance.sequelize, sequelizeDatabaseProviderInstance.models['Client']);
    const createClientUseCase = new CreateClientUseCase(logger, smtpClientRepository);
    const clientController = new ClientController(logger, createClientUseCase);

    const clientSchema = Joi.object({

    });
    mainRouter.post(
        '/client',
        asyncHandler(ValidateRequestBody(clientSchema)),
        asyncHandler(clientController.createSMTPClient.bind(clientController))
    );
};
