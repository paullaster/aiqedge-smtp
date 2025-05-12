import { PinoLogger } from "./pinoLogger.ts";
import type { ILogger } from "../../types/index.ts";

const logger: ILogger = new PinoLogger();

export { logger };