import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  HomeIcon,
  DocumentTextIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { Property } from "../types";
import { StatusBadge } from "../components/common/StatusBadge";
import api from "../api/client";
import { formatCurrency, formatDate } from "../utils/format";

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [images, setImages] = useState<
    { id: string; imageUrl: string; isPrimary: boolean }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/properties/${id}`),
      api.get(`/properties/${id}/images`),
    ])
      .then(([propertyRes, imagesRes]) => {
        setProperty(propertyRes.data.data);
        setImages(imagesRes.data.data);
      })
      .catch(() => navigate("/properties"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    try {
      await api.delete(`/properties/${id}`);
      navigate("/properties");
    } catch (error) {
      console.error("Failed to delete property", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }
  if (!property) {
    return (
      <div className="text-center py-12 text-gray-500">Property not found</div>
    );
  }

  const primaryImage = images.find((img) => img.isPrimary) || images[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/properties")}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {property.title}
            </h1>
            <div className="flex items-center space-x-2 mt-1">
              <MapPinIcon className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">
                {property.address}, {property.city}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            to={`/properties/${id}/edit`}
            className="btn-secondary flex items-center space-x-1"
          >
            <PencilIcon className="w-4 h-4" />
            <span>Edit</span>
          </Link>
          <button
            onClick={handleDelete}
            className="btn-danger flex items-center space-x-1"
          >
            <TrashIcon className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {primaryImage ? (
          <div className="relative h-80 bg-gray-200">
            <img
              src={
                primaryImage.imageUrl.startsWith("http")
                  ? primaryImage.imageUrl
                  : `http://localhost:5000/${primaryImage.imageUrl}`
              }
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 flex gap-2">
              <StatusBadge status={property.status} />
              <span className="px-3 py-1 text-xs font-medium bg-black/50 text-white rounded-full">
                {property.assetType}
              </span>
            </div>
          </div>
        ) : (
          <div className="h-80 bg-gray-200 flex items-center justify-center">
            <PhotoIcon className="w-16 h-16 text-gray-400" />
          </div>
        )}
        {images.length > 1 && (
          <div className="flex overflow-x-auto p-2 gap-2 bg-gray-50">
            {images.map((img) => (
              <img
                key={img.id}
                src={
                  img.imageUrl.startsWith("http")
                    ? img.imageUrl
                    : `http://localhost:5000/${img.imageUrl}`
                }
                alt="Thumbnail"
                className={`w-16 h-16 object-cover rounded border-2 cursor-pointer transition ${
                  img.isPrimary
                    ? "border-blue-500"
                    : "border-transparent hover:border-gray-300"
                }`}
                onClick={() => {
                  // Swap with primary image for preview
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Key Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Key Information
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Property Type</p>
                <p className="font-medium text-gray-900">
                  {property.assetType}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Area</p>
                <p className="font-medium text-gray-900">{property.area} m²</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <div className="mt-1">
                  <StatusBadge status={property.status} />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bedrooms</p>
                <p className="font-medium text-gray-900">
                  {property.bedrooms || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bathrooms</p>
                <p className="font-medium text-gray-900">
                  {property.bathrooms || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Furnished</p>
                <p className="font-medium text-gray-900">
                  {property.furnished ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Year Built</p>
                <p className="font-medium text-gray-900">
                  {property.yearBuilt || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Owner ID</p>
                <p className="font-medium text-gray-900 font-mono text-sm truncate">
                  {property.ownerId}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium text-gray-900">
                  {formatDate(property.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Description
              </h3>
              <p className="text-gray-600 whitespace-pre-wrap">
                {property.description}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Financial Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CurrencyDollarIcon className="w-5 h-5 mr-2 text-gray-500" />
              Financials
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Market Value</span>
                <span className="font-semibold">
                  {formatCurrency(property.marketValue)}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-gray-600">Rental Rate</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(property.rentalRate)} / month
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Potential Yield</span>
                <span className="font-semibold text-blue-600">
                  {property.marketValue > 0
                    ? (
                        ((property.rentalRate * 12) / property.marketValue) *
                        100
                      ).toFixed(1) + "%"
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Link
                to={`/contracts/new?property=${id}`}
                className="w-full btn-primary flex items-center justify-center space-x-2"
              >
                <DocumentTextIcon className="w-4 h-4" />
                <span>Create Contract</span>
              </Link>
              <button className="w-full btn-secondary flex items-center justify-center space-x-2">
                <HomeIcon className="w-4 h-4" />
                <span>Schedule Inspection</span>
              </button>
              <button className="w-full btn-secondary flex items-center justify-center space-x-2">
                <PhotoIcon className="w-4 h-4" />
                <span>Upload Images</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
