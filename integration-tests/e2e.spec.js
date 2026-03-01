const request = require('supertest');
const axios = require('axios');

const ORCHESTRATOR_URL = process.env.ORCHESTRATOR_URL || 'http://localhost:3000';

describe('End-to-End API Integration Tests', () => {
    let authToken = '';
    const testUser = {
        username: 'e2e_user',
        password: 'e2e_password'
    };

    beforeAll(async () => {
        // Optional setup before E2E start: Wait for Orchestrator to become healthy
        // since in Docker compose it might take a few seconds
        // You can skip this if your test orchestrator handles waits.
    });

    it('should register a new user successfully', async () => {
        const res = await request(ORCHESTRATOR_URL)
            .post('/register')
            .send(testUser);

        // It might be 201 Created or 200 OK depending on implementation
        expect([200, 201]).toContain(res.status);
    });

    it('should login and return a valid JWT token', async () => {
        const res = await request(ORCHESTRATOR_URL)
            .post('/login')
            .send(testUser);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('refreshToken');

        authToken = res.body.token; // Save for subsequent requests
    });

    it('should be able to interact with Microcontrollers MS (CREATE)', async () => {
        const mcuData = {
            ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
            measure: 'temperature',
            sensor: 'DHT11'
        };

        const res = await request(ORCHESTRATOR_URL)
            .post('/microcontrollers')
            .set('Authorization', `Bearer ${authToken}`)
            .send(mcuData);

        expect(res.status).toBe(201);
    });

    it('should be able to interact with Microcontrollers MS (GET)', async () => {
        const res = await request(ORCHESTRATOR_URL)
            .get('/microcontrollers')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should block unauthenticated access to protected routes', async () => {
        const res = await request(ORCHESTRATOR_URL)
            .get('/microcontrollers');

        expect(res.status).toBe(401);
    });
});
