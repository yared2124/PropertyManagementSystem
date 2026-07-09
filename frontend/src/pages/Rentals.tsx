import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/outline";
import api from "../api/client";

export default function Rentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If you have a rentals endpoint, use it
    // api.get('/rentals').then(({ data }) => setRentals(data.data)).finally(() => setLoading(false));
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
          <h1 className="text-2xl font-bold text-gray-900">Rentals</h1>
          <p className="text-gray-600">Manage active rental agreements</p>
        </div>
        <Link
          to="/contracts/new"
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>New Rental</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 text-center text-gray-500">
          <p>Rental management module coming soon.</p>
          <p className="text-sm mt-2">
            This feature will display all active rental agreements, payment
            status, and lease terms.
          </p>
        </div>
      </div>
    </div>
  );
}
