module.exports = {
    apps: [
        {
            name: 'Email Service Provider',
            script: 'src/server.js',
            env_file: "./.env.production",
            watch: false,
            ignore_watch: ["node_modules"],
            instances: 'max',
            exec_mode: 'cluster',
            max_memory_restart: '3G',
            post_update: ["npm install", "npm run build", "npm run dev:migrate", "echo Email client is running"],
            node_args: ["--experimental-transform-types", "--max_old_space_size=500", "--env-file=.env.production"],
            env_production: {
                NODE_ENV: 'production',
            },
            env_development: {
                NODE_ENV: 'development',
            }
        }
    ]
};
