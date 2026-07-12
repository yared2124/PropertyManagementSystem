import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import api from "../api/client";
import { User } from "../types";
import { StatusBadge } from "../components/common/StatusBadge";

// Employee roles – exclude TENANT and LANDLORD
const EMPLOYEE_ROLES = [
  "SYSTEM_ADMIN",
  "PROPERTY_MANAGER",
  "ACCOUNTANT",
  "LEGAL_ADMIN",
];

export default function Employees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");

  // Fetch employees from API
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/users");
      // Filter only employee roles
      const filtered = data.data.filter((user: User) =>
        EMPLOYEE_ROLES.includes(user.role),
      );
      setEmployees(filtered);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Delete handler
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await api.delete(`/users/${id}`);
      // Refresh list after deletion
      fetchEmployees();
    } catch (error) {
      console.error("Failed to delete employee:", error);
      alert("Failed to delete employee. Please try again.");
    }
  };

  // Format role name for display
  const getRoleLabel = (role: string) => {
    const roleMap: Record<string, string> = {
      SYSTEM_ADMIN: "System Admin",
      PROPERTY_MANAGER: "Property Manager",
      ACCOUNTANT: "Accountant",
      LEGAL_ADMIN: "Legal Admin",
    };
    return (
      roleMap[role] ||
      role
        .replace("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (l) => l.toUpperCase())
    );
  };

  // Filter employees based on search and role filter
  const filteredEmployees = employees.filter((emp) => {
    const matchSearch =
      emp.firstName.toLowerCase().includes(search.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole ? emp.role === filterRole : true;
    return matchSearch && matchRole;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading employees...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-600">Manage your team members</p>
        </div>
        <button
          onClick={() => navigate("/users/new?role=PROPERTY_MANAGER")}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Roles</option>
          {EMPLOYEE_ROLES.map((role) => (
            <option key={role} value={role}>
              {getRoleLabel(role)}
            </option>
          ))}
        </select>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left text-sm text-gray-500">
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Email</th>
              <th className="px-6 py-3 font-medium">Role</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredEmployees.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No employees found. Add one by clicking "Add Employee".
                </td>
              </tr>
            ) : (
              filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {emp.firstName} {emp.lastName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {emp.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {getRoleLabel(emp.role)}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      status={emp.isActive ? "Active" : "Inactive"}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <Link
                      to={`/users/${emp.id}/edit`}
                      className="inline-flex items-center px-2 py-1 text-blue-600 hover:bg-blue-50 rounded transition"
                    >
                      <PencilIcon className="w-4 h-4 mr-1" />
                      Edit
                    </Link>
                    <button
                      onClick={() =>
                        handleDelete(emp.id, `${emp.firstName} ${emp.lastName}`)
                      }
                      className="inline-flex items-center px-2 py-1 text-red-600 hover:bg-red-50 rounded transition"
                    >
                      <TrashIcon className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
