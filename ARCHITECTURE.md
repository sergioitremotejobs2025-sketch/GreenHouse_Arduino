# IoT Microservices — Architecture

## Overview

```
Browser
  │
  ▼
┌─────────────────────────────────────┐
│          angular-ms (Nginx)          │  port 80 (in-cluster)
│  Angular SPA + reverse proxy         │  exposes via minikube NodePort
├─────────────────────────────────────┤
│  /            → serve static files   │
│  /login       → orchestrator-ms     │
│  /register    → orchestrator-ms     │
│  /refresh     → orchestrator-ms     │
│  /temperature → orchestrator-ms     │
│  /humidity    → orchestrator-ms     │
│  /pictures    → orchestrator-ms     │
│  /light       → orchestrator-ms     │
│  /microcontr… → orchestrator-ms     │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│       orchestrator-ms        │  port 3000
│  Express + JWT middleware    │
│  Routes requests to back-end │
│  services after auth check   │
└──────┬───────────────────────┘
       │            │              │
       ▼            ▼              ▼
┌──────────┐  ┌───────────┐  ┌─────────────────┐
│ auth-ms  │  │ measure-ms│  │microcontrollers-│
│  (Go)    │  │ (Node.js) │  │     ms (Node.js)│
│ port 5000│  │ port 4000 │  │   port 6000     │
│          │  │           │  │                 │
│  login   │  │ /humidity │  │ /humidity       │
│  register│  │ /temp     │  │ /light          │
│  refresh │  │ /pictures │  │ /temperature    │
│          │  │ /light    │  │ /pictures       │
│ MongoDB  │  │ MongoDB   │  │ MongoDB         │
└──────────┘  └─────┬─────┘  └─────────────────┘
                    │ PictureScheduler
                    │ (every 10h)
                    ▼
         ┌──────────────────────────┐
         │ fake-arduino-iot-pictures │
         │  (Node.js) port 3005      │
         │                          │
         │  GET /pictures  →  JSON  │
         │  GET /camera/latest      │
         │  GET /camera/image       │
         │  Cycles through 5 plant  │
         │  growth stages over time │
         └──────────────────────────┘
```

## Services

| Service | Language | Port | Description |
|---|---|---|---|
| `angular-ms` | Angular + Nginx | 80 | SPA frontend + API reverse proxy |
| `orchestrator-ms` | Node.js / Express | 3000 | API gateway with JWT auth |
| `auth-ms` | Go | 5000 | Login, register, token refresh |
| `measure-ms` | Node.js / Express | 4000 | Sensor data CRUD + picture scheduler |
| `microcontrollers-ms` | Node.js / Express | 6000 | Microcontroller registry |
| `fake-arduino-iot-pictures` | Node.js / Express | 3005 | Camera simulator (plant growth stages) |

## Data Flow — Dashboard Load

1. Browser loads Angular app from Nginx
2. Angular calls `GET /microcontrollers` → orchestrator validates JWT → returns registered devices
3. For each device Angular calls `GET /<measure>` → orchestrator → measure-ms → physical/fake Arduino
4. measure-ms caches current readings; PictureScheduler persists camera snapshots to MongoDB every 10h

## Kubernetes Deployment

All services run in **Minikube** (local) or a cloud k8s cluster. Key resources:

- `Deployment` + `Service` for each microservice
- `ConfigMap` for Nginx configuration (`angular-ms`)
- `PersistentVolumeClaim` for MongoDB data
- `Secret` for MongoDB credentials and JWT secret

Run locally:
```bash
bash run_k8s_local.sh   # start minikube + apply all manifests
minikube service angular-ms --url   # get the frontend URL
```

Rebuild Angular after source changes:
```bash
bash rebuild_angular.sh   # clean docker build + minikube load + rollout
```
