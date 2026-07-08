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

  // Custom tooltips to fit our light theme perfectly
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 border border-gray-200 p-4 rounded-lg shadow-xl backdrop-blur-md">
          <p className="text-xs font-semibold text-gray-500 mb-2">{label}</p>
          {payload.map((pld: any) => (
            <div key={pld.name} className="flex items-center gap-4 justify-between text-xs py-0.5">
              <span className="flex items-center gap-1.5 font-medium" style={{ color: pld.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: pld.color }}></span>
                {pld.name === "pageViews" ? "Xem trang" : pld.name === "visitors" ? "Khách truy cập" : "Số phiên"}
              </span>
              <span className="font-bold text-gray-800">{pld.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card flex flex-col justify-between">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h4 className="text-lg font-bold text-gray-900">Xu hướng lưu lượng</h4>
          <p className="text-xs text-gray-500 font-medium">Xem thống kê lượt xem trang và số khách truy cập theo thời gian</p>
        </div>

        {/* Metric Selector Controls */}
        <div className="flex bg-gray-100 border border-gray-200/60 p-1 rounded-lg text-xs font-semibold self-start shadow-inner">
          <button
            onClick={() => setActiveMetric("all")}
            className={`px-3 py-1.5 rounded-md transition-all duration-200 ${
              activeMetric === "all" ? "bg-red-600 text-white font-semibold shadow-sm" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setActiveMetric("pv")}
            className={`px-3 py-1.5 rounded-md transition-all duration-200 ${
              activeMetric === "pv" ? "bg-red-600 text-white font-semibold shadow-sm" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Lượt xem
          </button>
          <button
            onClick={() => setActiveMetric("uv")}
            className={`px-3 py-1.5 rounded-md transition-all duration-200 ${
              activeMetric === "uv" ? "bg-red-600 text-white font-semibold shadow-sm" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Khách
          </button>
          <button
            onClick={() => setActiveMetric("sess")}
            className={`px-3 py-1.5 rounded-md transition-all duration-200 ${
              activeMetric === "sess" ? "bg-red-600 text-white font-semibold shadow-sm" : "text-gray-500 hover:text-gray-800"
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
                <stop offset="5%" stopColor="#dc2626" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSess" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.15} vertical={false} />
            
            <XAxis
              dataKey="label"
              stroke="#9ca3af"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#9ca3af"
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
                stroke="#dc2626"
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
                stroke="#a855f7"
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
