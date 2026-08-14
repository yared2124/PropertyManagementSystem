import { useEffect, useState } from "react";
import { EyeIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Contract } from "../types";
import { StatusBadge } from "../components/common/StatusBadge";
import {
  EmptyState,
  FilterSelect,
  ActionLink,
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

  const filtered = contracts.filter((c) => {
    const term = search.toLowerCase();
    const matchesSearch =
      c.title.toLowerCase().includes(term) ||
      c.contractNumber.toLowerCase().includes(term);
    return matchesSearch && (filterStatus ? c.status === filterStatus : true);
  });

  if (loading) return <LoadingState label="Loading contracts..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Leasing"
        title="Contracts"
        description="Manage rental agreements, lease timelines, contract status, and monthly rent."
        action={
          <PrimaryLink to="/contracts/new">
            <PlusIcon className="h-5 w-5" />
            <span>New Contract</span>
          </PrimaryLink>
        }
      />

      <Panel className="p-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <SearchInput
            placeholder="Search contracts..."
            value={search}
            onChange={setSearch}
          />
          <FilterSelect value={filterStatus} onChange={setFilterStatus}>
            <option value="">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Active</option>
            <option value="EXPIRED">Expired</option>
            <option value="TERMINATED">Terminated</option>
          </FilterSelect>
        </div>
      </Panel>

      <Panel className="overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-5">
            <EmptyState title="No contracts found" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead className={tableHeadClass}>
                <tr>
                  <th className={tableHeadCellClass}>Contract #</th>
                  <th className={tableHeadCellClass}>Title</th>
                  <th className={tableHeadCellClass}>Asset</th>
                  <th className={tableHeadCellClass}>Monthly Rent</th>
                  <th className={tableHeadCellClass}>Start Date</th>
                  <th className={tableHeadCellClass}>End Date</th>
                  <th className={tableHeadCellClass}>Status</th>
                  <th className={tableHeadCellClass}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filtered.map((contract) => (
                  <tr key={contract.id} className="transition hover:bg-cyan-50/50">
                    <td className={`${tableCellClass} font-black text-slate-950`}>
                      {contract.contractNumber}
                    </td>
                    <td className={`${tableCellClass} font-semibold text-slate-900`}>
                      {contract.title}
                    </td>
                    <td className={`${tableCellClass} text-slate-600`}>
                      {contract.assetType}
                    </td>
                    <td className={`${tableCellClass} font-bold text-slate-950`}>
                      {formatCurrency(contract.monthlyRent)}
                    </td>
                    <td className={`${tableCellClass} text-slate-600`}>
                      {formatDate(contract.startDate)}
                    </td>
                    <td className={`${tableCellClass} text-slate-600`}>
                      {formatDate(contract.endDate)}
                    </td>
                    <td className={tableCellClass}>
                      <StatusBadge status={contract.status} />
                    </td>
                    <td className={tableCellClass}>
                      <ActionLink
                        to={`/contracts/${contract.id}`}
                      >
                        <EyeIcon className="h-4 w-4" />
                        View
                      </ActionLink>
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
