import { FormEvent, useEffect, useState } from "react";
import { Activity, Check, X } from "lucide-react";

interface HealthCheckModalProps {
  website: {
    name: string;
    domain: string;
    healthCheckUrl?: string;
  } | null;
  isSaving: boolean;
  errorMessage: string;
  onClose: () => void;
  onSave: (healthCheckUrl: string) => void;
}

export default function HealthCheckModal({
  website,
  isSaving,
  errorMessage,
  onClose,
  onSave,
}: HealthCheckModalProps) {
  const [healthCheckUrl, setHealthCheckUrl] = useState("");

  useEffect(() => {
    setHealthCheckUrl(website?.healthCheckUrl || "");
  }, [website]);

  if (!website) return null;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSave(healthCheckUrl.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-gray-950/55 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Đóng cấu hình health check"
      />

      <form
        onSubmit={handleSubmit}
        className="glass relative z-10 w-full max-w-lg rounded-2xl border border-white/10 p-6 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 flex min-h-11 min-w-11 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Đóng"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-5 flex items-start gap-3 pr-10">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
            <Activity className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">
              Cấu hình kiểm tra trạng thái
            </h3>
            <p className="mt-1 text-xs font-semibold leading-5 text-slate-300">
              {website.name} · {website.domain}
            </p>
          </div>
        </div>

        <label
          htmlFor="health-check-url"
          className="text-[10px] font-extrabold uppercase tracking-wider text-slate-300"
        >
          URL health check
        </label>
        <input
          id="health-check-url"
          type="url"
          value={healthCheckUrl}
          onChange={(event) => setHealthCheckUrl(event.target.value)}
          placeholder={`https://${website.domain}`}
          className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-slate-950/65 px-3 text-sm text-white outline-none transition focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
        />
        <p className="mt-2 text-xs leading-5 text-slate-400">
          Để trống sẽ kiểm tra website frontend. Nếu muốn phát hiện backend CRM chết,
          hãy nhập endpoint API công khai của backend, ví dụ{" "}
          <span className="text-slate-300">https://backend.onrender.com/health</span>.
        </p>

        {errorMessage && (
          <p role="alert" className="mt-3 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-300">
            {errorMessage}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-xl border border-white/10 px-4 text-xs font-bold text-slate-200 transition hover:bg-white/10"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex min-h-11 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-xs font-bold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            {isSaving ? "Đang lưu..." : "Lưu và kiểm tra"}
          </button>
        </div>
      </form>
    </div>
  );
}
