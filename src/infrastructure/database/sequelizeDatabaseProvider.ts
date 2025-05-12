import { Sequelize, DataTypes } from 'sequelize';
import config from '../config/index.ts';
import type { IDatabaseProvider } from '../../domain/repositories/smtpRepository.ts';
import type { Environments } from '../../types/index.ts';

class SequelizeDatabaseProvider implements IDatabaseProvider {
    private sequelize: Sequelize;
    public models: Record<string, any>;

    constructor(modelsToLoad: Record<string, (sequelize: Sequelize, DataTypes: any) => any>, env?: Environments) {
        const environment = env || config.app.environment as Environments;
        const { database, username, password, ...options } = config.db[environment];
        this.sequelize = new Sequelize(database, username, password, options);
        this.models = {};
        // Dynamically initialize models
        for (const [name, definer] of Object.entries(modelsToLoad)) {
            this.models[name] = definer(this.sequelize, DataTypes);
        }
        // Setup associations if any
        Object.values(this.models).forEach((model: any) => {
            if (model.associate) {
                model.associate(this.models);
            }
        });
    }

    async initDb(logger: { log: (msg: string, meta?: any) => void }) {
        try {
            await this.sequelize.authenticate();
            logger.log('Database connected successfully', { channel: 'db' });
        } catch (error) {
            logger.log('Unable to connect to the database', { channel: 'db', error });
            throw error;
        }
    }

    async save<T>(collection: string, item: T): Promise<void> {
        const model = this.models[collection] || this.models[collection.charAt(0).toUpperCase() + collection.slice(1)];
        if (model) {
            await model.create(item);
        } else {
            throw new Error(`Collection/model ${collection} not supported`);
        }
    }

    async findAll<T>(collection: string): Promise<T[]> {
        const model = this.models[collection] || this.models[collection.charAt(0).toUpperCase() + collection.slice(1)];
        if (model) {
            return await model.findAll();
        } else {
            throw new Error(`Collection/model ${collection} not supported`);
        }
    }
}

export { SequelizeDatabaseProvider };
