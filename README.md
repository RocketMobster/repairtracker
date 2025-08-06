# RMA Repair Tracker v0.3.0

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
- Schema-driven forms for customers and tickets (dynamic rendering from config/schema)
- Admin-editable field groups (schema-ready) for ticket/customer forms and details views
- **Custom admin form builder:** drag-and-drop field management, animated drag overlay, field addition/removal, and notification system
- Animated drag overlay for field reordering (with field label and color feedback)
- Notification system for field add/remove actions
- Accessibility improvements (labels, placeholders, keyboard navigation)
- Colored grouping boxes for workflow steps in ticket and customer details views
- Phone number input masking (US/UK) in all forms for live formatting as user types
- Phone extension fields for all phone numbers (edit and display)
- Date fields use proper date pickers in all forms
- All phone numbers display formatted in details and search views
- Modern, responsive UI with Tailwind

## Roadmap & Documentation
- See `ROADMAP.md` and `repairtracker_prd.md` for full feature set, admin extensibility, and future plans.
- See CHANGELOG.md for all recent updates and features.

## Modular Form Builder Usage

The admin form builder is fully modular and extensible. To add a new field type, update `src/form-builder/fieldTypes.js` and add rendering logic in `src/form-builder/FormBuilder.jsx`.

### Example Field Config
```
{
  type: 'text',
  label: 'Text',
  config: {
    required: false,
    placeholder: '',
    minLength: 0,
    maxLength: 255,
    pattern: '',
    errorMessage: '',
  }
}
```

See `src/form-builder/README.md` for full data model and extensibility details.
