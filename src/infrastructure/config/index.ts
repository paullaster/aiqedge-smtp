import smtpConfig from './smtp.ts';
import appConfig from './app.ts';
import pinoConfig from './pino.ts';
import dbConfig from './db.ts';
import redisConfig from './redis.ts';
import clusterConfig from './cluster.ts';

const config = {
  app: appConfig,
  db: dbConfig,
  smtp: smtpConfig,
  pino: pinoConfig,
  redis: redisConfig,
  cluster: clusterConfig
};

export default config;