import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface BreakdownItem {
  name: string;
  count: number;
}

interface ChartPieBreakdownProps {
  title: string;
  subtitle: string;
  data: BreakdownItem[];
}

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f97316", "#10b981", "#64748b"];
 
export default function ChartPieBreakdown({ title, subtitle, data }: ChartPieBreakdownProps) {
  const total = data.reduce((acc, curr) => acc + curr.count, 0);
 
  // Filter out items with 0 count
  const chartData = data.filter((item) => item.count > 0);
 
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = total > 0 ? ((payload[0].value / total) * 100).toFixed(1) : 0;
      return (
        <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-xl backdrop-blur-md">
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{payload[0].name}</p>
          <div className="flex gap-4 items-center justify-between text-xs mt-1.5">
            <span className="text-slate-400 dark:text-slate-500">Số lượng:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{payload[0].value.toLocaleString()}</span>
          </div>
          <div className="flex gap-4 items-center justify-between text-xs py-0.5">
            <span className="text-slate-400 dark:text-slate-500">Tỷ lệ:</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">{percentage}%</span>
          </div>
        </div>
      );
    }
    return null;
  };
 
  return (
    <div className="glass p-6 rounded-2xl flex flex-col justify-between h-full">
      {/* Title */}
      <div className="mb-4">
        <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{title}</h4>
        <p className="text-xs text-slate-400 dark:text-slate-550 font-semibold mt-0.5">{subtitle}</p>
      </div>
 
      {chartData.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-12 text-xs text-slate-450 dark:text-slate-500 italic">
          Không có dữ liệu thống kê
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-4 flex-1">
          {/* Donut PieChart */}
          <div className="w-40 h-40 relative flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {chartData.map((_entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Summary Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">{total.toLocaleString()}</span>
              <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-extrabold mt-1">
                Tổng số
              </span>
            </div>
          </div>
 
          {/* Detailed Legend List with percentages */}
          <div className="flex-1 w-full space-y-2.5 max-h-40 overflow-y-auto pr-1">
            {chartData.slice(0, 5).map((item, index) => {
              const pct = total > 0 ? ((item.count / total) * 100).toFixed(1) : "0.0";
              const color = COLORS[index % COLORS.length];
 
              return (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 max-w-[140px] truncate">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }}></span>
                    <span className="text-slate-700 dark:text-slate-350 font-semibold truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <span className="text-slate-900 dark:text-slate-100 font-bold">{item.count.toLocaleString()}</span>
                    <span className="text-slate-400 dark:text-slate-500 font-bold w-10">{pct}%</span>
                  </div>
                </div>
              );
            })}
            
            {chartData.length > 5 && (
              <div className="text-[10px] text-slate-400 dark:text-slate-500 text-center pt-1.5 italic font-medium">
                và {chartData.length - 5} mục khác...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
