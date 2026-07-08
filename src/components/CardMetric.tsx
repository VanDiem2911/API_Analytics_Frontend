import { ArrowUpRight, ArrowDownRight, Users2 } from "lucide-react";

interface CardMetricProps {
  title: string;
  value: string | number;
  change?: number;
  isBounceRate?: boolean;
  isOnline?: boolean;
  icon?: any;
}

export default function CardMetric({
  title,
  value,
  change = 0,
  isBounceRate = false,
  isOnline = false,
  icon: Icon,
}: CardMetricProps) {
  // Determine if growth is positive/negative
  // For Bounce Rate, lower is better. For others, higher is better.
  const isPositiveGrowth = isBounceRate ? change < 0 : change > 0;
  const hasChange = change !== 0;

  // Determine icon background and text colors based on title
  const getColorClasses = () => {
    switch (title) {
      case "Lượt xem trang":
        return "bg-blue-50 text-blue-600";
      case "Khách truy cập":
        return "bg-purple-50 text-purple-600";
      case "Số phiên truy cập":
        return "bg-emerald-50 text-emerald-600";
      case "Thời gian trung bình":
        return "bg-orange-50 text-orange-600";
      case "Tỷ lệ thoát":
        return "bg-red-50 text-red-600";
      default:
        return "bg-primary-50 text-primary-600";
    }
  };

  return (
    <div className="card p-5 group hover:scale-[1.01] transition-all duration-200 flex flex-col justify-between h-full">
      {/* Top Section: Title & Icon */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-xs font-medium text-gray-500">{title}</span>
          <h3 className="text-2xl font-bold tracking-tight text-gray-900 mt-1">{value}</h3>
        </div>
        <div className={`p-2 rounded-xl transition-colors duration-200 ${getColorClasses()}`}>
          {Icon ? <Icon className="w-5 h-5" /> : <Users2 className="w-5 h-5" />}
        </div>
      </div>

      {/* Bottom Section: Real-time Indicator or Trend Percentage */}
      <div className="mt-2">
        {isOnline ? (
          <div className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-600 animate-pulse-slow uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Đang hoạt động
          </div>
        ) : hasChange ? (
          <div
            className={`inline-flex items-center gap-0.5 text-xs font-medium ${
              isPositiveGrowth ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {isPositiveGrowth ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5" />
            )}
            <span>
              {isPositiveGrowth ? "▲" : "▼"} {Math.abs(change)}%
            </span>
          </div>
        ) : (
          <span className="text-xs text-gray-400">Không đổi</span>
        )}
      </div>
    </div>
  );
}
