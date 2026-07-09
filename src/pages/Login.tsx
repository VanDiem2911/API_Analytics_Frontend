import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { authApi } from "../lib/api";
import Logo from "../components/Logo";

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
    <div className="relative min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden font-sans">
      {/* Background Video */}
      <video
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_094145_4a271a6c-3869-4f1c-8aa7-aeb0cb227994.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none"
      />

      {/* Bottom Blur Overlay (No Gradient Darkening) */}
      <div
        className="fixed inset-0 w-full h-full backdrop-blur-xl z-0 pointer-events-none"
        style={{
          WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 45%)",
          maskImage: "linear-gradient(to top, black 0%, transparent 45%)",
        }}
      />

      {/* Login Card */}
      <div className="bg-white/5 backdrop-blur-[6px] border border-white/10 w-full max-w-md p-8 rounded-2xl relative z-10 shadow-2xl">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <Logo className="w-16 h-16 shadow-lg shadow-red-600/10 mb-3" />
          <h2 className="text-2xl font-bold text-white tracking-tight">Chào mừng quay trở lại</h2>
          <p className="text-xs text-gray-400 mt-1">Đăng nhập tài khoản DUDI Analytics của bạn</p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="bg-red-500/15 border border-red-500/30 text-red-400 text-xs px-4 py-3 rounded-lg mb-6 leading-relaxed">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">
              Địa chỉ Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">
              Mật khẩu đăng nhập
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold text-sm py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-50 shadow-lg shadow-red-600/10"
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
            className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-150 disabled:opacity-50 shadow-sm"
          >
            Đăng nhập nhanh (Admin Demo)
          </button>
        </form>

        {/* Register Redirect link */}
        <div className="mt-8 text-center text-xs text-gray-400">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-red-400 hover:text-red-300 hover:underline font-semibold ml-1">
            Đăng ký tài khoản mới
          </Link>
        </div>
      </div>
    </div>
  );
}
