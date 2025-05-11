function validateAppEnv() {
    const requiredVars = ['APP_NAME', 'APP_PORT'];
    const missing = requiredVars.filter((v) => !process.env[v]);
    if (missing.length > 0) {
        throw new Error(`Missing required APP environment variables: ${missing.join(', ')}`);
    }
    if (isNaN(Number(process.env.APP_PORT))) {
        throw new Error('APP_PORT must be a number');
    }
}

validateAppEnv();

const appConfig = {
    appName: process.env.APP_NAME || 'aiqedge-smtp',
    port: parseInt(process.env.APP_PORT!, 10),
    environment: process.env.NODE_ENV || 'development',
};

export default appConfig;
