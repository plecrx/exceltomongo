import 'module-alias/register';
import 'source-map-support/register';
import express, { Application } from 'express';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import morgan from 'morgan';

import cors from 'cors';
import { LoggerStream } from 'utils/libs/logger/loggerStream';
import { healthcheckRouter, excelToMongoRouter } from 'routes';

const app: Application = express();

dotenv.config();

app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(morgan('short', { stream: new LoggerStream() }));
app.use('/health', healthcheckRouter);
app.use('/excelToMongo', excelToMongoRouter);
app.use((req, res) => {
	res.status(404).send(`404 not found : ${req.originalUrl}`);
});

export default app;
