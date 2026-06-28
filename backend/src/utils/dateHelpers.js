/**
 * Date manipulation and formatting helpers.
 */

/**
 * Format a date to a readable string (e.g., "Jan 1, 2024").
 * @param {Date|string} date - The date to format.
 * @returns {string} Formatted date string.
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Add a number of days to a given date.
 * @param {Date} date - The starting date.
 * @param {number} days - Number of days to add.
 * @returns {Date} New date.
 */
export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Calculate the number of full months between two dates.
 * @param {Date} start - Start date.
 * @param {Date} end - End date.
 * @returns {number} Number of months (minimum 1).
 */
export const differenceInMonths = (start, end) => {
  const diff = (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24 * 30);
  return Math.max(1, Math.round(diff));
};

/**
 * Generate a unique contract number.
 * @returns {string} Contract number in format 'CT-YYYY-XXXX'.
 */
export const generateContractNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `CT-${year}-${random}`;
};
