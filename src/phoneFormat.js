// Utility to format phone numbers for US and UK
export function formatPhoneNumber(number, country = "US") {
  if (!number) return "";
  const digits = number.replace(/\D/g, "");
  if (country === "US") {
    // US: (978) 535-8867
    if (digits.length === 10) {
      return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
    }
    if (digits.length === 11 && digits[0] === "1") {
      return `(${digits.slice(1,4)}) ${digits.slice(4,7)}-${digits.slice(7)}`;
    }
    return number;
  }
  if (country === "UK") {
    // UK: +44 7xxx xxx xxx or 07xxx xxx xxx
    if (digits.startsWith("44") && digits.length === 12) {
      return `+44 ${digits.slice(2,6)} ${digits.slice(6,9)} ${digits.slice(9)}`;
    }
    if (digits.startsWith("07") && digits.length === 11) {
      return `0${digits.slice(1,5)} ${digits.slice(5,8)} ${digits.slice(8)}`;
    }
    return number;
  }
  return number;
}
