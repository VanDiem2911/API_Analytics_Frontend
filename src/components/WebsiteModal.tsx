import { Copy, Check, X } from "lucide-react";
import { useState } from "react";

interface WebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  website: {
    _id: string;
    name: string;
    domain: string;
    apiKey: string;
  } | null;
}

export default function WebsiteModal({ isOpen, onClose, website }: WebsiteModalProps) {
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen || !website) return null;

  const backendUrl = (import.meta as any).env.VITE_API_URL || window.location.origin;
  const absoluteBackendUrl = backendUrl.startsWith("http")
    ? backendUrl
    : window.location.origin + (backendUrl === "/" ? "" : backendUrl);

  // React SDK Integration snippet code (Domain-Only Tracking)
  const integrationCode = `import Tracker from "kpi-tracker-vandiem";

// Khởi tạo tracker một lần tại root (ví dụ: main.tsx hoặc App.tsx)
// Hệ thống tự động nhận diện và bảo mật qua Tên miền đăng ký
Tracker.init({
  serverUrl: "${absoluteBackendUrl}" // Endpoint backend API
});`;

  const copyKey = () => {
    navigator.clipboard.writeText(website.apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(integrationCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Overlay background */}
      <div className="absolute inset-0 bg-gray-950/40 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Dialog container */}
      <div className="glass w-full max-w-xl p-7.5 rounded-2xl relative z-10 animate-in fade-in-50 zoom-in-95 duration-300 shadow-2xl border border-slate-200/80 dark:border-slate-800/80">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 p-2 rounded-xl transition-all duration-200"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">Mã tích hợp SDK</h3>
        <p className="text-xs text-slate-400 dark:text-slate-550 mb-6 font-semibold">
          Website: <span className="text-red-500 font-bold">{website.name}</span> ({website.domain})
        </p>

        {/* API Key section */}
        <div className="mb-5 space-y-2">
          <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500">
            API Key của dự án (Tùy chọn - Dùng khi tích hợp phía Server/Backend)
          </label>
          <div className="flex gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-xl items-center justify-between shadow-inner">
            <code className="text-xs text-red-500 font-mono select-all truncate font-bold">{website.apiKey}</code>
            <button
              onClick={copyKey}
              className="flex-shrink-0 p-1.5 text-slate-450 dark:text-slate-500 hover:text-red-550 dark:hover:text-red-400 hover:bg-white dark:hover:bg-slate-900 rounded-lg border border-transparent hover:border-slate-200/50 dark:hover:border-slate-800/50 shadow-sm transition-all duration-200"
              title="Sao chép API Key"
            >
              {copiedKey ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Integration Instructions */}
        <div className="space-y-4">
          <h4 className="text-xs font-extrabold text-slate-800 dark:text-white">Hướng dẫn tích hợp vào ReactJS</h4>
          
          <div className="space-y-2">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">Bước 1: Cài đặt SDK package</span>
            <div className="flex bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl items-center justify-between shadow-inner">
              <code className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold">npm install kpi-tracker-vandiem</code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText("npm install kpi-tracker-vandiem");
                }}
                className="p-1.5 text-slate-450 dark:text-slate-500 hover:text-red-550 dark:hover:text-red-400 hover:bg-white dark:hover:bg-slate-900 rounded-lg border border-transparent hover:border-slate-200/50 dark:hover:border-slate-800/50 shadow-sm transition-all duration-200"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">Bước 2: Import và Init SDK</span>
              <button
                onClick={copyCode}
                className="flex items-center gap-1.5 text-[10px] text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 font-bold"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    Đã sao chép
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Sao chép Code
                  </>
                )}
              </button>
            </div>
            <pre className="bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 p-3.5 rounded-xl overflow-x-auto text-[10px] font-mono text-slate-700 dark:text-slate-350 leading-relaxed shadow-inner">
              <code>{integrationCode}</code>
            </pre>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-red-600/10"
          >
            Đã tích hợp xong
          </button>
        </div>
      </div>
    </div>
  );
}
