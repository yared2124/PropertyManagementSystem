export const getWelcomeTemplate = (name) => `
  <h1>Welcome ${name}!</h1>
  <p>Thank you for registering on our Property Management System.</p>
  <p>Please verify your email by clicking the link below:</p>
  <a href="${process.env.FRONTEND_URL}/verify?token=...">Verify Email</a>
`;

export const getPaymentConfirmationTemplate = (payment, contract) => `
  <h1>Payment Confirmation</h1>
  <p>Your payment of SAR ${payment.amount} has been received.</p>
  <p>Contract: ${contract.title} (${contract.contractNumber})</p>
  <p>Date: ${new Date(payment.paymentDate).toLocaleDateString()}</p>
  <p>Thank you.</p>
`;

export const getContractExpiryTemplate = (contract, daysLeft) => `
  <h1>Contract Expiry Reminder</h1>
  <p>Your contract ${contract.contractNumber} will expire in ${daysLeft} days.</p>
  <p>Please contact your landlord to renew.</p>
`;
