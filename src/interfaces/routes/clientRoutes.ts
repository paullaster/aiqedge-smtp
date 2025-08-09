import { type Router } from 'express';
import { ClientController } from '../controllers/clientController.ts';
import { CreateClientUseCase } from '../../application/usecases/createClient.ts';
import { sequelizeDatabaseProviderInstance } from '../../infrastructure/database/index.ts';
import { SequelizeSMTPClientRepository } from '../../infrastructure/repositories/SequelizeClientRepository.ts';
import { logger } from '../../infrastructure/logging/index.ts';
import { asyncHandler } from './smtpRoutes.ts';
import { ValidateRequestBody } from '../middleware/validateRequestBody.ts';
import Joi from 'joi';
import { FetchSMTPClientUseCase } from '../../application/usecases/fetchSMTPCLient.ts';
import { UpdateSMTPClientUseCase } from '../../application/usecases/updateSMTPClient.ts';

export const clientRoutes = (mainRouter: Router): void => {
    const smtpClientRepository = new SequelizeSMTPClientRepository(logger, sequelizeDatabaseProviderInstance.sequelize, sequelizeDatabaseProviderInstance.models['Client']);
    const createClientUseCase = new CreateClientUseCase(logger, smtpClientRepository);
    const fetchSMTPClientUseCase = new FetchSMTPClientUseCase(logger, smtpClientRepository);
    const updateSMTPClientUseCase = new UpdateSMTPClientUseCase(logger, smtpClientRepository);
    const clientController = new ClientController(logger, createClientUseCase, fetchSMTPClientUseCase, updateSMTPClientUseCase);

    const clientSchema = Joi.object({
        name: Joi.string().required(),
        config: Joi.object({
            from: Joi.string().required(),
            host: Joi.string().required(),
            port: Joi.number().required(),
            user: Joi.string().required(),
            pass: Joi.string().required(),
            secure: Joi.boolean().required()
        })
    });
    const updateClientSchema = Joi.object({
        name: Joi.string().optional(),
        config: Joi.object({
            from: Joi.string().optional(),
            host: Joi.string().optional(),
            port: Joi.number().optional(),
            user: Joi.string().optional(),
            pass: Joi.string().optional(),
            secure: Joi.boolean().optional()
        })
    });
    mainRouter.post(
        '/client',
        asyncHandler(ValidateRequestBody(clientSchema)),
        asyncHandler(clientController.createSMTPClient.bind(clientController))
    );
    mainRouter.post(
        '/client/:client',
        asyncHandler(ValidateRequestBody(updateClientSchema)),
        asyncHandler(clientController.updateClient.bind(clientController))
    );
    mainRouter.get('/client', asyncHandler(clientController.fetchAll.bind(clientController)));
    mainRouter.get('/client/:client', asyncHandler(clientController.fetchOne.bind(clientController)));
};
