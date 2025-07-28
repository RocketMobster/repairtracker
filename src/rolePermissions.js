// Example role permissions mapping
export const ROLE_PERMISSIONS = {
  Admin: [
    'CREATE_TICKET', 'UPDATE_TICKET', 'DELETE_TICKET',
    'CREATE_ESTIMATE', 'UPDATE_ESTIMATE', 'DELETE_ESTIMATE',
    'CREATE_INVOICE', 'UPDATE_INVOICE', 'DELETE_INVOICE',
    'MANAGE_USERS', 'MANAGE_PLUGINS', 'EDIT_SETTINGS',
  ],
  Technician: [
    'CREATE_TICKET', 'UPDATE_TICKET', 'CREATE_ESTIMATE', 'UPDATE_ESTIMATE', 'CREATE_INVOICE', 'UPDATE_INVOICE',
  ],
  Viewer: [
    'VIEW_TICKET', 'VIEW_ESTIMATE', 'VIEW_INVOICE',
  ],
  FrontDesk: [
    'CREATE_TICKET', 'UPDATE_TICKET', 'CREATE_ESTIMATE', 'UPDATE_ESTIMATE', 'CREATE_CUSTOMER', 'UPDATE_CUSTOMER',
  ],
  Guest: [
    'VIEW_TICKET',
  ],
}

export function hasPermission(role, permission) {
  return ROLE_PERMISSIONS[role]?.includes(permission);
}
