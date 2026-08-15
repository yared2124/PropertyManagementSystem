import type { User } from "../types";

export type Role = User["role"];

export const ALL_ROLES: Role[] = [
  "SYSTEM_ADMIN",
  "PROPERTY_MANAGER",
  "TENANT",
  "LANDLORD",
  "ACCOUNTANT",
  "LEGAL_ADMIN",
];

export const ROLE_LABELS: Record<Role, string> = {
  SYSTEM_ADMIN: "System Administrator",
  PROPERTY_MANAGER: "Property Manager",
  TENANT: "Tenant",
  LANDLORD: "Landlord",
  ACCOUNTANT: "Accountant",
  LEGAL_ADMIN: "Legal Administrator",
};

export const PRIVILEGE_ROLES = {
  dashboard: ["SYSTEM_ADMIN", "PROPERTY_MANAGER", "TENANT", "LANDLORD", "ACCOUNTANT", "LEGAL_ADMIN"] as Role[],
  propertiesView: ["SYSTEM_ADMIN", "PROPERTY_MANAGER", "LANDLORD"] as Role[],
  propertiesManage: ["SYSTEM_ADMIN", "PROPERTY_MANAGER"] as Role[],
  vehiclesView: ["SYSTEM_ADMIN", "PROPERTY_MANAGER"] as Role[],
  contractsView: ["SYSTEM_ADMIN", "PROPERTY_MANAGER", "TENANT", "LANDLORD", "LEGAL_ADMIN"] as Role[],
  paymentsView: ["SYSTEM_ADMIN", "PROPERTY_MANAGER", "TENANT", "LANDLORD", "ACCOUNTANT"] as Role[],
  maintenanceView: ["SYSTEM_ADMIN", "PROPERTY_MANAGER", "TENANT", "LANDLORD"] as Role[],
  inspectionsView: ["SYSTEM_ADMIN", "PROPERTY_MANAGER"] as Role[],
  poaView: ["SYSTEM_ADMIN", "PROPERTY_MANAGER", "LEGAL_ADMIN"] as Role[],
  employeesView: ["SYSTEM_ADMIN"] as Role[],
  salariesView: ["SYSTEM_ADMIN", "ACCOUNTANT"] as Role[],
  attendancesView: ["SYSTEM_ADMIN"] as Role[],
  usersView: ["SYSTEM_ADMIN"] as Role[],
  reportsView: ["SYSTEM_ADMIN", "ACCOUNTANT"] as Role[],
  auditLogs: ["SYSTEM_ADMIN"] as Role[],
  chat: ["SYSTEM_ADMIN", "PROPERTY_MANAGER", "TENANT", "LANDLORD", "ACCOUNTANT", "LEGAL_ADMIN"] as Role[],
  notifications: ["SYSTEM_ADMIN", "PROPERTY_MANAGER", "TENANT", "LANDLORD", "ACCOUNTANT", "LEGAL_ADMIN"] as Role[],
}; 

export const canAccess = (role: Role | undefined, allowedRoles: Role[]) =>
  Boolean(role && allowedRoles.includes(role));
