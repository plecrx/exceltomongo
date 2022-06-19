import 'module-alias/register';
import 'source-map-support/register';
import express, { Application } from 'express';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import morgan from 'morgan';

import cors from 'cors';
import { LoggerStream } from 'utils/libs/logger/loggerStream';
import { healthcheckRouter, filesRouter, databasesRouter } from 'routes';

const app: Application = express();

dotenv.config();

app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(morgan('short', { stream: new LoggerStream() }));
app.use('/health', healthcheckRouter);
app.use('/files', filesRouter);
app.use('/databases', databasesRouter);
app.use((req, res) => {
	res.status(404).send(`404 not found : ${req.originalUrl}`);
});

export default app;

/*
* {
    "data": {
        "host": "cluster0.f9igl.mongodb.net",
        "path": "src/utils/data/zoneC.xlsx",
        "collection": "cities",
        "db": "exceltomongo",
        "user": "dbUser",
        "pass": "dbUserPassword",
        "connection": "",
        "endConnection": true
    },
    "options": {
        "safeMode": false,
        "verbose": true,
        "customStartEnd": false,
        "startRow": 1,
        "startCol": 1,
        "endRow": 100,
        "endCol": 10,
        "destination": ""
    }
}
*
* */
