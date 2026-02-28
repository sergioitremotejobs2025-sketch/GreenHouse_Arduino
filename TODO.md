# IoT Microservices — Future Tasks

This document outlines the next steps for maturing the IoT Microservices project. All tasks from the previous implementation phase have been successfully completed.

## 🚀 Phase 1: Real-time & Modern UI (Frontend)

- [ ] **Modern Aesthetics Refactor**: Implement a "Premium" look using glassmorphism, subtle gradients, and custom typography (Inter or Roboto).
- [ ] **Dark Mode Support**: Add a theme switcher to the dashboard with persistent storage of user preference.
- [ ] **Real-time Updates (WebSockets)**: Integrate `socket.io` to push sensor data from `measure-ms` (via Orchestrator) to the frontend without polling.
- [ ] **Interactive Data Exploration**: Enhance `PicturesHistoryComponent` and charts with advanced filtering, zooming, and "compare dates" functionality.
- [ ] **Alerting System**: Visual notifications/toasts when sensor values (Temperature/Humidity) reach critical thresholds.

## 🏗️ Phase 2: Observability & Reliability (DevOps)

- [ ] **Centralized Logging**: Configure a logging stack (e.g., Loki/Promtail or ELK) in the Kubernetes manifests to aggregate logs from all pods.
- [ ] **Metrics & Monitoring**: 
  - [ ] Add `/metrics` endpoints (Prometheus format) to all microservices.
  - [ ] Create a basic Grafana dashboard to track service health and sensor data frequency.
- [ ] **API Documentation (Swagger)**: Implement OpenAPI/Swagger for `orchestrator-ms`, `auth-ms` (Go), and `stats-ms` (Python).
- [ ] **Health-check Standardization**: Ensure `publisher-ms` and `stats-ms` have consistent `/health` endpoints and are monitored by K8s liveness/readiness probes.

## 🔐 Phase 3: Security & Performance

- [ ] **API Gateway Rate Limiting**: Implement rate limiting in `orchestrator-ms` using `express-rate-limit` or a Redis-based solution.
- [ ] **Network Isolation**: Add Kubernetes `NetworkPolicies` to ensure only the `orchestrator-ms` can communicate with internal services (`auth`, `measure`, etc.).
- [ ] **Advanced Auth**: 
  - [ ] Implement Refresh Token rotation for better security.
  - [ ] Add a "Change Password" feature in the Angular UI.
- [ ] **Dependency Audit**: Standardize Node.js versions across all microservices and resolve remaining `npm audit` high-risk vulnerabilities.

## 📊 Phase 4: Service Modernization

- [ ] **Stats-MS (Python)**:
  - [ ] Migrate `unittest` to `pytest` for better developer experience.
  - [ ] Add Pydantic for strict input/output data validation.
- [ ] **Publisher-MS (Node)**:
  - [ ] Implement unit tests for the publishing logic.
  - [ ] Add retry mechanisms for RabbitMQ connections.
- [ ] **Documentation Update**: Sync `ARCHITECTURE.md` with the current state, including the RabbitMQ flow and `stats-ms` integration.

---

## ✅ Completed Tasks (Reference)

*See [TODO27022026_1.md](file:///Users/sergioabad/Desktop/ProjectsToWorkOn/IoT/Arduino_Antiguo/Code/IoT_Microservices-master/TODO27022026_1.md) for the full list of recently finished items.*

- [x] Angular v15 Upgrade
- [x] MongoDB Indexing & Persistence
- [x] Auth-ms Refactor & Testing (Go)
- [x] Picture Snapshot History in Frontend
- [x] Internal API Security (Shared Keys)
- [x] CI/CD Workflow setup for GitHub Actions
- [x] Kubernetes HPA & Resource Limits
