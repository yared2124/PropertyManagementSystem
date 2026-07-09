import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  HomeIcon,
  BuildingOffice2Icon,
  TruckIcon,
  DocumentTextIcon,
  CreditCardIcon,
  WrenchScrewdriverIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  UsersIcon,
  CalendarIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ScaleIcon,
  PowerIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.role || "TENANT";

  // ============================================
  // Role‑based navigation items
  // ============================================
  const navigation: Record<string, any[]> = {
    SYSTEM_ADMIN: [
      { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
      { name: "Properties", href: "/properties", icon: BuildingOffice2Icon },
      { name: "Lands", href: "/lands", icon: ScaleIcon },
      { name: "Vehicles", href: "/vehicles", icon: TruckIcon },
      { name: "Contracts", href: "/contracts", icon: DocumentTextIcon },
      { name: "Rentals", href: "/rentals", icon: HomeIcon },
      { name: "Payments", href: "/payments", icon: CreditCardIcon },
      { name: "Employees", href: "/employees", icon: UserGroupIcon },
      { name: "Salaries", href: "/salaries", icon: CurrencyDollarIcon },
      { name: "Attendances", href: "/attendances", icon: CalendarDaysIcon },
      { name: "Chat", href: "/chat", icon: ChatBubbleLeftRightIcon },
      { name: "Notifications", href: "/notifications", icon: BellIcon },
      { name: "Users", href: "/users", icon: UsersIcon },
      { name: "Calendar", href: "/calendar", icon: CalendarIcon },
      { name: "Skills", href: "/skills", icon: AcademicCapIcon },
      { name: "Sales", href: "/sales", icon: ChartBarIcon },
      { name: "Power of Attorney", href: "/poa", icon: PowerIcon },
      {
        name: "Audit Logs",
        href: "/audit-logs",
        icon: ClipboardDocumentListIcon,
      },
    ],
    PROPERTY_MANAGER: [
      { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
      { name: "Properties", href: "/properties", icon: BuildingOffice2Icon },
      { name: "Vehicles", href: "/vehicles", icon: TruckIcon },
      { name: "Contracts", href: "/contracts", icon: DocumentTextIcon },
      { name: "Rentals", href: "/rentals", icon: HomeIcon },
      { name: "Payments", href: "/payments", icon: CreditCardIcon },
      {
        name: "Maintenance",
        href: "/maintenance",
        icon: WrenchScrewdriverIcon,
      },
      {
        name: "Inspections",
        href: "/inspections",
        icon: ClipboardDocumentListIcon,
      },
      { name: "Notifications", href: "/notifications", icon: BellIcon },
      { name: "Chat", href: "/chat", icon: ChatBubbleLeftRightIcon },
      { name: "Power of Attorney", href: "/poa", icon: PowerIcon },
      { name: "Calendar", href: "/calendar", icon: CalendarIcon },
    ],
    TENANT: [
      { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
      { name: "Contracts", href: "/contracts", icon: DocumentTextIcon },
      { name: "Payments", href: "/payments", icon: CreditCardIcon },
      {
        name: "Maintenance",
        href: "/maintenance",
        icon: WrenchScrewdriverIcon,
      },
      { name: "Chat", href: "/chat", icon: ChatBubbleLeftRightIcon },
      { name: "Notifications", href: "/notifications", icon: BellIcon },
    ],
    LANDLORD: [
      { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
      { name: "Properties", href: "/properties", icon: BuildingOffice2Icon },
      { name: "Contracts", href: "/contracts", icon: DocumentTextIcon },
      { name: "Payments", href: "/payments", icon: CreditCardIcon },
      { name: "Chat", href: "/chat", icon: ChatBubbleLeftRightIcon },
      { name: "Notifications", href: "/notifications", icon: BellIcon },
    ],
    ACCOUNTANT: [
      { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
      { name: "Payments", href: "/payments", icon: CreditCardIcon },
      { name: "Reports", href: "/reports", icon: ChartBarIcon },
      { name: "Notifications", href: "/notifications", icon: BellIcon },
    ],
    LEGAL_ADMIN: [
      { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
      { name: "Power of Attorney", href: "/poa", icon: PowerIcon },
      { name: "Contracts", href: "/contracts", icon: DocumentTextIcon },
      {
        name: "Documents",
        href: "/documents",
        icon: ClipboardDocumentListIcon,
      },
      { name: "Notifications", href: "/notifications", icon: BellIcon },
    ],
  };

  const navItems = navigation[role] || navigation.TENANT;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">PROPERTYMANAGER</h1>
        <p className="text-xs text-gray-500 mt-1">{role.replace("_", " ")}</p>
      </div>
      <nav className="p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
