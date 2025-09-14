# Changelog

## [0.9.17] - 2025-09-14
### Fixed
- Notification System:
  - Fixed persistent UI issue where notifications were created but not displayed
  - Added forced re-rendering regardless of disabled state
  - Enhanced notification system with additional debug logging
  - Added mount-time check to ensure notifications are enabled
  - Modified polling to always update UI even when system is disabled

## [0.9.16] - 2025-09-14
### Fixed
  - Fixed persistent disabled state on application startup
  - Added explicit startup function to ensure notifications are enabled
## [0.9.18] - 2025-09-14
### Changed
- Notifications (Related Status Changes): Marked as partially complete.
  - Implemented: Emission on related ticket status moves, aggregation to avoid duplicates, UI rendering with unread/clear.
  - Pending (Admin/User integration): per-user scoping, persistence across sessions/backend, admin-configurable categories, user preferences, optional push/email channels, and basic auditing.
  - Enhanced toggle function with error handling and state verification
  - Added detailed logging to trace notification system state changes
  - Fixed initialization sequence to prevent automatic toggling

## [0.9.15] - 2025-09-14
### Fixed
- Notification System:
  - Fixed StrictMode double mounting that caused notification system to toggle repeatedly
  - Removed React StrictMode wrapper to prevent double initialization in development
  - Added initialization guard using useRef to prevent multiple data loads
  - Updated README to indicate all drag-and-drop issues are resolved
  - Fixed toggle functionality to remain in the selected state

## [0.9.14] - 2025-09-14
### Fixed
- Notification System:
  - Fixed notification toggle functionality that was toggling repeatedly
  - Modified interval-based polling to respect disabled state
  - Improved notification toggle behavior to prevent state conflicts
  - Enhanced logging to provide more detailed diagnostic information
  - Added proper checks for disabled state before processing notifications

## [0.9.13] - 2025-09-13
### Fixed
- Drag and Drop:
  - Fixed critical bug that prevented dragging cards between columns
  - Removed reference to undefined variable in moveTicket function
  - Restored proper state update in cross-column drag operations
  - Fixed error in drag end handler that was causing moves to fail silently

## [0.9.12] - 2025-09-13
### Fixed
- Notification System:
  - Implemented NUCLEAR OPTION with completely isolated notification system
  - Moved notification handling entirely outside React/Zustand state management
  - Implemented real-time notification polling with interval-based updates
  - Added signature-based deduplication inside isolated notification system
  - Fixed double initialization of sample data which was causing duplicate notifications
  - Added comprehensive error handling with multiple fallback mechanisms
  - Implemented proper cleanup and state isolation to prevent any possible leaks
  - Created completely new notification API that bypasses traditional state flows

## [0.9.7] - 2025-09-12
### Fixed
- Notification System:
  - Completely rewritten notification generation logic to prevent duplicate notifications for blocked cards
  - Added advanced duplicate detection with timestamp-based comparisons
  - Implemented direct state updates with validation to ensure notification uniqueness
  - Added extensive debug logging to help diagnose notification issues

## [0.9.6] - 2025-09-12
### Fixed
- Notification System:
  - Improved fix for duplicate notifications when moving blocked cards
  - Completely redesigned relationship tracking algorithm to properly handle bidirectional relationships

## [0.9.5] - 2025-09-12
### Fixed
- Notification System:
  - Fixed z-index issue with the notification dropdown being covered by drop indicators
  - Fixed duplicate notifications for blocked cards when moving them
  - Added temporary developer toggle to enable/disable notifications (for development only)

## [0.9.4] - 2025-09-12
### Added
- Notification System:
  - Added notification bell icon in the navigation bar
  - Implemented notifications for related ticket status changes
  - Created dropdown interface to view and manage notifications
  - Added ability to mark notifications as read or clear all notifications
  - Notifications persist across page navigation

## [0.9.3] - 2025-09-12
### Fixed
- UI:
  - Fixed z-index issue where the top drop indicator of columns would overlap the Relationship Blocking Config menu

## [0.9.2] - 2025-09-12
### Fixed
- Relationship Blocking:
  - Fixed issue where "Prevent shipping tickets that are blocked" setting wasn't working independently of the "Prevent shipping tickets that block others" setting

## [0.9.1] - 2025-09-12
### Fixed
- Drag and Drop Functionality:
  - Fixed issue with cards not being draggable between columns
  - Fixed inability to reorder cards vertically within columns
  - Fixed issue preventing upward dragging of cards
  - Fixed specific problem with dragging cards to the top position
  - Enhanced drop indicators for better visibility and targeting
  - Repositioned drag handle to prevent overlap with priority star
  - Optimized collision detection for more reliable dragging
- Column Functionality:
  - Fixed WIP limit setting functionality
  - Added proper updateKanbanColumn function to the store

### Technical
- Improved DndKit configuration with better sensor settings
- Enhanced drop indicator visualization without text labels
- Implemented special handling for top position drops
- Added comprehensive logging for drag operations

## [0.9.0] - 2025-09-10
### Added
- Blocking Relationship System:
  - Added "blocks" and "blockedBy" relationship types to ticket relationships
  - Implemented visual indicators for blocked and blocking tickets in Kanban board
  - Added warnings when attempting to move blocked tickets forward in workflow
  - Enhanced relationship display in ticket preview with block status indicators
  - Improved relationship utilities with functions to check and manage blocked status

### Improved
- Ticket Movement Logic:
  - Added workflow validation to prevent illogical ticket movements
  - Improved error handling for ticket movement restrictions
  - Added notification system for blocked ticket status changes
  - Enhanced user feedback when attempting to move blocked tickets

### Technical
- Added helper functions for relationship status checking
  - `isTicketBlocked` - Determines if a ticket is blocked by others
  - `isTicketBlocking` - Determines if a ticket is blocking others
  - `getBlockingTickets` - Returns all tickets blocking a specific ticket
  - `getBlockedTickets` - Returns all tickets blocked by a specific ticket
  - `canMoveTicket` - Validates if a ticket can move to a specific column

## [0.8.0] - 2025-08-16
### Added
- Relationship Visualization Improvements:
  - Updated relationship note formatting with "NOTES:" prefix for clarity
  - Improved deduplication of relationships throughout the application
  - Applied relationship cleanup to sample data to ensure consistent initialization
  - Enhanced color picker modal with proper confirmation flow
  
### Improved
- Relationship Color Management:
  - Fixed color picker behavior to prevent accidental clearing of group colors
  - Ensured consistent behavior between "Group Color" button and color thumbnail
  - Improved UX flow when adding or modifying relationship colors
  - Enhanced relationship colors display on tickets and in ticket details

### Fixed
- Relationship Display Logic:
  - Eliminated duplicate relationship entries in ticket details view
  - Fixed inconsistent formatting of relationship notes
  - Resolved issues with color picker modal opening from different UI elements
  - Fixed unintended behavior when canceling color selection
  
### Technical
- Enhanced cleanup of relationship data structure using `relationshipUtils.js`
- Improved deduplication logic for relationships to prevent duplicate entries
- Added better validation and error handling for relationship management
- Refactored color picker modal code for better maintainability

## [0.7.0] - 2025-08-14
### Added
- Group Color System:
  - Added "Group Color" button to set colors for all related tickets at once
  - Added "Clear Groups" button to remove all group colors from related tickets
  - Added explanatory text and tooltips to color management UI
  - Implemented consistent group ID generation for better relationship tracking
  - Enhanced group color pills display in Kanban tickets and ticket details

### Improved
- Relationship Management:
  - Improved handling of ticket relationships (parent/child/related)
  - Enhanced UI for adding, viewing, and managing related tickets
  - Fixed issues with relationship data integrity and consistency
  - Added proper cleanup of removed relationships and their group colors
  - Improved backward compatibility with older data formats

### Fixed
- Group Color Logic:
  - Fixed duplicate group color pills in Kanban board tickets
  - Fixed issue with group colors being added when canceling ticket edits
  - Implemented proper deduplication of group colors in the UI
  - Resolved issues with group color persistence and state management
  - Improved color assignment logic for consistent group visualization

### Technical
- Refactored ticket details component for better maintainability
- Enhanced state management for group colors and relationships
- Improved data structure for group color storage
- Fixed naming conflicts in state management functions
- Added proper validation for group color assignments

## [0.6.0] - 2025-08-12
### Added


# Changelog
- Phone extension fields for all phone numbers (edit and display)
- Date fields now use proper date pickers in all forms
- UI polish: consistent field grouping, colored backgrounds, and improved layout
### Notes


# Admin Backend TODO
- User/role management: add admin, staff, and custom roles; restrict sensitive actions (delete, schema changes) to admins

- [TODO] Restore-to-board tool: The 'Restore to Board' link in customer details is currently a dev tool for restoring RMAs to the Kanban board. Consider gating this feature for admin use only in production, as it may be necessary for admin recovery/maintenance.
- Customizable form schemas: allow admin to edit ticket/customer form fields, types, and validation rules
	- Add admin UI page with a code/text editor (e.g., Monaco, Ace, or textarea) to edit the JSON schema for custom fields directly in the app, with live preview and validation.
	- Store the custom fields schema in app state (Zustand or backend DB), not just a static file, and persist changes from the admin UI.
	- Changes to the schema should update the ticket form instantly for all users.
	- Add schema validation in the admin UI to prevent invalid field definitions.
- Drag-and-drop form builder for ticket form:
	- Visual editor for admins to add, remove, and reorder fields (including custom fields) using drag-and-drop.
	- Each field's config (name, label, type, required, etc.) is editable in the UI.
	- On save, updates the schema in app state and persists it.
	- The ticket form (DynamicForm) always renders based on the current schema, so changes are reflected instantly.
- RMA number schema: allow client to set RMA number length (8-15), composition (numeric or alphanumeric), and first two fixed letters (prefix); expose settings in admin UI and persist for ticket creation; allow preview of RMA format
- Ticket status and workflow customization: admin can define custom ticket statuses and allowed transitions
- Add admin panel setting to toggle the comments/activity log in the Kanban card preview modal on or off for all cards in the board.
- Data export/import: CSV/Excel export for tickets/customers, import for bulk onboarding
- Audit log: track admin actions (deletes, edits, schema changes)
- Branding: allow admin to upload logo, set business info, and customize PWA appearance
- Backup/restore: admin can trigger backup and restore of all data
- Advanced search/filter: admin UI for searching/filtering tickets and customers by any field
- Localization/regional settings: admin can set default date format (e.g., mm-dd-yyyy, dd-mmm-yyyy, mm/dd/yy) and phone number format (US/UK/other) for all forms and displays; settings applied app-wide

# Other admin-controlled features discussed today:
- Schema-driven form editor: allow admin to add/remove/move date/signature/notes fields for ticket workflow steps (e.g., Reception, Inspection, Repaired, Shipped, etc.)
- Kanban board configuration: admin can enable/disable Kanban board, set default columns/statuses, and control drag/drop permissions



# Changelog
## [0.6.0] - 2025-08-12
### Major
- Kanban board overhaul: robust drag-and-drop, admin-only column actions, WIP limits, and safety net for deleted columns
- Ticket relationship management: parent/child/sibling/related, deduplication, error guards, and UI for adding/removing/searching related tickets
- External links support for tickets
- Card preview modal: now shows RMA as primary, item, reason for return, and custom fields with labels
- Search improvements: search by RMA, item, company, notes, and custom fields
- Restore-to-board tool for RMAs (dev/admin tool)
- Custom field saving and display fixes (Serial Number, etc.)
- Many UI/UX improvements and bugfixes

### Fixed
- Custom fields now always save and display correctly
- Card preview and Kanban card now show RMA as primary identifier
- Related tickets deduplication and error handling

### Notes
- Restore-to-board tool is currently a dev/admin feature (see Admin Backend TODO)

# Changelog

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2025-07-28
### Added
- Ticket details view and update workflow (ticket details route, view, and navigation)
- Customer slug in ticket URLs for improved readability
- Persistence for tickets and customers (localStorage via Zustand persist)
- Duplicate customer prevention (case-insensitive, trimmed business name)
- Roadmap and changelog updated to reflect new features and next steps

### Fixed
- Race condition on ticket/customer creation and navigation
- Ticket/customer not found after creation (lookup order and state update sequencing)
- Ticket view styling (centered card, improved details)

### Notes
- Ticket URL routing feature branch ready to merge
- Next: Customer record management (delete, admin controls) and finish schema-driven forms
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-07-27
### Added
- Initial project scaffold with React, Vite, and Tailwind CSS (v3)
- Zustand for global state management
- React Router for navigation
- vite-plugin-pwa for PWA support
- Customer management UI: add, search, edit, details
- Ticket creation logic on customer add
- Ticket history and status display per customer

### Fixed
- Tailwind v4+ integration issues by downgrading to v3
- PostCSS config for Tailwind v3
- Infinite render loop in CustomerDetails by moving filtering logic outside Zustand selector
- Removed test yellow background from index.css

### Notes
- Ready for version control and GitHub integration
- Next: Implement ticket details view and update workflow
