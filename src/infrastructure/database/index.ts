import { SequelizeDatabaseProvider } from "./sequelizeDatabaseProvider.ts";
import models from "./models/index.ts";

const sequelizeDatabaseProviderInstance = new SequelizeDatabaseProvider(models);

export {
    sequelizeDatabaseProviderInstance,
};