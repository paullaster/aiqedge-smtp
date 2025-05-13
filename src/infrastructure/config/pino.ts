import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir, stat } from 'fs/promises';
import appConfig from "./app.ts";
import type { Rotation } from "../../types/index.ts";

const __filename = fileURLToPath(import.meta.url);
const __rootdir = dirname(dirname(dirname(dirname(__filename))));


// ensure log directory exist
const ensureLogdir = async (dir: string) => {
    try {
        // Check directory exists
        await stat(dir);
    } catch (err: any) {
        if (err.code === 'ENOENT') {
            // Create directory
            await mkdir(dir, { recursive: true });
        } else {
            throw err;
        }
    }
}

const logDir = join(__rootdir, 'storage', 'logs');
await ensureLogdir(logDir);

const appName = appConfig.appName;
const rotation: Rotation = process.env.PINO_LOG_ROTATION as Rotation || 'daily' as Rotation;
const logLevel = process.env.LOG_LEVEL || 'info';


const pinoConfig = {
    level: logLevel,
    appName,
    logDir,
    rotation,
    rotationConfig: {
        maxSize: process.env.PINO_ROTATION_MAX_SIZE || '10m',
        maxFiles: process.env.PINO_ROTATION_MAX_FILES || '64d',
    },
};

export default pinoConfig;