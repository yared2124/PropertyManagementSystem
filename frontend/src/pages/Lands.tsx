import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import api from "../api/client";

interface Land {
  id: string;
  title: string;
  area: number;
  location: string;
  status: string;
  marketValue: number;
}

export default function Lands() {
  const [lands, setLands] = useState<Land[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If you have a lands endpoint, use it; otherwise show placeholder
    // api.get('/lands').then(({ data }) => setLands(data.data)).finally(() => setLoading(false));
    setLoading(false);
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lands</h1>
          <p className="text-gray-600">Manage land assets</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <PlusIcon className="w-5 h-5" />
          <span>Add Land</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 text-center text-gray-500">
          <p>Land management module coming soon.</p>
          <p className="text-sm mt-2">
            This feature will allow you to track land assets, zones, and
            development plans.
          </p>
        </div>
      </div>
    </div>
  );
}
