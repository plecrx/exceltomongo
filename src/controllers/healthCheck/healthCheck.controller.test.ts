import supertest from 'supertest';

import app from 'app';

const request = supertest(app);

describe('Test HealthCheckRouter', () => {
	afterAll((done) => {
		done();
	});
	it('Request /health/status should return Hello!', async () => {
		const response = await request.get('/health/status').send();

		expect(response.statusCode).toBe(200);
		expect(response.body.data).toBe('OK');
	});
});
