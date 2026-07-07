import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/outline";
import { POA } from "../types";
import { StatusBadge } from "../components/common/StatusBadge";
import api from "../api/client";

export default function POA() {
  const [poas, setPoas] = useState<POA[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/poa")
      .then(({ data }) => setPoas(data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Power of Attorney
          </h1>
          <p className="text-gray-600">Manage legal authorizations</p>
        </div>
        <Link to="/poa/new" className="btn-primary flex items-center space-x-2">
          <PlusIcon className="w-5 h-5" />
          <span>New POA</span>
        </Link>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left text-sm text-gray-500">
              <th className="px-6 py-3 font-medium">POA Number</th>
              <th className="px-6 py-3 font-medium">Title</th>
              <th className="px-6 py-3 font-medium">Asset</th>
              <th className="px-6 py-3 font-medium">Scope</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Start Date</th>
              <th className="px-6 py-3 font-medium">End Date</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {poas.map((poa) => (
              <tr key={poa.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {poa.poaNumber}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{poa.title}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {poa.assetType}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{poa.scope}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={poa.status} />
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(poa.startDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(poa.endDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm">
                  <button className="text-blue-600 hover:text-blue-800 mr-2">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
