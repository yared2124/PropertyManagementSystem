import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/client";

const contractSchema = z.object({
  title: z.string().min(1),
  assetType: z.enum(["PROPERTY", "VEHICLE", "LAND"]),
  assetId: z.string().uuid(),
  tenantId: z.string().uuid(),
  landlordId: z.string().uuid(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  monthlyRent: z.number().positive(),
  securityDeposit: z.number().positive(),
  latePaymentPenalty: z.number().default(0),
  paymentFrequency: z
    .enum(["MONTHLY", "QUARTERLY", "ANNUALLY"])
    .default("MONTHLY"),
  paymentDay: z.number().min(1).max(31).optional(),
});

type ContractFormData = z.infer<typeof contractSchema>;

export default function ContractForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContractFormData>({
    resolver: zodResolver(contractSchema),
    defaultValues: { paymentFrequency: "MONTHLY", latePaymentPenalty: 0 },
  });

  useEffect(() => {
    if (id) {
      api
        .get(`/contracts/${id}`)
        .then(({ data }) => reset(data.data))
        .catch(console.error);
    }
  }, [id, reset]);

  const onSubmit = async (data: ContractFormData) => {
    setLoading(true);
    try {
      if (id) {
        await api.put(`/contracts/${id}`, data);
      } else {
        await api.post("/contracts", data);
      }
      navigate("/contracts");
    } catch (error) {
      console.error("Failed to save contract", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-8 border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {id ? "Edit" : "New"} Contract
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input {...register("title")} className="input-field" />
          {errors.title && (
            <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
          )}
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
              Tenant ID
            </label>
            <input
              {...register("tenantId")}
              className="input-field"
              placeholder="UUID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Landlord ID
            </label>
            <input
              {...register("landlordId")}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Monthly Rent
            </label>
            <input
              {...register("monthlyRent", { valueAsNumber: true })}
              type="number"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Security Deposit
            </label>
            <input
              {...register("securityDeposit", { valueAsNumber: true })}
              type="number"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Late Payment Penalty
            </label>
            <input
              {...register("latePaymentPenalty", { valueAsNumber: true })}
              type="number"
              className="input-field"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payment Frequency
            </label>
            <select {...register("paymentFrequency")} className="input-field">
              <option value="MONTHLY">Monthly</option>
              <option value="QUARTERLY">Quarterly</option>
              <option value="ANNUALLY">Annually</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payment Day
            </label>
            <input
              {...register("paymentDay", { valueAsNumber: true })}
              type="number"
              className="input-field"
              min={1}
              max={31}
            />
          </div>
        </div>
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate("/contracts")}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Saving..." : "Save Contract"}
          </button>
        </div>
      </form>
    </div>
  );
}
