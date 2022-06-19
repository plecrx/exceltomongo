import { Router } from 'express';
import { uploadFile } from 'utils/libs/fileFactory/uploadFile';

export const router = Router({
	strict: true
});

router.post('/upload', uploadFile.single('file'));
