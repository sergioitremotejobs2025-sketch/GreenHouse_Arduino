const request = require('supertest');
const app = require('../src/app/app');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { TOKEN_SECRET } = require('../src/config/jwt.config');

describe('Orchestrator Load & Rate Limit Testing', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should handle up to 100 simultaneous requests and then rate limit the 101st', async () => {
        const mockResponse = {
            data: { prediction: 25.5 },
            status: 200
        };

        jest.spyOn(axios, 'post').mockResolvedValue(mockResponse);
        const token = jwt.sign({ username: 'Load_Tester' }, TOKEN_SECRET);

        const totalRequests = 101;
        const requests = Array.from({ length: totalRequests }, (_, i) => {
            return request(app)
                .post('/ai/predict')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    ip: `192.168.1.${i}`,
                    measure: 'temperature',
                    recent_values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                });
        });

        const start = Date.now();
        const responses = await Promise.all(requests);
        const end = Date.now();

        console.log(`Finished ${totalRequests} requests in ${end - start}ms`);

        const successCount = responses.filter(r => r.statusCode === 200).length;
        const rateLimitedCount = responses.filter(r => r.statusCode === 429).length;

        console.log(`Success: ${successCount}, Rate Limited: ${rateLimitedCount}`);

        expect(successCount).toBe(100);
        expect(rateLimitedCount).toBe(1);

        // Assertions for successful responses
        responses.filter(r => r.statusCode === 200).forEach(res => {
            expect(res.body.prediction).toBe(25.5);
        });

        // Assertion for rate limited response
        const limitedRes = responses.find(r => r.statusCode === 429);
        expect(limitedRes.text).toContain('Too many requests');

    }, 30000);
});
