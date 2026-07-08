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

  // React SDK Integration snippet code
  const integrationCode = `import Tracker from "kpi-tracker-vandiem";

// Khởi tạo tracker một lần duy nhất tại root (ví dụ: main.tsx hoặc App.tsx)
Tracker.init({
  apiKey: "${website.apiKey}",
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
      <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Dialog container */}
      <div className="glass w-full max-w-xl rounded-xl p-6 relative z-10 animate-in fade-in-50 zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 hover:bg-gray-800/40 p-1.5 rounded-lg transition-all duration-150"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-white mb-2">Mã tích hợp SDK</h3>
        <p className="text-xs text-gray-400 mb-6">
          Website: <span className="text-red-500 font-semibold">{website.name}</span> ({website.domain})
        </p>

        {/* API Key section */}
        <div className="mb-5 space-y-2">
          <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-500">
            API Key của dự án
          </label>
          <div className="flex gap-2 bg-gray-900 border border-gray-800 p-2.5 rounded-lg items-center justify-between">
            <code className="text-xs text-red-500 font-mono select-all truncate">{website.apiKey}</code>
            <button
              onClick={copyKey}
              className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 hover:bg-gray-800 rounded transition-all duration-150"
              title="Sao chép API Key"
            >
              {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Integration Instructions */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-gray-300">Hướng dẫn tích hợp vào ReactJS</h4>
          
          <div className="space-y-2">
            <span className="text-[10px] text-gray-500 font-medium">Bước 1: Cài đặt SDK package</span>
            <div className="flex bg-gray-900 border border-gray-800 px-3 py-2 rounded-lg items-center justify-between">
              <code className="text-xs text-emerald-400 font-mono">npm install kpi-tracker-vandiem</code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText("npm install kpi-tracker-vandiem");
                }}
                className="p-1 text-gray-400 hover:text-red-500 hover:bg-gray-800 rounded transition-all duration-150"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-gray-500 font-medium">Bước 2: Import và Init SDK</span>
              <button
                onClick={copyCode}
                className="flex items-center gap-1 text-[10px] text-red-500 hover:text-red-400 font-semibold"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
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
            <pre className="bg-gray-900 border border-gray-800 p-3 rounded-lg overflow-x-auto text-[10px] font-mono text-gray-300 leading-relaxed">
              <code>{integrationCode}</code>
            </pre>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-red-600 text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-red-500 transition-all duration-150 shadow-lg shadow-red-600/10"
          >
            Đã tích hợp xong
          </button>
        </div>
      </div>
    </div>
  );
}
