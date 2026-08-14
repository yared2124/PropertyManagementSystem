import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export const Layout = () => {
  return (
    <div className="flex h-screen bg-[#f7f3ee] text-slate-950">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,rgba(214,183,125,0.10),transparent_24rem),linear-gradient(135deg,#f8f5f0_0%,#f3efe8_42%,#f7f3ee_100%)] p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
