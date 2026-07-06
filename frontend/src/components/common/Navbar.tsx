import { useAuth } from "../../hooks/useAuth";
import { BellIcon, UserCircleIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Welcome back, {user?.firstName || "User"}!
        </h2>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-lg hover:bg-gray-100 relative">
          <BellIcon className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center space-x-2">
          <UserCircleIcon className="w-8 h-8 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">
            {user?.firstName} {user?.lastName}
          </span>
        </div>
        <button
          onClick={logout}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
