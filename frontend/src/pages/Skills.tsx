export default function Skills() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Skills</h1>
        <p className="text-gray-600">
          Track employee skills and certifications
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="font-semibold text-gray-900">HVAC Technician</h3>
          <p className="text-sm text-gray-500">3 employees</p>
          <div className="mt-2 flex flex-wrap gap-1">
            <span className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-full">
              Certified
            </span>
            <span className="px-2 py-1 text-xs bg-green-50 text-green-600 rounded-full">
              Available
            </span>
          </div>
        </div>
        <div className="card">
          <h3 className="font-semibold text-gray-900">Plumbing</h3>
          <p className="text-sm text-gray-500">2 employees</p>
        </div>
        <div className="card">
          <h3 className="font-semibold text-gray-900">Electrical</h3>
          <p className="text-sm text-gray-500">4 employees</p>
        </div>
      </div>
    </div>
  );
}
