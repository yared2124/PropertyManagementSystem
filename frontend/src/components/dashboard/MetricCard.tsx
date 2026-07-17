import { FC } from "react";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/solid";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: any;
  color: "blue" | "green" | "yellow" | "purple" | "red" | "indigo";
  trend?: string;
  trendUp?: boolean;
}

const colorMap = {
  blue: {
    icon: "bg-blue-50 text-blue-600 ring-blue-100",
    accent: "from-blue-500 to-cyan-500",
  },
  green: {
    icon: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    accent: "from-emerald-500 to-teal-500",
  },
  yellow: {
    icon: "bg-amber-50 text-amber-600 ring-amber-100",
    accent: "from-amber-500 to-orange-500",
  },
  purple: {
    icon: "bg-violet-50 text-violet-600 ring-violet-100",
    accent: "from-violet-500 to-fuchsia-500",
  },
  red: {
    icon: "bg-rose-50 text-rose-600 ring-rose-100",
    accent: "from-rose-500 to-red-500",
  },
  indigo: {
    icon: "bg-indigo-50 text-indigo-600 ring-indigo-100",
    accent: "from-indigo-500 to-sky-500",
  },
};

const MetricCard: FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
  trendUp,
}) => {
  const colors = colorMap[color];

  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${colors.accent}`}
      />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 truncate text-2xl font-bold tracking-normal text-gray-950">
            {value}
          </p>
          {trend && (
            <div className="mt-3 flex items-center gap-1">
              {trendUp ? (
                <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />
              )}
              <span
                className={`text-sm font-medium ${trendUp ? "text-green-600" : "text-red-600"}`}
              >
                {trend}
              </span>
            </div>
          )}
        </div>
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ring-1 ${colors.icon}`}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
