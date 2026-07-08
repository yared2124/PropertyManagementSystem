import { useState } from "react";
import {
  BellIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export default function Notifications() {
  const [notifications] = useState([
    {
      id: 1,
      title: "Payment Received",
      message: "SAR 4,500 received from John Doe",
      time: "2 hours ago",
      read: false,
      type: "success",
    },
    {
      id: 2,
      title: "Maintenance Request",
      message: "New maintenance request #MNT-2024-001",
      time: "5 hours ago",
      read: false,
      type: "warning",
    },
    {
      id: 3,
      title: "Contract Expiring",
      message: "Contract CT-2024-001 expires in 7 days",
      time: "1 day ago",
      read: true,
      type: "info",
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Stay updated with recent activities</p>
        </div>
        <button className="btn-secondary">Mark All Read</button>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`bg-white rounded-xl shadow-sm border p-4 ${!notif.read ? "border-blue-200 bg-blue-50/30" : "border-gray-100"}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                {notif.type === "success" && (
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mt-1" />
                )}
                {notif.type === "warning" && (
                  <ClockIcon className="w-5 h-5 text-yellow-500 mt-1" />
                )}
                {notif.type === "info" && (
                  <BellIcon className="w-5 h-5 text-blue-500 mt-1" />
                )}
                <div>
                  <h4 className="font-medium text-gray-900">{notif.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                </div>
              </div>
              {!notif.read && (
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
