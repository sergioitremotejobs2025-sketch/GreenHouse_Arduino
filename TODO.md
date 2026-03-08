# 🎯 IoT Microservices: Strategic TODO & Execution Plan

Based on the [Technical Roadmap & Future Improvements (Chapter 16 & 17)](Documentation/Version_1/Book_Version_1.md), here is the structured list of tasks required to execute the next phases of the IoT project.

## 🟢 Phase 1: Strict Enforcement & Baseline Prep 
*Status: Completed*
- [x] **TDD Hard Block**: Enforce 100% branch and line coverage across all 10+ microservices as a prerequisite for CI/CD.
- [x] **Metric Unification**: Consolidate Prometheus exporters to reduce resource overhead.
- [x] **GKE Migration**: Transition from Minikube to GKE Autopilot, achieving cost reductions via resource right-sizing.

## 🟡 Phase 2: Closing the Unit Gaps & Observability 
*Status: In Progress*
- [ ] **mTLS Pilot**: Implement mutual TLS (mTLS) via a Service Mesh (like Istio/Linkerd) specifically for the `auth-ms` to `orchestrator-ms` path to harden identity services.
- [ ] **Advanced Observability**: Integrate Grafana Loki (Logs) and Prometheus (Metrics) into a unified, single-pane SRE dashboard.
- [ ] **CI/CD Maturity**: Automate performance regression tests to detect latency spikes before deployment to production.

## 🟠 Phase 3: Edge Intelligence & Fog Deployment 
*Timeline: Next 6 Months*
- [ ] **Wasm Ingestion Prototypes**: Develop and deploy the first WebAssembly "Data Pruners" (using Wasmtime/Wasmer) to select pilot physical greenhouse sites to reduce cloud ingress traffic.
- [ ] **Fog Node Integration**: Establish the first intermediate "Site Brains" to manage local database persistence (e.g., MongoDB Edge) and site-wide autonomous automation loops (survival logic).
- [ ] **Device Registry V2**: Upgrade `microcontrollers-ms` to handle physical device-to-gateway pairing and local discovery protocols.

## 🔴 Phase 4: Global Mesh & Infinite Scale 
*Timeline: Next Year*
- [ ] **Cross-Cluster Mesh**: Connect the EU and US Kubernetes clusters via **Cilium ClusterMesh**, enabling global service discovery, identity sharing, and active-active failover.
- [ ] **Serverless Offloading**: Migrate the heavy analytics functions in `stats-ms` to **Knative Serverless**, allowing the system to scale to zero during idle hours to save costs.
- [ ] **Sovereign Sharding**: Implement jurisdiction-aware database routing (MongoDB Zone Sharding) to ensure data residency compliance (GDPR, CCPA) in real-time.

---
*Generated based on the Book_Version_1.md Architectural Manifesto.*
