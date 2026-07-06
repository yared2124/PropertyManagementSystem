const activities = [
  {
    id: 1,
    type: "payment",
    description: "Payment received – Contract #CT-2024-001",
    amount: "+SAR 4,500",
    status: "completed",
    date: "2 hours ago",
    user: "John Doe",
  },
  {
    id: 2,
    type: "contract",
    description: "New contract signed – Villa Al Hamra",
    amount: "SAR 12,000",
    status: "active",
    date: "5 hours ago",
    user: "Sarah Smith",
  },
  {
    id: 3,
    type: "maintenance",
    description: "Maintenance request #MNT-2024-045",
    amount: "SAR 800",
    status: "pending",
    date: "1 day ago",
    user: "Ahmed Ali",
  },
];

export default function RecentActivity() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
            <th className="pb-3 font-medium">Activity</th>
            <th className="pb-3 font-medium">Amount</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium">User</th>
            <th className="pb-3 font-medium">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {activities.map((activity) => (
            <tr
              key={activity.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="py-3 text-sm text-gray-900">
                {activity.description}
              </td>
              <td className="py-3 text-sm font-medium text-gray-900">
                {activity.amount}
              </td>
              <td className="py-3">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    activity.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : activity.status === "active"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {activity.status}
                </span>
              </td>
              <td className="py-3 text-sm text-gray-600">{activity.user}</td>
              <td className="py-3 text-sm text-gray-500">{activity.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
