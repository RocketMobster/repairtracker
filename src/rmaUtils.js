// Utility to generate an RMA number with a customizable schema
// Default: prefix 'ra', length 10, alphanumeric
export function generateRmaNumber({ prefix = 'ra', length = 10, charset = 'alphanumeric' } = {}) {
  const chars = charset === 'numeric'
    ? '0123456789'
    : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let rma = prefix;
  for (let i = 0; i < length - prefix.length; i++) {
    rma += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return rma;
}
