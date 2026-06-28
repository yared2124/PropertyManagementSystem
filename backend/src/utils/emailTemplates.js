/**
 * HTML email templates.
 * Used for sending notifications via Nodemailer.
 */

/**
 * Get a welcome email template.
 * @param {string} name - User's full name.
 * @returns {string} HTML content.
 */
export const getWelcomeTemplate = (name) => {
  return `<h1>Welcome ${name}</h1><p>Thank you for joining our Property Management System.</p>`;
};
