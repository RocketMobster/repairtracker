import { FIELD_TYPES } from '../fieldTypes';

describe('FIELD_TYPES config', () => {
  it('should have errorMessage in every field config', () => {
    FIELD_TYPES.forEach(ft => {
      expect(ft.config).toHaveProperty('errorMessage');
    });
  });

  it('should have required property in every field config', () => {
    FIELD_TYPES.forEach(ft => {
      expect(ft.config).toHaveProperty('required');
    });
  });
});
