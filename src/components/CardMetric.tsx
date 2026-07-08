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

  // Formatting helper for comparison text
  const formatChange = () => {
    if (change === 0) return "Không đổi";
    const sign = change > 0 ? "+" : "";
    return `${sign}${change}%`;
  };

  return (
    <div className="glass glass-hover p-6 rounded-xl relative overflow-hidden flex flex-col justify-between">
      {/* Top Section: Title & Icon */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-400 font-medium">{title}</span>
        <div className="bg-gray-800/60 p-2 rounded-lg text-red-500 border border-gray-700/30">
          {Icon ? <Icon className="w-5 h-5" /> : <Users2 className="w-5 h-5" />}
        </div>
      </div>

      {/* Middle Section: Value */}
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-3xl font-bold tracking-tight text-white">{value}</h3>
        </div>

        {/* Bottom Section: Real-time Indicator or Trend Percentage */}
        <div>
          {isOnline ? (
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-semibold text-emerald-400 animate-pulse-slow">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              Đang hoạt động
            </div>
          ) : hasChange ? (
            <div
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${
                isPositiveGrowth
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                  : "bg-red-500/10 border border-red-500/20 text-red-400"
              }`}
            >
              {change > 0 ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              {formatChange()}
            </div>
          ) : (
            <div className="bg-gray-800/40 border border-gray-700/20 px-2 py-0.5 rounded-md text-xs text-gray-400">
              0.0%
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
