import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Globe, LogOut } from "lucide-react";
import Logo from "./Logo";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const fullName = localStorage.getItem("analytics_user_name") || "Developer";

  const handleLogout = () => {
    localStorage.removeItem("analytics_token");
    localStorage.removeItem("analytics_user_name");
    localStorage.removeItem("analytics_user_role");
    navigate("/login");
  };

  const menuItems = [
    { path: "/", name: "Bảng điều khiển", icon: LayoutDashboard },
    { path: "/websites", name: "Quản lý Website", icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col md:flex-row text-gray-100 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-gray-900/50 border-r border-gray-800/60 p-5 flex flex-col justify-between backdrop-blur-md">
        <div>
          {/* Logo Brand Header */}
          <div className="flex items-center gap-3 px-2 py-4 mb-6">
            <Logo className="w-10 h-10 shadow-lg shadow-red-600/10" />
            <div>
              <h1 className="font-bold text-base leading-tight text-white">
                DUDI Software
              </h1>
              <span className="text-[9px] text-red-500 font-bold tracking-wider uppercase">
                Tracker Dashboard
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-red-500/10 text-red-500 border border-red-500/20 shadow-[0_0_15px_-3px_rgba(239,68,68,0.15)]"
                      : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/40 border border-transparent"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout Button */}
        <div className="pt-4 border-t border-gray-800/60 mt-6 md:mt-0">
          <div className="flex items-center justify-between px-2 mb-3">
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-gray-200 truncate">{fullName}</p>
              <span className="text-[10px] text-red-500 font-bold tracking-wide uppercase">
                {localStorage.getItem("analytics_user_role") || "USER"}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-x-hidden">
        <div className="p-4 md:p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
