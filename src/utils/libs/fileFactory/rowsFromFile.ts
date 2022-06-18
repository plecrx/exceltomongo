import fs, { PathLike } from 'fs';
import readExcel from 'read-excel-file/node';
import csv from 'csvtojson';
import { Logger } from 'utils/libs/logger/logger';

const rowsFromFile = async (
	filePath: PathLike,
	callback: (err: Error | null, data: Array<{ [x: string]: any }>) => void
) => {
	const extension = filePath
		.toString()
		.slice(filePath.toString().length - 3, filePath.toString().length);

	if (extension === 'csv' || extension === 'CSV') {
		return fs.readFile(filePath, 'utf8', (error, fileContent) => {
			if (error) {
				callback(error, []);
			} else {
				csv({
					noheader: true,
					output: 'csv'
				})
					.fromString(fileContent)
					.then((rows: Array<{ [x: string]: any }>) => {
						return callback(null, rows);
					});
			}
		});
	}

	return readExcel(fs.createReadStream(filePath))
		.then((rows: Array<{ [x: string]: any }>) => {
			return callback(null, rows);
		})
		.catch((error: any) => {
			Logger.error(error);
		});
};

export default rowsFromFile;
