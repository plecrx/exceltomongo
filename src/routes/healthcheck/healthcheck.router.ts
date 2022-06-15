import { Router } from 'express';
import { healthcheckController } from 'controllers';

export const router = Router({
	strict: true
});

router.get('/status', healthcheckController.getHealth);
