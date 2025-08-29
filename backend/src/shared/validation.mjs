// shared/validation.mjs

/**
 * Shared validation utilities
 */

/**
 * Validates that all required fields are present in the data object
 * @param {Object} data - The data object to validate
 * @param {Array<string>} requiredFields - Array of required field names
 * @returns {Array<string>} - Array of missing field names
 */
export function validateRequiredFields(data, requiredFields) {
  const missingFields = [];
  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      missingFields.push(field);
    }
  }
  return missingFields;
}

/**
 * Validates that a value is a positive integer
 * @param {any} value - The value to validate
 * @returns {boolean} - True if valid positive integer
 */
export function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

/**
 * Validates that a value is a non-negative integer
 * @param {any} value - The value to validate
 * @returns {boolean} - True if valid non-negative integer
 */
export function isNonNegativeInteger(value) {
  return Number.isInteger(value) && value >= 0;
}

/**
 * Validates email format
 * @param {string} email - The email to validate
 * @returns {boolean} - True if valid email format
 */
export function isValidEmail(email) {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates phone number format (Vietnamese)
 * @param {string} phone - The phone number to validate
 * @returns {boolean} - True if valid phone format
 */
export function isValidPhone(phone) {
  if (!phone) return false;
  const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
  return phoneRegex.test(phone);
}

/**
 * Validates date format (YYYY-MM-DD)
 * @param {string} date - The date string to validate
 * @returns {boolean} - True if valid date format
 */
export function isValidDate(date) {
  if (!date) return false;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;
  
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
}
