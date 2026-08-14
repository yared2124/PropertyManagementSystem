import { useAuth } from "../../hooks/useAuth";
import {
  ArrowRightOnRectangleIcon,
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

export default function Navbar() {
  const { user, logout } = useAuth();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <header className="border-b border-[#e9e0d0] bg-white/80 px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.03)] backdrop-blur-xl sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a6730]">
            {today}
          </p>
          <h2 className="truncate text-lg font-bold text-slate-950">
            Welcome back, {user?.firstName || "User"}
          </h2>
        </div>
        <div className="hidden w-full max-w-sm items-center gap-2 rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-3 py-2 text-sm text-slate-500 xl:flex">
          <MagnifyingGlassIcon className="h-5 w-5 text-[#c9a96d]" />
          <span>Search properties, contracts, payments</span>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#d9c7a2] bg-[#f9f1e2] text-[#8a6730] shadow-sm transition hover:border-[#c9a96d] hover:bg-[#f0e4d0]">
            <BellIcon className="h-5 w-5" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>
          <div className="hidden items-center gap-2 rounded-xl border border-[#e7dcc8] bg-white px-3 py-2 shadow-sm sm:flex">
            <UserCircleIcon className="h-7 w-7 text-[#8a6730]" />
            <span className="max-w-36 truncate text-sm font-semibold text-slate-700">
              {user?.firstName} {user?.lastName}
            </span>
          </div>
          <button
            onClick={logout}
            className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0f172a] px-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(24,32,48,0.18)] transition hover:bg-[#1b2c3d] sm:px-4"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
