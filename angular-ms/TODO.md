# 📝 TODO: Angular-MS UI & Feature Enhancements

> [!IMPORTANT]
> **TDD FIRST MANDATE**: All development MUST follow the strict **Red-Green-Refactor** cycle. No code is to be committed without a prior failing test and its subsequent passing state.

---

## 💎 UI/UX & Aesthetics (Premium Feel)
*Goal: Transform the dashboard into a state-of-the-art, high-end monitoring interface.*

- [x] **Advanced Glassmorphism**: Refine the `.glass` class (Integrated in new components).
    - [x] Double check tests and TDD Red-Green-Refactor.
- [x] **Lottie Animations**: Replace static icons with subtle Lottie animations for "Connecting", "Syncing", and "Alert" states.
    - [x] RED phase: Verified missing Lottie providers.
    - [x] GREEN phase: Successfully rendered Lottie in Slider/Switch.
    - [x] REFACTOR phase: Extracted to standalone components.
    - [x] Double check tests and TDD Red-Green-Refactor.
- [x] **Skeleton Loaders**: Modernized with Signal-based inputs and variant support.
    - [x] RED phase: Established Vitest suite for circular variants.
    - [x] GREEN phase: Implemented `computed` border-radius and Signal inputs.
    - [x] REFACTOR phase: Standalone migration complete.
    - [x] Double check tests and TDD Red-Green-Refactor.
- [x] **Micro-Interactions**: Parallax effects and smooth transitions verified.
    - [x] Double check tests and TDD Red-Green-Refactor.
- [x] **Global Search (Command Palette)**: Modernized with Signal-based filtering.
    - [x] RED phase: Verified failing search suite in Vitest.
    - [x] GREEN phase: Implemented `computed` filtered items and `viewChild` signal.
    - [x] REFACTOR phase: Updated template to reactive calls.
    - [x] Double check tests and TDD Red-Green-Refactor.

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
    - [x] RED phase: Verified failing comparison suite in Vitest.
    - [x] GREEN phase: Implemented `toSignal` for device loading and `computed` chart data.
    - [x] REFACTOR phase: Modernized template with signal calls.
    - [x] Double check tests and TDD Red-Green-Refactor.
- [x] **AI Integration Polish**:
    - [x] Enhance `app-ai-predictor` with confidence score visualizations.
    - [x] RED phase: Defined failing Vitest suite for confidence/suggestions.
    - [x] GREEN phase: Implemented Signal-based performance tracking and `computed` suggestions.
    - [x] REFACTOR phase: Unified Material imports and template optimization.
    - [x] Double check tests and TDD Red-Green-Refactor.
- [x] **Picture Gallery Enhancements**:
    - [x] Implement a full-screen Lightbox for IoT surveillance pictures.
    - [x] Add Timeline scrubbing for photo history (Timelapse feature).
    - [x] RED phase: Verified timelapse timer logic failure.
    - [x] GREEN phase: Implemented Signal-based timelapse and history filtering.
    - [x] REFACTOR phase: Migrated to `computed` filtered pictures and modernized template.
    - [x] Double check tests and TDD Red-Green-Refactor.
- [x] **Device Health Dashboard**: A specialized view...
    - [x] RED phase: Established Vitest suite for average uptime calculation.
    - [x] GREEN phase: Implemented `computed` health stats and Signal state.
    - [x] REFACTOR phase: Integrated `toSignal` for seamless service bridging.
    - [x] Double check tests and TDD Red-Green-Refactor.
- [x] **Custom Scrollbars**: Design sleek, thin, themed scrollbars for history lists and sidenavs.
    - [x] Double check tests and TDD Red-Green-Refactor.
- [x] **Typography Audit**: Transition to a more premium variable font...
    - [x] Double check tests and TDD Red-Green-Refactor.

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
    - [x] Achieve 100% Cypress Coverage for "Edit Device" and "Theme Persistence".
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
- [x] 🧪 **Testing Infrastructure**: Transition from legacy `Karma/Jasmine` to `Vitest` for ultra-fast TDD cycles and native Vite integration - **COMPLETE**.
    - [x] RED phase: Define failing `vitest` config check.
    - [x] GREEN phase: Successful `vitest` execution on `arduino.service`.
    - [x] REFACTOR phase: Align all suite dependencies.
- [x] 🧪 **Unit Tests Overhaul**: Align TDD suite with Angular v18/v19 Signals and Control Flow.
    - [x] Double check tests and TDD Red-Green-Refactor.
- [x] **State Management**: Fully transitioned core Dashboard, Device Health, and History components to **Angular Signals** for reactive telemetry.
    - [x] Double check tests and TDD Red-Green-Refactor.
- [x] **Responsive Grid**: Refactor the `dashboard-grid` using Native CSS Grid for better control over ultra-wide and mobile layouts.
    - [x] Double check tests and TDD Red-Green-Refactor.
- [x] **Chart Optimization**: Optimize `ng2-google-charts` using Signal-based reactivity for smoother real-time streaming animations.
    - [x] Double check tests and TDD Red-Green-Refactor.
- [x] **Strict Typing**: Audit `src/app/models` and ensure `any` is eliminated from service response handlers.
    - [x] Double check tests and TDD Red-Green-Refactor.
- [x] **PWA Support**: Added Progressive Web App capabilities for "Install to Home Screen" and offline viewing of cached history (Verified via manifest.webmanifest).
    - [x] Double check tests and TDD Red-Green-Refactor.

## 🧪 Testing & Validation
*Goal: Ensure 100% reliability for the critical front-end interface.*

- [x] **Visual Regression Testing**: Establish robust Vitest-based snapshots for critical UI paths.
- [x] **Cypress Coverage**: Expanded E2E flows to include "Edit Device" and "Theme Switcher" persistence.
- [x] **Unit Test Refactoring**: Successfully migrated core components (`AppComponent`, `DashboardComponent`, `NavbarComponent`, `AlertInboxComponent`, `SliderComponent`, `SwitchComponent`, `PicturesHistoryComponent`, `MeasureHistoryComponent`, `DeviceHealthComponent`, `MicrocontrollersEditComponent`) to Vitest using Red-Green-Refactor.
- [x] **Documentation Hardening**: Appended Chapters 33 and 34 to the Engineering Manual documenting the modernization waves.

---
*Created: April 10, 2026*
