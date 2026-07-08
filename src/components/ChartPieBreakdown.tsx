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

const COLORS = ["#E51924", "#f43f5e", "#f97316", "#eab308", "#cbd5e1", "#fda4af", "#b91c1c"];

export default function ChartPieBreakdown({ title, subtitle, data }: ChartPieBreakdownProps) {
  const total = data.reduce((acc, curr) => acc + curr.count, 0);

  // Filter out items with 0 count
  const chartData = data.filter((item) => item.count > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = total > 0 ? ((payload[0].value / total) * 100).toFixed(1) : 0;
      return (
        <div className="bg-white border border-gray-200 p-2.5 rounded-lg shadow-lg">
          <p className="text-xs font-bold text-gray-800">{payload[0].name}</p>
          <div className="flex gap-4 items-center justify-between text-xs mt-1">
            <span className="text-gray-400">Số lượng:</span>
            <span className="font-semibold text-gray-800">{payload[0].value.toLocaleString()}</span>
          </div>
          <div className="flex gap-4 items-center justify-between text-xs py-0.5">
            <span className="text-gray-400">Tỷ lệ:</span>
            <span className="font-semibold text-red-500">{percentage}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card flex flex-col justify-between h-full">
      {/* Title */}
      <div className="mb-4">
        <h4 className="text-lg font-bold text-gray-900">{title}</h4>
        <p className="text-xs text-gray-500 font-medium">{subtitle}</p>
      </div>

      {chartData.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-12 text-sm text-gray-500">
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
                  innerRadius={50}
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
              <span className="text-2xl font-extrabold text-gray-950">{total.toLocaleString()}</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                Tổng cộng
              </span>
            </div>
          </div>

          {/* Detailed Legend List with percentages */}
          <div className="flex-1 w-full space-y-2 max-h-40 overflow-y-auto pr-1">
            {chartData.slice(0, 5).map((item, index) => {
              const pct = total > 0 ? ((item.count / total) * 100).toFixed(1) : "0.0";
              const color = COLORS[index % COLORS.length];

              return (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 max-w-[140px] truncate">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }}></span>
                    <span className="text-gray-700 font-medium truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <span className="text-gray-500 font-bold">{item.count.toLocaleString()}</span>
                    <span className="text-red-500 font-bold w-10">{pct}%</span>
                  </div>
                </div>
              );
            })}
            
            {chartData.length > 5 && (
              <div className="text-[10px] text-gray-500 text-center pt-1 italic">
                và {chartData.length - 5} mục khác...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
