import crypto from 'crypto';

export function generateSecureRandomAlphanumeric(length: number) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charsLength = chars.length;
    let result = '';

    const randomBytes = crypto.randomBytes(length);

    for (let i = 0; i < length; i++) {
        result += chars[randomBytes[i] % charsLength];
    }

    return result;
}
