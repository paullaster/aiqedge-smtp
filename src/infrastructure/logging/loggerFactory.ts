import pino, { LoggerOptions } from 'pino';
import { join } from 'path';

export interface LoggerFactoryOptions {
    channel: string;
    level: string;
    logDir: string;
    rotation: 'daily' | 'size' | 'none';
    rotationConfig: {
        interval?: string;
        maxSize?: string;
        maxFiles?: string;
    };
    environment: string;
    appName: string;
}

export function createLogger(opts: LoggerFactoryOptions) {
    let transport: LoggerOptions['transport'];
    const baseFile =
        opts.rotation === 'daily'
            ? `${opts.appName}-${opts.channel}-${new Date().toISOString().slice(0, 10)}.log`
            : `${opts.appName}-${opts.channel}.log`;
    const logFile = join(opts.logDir, baseFile);

    if (opts.environment === 'development') {
        transport = {
            target: 'pino-pretty',
            options: { colorize: true }
        };
    } else if (opts.rotation === 'daily' || opts.rotation === 'size') {
        transport = {
            target: 'pino/file-rotate',
            options: {
                filename: logFile,
                interval: opts.rotationConfig.interval,
                maxSize: opts.rotationConfig.maxSize,
                maxFiles: opts.rotationConfig.maxFiles,
                mkdir: true,
            }
        };
    } else {
        transport = {
            target: 'pino/file',
            options: {
                destination: logFile,
                mkdir: true,
            }
        };
    }

    return pino({
        level: opts.level,
        transport,
    });
}