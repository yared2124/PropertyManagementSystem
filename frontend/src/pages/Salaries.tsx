import { BanknotesIcon } from "@heroicons/react/24/outline";
import {
  PageHeader,
  Panel,
  PrimaryButton,
  tableCellClass,
  tableClass,
  tableHeadCellClass,
  tableHeadClass,
} from "../components/common/Page";

export default function Salaries() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Payroll"
        title="Salaries"
        description="Manage employee payroll, allowances, deductions, and salary status."
        action={<PrimaryButton>Process Payroll</PrimaryButton>}
      />

      <Panel className="overflow-hidden">
        <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-5 py-4">
          <BanknotesIcon className="h-5 w-5 text-emerald-700" />
          <h3 className="text-sm font-black text-slate-900">Salary Records</h3>
        </div>
        <div className="overflow-x-auto">
          <table className={tableClass}>
            <thead className={tableHeadClass}>
              <tr>
                <th className={tableHeadCellClass}>Employee</th>
                <th className={tableHeadCellClass}>Month</th>
                <th className={tableHeadCellClass}>Basic</th>
                <th className={tableHeadCellClass}>Allowance</th>
                <th className={tableHeadCellClass}>Deduction</th>
                <th className={tableHeadCellClass}>Net</th>
                <th className={tableHeadCellClass}>Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              <tr className="transition hover:bg-cyan-50/50">
                <td className={`${tableCellClass} font-black text-slate-950`}>John Doe</td>
                <td className={`${tableCellClass} text-slate-600`}>June 2024</td>
                <td className={`${tableCellClass} text-slate-900`}>SAR 10,000</td>
                <td className={`${tableCellClass} text-slate-600`}>SAR 2,000</td>
                <td className={`${tableCellClass} text-slate-600`}>SAR 500</td>
                <td className={`${tableCellClass} font-black text-slate-950`}>SAR 11,500</td>
                <td className={tableCellClass}>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700">
                    Paid
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
