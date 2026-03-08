import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 }, // Ramp up to 50 simulated users
    { duration: '1m', target: 50 },  // Maintain for 1 minute
    { duration: '30s', target: 0 },  // Ramp down
  ],
  thresholds: {
    // 95% of requests must complete within 200ms
    http_req_duration: ['p(95)<200'],
    // Less than 1% of requests can fail
    http_req_failed: ['rate<0.01'], 
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost';

// Note: For full realism in CI, we'll need either a mocked endpoint 
// or an initialization phase where we grab an Auth token.
export default function () {
  // Simulating the Gateway's /health endpoint initially
  const res = http.get(`${BASE_URL}/health`);
  check(res, {
    'is status 200': (r) => r.status === 200,
  });

  // Adding simulated think-time
  sleep(1);
}
