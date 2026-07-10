import { useState, useEffect } from "react";
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
  heightClass?: string;
  isLoading?: boolean;
}

export default function ListBreakdown({
  title,
  columnName,
  data,
  onFilterClick,
  heightClass = "h-[400px]",
  isLoading = false,
}: ListBreakdownProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger progress bar slide-in transition after component mount
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, [data]);

  // Find maximum value to calculate relative percentages for background bars
  const max = data.length > 0 ? Math.max(...data.map((item) => item.count)) : 1;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Flag emoji mapper based on country name or code
  const getCountryFlag = (name: string) => {
    const n = name.toLowerCase().trim();
    if (n.includes("vietnam") || n.includes("việt nam") || n === "vn") return "🇻🇳";
    if (n.includes("united states") || n.includes("mỹ") || n === "us") return "🇺🇸";
    if (n.includes("japan") || n.includes("nhật bản") || n === "jp") return "🇯🇵";
    if (n.includes("korea") || n.includes("hàn quốc") || n === "kr") return "🇰🇷";
    if (n.includes("china") || n.includes("trung quốc") || n === "cn") return "🇨🇳";
    if (n.includes("singapore") || n === "sg") return "🇸🇬";
    if (n.includes("germany") || n.includes("đức") || n === "de") return "🇩🇪";
    if (n.includes("france") || n.includes("pháp") || n === "fr") return "🇫🇷";
    if (n.includes("united kingdom") || n.includes("anh") || n === "gb" || n === "uk") return "🇬🇧";
    if (n.includes("canada") || n === "ca") return "🇨🇦";
    if (n.includes("australia") || n === "au") return "🇦🇺";
    if (n.includes("russia") || n.includes("nga") || n === "ru") return "🇷🇺";
    return "🌐"; // generic globe
  };

  // Referrer icon/emoji based on domain name
  const getReferrerIcon = (name: string) => {
    const r = name.toLowerCase().trim();
    if (r.includes("google")) return "🔍";
    if (r.includes("facebook") || r.includes("fb")) return "👥";
    if (r.includes("github")) return "💻";
    if (r.includes("youtube")) return "📺";
    if (r.includes("twitter") || r.includes("t.co") || r.includes("x.com")) return "🐦";
    if (r.includes("direct") || r.includes("trực tiếp") || r === "") return "🚪";
    return "🔗";
  };

  return (
    <div className={`glass p-6 flex flex-col ${heightClass}`}>
      {/* Header */}
      <div className="mb-4">
        <h4 className="text-base font-extrabold text-white">{title}</h4>
      </div>

      {/* Columns Header */}
      <div className="flex justify-between items-center text-[10px] font-bold text-slate-300 uppercase tracking-widest px-2 pb-2 mb-3 border-b border-white/10">
        <span>{columnName}</span>
        <span>Lượt xem / Khách</span>
      </div>

      {/* Items Scrollable List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {isLoading ? (
          <div className="space-y-2.5">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                <div className="skeleton-block h-3.5 w-2/3" />
                <div className="skeleton-block h-4 w-12 rounded-lg" />
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="dashboard-empty-state h-full flex items-center justify-center rounded-2xl text-xs text-slate-500 dark:text-slate-300 italic">
            Không có dữ liệu
          </div>
        ) : (
          data.map((item, index) => {
            const percentage = max > 0 ? (item.count / max) * 100 : 0;
            const isCountry = title === "Quốc gia";
            const isReferrer = title === "Nguồn giới thiệu";

            return (
              <div
                key={`${item.name}-${index}`}
                className="group relative flex items-center justify-between text-xs py-2.5 px-3 rounded-xl overflow-hidden border border-transparent hover:border-white/10 hover:bg-white/5 transition-all duration-200"
              >
                {/* Horizontal Relative Background Bar with animated slide-in */}
                <div
                  className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-red-500/10 to-red-500/[0.02] dark:from-red-500/15 dark:to-red-500/[0.03] rounded-l-xl transition-all duration-1000 ease-out"
                  style={{ width: mounted ? `${percentage}%` : "0%" }}
                ></div>

                {/* Left Side: Icon/Flag + Name and Actions */}
                <div className="relative flex items-center gap-2 max-w-[70%] z-10">
                  {isCountry && (
                    <span className="text-sm flex-shrink-0" title={item.name}>
                      {getCountryFlag(item.name)}
                    </span>
                  )}
                  {isReferrer && (
                    <span className="text-sm flex-shrink-0" title={item.name}>
                      {getReferrerIcon(item.name)}
                    </span>
                  )}
                  <span className="text-slate-200 font-bold truncate">{item.name || "Trực tiếp / Direct"}</span>
                  
                  {/* Hover utility buttons */}
                  <div className="hidden group-hover:flex items-center gap-1.5 ml-2">
                    <button
                      onClick={() => copyToClipboard(item.name)}
                      className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-150"
                      title="Sao chép"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    {onFilterClick && (
                      <button
                        onClick={() => onFilterClick(item.name)}
                        className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-150"
                        title="Lọc theo mục này"
                      >
                        <Filter className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Right Side: Count */}
                <div className="relative z-10 text-right font-extrabold text-white">
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
