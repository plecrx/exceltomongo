import { Router } from 'express';
import { excelToMongoController } from 'controllers';

export const router = Router({
	strict: true
});

router.get('/convert', excelToMongoController.convert);
