# RMA Repair Tracker v0.9.18

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
- Ticket relationship management (parent/child/sibling/related, deduplication, error guards, add/search/remove UI)
- External links for tickets
- Card preview modal with RMA as primary, item, reason for return, and custom fields
- Restore-to-board tool for RMAs (dev/admin tool)
- Custom field saving and display fixes


## Roadmap & Documentation
- See `ROADMAP.md` and `repairtracker_prd.md` for full feature set, admin extensibility, and future plans.

## TODOs and Known Issues

### Kanban Board
- ~~**PRIORITY FIX NEEDED**: Drag and drop functionality still has issues:~~
  - ~~Cards cannot be dragged between columns or reordered vertically within the same column~~ ✅ Fixed in v0.9.13
  - ~~The drag handle (two horizontal lines) overlaps with the priority star button in the top-right corner~~ ✅ Fixed in v0.9.13
  - ~~Current workaround: Cards can be dragged by clicking along the top edge of the card~~ ✅ Fixed in v0.9.13
  - ~~Need to investigate DndKit configuration and interaction issues with sortable context~~ ✅ Fixed in v0.9.13

### Notification System
- ~~**PRIORITY FIX NEEDED**: Notification system toggles to disabled state on application load:~~
  - ~~Console logs show notifications toggling between enabled/disabled, ultimately staying disabled~~ ✅ Fixed in v0.9.16
  - ~~Notifications are not generated when dragging cards due to disabled state~~ ✅ Fixed in v0.9.16
  - ~~Moving cards works correctly but no notifications are displayed~~ ✅ Fixed in v0.9.16
  
   - Related ticket status-change notifications: Partially complete in v0.9.18
      - Implemented: Notification emitted on move with aggregation to prevent duplicates; visible in Notification Center.
      - Pending: Per-user scoping, persistence across sessions/backend, admin-configurable categories, user preferences, optional push/email.
