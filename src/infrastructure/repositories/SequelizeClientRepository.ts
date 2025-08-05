import type { Model, Sequelize, ModelStatic } from "sequelize";
import type { ISMTPClientRepository } from "../../domain/repositories/clientRespository.ts";
import type { ISMTPClient } from "../../domain/interfaces/IClient.ts";
import { SMTPClient } from "../../domain/entities/smtpClient.js";
import { AppError } from "../../domain/entities/emailEntity.ts";
import type { ILoggingProvider } from "../../domain/repositories/smtpRepository.ts";

export class SequelizeSMTPClientRepository implements ISMTPClientRepository {
    public sequelizeInstance: Sequelize;
    public clientModel: ModelStatic<Model<ISMTPClient>>;
    private logger: ILoggingProvider;
    constructor(logger: ILoggingProvider, sequelizeInstance: Sequelize, clientModel: ModelStatic<Model<ISMTPClient>>) {
        this.clientModel = clientModel;
        this.sequelizeInstance = sequelizeInstance;
        this.logger = logger;
    }
    async save(client: SMTPClient): Promise<SMTPClient> {
        const t = await this.sequelizeInstance.transaction();
        try {
            if (!(client instanceof SMTPClient)) {
                throw new AppError('Must be an instance of SMTP client', 400, true);
            }
            const persistableClient = client.toPersistenceObject();
            const clientExist = await this.clientModel.findByPk(persistableClient.clientId);
            if (clientExist) {
                await clientExist.update(persistableClient, { transaction: t });
            } else {
                await this.clientModel.create(persistableClient, { transaction: t });
            }
            await t.commit();
            return client;
        } catch (error: any) {
            await t.rollback();
            this.logger.error(error.message, error.stack);
            throw error;
        }
    }
    async findByPk(clientId: string): Promise<SMTPClient> {
        try {
            if (!clientId) {
                throw new AppError('Invalid client id', 400, true);
            }
            const client = await this.clientModel.findByPk(clientId);
            if (!client) {
                throw new AppError('Client not found!', 404);
            }
            return SMTPClient.smtpClientFromModel(client.toJSON());
        } catch (error: any) {
            this.logger.error(error.message, error.stack);
            throw error;
        }
    }
    async findAll(query: any | null): Promise<SMTPClient[]> {
        try {
            const clients = await this.clientModel.findAndCountAll(query);
            return await Promise.all(clients.rows.map((row) => SMTPClient.smtpClientFromModel(row.toJSON())));
        } catch (error: any) {
            this.logger.error(error.message, error.stack);
            throw error;
        }
    }
    async delete(clientId: string): Promise<boolean> {
        const t = await this.sequelizeInstance.transaction();
        try {
            if (!clientId) {
                throw new AppError('Invalid client id', 400, true);
            }
            await this.clientModel.destroy({ where: { clientId: clientId } });
            await t.commit();
            return true;
        } catch (error: any) {
            await t.rollback();
            this.logger.error(error.message, error.stack);
            throw error;
        }
    }
}