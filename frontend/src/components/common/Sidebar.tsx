import { NavLink } from "react-router-dom";
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
} from "@heroicons/react/24/outline";

const navigation = [
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
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">PROPERTYMANAGER</h1>
      </div>
      <nav className="p-4 space-y-1">
        {navigation.map((item) => (
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
