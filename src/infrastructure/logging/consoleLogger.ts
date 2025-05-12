import type { ILoggingProvider } from '../../domain/repositories/smtpRepository.ts';

export class ConsoleLogger implements ILoggingProvider {
    log(message: string): void {
        console.log('[LOG]', message);
    }
    error(message: string): void {
        console.error('[ERROR]', message);
    }
}
