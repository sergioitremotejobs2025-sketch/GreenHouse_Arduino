# 🎯 Roadmap to 100% TDD Coverage

This document outlines the specific tasks and architectural changes required to achieve and maintain **100% Test-Driven Development (TDD) coverage** across the entire IoT Microservices platform.

## 🔴 Phase 1: Strict Enforcement (Immediate)
- [x] **Global Threshold Calibration**: 
    - [x] Update `package.json` in all Node.js services to set `coverageThreshold` to 100% for lines, branches, functions, and statements.
    - [x] Review and ensure the `coverageThreshold` settings are properly implemented in all Node.js services.
    - [x] Add `pytest --cov-fail-under=100` to Python services (`ai-ms`, `stats-ms`).
    - [x] Integrate `go test -cover -failfast` with a script to check for 100% output in `auth-ms`.
- [x] **CI/CD Hard Block**: 
    - [x] Configure GitHub Actions to reject any code push that results in coverage < 100%.

## 🟠 Phase 2: Closing the Unit Gaps (Per Service)

### 🟢 Node.js Services (`measure-ms`, `orchestrator-ms`, etc.)
- [ ] **Error Path Exhaustion**: Write tests for all `catch` blocks and rare error scenarios (e.g., specific HTTP 5xx codes from upstream).
- [ ] **Startup & Shutdown**: Mock `process.on('SIGTERM')` and `process.on('SIGINT')` to test graceful shutdown logic.
- [ ] **Middlewares**: Ensure all custom Express error handlers and logging middlewares are hit by 100% of test cases.
- [ ] **Edge Case Refactoring**: Any "untestable" lines should be refactored into pure functions or isolated modules for testing.

### 🐍 Python Services (`ai-ms`, `stats-ms`)
- [x] **Model Exception Mocking**: Add tests for Keras/TensorFlow model loading failures and training interruptions.
- [x] **Pika/RabbitMQ Resilience**: Mock heartbeat losses and reconnection logic in the consumer scripts.
- [ ] **Data Validation**: 100% coverage on input schema validation (Pydantic/Cerberus).

### 🐹 Go Service (`auth-ms`)
- [x] **SQL Error Injection**: Use `sqlmock` to simulate transient database connection failures and query syntax errors.
- [x] **Token Expiry Edge Cases**: Test exactly-at-expiry and exactly-after-expiry behaviors for JWTs.

### 🅰️ Frontend (`angular-ms`)
- [ ] **Component Lifecycle**: Test every lifecycle hook (`ngOnInit`, `ngOnDestroy`) for all components.
- [ ] **Service Error Interceptors**: Test how the UI reacts to every possible status code (401, 403, 404, 500, 503).
- [ ] **Async Piping**: Ensure 100% coverage on Observable streams and subscription management.

## 🟡 Phase 3: Advanced Verification (Quality over Quantity)
- [ ] **Mutation Testing**:
    - [ ] Run **StrykerJS** on all Node/Angular services to ensure tests fail when logic is mutated.
    - [ ] Run **Mutmut** on Python services.
- [ ] **Contract Testing (Pact)**:
    - [ ] Implement Consumer-Driven Contract (CDC) tests to ensure microservices stay in sync across updates.
- [ ] **Fuzz Testing**:
    - [ ] Introduce fuzzing for the API gateway to test input resilience against malformed payloads.

## 🔵 Phase 4: Observability & Documentation
- [ ] **Live Coverage Badges**: Add dynamic GitHub badges to `README.md` reflecting 100% status.
- [ ] **Documentation Sync**: Ensure all tested endpoints are documented in the internal OpenAPI (Swagger) spec and vice-versa.

---
*Target Completion Date: [Set Date Here]*
*Status: In Progress*
