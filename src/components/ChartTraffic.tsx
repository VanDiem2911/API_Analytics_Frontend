import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TrafficData {
  label: string;
  pageViews: number;
  visitors: number;
  sessions: number;
}

interface ChartTrafficProps {
  data: TrafficData[];
}

export default function ChartTraffic({ data }: ChartTrafficProps) {
  const [activeMetric, setActiveMetric] = useState<"all" | "pv" | "uv" | "sess">("all");

  // Show a beautiful simulated chart skeleton if loading or empty
  if (!data || data.length === 0) {
    return (
      <div className="glass p-6 rounded-2xl h-[380px] flex flex-col justify-between">
        <div className="space-y-2">
          <div className="h-5 w-40 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
          <div className="h-3.5 w-72 bg-slate-100 dark:bg-slate-800/60 rounded-md animate-pulse" />
        </div>
        <div className="flex-1 flex items-end gap-3.5 mt-8 px-2">
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              className="bg-slate-150 dark:bg-slate-800/60 rounded-t-lg animate-pulse w-full transition-all duration-300"
              style={{ 
                height: `${[35, 45, 20, 60, 80, 50, 75, 40, 90, 55, 30, 65, 40, 50][i]}%`,
                animationDelay: `${i * 60}ms`
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Custom tooltips with support for dark mode
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xl backdrop-blur-md transition-colors duration-250">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">{label}</p>
          {payload.map((pld: any) => (
            <div key={pld.name} className="flex items-center gap-6 justify-between text-xs py-1">
              <span className="flex items-center gap-2 font-semibold" style={{ color: pld.color }}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pld.color }}></span>
                {pld.name === "pageViews" ? "Xem trang" : pld.name === "visitors" ? "Khách truy cập" : "Số phiên"}
              </span>
              <span className="font-extrabold text-slate-800 dark:text-slate-100">{pld.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Determine grid line color by checking document class
  const isDark = document.documentElement.classList.contains("dark");
  const gridColor = isDark ? "#1e293b" : "#f1f5f9";

  return (
    <div className="glass p-6 rounded-2xl flex flex-col justify-between h-full">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h4 className="text-base font-extrabold text-white">Xu hướng lưu lượng</h4>
          <p className="text-xs text-slate-300 font-semibold mt-0.5">
            Thống kê lượt xem trang, khách truy cập và số phiên theo thời gian
          </p>
        </div>

        {/* Metric Selector Controls */}
        <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl text-xs font-bold self-start shadow-sm">
          <button
            onClick={() => setActiveMetric("all")}
            className={`px-3 py-1.5 rounded-lg border transition-all duration-300 ${
              activeMetric === "all"
                ? "bg-white/10 border-white/20 text-white font-extrabold shadow-md"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setActiveMetric("pv")}
            className={`px-3 py-1.5 rounded-lg border transition-all duration-300 ${
              activeMetric === "pv"
                ? "bg-white/10 border-white/20 text-white font-extrabold shadow-md"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Lượt xem
          </button>
          <button
            onClick={() => setActiveMetric("uv")}
            className={`px-3 py-1.5 rounded-lg border transition-all duration-300 ${
              activeMetric === "uv"
                ? "bg-white/10 border-white/20 text-white font-extrabold shadow-md"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Khách
          </button>
          <button
            onClick={() => setActiveMetric("sess")}
            className={`px-3 py-1.5 rounded-lg border transition-all duration-300 ${
              activeMetric === "sess"
                ? "bg-white/10 border-white/20 text-white font-extrabold shadow-md"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Phiên
          </button>
        </div>
      </div>

      {/* Recharts Area Container */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            {/* Glow Color Gradients definition */}
            <defs>
              <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSess" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            
            <XAxis
              dataKey="label"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => v.toLocaleString()}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            {(activeMetric === "all" || activeMetric === "pv") && (
              <Area
                type="monotone"
                name="pageViews"
                dataKey="pageViews"
                stroke="#ef4444"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPv)"
              />
            )}
            
            {(activeMetric === "all" || activeMetric === "uv") && (
              <Area
                type="monotone"
                name="visitors"
                dataKey="visitors"
                stroke="#8b5cf6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorUv)"
              />
            )}

            {(activeMetric === "all" || activeMetric === "sess") && (
              <Area
                type="monotone"
                name="sessions"
                dataKey="sessions"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSess)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
