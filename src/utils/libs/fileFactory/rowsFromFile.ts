import fs, { PathLike } from 'fs';
import readExcel from 'read-excel-file/node';
import csv from 'csvtojson';

const rowsFromFile = async (
	filePath: PathLike,
	callback: (err: Error | null, data?: Array<string>) => void
) => {
	const extension = filePath
		.toString()
		.slice(filePath.toString().length - 3, filePath.toString().length);
	if (extension === 'csv' || extension === 'CSV') {
		fs.readFile(filePath, 'utf8', (error, fileContent) => {
			if (error) {
				return callback(error);
			} else {
				csv({
					noheader: true,
					output: 'csv'
				})
					.fromString(fileContent)
					.then((rows: Array<string>) => {
						callback(null, rows);
					});
			}
		});
	} else {
		readExcel(fs.createReadStream(filePath)).then((rows: Array<string>) => {
			callback(null, rows);
		});
	}
};

export default rowsFromFile;
