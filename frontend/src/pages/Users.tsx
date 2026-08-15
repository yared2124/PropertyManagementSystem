import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import api from "../api/client";
import { User } from "../types";

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/users");
      setUsers(data.data?.users || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle delete/suspend
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  // Format role for display
  const getRoleLabel = (role: string) => {
    const roleMap: Record<string, string> = {
      SYSTEM_ADMIN: "System Admin",
      PROPERTY_MANAGER: "Property Manager",
      TENANT: "Tenant",
      LANDLORD: "Landlord",
      ACCOUNTANT: "Accountant",
      LEGAL_ADMIN: "Legal Admin",
    };
    return roleMap[role] || role;
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.firstName.toLowerCase().includes(search.toLowerCase()) ||
      user.lastName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole ? user.role === filterRole : true;
    return matchSearch && matchRole;
  });

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      {/* Header with Title and Add Button */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users</h1>
          <p className="text-sm text-slate-500">Manage all system users</p>
        </div>
        <button
          onClick={() => navigate("/users/new")}
          className="flex items-center gap-2 rounded-xl border border-[#d9c7a2] bg-[#f9f5ef] px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-[#f4ebdf]"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add User</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] pl-10 pr-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5] md:w-auto"
        >
          <option value="">All Roles</option>
          <option value="SYSTEM_ADMIN">System Admin</option>
          <option value="PROPERTY_MANAGER">Property Manager</option>
          <option value="TENANT">Tenant</option>
          <option value="LANDLORD">Landlord</option>
          <option value="ACCOUNTANT">Accountant</option>
          <option value="LEGAL_ADMIN">Legal Admin</option>
        </select>
      </div>

      {/* Users Table Card */}
      <div className="rounded-2xl border border-[#eae0d0] bg-[#fffdf9] p-5 md:p-6 shadow-[0_8px_24px_rgba(148,117,64,0.06)]">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-[#c9a96d] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-[#efe7dc]">
                <tr className="text-left text-sm font-semibold uppercase tracking-wider text-[#8a6730]">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#efe7dc]">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-slate-500"
                    >
                      No users found. Click "Add User" to create one.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="transition hover:bg-[#f9f5ef]/60"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {user.email}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {getRoleLabel(user.role)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            user.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <Link
                          to={`/users/${user.id}/edit`}
                          className="mr-3 text-[#8a6730] hover:text-[#b98d46] transition"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() =>
                            handleDelete(
                              user.id,
                              `${user.firstName} ${user.lastName}`,
                            )
                          }
                          className="text-rose-600 hover:text-rose-800 transition"
                        >
                          {user.isActive ? "Suspend" : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
