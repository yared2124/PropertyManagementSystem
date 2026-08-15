import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/client";
import { User } from "../types";

// ============================================
// 1. ZOD VALIDATION SCHEMA
// ============================================
const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  role: z.enum([
    "SYSTEM_ADMIN",
    "PROPERTY_MANAGER",
    "TENANT",
    "LANDLORD",
    "ACCOUNTANT",
    "LEGAL_ADMIN",
  ]),
  isActive: z.boolean().default(true),
});

type UserFormData = z.infer<typeof userSchema>;

// ============================================
// 2. COMPONENT
// ============================================
export default function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: "TENANT",
      isActive: true,
    },
  });

  // Load user data when editing
  useEffect(() => {
    if (id) {
      api
        .get(`/users/${id}`)
        .then(({ data }) => {
          const user = data.data;
          reset({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
          });
          setFetching(false);
        })
        .catch(() => {
          alert("User not found");
          navigate("/users");
        });
    }
  }, [id, reset, navigate]);

  // ... inside UserForm component

  const onSubmit = async (data: UserFormData) => {
    setLoading(true);
    try {
      if (id) {
        const payload: any = { ...data };
        if (!payload.password) delete payload.password;
        await api.put(`/users/${id}`, payload);
      } else {
        if (!data.password) {
          alert("Password is required for new users");
          setLoading(false);
          return;
        }
        await api.post("/users", data);
      }
      navigate("/users");
    } catch (error: any) {
      console.error("Save user error:", error);
      // Show meaningful error message
      let message = "Failed to save user.";
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.data?.errors) {
        message = error.response.data.errors.join(", ");
      } else if (error.message) {
        message = error.message;
      }
      alert(`❌ ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: "SYSTEM_ADMIN", label: "System Admin" },
    { value: "PROPERTY_MANAGER", label: "Property Manager" },
    { value: "TENANT", label: "Tenant" },
    { value: "LANDLORD", label: "Landlord" },
    { value: "ACCOUNTANT", label: "Accountant" },
    { value: "LEGAL_ADMIN", label: "Legal Admin" },
  ];

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-[#c9a96d] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ===== SECTION 1: PERSONAL INFORMATION ===== */}
        <div className="rounded-2xl border border-[#eae0d0] bg-[#fffdf9] p-5 md:p-6 shadow-[0_8px_24px_rgba(148,117,64,0.06)]">
          <div className="mb-5 flex items-center justify-between gap-3 border-b border-[#efe7dc] pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f2e4c7] text-sm font-semibold text-[#8a6730]">
                01
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a6730]">
                  User Profile
                </p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">
                  Personal Information
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
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("firstName")}
                className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                placeholder="e.g., John"
              />
              {errors.firstName && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("lastName")}
                className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                placeholder="e.g., Doe"
              />
              {errors.lastName && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ===== SECTION 2: CONTACT & SECURITY ===== */}
        <div className="rounded-2xl border border-[#eae0d0] bg-white p-5 md:p-6 shadow-[0_8px_24px_rgba(148,117,64,0.05)]">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8ecf8] text-sm font-semibold text-[#3e4c7a]">
              02
            </div>
            <h2 className="text-lg font-semibold text-slate-900">
              Contact & Security
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                {...register("email")}
                type="email"
                className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                placeholder="user@example.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password {!id && <span className="text-red-500">*</span>}
                {id && (
                  <span className="text-slate-400 text-xs ml-1">
                    (leave blank to keep current)
                  </span>
                )}
              </label>
              <input
                {...register("password")}
                type="password"
                className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                placeholder={
                  id ? "New password (optional)" : "Minimum 6 characters"
                }
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ===== SECTION 3: ROLE & STATUS ===== */}
        <div className="rounded-2xl border border-[#eae0d0] bg-white p-5 md:p-6 shadow-[0_8px_24px_rgba(148,117,64,0.05)]">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f9eed7] text-sm font-semibold text-[#8f6a2c]">
              03
            </div>
            <h2 className="text-lg font-semibold text-slate-900">
              Role & Status
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                {...register("role")}
                className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
              >
                {roleOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.role.message}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                {...register("isActive")}
                type="checkbox"
                id="isActive"
                className="h-5 w-5 rounded border-[#d9c29c] text-[#8a6730] focus:ring-[#c9a96d]"
              />
              <label
                htmlFor="isActive"
                className="text-sm font-medium text-slate-700"
              >
                Active{" "}
                <span className="text-slate-400 text-xs font-normal ml-1">
                  (User can log in)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* ===== FORM ACTIONS ===== */}
        <div className="flex items-center justify-end gap-3 border-t border-[#eee2d0] pt-6">
          <button
            type="button"
            onClick={() => navigate("/users")}
            className="rounded-xl border border-[#d9c7a2] bg-[#f9f5ef] px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-[#f4ebdf]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-gradient-to-r from-[#0f172a] via-[#1b2c3d] to-[#b98d46] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(24,32,48,0.25)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Saving..." : id ? "Update User" : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
}
