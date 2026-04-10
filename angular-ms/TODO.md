# 📝 TODO: Angular-MS UI & Feature Enhancements

> [!IMPORTANT]
> **TDD FIRST MANDATE**: All development MUST follow the strict **Red-Green-Refactor** cycle. No code is to be committed without a prior failing test and its subsequent passing state.

---

## 💎 UI/UX & Aesthetics (Premium Feel)
*Goal: Transform the dashboard into a state-of-the-art, high-end monitoring interface.*

- [x] **Advanced Glassmorphism**: Refine the `.glass` class (Integrated in new components).
- [x] **Lottie Animations**: Replace static icons with subtle Lottie animations for "Connecting", "Syncing", and "Alert" states.
- [x] **Skeleton Loaders**: Implement elegant pulse skeleton loaders for charts and stats cards during initial data fetch.
- [x] **Micro-Interactions**: Add a 3D hover effect (parallax) to device cards in the dashboard.
- [x] **Global Search (Command Palette)**: Implement a `Ctrl+K` command palette for quick navigation and device search.

## 🚀 New Features
*Goal: Expand functionality to provide better intelligence and control.*

- [x] **Real-time Alert Notifications**:
    - [x] Integrate a Toast system (e.g., `ngx-toastr` or custom Material Snackbar) for critical IoT alerts.
    - [x] Add a notification "Inbox" in the navbar to track past alerts.
- [x] **Advanced Analytics Tab**:
    - [x] Create a dedicated "Trends" view using larger, multi-line charts.
    - [x] Comparison mode: Overlap charts from two different microcontrollers to compare environments.
- [x] **AI Integration Polish**:
    - [x] Enhance `app-ai-predictor` with confidence score visualizations.
    - [x] Add a "Fix Suggestion" based on AI predictions (e.g., "AI suggests turning on irrigation soon").
- [ ] **Picture Gallery Enhancements**:
    - [x] Implement a full-screen Lightbox for IoT surveillance pictures.
    - [x] Add Timeline scrubbing for photo history.
- [x] **Device Health Dashboard**: A specialized view showing battery levels (if applicable), latency, and uptime for all nodes.
- [x] **Custom Scrollbars**: Design sleek, thin, themed scrollbars for history lists and sidenavs.
- [x] **Typography Audit**: Transition to a more premium variable font (e.g., *Outfit* or *Inter*) and optimize hierarchy.

## 🔴🟢🔵 TDD Red-Green-Refactor Enforcement
*Goal: Institutionalize technical discipline across all architectural layers.*

- [x] **Component Modernization (TDD Verified)**:
    - [x] `DashboardComponent`: Signal migration verified with RED state confirmation.
    - [x] `DeviceHealthComponent`: Signal migration verified with RED state confirmation.
    - [x] `MeasureHistoryComponent`: Signal migration verified with RED state confirmation.
    - [x] `AnalyticsComponent`: Chart.js migration verified with RED state confirmation.
- [ ] **Pending Modernization (TDD Mandate)**:
    - [ ] `SwitchComponent`: Transition to Signals (Red-Green-Refactor required).
    - [ ] `SliderComponent`: Transition to Signals (Red-Green-Refactor required).
    - [ ] `TimelineScrubber`: Performance optimization (Red-Green-Refactor required).
- [ ] **Infrastructure TDD**:
    - [ ] `Vitest Migration`: Automated conversion of Karma tests with failure validation first.
    - [ ] `SocketService`: Dynamic event handling (Red-Green-Refactor required).

## 🛠️ Technical Debt & Performance
*Goal: Modernize the tech stack and improve codebase maintainability.*

- [ ] **Angular v18 Upgrade Roadmap**:
    - [x] Phase 1: Dependency stabilization and Node.js v20+ migration (Complete).
    - [x] Phase 2: Core Angular update (v15 -> v18 jump complete + New Application Builder).
    - [x] Phase 3: Transition to Signals and Zoneless (LanguageService refactored and Control Flow migrated).
- [ ] 🧪 **Testing Infrastructure**: Transition from legacy `Karma/Jasmine` to `Vitest` for ultra-fast TDD cycles and native Vite integration - **In Progress (Infrastructure Setup)**.
    - [ ] RED phase: Define failing `vitest` config check.
    - [ ] GREEN phase: Successful `vitest` execution on `arduino.service`.
    - [ ] REFACTOR phase: Align all suite dependencies.
- [x] 🧪 **Unit Tests Overhaul**: Align TDD suite with Angular v18/v19 Signals and Control Flow.
- [x] **State Management**: Fully transitioned core Dashboard and Device Health components to **Angular Signals** for reactive telemetry.
- [x] **Responsive Grid**: Refactor the `dashboard-grid` using Native CSS Grid for better control over ultra-wide and mobile layouts.
- [x] **Chart Optimization**: Optimize `ng2-google-charts` or consider migrating to `Chart.js` for smoother real-time streaming animations.
- [x] **Strict Typing**: Audit `src/app/models` and ensure `any` is eliminated from service response handlers.
- [x] **PWA Support**: Add Progressive Web App capabilities for "Install to Home Screen" and offline viewing of cached history.

## 🧪 Testing & Validation
*Goal: Ensure 100% reliability for the critical front-end interface.*

- [ ] **Visual Regression Testing**: Integrate a tool to catch CSS breaks during deployment.
- [ ] **Cypress Coverage**: Expand E2E flows to include "Edit Device" and "Theme Switcher" persistence.
- [ ] **Unit Test Refactoring**: Update stale `.spec.ts` files to match recent service enhancements.

---
*Created: April 10, 2026*
