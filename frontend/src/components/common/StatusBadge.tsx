interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusMap: Record<string, string> = {
    AVAILABLE: "bg-green-100 text-green-800",
    RENTED: "bg-blue-100 text-blue-800",
    UNDER_MAINTENANCE: "bg-yellow-100 text-yellow-800",
    PAID: "bg-green-100 text-green-800",
    OVERDUE: "bg-red-100 text-red-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    ACTIVE: "bg-blue-100 text-blue-800",
    EXPIRED: "bg-gray-100 text-gray-800",
    DRAFT: "bg-gray-100 text-gray-800",
    REPORTED: "bg-orange-100 text-orange-800",
    IN_PROGRESS: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  const colorClass = statusMap[status] || "bg-gray-100 text-gray-800";

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}
    >
      {status}
    </span>
  );
};
