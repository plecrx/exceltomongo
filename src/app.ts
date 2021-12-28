import express from 'express';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Logger } from './utils/libs/logger';
import morgan from 'morgan';
import { LoggerStream } from './utils/libs/loggerStream';

const app = express();
const port = 3001;

dotenv.config();

app.listen(port, () => {
  Logger.info(`Server running on port : ${port}!`);
});

app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(morgan('short', { stream: new LoggerStream() }));

app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});
