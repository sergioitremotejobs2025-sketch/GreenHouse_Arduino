# Day 5 Plan: Production Hardening & Frontend Connectivity

This plan focuses on **Day 5** of the roadmap: finalizing the connection between the Frontend and the AI-driven backend, while hardening the microservices for production-like reliability.

---

## 📋 Task List

### 1. Frontend Integration & Connectivity
Ensure the Angular dashboard correctly interacts with the new AI endpoints via the Orchestrator.
- [ ] **Angular Service Validation**: Verify `AiService` (Angular) uses the correct `accessToken` and endpoints (`/ai/train`, `/ai/predict`).
- [ ] **Socket.IO Real-time Buffer**: Implement/Verify the in-memory buffer in the dashboard to store the last 20 points for instant "Predict" clicks.
- [ ] **Feedback UI**: Add loading states and success/error toasts for the Training process (which can take 5-10 seconds).

### 2. TDD: Production Hardening (Error States)
Apply TDD to make the services resilient to common failures.
- [ ] **Test Case (Red)**: Write tests in `orchestrator-ms` for service timeouts (e.g., what happens if AI-MS takes 30 seconds to train).
- [ ] **Implementation (Green)**: Implement `Axios` interceptors or explicit timeouts and 504 Gateway Timeout responses.
- [ ] **Resource Guarding**: Add checks to prevent AI training if the database is empty or has insufficient data (< 20 points).

### 3. Mocking & Database Isolation (Refactoring)
Refactor unit tests to remove dependency on live databases, as per original Roadmap.
- [ ] **DAO Mocking**: Replace `mongomock` (already used in AI-MS) and `sinon` with a standardized mocking layer in `measure-ms` and `microcontrollers-ms`.
- [ ] **Isolated Unit Tests**: Ensure `npm test` runs 100% without requiring Docker or any external database.

### 4. Infrastructure Polish
- [ ] **RabbitMQ Recovery**: Implement a basic retry logic in `stats-ms` and `publisher-ms` for when the broker is under heavy load.
- [ ] **Memory Management**: Add `PYTHONUNBUFFERED=1` and memory limits to the `ai-ms` Dockerfile.

---

## 🛠 Commands for Today

| Task | Command |
| :--- | :--- |
| **Run Unit Tests** | `npm test` (per service) |
| **Run Integration Tests** | `npm run test:e2e` |
| **Check Logs** | `docker-compose -f docker-compose.test.yml logs -f` |

---

## ✅ Deliverables
- [ ] Functional "Train" and "Predict" buttons in the Angular dashboard.
- [ ] 100% Isolated Unit Tests (No DB required).
- [ ] Graceful error handling for timeouts and empty datasets.
- [ ] Updated `CURRENT_COVERAGE.md`.
