import { Copy, Filter } from "lucide-react";

interface BreakdownItem {
  name: string;
  count: number;
}

interface ListBreakdownProps {
  title: string;
  columnName: string;
  data: BreakdownItem[];
  onFilterClick?: (name: string) => void;
}

export default function ListBreakdown({
  title,
  columnName,
  data,
  onFilterClick,
}: ListBreakdownProps) {
  // Find maximum value to calculate relative percentages for background bars
  const max = data.length > 0 ? Math.max(...data.map((item) => item.count)) : 1;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="glass p-6 rounded-xl flex flex-col h-[400px]">
      {/* Header */}
      <div className="mb-4">
        <h4 className="text-lg font-bold text-white">{title}</h4>
      </div>

      {/* Columns Header */}
      <div className="flex justify-between items-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1 mb-2 border-b border-gray-800/40">
        <span>{columnName}</span>
        <span>Lượt xem / Khách</span>
      </div>

      {/* Items Scrollable List */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-gray-500 italic">
            Không có dữ liệu
          </div>
        ) : (
          data.map((item, index) => {
            const percentage = max > 0 ? (item.count / max) * 100 : 0;

            return (
              <div
                key={`${item.name}-${index}`}
                className="group relative flex items-center justify-between text-xs py-2 px-3 rounded-lg overflow-hidden border border-transparent hover:border-gray-800/60 transition-all duration-200"
              >
                {/* Horizontal Relative Background Bar */}
                <div
                  className="absolute left-0 top-0 bottom-0 bg-red-500/10 rounded-l-lg transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                ></div>

                {/* Left Side: Name and Actions */}
                <div className="relative flex items-center gap-2 max-w-[70%] z-10">
                  <span className="text-gray-300 font-medium truncate">{item.name}</span>
                  
                  {/* Hover utility buttons */}
                  <div className="hidden group-hover:flex items-center gap-1.5 ml-2">
                    <button
                      onClick={() => copyToClipboard(item.name)}
                      className="p-1 text-gray-400 hover:text-red-500 hover:bg-gray-800 rounded transition-all duration-150"
                      title="Sao chép"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    {onFilterClick && (
                      <button
                        onClick={() => onFilterClick(item.name)}
                        className="p-1 text-gray-400 hover:text-red-500 hover:bg-gray-800 rounded transition-all duration-150"
                        title="Lọc theo mục này"
                      >
                        <Filter className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Right Side: Count */}
                <div className="relative z-10 text-right font-bold text-gray-200">
                  {item.count.toLocaleString()}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
