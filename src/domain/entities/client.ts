export class Client {
    public clientId: string;
    public clientName: string;
    public service: string;
    constructor(clientId: string, clientName: string, service: string) {
        this.clientId = clientId;
        this.clientName = clientName;
        this.service = service;
    }
}