const request = require('supertest');
const app = require('../app');

describe('app', () => {
    describe('/_health', () => {
        test('status: 200 responds with "OK"', () => {
            return request(app)
                .get('/_health')
                .expect(200)
                .then(({ body }) => {
                    expect(body.msg).toBe('OK');
                });
        });
    });
});
