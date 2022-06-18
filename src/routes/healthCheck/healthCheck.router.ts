import { Router } from 'express';
import { healthCheckController } from 'controllers';

export const router = Router({
	strict: true
});

router.get('/status', healthCheckController.getHealth);
