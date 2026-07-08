export default function Sales() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
        <p className="text-gray-600">Track sales and leads</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900">SAR 78,000</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Leads</p>
          <p className="text-2xl font-bold text-gray-900">12</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Conversion Rate</p>
          <p className="text-2xl font-bold text-gray-900">42%</p>
        </div>
      </div>
    </div>
  );
}
