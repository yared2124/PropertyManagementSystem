export default function Calendar() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
        <p className="text-gray-600">View all events and schedules</p>
      </div>
      <div className="card">
        <div className="grid grid-cols-7 gap-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center py-2 font-medium text-sm text-gray-500"
            >
              {day}
            </div>
          ))}
          {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
            <div
              key={day}
              className="text-center py-2 text-sm hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              {day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
