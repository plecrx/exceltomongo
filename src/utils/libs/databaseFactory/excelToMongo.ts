import path from 'path';
import { exec } from 'child_process';
import { createConnection } from 'mongoose';
import rowsFromFile from '../fileFactory/rowsFromFile';
import formatDate from 'utils/libs/dateFactory/formatDate';
import isDate from 'utils/libs/dateFactory/isDate';
import createModel from 'utils/libs/modelFactory/createModel';
import { Logger } from 'utils/libs/logger/logger';

interface Options {
	safeMode?: boolean;
	verbose?: boolean;
	destination?: string;
	customStartEnd?: boolean;
	startRow?: number;
	startCol?: number;
	endRow?: number;
	endCol?: number;
}

interface Data {
	db: string;
	collection: string;
	connection: any;
	user: string;
	pass: string;
	host: string;
	path: string;
	endConnection: boolean;
}

const createInsertionObject = (
	sRow: number,
	eRow: number,
	rows: Array<{ [x: string]: any }>
) => {
	const data = [];
	for (let i = sRow + 1; i < eRow; i++) {
		const obj: { [x: string]: string } = {};
		for (const j in rows[i]) {
			obj[rows[sRow][j]] = rows[i][j];
		}
		data.push(obj);
	}
	return data;
};

const deleteModel = (connection: any, model: any) => {
	delete connection.models[model];
};

const closeConnection = (isEndConnection: boolean, connection: any) => {
	if (isEndConnection) {
		connection.close();
	}
};

export const excelToMongo = (
	data: Data,
	options: Options,
	callback: (arg0: Error | null, arg1?: string[]) => void
) => {
	//optional parameter 'options'
	if (typeof options === 'function') {
		callback = options;
		options = {};
	}
	return new Promise((resolve, reject) => {
		const sendError = (error: Error) => {
			Logger.error(error.message);
			reject(error.message);
			return callback(error);
		};

		const hasAllEndpoints =
			options.startRow && options.startCol && options.endRow && options.endCol;

		if (!data.db || !data.collection) {
			const error = new Error(
				'Undefined database or collection found. If this intentional, please pass them as string'
			);
			sendError(error);
		}

		const connectionString = `mongodb+srv://dbUser:dbUserPassword@cluster0.f9igl.mongodb.net/trivialsims?authSource=admin`;

		Logger.info('Try to connect with the provided credentials.');

		const connection =
			data.connection ||
			createConnection(connectionString, {
				user: data.user,
				pass: data.pass
			});

		connection.on('error', (error: Error) => {
			sendError(error);
		});

		if (options.safeMode) {
			if (options.verbose) {
				Logger.info('Backing up Database.');
			}
			//Dump the database in case safe mode is set
			const destination = options.destination || path.resolve(process.cwd());
			exec(
				`mongodump -u ${data.user} -p ${data.pass} --host ${data.host} --db ${data.db} --out "${destination}"`,
				(isError, stdout, stderr) => {
					if (isError) {
						const errorMessages = [
							"It seems that mongo's bin is not in your environment path. Go to https://github.com/ngudbhav/excel-to-mongodb to see the steps to rectify this issue.",
							'There seems to be an issue with your mongodb installation as we are unable to find mongodump file in environment path.'
						];
						if (process.platform === 'win32') {
							sendError(new Error(errorMessages[0]));
						} else {
							sendError(new Error(errorMessages[1]));
						}
					} else if (options.verbose) {
						Logger.info(stderr);
						Logger.info(stdout);
					}
				}
			);
		}

		connection.on('connected', async () => {
			Logger.info('Extracting rows from file.');
			await rowsFromFile(data.path, (error, rows) => {
				if (error) {
					sendError(error);
				}

				const schema: { [x: string]: string } = {};
				let sRow = 0;
				let eRow = 0;
				let sCol = 0;
				let eCol = 0;

				if (options.customStartEnd && !hasAllEndpoints) {
					const errorMessage =
						'Custom Start End requires all 4 points to be declared, i.e., Start Row, Start Column, End Row, End Column. It Seems one or more end points are not declared.';
					sendError(new Error(errorMessage));
				}

				if (
					options.customStartEnd &&
					options.startRow &&
					options.startCol &&
					options.endRow &&
					options.endCol
				) {
					sRow = options.startRow - 1;
					eRow = options.endRow;
					sCol = options.startCol - 1;
					eCol = options.endCol;
				}

				if (!options.customStartEnd) {
					eCol = rows[0].length;
					eRow = rows.length;
				}

				//Scan the second row to check for the datatypes.
				for (let i = sCol; i < eCol; i++) {
					rows[sRow][i] = rows[sRow][i].split(' ').join('_');

					//MS Excel date is object in javascript.
					if (typeof rows[sRow + 1][i] === 'object') {
						if (isDate(Number(rows[sRow + 1][i]))) {
							schema[rows[sRow][i]] = 'Date';
							for (let j = sRow + 1; j < eRow; j++) {
								rows[j][i] = formatDate(rows[j][i]);
							}
						} else {
							sendError(new Error('Datatype unrecognized'));
						}
					}
					//0 or 1 also corresponds to bool
					else if (typeof rows[sRow + 1][i] === 'boolean') {
						schema[rows[sRow][i]] = 'Boolean';
					} else {
						schema[rows[sRow][i]] = 'String';
					}
				}

				const colData = createInsertionObject(sRow, eRow, rows);
				Logger.info('Create and compile the model to enable mongoose API.');

				const model = createModel(connection, schema, data.collection);
				Logger.info('Send the data to database.');

				model.insertMany(colData, (error: Error | null, results: string[]) => {
					if (error) {
						sendError(error);
					} else {
						Logger.info(
							'Clear memory and delete the model to enable concurrent insertions.'
						);

						deleteModel(connection, model);
						closeConnection(data.endConnection, connection);
						resolve(results);
						return callback(null, results);
					}
				});
			});
		});
	});
};
