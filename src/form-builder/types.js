// TypeScript-like interfaces for form builder data model
/**
 * FieldConfig: config options for each field type
 */
export const FieldConfig = {
  text: {
    required: 'boolean',
    placeholder: 'string',
    minLength: 'number',
    maxLength: 'number',
    pattern: 'string',
  },
  number: {
    required: 'boolean',
    placeholder: 'string',
    min: 'number',
    max: 'number',
    step: 'number',
  },
  date: {
    required: 'boolean',
    min: 'string',
    max: 'string',
  },
  dropdown: {
    required: 'boolean',
    options: 'string',
    placeholder: 'string',
  },
  checkbox: {
    required: 'boolean',
    checked: 'boolean',
  },
  radio: {
    required: 'boolean',
    options: 'string',
  },
};

/**
 * Field: a single form field
 */
export const Field = {
  id: 'string',
  type: 'string',
  label: 'string',
  config: 'FieldConfig',
};

/**
 * FormDefinition: the full form schema
 */
export const FormDefinition = {
  fields: '[Field]',
  title: 'string',
  description: 'string',
};
