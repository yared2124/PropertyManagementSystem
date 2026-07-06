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
  blue: "bg-blue-500",
  green: "bg-green-500",
  yellow: "bg-yellow-500",
  purple: "bg-purple-500",
  red: "bg-red-500",
  indigo: "bg-indigo-500",
};

const MetricCard: FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
  trendUp,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
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
        <div className={`p-3 rounded-xl ${colorMap[color]} bg-opacity-10`}>
          <Icon
            className={`w-6 h-6 ${colorMap[color].replace("bg-", "text-")}`}
          />
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
