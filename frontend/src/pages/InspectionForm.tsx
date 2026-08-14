import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/client";

const inspectionSchema = z.object({
  propertyId: z.string().uuid("Invalid property ID"),
  inspectorId: z.string().uuid("Invalid inspector ID"),
  inspectionDate: z.string().datetime(),
  type: z.enum(["INITIAL", "ROUTINE", "EXIT", "MAINTENANCE"]),
  status: z
    .enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"])
    .default("SCHEDULED"),
  condition: z.enum(["EXCELLENT", "GOOD", "FAIR", "POOR"]).optional(),
  notes: z.string().optional(),
  recommendations: z.string().optional(),
});

type InspectionFormData = z.infer<typeof inspectionSchema>;

export default function InspectionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InspectionFormData>({
    resolver: zodResolver(inspectionSchema),
    defaultValues: {
      status: "SCHEDULED",
      type: "ROUTINE",
    },
  });

  useEffect(() => {
    if (id) {
      api
        .get(`/inspections/${id}`)
        .then(({ data }) => reset(data.data))
        .catch(console.error);
    }
  }, [id, reset]);

  const onSubmit = async (data: InspectionFormData) => {
    setLoading(true);
    try {
      if (id) {
        await api.put(`/inspections/${id}`, data);
      } else {
        await api.post("/inspections", data);
      }
      navigate("/inspections");
    } catch (error) {
      console.error("Failed to save inspection", error);
      alert("Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-10">
      <div className="overflow-hidden rounded-[28px] border border-[#e8dfd1] bg-gradient-to-br from-[#f8f5f0] via-white to-[#f3efe8] shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
        <div className="border-b border-[#e9e0d0] bg-gradient-to-r from-[#0f172a] via-[#182334] to-[#1a2d3f] px-6 py-6 text-white md:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d6b77d]">
                Quality assurance
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-white md:text-3xl">
                {id ? "Edit Inspection" : "Schedule Inspection"}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-[#f5e7c3] backdrop-blur-sm">
                Property assessment
              </span>
              <button
                type="button"
                onClick={() => navigate("/inspections")}
                className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        <div className="p-5 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="rounded-2xl border border-[#eae0d0] bg-[#fffdf9] p-5 md:p-6 shadow-[0_8px_24px_rgba(148,117,64,0.06)]">
              <div className="mb-5 flex items-center justify-between gap-3 border-b border-[#efe7dc] pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f2e4c7] text-sm font-semibold text-[#8a6730]">
                    01
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a6730]">
                      Inspection info
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-slate-900">
                      Property & inspector
                    </h2>
                  </div>
                </div>
                <span className="rounded-full border border-[#d9c29c] bg-[#f9f1e2] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8a6730]">
                  Required
                </span>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Property ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("propertyId")}
                    className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                    placeholder="UUID"
                  />
                  {errors.propertyId && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.propertyId.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Inspector ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("inspectorId")}
                    className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                    placeholder="UUID"
                  />
                  {errors.inspectorId && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.inspectorId.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#eae0d0] bg-white p-5 md:p-6 shadow-[0_8px_24px_rgba(148,117,64,0.05)]">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8ecf8] text-sm font-semibold text-[#3e4c7a]">
                  02
                </div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Inspection schedule & type
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Inspection Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("inspectionDate")}
                    type="datetime-local"
                    className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                  />
                  {errors.inspectionDate && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.inspectionDate.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Type
                  </label>
                  <select
                    {...register("type")}
                    className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                  >
                    <option value="INITIAL">Initial</option>
                    <option value="ROUTINE">Routine</option>
                    <option value="EXIT">Exit</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Status
                  </label>
                  <select
                    {...register("status")}
                    className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                  >
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Condition
                  </label>
                  <select
                    {...register("condition")}
                    className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                  >
                    <option value="">Select condition</option>
                    <option value="EXCELLENT">Excellent</option>
                    <option value="GOOD">Good</option>
                    <option value="FAIR">Fair</option>
                    <option value="POOR">Poor</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#eae0d0] bg-white p-5 md:p-6 shadow-[0_8px_24px_rgba(148,117,64,0.05)]">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f7e4ef] text-sm font-semibold text-[#8e4f78]">
                  03
                </div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Findings & recommendations
                </h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Inspection Notes
                  </label>
                  <textarea
                    {...register("notes")}
                    rows={3}
                    className="w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 py-3 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                    placeholder="Document any observations..."
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Recommendations
                  </label>
                  <textarea
                    {...register("recommendations")}
                    rows={2}
                    className="w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 py-3 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                    placeholder="Suggested actions..."
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-[#eee2d0] pt-6">
              <button
                type="button"
                onClick={() => navigate("/inspections")}
                className="rounded-xl border border-[#d9c7a2] bg-[#f9f5ef] px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-[#f4ebdf]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-gradient-to-r from-[#0f172a] via-[#1b2c3d] to-[#b98d46] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(24,32,48,0.25)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading
                  ? "Saving..."
                  : id
                    ? "Update Inspection"
                    : "Schedule Inspection"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
