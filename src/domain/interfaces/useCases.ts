// Abstraction for the use case/service
export interface IValidateClientTokenUseCase {
    execute(token: string): Promise<{ smtpConfig: any } | null>;
}