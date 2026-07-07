export default function Salaries() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Salaries</h1>
        <p className="text-gray-600">Manage employee payroll</p>
      </div>
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Salary Records</h3>
          <button className="btn-primary">Process Payroll</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-left text-sm text-gray-500">
                <th className="px-4 py-3 font-medium">Employee</th>
                <th className="px-4 py-3 font-medium">Month</th>
                <th className="px-4 py-3 font-medium">Basic</th>
                <th className="px-4 py-3 font-medium">Allowance</th>
                <th className="px-4 py-3 font-medium">Deduction</th>
                <th className="px-4 py-3 font-medium">Net</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900">John Doe</td>
                <td className="px-4 py-3 text-sm text-gray-600">June 2024</td>
                <td className="px-4 py-3 text-sm text-gray-900">SAR 10,000</td>
                <td className="px-4 py-3 text-sm text-gray-600">SAR 2,000</td>
                <td className="px-4 py-3 text-sm text-gray-600">SAR 500</td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                  SAR 11,500
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    Paid
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
