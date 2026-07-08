export const formatCurrency = (amount: number) =>
  `SAR ${amount.toLocaleString()}`;
export const formatDate = (date: string) => new Date(date).toLocaleDateString();
