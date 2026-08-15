import { useEffect, useState } from "react";
import {
  CheckCircleIcon,
  ClockIcon,
  PlusIcon,
  WrenchScrewdriverIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { Maintenance as MaintenanceType } from "../types";
import { StatusBadge } from "../components/common/StatusBadge";
import {
  EmptyState,
  FilterSelect,
  IconButton,
  LoadingState,
  PageHeader,
  Panel,
  PrimaryLink,
  SearchInput,
  tableCellClass,
  tableClass,
  tableHeadCellClass,
  tableHeadClass,
} from "../components/common/Page";
import api from "../api/client";
import { formatDate } from "../utils/format";

export default function Maintenance() {
  const [requests, setRequests] = useState<MaintenanceType[]>([]);
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
      LOW: "bg-slate-100 text-slate-700",
      MEDIUM: "bg-cyan-50 text-cyan-700",
      HIGH: "bg-amber-50 text-amber-700",
      URGENT: "bg-orange-50 text-orange-700",
      CRITICAL: "bg-rose-50 text-rose-700",
    };
    return map[priority] || "bg-slate-100 text-slate-700";
  };

  const filtered = requests.filter((r) => {
    const term = search.toLowerCase();
    const matchesSearch =
      r.title.toLowerCase().includes(term) ||
      r.ticketNumber.toLowerCase().includes(term);
    const matchesStatus = filterStatus ? r.status === filterStatus : true;
    const matchesPriority = filterPriority
      ? r.priority === filterPriority
      : true;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (loading) return <LoadingState label="Loading maintenance requests..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Service"
        title="Maintenance"
        description="Prioritize requests, update progress, and keep every issue visible."
        action={
          <PrimaryLink to="/maintenance/new">
            <PlusIcon className="h-5 w-5" />
            <span>New Request</span>
          </PrimaryLink>
        }
      />

      <Panel className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="min-w-[220px] flex-1">
            <SearchInput
              placeholder="Search requests..."
              value={search}
              onChange={setSearch}
            />
          </div>
          <FilterSelect value={filterStatus} onChange={setFilterStatus}>
            <option value="">All Status</option>
            <option value="REPORTED">Reported</option>
            <option value="APPROVED">Approved</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </FilterSelect>
          <FilterSelect value={filterPriority} onChange={setFilterPriority}>
            <option value="">All Priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
            <option value="CRITICAL">Critical</option>
          </FilterSelect>
        </div>
      </Panel>

      <Panel className="overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-5">
            <EmptyState title="No maintenance requests found" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead className={tableHeadClass}>
                <tr>
                  <th className={tableHeadCellClass}>Ticket #</th>
                  <th className={tableHeadCellClass}>Title</th>
                  <th className={tableHeadCellClass}>Category</th>
                  <th className={tableHeadCellClass}>Priority</th>
                  <th className={tableHeadCellClass}>Status</th>
                  <th className={tableHeadCellClass}>Reported</th>
                  <th className={tableHeadCellClass}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filtered.map((req) => (
                  <tr key={req.id} className="transition hover:bg-cyan-50/50">
                    <td className={`${tableCellClass} font-black text-slate-950`}>
                      {req.ticketNumber}
                    </td>
                    <td className={`${tableCellClass} font-semibold text-slate-900`}>
                      <div className="flex items-center gap-2">
                        <WrenchScrewdriverIcon className="h-4 w-4 text-cyan-700" />
                        {req.title}
                      </div>
                    </td>
                    <td className={`${tableCellClass} text-slate-600`}>
                      {req.category}
                    </td>
                    <td className={tableCellClass}>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-black ${getPriorityColor(req.priority)}`}
                      >
                        {req.priority}
                      </span>
                    </td>
                    <td className={tableCellClass}>
                      <StatusBadge status={req.status} />
                    </td>
                    <td className={`${tableCellClass} text-slate-600`}>
                      {formatDate((req as any).reportedDate || "")}
                    </td>
                    <td className={tableCellClass}>
                      <div className="flex items-center gap-1">
                        <IconButton
                          onClick={() =>
                            handleStatusUpdate(req.id, "IN_PROGRESS")
                          }
                          title="Start"
                          tone="cyan"
                        >
                          <ClockIcon className="h-4 w-4" />
                        </IconButton>
                        <IconButton
                          onClick={() =>
                            handleStatusUpdate(req.id, "COMPLETED")
                          }
                          title="Complete"
                          tone="emerald"
                        >
                          <CheckCircleIcon className="h-4 w-4" />
                        </IconButton>
                        <IconButton
                          onClick={() =>
                            handleStatusUpdate(req.id, "CANCELLED")
                          }
                          title="Cancel"
                          tone="rose"
                        >
                          <XCircleIcon className="h-4 w-4" />
                        </IconButton>
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
