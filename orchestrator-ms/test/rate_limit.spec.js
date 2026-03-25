const request = require('supertest');
const express = require('express');
const rateLimit = require('express-rate-limit');

describe('Rate Limiter basic behavioral test', () => {
    it('should return 429 after 2 requests', async () => {
        const app = express();
        const limiter = rateLimit({
            windowMs: 1000,
            max: 2,
            message: 'Too many requests'
        });
        app.use(limiter);
        app.get('/', (req, res) => res.status(200).send('OK'));

        const res1 = await request(app).get('/');
        expect(res1.statusCode).toBe(200);
        const res2 = await request(app).get('/');
        expect(res2.statusCode).toBe(200);
        const res3 = await request(app).get('/');
        expect(res3.statusCode).toBe(429);
    });
});
