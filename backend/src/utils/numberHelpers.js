/**
 * Number and currency formatting helpers.
 */

import { differenceInMonths } from "./dateHelpers.js";

/**
 * Format a number as currency (SAR by default).
 * @param {number} amount - The amount.
 * @param {string} currency - Currency symbol (default 'SAR').
 * @returns {string} Formatted currency string.
 */
export const formatCurrency = (amount, currency = "SAR") => {
  return `${currency} ${Number(amount).toFixed(2)}`;
};

/**
 * Calculate total contract value from monthly rent and date range.
 * @param {number} monthlyRent - Monthly rent amount.
 * @param {Date} startDate - Contract start date.
 * @param {Date} endDate - Contract end date.
 * @returns {number} Total contract value.
 */
export const calculateTotal = (monthlyRent, startDate, endDate) => {
  const months = differenceInMonths(startDate, endDate);
  return monthlyRent * months;
};
