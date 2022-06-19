import { Request, Response } from 'express';
import { convertToMongo } from 'utils/libs/databaseFactory/convertToMongo';

export class DatabasesController {
	excelToMongoDB = async (req: Request, res: Response) => {
		if (!req.file) {
			res.status(400).send('Missing file.');
			return;
		}

		convertToMongo(
			req.file.path,
			JSON.parse(req.body.data),
			JSON.parse(req.body.options),
			(error, results) => {
				if (error) {
					res.status(400).send({ data: 'Malformed Exception' });
					return;
				}
				res.status(200).send({ data: results });
			}
		);
	};
}
