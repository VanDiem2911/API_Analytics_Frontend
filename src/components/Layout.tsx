import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { LogOut, ChevronLeft, ChevronRight, Sun, Moon } from "lucide-react";
import Logo from "./Logo";

export default function Layout() {
  const navigate = useNavigate();
  const fullName = localStorage.getItem("analytics_user_name") || "Developer";
  const role = localStorage.getItem("analytics_user_role") || "USER";

  // Sidebar collapse state
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem("sidebar_collapsed") === "true";
  });

  // Dark/Light Theme state
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("analytics_theme");
    if (saved) return saved;
    return "light";
  });

  // Sync theme class to documentElement
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("analytics_theme", theme);
  }, [theme]);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar_collapsed", String(next));
      return next;
    });
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleLogout = () => {
    localStorage.removeItem("analytics_token");
    localStorage.removeItem("analytics_user_name");
    localStorage.removeItem("analytics_user_role");
    navigate("/login");
  };

  // Initials for avatar
  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen relative flex flex-col md:flex-row text-white dark:text-slate-100 font-sans overflow-hidden">
      {/* Background Video */}
      <video
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_094145_4a271a6c-3869-4f1c-8aa7-aeb0cb227994.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none brightness-[0.86] saturate-[1.08] transition-[filter] duration-500 dark:brightness-[0.28] dark:saturate-[0.72]"
      />

      <div className="fixed inset-0 z-0 pointer-events-none bg-white/10 transition-colors duration-500 dark:bg-black/55" />

      {/* Bottom Blur Overlay */}
      <div
        className="fixed inset-0 w-full h-full backdrop-blur-xl z-0 pointer-events-none"
        style={{
          WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 45%)",
          maskImage: "linear-gradient(to top, black 0%, transparent 45%)",
        }}
      />

      {/* Sidebar Navigation */}
      <aside 
        className={`w-full md:h-screen md:fixed md:left-0 md:top-0 md:bottom-0 bg-white/5 dark:bg-slate-950/20 backdrop-blur-md border-r border-white/10 p-4 flex flex-col justify-between text-slate-300 dark:text-slate-400 transition-all duration-300 z-30 ${
          isCollapsed ? "md:w-20" : "md:w-64"
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Top Logo & Toggle Button */}
          <div className="flex items-center justify-between py-3 mb-6 relative">
            <div className={`flex items-center gap-3 overflow-hidden transition-all duration-355 ${
              isCollapsed ? "mx-auto" : "px-1"
            }`}>
              <Logo className="w-10 h-10 shadow-lg shadow-red-500/20 rounded-xl flex-shrink-0" />
              {!isCollapsed && (
                <div className="animate-in fade-in duration-300">
                  <h1 className="font-extrabold text-base leading-tight text-white tracking-tight whitespace-nowrap">
                    DUDI Software
                  </h1>
                  <span className="text-[9px] text-red-400 font-extrabold tracking-wider uppercase whitespace-nowrap">
                    Tracker Dashboard
                  </span>
                </div>
              )}
            </div>

            {/* Collapse toggle button on Desktop */}
            {!isCollapsed ? (
              <button
                onClick={toggleSidebar}
                className="hidden md:flex p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white border border-transparent hover:border-white/10 transition-all duration-200"
                title="Thu gọn menu"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={toggleSidebar}
                className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 bg-white/10 border border-white/10 p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/20 shadow-md transition-all duration-200 z-40"
                title="Mở rộng menu"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

        {/* User Info, Theme Toggle & Logout Button */}
        <div className="pt-4 border-t border-white/10 mt-auto flex-shrink-0">
          {/* Theme Toggle Switch */}
          <div className="mb-3">
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-2 p-2.5 rounded-xl transition-all duration-200 border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white ${
                isCollapsed ? "mx-auto" : "w-full justify-between px-3"
              }`}
              title={theme === "dark" ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-4 h-4 text-amber-500" />
                  {!isCollapsed && <span className="text-xs font-bold text-slate-200 animate-in fade-in duration-300">Giao diện Sáng</span>}
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-400" />
                  {!isCollapsed && <span className="text-xs font-bold text-slate-200 animate-in fade-in duration-300">Giao diện Tối</span>}
                </>
              )}
            </button>
          </div>

          {/* User profile box */}
          <div className={`flex items-center bg-white/5 rounded-xl border border-white/10 mb-3 transition-all duration-300 ${
            isCollapsed ? "justify-center p-2" : "px-3 py-2.5 justify-between"
          }`}>
            {isCollapsed ? (
              <div 
                className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/25 flex items-center justify-center text-xs font-bold text-red-500 flex-shrink-0"
                title={`${fullName} (${role})`}
              >
                {getInitials(fullName)}
              </div>
            ) : (
              <div className="overflow-hidden animate-in fade-in duration-300">
                <p className="text-xs font-bold text-white truncate">{fullName}</p>
                <span className="text-[9px] text-red-400 font-extrabold tracking-wide uppercase">
                  {role}
                </span>
              </div>
            )}
          </div>
          
          <button
            onClick={handleLogout}
            title={isCollapsed ? "Đăng xuất" : undefined}
            className={`w-full flex items-center rounded-xl text-xs font-bold text-slate-350 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/10 transition-all duration-300 ${
              isCollapsed ? "justify-center py-3" : "px-3.5 py-2.5 gap-3"
            }`}
          >
            <LogOut className={`flex-shrink-0 ${isCollapsed ? "w-5 h-5" : "w-4 h-4"}`} />
            {!isCollapsed && <span className="animate-in fade-in duration-300">Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col overflow-x-hidden bg-transparent transition-all duration-300 relative z-10 ${
        isCollapsed ? "md:ml-20" : "md:ml-64"
      }`}>
        <div className="p-4 md:p-8 flex-1 max-w-[1600px] mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
