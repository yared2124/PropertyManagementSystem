import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

const poaSchema = z.object({
  title: z.string().min(1),
  scope: z.enum(["FULL", "LIMITED", "SPECIFIC"]),
  grantorId: z.string().uuid(),
  granteeId: z.string().uuid(),
  assetType: z.enum(["PROPERTY", "VEHICLE", "LAND"]),
  assetId: z.string().uuid(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  notaryName: z.string().optional(),
  notaryNumber: z.string().optional(),
  documentUrl: z.string().url().optional(),
  description: z.string().optional(),
});

type POAFormData = z.infer<typeof poaSchema>;

export default function POAForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<POAFormData>({
    resolver: zodResolver(poaSchema),
    defaultValues: { scope: "FULL", assetType: "PROPERTY" },
  });

  const onSubmit = async (data: POAFormData) => {
    try {
      await api.post("/poa", data);
      navigate("/poa");
    } catch (error) {
      console.error("Failed to create POA", error);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-10">
      <div className="overflow-hidden rounded-[28px] border border-[#e8dfd1] bg-gradient-to-br from-[#f8f5f0] via-white to-[#f3efe8] shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
        <div className="border-b border-[#e9e0d0] bg-gradient-to-r from-[#0f172a] via-[#182334] to-[#1a2d3f] px-6 py-6 text-white md:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d6b77d]">
                Legal authorization
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-white md:text-3xl">
                Power of Attorney
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-[#f5e7c3] backdrop-blur-sm">
                Legal document
              </span>
              <button
                type="button"
                onClick={() => navigate("/poa")}
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
                      Authority details
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-slate-900">
                      Basic information
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
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("title")}
                    className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                    placeholder="e.g., Property Management"
                  />
                  {errors.title && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Scope <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("scope")}
                    className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                  >
                    <option value="FULL">Full Authority</option>
                    <option value="LIMITED">Limited</option>
                    <option value="SPECIFIC">Specific Powers</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#eae0d0] bg-white p-5 md:p-6 shadow-[0_8px_24px_rgba(148,117,64,0.05)]">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8ecf8] text-sm font-semibold text-[#3e4c7a]">
                  02
                </div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Asset details
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Asset Type <span className="text-red-500">*</span>
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
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#eae0d0] bg-white p-5 md:p-6 shadow-[0_8px_24px_rgba(148,117,64,0.05)]">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f7e4ef] text-sm font-semibold text-[#8e4f78]">
                  03
                </div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Parties
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Grantor ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("grantorId")}
                    className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                    placeholder="UUID"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Grantee ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("granteeId")}
                    className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                    placeholder="UUID"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#eae0d0] bg-white p-5 md:p-6 shadow-[0_8px_24px_rgba(148,117,64,0.05)]">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f9eed7] text-sm font-semibold text-[#8f6a2c]">
                  04
                </div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Validity period
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("startDate")}
                    type="datetime-local"
                    className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("endDate")}
                    type="datetime-local"
                    className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#eae0d0] bg-white p-5 md:p-6 shadow-[0_8px_24px_rgba(148,117,64,0.05)]">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e4e8f6] text-sm font-semibold text-[#5a6a96]">
                  05
                </div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Notarization & documentation
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Notary Name
                  </label>
                  <input
                    {...register("notaryName")}
                    className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                    placeholder="Full name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Notary Number
                  </label>
                  <input
                    {...register("notaryNumber")}
                    className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                    placeholder="License/number"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Document URL
                </label>
                <input
                  {...register("documentUrl")}
                  className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[#eae0d0] bg-white p-5 md:p-6 shadow-[0_8px_24px_rgba(148,117,64,0.05)]">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Additional notes
              </label>
              <textarea
                {...register("description")}
                rows={4}
                className="w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 py-3 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                placeholder="Any additional details or instructions..."
              />
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-[#eee2d0] pt-6">
              <button
                type="button"
                onClick={() => navigate("/poa")}
                className="rounded-xl border border-[#d9c7a2] bg-[#f9f5ef] px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-[#f4ebdf]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-gradient-to-r from-[#0f172a] via-[#1b2c3d] to-[#b98d46] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(24,32,48,0.25)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Saving..." : "Create POA"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
