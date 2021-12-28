import request from 'supertest';
import app from '../../app';

describe("GET /", () => {
  it("responds with Hello World!", (done) => {
    request(app).get("/").expect("Hello World!", done);
  })
});
