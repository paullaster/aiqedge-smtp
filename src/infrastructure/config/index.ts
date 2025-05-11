import smtpConfig from './smtp';
import appConfig from './app';
import pinoConfig from './pino';
import dbConfig from './db.cjs';
import redisConfig from './redis';
import clusterConfig from './cluster';

const config = {
  app: appConfig,
  db: dbConfig,
  smtp: smtpConfig,
  pino: pinoConfig,
  redis: redisConfig,
  cluster: clusterConfig
};

export default config;