# 🎯 IoT Microservices: Strategic TODO & Execution Plan

Based on the [Technical Roadmap & Future Improvements (Chapter 16 & 17)](Documentation/Version_1/Book_Version_1.md), here is the structured list of tasks required to execute the next phases of the IoT project.

## ⚪ Phase 0: Release & Artifact Publishing 
*Status: Completed*
- [x] **GitHub Container Registry (GHCR)**: Configure CI pipelines to automatically build and publish all microservice Docker images to GitHub Packages (ghcr.io).
- [x] **Official Open-Source Release**: Draft and publish the official `v1.0.0` GitHub Release, attaching the architectural manifesto (`Book_Version_1.pdf` or `.md`) and automation scripts.

## 🟢 Phase 1: Strict Enforcement & Baseline Prep 
*Status: Completed*
- [x] **TDD Hard Block**: Enforce 100% branch and line coverage across all 10+ microservices as a prerequisite for CI/CD.
- [x] **Metric Unification**: Consolidate Prometheus exporters to reduce resource overhead.
- [x] **GKE Migration**: Transition from Minikube to GKE Autopilot, achieving cost reductions via resource right-sizing.
## 🔵 Phase 1.5: GitHub Actions Pipeline Health
*Status: Completed*
- [x] **Workflow Stabilization**: Comprehensive repair of the CI/CD pipeline in PR #1.
    - [x] **measure-ms**: Added edge-case tests to `final_booster.spec.js` to reach true 100% statement/branch coverage.
    - [x] **angular-ms**: Added `ThemeService` spec to cover localStorage initialization, achieving 100% frontend coverage.
    - [x] **auth-ms**: Flattened service structure (moving files out of `src/`) to fix Go dependency resolution in GitHub runners.
    - [x] **Pact Verification**: Updated `pact_test.go` paths to maintain contract testing connectivity after directory flattening.
    - [x] **CI Consolidation**: Merged fragmented workflows into a unified `ci.yml` using a high-performance Job Matrix.
    - [x] **Dependency Caching**: Implemented advanced caching for `npm` and `go` to reduce build times by ~40%.
    - [x] **Git Tracking**: Fixed `.gitignore` rules that were preventing CI scripts from being committed.
- [x] **Badge Monitoring**: Dynamic README badge successfully tracks CI status. Verified 100% pass rate on `fix/pipeline-health` branch.


## 🟡 Phase 2: Closing the Unit Gaps & Observability 
*Status: In Progress*
- [/] **mTLS Pilot**: Implement mutual TLS (mTLS) via a Service Mesh (like Istio/Linkerd) specifically for the `auth-ms` to `orchestrator-ms` path to harden identity services.
    - [x] Create Istio PeerAuthentication and DestinationRule manifests (`security/istio-mtls.yaml`)
    - [ ] Apply Istio manifests to the cluster and verify sidecar injection.
- [x] **Advanced Observability**: Integrate Grafana Loki (Logs) and Prometheus (Metrics) into a unified, single-pane SRE dashboard.
    - [x] Configure Grafana dashboard provisioning (`monitoring/grafana.yaml`)
    - [x] Create initial SRE Unified Dashboard JSON.
    - [x] Deploy Loki, Promtail, Prometheus, and Grafana to GKE.
    - [x] Verified Autopilot-compatible Promtail configuration.
- [x] **CI/CD Maturity**: Automate performance regression tests to detect latency spikes before deployment to production.
    - [x] Create K6 load testing script (`load-test.js`)
    - [x] Create GitHub Actions workflow (`performance-tests.yml`)
    - [x] **Exposed Orchestrator-MS (LoadBalancer)**: Live at `34.79.19.242` for real-target performance testing.
    - [x] Updated K6 script with JSON validation and Metrics integration.
    - [x] Integrated `PERF_TEST_API_URL` secret support in CI/CD pipeline.

## ✅ Phase 3: Edge Intelligence & Fog Deployment 
*Status: Completed*
- [x] **Wasm Ingestion Prototypes**: Develop and deploy the first WebAssembly "Data Pruners" (using Wasmtime/Wasmer) to select pilot physical greenhouse sites to reduce cloud ingress traffic.
    - [x] Create Go-based Wasm prototype (`edge-wasm/pruner.go`).
    - [x] Compile successfully to `pruner.wasm`.
    - [x] Implement Delta-Threshold pruning algorithm for efficient edge processing.
- [x] **Fog Node Integration**: Establish the first intermediate "Site Brains" to manage local database persistence (e.g., MongoDB Edge) and site-wide autonomous automation loops (survival logic).
    - [x] Implemented `fog-brain-ms` with SQLite persistence and local reflex engine.
- [x] **Device Registry V2**: Upgrade `microcontrollers-ms` to handle physical device-to-gateway pairing and local discovery protocols.
    - [x] Implemented `POST /pair` protocol and gateway-aware discovery with 100% test coverage.

## 🔴 Phase 4: Global Mesh & Infinite Scale 
*Status: In Progress*
- [/] **Cross-Cluster Mesh**: Connect the EU and US Kubernetes clusters via **Cilium ClusterMesh**, enabling global service discovery, identity sharing, and active-active failover.
    - [x] Phase 4: Global Mesh & Infinite Scale (Active-Active Architecture)
    - [x] Provision secondary US cluster with safe CIDR ranges
    - [x] Register clusters to GKE Fleet (Hub)
    - [x] Enable GKE Multi-cluster Services (MCS)
    - [x] Export core services for global discovery
    - [x] Deploy Knative for serverless analytical bursting
- [x] **Serverless Offloading**: Migrate the heavy analytics functions in `stats-ms` to **Knative Serverless**, allowing the system to scale to zero during idle hours to save costs.
- [/] **Sovereign Sharding**: Implement jurisdiction-aware database routing (MongoDB Zone Sharding) to ensure data residency compliance (GDPR, CCPA) in real-time.
    - [x] Update MySQL schema with `jurisdiction` field.
    - [x] Update `microcontrollers-ms` and `measure-ms` to handle jurisdiction metadata.
    - [x] Create MongoDB Sharded Cluster manifests (`manifests-k8s/db/sharding/`).
    - [ ] Deploy sharded cluster and execute `setup-zones.sh` on live environment.

---
*Generated based on the Book_Version_1.md Architectural Manifesto.*
*Last technical audit: March 27, 2026*
