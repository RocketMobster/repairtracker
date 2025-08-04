# Modular React Form Builder

## Data Model

### Field
```
{
  id: string,
  type: string, // one of FIELD_TYPES
  label: string,
  config: { ... } // see below
}
```

### Field Config
- `text`: required, placeholder, minLength, maxLength, pattern
- `number`: required, placeholder, min, max, step
- `date`: required, min, max
- `dropdown`: required, options (comma separated), placeholder
- `checkbox`: required, checked
- `radio`: required, options (comma separated)

### FormDefinition
```
{
  fields: Field[],
  title: string,
  description: string
}
```

## Usage
- Import `FormBuilder` and use in any React app
- Extend `FIELD_TYPES` and config as needed
- State managed via Zustand, modular and extensible

## Extensibility
- Add new field types by updating `fieldTypes.js` and UI
- Builder state is isolated in `store.js` for easy integration
