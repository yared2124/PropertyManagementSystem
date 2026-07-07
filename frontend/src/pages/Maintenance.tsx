import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { Maintenance } from "../types";
import { StatusBadge } from "../components/common/StatusBadge";
import api from "../api/client";
import { formatDate } from "../utils/format";

export default function Maintenance() {
  const [requests, setRequests] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await api.get("/maintenance");
      setRequests(data.data);
    } catch (error) {
      console.error("Failed to fetch maintenance requests", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await api.put(`/maintenance/${id}/status`, { status });
      fetchRequests();
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const getPriorityColor = (priority: string) => {
    const map: Record<string, string> = {
      LOW: "bg-gray-100 text-gray-800",
      MEDIUM: "bg-blue-100 text-blue-800",
      HIGH: "bg-yellow-100 text-yellow-800",
      URGENT: "bg-orange-100 text-orange-800",
      CRITICAL: "bg-red-100 text-red-800",
    };
    return map[priority] || "bg-gray-100 text-gray-800";
  };

  const filtered = requests.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.ticketNumber.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maintenance</h1>
          <p className="text-gray-600">Manage all maintenance requests</p>
        </div>
        <Link
          to="/maintenance/new"
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>New Request</span>
        </Link>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Status</option>
          <option value="REPORTED">Reported</option>
          <option value="APPROVED">Approved</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Priority</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
          <option value="CRITICAL">Critical</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left text-sm text-gray-500">
              <th className="px-6 py-3 font-medium">Ticket #</th>
              <th className="px-6 py-3 font-medium">Title</th>
              <th className="px-6 py-3 font-medium">Category</th>
              <th className="px-6 py-3 font-medium">Priority</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Reported</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {req.ticketNumber}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{req.title}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {req.category}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(req.priority)}`}
                  >
                    {req.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={req.status} />
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {formatDate(req.reportedDate)}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleStatusUpdate(req.id, "IN_PROGRESS")}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="Start"
                    >
                      <ClockIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(req.id, "COMPLETED")}
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                      title="Complete"
                    >
                      <CheckCircleIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(req.id, "CANCELLED")}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="Cancel"
                    >
                      <XCircleIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
