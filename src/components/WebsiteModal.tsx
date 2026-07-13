import { Copy, Check, X, Eye, EyeOff, Terminal, Code2, Globe } from "lucide-react";
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
  const [copiedPackage, setCopiedPackage] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

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
      <div className="absolute inset-0 bg-gray-950/60 backdrop-blur-md" onClick={onClose}></div>

      {/* Modal Dialog container */}
      <div className="glass w-full max-w-4xl p-8 rounded-3xl relative z-10 animate-in fade-in-50 zoom-in-95 duration-300 shadow-2xl border border-slate-200/80 dark:border-slate-800/80">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-all duration-200"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
            <Code2 className="w-5 h-5 text-red-400" />
          </span>
          Mã tích hợp SDK
        </h3>

        {/* Website Info Box */}
        <div className="flex flex-wrap gap-2 items-center text-xs text-slate-300 mt-4 mb-6 bg-slate-900/40 border border-white/5 px-4 py-2.5 rounded-xl w-fit">
          <Globe className="w-4 h-4 text-slate-400" />
          <span className="font-medium text-slate-400">Website:</span>
          <span className="text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/10">{website.name}</span>
          <span className="text-slate-500 font-medium">|</span>
          <span className="font-mono text-slate-300">{website.domain}</span>
        </div>

        {/* Grid layout: Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Left Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* API Key section */}
            <div className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-[11px] uppercase tracking-wider font-extrabold text-slate-300">
                  API Key của dự án
                </label>
                <span className="text-[10px] text-amber-400 font-semibold bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                  Tùy chọn
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Dùng khi tích hợp phía Server hoặc Backend.
              </p>
              <div className="flex gap-2 bg-slate-950/80 border border-white/10 p-3 rounded-xl items-center justify-between shadow-inner">
                <code className="text-xs text-red-400 font-mono select-all truncate font-bold">
                  {showApiKey ? website.apiKey : website.apiKey.replace(/(?<=kpi_).*/, (m) => "•".repeat(m.length))}
                </code>
                <div className="flex gap-1">
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                    title={showApiKey ? "Ẩn API Key" : "Hiển thị API Key"}
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={copyKey}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                    title="Sao chép API Key"
                  >
                    {copiedKey ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Install SDK (Step 1) */}
            <div className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white font-black text-[10px]">
                  1
                </span>
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-300">
                  Cài đặt SDK package
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Chạy lệnh sau trong thư mục dự án React của bạn:
              </p>
              <div className="flex bg-slate-950/80 border border-white/10 p-3 rounded-xl items-center justify-between shadow-inner">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Terminal className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  <code className="text-xs text-emerald-400 font-mono font-bold truncate">
                    npm install kpi-tracker-vandiem
                  </code>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("npm install kpi-tracker-vandiem");
                    setCopiedPackage(true);
                    setTimeout(() => setCopiedPackage(false), 2000);
                  }}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  title="Sao chép lệnh cài đặt"
                >
                  {copiedPackage ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            {/* Step 2 */}
            <div className="bg-slate-900/40 border border-white/5 p-4 rounded-2xl flex flex-col gap-3 h-full justify-between">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white font-black text-[10px]">
                    2
                  </span>
                  <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-300">
                    Khởi tạo SDK
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Import và khởi tạo SDK một lần duy nhất tại file cấu hình root (như <code className="text-slate-200 bg-white/5 px-1 py-0.5 rounded font-mono text-[10px]">main.tsx</code> hoặc <code className="text-slate-200 bg-white/5 px-1 py-0.5 rounded font-mono text-[10px]">App.tsx</code>):
                </p>
              </div>

              <div className="border border-white/10 rounded-xl overflow-hidden shadow-inner bg-slate-950/90 flex flex-col">
                {/* macOS Window Title Bar */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-white/5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                    <span className="text-[10px] text-slate-400 font-mono ml-2">main.tsx</span>
                  </div>
                  <button
                    onClick={copyCode}
                    className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white font-bold transition-colors duration-200"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        Đã sao chép
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Sao chép
                      </>
                    )}
                  </button>
                </div>

                {/* Code Block Content */}
                <div className="p-4 overflow-x-auto text-[11px] font-mono leading-relaxed select-all">
                  <pre className="text-slate-300">
                    <code>
                      <div>
                        <span className="text-pink-400 font-bold">import</span> <span className="text-blue-400">Tracker</span> <span className="text-pink-400 font-bold">from</span> <span className="text-emerald-400">"kpi-tracker-vandiem"</span>;
                      </div>
                      <div className="text-slate-500 my-2">// Khởi tạo tracker một lần tại root (ví dụ: main.tsx hoặc App.tsx)</div>
                      <div className="text-slate-500">// Hệ thống tự động nhận diện và bảo mật qua Tên miền đăng ký</div>
                      <div className="mt-2">
                        <span className="text-blue-400 font-bold">Tracker</span>.<span className="text-amber-300">init</span>({`{`}
                      </div>
                      <div className="pl-4">
                        <span className="text-purple-400">serverUrl</span>: <span className="text-emerald-400">"{absoluteBackendUrl}"</span> <span className="text-slate-500">// Endpoint backend API</span>
                      </div>
                      <div>{`});`}</div>
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-red-600/20 hover:shadow-red-500/30 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Đã tích hợp xong
          </button>
        </div>
      </div>
    </div>
  );
}
