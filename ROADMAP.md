# RepairTracker Pro – Project Roadmap

## Overview
RepairTracker Pro is a React + Vite + Tailwind CSS Progressive Web App (PWA) for streamlined repair tracking and returns management. It features robust customer and ticket management, a role-based system, and plugin-friendly architecture.

---

## Roadmap

### 1. Foundation & Setup
- [x] Scaffold React + Vite + Tailwind CSS project
- [x] Configure Tailwind CSS (v3 for stability)
- [x] Set up Zustand for global state management
- [x] Integrate React Router for navigation
- [x] Add vite-plugin-pwa for PWA support

### 2. Core Features: Customer & Ticket Management

### 3. Core Lists & Boards (Next Steps)
1. [ ] Implement the "Searchable, alphabetized customer list page"
    - Dedicated page listing all customers in alphabetical order with search and filter options.
2. [ ] Global ticket list/search page
    - Page listing all tickets (active and closed), searchable by RMA number, company name, or ticket number.
3. [ ] Kanban board for ticket prioritization
    - Drag-and-drop Kanban board for ticket workflow, status management, and prioritization. Enterprise-level feature for real-time ticket management.

> **Note:** The admin backend implementation should start in parallel with these three steps, as it will enable advanced configuration and extensibility for the features above.




### 3. Advanced Features

    - Add tooltips throughout the UI for key fields, buttons, and workflows.
    - Implement a context-sensitive help system to guide users based on their current view or action.

    - Allow clients to define custom groupings of fields (with label, color, and order) from the admin backend for both forms and details views. This enables highly flexible, industry-specific UI layouts.

- [ ] **Custom Admin Form Builder Epic**
    - Build a fully custom, React 19-compatible drag-and-drop form builder for admin users. **(IN PROGRESS)**
    - Features: add/remove/reorder fields, edit field properties, live preview, JSON schema export/import, direct update of user-facing forms.
    - Animated drag overlay for field reordering, notification system for add/remove, accessibility improvements, and UI polish completed.
    - Replace legacy SurveyJS/Formio.js demos with this new builder.
    - Track as an Epic with sprints for UI, drag-and-drop, field editing, preview, and integration.

- [ ] Usage logs for admin backend
    - Secure log files are generated whenever a customer is entered (with a repair ticket/RMA number), when additional tickets/RMA numbers are added for existing customers, when customers or tickets are deleted, and when tickets or customers are edited.
    - Each log entry records the date, time, user, and operation performed.

### 4. UI/UX & PWA Polish
- [ ] Responsive, modern UI with Tailwind
- [ ] PWA manifest and icons
- [ ] Offline support and caching
- [ ] Accessibility improvements

### 5. Testing & Deployment
- [ ] Unit and integration tests
- [ ] CI/CD setup
- [ ] GitHub repository and version control
- [ ] Deployment (Netlify, Vercel, etc.)

---



## Completed in v0.3.0
- Schema-driven customizable forms (dynamic form rendering from config/schema)
- Customer record management (delete, admin controls, ticket cascade delete)
- Ticket details view and update workflow (details view, update, grouping, colored boxes)
- Phone number input masking and extension support in all forms
- Date pickers for all date fields
- UI polish: consistent grouping, colored backgrounds, improved layout
- Roadmap, PRD, and changelog updated

## Notes
- Version bumped to 0.3.0 for schema-driven forms, extensibility, and UI/UX improvements
- Version control and GitHub integration to begin next session.
- All major setup and initial workflows are complete; focus now shifts to ticket workflow and advanced features.
