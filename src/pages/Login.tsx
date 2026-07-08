import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../lib/api";
import { BarChart3, Mail, Lock, ArrowRight } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Email và mật khẩu là bắt buộc");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const data = await authApi.login({ email, password });
      if (data.success) {
        localStorage.setItem("analytics_token", data.data.token);
        localStorage.setItem("analytics_user_name", data.data.user.fullName);
        localStorage.setItem("analytics_user_role", data.data.user.role);
        navigate("/");
      } else {
        setErrorMsg(data.error || "Đăng nhập thất bại");
      }
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.error || "Đăng nhập không thành công. Vui lòng kiểm tra lại!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4 relative overflow-hidden font-sans">
      {/* Background glowing decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Login Card */}
      <div className="glass w-full max-w-md p-8 rounded-2xl relative z-10 shadow-2xl">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-sky-500 text-gray-950 p-3 rounded-xl shadow-lg shadow-sky-500/20 mb-3">
            <BarChart3 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Chào mừng quay trở lại</h2>
          <p className="text-xs text-gray-400 mt-1">Đăng nhập tài khoản KPI Analytics của bạn</p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-lg mb-6 leading-relaxed">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-500">
              Địa chỉ Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-500">
              Mật khẩu đăng nhập
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-sky-500 hover:bg-sky-400 text-gray-950 font-bold text-sm py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-50"
          >
            {isLoading ? "Đang xử lý..." : "Đăng nhập ngay"}
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick login button */}
          <button
            type="button"
            onClick={async () => {
              setIsLoading(true);
              setErrorMsg("");
              try {
                const data = await authApi.login({ email: "admin@gmail.com", password: "123456" });
                if (data.success) {
                  localStorage.setItem("analytics_token", data.data.token);
                  localStorage.setItem("analytics_user_name", data.data.user.fullName);
                  localStorage.setItem("analytics_user_role", data.data.user.role);
                  navigate("/");
                }
              } catch (err: any) {
                setErrorMsg(err.response?.data?.error || "Đăng nhập nhanh thất bại");
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading}
            className="w-full bg-gray-900/60 hover:bg-gray-800 text-sky-400 border border-sky-500/20 font-bold text-xs py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-150 disabled:opacity-50"
          >
            Đăng nhập nhanh (Admin Demo)
          </button>
        </form>

        {/* Register Redirect link */}
        <div className="mt-8 text-center text-xs text-gray-400">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-sky-400 hover:underline font-semibold ml-1">
            Đăng ký tài khoản mới
          </Link>
        </div>
      </div>
    </div>
  );
}
