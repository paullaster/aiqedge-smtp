import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir, stat } from 'fs/promises';
import appConfig from "./app.ts";
import type { Rotation } from "../../types/index.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(dirname(__filename)));


// ensure log directory exist
const ensureLogdir = async (dir: string) => {
    try {
        // Check directory exists
        await stat(dir);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        if (err.code === 'ENOENT') {
            // Create directory
            await mkdir(dir, { recursive: true });
        } else {
            throw err;
        }
    }
}

const logDir = join(__dirname, 'storage', 'logs');
await ensureLogdir(logDir);

const appName = appConfig.appName;
const rotation: Rotation = process.env.PINO_LOG_ROTATION as Rotation || 'daily' as Rotation;
const logLevel = process.env.LOG_LEVEL || 'info';

// For daily rotation, filename will be appname-YYYY-MM-DD.log
// For size-based, filename will be appname.log (rotated by pino/file-rotate)
const getLogFileName = () => {
    if (rotation === 'daily') {
        const date = new Date().toISOString().slice(0, 10); // yyyy-mm-dd
        return `${appName}-${date}.log`;
    }
    return `${appName}.log`;
};

const pinoConfig = {
    level: logLevel,
    appName,
    logDir,
    rotation,
    getLogFileName,
    // Additional rotation config
    rotationConfig: {
        interval: process.env.PINO_ROTATION_INTERVAL || '1d', // for daily
        maxSize: process.env.PINO_ROTATION_MAX_SIZE || '10m', // for size-based
        maxFiles: process.env.PINO_ROTATION_MAX_FILES || '14d',
    },
};

export default pinoConfig;