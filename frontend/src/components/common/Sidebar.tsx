import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  AcademicCapIcon,
  BellIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  CalendarIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  HomeIcon,
  PowerIcon,
  ScaleIcon,
  TruckIcon,
  UserGroupIcon,
  UsersIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import {
  PRIVILEGE_ROLES,
  ROLE_LABELS,
  canAccess,
  type Role,
} from "../../utils/roles";

const NAV_ITEMS = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: HomeIcon,
    roles: PRIVILEGE_ROLES.dashboard,
  },
  {
    name: "Properties",
    href: "/properties",
    icon: BuildingOffice2Icon,
    roles: PRIVILEGE_ROLES.propertiesView,
  },
  {
    name: "Lands",
    href: "/lands",
    icon: ScaleIcon,
    roles: PRIVILEGE_ROLES.propertiesManage,
  },
  {
    name: "Vehicles",
    href: "/vehicles",
    icon: TruckIcon,
    roles: PRIVILEGE_ROLES.vehiclesView,
  },
  {
    name: "Contracts",
    href: "/contracts",
    icon: DocumentTextIcon,
    roles: PRIVILEGE_ROLES.contractsView,
  },
  {
    name: "Rentals",
    href: "/rentals",
    icon: HomeIcon,
    roles: PRIVILEGE_ROLES.propertiesManage,
  },
  {
    name: "Payments",
    href: "/payments",
    icon: CreditCardIcon,
    roles: PRIVILEGE_ROLES.paymentsView,
  },
  {
    name: "Maintenance",
    href: "/maintenance",
    icon: WrenchScrewdriverIcon,
    roles: PRIVILEGE_ROLES.maintenanceView,
  },
  {
    name: "Inspections",
    href: "/inspections",
    icon: ClipboardDocumentListIcon,
    roles: PRIVILEGE_ROLES.inspectionsView,
  },
  {
    name: "Power of Attorney",
    href: "/poa",
    icon: PowerIcon,
    roles: PRIVILEGE_ROLES.poaView,
  },
  {
    name: "Employees",
    href: "/employees",
    icon: UserGroupIcon,
    roles: PRIVILEGE_ROLES.employeesView,
  },
  {
    name: "Salaries",
    href: "/salaries",
    icon: CurrencyDollarIcon,
    roles: PRIVILEGE_ROLES.salariesView,
  },
  {
    name: "Attendances",
    href: "/attendances",
    icon: CalendarDaysIcon,
    roles: PRIVILEGE_ROLES.attendancesView,
  },
  {
    name: "Users",
    href: "/users",
    icon: UsersIcon,
    roles: PRIVILEGE_ROLES.usersView,
  },
  {
    name: "Reports",
    href: "/sales",
    icon: ChartBarIcon,
    roles: PRIVILEGE_ROLES.reportsView,
  },
  {
    name: "Audit Logs",
    href: "/audit-logs",
    icon: ClipboardDocumentListIcon,
    roles: PRIVILEGE_ROLES.auditLogs,
  },
  {
    name: "Calendar",
    href: "/calendar",
    icon: CalendarIcon,
    roles: PRIVILEGE_ROLES.dashboard,
  },
  {
    name: "Skills",
    href: "/skills",
    icon: AcademicCapIcon,
    roles: ["SYSTEM_ADMIN"] as Role[],
  },
  {
    name: "Chat",
    href: "/chat",
    icon: ChatBubbleLeftRightIcon,
    roles: PRIVILEGE_ROLES.chat,
  },
  {
    name: "Notifications",
    href: "/notifications",
    icon: BellIcon,
    roles: PRIVILEGE_ROLES.notifications,
  },
];

export default function Sidebar() {
  const { user } = useAuth();
  const role = (user?.role || "TENANT") as Role;
  const navItems = NAV_ITEMS.filter((item) => canAccess(role, item.roles));
  const initials =
    user?.firstName || user?.lastName
      ? `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`
      : "PM";

  return (
    <aside className="w-20 flex-shrink-0 overflow-y-auto border-r border-[#e7dcc8] bg-[#0f172a] text-white shadow-[0_25px_60px_rgba(15,23,42,0.18)] lg:w-72">
      <div className="sticky top-0 z-10 border-b border-white/10 bg-[#0f172a]/95 p-5 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#d6b77d] to-[#8a6730] text-sm font-black text-[#0f172a] shadow-lg shadow-[#b98d46]/20">
            PM
          </div>
          <div className="min-w-0">
            <h1 className="hidden truncate text-lg font-black tracking-wide lg:block">
              EstateFlow
            </h1>
            <p className="mt-0.5 hidden truncate text-xs font-medium text-slate-400 lg:block">
              {ROLE_LABELS[role]}
            </p>
          </div>
        </div>
        <div className="mt-5 hidden rounded-xl border border-white/10 bg-white/[0.04] p-3 lg:block">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#d6b77d]/20 text-xs font-bold text-[#f7e7c6]">
              {initials.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {user?.firstName || "Property"} {user?.lastName || "User"}
              </p>
              <p className="truncate text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
      <nav className="space-y-1.5 p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                isActive
                  ? "bg-white text-slate-950 shadow-lg shadow-[#b98d46]/20"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#d6b77d]/10 text-[#f7e7c6] transition group-hover:bg-[#d6b77d]/15 group-hover:text-white">
              <item.icon className="h-5 w-5" />
            </span>
            <span className="hidden truncate lg:block">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
