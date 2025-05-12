import type { ILoggingProvider } from '../../domain/repositories/smtpRepository.ts';
import pinoConfig from '../config/pino.ts';
import appConfig from '../config/app.ts';
import { createLogger } from './loggerFactory.ts';

export class PinoLogger implements ILoggingProvider {
    private logger;
    private level: string;
    constructor(channel: string = 'app') {
        this.level = pinoConfig.level;
        this.logger = createLogger({
            channel,
            level: this.level,
            logDir: pinoConfig.logDir,
            rotation: pinoConfig.rotation,
            rotationConfig: pinoConfig.rotationConfig,
            environment: appConfig.environment,
            appName: pinoConfig.appName,
        });
    }

    log(message: string, meta?: Record<string, any>): void {
        // Route to the correct log level based on config
        switch (this.level) {
            case 'fatal':
                meta ? this.logger.fatal(meta, message) : this.logger.fatal(message);
                break;
            case 'error':
                meta ? this.logger.error(meta, message) : this.logger.error(message);
                break;
            case 'warn':
                meta ? this.logger.warn(meta, message) : this.logger.warn(message);
                break;
            case 'info':
                meta ? this.logger.info(meta, message) : this.logger.info(message);
                break;
            case 'debug':
                meta ? this.logger.debug(meta, message) : this.logger.debug(message);
                break;
            case 'trace':
                meta ? this.logger.trace(meta, message) : this.logger.trace(message);
                break;
            default:
                meta ? this.logger.info(meta, message) : this.logger.info(message);
        }
    }

    error(message: string, meta?: Record<string, any>): void {
        if (meta) {
            this.logger.error(meta, message);
        } else {
            this.logger.error(message);
        }
    }
}
