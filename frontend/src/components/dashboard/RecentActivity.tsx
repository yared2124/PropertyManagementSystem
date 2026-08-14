import { useState, useEffect } from "react";
import api from "../../api/client";
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
    return (
      <div className="rounded-xl bg-[#f9f1e2] px-4 py-8 text-center text-sm font-semibold text-[#8a6730]">
        Loading activity...
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="rounded-xl bg-[#f9f1e2] px-4 py-8 text-center text-sm font-semibold text-[#8a6730]">
        No recent activity
      </div>
    );
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
    <div className="overflow-hidden rounded-xl border border-[#eae0d0]">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#eae0d0] bg-[#f9f1e2] text-left text-xs uppercase text-[#8a6730]">
            <th className="px-4 py-3 font-bold">Activity</th>
            <th className="px-4 py-3 font-bold">User</th>
            <th className="px-4 py-3 font-bold">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#eae0d0] bg-white">
          {activities.map((activity) => (
            <tr
              key={activity.id}
              className="transition-colors hover:bg-[#f9f1e2]/40"
            >
              <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                {getDescription(activity)}
                {activity.entityId && (
                  <span className="ml-1 text-xs font-medium text-slate-400">
                    #{activity.entityId.slice(0, 8)}
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-slate-600">
                {activity.user?.firstName} {activity.user?.lastName}
              </td>
              <td className="px-4 py-3 text-sm text-slate-500">
                {new Date(activity.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
