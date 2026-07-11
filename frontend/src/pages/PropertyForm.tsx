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
    <div className="max-w-5xl mx-auto space-y-6">
      {/* ===== Form Card ===== */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {id ? "Edit Property" : "Add New Property"}
          </h1>
          <button
            type="button"
            onClick={() => navigate("/properties")}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* ===== SECTION: Basic Information ===== */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("title")}
                  className="input-field"
                  placeholder="e.g., Luxury Apartment Downtown"
                />
                {errors.title && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Asset Type <span className="text-red-500">*</span>
                </label>
                <select {...register("assetType")} className="input-field">
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
                  <p className="text-red-600 text-sm mt-1">
                    {errors.assetType.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* ===== SECTION: Location ===== */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Location
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("address")}
                  className="input-field"
                  placeholder="Street, building number"
                />
                {errors.address && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("city")}
                  className="input-field"
                  placeholder="e.g., Riyadh"
                />
                {errors.city && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.city.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  District
                </label>
                <input
                  {...register("district")}
                  className="input-field"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Neighborhood
                </label>
                <input
                  {...register("neighborhood")}
                  className="input-field"
                  placeholder="Optional"
                />
              </div>
            </div>
          </section>

          {/* ===== SECTION: Property Details ===== */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Property Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Area (m²) <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("area", { valueAsNumber: true })}
                  type="number"
                  className="input-field"
                  placeholder="e.g., 120"
                />
                {errors.area && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.area.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrooms
                </label>
                <input
                  {...register("bedrooms", { valueAsNumber: true })}
                  type="number"
                  className="input-field"
                  placeholder="e.g., 3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bathrooms
                </label>
                <input
                  {...register("bathrooms", { valueAsNumber: true })}
                  type="number"
                  step="0.5"
                  className="input-field"
                  placeholder="e.g., 2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year Built
                </label>
                <input
                  {...register("yearBuilt", { valueAsNumber: true })}
                  type="number"
                  className="input-field"
                  placeholder="e.g., 2020"
                />
              </div>
            </div>
          </section>

          {/* ===== SECTION: Financials ===== */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Financials
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Market Value (SAR) <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("marketValue", { valueAsNumber: true })}
                  type="number"
                  className="input-field"
                  placeholder="e.g., 750000"
                />
                {errors.marketValue && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.marketValue.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rental Rate (SAR) <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("rentalRate", { valueAsNumber: true })}
                  type="number"
                  className="input-field"
                  placeholder="e.g., 4000"
                />
                {errors.rentalRate && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.rentalRate.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* ===== SECTION: Status & Ownership ===== */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Status & Ownership
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select {...register("status")} className="input-field">
                  <option value="AVAILABLE">Available</option>
                  <option value="RENTED">Rented</option>
                  <option value="UNDER_MAINTENANCE">Under Maintenance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner ID <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("ownerId")}
                  className="input-field"
                  placeholder="UUID"
                />
                {errors.ownerId && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.ownerId.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Manager ID
                </label>
                <input
                  {...register("managerId")}
                  className="input-field"
                  placeholder="UUID"
                />
              </div>
            </div>
          </section>

          {/* ===== SECTION: Description & Furnished ===== */}
          <section>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  rows={4}
                  className="input-field"
                  placeholder="Describe the property..."
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  {...register("furnished")}
                  type="checkbox"
                  id="furnished"
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="furnished" className="text-sm text-gray-700">
                  Furnished
                </label>
              </div>
            </div>
          </section>

          {/* ===== FORM ACTIONS ===== */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/properties")}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading
                ? "Saving..."
                : id
                  ? "Update Property"
                  : "Create Property"}
            </button>
          </div>
        </form>
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
