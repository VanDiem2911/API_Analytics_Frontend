import {
  Activity,
  AlertOctagon,
  Eye,
  Laptop,
  Smartphone,
  Tablet,
  Globe2,
} from "lucide-react";

interface FeedItem {
  id: string;
  type: "pageview" | "event" | "error";
  label: string;
  description: string;
  url: string;
  timestamp: string;
  browser: string;
  os: string;
  device: "desktop" | "tablet" | "mobile";
  country: string;
  city: string;
}

interface FeedActivityProps {
  feed: FeedItem[];
}

// Icon mapper for device types
const DeviceIcon = ({ type, className }: { type: string; className?: string }) => {
  switch (type) {
    case "mobile":
      return <Smartphone className={className} />;
    case "tablet":
      return <Tablet className={className} />;
    default:
      return <Laptop className={className} />;
  }
};

// Simple relative time helper
const formatRelativeTime = (isoString: string) => {
  const diff = Date.now() - new Date(isoString).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "Vừa xong";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} phút trước`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} giờ trước`;
  const day = Math.floor(hr / 24);
  return `${day} ngày trước`;
};

export default function FeedActivity({ feed }: FeedActivityProps) {
  return (
    <div className="glass p-6 flex flex-col h-[520px]">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h4 className="text-base font-extrabold text-slate-900 dark:text-white">Hoạt động thời gian thực</h4>
          <p className="text-xs text-slate-400 dark:text-slate-550 font-semibold mt-0.5">Theo dõi hành động gần đây của khách truy cập trên trang web</p>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-900/50 px-2.5 py-1 rounded-full text-[9px] text-emerald-600 dark:text-emerald-400 font-extrabold uppercase tracking-widest shadow-sm">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
          Realtime
        </div>
      </div>

      {/* Feed list */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {feed.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400 dark:text-slate-500 italic">
            Chưa có hoạt động nào được ghi nhận
          </div>
        ) : (
          feed.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 text-xs p-3.5 rounded-2xl bg-white/40 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800 hover:border-slate-200/80 dark:hover:border-slate-700/80 hover:bg-white/90 dark:hover:bg-slate-900/60 transition-all duration-200"
            >
              {/* Type Icon Indicator */}
              <div className="flex-shrink-0 self-start mt-0.5">
                {item.type === "pageview" && (
                  <div className="p-1.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50">
                    <Eye className="w-3.5 h-3.5" />
                  </div>
                )}
                {item.type === "event" && (
                  <div className="p-1.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                )}
                {item.type === "error" && (
                  <div className="p-1.5 rounded-xl bg-red-50 text-red-600 border border-red-100 dark:bg-red-950/40 dark:text-red-450 dark:border-red-900/50">
                    <AlertOctagon className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              {/* Feed Content */}
              <div className="flex-1 overflow-hidden space-y-1.5">
                <div className="flex justify-between items-center gap-4">
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{item.label}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold whitespace-nowrap">
                    {formatRelativeTime(item.timestamp)}
                  </span>
                </div>

                {item.description && (
                  <p className="text-slate-600 dark:text-slate-400 font-mono text-[9px] break-all bg-slate-50/80 dark:bg-slate-950/50 p-2 rounded-xl border border-slate-100/50 dark:border-slate-900/30">
                    {item.description}
                  </p>
                )}

                {/* Visitor agent metadata line */}
                <div className="flex flex-wrap gap-2 items-center text-[9px] text-slate-500 dark:text-slate-400 font-bold">
                  {/* Location */}
                  <span className="flex items-center gap-1 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 px-2 py-0.5 rounded-lg">
                    <Globe2 className="w-3 h-3 text-slate-400" />
                    {item.city}, {item.country}
                  </span>

                  {/* Device */}
                  <span className="flex items-center gap-1 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 px-2 py-0.5 rounded-lg">
                    <DeviceIcon type={item.device} className="w-3 h-3 text-slate-400" />
                    <span className="capitalize">{item.device}</span>
                  </span>

                  {/* Browser / OS */}
                  <span className="text-slate-400 dark:text-slate-550 font-semibold">
                    {item.browser} ({item.os})
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
