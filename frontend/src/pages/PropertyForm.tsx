import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/client";
import { Property } from "../types";

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
        images.map((img) => ({
          ...img,
          isPrimary: img.id === imageId,
        })),
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {id ? "Edit Property" : "Add New Property"}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title *
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
                Asset Type *
              </label>
              <select {...register("assetType")} className="input-field">
                <option value="APARTMENT">Apartment</option>
                <option value="OFFICE">Office</option>
                <option value="VILLA">Villa</option>
                <option value="WAREHOUSE">Warehouse</option>
                <option value="LAND">Land</option>
                <option value="COMMERCIAL_SPACE">Commercial Space</option>
                <option value="RESIDENTIAL_COMPLEX">Residential Complex</option>
              </select>
              {errors.assetType && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.assetType.message}
                </p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address *
              </label>
              <input {...register("address")} className="input-field" />
              {errors.address && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City *
              </label>
              <input {...register("city")} className="input-field" />
              {errors.city && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                District
              </label>
              <input {...register("district")} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Neighborhood
              </label>
              <input {...register("neighborhood")} className="input-field" />
            </div>
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Area (m²) *
              </label>
              <input
                {...register("area", { valueAsNumber: true })}
                type="number"
                className="input-field"
              />
              {errors.area && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.area.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bedrooms
              </label>
              <input
                {...register("bedrooms", { valueAsNumber: true })}
                type="number"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bathrooms
              </label>
              <input
                {...register("bathrooms", { valueAsNumber: true })}
                type="number"
                step="0.5"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Year Built
              </label>
              <input
                {...register("yearBuilt", { valueAsNumber: true })}
                type="number"
                className="input-field"
              />
            </div>
          </div>

          {/* Financial */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Market Value (SAR) *
              </label>
              <input
                {...register("marketValue", { valueAsNumber: true })}
                type="number"
                className="input-field"
              />
              {errors.marketValue && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.marketValue.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rental Rate (SAR) *
              </label>
              <input
                {...register("rentalRate", { valueAsNumber: true })}
                type="number"
                className="input-field"
              />
              {errors.rentalRate && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.rentalRate.message}
                </p>
              )}
            </div>
          </div>

          {/* Status & Owner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                Owner ID *
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
              <label className="block text-sm font-medium text-gray-700">
                Manager ID
              </label>
              <input
                {...register("managerId")}
                className="input-field"
                placeholder="UUID"
              />
            </div>
          </div>

          {/* Description */}
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

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 text-sm text-gray-700">
              <input
                {...register("furnished")}
                type="checkbox"
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span>Furnished</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
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

      {/* Image Upload Section (only visible when editing) */}
      {id && (
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Property Images
          </h2>
          <div className="flex items-center space-x-4 mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {uploading && (
              <span className="text-sm text-gray-500">Uploading...</span>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((img) => (
              <div key={img.id} className="relative group">
                <img
                  src={
                    img.imageUrl.startsWith("http")
                      ? img.imageUrl
                      : `http://localhost:5000/${img.imageUrl}`
                  }
                  alt="Property"
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity rounded-lg flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
                  {!img.isPrimary && (
                    <button
                      onClick={() => handleSetPrimary(img.id)}
                      className="p-1 bg-white rounded text-xs text-gray-700 hover:bg-gray-100"
                    >
                      Set Primary
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteImage(img.id)}
                    className="p-1 bg-white rounded text-xs text-red-600 hover:bg-gray-100"
                  >
                    Delete
                  </button>
                </div>
                {img.isPrimary && (
                  <span className="absolute top-1 left-1 px-1.5 py-0.5 text-xs font-medium bg-blue-600 text-white rounded">
                    Primary
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
