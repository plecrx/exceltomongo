import { HealthCheckController } from './healthCheck/healthCheckController';
import { ExcelToMongoController } from 'controllers/excelToMongo/excelToMongo.controller';

const healthCheckController = new HealthCheckController();
const excelToMongoController = new ExcelToMongoController();

export { healthCheckController, excelToMongoController };
