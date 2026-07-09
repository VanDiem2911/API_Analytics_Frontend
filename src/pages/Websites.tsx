import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { websiteApi, analyticsApi } from "../lib/api";
import WebsiteModal from "../components/WebsiteModal";
import { Plus, Trash2, Code2, Globe, Power, Calendar, AlertCircle, AlertTriangle } from "lucide-react";

// Hook: fetch recent error count for a single website
function useWebsiteErrors(websiteId: string) {
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchErrors = async () => {
      try {
        const res = await analyticsApi.getRealtime(websiteId);
        const feed: any[] = res.feed || [];
        const fiveMinAgo = Date.now() - 5 * 60 * 1000;
        const recentErrors = feed.filter(
          (item: any) =>
            item.type === "error" &&
            new Date(item.timestamp).getTime() > fiveMinAgo
        );
        if (!cancelled) setErrorCount(recentErrors.length);
      } catch {
        // Ignore if request fails
      }
    };

    fetchErrors();
    const interval = setInterval(fetchErrors, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [websiteId]);

  return errorCount;
}

// Card component with error badge
function WebsiteCard({
  web,
  onToggleStatus,
  onDelete,
  onOpenModal,
}: {
  web: any;
  onToggleStatus: (id: string, status: string) => void;
  onDelete: (id: string, name: string) => void;
  onOpenModal: (web: any) => void;
}) {
  const errorCount = useWebsiteErrors(web._id);

  return (
    <div
      className={`glass p-6 rounded-2xl flex flex-col justify-between hover:scale-[1.01] hover:shadow-md transition-all duration-350 border ${
        errorCount > 0
          ? "border-red-500/40 shadow-red-500/10 shadow-lg"
          : "border-white/10"
      }`}
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0 pr-3">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-white text-base leading-tight">{web.name}</h3>
              {/* Error badge */}
              {errorCount > 0 && (
                <span className="flex items-center gap-1 bg-red-500/15 border border-red-500/30 text-red-400 text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full animate-pulse">
                  <AlertTriangle className="w-2.5 h-2.5" />
                  {errorCount} lỗi vừa xảy ra
                </span>
              )}
            </div>
            <a
              href={`https://${web.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-red-400 hover:text-red-300 hover:underline flex items-center gap-1.5 mt-1.5 font-bold transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              {web.domain}
            </a>
          </div>

          {/* Status Indicator */}
          <button
            onClick={() => onToggleStatus(web._id, web.status)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest transition-all duration-200 border ${
              web.status === "active"
                ? "bg-emerald-950/40 border-emerald-900/50 text-emerald-400 hover:bg-emerald-900/40"
                : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
            }`}
            title="Click để thay đổi trạng thái"
          >
            <Power className="w-3 h-3" />
            {web.status === "active" ? "Hoạt động" : "Tắt"}
          </button>
        </div>

        {/* Error alert row */}
        {errorCount > 0 && (
          <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5 mb-3 text-[11px] text-red-300 font-semibold">
            <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
            <span>
              Phát hiện <span className="text-red-400 font-extrabold">{errorCount} lỗi</span> trong 5 phút vừa qua trên trang web này. Kiểm tra mục Hoạt động thời gian thực để biết chi tiết.
            </span>
          </div>
        )}

        <div className="flex items-center gap-4 text-[11px] text-slate-300 font-semibold border-t border-white/10 pt-4 mt-4">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Đăng ký: {new Date(web.createdAt).toLocaleDateString("vi-VN")}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2.5 border-t border-white/10 pt-4 mt-6">
        <button
          onClick={() => onOpenModal(web)}
          className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-red-500/30 hover:text-red-400 text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 shadow-sm"
        >
          <Code2 className="w-4 h-4" />
          Mã tích hợp
        </button>
        <button
          onClick={() => onDelete(web._id, web.name)}
          className="bg-red-950/40 hover:bg-red-900/40 border border-red-900/50 text-red-400 p-2.5 rounded-xl transition-all duration-200 shadow-sm"
          title="Xóa Website"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function Websites() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  // Selection state for integration code modal
  const [selectedWeb, setSelectedWeb] = useState<any>(null);

  // 1. Fetch websites list
  const { data: websites = [], isLoading, error } = useQuery({
    queryKey: ["websites"],
    queryFn: async () => {
      const res = await websiteApi.list();
      return res.data;
    },
  });

  // 2. Mutation for creating a new website
  const createMutation = useMutation({
    mutationFn: websiteApi.create,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["websites"] });
      setIsAdding(false);
      setName("");
      setDomain("");
      setErrorMsg("");
      setSelectedWeb(res.data);
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.error || "Thêm website thất bại");
    },
  });

  // 3. Mutation for deleting a website
  const deleteMutation = useMutation({
    mutationFn: websiteApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["websites"] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.error || "Xóa website thất bại");
    },
  });

  // 4. Mutation for toggling status (active/inactive)
  const toggleMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return websiteApi.update(id, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["websites"] });
    },
  });

  const handleAddWebsite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !domain) {
      setErrorMsg("Tên và domain là bắt buộc");
      return;
    }
    createMutation.mutate({ name, domain });
  };

  const handleDelete = (id: string, webName: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa website "${webName}"?\nHành động này sẽ XÓA VĨNH VIỄN website và TOÀN BỘ dữ liệu analytics liên quan!`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "active" ? "inactive" : "active";
    toggleMutation.mutate({ id, status: nextStatus });
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white">Quản lý Website</h2>
          <p className="text-xs text-slate-300 font-semibold mt-0.5">Thêm và thiết lập mã theo dõi cho các trang web của bạn</p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all duration-150 shadow-md shadow-red-600/20"
        >
          <Plus className="w-4 h-4" />
          {isAdding ? "Hủy bỏ" : "Thêm Website"}
        </button>
      </div>

      {/* Add New Website Card */}
      {isAdding && (
        <div className="glass p-6 rounded-2xl border border-white/10 shadow-md animate-in slide-in-from-top-4 duration-300">
          <h3 className="text-sm font-bold text-white mb-4">Thêm Website mới vào hệ thống</h3>
          
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-2.5 rounded-xl mb-4 font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleAddWebsite} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-300">Tên Website</label>
              <input
                type="text"
                placeholder="My Application"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-300">Domain tên miền</label>
              <input
                type="text"
                placeholder="example.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                required
              />
            </div>

            <button
              type="submit"
              disabled={createMutation.isPending}
              className="bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all duration-150 disabled:opacity-50 h-10 shadow-md shadow-red-600/20"
            >
              {createMutation.isPending ? "Đang tạo..." : "Xác nhận tạo"}
            </button>
          </form>
        </div>
      )}

      {/* Websites Grid List */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-slate-300 italic">Đang tải danh sách website...</div>
      ) : error ? (
        <div className="py-10 text-center text-xs text-red-400 font-semibold flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Không thể lấy danh sách website. Vui lòng tải lại trang!
        </div>
      ) : websites.length === 0 ? (
        <div className="glass py-20 text-center rounded-2xl border border-white/10 shadow-md">
          <Globe className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-sm font-bold text-white">Bạn chưa đăng ký website nào</p>
          <p className="text-xs text-slate-300 mt-1.5 mb-5">Đăng ký website đầu tiên để bắt đầu theo dõi lưu lượng</p>
          <button
            onClick={() => setIsAdding(true)}
            className="bg-white/5 border border-white/10 text-white hover:bg-white/10 font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all duration-150"
          >
            Đăng ký ngay
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {websites.map((web: any) => (
            <WebsiteCard
              key={web._id}
              web={web}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDelete}
              onOpenModal={setSelectedWeb}
            />
          ))}
        </div>
      )}

      {/* Integration Instructions Modal */}
      <WebsiteModal
        isOpen={selectedWeb !== null}
        onClose={() => setSelectedWeb(null)}
        website={selectedWeb}
      />
    </div>
  );
}


export default function Websites() {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  // Selection state for integration code modal
  const [selectedWeb, setSelectedWeb] = useState<any>(null);

  // 1. Fetch websites list
  const { data: websites = [], isLoading, error } = useQuery({
    queryKey: ["websites"],
    queryFn: async () => {
      const res = await websiteApi.list();
      return res.data;
    },
  });

  // 2. Mutation for creating a new website
  const createMutation = useMutation({
    mutationFn: websiteApi.create,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["websites"] });
      setIsAdding(false);
      setName("");
      setDomain("");
      setErrorMsg("");
      // Immediately open integration instructions for the new website!
      setSelectedWeb(res.data);
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.error || "Thêm website thất bại");
    },
  });

  // 3. Mutation for deleting a website
  const deleteMutation = useMutation({
    mutationFn: websiteApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["websites"] });
    },
    onError: (err: any) => {
      alert(err.response?.data?.error || "Xóa website thất bại");
    },
  });

  // 4. Mutation for toggling status (active/inactive)
  const toggleMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return websiteApi.update(id, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["websites"] });
    },
  });

  const handleAddWebsite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !domain) {
      setErrorMsg("Tên và domain là bắt buộc");
      return;
    }
    createMutation.mutate({ name, domain });
  };

  const handleDelete = (id: string, webName: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa website "${webName}"?\nHành động này sẽ XÓA VĨNH VIỄN website và TOÀN BỘ dữ liệu analytics liên quan!`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "active" ? "inactive" : "active";
    toggleMutation.mutate({ id, status: nextStatus });
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white">Quản lý Website</h2>
          <p className="text-xs text-slate-300 font-semibold mt-0.5">Thêm và thiết lập mã theo dõi cho các trang web của bạn</p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all duration-150 shadow-md shadow-red-600/20"
        >
          <Plus className="w-4 h-4" />
          {isAdding ? "Hủy bỏ" : "Thêm Website"}
        </button>
      </div>

      {/* Add New Website Card */}
      {isAdding && (
        <div className="glass p-6 rounded-2xl border border-white/10 shadow-md animate-in slide-in-from-top-4 duration-300">
          <h3 className="text-sm font-bold text-white mb-4">Thêm Website mới vào hệ thống</h3>
          
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-2.5 rounded-xl mb-4 font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleAddWebsite} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-300">Tên Website</label>
              <input
                type="text"
                placeholder="My Application"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-300">Domain tên miền</label>
              <input
                type="text"
                placeholder="example.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                required
              />
            </div>

            <button
              type="submit"
              disabled={createMutation.isPending}
              className="bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all duration-150 disabled:opacity-50 h-10 shadow-md shadow-red-600/20"
            >
              {createMutation.isPending ? "Đang tạo..." : "Xác nhận tạo"}
            </button>
          </form>
        </div>
      )}

      {/* Websites Grid List */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-slate-300 italic">Đang tải danh sách website...</div>
      ) : error ? (
        <div className="py-10 text-center text-xs text-red-400 font-semibold flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Không thể lấy danh sách website. Vui lòng tải lại trang!
        </div>
      ) : websites.length === 0 ? (
        <div className="glass py-20 text-center rounded-2xl border border-white/10 shadow-md">
          <Globe className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-sm font-bold text-white">Bạn chưa đăng ký website nào</p>
          <p className="text-xs text-slate-300 mt-1.5 mb-5">Đăng ký website đầu tiên để bắt đầu theo dõi lưu lượng</p>
          <button
            onClick={() => setIsAdding(true)}
            className="bg-white/5 border border-white/10 text-white hover:bg-white/10 font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all duration-150"
          >
            Đăng ký ngay
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {websites.map((web: any) => (
            <div key={web._id} className="glass p-6 rounded-2xl flex flex-col justify-between hover:scale-[1.01] hover:shadow-md transition-all duration-350 border border-white/10">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-extrabold text-white text-base leading-tight">{web.name}</h3>
                    <a
                      href={`https://${web.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-red-400 hover:text-red-300 hover:underline flex items-center gap-1.5 mt-1.5 font-bold transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      {web.domain}
                    </a>
                  </div>

                  {/* Status Indicator */}
                  <button
                    onClick={() => handleToggleStatus(web._id, web.status)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest transition-all duration-200 border ${
                      web.status === "active"
                        ? "bg-emerald-950/40 border-emerald-900/50 text-emerald-400 hover:bg-emerald-900/40"
                        : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                    }`}
                    title="Click để thay đổi trạng thái"
                  >
                    <Power className="w-3 h-3" />
                    {web.status === "active" ? "Hoạt động" : "Tắt"}
                  </button>
                </div>

                <div className="flex items-center gap-4 text-[11px] text-slate-300 font-semibold border-t border-white/10 pt-4 mt-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Đăng ký: {new Date(web.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 border-t border-white/10 pt-4 mt-6">
                <button
                  onClick={() => setSelectedWeb(web)}
                  className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-red-500/30 hover:text-red-400 text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 shadow-sm"
                >
                  <Code2 className="w-4 h-4" />
                  Mã tích hợp
                </button>
                <button
                  onClick={() => handleDelete(web._id, web.name)}
                  className="bg-red-950/40 hover:bg-red-900/40 border border-red-900/50 text-red-400 p-2.5 rounded-xl transition-all duration-200 shadow-sm"
                  title="Xóa Website"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Integration Instructions Modal */}
      <WebsiteModal
        isOpen={selectedWeb !== null}
        onClose={() => setSelectedWeb(null)}
        website={selectedWeb}
      />
    </div>
  );
}
