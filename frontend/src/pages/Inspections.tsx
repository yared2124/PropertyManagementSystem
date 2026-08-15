import { useEffect, useState } from "react";
import { ClipboardDocumentCheckIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Inspection } from "../types";
import { StatusBadge } from "../components/common/StatusBadge";
import {
  EmptyState,
  LoadingState,
  PageHeader,
  Panel,
  PrimaryButton,
} from "../components/common/Page";
import api from "../api/client";
import { formatDate } from "../utils/format";

export default function Inspections() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/inspections")
      .then(({ data }) => setInspections(data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState label="Loading inspections..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Quality"
        title="Inspections"
        description="Track inspection schedules, conditions, notes, and completion status."
        action={
          <PrimaryButton>
            <PlusIcon className="h-5 w-5" />
            <span>Schedule Inspection</span>
          </PrimaryButton>
        }
      />

      {inspections.length === 0 ? (
        <Panel className="p-5">
          <EmptyState
            title="No inspections found"
            description="Scheduled inspections will appear here."
          />
        </Panel>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {inspections.map((inspection) => (
            <Panel
              key={inspection.id}
              className="overflow-hidden p-5 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-300/70"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <ClipboardDocumentCheckIcon className="h-6 w-6" />
                  </div>
                  <h3 className="font-black text-slate-950">
                    {inspection.type}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {formatDate(inspection.inspectionDate)}
                  </p>
                </div>
                <StatusBadge status={inspection.status} />
              </div>
              <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm">
                <p className="font-semibold text-slate-600">
                  Condition:{" "}
                  <span className="font-black text-slate-950">
                    {inspection.condition || "N/A"}
                  </span>
                </p>
                <p className="mt-2 font-semibold text-slate-600">
                  Inspector:{" "}
                  <span className="font-black text-slate-950">
                    {inspection.inspectorId}
                  </span>
                </p>
              </div>
              {inspection.notes && (
                <p className="mt-4 text-sm leading-6 text-slate-500">
                  {inspection.notes}
                </p>
              )}
              <div className="mt-5 border-t border-slate-100 pt-4">
                <button className="text-sm font-black text-cyan-700 hover:text-cyan-900">
                  View Details
                </button>
              </div>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}
