# TDD Foundation: Baseline Coverage Report (Day 1)

This document summarizes the current state of test coverage across the IoT Microservices project as of Day 1.

## 📊 Coverage Summary

| Microservice | Language | Test Runner | Status | Coverage (Lines) | Key Issues |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **microcontrollers-ms** | Node.js | Jest | ✅ PASS | 98.13% | Fixed `dao.connect.spec.js` mock. |
| **orchestrator-ms** | Node.js | Jest | ✅ PASS | 96.55% | Fixed `axios` mock logic and auto-mocking. |
| **measure-ms** | Node.js | Jest | ✅ PASS | 91.84% | No issues. |
| **publisher-ms** | Node.js | Jest | ✅ PASS | 98.08% | Fixed missing `close()` in `app.branch.spec.js` mock. |
| **stats-ms** | Python | Pytest | ✅ PASS | 98.44% | No issues. |
| **ai-ms** | Python | Pytest | ✅ PASS | 96.00% | Established TDD with `pytest` and `mongomock`. (Logic: 100%) |
| **auth-ms** | Go | N/A | ❌ NONE | 0% | No tests implemented yet. |
| **integration-tests** | Node.js | Jest | ❌ FAIL | N/A | `AggregateError` - likely requires services to be running. |

---

## 🔍 Critical Gaps (Test-Free Zones)

### [ai-ms] (Python)
- **Status**: Completely untested.
- **Priority**: High (Day 2 focus).
- **Target Logic**: `data_processor.py`, `trainer.py`, and API endpoints in `main.py`.

### [auth-ms] (Go)
- **Status**: Completely untested.
- **Priority**: Medium (Day 3 focus).
- **Target Logic**: JWT generation, Argon2 hashing, and unmarshaling logic.

---

## 🛠 Next Steps (Foundation Fixes)
1. **[ORCHESTRATOR-MS]**: Resolve the 401 failures by fixing the `axios` mock or environment setup.
2. **[PUBLISHER-MS]**: Fix the `TypeError: queue.close` in tests (likely a mock/refactor issue).
3. **[MICROCONTROLLERS-MS]**: Fix the failing timer-based DAO connection test.
4. **[STANDARDIZATION]**: Update root `package.json` to run all tests via one command.
