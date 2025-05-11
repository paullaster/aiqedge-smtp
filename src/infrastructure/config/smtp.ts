function validateSmtpEnv() {
    const requiredVars = [
        'SMTP_HOST',
        'SMTP_PORT',
        'SMTP_USER',
        'SMTP_PASS',
    ];
    const missing = requiredVars.filter((v) => !process.env[v]);
    if (missing.length > 0) {
        throw new Error(`Missing required SMTP environment variables: ${missing.join(', ')}`);
    }
    if (isNaN(Number(process.env.SMTP_PORT))) {
        throw new Error('SMTP_PORT must be a number');
    }
}

validateSmtpEnv();

const smtpConfig = {
    host: process.env.SMTP_HOST!,
    port: parseInt(process.env.SMTP_PORT!, 10),
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
    secure: process.env.SMPT_ENCRYPTION,
};

export default smtpConfig;
