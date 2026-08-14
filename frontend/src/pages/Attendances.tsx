import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import {
  PageHeader,
  Panel,
  PrimaryButton,
  tableCellClass,
  tableClass,
  tableHeadCellClass,
  tableHeadClass,
} from "../components/common/Page";

export default function Attendances() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Team"
        title="Attendances"
        description="Track check-ins, check-outs, daily hours, and staff attendance status."
      />

      <Panel className="overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <CalendarDaysIcon className="h-5 w-5 text-cyan-700" />
            <h3 className="text-sm font-black text-slate-900">
              Today's Attendance
            </h3>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label htmlFor="attendance-date" className="sr-only">
              Select Date
            </label>
            <input
              id="attendance-date"
              type="date"
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              title="Select attendance date"
              defaultValue={new Date().toISOString().split("T")[0]}
            />
            <PrimaryButton>Mark Attendance</PrimaryButton>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className={tableClass}>
            <thead className={tableHeadClass}>
              <tr>
                <th className={tableHeadCellClass}>Employee</th>
                <th className={tableHeadCellClass}>Check In</th>
                <th className={tableHeadCellClass}>Check Out</th>
                <th className={tableHeadCellClass}>Hours</th>
                <th className={tableHeadCellClass}>Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              <tr className="transition hover:bg-cyan-50/50">
                <td className={`${tableCellClass} font-black text-slate-950`}>John Doe</td>
                <td className={`${tableCellClass} text-slate-600`}>09:00 AM</td>
                <td className={`${tableCellClass} text-slate-600`}>06:00 PM</td>
                <td className={`${tableCellClass} text-slate-600`}>8h</td>
                <td className={tableCellClass}>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700">
                    Present
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
