import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { DashboardMetrics } from "../types";
import MetricCard from "../components/dashboard/MetricCard";
import RevenueChart from "../components/dashboard/RevenueChart";
import RecentActivity from "../components/dashboard/RecentActivity";
import api from "../api/client";
import { PRIVILEGE_ROLES, canAccess, type Role } from "../utils/roles";
import {
  ArrowDownTrayIcon,
  ArrowRightIcon,
  BuildingOffice2Icon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  CreditCardIcon,
  DocumentTextIcon,
  HomeModernIcon,
  PlusIcon,
  ScaleIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";

const panelClass =
  "rounded-2xl border border-[#eae0d0] bg-white p-5 shadow-[0_8px_24px_rgba(148,117,64,0.05)] sm:p-6";

const formatCurrency = (value?: number) =>
  `SAR ${(value || 0).toLocaleString()}`;

const getList = async (path: string) => {
  try {
    const { data } = await api.get(path);
    return data.data || [];
  } catch (error) {
    console.error(`Failed to fetch ${path}`, error);
    return [];
  }
};

function SectionHeader({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <h3 className="text-base font-bold text-slate-950">{title}</h3>
      {action}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-8 text-center text-sm font-medium text-slate-500">
      {message}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const isPositive = status === "ACTIVE" || status === "COMPLETED";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
        isPositive
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
          : "bg-amber-50 text-amber-700 ring-1 ring-amber-100"
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

function QuickAction({
  to,
  label,
  icon: Icon,
  tone,
}: {
  to: string;
  label: string;
  icon: any;
  tone: string;
}) {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between rounded-xl border border-[#d9c7a2] bg-[#f9f5ef] px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-[#c9a96d] hover:bg-[#f0e4d0] hover:text-[#8a6730] hover:shadow-md"
    >
      <span className="flex min-w-0 items-center gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}
        >
          <Icon className="h-5 w-5" />
        </span>
        <span className="truncate">{label}</span>
      </span>
      <ArrowRightIcon className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-cyan-700" />
    </Link>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [tenantData, setTenantData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const role = user?.role as Role | undefined;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (
          ["SYSTEM_ADMIN", "PROPERTY_MANAGER", "ACCOUNTANT"].includes(
            role || "",
          )
        ) {
          const { data } = await api.get("/dashboard/overview");
          setMetrics(data.data);
        } else if (role === "TENANT" || role === "LANDLORD") {
          const [
            allContracts,
            allPayments,
            allMaintenance,
            allProperties,
            allVehicles,
            inspections,
          ] = await Promise.all([
            getList("/contracts"),
            getList("/payments"),
            getList("/maintenance"),
            getList("/properties"),
            getList("/vehicles"),
            role === "LANDLORD" ? getList("/inspections") : Promise.resolve([]),
          ]);
          const contracts =
            role === "TENANT"
              ? allContracts.filter(
                  (contract: any) => contract.tenantId === user?.id,
                )
              : allContracts.filter(
                  (contract: any) => contract.landlordId === user?.id,
                );
          const contractIds = new Set(
            contracts.map((contract: any) => contract.id),
          );
          const properties =
            role === "LANDLORD"
              ? allProperties.filter(
                  (property: any) => property.ownerId === user?.id,
                )
              : allProperties;
          const vehicles =
            role === "LANDLORD"
              ? allVehicles.filter(
                  (vehicle: any) => vehicle.ownerId === user?.id,
                )
              : allVehicles;
          const assetIds = new Set([
            ...properties.map((property: any) => property.id),
            ...vehicles.map((vehicle: any) => vehicle.id),
          ]);
          const payments = allPayments.filter((payment: any) =>
            contractIds.has(payment.contractId),
          );
          const maintenance =
            role === "TENANT"
              ? allMaintenance.filter(
                  (request: any) => request.reportedById === user?.id,
                )
              : allMaintenance.filter((request: any) =>
                  assetIds.has(request.assetId),
                );
          setTenantData({
            contracts,
            payments,
            maintenance,
            properties,
            vehicles,
            inspections,
          });
        } else if (role === "LEGAL_ADMIN") {
          const [contracts, poa] = await Promise.all([
            getList("/contracts"),
            getList("/poa"),
          ]);
          setTenantData({
            contracts,
            poa,
          });
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [role, user?.id]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="rounded-2xl border border-white/80 bg-white/90 px-6 py-5 text-sm font-semibold text-slate-600 shadow-xl shadow-slate-200/70">
          Loading dashboard...
        </div>
      </div>
    );
  }

  // ============================================
  // SYSTEM ADMIN DASHBOARD – Full Access
  // ============================================
  if (role === "SYSTEM_ADMIN") {
    const cards = [
      {
        title: "Total Assets",
        value: metrics?.totalAssets || 0,
        icon: BuildingOffice2Icon,
        color: "blue" as const,
      },
      {
        title: "Active Contracts",
        value: metrics?.activeContracts || 0,
        icon: DocumentTextIcon,
        color: "green" as const,
      },
      {
        title: "Pending Maintenance",
        value: metrics?.pendingMaintenance || 0,
        icon: WrenchScrewdriverIcon,
        color: "yellow" as const,
      },
      {
        title: "Total Paid",
        value: formatCurrency(metrics?.totalPaid),
        icon: CreditCardIcon,
        color: "purple" as const,
      },
    ];

    return (
      <div className="space-y-6">
        <div className="overflow-hidden rounded-[28px] border border-[#e8dfd1] bg-gradient-to-br from-[#f8f5f0] via-white to-[#f3efe8]">
          <div className="relative px-6 py-7 text-white bg-gradient-to-r from-[#0f172a] via-[#182334] to-[#1a2d3f] sm:px-8 lg:px-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(201,169,109,0.15),transparent_18rem),radial-gradient(circle_at_92%_5%,rgba(185,141,70,0.12),transparent_20rem)]" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#d6b77d]">
                  System administration
                </p>
                <h1 className="mt-3 text-3xl font-bold tracking-normal sm:text-4xl">
                  Admin Dashboard
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200">
                  Full system overview – assets, contracts, maintenance, and
                  financial performance.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
                    <p className="text-xs text-slate-300">Assets</p>
                    <p className="mt-1 text-xl font-black">
                      {metrics?.totalAssets || 0}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur">
                    <p className="text-xs text-slate-300">Contracts</p>
                    <p className="mt-1 text-xl font-black">
                      {metrics?.activeContracts || 0}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur">
                    <p className="text-xs text-slate-300">Maintenance</p>
                    <p className="mt-1 text-xl font-black">
                      {metrics?.pendingMaintenance || 0}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur">
                    <p className="text-xs text-slate-300">Paid</p>
                    <p className="mt-1 truncate text-xl font-black">
                      {formatCurrency(metrics?.totalPaid)}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate("/sales")}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d6b77d] to-[#c9a96d] px-4 py-3 text-sm font-bold text-[#0f172a] shadow-lg shadow-[#b98d46]/30 transition hover:-translate-y-0.5 hover:brightness-110 sm:w-auto"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                Download Report
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <MetricCard key={card.title} {...card} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className={`${panelClass} xl:col-span-2`}>
            <SectionHeader title="Revenue Overview" />
            <RevenueChart />
          </div>

          <div className={panelClass}>
            <SectionHeader title="Quick Actions" />
            <div className="space-y-3">
              <QuickAction
                to="/properties/new"
                label="New Property"
                icon={PlusIcon}
                tone="bg-blue-50 text-blue-600"
              />
              <QuickAction
                to="/contracts/new"
                label="New Contract"
                icon={DocumentTextIcon}
                tone="bg-emerald-50 text-emerald-600"
              />
              <QuickAction
                to="/maintenance/new"
                label="Report Maintenance"
                icon={WrenchScrewdriverIcon}
                tone="bg-amber-50 text-amber-600"
              />
              <QuickAction
                to="/users"
                label="Manage Users"
                icon={ClipboardDocumentListIcon}
                tone="bg-violet-50 text-violet-600"
              />
              <button
                onClick={() => navigate("/sales")}
                className="group flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-left text-sm font-medium text-gray-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                    <ChartBarIcon className="h-5 w-5" />
                  </span>
                  <span className="truncate">View Reports</span>
                </span>
                <ArrowRightIcon className="h-4 w-4 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-violet-600" />
              </button>
            </div>
          </div>
        </div>

        <div className={panelClass}>
          <SectionHeader title="Recent Activity" />
          <RecentActivity />
        </div>
      </div>
    );
  }

  // ============================================
  // PROPERTY MANAGER DASHBOARD – Operations Focus
  // ============================================
  if (role === "PROPERTY_MANAGER") {
    const cards = [
      {
        title: "Total Assets",
        value: metrics?.totalAssets || 0,
        icon: BuildingOffice2Icon,
        color: "blue" as const,
      },
      {
        title: "Active Contracts",
        value: metrics?.activeContracts || 0,
        icon: DocumentTextIcon,
        color: "green" as const,
      },
      {
        title: "Pending Maintenance",
        value: metrics?.pendingMaintenance || 0,
        icon: WrenchScrewdriverIcon,
        color: "yellow" as const,
      },
      {
        title: "Total Paid",
        value: formatCurrency(metrics?.totalPaid),
        icon: CreditCardIcon,
        color: "purple" as const,
      },
    ];

    return (
      <div className="space-y-6">
        <div className="overflow-hidden rounded-[28px] border border-[#e8dfd1] bg-gradient-to-br from-[#f8f5f0] via-white to-[#f3efe8]">
          <div className="relative px-6 py-7 text-white bg-gradient-to-r from-[#0f172a] via-[#182334] to-[#1a2d3f] sm:px-8 lg:px-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(201,169,109,0.15),transparent_18rem),radial-gradient(circle_at_92%_5%,rgba(185,141,70,0.12),transparent_20rem)]" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#d6b77d]">
                  Property operations
                </p>
                <h1 className="mt-3 text-3xl font-bold tracking-normal sm:text-4xl">
                  Manager Dashboard
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200">
                  Operational view of properties, contracts, maintenance, and
                  payments.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
                    <p className="text-xs text-slate-300">Properties</p>
                    <p className="mt-1 text-xl font-black">
                      {metrics?.totalAssets || 0}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur">
                    <p className="text-xs text-slate-300">Contracts</p>
                    <p className="mt-1 text-xl font-black">
                      {metrics?.activeContracts || 0}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur">
                    <p className="text-xs text-slate-300">Maintenance</p>
                    <p className="mt-1 text-xl font-black">
                      {metrics?.pendingMaintenance || 0}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur">
                    <p className="text-xs text-slate-300">Revenue</p>
                    <p className="mt-1 truncate text-xl font-black">
                      {formatCurrency(metrics?.totalPaid)}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate("/sales")}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d6b77d] to-[#c9a96d] px-4 py-3 text-sm font-bold text-[#0f172a] shadow-lg shadow-[#b98d46]/30 transition hover:-translate-y-0.5 hover:brightness-110 sm:w-auto"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                View Reports
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <MetricCard key={card.title} {...card} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className={`${panelClass} xl:col-span-2`}>
            <SectionHeader title="Revenue Overview" />
            <RevenueChart />
          </div>

          <div className={panelClass}>
            <SectionHeader title="Quick Actions" />
            <div className="space-y-3">
              <QuickAction
                to="/properties/new"
                label="New Property"
                icon={PlusIcon}
                tone="bg-blue-50 text-blue-600"
              />
              <QuickAction
                to="/contracts/new"
                label="New Contract"
                icon={DocumentTextIcon}
                tone="bg-emerald-50 text-emerald-600"
              />
              <QuickAction
                to="/maintenance/new"
                label="Report Maintenance"
                icon={WrenchScrewdriverIcon}
                tone="bg-amber-50 text-amber-600"
              />
              <button
                onClick={() => navigate("/maintenance")}
                className="group flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-left text-sm font-medium text-gray-700 shadow-sm transition hover:border-yellow-200 hover:bg-yellow-50 hover:text-yellow-700"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-yellow-50 text-yellow-600">
                    <WrenchScrewdriverIcon className="h-5 w-5" />
                  </span>
                  <span className="truncate">View Maintenance</span>
                </span>
                <ArrowRightIcon className="h-4 w-4 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-yellow-600" />
              </button>
            </div>
          </div>
        </div>

        <div className={panelClass}>
          <SectionHeader title="Recent Activity" />
          <RecentActivity />
        </div>
      </div>
    );
  }

  // ============================================
  // ACCOUNTANT DASHBOARD – Financial Focus
  // ============================================
  if (role === "ACCOUNTANT") {
    const cards = [
      {
        title: "Total Paid",
        value: formatCurrency(metrics?.totalPaid),
        icon: CreditCardIcon,
        color: "green" as const,
      },
      {
        title: "Outstanding",
        value: formatCurrency(metrics?.totalOwed),
        icon: ChartBarIcon,
        color: "yellow" as const,
      },
      {
        title: "Active Contracts",
        value: metrics?.activeContracts || 0,
        icon: DocumentTextIcon,
        color: "blue" as const,
      },
      {
        title: "Assets Billed",
        value: metrics?.totalAssets || 0,
        icon: BuildingOffice2Icon,
        color: "purple" as const,
      },
    ];

    return (
      <div className="space-y-6">
        <div className="overflow-hidden rounded-[28px] border border-[#e8dfd1] bg-gradient-to-br from-[#f8f5f0] via-white to-[#f3efe8]">
          <div className="relative px-6 py-7 text-white bg-gradient-to-r from-[#0f172a] via-[#182334] to-[#1a2d3f] sm:px-8 lg:px-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(201,169,109,0.15),transparent_18rem),radial-gradient(circle_at_92%_5%,rgba(185,141,70,0.12),transparent_20rem)]" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#d6b77d]">
                  Financial operations
                </p>
                <h1 className="mt-3 text-3xl font-bold tracking-normal sm:text-4xl">
                  Financial Command Center
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200">
                  Revenue, outstanding balances, invoices, and financial reports
                  for clear payment control.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
                    <p className="text-xs text-slate-300">Paid</p>
                    <p className="mt-1 text-xl font-black">
                      {formatCurrency(metrics?.totalPaid)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur">
                    <p className="text-xs text-slate-300">Contracts</p>
                    <p className="mt-1 text-xl font-black">
                      {metrics?.activeContracts || 0}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur">
                    <p className="text-xs text-slate-300">Outstanding</p>
                    <p className="mt-1 text-xl font-black">
                      {formatCurrency(metrics?.totalOwed)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur">
                    <p className="text-xs text-slate-300">Assets</p>
                    <p className="mt-1 truncate text-xl font-black">
                      {metrics?.totalAssets || 0}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate("/sales")}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d6b77d] to-[#c9a96d] px-4 py-3 text-sm font-bold text-[#0f172a] shadow-lg shadow-[#b98d46]/30 transition hover:-translate-y-0.5 hover:brightness-110 sm:w-auto"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                Open Reports
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <MetricCard key={card.title} {...card} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className={`${panelClass} xl:col-span-2`}>
            <SectionHeader title="Revenue Overview" />
            <RevenueChart />
          </div>

          <div className={panelClass}>
            <SectionHeader title="Quick Actions" />
            <div className="space-y-3">
              <QuickAction
                to="/payments"
                label="Process Payment"
                icon={CreditCardIcon}
                tone="bg-emerald-50 text-emerald-600"
              />
              <button
                onClick={() => navigate("/sales")}
                className="group flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 text-left text-sm font-medium text-gray-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                    <ChartBarIcon className="h-5 w-5" />
                  </span>
                  <span className="truncate">View Reports</span>
                </span>
                <ArrowRightIcon className="h-4 w-4 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-violet-600" />
              </button>
            </div>
          </div>
        </div>

        <div className={panelClass}>
          <SectionHeader title="Recent Activity" />
          <RecentActivity />
        </div>
      </div>
    );
  }

  // ============================================
  // TENANT DASHBOARD
  // ============================================
  if (role === "TENANT") {
    const totalContracts = tenantData?.contracts?.length || 0;
    const totalPayments =
      tenantData?.payments
        ?.filter((p: any) => p.status === "PAID")
        .reduce((sum: number, p: any) => sum + p.amount, 0) || 0;
    const pendingMaintenance =
      tenantData?.maintenance?.filter(
        (m: any) => m.status !== "COMPLETED" && m.status !== "CANCELLED",
      ).length || 0;

    return (
      <div className="space-y-6">
        <div className="overflow-hidden rounded-[28px] border border-[#e8dfd1] bg-gradient-to-br from-[#f8f5f0] via-white to-[#f3efe8]">
          <div className="border-b border-[#e9e0d0] bg-gradient-to-r from-[#0f172a] via-[#182334] to-[#1a2d3f] px-6 py-6 text-white sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d6b77d]">
                  Tenant portal
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
                  My Dashboard
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  Payments, contracts, and maintenance in one clear place.
                </p>
              </div>
              <Link
                to="/maintenance/new"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d6b77d] to-[#c9a96d] px-4 py-3 text-sm font-bold text-[#0f172a] shadow-lg shadow-[#b98d46]/30 transition hover:brightness-110"
              >
                <PlusIcon className="h-5 w-5" />
                Request Maintenance
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <MetricCard
            title="My Contracts"
            value={totalContracts}
            icon={DocumentTextIcon}
            color="blue"
          />
          <MetricCard
            title="Total Paid"
            value={formatCurrency(totalPayments)}
            icon={CreditCardIcon}
            color="green"
          />
          <MetricCard
            title="Pending Maintenance"
            value={pendingMaintenance}
            icon={WrenchScrewdriverIcon}
            color="yellow"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className={panelClass}>
            <SectionHeader title="My Recent Payments" />
            {tenantData?.payments?.length === 0 ? (
              <EmptyState message="No payments yet." />
            ) : (
              <div className="divide-y divide-gray-100">
                {tenantData?.payments?.slice(0, 5).map((payment: any) => (
                  <div
                    key={payment.id}
                    className="grid gap-2 py-3 sm:grid-cols-[1fr_auto_auto] sm:items-center"
                  >
                    <span className="min-w-0 truncate text-sm font-semibold text-slate-900">
                      {payment.paymentNumber}
                    </span>
                    <span className="text-sm font-bold text-slate-950">
                      {formatCurrency(payment.amount)}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={panelClass}>
            <SectionHeader title="My Maintenance Requests" />
            {tenantData?.maintenance?.length === 0 ? (
              <EmptyState message="No maintenance requests." />
            ) : (
              <div className="divide-y divide-gray-100">
                {tenantData?.maintenance?.slice(0, 5).map((request: any) => (
                  <div
                    key={request.id}
                    className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="min-w-0 truncate text-sm font-semibold text-slate-900">
                      {request.title}
                    </span>
                    <StatusPill status={request.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={panelClass}>
          <SectionHeader title="My Contracts" />
          {tenantData?.contracts?.length === 0 ? (
            <EmptyState message="No active contracts." />
          ) : (
            <div className="divide-y divide-gray-100">
              {tenantData?.contracts?.slice(0, 5).map((contract: any) => (
                <div
                  key={contract.id}
                  className="grid gap-2 py-3 sm:grid-cols-[1fr_auto_auto] sm:items-center"
                >
                  <span className="min-w-0 truncate text-sm font-semibold text-slate-900">
                    {contract.title}
                  </span>
                  <StatusPill status={contract.status} />
                  <span className="text-sm font-bold text-slate-950">
                    {formatCurrency(contract.monthlyRent)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================
  // LANDLORD DASHBOARD
  // ============================================
  if (role === "LANDLORD") {
    const totalProperties = tenantData?.properties?.length || 0;
    const totalContracts = tenantData?.contracts?.length || 0;
    const totalIncome =
      tenantData?.payments
        ?.filter((p: any) => p.status === "PAID")
        .reduce((sum: number, p: any) => sum + p.amount, 0) || 0;
    const openMaintenance =
      tenantData?.maintenance?.filter(
        (m: any) => m.status !== "COMPLETED" && m.status !== "CANCELLED",
      ).length || 0;

    return (
      <div className="space-y-6">
        <div className="overflow-hidden rounded-[28px] border border-[#e8dfd1] bg-gradient-to-br from-[#f8f5f0] via-white to-[#f3efe8]">
          <div className="border-b border-[#e9e0d0] bg-gradient-to-r from-[#0f172a] via-[#182334] to-[#1a2d3f] px-6 py-6 text-white sm:px-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d6b77d]">
              Landlord portal
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
              Landlord Dashboard
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-200">
              Overview of your properties and rental activity.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="My Properties"
            value={totalProperties}
            icon={BuildingOffice2Icon}
            color="blue"
          />
          <MetricCard
            title="My Contracts"
            value={totalContracts}
            icon={DocumentTextIcon}
            color="green"
          />
          <MetricCard
            title="Rental Income"
            value={formatCurrency(totalIncome)}
            icon={CreditCardIcon}
            color="purple"
          />
          <MetricCard
            title="Open Maintenance"
            value={openMaintenance}
            icon={WrenchScrewdriverIcon}
            color="yellow"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className={panelClass}>
            <SectionHeader title="Property Access" />
            <div className="space-y-3">
              <QuickAction
                to="/properties"
                label="View My Properties"
                icon={BuildingOffice2Icon}
                tone="bg-blue-50 text-blue-600"
              />
              <QuickAction
                to="/contracts"
                label="View Contracts"
                icon={DocumentTextIcon}
                tone="bg-emerald-50 text-emerald-600"
              />
              <QuickAction
                to="/payments"
                label="Rental Income"
                icon={CreditCardIcon}
                tone="bg-violet-50 text-violet-600"
              />
            </div>
          </div>

          <div className={panelClass}>
            <SectionHeader title="Maintenance on My Properties" />
            {tenantData?.maintenance?.length === 0 ? (
              <EmptyState message="No maintenance requests on your properties." />
            ) : (
              <div className="divide-y divide-gray-100">
                {tenantData?.maintenance?.slice(0, 5).map((request: any) => (
                  <div
                    key={request.id}
                    className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="min-w-0 truncate text-sm font-semibold text-slate-900">
                      {request.title}
                    </span>
                    <StatusPill status={request.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // LEGAL ADMIN DASHBOARD
  // ============================================
  if (role === "LEGAL_ADMIN") {
    const legalContracts = tenantData?.contracts?.length || 0;
    const poaRecords = tenantData?.poa?.length || 0;
    const activePoa =
      tenantData?.poa?.filter((poa: any) => poa.status === "ACTIVE").length ||
      0;

    return (
      <div className="space-y-6">
        <div className="overflow-hidden rounded-[28px] border border-[#e8dfd1] bg-gradient-to-br from-[#f8f5f0] via-white to-[#f3efe8]">
          <div className="border-b border-[#e9e0d0] bg-gradient-to-r from-[#0f172a] via-[#182334] to-[#1a2d3f] px-6 py-6 text-white sm:px-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d6b77d]">
              Legal workspace
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
              Legal Dashboard
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-200">
              Manage legal documents, contracts, and power of attorney records.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <MetricCard
            title="POA Records"
            value={poaRecords}
            icon={ScaleIcon}
            color="purple"
          />
          <MetricCard
            title="Active POAs"
            value={activePoa}
            icon={ClipboardDocumentListIcon}
            color="green"
          />
          <MetricCard
            title="Contracts to Review"
            value={legalContracts}
            icon={DocumentTextIcon}
            color="blue"
          />
        </div>

        <div className={panelClass}>
          <SectionHeader title="Legal Actions" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <QuickAction
              to="/poa"
              label="Power of Attorney"
              icon={ScaleIcon}
              tone="bg-violet-50 text-violet-600"
            />
            <QuickAction
              to="/poa/new"
              label="New POA"
              icon={PlusIcon}
              tone="bg-emerald-50 text-emerald-600"
            />
            <QuickAction
              to="/contracts"
              label="Review Contracts"
              icon={ClipboardDocumentListIcon}
              tone="bg-blue-50 text-blue-600"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={panelClass}>
      <div className="flex items-center gap-3 text-slate-600">
        <HomeModernIcon className="h-6 w-6 text-cyan-700" />
        <span>Welcome to the Property Management System.</span>
      </div>
    </div>
  );
}
