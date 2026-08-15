import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/client";

const maintenanceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  priority: z
    .enum(["LOW", "MEDIUM", "HIGH", "URGENT", "CRITICAL"])
    .default("MEDIUM"),
  assetType: z.enum(["PROPERTY", "VEHICLE", "LAND"]),
  assetId: z.string().uuid("Invalid asset ID"),
  reportedById: z.string().uuid("Invalid reporter ID"),
  assignedToId: z.string().uuid("Invalid assignee ID").optional(),
  estimatedCost: z.number().positive().optional(),
});

type MaintenanceFormData = z.infer<typeof maintenanceSchema>;

export default function MaintenanceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MaintenanceFormData>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      priority: "MEDIUM",
      assetType: "PROPERTY",
    },
  });

  useEffect(() => {
    if (id) {
      api
        .get(`/maintenance/${id}`)
        .then(({ data }) => reset(data.data))
        .catch(console.error);
    }
  }, [id, reset]);

  const onSubmit = async (data: MaintenanceFormData) => {
    setLoading(true);
    try {
      if (id) {
        await api.put(`/maintenance/${id}`, data);
      } else {
        await api.post("/maintenance", data);
      }
      navigate("/maintenance");
    } catch (error) {
      console.error("Failed to save maintenance request", error);
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
                Asset care
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-white md:text-3xl">
                {id ? "Edit Maintenance" : "New Maintenance Request"}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-[#f5e7c3] backdrop-blur-sm">
                Service request
              </span>
              <button
                type="button"
                onClick={() => navigate("/maintenance")}
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
                      Request overview
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-slate-900">
                      Summary & description
                    </h2>
                  </div>
                </div>
                <span className="rounded-full border border-[#d9c29c] bg-[#f9f1e2] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8a6730]">
                  Required
                </span>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("title")}
                    className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                    placeholder="e.g., Roof leak repair"
                  />
                  {errors.title && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register("description")}
                    rows={3}
                    className="w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 py-3 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                    placeholder="Provide detailed information about the maintenance issue..."
                  />
                  {errors.description && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.description.message}
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
                  Asset & priority
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("category")}
                    className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                    placeholder="e.g., PLUMBING, ELECTRICAL"
                  />
                  {errors.category && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Priority
                  </label>
                  <select
                    {...register("priority")}
                    className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Asset Type
                  </label>
                  <select
                    {...register("assetType")}
                    className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                  >
                    <option value="PROPERTY">Property</option>
                    <option value="VEHICLE">Vehicle</option>
                    <option value="LAND">Land</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Asset ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("assetId")}
                    className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                    placeholder="UUID"
                  />
                  {errors.assetId && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.assetId.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#eae0d0] bg-white p-5 md:p-6 shadow-[0_8px_24px_rgba(148,117,64,0.05)]">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f7e4ef] text-sm font-semibold text-[#8e4f78]">
                  03
                </div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Assignment & budget
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Reported By <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("reportedById")}
                    className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                    placeholder="UUID"
                  />
                  {errors.reportedById && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.reportedById.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Assigned To
                  </label>
                  <input
                    {...register("assignedToId")}
                    className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                    placeholder="UUID"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Estimated Cost (SAR)
                  </label>
                  <input
                    {...register("estimatedCost", { valueAsNumber: true })}
                    type="number"
                    className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-[#eee2d0] pt-6">
              <button
                type="button"
                onClick={() => navigate("/maintenance")}
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
                    ? "Update Request"
                    : "Create Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
