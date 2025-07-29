# Changelog

All notable changes to this project will be documented in this file.

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
