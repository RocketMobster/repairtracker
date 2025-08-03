

# RMA Repair Tracker v0.3.0

This project is a React + Vite + Tailwind CSS Progressive Web App (PWA).

## Getting Started

1. Install dependencies:
   ```

## Build Chunk Size Warnings

If you see Vite warnings about large chunks ("Some chunks are larger than 500 kB after minification"), you can:

- Refactor your code to use dynamic import() for code-splitting.
- Use build.rollupOptions.output.manualChunks in vite.config.js for custom chunking.
- Suppress the warning by increasing build.chunkSizeWarningLimit in vite.config.js.

For most apps, the warning is informational and does not affect functionality. For advanced optimization, consider dynamic imports or manual chunking.
   npm install
   ```
2. Start the development server:
   ```
   npm run dev
   ```


## Features
- React + Vite + Tailwind CSS
- PWA support
- Schema-driven forms for customers and tickets (dynamic rendering from config/schema)
- Admin-editable field groups (schema-ready) for ticket/customer forms and details views
- Colored grouping boxes for workflow steps in ticket and customer details views
- Phone number input masking (US/UK) in all forms for live formatting as user types
- Phone extension fields for all phone numbers (edit and display)
- Date fields use proper date pickers in all forms
- All phone numbers display formatted in details and search views
- Modern, responsive UI with Tailwind

## Roadmap & Documentation
- See `ROADMAP.md` and `repairtracker_prd.md` for full feature set, admin extensibility, and future plans.
