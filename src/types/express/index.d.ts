/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/express/index.d.ts
import 'express-serve-static-core';
import type { SmtpConfigShape } from 'types/index.ts';

declare module 'express-serve-static-core' {
    interface Request {
        smtpConfig: SmtpConfigShape
    }
}