import { HealthCheckController } from './healthCheck/healthCheckController';
import { FilesController } from 'controllers/files/files.controller';
import { DatabasesController } from 'controllers/databases/databases.controller';

const healthCheckController = new HealthCheckController();
const databasesController = new DatabasesController();
const filesController = new FilesController();

export { healthCheckController, databasesController, filesController };
