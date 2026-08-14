import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PencilIcon, PlusIcon, TrashIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import api from "../api/client";
import { User } from "../types";
import { StatusBadge } from "../components/common/StatusBadge";
import {
  EmptyState,
  FilterSelect,
  LoadingState,
  PageHeader,
  Panel,
  PrimaryButton,
  SearchInput,
  tableCellClass,
  tableClass,
  tableHeadCellClass,
  tableHeadClass,
} from "../components/common/Page";

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

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/users");
      setEmployees(
        data.data.filter((user: User) => EMPLOYEE_ROLES.includes(user.role)),
      );
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await api.delete(`/users/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error("Failed to delete employee:", error);
      alert("Failed to delete employee. Please try again.");
    }
  };

  const getRoleLabel = (role: string) => {
    const roleMap: Record<string, string> = {
      SYSTEM_ADMIN: "System Admin",
      PROPERTY_MANAGER: "Property Manager",
      ACCOUNTANT: "Accountant",
      LEGAL_ADMIN: "Legal Admin",
    };
    return roleMap[role] || role.replace("_", " ");
  };

  const filteredEmployees = employees.filter((emp) => {
    const term = search.toLowerCase();
    const matchSearch =
      emp.firstName.toLowerCase().includes(term) ||
      emp.lastName.toLowerCase().includes(term) ||
      emp.email.toLowerCase().includes(term);
    return matchSearch && (filterRole ? emp.role === filterRole : true);
  });

  if (loading) return <LoadingState label="Loading employees..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Team"
        title="Employees"
        description="Manage staff accounts, roles, access, and internal users."
        action={
          <PrimaryButton onClick={() => navigate("/users/new?role=PROPERTY_MANAGER")}>
            <PlusIcon className="h-5 w-5" />
            <span>Add Employee</span>
          </PrimaryButton>
        }
      />

      <Panel className="p-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <SearchInput
            placeholder="Search employees..."
            value={search}
            onChange={setSearch}
          />
          <FilterSelect value={filterRole} onChange={setFilterRole}>
            <option value="">All Roles</option>
            {EMPLOYEE_ROLES.map((role) => (
              <option key={role} value={role}>
                {getRoleLabel(role)}
              </option>
            ))}
          </FilterSelect>
        </div>
      </Panel>

      <Panel className="overflow-hidden">
        {filteredEmployees.length === 0 ? (
          <div className="p-5">
            <EmptyState title="No employees found" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead className={tableHeadClass}>
                <tr>
                  <th className={tableHeadCellClass}>Name</th>
                  <th className={tableHeadCellClass}>Email</th>
                  <th className={tableHeadCellClass}>Role</th>
                  <th className={tableHeadCellClass}>Status</th>
                  <th className={tableHeadCellClass}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="transition hover:bg-cyan-50/50">
                    <td className={`${tableCellClass} font-black text-slate-950`}>
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-xs font-black text-cyan-700">
                          {emp.firstName[0]}
                          {emp.lastName[0]}
                        </span>
                        {emp.firstName} {emp.lastName}
                      </div>
                    </td>
                    <td className={`${tableCellClass} text-slate-600`}>{emp.email}</td>
                    <td className={`${tableCellClass} text-slate-600`}>
                      {getRoleLabel(emp.role)}
                    </td>
                    <td className={tableCellClass}>
                      <StatusBadge status={emp.isActive === false ? "Inactive" : "Active"} />
                    </td>
                    <td className={tableCellClass}>
                      <div className="flex gap-2">
                        <Link
                          to={`/users/${emp.id}/edit`}
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-cyan-700 transition hover:bg-cyan-50"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() =>
                            handleDelete(emp.id, `${emp.firstName} ${emp.lastName}`)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-rose-600 transition hover:bg-rose-50"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
