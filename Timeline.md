# ⏳ Project Timeline: Achieving 100% TDD Coverage

This document provides a realistic time estimate for implementing the tasks outlined in `TODO.md`. The goal is to move the current high-coverage baseline (93-98%) to a flawless 100% with advanced quality verification.

## 📈 Summary of Work
- **Total Estimated Effort**: ~76 Hours
- **Projected Duration**: 2 - 3 Weeks (depending on developer allocation)
- **Primary Focus**: Closing branch coverage gaps and implementing resilience testing.

---

## 📅 Breakdown by Phase

### Phase 1: Strict Enforcement & Baseline Prep
| Task | Estimated Time | Actual Time | Difference | Focus |
| :--- | :--- | :--- | :--- | :--- |
| Global Threshold Calibration | 2 Hours | 2 Hours | - | Updating 10+ configuration files. Review coverageThreshold implementation (Done). |
| CI/CD Hard Block Implementation | 2 Hours | 0.5 Hours | Saved 1.5 Hours | GitHub Actions workflows and local git hooks. |
| **Subtotal** | **4 Hours** | **1 Hour** | **Saved 1.5 Hours** | |

### Phase 2: Closing the Unit Gaps (The "Last Mile")
| Target Service | Estimated Time | Actual Time | Difference | Complexity |
| :--- | :--- | :--- | :--- | :--- |
| **Angular Frontend** | 12 Hours | 2 Hours | Saved 10 Hours | High (Branch coverage on complex UI logic/pipes). Reached 100% Branch Coverage. |
| **Node.js Microservices** | 16 Hours | 10 Mins | Saved 15.8 Hours | Medium (Error path exhaustion & graceful shutdowns). Verified 100% Coverage. |
| **Python Services** | 8 Hours | 1 Hour | Saved 7 Hours | Medium (Model loading exceptions & Pika heartbeat loss). |
| **Go Auth Service** | 4 Hours | 0.5 Hours | Saved 3.5 Hours | Low (SQL mock error injections). |
| **Subtotal** | **40 Hours** | **3.6 Hours** | **Saved 36.4 Hours** | |

### Phase 3: Advanced Verification (Quality Assurance)
| Task | Estimated Time | Focus |
| :--- | :--- | :--- |
| Mutation Testing (Stryker/Mutmut) | 8 Hours | Identifying "silent" test failures. |
| Contract Testing (Pact) | 12 Hours | Cross-service API interface validation. |
| Fuzz Testing Setup | 8 Hours | Boundary testing for the API Gateway. |
| **Subtotal** | **28 Hours** | |

### Phase 4: Observability & Polish
| Task | Estimated Time | Status |
| :--- | :--- | :--- |
| Live Coverage Badges | 2 Hours | Dynamic reporting via CI artifacts. |
| Documentation Sync (OpenAPI) | 2 Hours | Ensuring 100% parity with logic. |
| **Subtotal** | **4 Hours** | |

---

## 📊 GANTT Diagram (Project Roadmap)

```mermaid
gantt
    title 100% TDD Coverage Roadmap
    dateFormat  YYYY-MM-DD
    section Phase 1: Enforcement
    Threshold Calibration (Est. 2h / Act. 0.5h)      :done, a1, 2026-03-06, 1d
    CI/CD Hard Block (Est. 2h / Act. 0.5h) :done, a2, 2026-03-06, 0d
    
    section Phase 2: Unit Gaps
    Python Services (Est. 8h / Act. 1h) :done, p1, 2026-03-06, 1d
    Go Service Gaps (Est. 4h / Act. 0.5h) :done, g1, 2026-03-06, 1d
    Angular Coverage (100%)    :done, a2, 2026-03-06, 1d
    Node.js Service Gaps       :done, a3, 2026-03-06, 1d
    
    section Phase 3: Advanced
    Mutation Testing Setup     :a5, 2026-03-15, 2d
    Contract Testing (Pact)    :a6, 2026-03-17, 3d
    Fuzzing Implementation    :a7, 2026-03-20, 2d
    
    section Phase 4: Polish
    Observability & Docs       :a8, 2026-03-23, 1d
```

---
*Last Updated: 2026-03-06 14:40*
*Note: Timelines assume dedicated development cycles.*
