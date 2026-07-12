import { useState, useEffect } from "react";
import api from "../../api/client";
import { StatusBadge } from "../common/StatusBadge";

interface Activity {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  changes: any;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data } = await api.get("/audit-logs?limit=5");
        setActivities(data.data.logs || []);
      } catch (error) {
        console.error("Failed to fetch recent activity:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  if (loading) {
    return <div className="text-sm text-gray-500">Loading activity...</div>;
  }

  if (activities.length === 0) {
    return <div className="text-sm text-gray-500">No recent activity</div>;
  }

  // Map audit actions to friendly descriptions
  const getDescription = (activity: Activity) => {
    const actionMap: Record<string, string> = {
      CREATE_POST_Property: "New property added",
      UPDATE_PUT_Property: "Property updated",
      DELETE_DELETE_Property: "Property deleted",
      CREATE_POST_Contract: "New contract created",
      UPDATE_PUT_Contract: "Contract updated",
      CREATE_POST_Payment: "Payment processed",
      CREATE_POST_Maintenance: "Maintenance request created",
      UPDATE_PUT_Maintenance: "Maintenance status updated",
      CREATE_POST_User: "New user registered",
      LOGIN_POST_Auth: "User logged in",
    };
    return actionMap[activity.action] || activity.action.replace(/_/g, " ");
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
            <th className="pb-3 font-medium">Activity</th>
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
                {getDescription(activity)}
                {activity.entityId && (
                  <span className="text-xs text-gray-400 ml-1">
                    #{activity.entityId.slice(0, 8)}
                  </span>
                )}
              </td>
              <td className="py-3 text-sm text-gray-600">
                {activity.user?.firstName} {activity.user?.lastName}
              </td>
              <td className="py-3 text-sm text-gray-500">
                {new Date(activity.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
