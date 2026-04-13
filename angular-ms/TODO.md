# 📝 TODO: Angular-MS UI & Feature Enhancements

> [!IMPORTANT]
> **TDD FIRST MANDATE**: All development MUST follow the strict **Red-Green-Refactor** cycle. No code is to be committed without a prior failing test and its subsequent passing state.

---

## 💎 UI/UX & Aesthetics (Premium Feel)
*Goal: Transform the dashboard into a state-of-the-art, high-end monitoring interface.*

- [x] **Advanced Glassmorphism**: Refine the `.glass` class (Integrated in new components).
    - [ ] Double check tests and TDD Red-Green-Refactor.
- [x] **Lottie Animations**: Replace static icons with subtle Lottie animations for "Connecting", "Syncing", and "Alert" states.
    - [x] RED phase: Verified missing Lottie providers.
    - [x] GREEN phase: Successfully rendered Lottie in Slider/Switch.
    - [x] REFACTOR phase: Extracted to standalone components.
    - [x] Double check tests and TDD Red-Green-Refactor.
- [x] **Skeleton Loaders**: Implement elegant pulse skeleton loaders for charts and stats cards during initial data fetch.
    - [ ] Double check tests and TDD Red-Green-Refactor.
- [x] **Micro-Interactions**: Add a 3D hover effect (parallax) to device cards in the dashboard.
    - [ ] Double check tests and TDD Red-Green-Refactor.
- [x] **Global Search (Command Palette)**: Implement a `Ctrl+K` command palette for quick navigation and device search.
    - [ ] Double check tests and TDD Red-Green-Refactor.

## 🚀 New Features
*Goal: Expand functionality to provide better intelligence and control.*

- [x] **Real-time Alert Notifications**:
    - [x] Integrate a Toast system (e.g., `ngx-toastr` or custom Material Snackbar) for critical IoT alerts.
    - [x] Add a notification "Inbox" in the navbar to track past alerts.
    - [x] RED phase: Confirmed Jasmine/Vitest mismatch in spec.
    - [x] GREEN phase: Migrated to Signals and passed Vitest.
    - [x] REFACTOR phase: Modernized imports and template calls.
    - [x] Double check tests and TDD Red-Green-Refactor.
- [x] **Advanced Analytics Tab**:
    - [x] Create a dedicated "Trends" view using larger, multi-line charts.
    - [x] Comparison mode: Overlap charts from two different microcontrollers to compare environments.
    - [ ] Double check tests and TDD Red-Green-Refactor.
- [x] **AI Integration Polish**:
    - [x] Enhance `app-ai-predictor` with confidence score visualizations.
    - [x] Add a "Fix Suggestion" based on AI predictions (e.g., "AI suggests turning on irrigation soon").
    - [ ] Double check tests and TDD Red-Green-Refactor.
- [ ] **Picture Gallery Enhancements**:
    - [x] Implement a full-screen Lightbox for IoT surveillance pictures.
    - [x] Add Timeline scrubbing for photo history.
    - [ ] Double check tests and TDD Red-Green-Refactor.
- [x] **Device Health Dashboard**: A specialized view...
    - [ ] Double check tests and TDD Red-Green-Refactor.
- [x] **Custom Scrollbars**: Design sleek, thin, themed scrollbars for history lists and sidenavs.
    - [ ] Double check tests and TDD Red-Green-Refactor.
- [x] **Typography Audit**: Transition to a more premium variable font...
    - [ ] Double check tests and TDD Red-Green-Refactor.

## 🔴🟢🔵 TDD Red-Green-Refactor Enforcement
*Goal: Institutionalize technical discipline across all architectural layers.*

- [x] **Component Modernization (TDD Verified)**:
    - [x] `DashboardComponent`: Signal migration verified.
    - [x] `DeviceHealthComponent`: Signal migration verified.
    - [x] `MeasureHistoryComponent`: Signal migration verified.
    - [x] `AnalyticsComponent`: Chart.js migration verified.
    - [x] `PicturesChartComponent`: Signal migration verified.
    - [x] `NavbarComponent`: Standalone migration verified.
    - [x] `LoginComponent`: Standalone migration verified.
    - [x] `IndexComponent`: Standalone migration verified.
    - [ ] Double check tests and TDD Red-Green-Refactor across all standalone components.
- [x] **Phase 5: Modernization & Standalone Migration (COMPLETE)**:
    - [x] Convert all components and directives to **Standalone**.
    - [x] Migrate legacy providers (ngx-lottie, ng2-charts) to modern provider patterns.
    - [x] Stabilize Angular v19 build (0 Errors).
    - [x] Implement Reactive `BehaviorSubject` in `ArduinoService` for device state orchestration.
    - [ ] Double check tests and TDD Red-Green-Refactor across all sub-components.
- [x] **Phase 6: Infrastructure TDD & Performance Hardening**:
    - [x] Finalize **Vitest** setup and automated test conversion.
    - [x] RED phase: Identified injection errors and Jasmine/Vitest mismatches.
    - [x] GREEN phase: Migrated `AppComponent`, `DashboardComponent`, `NavbarComponent`, `AlertInboxComponent` to Vitest.
    - [x] REFACTOR phase: Abstracted common mock patterns and enabled isolated standalone testing.
    - [ ] Achieve 100% Cypress Coverage for "Edit Device" and "Theme Persistence".
    - [x] Implement `SliderComponent` and `SwitchComponent` Signal migration.
    - [x] **Performance Audit: Transition to Zoneless Change Detection**.
    - [x] RED phase: Verified Zone.js dependency in build.
    - [x] GREEN phase: Enabled `provideExperimentalZonelessChangeDetection` in AppModule.
    - [x] REFACTOR phase: Removed `zone.js` from polyfills in angular.json.

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
    - [ ] Double check tests and TDD Red-Green-Refactor.
- [x] **State Management**: Fully transitioned core Dashboard and Device Health components to **Angular Signals** for reactive telemetry.
    - [ ] Double check tests and TDD Red-Green-Refactor.
- [x] **Responsive Grid**: Refactor the `dashboard-grid` using Native CSS Grid for better control over ultra-wide and mobile layouts.
    - [ ] Double check tests and TDD Red-Green-Refactor.
- [x] **Chart Optimization**: Optimize `ng2-google-charts` or consider migrating to `Chart.js` for smoother real-time streaming animations.
    - [ ] Double check tests and TDD Red-Green-Refactor.
- [x] **Strict Typing**: Audit `src/app/models` and ensure `any` is eliminated from service response handlers.
    - [ ] Double check tests and TDD Red-Green-Refactor.
- [x] **PWA Support**: Add Progressive Web App capabilities for "Install to Home Screen" and offline viewing of cached history.
    - [ ] Double check tests and TDD Red-Green-Refactor.

## 🧪 Testing & Validation
*Goal: Ensure 100% reliability for the critical front-end interface.*

- [ ] **Visual Regression Testing**: Integrate a tool to catch CSS breaks during deployment.
- [x] **Cypress Coverage**: Expanded E2E flows to include "Edit Device" and "Theme Switcher" persistence.
- [x] **Unit Test Refactoring**: Successfully migrated core components (`AppComponent`, `DashboardComponent`, `NavbarComponent`, `AlertInboxComponent`, `SliderComponent`, `SwitchComponent`) to Vitest using Red-Green-Refactor.

---
*Created: April 10, 2026*
