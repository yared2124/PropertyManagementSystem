import { useState, useEffect } from "react";
import { Payment } from "../types";
import { StatusBadge } from "../components/common/StatusBadge";
import api from "../api/client";

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/payments")
      .then(({ data }) => setPayments(data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-600">View and manage all payments</p>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left text-sm text-gray-500">
              <th className="px-6 py-3 font-medium">Payment #</th>
              <th className="px-6 py-3 font-medium">Amount</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Due Date</th>
              <th className="px-6 py-3 font-medium">Method</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {p.paymentNumber}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  SAR {p.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(p.paymentDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(p.dueDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{p.method}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={p.status} />
                </td>
                <td className="px-6 py-4 text-sm">
                  <button className="text-blue-600 hover:text-blue-800">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
