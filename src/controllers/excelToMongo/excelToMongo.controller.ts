import { Request, Response } from 'express';
import { excelToMongo } from 'utils/libs/databaseFactory/excelToMongo';

export class ExcelToMongoController {
	convert = async (req: Request, res: Response) => {
		const initialData = {
			host: 'cluster0.f9igl.mongodb.net',
			path: 'src/utils/data/zoneC.xlsx',
			collection: 'cities',
			db: 'exceltomongo',
			user: 'dbUser',
			pass: 'dbUserPassword',
			connection: '',
			endConnection: true
		};

		const initialOptions = {
			safeMode: false,
			verbose: true,
			customStartEnd: false,
			startRow: 1,
			startCol: 1,
			endRow: 100,
			endCol: 10,
			destination: ''
		};
		try {
			return await excelToMongo(
				initialData,
				initialOptions,
				(error, results) => {
					if (!error) {
						return res.status(200).send({ data: results });
					}
					return res.status(400).send({ data: 'Malformed Exception' });
				}
			);
		} catch (e) {
			res.status(500).send({ data: 'Servor Error' });
		}
	};
}
