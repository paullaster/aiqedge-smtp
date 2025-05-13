module.exports = {
    apps: [
        {
            name: 'Email Service Provider',
            script: './src/server.ts',
            interpreter: 'node',
            interpreter_args: "--experimental-transform-types --max_old_space_size=1400 --env-file=./.env.production",
            env_file: './.env.production',
            post_update: ["npm install", "npm run build", "npm run migrate", "echo Email client is running"],
            watch: false,
            instances: 'max',
            exec_mode: 'cluster',
            max_memory_restart: '1800M',
            env_production: {
                NODE_ENV: 'production',
            },
            env_development: {
                NODE_ENV: 'development',
            }
        }
    ]
};
