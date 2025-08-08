# RMA Repair Tracker v0.4.0

This project is a React + Vite + Tailwind CSS Progressive Web App (PWA).

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```
2. Start the development server:
   ```
   npm run dev
   ```


## Features
- React + Vite + Tailwind CSS
- PWA support
- Kanban board with admin-only column actions (add/remove/rename/reorder, WIP limits)
- Safety net: tickets from deleted columns moved to Holding column (cannot delete if not empty)
- Drag-and-drop: robust, smooth, cross-column, drop indicators, stable hooks
- Dismissible notifications for ticket moves and blocked actions
- Schema-driven forms for customers and tickets (dynamic rendering from config/schema)
- Admin-editable field groups (schema-ready) for ticket/customer forms and details views
- Colored grouping boxes for workflow steps in ticket and customer details views
- Phone number input masking (US/UK) in all forms for live formatting as user types
- Phone extension fields for all phone numbers (edit and display)
- Date fields use proper date pickers in all forms
- All phone numbers display formatted in details and search views
- Modern, responsive UI with Tailwind


## Roadmap & Documentation
- Dashboard implementation will include core widgets (metrics, recent activity, etc.).
- Advanced dashboard customization (add/remove/rearrange widgets, custom reports, integrations) may be offered as a plugin or paid upgrade in the future.
- See `ROADMAP.md` and `repairtracker_prd.md` for full feature set, admin extensibility, and future plans.
