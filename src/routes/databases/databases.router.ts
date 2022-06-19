import { Router } from 'express';
import { uploadFile } from 'utils/libs/fileFactory/uploadFile';
import { databasesController } from 'controllers/index';

export const router = Router({
	strict: true
});

router.post('/excelToMongoDB', uploadFile.single('file'), (req, res) => {
	databasesController.excelToMongoDB(req, res);
});
