import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { websiteApi } from "../lib/api";
import WebsiteModal from "../components/WebsiteModal";
import { Plus, Trash2, Code2, Globe, Power, Calendar, AlertCircle } from "lucide-react";

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
          <h2 className="text-xl font-bold text-white">Quản lý Website</h2>
          <p className="text-xs text-gray-400">Thêm và thiết lập mã theo dõi cho các trang web của bạn</p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-all duration-150 shadow-lg shadow-red-600/10"
        >
          <Plus className="w-4 h-4" />
          {isAdding ? "Hủy bỏ" : "Thêm Website"}
        </button>
      </div>

      {/* Add New Website Card */}
      {isAdding && (
        <div className="card animate-in slide-in-from-top-4 duration-200">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Thêm Website mới vào hệ thống</h3>
          
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-2.5 rounded-lg mb-4">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleAddWebsite} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-500">Tên Website</label>
              <input
                type="text"
                placeholder="My Application"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-500">Domain tên miền</label>
              <input
                type="text"
                placeholder="example.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={createMutation.isPending}
              className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs py-2 px-4 rounded-lg transition-all duration-150 disabled:opacity-50 h-9 shadow-lg shadow-red-600/10"
            >
              {createMutation.isPending ? "Đang tạo..." : "Xác nhận tạo"}
            </button>
          </form>
        </div>
      )}

      {/* Websites Grid List */}
      {isLoading ? (
        <div className="py-20 text-center text-sm text-gray-500">Đang tải danh sách website...</div>
      ) : error ? (
        <div className="py-10 text-center text-sm text-red-400 flex items-center justify-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Không thể lấy danh sách website. Vui lòng tải lại trang!
        </div>
      ) : websites.length === 0 ? (
        <div className="card py-20 text-center">
          <Globe className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-650">Bạn chưa đăng ký website nào</p>
          <p className="text-xs text-gray-500 mt-1 mb-4">Đăng ký website đầu tiên để bắt đầu theo dõi lưu lượng</p>
          <button
            onClick={() => setIsAdding(true)}
            className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-xs px-4 py-2 rounded-lg shadow-sm"
          >
            Đăng ký ngay
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {websites.map((web: any) => (
            <div key={web._id} className="card flex flex-col justify-between transition-all duration-200">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base leading-tight">{web.name}</h3>
                    <a
                      href={`https://${web.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-red-500 hover:underline flex items-center gap-1 mt-1 font-semibold"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      {web.domain}
                    </a>
                  </div>

                  {/* Status Indicator */}
                  <button
                    onClick={() => handleToggleStatus(web._id, web.status)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-150 ${
                      web.status === "active"
                        ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/25"
                        : "bg-gray-100 border border-gray-200 text-gray-500 hover:bg-gray-200"
                    }`}
                    title="Click để thay đổi trạng thái"
                  >
                    <Power className="w-3 h-3" />
                    {web.status === "active" ? "Hoạt động" : "Tắt"}
                  </button>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-500 border-t border-gray-100 pt-4 mt-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    Đăng ký: {new Date(web.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 border-t border-gray-100 pt-4 mt-6">
                <button
                  onClick={() => setSelectedWeb(web)}
                  className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 hover:border-red-500/30 text-gray-700 hover:text-red-600 font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-150 shadow-sm"
                >
                  <Code2 className="w-4 h-4" />
                  Mã tích hợp
                </button>
                <button
                  onClick={() => handleDelete(web._id, web.name)}
                  className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 p-2 rounded-lg transition-all duration-150"
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
