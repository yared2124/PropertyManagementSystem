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
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8 border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        New Power of Attorney
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input {...register("title")} className="input-field" />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Scope
            </label>
            <select {...register("scope")} className="input-field">
              <option value="FULL">Full</option>
              <option value="LIMITED">Limited</option>
              <option value="SPECIFIC">Specific</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Asset Type
            </label>
            <select {...register("assetType")} className="input-field">
              <option value="PROPERTY">Property</option>
              <option value="VEHICLE">Vehicle</option>
              <option value="LAND">Land</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Asset ID
            </label>
            <input
              {...register("assetId")}
              className="input-field"
              placeholder="UUID"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Grantor ID
            </label>
            <input
              {...register("grantorId")}
              className="input-field"
              placeholder="UUID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Grantee ID
            </label>
            <input
              {...register("granteeId")}
              className="input-field"
              placeholder="UUID"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              {...register("startDate")}
              type="datetime-local"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              {...register("endDate")}
              type="datetime-local"
              className="input-field"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notary Name
            </label>
            <input {...register("notaryName")} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notary Number
            </label>
            <input {...register("notaryNumber")} className="input-field" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Document URL
          </label>
          <input
            {...register("documentUrl")}
            className="input-field"
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            {...register("description")}
            rows={3}
            className="input-field"
          />
        </div>
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate("/poa")}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
