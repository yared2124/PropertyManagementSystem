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
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8 border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {id ? "Edit" : "New"} Maintenance Request
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title *
          </label>
          <input {...register("title")} className="input-field" />
          {errors.title && (
            <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description *
          </label>
          <textarea
            {...register("description")}
            rows={3}
            className="input-field"
          />
          {errors.description && (
            <p className="text-red-600 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <input
              {...register("category")}
              className="input-field"
              placeholder="e.g., PLUMBING, ELECTRICAL"
            />
            {errors.category && (
              <p className="text-red-600 text-sm mt-1">
                {errors.category.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Priority
            </label>
            <select {...register("priority")} className="input-field">
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
              <option value="CRITICAL">Critical</option>
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
              Asset ID *
            </label>
            <input
              {...register("assetId")}
              className="input-field"
              placeholder="UUID"
            />
            {errors.assetId && (
              <p className="text-red-600 text-sm mt-1">
                {errors.assetId.message}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Reported By *
            </label>
            <input
              {...register("reportedById")}
              className="input-field"
              placeholder="UUID"
            />
            {errors.reportedById && (
              <p className="text-red-600 text-sm mt-1">
                {errors.reportedById.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Assigned To
            </label>
            <input
              {...register("assignedToId")}
              className="input-field"
              placeholder="UUID"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Estimated Cost (SAR)
          </label>
          <input
            {...register("estimatedCost", { valueAsNumber: true })}
            type="number"
            className="input-field"
          />
        </div>
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate("/maintenance")}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Saving..." : "Save Request"}
          </button>
        </div>
      </form>
    </div>
  );
}
