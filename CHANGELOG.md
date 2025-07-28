# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2025-07-28
### Added
- Ticket details view: view, edit, and update tickets with improved workflow
- Confirmation dialog for unsaved changes when editing or creating tickets
- Automatic removal of unsaved new tickets if user leaves without saving
- Improved ticket navigation: only one Back button, no confirmation when just viewing

### Fixed
- Ticket details workflow now matches real-world repair shop needs
- Confirmation dialog only appears when appropriate (edit mode or unsaved new ticket)

### Notes
- Ticket workflow feature complete and merged to feature branch
- Next: Begin work on customizable customer and ticket forms

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
