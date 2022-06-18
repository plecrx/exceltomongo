import { NextFunction, Request, Response } from 'express';

export class HealthCheckController {
	getHealth = (req: Request, res: Response, next: NextFunction) => {
		try {
			res.status(200).send({ data: 'OK' });
		} catch (e) {
			next(e);
		}
	};
}
