import { useEffect, useState } from "react";
import { BanknotesIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Payment } from "../types";
import { StatusBadge } from "../components/common/StatusBadge";
import {
  EmptyState,
  LoadingState,
  PageHeader,
  Panel,
  tableCellClass,
  tableClass,
  tableHeadCellClass,
  tableHeadClass,
} from "../components/common/Page";
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

  if (loading) return <LoadingState label="Loading payments..." />;

  const totalPaid = payments
    .filter((p) => p.status === "PAID")
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Finance"
        title="Payments"
        description="View payment history, due dates, methods, and current collection status."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Total Paid", `SAR ${totalPaid.toLocaleString()}`, "bg-emerald-50 text-emerald-700"],
          ["Records", payments.length, "bg-cyan-50 text-cyan-700"],
          ["Pending", payments.filter((p) => p.status === "PENDING").length, "bg-amber-50 text-amber-700"],
        ].map(([label, value, tone]) => (
          <Panel key={label as string} className="p-5">
            <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}>
              <BanknotesIcon className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
          </Panel>
        ))}
      </div>

      <Panel className="overflow-hidden">
        {payments.length === 0 ? (
          <div className="p-5">
            <EmptyState title="No payments found" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead className={tableHeadClass}>
                <tr>
                  <th className={tableHeadCellClass}>Payment #</th>
                  <th className={tableHeadCellClass}>Amount</th>
                  <th className={tableHeadCellClass}>Date</th>
                  <th className={tableHeadCellClass}>Due Date</th>
                  <th className={tableHeadCellClass}>Method</th>
                  <th className={tableHeadCellClass}>Status</th>
                  <th className={tableHeadCellClass}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {payments.map((p) => (
                  <tr key={p.id} className="transition hover:bg-cyan-50/50">
                    <td className={`${tableCellClass} font-black text-slate-950`}>
                      {p.paymentNumber}
                    </td>
                    <td className={`${tableCellClass} font-bold text-slate-950`}>
                      SAR {p.amount.toLocaleString()}
                    </td>
                    <td className={`${tableCellClass} text-slate-600`}>
                      {new Date(p.paymentDate).toLocaleDateString()}
                    </td>
                    <td className={`${tableCellClass} text-slate-600`}>
                      {new Date(p.dueDate).toLocaleDateString()}
                    </td>
                    <td className={`${tableCellClass} text-slate-600`}>
                      {p.method.replace("_", " ")}
                    </td>
                    <td className={tableCellClass}>
                      <StatusBadge status={p.status} />
                    </td>
                    <td className={tableCellClass}>
                      <button className="inline-flex items-center gap-1 font-bold text-cyan-700 hover:text-cyan-900">
                        <EyeIcon className="h-4 w-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
