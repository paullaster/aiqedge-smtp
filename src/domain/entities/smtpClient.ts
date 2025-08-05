import type { SMTPClientWithId } from "../../types/index.ts";
import type { ISMTPClient } from "../../domain/interfaces/IClient.ts";
import { Client } from "./client.ts";


export class SMTPClient extends Client {
    public smtpconfig: any;
    constructor(clietId: string, clientName: string, smtpConfig: any) {
        super(clietId, clientName, 'smtp');
        this.smtpconfig = smtpConfig;
    }
    public toPersistenceObject() {
        return {
            clientId: this.clientId,
            clientName: this.clientName,
            service: this.service,
            smtpconfig: this.smtpconfig,
        };
    }
    static smtpClientFromModel(model: ISMTPClient) {
        const client = new SMTPClient(model.clientId, model.clientName, model.smtpConfig);
        return client;
    }
    static smtpClientCustomObject(client: SMTPClientWithId) {
        return new SMTPClient(client.id, client.name, client.config);
    }
}