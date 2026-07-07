import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { Contract } from "../types";
import { StatusBadge } from "../components/common/StatusBadge";
import api from "../api/client";
import { formatCurrency, formatDate } from "../utils/format";

export default function Contracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    api
      .get("/contracts")
      .then(({ data }) => setContracts(data.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = contracts.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.contractNumber.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contracts</h1>
          <p className="text-gray-600">Manage all rental contracts</p>
        </div>
        <Link
          to="/contracts/new"
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>New Contract</span>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search contracts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="ACTIVE">Active</option>
          <option value="EXPIRED">Expired</option>
          <option value="TERMINATED">Terminated</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left text-sm text-gray-500">
              <th className="px-6 py-3 font-medium">Contract #</th>
              <th className="px-6 py-3 font-medium">Title</th>
              <th className="px-6 py-3 font-medium">Asset</th>
              <th className="px-6 py-3 font-medium">Monthly Rent</th>
              <th className="px-6 py-3 font-medium">Start Date</th>
              <th className="px-6 py-3 font-medium">End Date</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((contract) => (
              <tr
                key={contract.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {contract.contractNumber}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {contract.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {contract.assetType}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {formatCurrency(contract.monthlyRent)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {formatDate(contract.startDate)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {formatDate(contract.endDate)}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={contract.status} />
                </td>
                <td className="px-6 py-4 text-sm">
                  <Link
                    to={`/contracts/${contract.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <EyeIcon className="w-4 h-4 inline" /> View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
