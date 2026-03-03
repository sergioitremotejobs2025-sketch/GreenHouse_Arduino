# Day 2 Plan: The "Red" Phase - AI Service Bootstrapping

This plan outlines the specific tasks to complete **Day 2** of the TDD Mastery roadmap. The goal is to introduce the first unit tests to the `ai-ms` Python service using a TDD approach.

---

## 📋 Task List

### 1. Environment Setup (Bootstrapping Pytest)
Prepare the `ai-ms` microservice for automated testing.
- [ ] **Create `test/` directory**: `mkdir -p ai-ms/test`
- [ ] **Create `pytest.ini`**: Add standard configuration to `ai-ms/pytest.ini`.
- [ ] **Update `requirements.txt`**: Add `pytest`, `pytest-cov`, and `mongomock` for database isolation.
- [ ] **Install test dependencies**: `cd ai-ms && pip install -r requirements.txt`

### 2. TDD for `DataProcessor` (Unit Testing)
Implement tests for the core data manipulation logic in `data_processor.py`.
- [ ] **Test Case 1: Minimum Data (Red)**: Write a test ensuring `prepare_data` returns `None` if input data is shorter or equal to `look_back`.
- [ ] **Test Case 2: Data Scaling (Red)**: Write a test verifying `prepare_data` correctly scales values between 0 and 1.
- [ ] **Test Case 3: Shape Verification (Red)**: Write a test ensuring the output `X` has the shape `(N, look_back)`.
- [ ] **Implementation (Green)**: Run the tests and ensure they pass with existing or minimal fixes.

### 3. TDD for `Trainer` (Mocking & Integration)
Implement tests for the LSTM model training process in `trainer.py`.
- [ ] **Mock MongoDB**: Use `mongomock` to simulate data retrieval for training.
- [ ] **Test Case 4: Training flow (Red)**: Write a test verifying `train_model` handles empty data gracefully.
- [ ] **Test Case 5: Model Persistence (Red)**: Write a test ensuring the trained model is saved correctly using `joblib`.

### 4. API Endpoint Testing (Flask)
Test the web interface of the AI service.
- [ ] **Test Case 6: `/predict` endpoint (Red)**: Write a failing test for invalid input data (e.g., non-numerical lists).
- [ ] **Test Case 7: `/train` route (Red)**: Ensure the training process can be triggered via API.

---

## 🛠 Commands for Today

| Task | Command |
| :--- | :--- |
| **Install** | `cd ai-ms && pip install pytest pytest-cov mongomock` |
| **Run Tests** | `cd ai-ms && pytest --cov=src` |
| **Check Results**| `cat ai-ms/test_output.txt` |

---

## ✅ Deliverables
- [ ] Initial `pytest` infrastructure in `ai-ms`.
- [ ] At least 10 unit tests for `data_processor.py` and `trainer.py`.
- [ ] Updated `CURRENT_COVERAGE.md` showing >50% coverage for `ai-ms`.
