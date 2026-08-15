import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/client";
import { Property } from "../types";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";

// ============================================
// 1. ZOD VALIDATION SCHEMA
// ============================================
const propertySchema = z.object({
  title: z.string().min(1, "Title is required"),
  assetType: z.enum([
    "APARTMENT",
    "OFFICE",
    "VILLA",
    "WAREHOUSE",
    "LAND",
    "COMMERCIAL_SPACE",
    "RESIDENTIAL_COMPLEX",
  ]),
  area: z.number().positive("Area must be positive"),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().positive().optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  marketValue: z.number().positive("Market value must be positive"),
  rentalRate: z.number().positive("Rental rate must be positive"),
  status: z
    .enum(["AVAILABLE", "RENTED", "UNDER_MAINTENANCE"])
    .default("AVAILABLE"),
  ownerId: z.string().uuid("Invalid owner ID"),
  managerId: z.string().uuid("Invalid manager ID").optional(),
  description: z.string().optional(),
  furnished: z.boolean().default(false),
  yearBuilt: z.number().int().optional(),
  district: z.string().optional(),
  neighborhood: z.string().optional(),
});

type PropertyFormData = z.infer<typeof propertySchema>;

// ============================================
// 2. COMPONENT
// ============================================
export default function PropertyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<
    { id: string; imageUrl: string; isPrimary: boolean }[]
  >([]);
  const [property, setProperty] = useState<Property | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      status: "AVAILABLE",
      assetType: "APARTMENT",
      furnished: false,
    },
  });

  // Load property data for editing
  useEffect(() => {
    if (id) {
      api
        .get(`/properties/${id}`)
        .then(({ data }) => {
          setProperty(data.data);
          reset(data.data);
          // Load images
          api
            .get(`/properties/${id}/images`)
            .then(({ data: imgData }) => setImages(imgData.data))
            .catch(console.error);
        })
        .catch(console.error);
    }
  }, [id, reset]);

  // Submit handler
  const onSubmit = async (data: PropertyFormData) => {
    setLoading(true);
    try {
      if (id) {
        await api.put(`/properties/${id}`, data);
      } else {
        await api.post("/properties", data);
      }
      navigate("/properties");
    } catch (error) {
      console.error("Failed to save property", error);
      alert("Failed to save property. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Image upload handlers
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const { data } = await api.post(`/properties/${id}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImages([...images, data.data]);
    } catch (error) {
      console.error("Failed to upload image", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSetPrimary = async (imageId: string) => {
    try {
      await api.patch(`/properties/images/${imageId}/primary`);
      setImages(
        images.map((img) => ({ ...img, isPrimary: img.id === imageId })),
      );
    } catch (error) {
      console.error("Failed to set primary image", error);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("Delete this image?")) return;
    try {
      await api.delete(`/properties/images/${imageId}`);
      setImages(images.filter((img) => img.id !== imageId));
    } catch (error) {
      console.error("Failed to delete image", error);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-10">
      <div className="overflow-hidden rounded-[28px] border border-[#e8dfd1] bg-gradient-to-br from-[#f8f5f0] via-white to-[#f3efe8] shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
        <div className="border-b border-[#e9e0d0] bg-gradient-to-r from-[#0f172a] via-[#182334] to-[#1a2d3f] px-6 py-6 text-white md:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d6b77d]">
                Premium portfolio
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-white md:text-3xl">
                {id ? "Edit Property" : "Add New Property"}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-[#f5e7c3] backdrop-blur-sm">
                Luxury listing
              </span>
              <button
                type="button"
                onClick={() => navigate("/properties")}
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
                      Property profile
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
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("title")}
                    className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                    placeholder="e.g., Luxury Apartment Downtown"
                  />
                  {errors.title && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Asset Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("assetType")}
                    className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                  >
                    <option value="APARTMENT">Apartment</option>
                    <option value="OFFICE">Office</option>
                    <option value="VILLA">Villa</option>
                    <option value="WAREHOUSE">Warehouse</option>
                    <option value="LAND">Land</option>
                    <option value="COMMERCIAL_SPACE">Commercial Space</option>
                    <option value="RESIDENTIAL_COMPLEX">
                      Residential Complex
                    </option>
                  </select>
                  {errors.assetType && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.assetType.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Status
                  </label>
                  <select
                    {...register("status")}
                    className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="RENTED">Rented</option>
                    <option value="UNDER_MAINTENANCE">Under Maintenance</option>
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
                  Location
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("address")}
                    className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                    placeholder="Street, building number"
                  />
                  {errors.address && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("city")}
                    className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                    placeholder="e.g., Riyadh"
                  />
                  {errors.city && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    District
                  </label>
                  <input
                    {...register("district")}
                    className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Neighborhood
                  </label>
                  <input
                    {...register("neighborhood")}
                    className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#eae0d0] bg-white p-5 md:p-6 shadow-[0_8px_24px_rgba(148,117,64,0.05)]">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e6f5ee] text-sm font-semibold text-[#2f6b56]">
                  03
                </div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Property details
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Area (m²) <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("area", { valueAsNumber: true })}
                    type="number"
                    className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                    placeholder="e.g., 120"
                  />
                  {errors.area && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.area.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Bedrooms
                  </label>
                  <input
                    {...register("bedrooms", { valueAsNumber: true })}
                    type="number"
                    className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                    placeholder="e.g., 3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Bathrooms
                  </label>
                  <input
                    {...register("bathrooms", { valueAsNumber: true })}
                    type="number"
                    step="0.5"
                    className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                    placeholder="e.g., 2"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Year Built
                  </label>
                  <input
                    {...register("yearBuilt", { valueAsNumber: true })}
                    type="number"
                    className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                    placeholder="e.g., 2020"
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
                  Financials
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Market Value (SAR) <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("marketValue", { valueAsNumber: true })}
                    type="number"
                    className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                    placeholder="e.g., 750000"
                  />
                  {errors.marketValue && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.marketValue.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Rental Rate (SAR) <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("rentalRate", { valueAsNumber: true })}
                    type="number"
                    className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                    placeholder="e.g., 4000"
                  />
                  {errors.rentalRate && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.rentalRate.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#eae0d0] bg-white p-5 md:p-6 shadow-[0_8px_24px_rgba(148,117,64,0.05)]">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f7e4ef] text-sm font-semibold text-[#8e4f78]">
                  05
                </div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Ownership
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Owner ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("ownerId")}
                    className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                    placeholder="UUID"
                  />
                  {errors.ownerId && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.ownerId.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Manager ID
                  </label>
                  <input
                    {...register("managerId")}
                    className="h-12 w-full rounded-xl border border-[#e7dcc8] bg-[#fffdfb] px-4 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                    placeholder="UUID"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-[#e7dcc8] bg-[#faf5ee] px-4 py-3 text-sm font-medium text-slate-700 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition hover:border-[#d7c3a0]">
                    <span>Furnished</span>
                    <input
                      {...register("furnished")}
                      type="checkbox"
                      className="h-4 w-4 rounded border-[#d7c3a0] text-[#b98d46] focus:ring-[#d9be85]"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#eae0d0] bg-white p-5 md:p-6 shadow-[0_8px_24px_rgba(148,117,64,0.05)]">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e0f1ff] text-sm font-semibold text-[#345d82]">
                  06
                </div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Description
                </h2>
              </div>

              <textarea
                {...register("description")}
                rows={5}
                className="min-h-[140px] w-full rounded-2xl border border-[#e7dcc8] bg-[#fffdfb] px-4 py-3 text-sm text-slate-800 shadow-[0_2px_8px_rgba(15,23,42,0.02)] transition focus:border-[#c9a96d] focus:outline-none focus:ring-4 focus:ring-[#f4e9d5]"
                placeholder="Describe the property, amenities, nearby attractions, and any special features..."
              />
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-[#eee2d0] pt-6">
              <button
                type="button"
                onClick={() => navigate("/properties")}
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
                    ? "Update Property"
                    : "Create Property"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ===== IMAGE UPLOAD SECTION (only when editing) ===== */}
      {id && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Property Images
          </h2>

          <div className="flex items-center space-x-4 mb-6">
            <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition border border-blue-200">
              <PhotoIcon className="w-5 h-5 mr-2" />
              <span>Upload Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
            {uploading && (
              <span className="text-sm text-gray-500">Uploading...</span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
              >
                <img
                  src={
                    img.imageUrl.startsWith("http")
                      ? img.imageUrl
                      : `http://localhost:5000/${img.imageUrl.replace(/\\/g, "/")}`
                  }
                  alt="Property"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-opacity flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
                  {!img.isPrimary && (
                    <button
                      onClick={() => handleSetPrimary(img.id)}
                      className="p-1.5 bg-white rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 shadow"
                    >
                      Primary
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteImage(img.id)}
                    className="p-1.5 bg-white rounded-lg text-red-600 hover:bg-red-50 shadow"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
                {img.isPrimary && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 text-xs font-semibold bg-blue-600 text-white rounded-full shadow">
                    Primary
                  </span>
                )}
              </div>
            ))}
            {images.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-400 text-sm">
                No images uploaded yet.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
