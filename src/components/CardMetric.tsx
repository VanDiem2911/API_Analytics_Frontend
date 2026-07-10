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
  const isPositiveGrowth = isBounceRate ? change < 0 : change > 0;
  const hasChange = change !== 0;
  const isLoading = value === "...";

  // Determine colors based on title, including dark mode support
  const getThemeClasses = () => {
    switch (title) {
      case "Lượt xem trang":
        return {
          iconBg: "bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50",
          topBorder: "border-t-blue-500",
          glowHover: "hover:shadow-[0_15px_30px_-10px_rgba(59,130,246,0.15)] hover:border-blue-200/60 dark:hover:shadow-[0_15px_30px_-10px_rgba(59,130,246,0.3)] dark:hover:border-blue-900/50"
        };
      case "Khách truy cập":
        return {
          iconBg: "bg-purple-50 text-purple-600 border border-purple-100 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/50",
          topBorder: "border-t-purple-500",
          glowHover: "hover:shadow-[0_15px_30px_-10px_rgba(168,85,247,0.15)] hover:border-purple-200/60 dark:hover:shadow-[0_15px_30px_-10px_rgba(168,85,247,0.3)] dark:hover:border-purple-900/50"
        };
      case "Số phiên truy cập":
        return {
          iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50",
          topBorder: "border-t-emerald-500",
          glowHover: "hover:shadow-[0_15px_30px_-10px_rgba(16,185,129,0.15)] hover:border-emerald-200/60 dark:hover:shadow-[0_15px_30px_-10px_rgba(16,185,129,0.3)] dark:hover:border-emerald-900/50"
        };
      case "Thời gian trung bình":
        return {
          iconBg: "bg-orange-50 text-orange-600 border border-orange-100 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-900/50",
          topBorder: "border-t-orange-500",
          glowHover: "hover:shadow-[0_15px_30px_-10px_rgba(249,115,22,0.15)] hover:border-orange-200/60 dark:hover:shadow-[0_15px_30px_-10px_rgba(249,115,22,0.3)] dark:hover:border-orange-900/50"
        };
      case "Tỷ lệ thoát":
        return {
          iconBg: "bg-red-50 text-red-600 border border-red-100 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50",
          topBorder: "border-t-red-500",
          glowHover: "hover:shadow-[0_15px_30px_-10px_rgba(239,68,68,0.15)] hover:border-red-200/60 dark:hover:shadow-[0_15px_30px_-10px_rgba(239,68,68,0.3)] dark:hover:border-red-900/50"
        };
      default:
        return {
          iconBg: "bg-slate-50 text-slate-600 border border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700/50",
          topBorder: "border-t-slate-400",
          glowHover: "hover:shadow-[0_15px_30px_-10px_rgba(148,163,184,0.15)]"
        };
    }
  };

  const theme = getThemeClasses();

  return (
    <div className={`glass p-5 rounded-2xl border-t-2 ${theme.topBorder} ${theme.glowHover} transition-all duration-300 flex flex-col justify-between h-full hover:-translate-y-0.5`}>
      {/* Top Section: Title & Icon */}
      <div className="flex items-start justify-between mb-3">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{title}</span>
          {isLoading ? (
            <div className="skeleton-block h-7 w-24 mt-1.5" />
          ) : (
            <h3 className="text-2xl font-extrabold tracking-tight text-white mt-1">{value}</h3>
          )}
        </div>
        <div className={`p-2 rounded-xl transition-all duration-300 ${theme.iconBg}`}>
          {Icon ? <Icon className="w-4 h-4" /> : <Users2 className="w-4 h-4" />}
        </div>
      </div>

      {/* Bottom Section: Real-time Indicator or Trend Percentage */}
      <div className="mt-2">
        {isLoading ? (
          <div className="skeleton-block h-4 w-16" />
        ) : isOnline ? (
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-900/50 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-600 dark:text-emerald-400 animate-pulse-slow uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Đang hoạt động
          </div>
        ) : hasChange ? (
          <div
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg border ${
              isPositiveGrowth 
                ? "bg-emerald-50/50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/40" 
                : "bg-red-50/50 text-red-600 border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/40"
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
          <span className="text-[10px] uppercase font-bold text-slate-400">Không đổi</span>
        )}
      </div>
    </div>
  );
}
