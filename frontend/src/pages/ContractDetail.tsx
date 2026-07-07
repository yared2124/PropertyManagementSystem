import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import { Contract } from "../types";
import { StatusBadge } from "../components/common/StatusBadge";
import api from "../api/client";
import { formatCurrency, formatDate } from "../utils/format";

export default function ContractDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/contracts/${id}`)
      .then(({ data }) => setContract(data.data))
      .catch(() => navigate("/contracts"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this contract?")) return;
    try {
      await api.delete(`/contracts/${id}`);
      navigate("/contracts");
    } catch (error) {
      console.error("Failed to delete contract", error);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  if (!contract)
    return <div className="text-center py-12">Contract not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/contracts")}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {contract.title}
            </h1>
            <p className="text-gray-600">{contract.contractNumber}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Link
            to={`/contracts/${id}/edit`}
            className="btn-secondary flex items-center space-x-1"
          >
            <PencilIcon className="w-4 h-4" /> Edit
          </Link>
          <button
            onClick={handleDelete}
            className="btn-danger flex items-center space-x-1"
          >
            <TrashIcon className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <h3 className="text-lg font-semibold mb-4">Contract Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Contract Number</p>
              <p className="font-medium">{contract.contractNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <StatusBadge status={contract.status} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Asset Type</p>
              <p className="font-medium">{contract.assetType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Monthly Rent</p>
              <p className="font-medium">
                {formatCurrency(contract.monthlyRent)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="font-medium">
                {formatCurrency(contract.totalAmount)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Start Date</p>
              <p className="font-medium">{formatDate(contract.startDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">End Date</p>
              <p className="font-medium">{formatDate(contract.endDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-medium">
                {Math.ceil(
                  (new Date(contract.endDate).getTime() -
                    new Date(contract.startDate).getTime()) /
                    (1000 * 60 * 60 * 24 * 30),
                )}{" "}
                months
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full btn-primary flex items-center justify-center space-x-2">
              <DocumentArrowDownIcon className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <button className="w-full btn-secondary">View Payments</button>
            <button className="w-full btn-secondary">Send Reminder</button>
          </div>
        </div>
      </div>
    </div>
  );
}
