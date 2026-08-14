interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusMap: Record<string, string> = {
    AVAILABLE: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    RENTED: "bg-[#eaf2ff] text-[#1f3d73] border border-blue-200",
    UNDER_MAINTENANCE: "bg-[#fdf2d5] text-[#8a6730] border border-[#f0d9a1]",
    PAID: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    OVERDUE: "bg-rose-100 text-rose-700 border border-rose-200",
    PENDING: "bg-[#fdf2d5] text-[#8a6730] border border-[#f0d9a1]",
    ACTIVE: "bg-[#eaf2ff] text-[#1f3d73] border border-blue-200",
    EXPIRED: "bg-slate-200 text-slate-700 border border-slate-300",
    DRAFT: "bg-slate-200 text-slate-700 border border-slate-300",
    REPORTED: "bg-[#fff0e3] text-[#a15d1d] border border-[#f3cb9e]",
    IN_PROGRESS: "bg-[#eaf2ff] text-[#1f3d73] border border-blue-200",
    COMPLETED: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    CANCELLED: "bg-rose-100 text-rose-700 border border-rose-200",
  };

  const colorClass =
    statusMap[status] || "bg-slate-200 text-slate-700 border border-slate-300";

  return (
    <span
      className={`rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${colorClass}`}
    >
      {status}
    </span>
  );
};
