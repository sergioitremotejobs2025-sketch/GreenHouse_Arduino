# Day 2 Timeline: AI Service Bootstrapping (AI-Assisted)

This timeline estimates the effort required to complete the **Day 2: AI Service Bootstrapping** tasks using AI assistance. Total estimated duration: **~60 Minutes**.

---

## 🕒 Schedule Breakdown

### 00:00 - 00:10 | Environment Setup & Bootstrapping
*   **Action**: Initializing the testing infrastructure for `ai-ms`.
*   **AI Task**: 
    - Create `test/` folder and `pytest.ini`.
    - Update `requirements.txt` with `pytest`, `pytest-cov`, and `mongomock`.
    - Perform dependency installation and verify the test runner works.

### 00:10 - 00:30 | TDD for `DataProcessor`
*   **Action**: Implementing core unit tests for numerical data manipulation.
*   **AI Task**:
    - Write failing tests for `prepare_data` (edge cases: short lists, empty lists).
    - Write tests for `transform_input` and `inverse_transform`.
    - Iteratively refine the code to ensure 100% coverage for this module.

### 00:30 - 00:45 | TDD for `Trainer` (Mocking Phase)
*   **Action**: Testing the LSTM training lifecycle without real hardware/DB requirements.
*   **AI Task**:
    - Implement `mongomock` fixtures to simulate the IoT dataset.
    - Write tests for the training loop and model persistence (`joblib`).
    - Verify error handling when the database returns no data for a specific microcontroller.

### 00:45 - 01:00 | Flask API Coverage & Reporting
*   **Action**: End-to-end unit tests for the AI service endpoints.
*   **AI Task**:
    - Use `pytest` Flask client to test `/train` and `/predict` POST routes.
    - Ensure 85%+ coverage threshold is met for the entire `ai-ms`.
    - Update `CURRENT_COVERAGE.md` with new metrics.

---

## ⚡ Why Use AI for this?
1.  **Boilerplate Generation**: AI can instantly generate the Python test fixtures and mock setups needed for `mongomock`.
2.  **Dataset Synthesis**: AI can generate varied numerical datasets (sine waves, noisy data) to stress-test the LSTM preprocessing logic.
3.  **Cross-Language Consistency**: Ensuring the `ai-ms` (Python) testing patterns match the rigor of the Node.js microservices.

---

## 🚀 Status: Ready to Begin
Starting task: `Environment Setup` in `ai-ms`.
