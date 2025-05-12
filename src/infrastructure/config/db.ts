import type { Dialect } from 'sequelize';
import { PinoLogger } from '../logging/pinoLogger.ts';
// Dedicated DB logger with size-based rotation
const dbLogger = new PinoLogger('db');

function validateAppEnv() {
    const requiredVars = ['DB_HOST', 'DB_DIALECT', 'DB_NAME', 'DB_PORT', 'DB_PASSWORD', 'DB_USER'];
    const missing = requiredVars.filter((v) => !process.env[v]);
    if (missing.length > 0) {
        throw new Error(`Missing required APP environment variables: ${missing.join(', ')}`);
    }
    if (isNaN(Number(process.env.DB_PORT))) {
        throw new Error('APP_PORT must be a number');
    }
}

validateAppEnv();

const development = {
    database: process.env.DB_NAME!,
    username: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    dialect: process.env.DB_DIALECT! as Dialect,
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT! || '5434', 10),
    timezone: process.env.APP_TIMEZONE || '+03:00',
    logging: (msg: string) => dbLogger.log(msg, { channel: 'db' }),
    logQueryParameters: JSON.parse(process.env.SEQUELIZE_LOG_QUERY_PARAMETERS || 'false'),
    dialectOptions: {},
    pool: {
        max: parseInt(process.env.POOL_MAX || '10', 10),
        min: parseInt(process.env.POOL_MIN || '0', 10),
        acquire: parseInt(process.env.POOL_ACQUIRE || '30000', 10),
        idle: parseInt(process.env.POOL_IDLE || '10000', 10),
    }
};

const test = {
    database: process.env.DB_NAME!,
    username: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    dialect: process.env.DB_DIALECT! as Dialect,
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT! || '5434', 10),
    timezone: process.env.APP_TIMEZONE || '+03:00',
    logging: (msg: string) => dbLogger.log(msg, { channel: 'db' }),
    logQueryParameters: JSON.parse(process.env.SEQUELIZE_LOG_QUERY_PARAMETERS || 'false'),
    dialectOptions: {},
    pool: {
        max: parseInt(process.env.POOL_MAX || '10', 10),
        min: parseInt(process.env.POOL_MIN || '0', 10),
        acquire: parseInt(process.env.POOL_ACQUIRE || '30000', 10),
        idle: parseInt(process.env.POOL_IDLE || '10000', 10),
    }
};

const staging = {
    database: process.env.DB_NAME!,
    username: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    dialect: process.env.DB_DIALECT! as Dialect,
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT! || '5434', 10),
    timezone: process.env.APP_TIMEZONE || '+03:00',
    logging: (msg: string) => dbLogger.log(msg, { channel: 'db' }),
    logQueryParameters: JSON.parse(process.env.SEQUELIZE_LOG_QUERY_PARAMETERS || 'false'),
    dialectOptions: {},
    pool: {
        max: parseInt(process.env.POOL_MAX || '10', 10),
        min: parseInt(process.env.POOL_MIN || '0', 10),
        acquire: parseInt(process.env.POOL_ACQUIRE || '30000', 10),
        idle: parseInt(process.env.POOL_IDLE || '10000', 10),
    }
};

const production = {
    database: process.env.DB_NAME!,
    username: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    dialect: process.env.DB_DIALECT! as Dialect,
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT! || '5434', 10),
    timezone: process.env.APP_TIMEZONE || '+03:00',
    logging: (msg: string) => dbLogger.log(msg, { channel: 'db' }),
    logQueryParameters: JSON.parse(process.env.SEQUELIZE_LOG_QUERY_PARAMETERS || 'false'),
    dialectOptions: {},
    pool: {
        max: parseInt(process.env.POOL_MAX || '10', 10),
        min: parseInt(process.env.POOL_MIN || '0', 10),
        acquire: parseInt(process.env.POOL_ACQUIRE || '30000', 10),
        idle: parseInt(process.env.POOL_IDLE || '10000', 10),
    }
};

const dbConfig = {
    development,
    test,
    staging,
    production
};

export default dbConfig;
