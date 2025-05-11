import { Queue } from 'bullmq';
import { IQueueProvider } from '../../domain/repositories/smtpRepository';


/**
 * BullMQQueueProvider implements IQueueProvider for scalable background job processing.
 * It can be swapped for any other queue system with zero impact on business logic.
 */
export class BullMQQueueProvider implements IQueueProvider {
    private queue: Queue;
    constructor(queueName: string, connection: any) {
        this.queue = new Queue(queueName, { connection });
    }
    async add<T>(queueName: string, data: T): Promise<void> {
        await this.queue.add(queueName, data);
    }
}
