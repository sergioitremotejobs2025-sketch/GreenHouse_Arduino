# Day 1 Plan: Foundation & Audit

This plan outlines the specific tasks to complete **Day 1** of the TDD Mastery roadmap. The goal is to establish a verified baseline of test coverage and standardize the testing environment.

---

## 📋 Task List

### 1. Execute & Document Existing Test Suites
Perform a full audit of the current state of tests for Node.js and Python microservices.
- [ ] **Run `microcontrollers-ms` tests**: `cd microcontrollers-ms && npm test`
- [ ] **Run `orchestrator-ms` tests**: `cd orchestrator-ms && npm test`
- [ ] **Run `measure-ms` tests**: `cd measure-ms && npm test`
- [ ] **Run `publisher-ms` tests**: `cd publisher-ms && npm test`
- [ ] **Run `stats-ms` tests**: `cd stats-ms && pytest` (Verify environment)
- [ ] **Run `integration-tests`**: `cd integration-tests && npm test`

### 2. Identify "Test-Free" Zones
Confirm areas where TDD needs to be introduced from scratch or where coverage is significantly low.
- [ ] **Inspect `ai-ms`**: Confirm no test directory or `pytest` configuration exists.
- [ ] **Inspect `auth-ms`**: Check for Go `*_test.go` files (Expected: None or very few).
- [ ] **Internal logic review**: Identify critical business logic in `measure-ms` (e.g., data validation) that lacks unit tests.

### 3. Standardize Testing Infrastructure
Align the testing experience across all microservices to ensure consistency for developers and CI/CD.
- [ ] **Unified `npm test` script**: Ensure every Node.js microservice uses `jest --coverage` (already present in most, verify consistency).
- [ ] **Coverage Threshold Enforcement**: Verify if `jest` configuration in `package.json` correctly fails if coverage drops below 85% (as defined in current manifests).
- [ ] **Environment Consistency**: 
  - Ensure `orchestrator-ms` has `INTERNAL_API_KEY` set for tests.
  - Ensure `measure-ms` has `NODE_ENV=test` set for tests.

---

## 🛠 Commands for Today

| Service | Command | Status |
| :--- | :--- | :--- |
| **microcontrollers-ms** | `npm run test` | [ ] |
| **orchestrator-ms** | `npm run test` | [ ] |
| **measure-ms** | `npm run test` | [ ] |
| **publisher-ms** | `npm run test` | [ ] |
| **integration-test** | `npm run test` | [ ] |
| **stats-ms** | `pytest` | [ ] |

---

## ✅ Deliverables
- [ ] A summary of "Current Coverage" percentages for each core service.
- [ ] A list of failing tests that need immediate attention (fixing existing bugs via TDD).
- [ ] Verified standardized `package.json` scripts across the project.
