import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/client";

const vehicleSchema = z.object({
  make: z.string().min(1),
  model: z.string().min(1),
  year: z
    .number()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  vin: z.string().length(17),
  licensePlate: z.string().min(1),
  dailyRate: z.number().positive(),
  monthlyRate: z.number().positive(),
  purchasePrice: z.number().positive(),
  status: z.enum(["AVAILABLE", "RENTED", "UNDER_MAINTENANCE"]),
  ownerId: z.string().uuid(),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

export default function VehicleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: { status: "AVAILABLE" },
  });

  useEffect(() => {
    if (id) {
      api
        .get(`/vehicles/${id}`)
        .then(({ data }) => reset(data.data))
        .catch(console.error);
    }
  }, [id, reset]);

  const onSubmit = async (data: VehicleFormData) => {
    setLoading(true);
    try {
      if (id) {
        await api.put(`/vehicles/${id}`, data);
      } else {
        await api.post("/vehicles", data);
      }
      navigate("/vehicles");
    } catch (error) {
      console.error("Failed to save vehicle", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8 border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {id ? "Edit" : "Add"} Vehicle
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Make
            </label>
            <input {...register("make")} className="input-field" />
            {errors.make && (
              <p className="text-red-600 text-sm mt-1">{errors.make.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Model
            </label>
            <input {...register("model")} className="input-field" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Year
            </label>
            <input
              {...register("year", { valueAsNumber: true })}
              type="number"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              License Plate
            </label>
            <input {...register("licensePlate")} className="input-field" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">VIN</label>
          <input
            {...register("vin")}
            className="input-field"
            placeholder="17 characters"
          />
          {errors.vin && (
            <p className="text-red-600 text-sm mt-1">{errors.vin.message}</p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Daily Rate
            </label>
            <input
              {...register("dailyRate", { valueAsNumber: true })}
              type="number"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Monthly Rate
            </label>
            <input
              {...register("monthlyRate", { valueAsNumber: true })}
              type="number"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Purchase Price
            </label>
            <input
              {...register("purchasePrice", { valueAsNumber: true })}
              type="number"
              className="input-field"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select {...register("status")} className="input-field">
              <option value="AVAILABLE">Available</option>
              <option value="RENTED">Rented</option>
              <option value="UNDER_MAINTENANCE">Under Maintenance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Owner ID
            </label>
            <input
              {...register("ownerId")}
              className="input-field"
              placeholder="UUID"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate("/vehicles")}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Saving..." : "Save Vehicle"}
          </button>
        </div>
      </form>
    </div>
  );
}
