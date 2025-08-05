
import type { Request, Response, NextFunction } from 'express';
import config from "../../infrastructure/config/index.ts";
import type { SmtpConfigShape } from '../../types/index.ts';
const { smtp } = config;

type smtConfig = typeof smtp;
type CustomSmtpConfig = smtConfig & { from?: string };

export function useCustomSMTPConfig(defaultConfig: smtConfig) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const customConfig: CustomSmtpConfig = req.body['customSMTPConf'];
        if (customConfig) {
            // Validate required fields
            const missing = [];
            if (!customConfig.host) missing.push('host');
            if (!customConfig.port) missing.push('port');
            // Accept 'secure' as boolean or string, but must be present
            if (customConfig.secure === undefined) missing.push('secure');
            if (!customConfig.user) missing.push('user');
            if (!customConfig.pass) missing.push('pass');
            // Enforce 'from' exists
            let fromValue = customConfig.from;
            if (!fromValue) missing.push('from');
            if (missing.length > 0) {
                return res.status(400).json({ error: `Missing required SMTP config fields: ${missing.join(', ')}` });
            }
            // Set req.body.from
            req.body.from = customConfig.from;
            // Coerce secure to boolean
            let secureValue: boolean;
            if (typeof customConfig.secure === 'boolean') {
                secureValue = customConfig.secure;
            } else if (typeof customConfig.secure === 'string') {
                secureValue = customConfig.secure === 'true';
            } else {
                secureValue = false;
            }
            const smtpConfig: SmtpConfigShape = {
                host: customConfig.host,
                port: customConfig.port,
                secure: secureValue,
                auth: {
                    user: customConfig.user,
                    pass: customConfig.pass,
                },
            };
            req.smtpConfig = smtpConfig;
            return next();
        } else {
            // Coerce defaultConfig.secure to boolean
            let defaultSecure: boolean;
            if (typeof defaultConfig.secure === 'boolean') {
                defaultSecure = defaultConfig.secure;
            } else if (typeof defaultConfig.secure === 'string') {
                defaultSecure = defaultConfig.secure === 'true';
            } else {
                defaultSecure = false;
            }
            const smtpConfig: SmtpConfigShape = {
                host: defaultConfig.host,
                port: defaultConfig.port,
                secure: defaultSecure,
                auth: {
                    user: defaultConfig.user,
                    pass: defaultConfig.pass,
                },
            };
            req.smtpConfig = smtpConfig;
            return next();
        }
    };
}