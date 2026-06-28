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
  return `
    <h1>Welcome ${name}!</h1>
    <p>Thank you for joining our Property Management System.</p>
    <p>We're excited to have you on board.</p>
  `;
};

/**
 * Get a payment confirmation email template.
 * @param {Object} payment - Payment data.
 * @param {Object} contract - Contract data.
 * @returns {string} HTML content.
 */
export const getPaymentConfirmationTemplate = (payment, contract) => {
  return `
    <h1>Payment Confirmation</h1>
    <p>Your payment of ${payment.amount} has been received.</p>
    <p>Contract: ${contract.title}</p>
    <p>Payment Date: ${new Date(payment.paymentDate).toLocaleDateString()}</p>
  `;
};

/**
 * Get a contract expiry reminder email template.
 * @param {Object} contract - Contract data.
 * @param {number} daysRemaining - Days until expiry.
 * @returns {string} HTML content.
 */
export const getContractExpiryTemplate = (contract, daysRemaining) => {
  return `
    <h1>Contract Expiry Reminder</h1>
    <p>Your contract ${contract.contractNumber} will expire in ${daysRemaining} days.</p>
    <p>Please contact your landlord to renew.</p>
  `;
};

/**
 * Get a password reset email template.
 * @param {string} resetLink - Password reset link.
 * @returns {string} HTML content.
 */
export const getPasswordResetTemplate = (resetLink) => {
  return `
    <h1>Password Reset Request</h1>
    <p>Click the link below to reset your password:</p>
    <a href="${resetLink}">Reset Password</a>
    <p>This link expires in 1 hour.</p>
  `;
};
