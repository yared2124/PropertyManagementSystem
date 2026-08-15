import { useEffect, useState } from "react";
import { PencilIcon, PlusIcon, ScaleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { POA as POAType } from "../types";
import { StatusBadge } from "../components/common/StatusBadge";
import {
  ActionLink,
  EmptyState,
  IconButton,
  LoadingState,
  PageHeader,
  Panel,
  PrimaryLink,
  tableCellClass,
  tableClass,
  tableHeadCellClass,
  tableHeadClass,
} from "../components/common/Page";
import api from "../api/client";

export default function POA() {
  const [poas, setPoas] = useState<POAType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/poa")
      .then(({ data }) => setPoas(data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState label="Loading legal authorizations..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Legal"
        title="Power of Attorney"
        description="Manage legal authorizations, scope, assets, and validity periods."
        action={
          <PrimaryLink to="/poa/new">
            <PlusIcon className="h-5 w-5" />
            <span>New POA</span>
          </PrimaryLink>
        }
      />

      <Panel className="overflow-hidden">
        {poas.length === 0 ? (
          <div className="p-5">
            <EmptyState title="No POA records found" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead className={tableHeadClass}>
                <tr>
                  <th className={tableHeadCellClass}>POA Number</th>
                  <th className={tableHeadCellClass}>Title</th>
                  <th className={tableHeadCellClass}>Asset</th>
                  <th className={tableHeadCellClass}>Scope</th>
                  <th className={tableHeadCellClass}>Status</th>
                  <th className={tableHeadCellClass}>Start Date</th>
                  <th className={tableHeadCellClass}>End Date</th>
                  <th className={tableHeadCellClass}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {poas.map((poa) => (
                  <tr key={poa.id} className="transition hover:bg-cyan-50/50">
                    <td className={`${tableCellClass} font-black text-slate-950`}>
                      <div className="flex items-center gap-2">
                        <ScaleIcon className="h-4 w-4 text-violet-700" />
                        {poa.poaNumber}
                      </div>
                    </td>
                    <td className={`${tableCellClass} font-semibold text-slate-900`}>
                      {poa.title}
                    </td>
                    <td className={`${tableCellClass} text-slate-600`}>{poa.assetType}</td>
                    <td className={`${tableCellClass} text-slate-600`}>{poa.scope}</td>
                    <td className={tableCellClass}>
                      <StatusBadge status={poa.status} />
                    </td>
                    <td className={`${tableCellClass} text-slate-600`}>
                      {new Date(poa.startDate).toLocaleDateString()}
                    </td>
                    <td className={`${tableCellClass} text-slate-600`}>
                      {new Date(poa.endDate).toLocaleDateString()}
                    </td>
                    <td className={tableCellClass}>
                      <div className="flex gap-2">
                        <ActionLink
                          to={`/poa/${poa.id}/edit`}
                          tone="violet"
                        >
                          <PencilIcon className="h-4 w-4" />
                          Edit
                        </ActionLink>
                        <IconButton title="Delete POA" tone="rose">
                          <TrashIcon className="h-4 w-4" />
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
