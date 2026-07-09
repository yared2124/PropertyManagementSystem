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
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8 border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {id ? "Edit" : "Schedule"} Inspection
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Property ID *
            </label>
            <input
              {...register("propertyId")}
              className="input-field"
              placeholder="UUID"
            />
            {errors.propertyId && (
              <p className="text-red-600 text-sm mt-1">
                {errors.propertyId.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Inspector ID *
            </label>
            <input
              {...register("inspectorId")}
              className="input-field"
              placeholder="UUID"
            />
            {errors.inspectorId && (
              <p className="text-red-600 text-sm mt-1">
                {errors.inspectorId.message}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Inspection Date *
            </label>
            <input
              {...register("inspectionDate")}
              type="datetime-local"
              className="input-field"
            />
            {errors.inspectionDate && (
              <p className="text-red-600 text-sm mt-1">
                {errors.inspectionDate.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select {...register("type")} className="input-field">
              <option value="INITIAL">Initial</option>
              <option value="ROUTINE">Routine</option>
              <option value="EXIT">Exit</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select {...register("status")} className="input-field">
              <option value="SCHEDULED">Scheduled</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Condition
            </label>
            <select {...register("condition")} className="input-field">
              <option value="">Select condition</option>
              <option value="EXCELLENT">Excellent</option>
              <option value="GOOD">Good</option>
              <option value="FAIR">Fair</option>
              <option value="POOR">Poor</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea {...register("notes")} rows={3} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Recommendations
          </label>
          <textarea
            {...register("recommendations")}
            rows={2}
            className="input-field"
          />
        </div>
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate("/inspections")}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Saving..." : "Save Inspection"}
          </button>
        </div>
      </form>
    </div>
  );
}
