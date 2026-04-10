# 📝 TODO: Angular-MS UI & Feature Enhancements

This document tracks the planned improvements for the **IoT Microservices Dashboard (Angular-MS)**. Focus is on premium aesthetics, real-time interactivity, and advanced data visualization.

---

## 💎 UI/UX & Aesthetics (Premium Feel)
*Goal: Transform the dashboard into a state-of-the-art, high-end monitoring interface.*

- [ ] **Advanced Glassmorphism**: Refine the `.glass` class to use dynamic backdrop filters, subtle border gradients, and nested translucency layers.
- [ ] **Lottie Animations**: Replace static icons with subtle Lottie animations for "Connecting", "Syncing", and "Alert" states.
- [ ] **Skeleton Loaders**: Implement elegant pulse skeleton loaders for charts and stats cards during initial data fetch.
- [ ] **Micro-Interactions**: Add a 3D hover effect (parallax) to device cards in the dashboard.
- [ ] **Custom Scrollbars**: Design sleek, thin, themed scrollbars for history lists and sidenavs.
- [ ] **Typography Audit**: Transition to a more premium variable font (e.g., *Outfit* or *Inter*) and optimize hierarchy.
- [ ] **Global Search (Command Palette)**: Implement a `Ctrl+K` command palette for quick navigation and device search.

## 🚀 New Features
*Goal: Expand functionality to provide better intelligence and control.*

- [ ] **Real-time Alert Notifications**:
    - [ ] Integrate a Toast system (e.g., `ngx-toastr` or custom Material Snackbar) for critical IoT alerts (High Temp, Low Humidity).
    - [ ] Add a notification "Inbox" in the navbar to track past alerts.
- [ ] **Advanced Analytics Tab**:
    - [ ] Create a dedicated "Trends" view using larger, multi-line charts.
    - [ ] Comparison mode: Overlap charts from two different microcontrollers to compare environments.
- [ ] **AI Integration Polish**:
    - [ ] Enhance `app-ai-predictor` with confidence score visualizations.
    - [ ] Add a "Fix Suggestion" based on AI predictions (e.g., "AI suggests turning on irrigation soon").
- [ ] **Picture Gallery Enhancements**:
    - [ ] Implement a full-screen Lightbox for IoT surveillance pictures.
    - [ ] Add Timeline scrubbing for photo history.
- [ ] **Device Health Dashboard**: A specialized view showing battery levels (if applicable), latency, and uptime for all nodes.
- [ ] **Internationalization (i18n)**: Implement full support for English and Spanish, allowing dynamic switching.

## 🛠️ Technical Debt & Performance
*Goal: Modernize the tech stack and improve codebase maintainability.*

- [ ] **Angular Upgrade**: Roadmap to upgrade from **v15** to the latest Stable version (v17/v18) to leverage Signals and better SSR support.
- [ ] **State Management**: Evaluate `NgRx` or `Signals` (post-upgrade) to handle global microcontroller state more efficiently.
- [ ] **Responsive Grid**: Refactor the `dashboard-grid` using Native CSS Grid for better control over ultra-wide and mobile layouts.
- [ ] **Chart Optimization**: Optimize `ng2-google-charts` or consider migrating to `ECharts` or `Chart.js` for smoother real-time streaming animations.
- [ ] **Strict Typing**: Audit `src/app/models` and ensure `any` is eliminated from service response handlers.
- [ ] **PWA Support**: Add Progressive Web App capabilities for "Install to Home Screen" and offline viewing of cached history.

## 🧪 Testing & Validation
*Goal: Ensure 100% reliability for the critical front-end interface.*

- [ ] **Visual Regression Testing**: Integrate a tool to catch CSS breaks during deployment.
- [ ] **Cypress Coverage**: Expand E2E flows to include "Edit Device" and "Theme Switcher" persistence.
- [ ] **Unit Test Refactoring**: Update stale `.spec.ts` files to match recent service enhancements.

---
*Created: April 10, 2026*
