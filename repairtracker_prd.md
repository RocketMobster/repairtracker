# Product Requirements Document (PRD)

## Product Name: RepairTracker Pro

**Tagline:** A flexible, role-based, plugin-friendly web app to streamline repair tracking and returns management for any service-based business.

---

## 1. Executive Summary
RepairTracker Pro is a modular, role-based Progressive Web App (PWA) built with React and TailwindCSS. It enables service departments, independent repair shops, and IT teams to manage repair tickets, track progress, assign tasks, and generate printable logs. The system is designed to be extensible through a developer-focused plugin architecture and customizable via user-configurable statuses and views.

---

## 2. Goals
- Provide an intuitive, modern repair tracking interface usable on mobile, desktop, and tablets.
- Enable drag-and-drop assignment and movement of tickets.
- Support multiple user roles (Admin, Technician, Viewer).
- Allow users to define custom ticket statuses.
- Support plugin-based enhancements and integrations.
- Offer printable repair reports and logs.

---

## 3. Core Features
### 3.1 Ticket Management
- Create, view, update, archive repair tickets.
- Assign to users via drag-and-drop.
- Track across customizable stages (e.g., Received, Diagnosing, Repairing, Awaiting Parts, Complete).
- Attach files/images to tickets.

### 3.2 Customer Profiles
- Store customer details (name, contact, history).
- View previous tickets for any customer.

### 3.3 Dashboard
- Overview of active repairs.
- Highlights high-priority or overdue items.
- Quick access to ticket statuses and assignment.

### 3.4 Ticket Status Management
- Admins can add/edit/remove statuses via UI.
- Custom statuses dynamically added to drag-and-drop interface.

### 3.5 Roles & Permissions
- **Admin**: Full access to all features.
- **Technician**: Access to assigned tickets, update status, add logs.
- **Viewer**: Read-only access.

### 3.6 Plugin Architecture
- Uploadable plugin modules.
- Execution sandbox per plugin.
- Plugins can register UI components, routes, or backend actions.
- Sample plugin hooks:
  - onTicketCreated
  - onStatusChanged
  - customReportFormatter

### 3.7 Printable Repair Logs
- Per-ticket printable report templates.
- Selectable print fields (summary, dates, tech notes, etc).

### 3.8 Filtering & Search
- Search tickets by customer, serial number, status, etc.
- Filter by date, assigned user, or plugin-augmented fields.

---

## PRD Addendum (2025-07-27)

### 3.5.1 Expanded Roles & Permissions
- **Front Desk**: Can create and update tickets, manage customer info, but limited access to settings.
- **Guest**: Read-only access or highly restricted actions.
- Permissions are defined in `rolePermissions.js` and mapped to roles.
- Permissions include: CREATE_TICKET, UPDATE_TICKET, DELETE_TICKET, CREATE_ESTIMATE, UPDATE_ESTIMATE, DELETE_ESTIMATE, CREATE_INVOICE, UPDATE_INVOICE, DELETE_INVOICE, etc.
- The system must enforce permissions at the UI and API levels.

### 3.5.2 Role Permissions Management
- Role permissions are editable by Admin via the UI.
- Permissions are enforced both in the frontend and backend (if/when backend is added).

### 3.6 Plugin Architecture (Expanded)
- Plugins are objects with metadata and code, loaded dynamically.
- Plugins can extend UI, add actions, or integrate with external services.
- Admins can enable/disable plugins.
- Plugin metadata includes name, version, author, and description.

### 3.7 Data Models (Expanded)
- **Ticket**: id, customerId, assignedTo, status, quotedPrice, finalPrice, notes, linkedEstimates, linkedInvoices, createdAt, updatedAt, etc.
- **Customer**: id, name, email, phone, address, etc. (phone format configurable)
- **User**: id, username, password (hashed in production), role, name
- **Estimate & Invoice**: id, ticketId, customerId, status, total, lineItems, createdAt, updatedAt, etc.
- **Plugin**: metadata, code, enabled/disabled

### 3.8 State Management
- Uses React Context for global state (see `AppContext.jsx`).
- State includes: tickets, customers, users, statuses, plugins, currentUser, currency, phoneFormat, rolePermissions, estimates, invoices, currentView, pendingEstimateData, pendingInvoiceData.
- State is persisted to local storage using a custom `useLocalStorage` hook.

### 3.9 UI/UX (Expanded)
- Ticket form: dynamic, with customer search/autocomplete, status, assigned tech, quoted/final price, notes, and links to estimates/invoices.
- Role-based navigation: menu items and actions are shown/hidden based on permissions.
- All forms use consistent styling (TailwindCSS) and validation.

### 3.10 Settings
- Currency: Default is USD, configurable.
- Phone Format: Default is USA, configurable.
- Role Permissions: Editable by Admin.

### 3.11 Authentication
- Simple username/password login (expandable to OAuth in future).
- Current user stored in context and local storage.
- Logout clears user session.

### 3.12 Extensibility
- All major entities are designed for future expansion (custom fields, attachments, etc.).
- Plugin system allows for integration with third-party services (e.g., SMS, email, payment gateways).

### 3.13 Error Handling & Validation
- All forms must provide user-friendly error messages.
- State changes are validated before being committed.
- API errors (if/when backend is added) are surfaced to the user.

### 3.14 Accessibility
- All interactive elements must be keyboard accessible.
- Use semantic HTML and ARIA attributes where appropriate.

### 3.15 Internationalization (i18n) [Planned]
- All user-facing text should be ready for translation.
- Currency and phone formats are configurable.

### 3.16 Testing
- Unit tests for all utility functions and context logic.
- Integration tests for major workflows (ticket creation, status update, etc.).

---

## 4. Technical Architecture
- **Frontend**: React + TailwindCSS
- **State Management**: Zustand
- **Routing**: React Router
- **Drag-and-Drop**: React DnD
- **Plugin System**: Dynamic import and sandboxed script execution
- **PDF Printing**: `react-to-print` or `jsPDF`
- **PWA**: Offline support, home screen installation

---

## 5. UI Wireframe Plan
### Customer Profile Page
- Name, contact, ticket history table
- Button: "Create New Ticket"

### Ticket Creation Page
- Customer dropdown
- Fields: Item Info, Problem Description, Priority
- Initial Status selection

### Ticket Management Board
- Kanban-style columns per status
- Ticket cards with summary, assignee
- Drag-and-drop enabled

### Dashboard View
- High-priority and overdue widgets
- Current workload per technician
- Recent tickets, alerts

### Admin Plugin Manager
- Upload plugin
- Enable/disable
- View logs/errors

### Report Printing View
- Formatted ticket summary
- Select fields to include
- Print/Download PDF button

---

## 6. Implementation Milestones
| Phase | Feature | Notes |
|-------|---------|-------|
| 1 | Customer & Ticket CRUD | Including validation |
| 2 | Kanban UI with drag/drop | Ticket reassignment support |
| 3 | Role-based views | Admin/Tech/Viewer layouts |
| 4 | Dynamic status system | Add/edit/remove statuses |
| 5 | Dashboard + Alerts | High-priority tracker |
| 6 | Plugin system MVP | Upload and register plugins |
| 7 | Printable reports | Styled PDF export |
| 8 | Search & Filter | Ticket explorer panel |

---

## 7. Change Log Summary (From Development Iterations)
- Introduced role-specific views and routes.
- Replaced static statuses with dynamic user-defined ones.
- Added plugin execution hooks and loader logic.
- Implemented drag-and-drop with dynamic statuses.
- Extended ticket state machine to include intermediate steps.

---

## 8. Future Enhancements
- Real-time updates with WebSockets or Firebase.
- Notification system (email, push).
- Built-in reporting dashboard.
- API support for third-party tools.
- Mobile-first UX redesign.

---

## 9. Target Users
- Small to mid-size repair shops (electronics, auto, instruments, etc.)
- IT departments handling internal RMA workflows
- Hobbyist and DIY repair communities

---

## 10. Success Metrics
- 90%+ user satisfaction with UI ease-of-use
- Average time-to-ticket-creation under 30 seconds
- Support for 5+ third-party plugins within 6 months
- Print/export used by >50% of users monthly

---

## Appendix: Sample Ticket Status Lifecycle
1. Received
2. In Queue
3. Diagnosing
4. Awaiting Parts
5. Repair In Progress
6. Testing
7. Completed
8. Returned / Shipped

---

## Appendix: Example Plugin Ideas
- Barcode scanner input field
- Parts inventory auto-checker
- Repair time estimator
- Third-party warranty validator
- Email notification module

---

This PRD will serve as the master guide for designing, building, and iterating on RepairTracker Pro. All team members and contributors can reference this document for architecture, design logic, and roadmap alignment.

