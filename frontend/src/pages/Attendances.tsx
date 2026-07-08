export default function Attendances() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendances</h1>
        <p className="text-gray-600">Track employee attendance</p>
      </div>
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Today's Attendance</h3>
          <div className="flex space-x-2">
            <label htmlFor="attendance-date" className="sr-only">
              Select Date
            </label>
            <input
              id="attendance-date"
              type="date"
              className="input-field w-auto"
              title="Select attendance date"
              placeholder="Select date"
              defaultValue={new Date().toISOString().split("T")[0]}
            />
            <button
              className="btn-primary"
              title="Mark attendance for selected date"
            >
              Mark Attendance
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-left text-sm text-gray-500">
                <th className="px-4 py-3 font-medium">Employee</th>
                <th className="px-4 py-3 font-medium">Check In</th>
                <th className="px-4 py-3 font-medium">Check Out</th>
                <th className="px-4 py-3 font-medium">Hours</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900">John Doe</td>
                <td className="px-4 py-3 text-sm text-gray-600">09:00 AM</td>
                <td className="px-4 py-3 text-sm text-gray-600">06:00 PM</td>
                <td className="px-4 py-3 text-sm text-gray-600">8h</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    Present
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
