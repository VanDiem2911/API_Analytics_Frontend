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
    <div className="glass p-6 rounded-xl flex flex-col h-[520px]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h4 className="text-lg font-bold text-white">Hoạt động thời gian thực</h4>
          <p className="text-xs text-gray-400 font-medium">Theo dõi các hành động gần đây của khách truy cập</p>
        </div>
        <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-md text-[10px] text-red-500 font-bold uppercase tracking-wider shadow-sm shadow-red-500/5">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
          Realtime
        </div>
      </div>

      {/* Feed list */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {feed.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-gray-500 italic">
            Chưa có hoạt động nào được ghi nhận
          </div>
        ) : (
          feed.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 text-xs p-3 rounded-lg bg-gray-900/30 border border-gray-800/40 hover:bg-gray-800/20 transition-all duration-200"
            >
              {/* Type Icon Indicator */}
              <div className="flex-shrink-0 self-start mt-0.5">
                {item.type === "pageview" && (
                  <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Eye className="w-4 h-4" />
                  </div>
                )}
                {item.type === "event" && (
                  <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Activity className="w-4 h-4" />
                  </div>
                )}
                {item.type === "error" && (
                  <div className="p-1.5 rounded-md bg-red-500/10 text-red-400 border border-red-500/20">
                    <AlertOctagon className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Feed Content */}
              <div className="flex-1 overflow-hidden space-y-1">
                <div className="flex justify-between items-center gap-4">
                  <span className="font-semibold text-gray-200 truncate">{item.label}</span>
                  <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">
                    {formatRelativeTime(item.timestamp)}
                  </span>
                </div>

                {item.description && (
                  <p className="text-gray-400 font-mono text-[10px] break-all bg-gray-900/50 p-1.5 rounded border border-gray-800/30">
                    {item.description}
                  </p>
                )}

                {/* Visitor agent metadata line */}
                <div className="flex flex-wrap gap-x-3 gap-y-1 items-center text-[10px] text-gray-500 font-medium">
                  {/* Location */}
                  <span className="flex items-center gap-1">
                    <Globe2 className="w-3.5 h-3.5 text-gray-600" />
                    {item.city}, {item.country}
                  </span>

                  {/* Device */}
                  <span className="flex items-center gap-1 border-l border-gray-800 pl-3">
                    <DeviceIcon type={item.device} className="w-3.5 h-3.5 text-gray-600" />
                    <span className="capitalize">{item.device}</span>
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
