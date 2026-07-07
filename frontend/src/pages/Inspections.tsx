import { useState, useEffect } from "react";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { Inspection } from "../types";
import { StatusBadge } from "../components/common/StatusBadge";
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inspections</h1>
          <p className="text-gray-600">Track all property inspections</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <PlusIcon className="w-5 h-5" />
          <span>Schedule Inspection</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inspections.map((inspection) => (
          <div
            key={inspection.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {inspection.type}
                </h3>
                <p className="text-sm text-gray-500">
                  {formatDate(inspection.inspectionDate)}
                </p>
              </div>
              <StatusBadge status={inspection.status} />
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <p>
                <span className="font-medium">Condition:</span>{" "}
                {inspection.condition || "N/A"}
              </p>
              <p>
                <span className="font-medium">Inspector:</span>{" "}
                {inspection.inspectorId}
              </p>
            </div>
            {inspection.notes && (
              <p className="mt-2 text-sm text-gray-500">{inspection.notes}</p>
            )}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View Details →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
