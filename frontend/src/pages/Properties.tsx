import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Property } from "../types";
import { StatusBadge } from "../components/common/StatusBadge";
import api from "../api/client";

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    api
      .get("/properties")
      .then(({ data }) => setProperties(data.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) &&
      (filterStatus ? p.status === filterStatus : true),
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600">Manage your property portfolio</p>
        </div>
        <Link
          to="/properties/new"
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Property</span>
        </Link>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search properties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="AVAILABLE">Available</option>
          <option value="RENTED">Rented</option>
          <option value="UNDER_MAINTENANCE">Under Maintenance</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((property) => (
          <div
            key={property.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
          >
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-900">
                  {property.title}
                </h3>
                <StatusBadge status={property.status} />
              </div>
              <p className="text-sm text-gray-500 mt-1">{property.address}</p>
              <div className="mt-3 flex items-center space-x-4 text-sm text-gray-600">
                <span>{property.area} m²</span>
                <span>•</span>
                <span>{property.bedrooms || 0} beds</span>
                <span>•</span>
                <span>{property.bathrooms || 0} baths</span>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
                <div>
                  <p className="text-xs text-gray-500">Rent</p>
                  <p className="font-semibold text-gray-900">
                    SAR {property.rentalRate.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Value</p>
                  <p className="font-semibold text-gray-900">
                    SAR {property.marketValue.toLocaleString()}
                  </p>
                </div>
                <Link
                  to={`/properties/${property.id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
