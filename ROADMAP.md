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

- [x] Customer CRUD UI (add, search, edit, details)
- [x] Ticket creation on customer add
- [x] Ticket history and status display per customer
- [x] Fix infinite render loop in CustomerDetails
- [x] Ticket details view and update workflow

# 2. Customization Foundation
- [ ] Customizable customer and ticket forms: Allow admins to add, remove, rename, and reorder fields (including custom fields) for both customers and tickets to suit business needs
- [ ] Error boundaries for robust error handling
- [ ] User authentication and role-based access

- [ ] Alphabetical customer list with A-Z dividers, lettermarks, and ascending/descending sorting/filtering (to be backed by database)


### 3. Advanced Features
- [ ] Plugin system for extensibility
- [ ] Role/permission management UI
- [ ] User management (add/edit users, assign roles)
- [ ] Custom statuses and workflow configuration


### 4. Admin Backend (Backbone of App)
- [ ] Admin dashboard for managing all customizable app features
- [ ] Customizable Ticket Fields & Statuses: Allow admin to add, edit, and reorder ticket fields and status levels to suit client needs
- [ ] UI builder for ticket and customer forms
- [ ] Estimate and invoice management: CRUD for estimates and invoices
- [ ] Audit logs for admin actions
- [ ] User management (advanced, with audit logs): add/edit users, assign roles, track changes
- [ ] Role and permission management (advanced): manage roles, permissions, and access control
- [ ] Settings for workflow, notifications, and integrations: editable app-wide settings
- [ ] Plugin management and configuration: add, remove, and configure plugins

> The admin backend is a critical, advanced feature. Most user-facing functions will be customizable from here to suit each client's needs. All admin requirements and ideas should be collected in this section for future implementation. This list will grow as more features are identified in code or requested.

### 5. UI/UX & PWA Polish
- [ ] Responsive, modern UI with Tailwind
- [ ] PWA manifest and icons
- [ ] Offline support and caching
- [ ] Accessibility improvements

### 6. Testing & Deployment
- [ ] Unit and integration tests
- [ ] CI/CD setup
- [ ] GitHub repository and version control
- [ ] Deployment (Netlify, Vercel, etc.)

---

## Immediate Next Step
**Implement ticket details view and update workflow.**
- Allow users to view and update individual ticket details from the customer details page.

---

## Where We Left Off
- Core customer/ticket creation flow is working and styled.
- Infinite render loop in CustomerDetails fixed.
- Ready to implement ticket details navigation and update logic.

---

## Notes
- Version control and GitHub integration to begin next session.
- All major setup and initial workflows are complete; focus now shifts to ticket workflow and advanced features.
