import { NextFunction, Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { Logger } from 'utils/libs/logger/logger';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

const fileStorage = multer.diskStorage({
	destination: (
		req: Request,
		file: Express.Multer.File,
		callback: DestinationCallback
	) => {
		callback(null, 'src/utils/data');
	},
	filename: (
		req: Request,
		file: Express.Multer.File,
		callback: FileNameCallback
	) => {
		callback(null, file.originalname);
	}
});

const fileFilter = (
	request: Request,
	file: Express.Multer.File,
	callback: FileFilterCallback
): void => {
	if (
		file.mimetype === 'text/csv' ||
		file.mimetype === 'application/vnd.ms-excel' ||
		file.mimetype ===
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
	) {
		callback(null, true);
	} else {
		callback(null, false);
	}
};

export const uploadFile = multer({
	storage: fileStorage,
	fileFilter: fileFilter
});
