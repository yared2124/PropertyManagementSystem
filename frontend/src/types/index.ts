// === User ===
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role:
    | "SYSTEM_ADMIN"
    | "PROPERTY_MANAGER"
    | "TENANT"
    | "LANDLORD"
    | "ACCOUNTANT"
    | "LEGAL_ADMIN";
}

// === Property ===
export interface Property {
  id: string;
  title: string;
  assetType: "APARTMENT" | "OFFICE" | "VILLA" | "WAREHOUSE" | "LAND";
  status: "AVAILABLE" | "RENTED" | "UNDER_MAINTENANCE";
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  address: string;
  city: string;
  marketValue: number;
  rentalRate: number;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

// === Vehicle ===
export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  licensePlate: string;
  dailyRate: number;
  monthlyRate: number;
  purchasePrice: number;
  status: "AVAILABLE" | "RENTED" | "UNDER_MAINTENANCE";
}

// === Contract ===
export interface Contract {
  id: string;
  contractNumber: string;
  title: string;
  status: "DRAFT" | "ACTIVE" | "EXPIRED" | "TERMINATED";
  startDate: string;
  endDate: string;
  monthlyRent: number;
  totalAmount: number;
  assetType: "PROPERTY" | "VEHICLE" | "LAND";
  assetId: string;
  tenantId: string;
  landlordId: string;
}

// === Payment ===
export interface Payment {
  id: string;
  paymentNumber: string;
  contractId: string;
  amount: number;
  method:
    | "BANK_TRANSFER"
    | "ONLINE_PAYMENT"
    | "CASH"
    | "CHECK"
    | "CREDIT_CARD"
    | "DEBIT_CARD"
    | "WALLET"
    | "INSTALLMENT";
  status: "PENDING" | "PAID" | "OVERDUE" | "REFUNDED";
  paymentDate: string;
  dueDate: string;
}

// === Maintenance ===
export interface Maintenance {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT" | "CRITICAL";
  status: "REPORTED" | "APPROVED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  assetType: "PROPERTY" | "VEHICLE" | "LAND";
  assetId: string;
  estimatedCost?: number;
}

// === POA ===
export interface POA {
  id: string;
  poaNumber: string;
  title: string;
  scope: "FULL" | "LIMITED" | "SPECIFIC";
  status: "ACTIVE" | "EXPIRED" | "REVOKED" | "PENDING_APPROVAL";
  startDate: string;
  endDate: string;
  grantorId: string;
  granteeId: string;
  assetType: "PROPERTY" | "VEHICLE" | "LAND";
  assetId: string;
  notaryName?: string;
  notaryNumber?: string;
  documentUrl?: string;
}

// === Dashboard ===
export interface DashboardMetrics {
  totalAssets: number;
  activeContracts: number;
  pendingMaintenance: number;
  totalPaid: number;
  totalOwed: number;
}
