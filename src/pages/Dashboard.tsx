import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { websiteApi, analyticsApi } from "../lib/api";
import CardMetric from "../components/CardMetric";
import ChartTraffic from "../components/ChartTraffic";
import ChartPieBreakdown from "../components/ChartPieBreakdown";
import ListBreakdown from "../components/ListBreakdown";
import FeedActivity from "../components/FeedActivity";
import Websites from "./Websites";
import {
  Users,
  Eye,
  Clock,
  Percent,
  Calendar,
  Globe,
  X,
  RefreshCw,
  LayoutDashboard,
} from "lucide-react";

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"dashboard" | "websites">(() => {
    const saved = localStorage.getItem("dashboard_active_tab");
    if (saved === "websites") return "websites";
    return "dashboard";
  });

  const handleTabChange = (tab: "dashboard" | "websites") => {
    setActiveTab(tab);
    localStorage.setItem("dashboard_active_tab", tab);
  };

  const [selectedWebId, setSelectedWebId] = useState("");
  const [period, setPeriod] = useState("30days");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  // Filters state
  const [deviceFilter, setDeviceFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [pageFilter, setPageFilter] = useState("");

  // 1. Fetch websites list
  const { data: websites = [], isLoading: isWebsitesLoading } = useQuery({
    queryKey: ["websites"],
    queryFn: async () => {
      const res = await websiteApi.list();
      return res.data;
    },
  });

  // Set default selected website when list loads
  useEffect(() => {
    if (websites.length > 0 && !selectedWebId) {
      // Check localStorage first
      const cached = localStorage.getItem("selected_website_id");
      if (cached && websites.some((w: any) => w._id === cached)) {
        setSelectedWebId(cached);
      } else {
        setSelectedWebId(websites[0]._id);
      }
    }
  }, [websites, selectedWebId]);

  // Persist selected website Choice
  const handleWebsiteChange = (id: string) => {
    setSelectedWebId(id);
    localStorage.setItem("selected_website_id", id);
    // Reset filters on website swap
    clearAllFilters();
  };

  const clearAllFilters = () => {
    setDeviceFilter("");
    setCountryFilter("");
    setPageFilter("");
  };

  // Helper to compile API queries
  const getQueryParams = () => {
    const params: any = {
      websiteId: selectedWebId,
      period,
    };
    if (period === "custom") {
      params.startDate = customStart;
      params.endDate = customEnd;
    }
    if (deviceFilter) params.device = deviceFilter;
    if (countryFilter) params.country = countryFilter;
    if (pageFilter) params.page = pageFilter;

    return params;
  };

  const queryParams = getQueryParams();
  const hasActiveFilters =
    !!deviceFilter || !!countryFilter || !!pageFilter;

  // 2. Fetch Metrics Query
  const {
    data: metricsData,
    isLoading: isMetricsLoading,
    refetch: refetchMetrics,
  } = useQuery({
    queryKey: ["metrics", queryParams],
    queryFn: () => analyticsApi.getMetrics(queryParams),
    enabled: !!selectedWebId,
  });

  // 3. Fetch Charts Query
  const { data: chartsData, isLoading: isChartsLoading } = useQuery({
    queryKey: ["charts", queryParams],
    queryFn: () => analyticsApi.getCharts(queryParams),
    enabled: !!selectedWebId,
  });

  // 4. Fetch Breakdowns Query
  const { data: breakdownsData } = useQuery({
    queryKey: ["breakdowns", queryParams],
    queryFn: () => analyticsApi.getBreakdowns(queryParams),
    enabled: !!selectedWebId,
  });

  // 5. Fetch Real-time Status Query (polled every 10s)
  const { data: realtimeData } = useQuery({
    queryKey: ["realtime", selectedWebId],
    queryFn: () => analyticsApi.getRealtime(selectedWebId),
    enabled: !!selectedWebId,
    refetchInterval: 10000, // auto poll every 10 seconds
  });

  const handleRefreshAll = () => {
    refetchMetrics();
    queryClient.invalidateQueries({ queryKey: ["charts", queryParams] });
    queryClient.invalidateQueries({ queryKey: ["breakdowns", queryParams] });
  };

  // Format Duration into Minutes and Seconds
  const formatDuration = (sec: number) => {
    if (!sec) return "0s";
    const m = Math.floor(sec / 60);
    const s = Math.round(sec % 60);
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  const currentMetrics = metricsData?.data?.current || {};
  const changeMetrics = metricsData?.data?.change || {};

  const charts = chartsData?.data || [];
  const breakdowns = breakdownsData?.data || {
    pages: [],
    referrers: [],
    campaigns: [],
    devices: [],
    browsers: [],
    os: [],
    countries: [],
    cities: [],
  };

  const onlineCount = realtimeData?.data?.onlineCount || 0;
  const realtimeFeed = realtimeData?.data?.feed || [];
  const activePagesRealtime = realtimeData?.data?.activePages || [];

  if (isWebsitesLoading) {
    return <div className="py-20 text-center text-xs text-slate-400 italic">Đang tải cấu hình dự án...</div>;
  }

  const renderTabSelector = () => (
    <div className="glass p-1 rounded-full flex gap-1.5 w-full md:w-fit mb-6 border border-white/10">
      <button
        onClick={() => handleTabChange("dashboard")}
        className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
          activeTab === "dashboard"
            ? "bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-md shadow-red-600/20"
            : "text-slate-350 hover:text-white hover:bg-white/5"
        }`}
      >
        <LayoutDashboard className="w-3.5 h-3.5" />
        Bảng điều khiển
      </button>
      <button
        onClick={() => handleTabChange("websites")}
        className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-6 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
          activeTab === "websites"
            ? "bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-md shadow-red-600/20"
            : "text-slate-350 hover:text-white hover:bg-white/5"
        }`}
      >
        <Globe className="w-3.5 h-3.5" />
        Quản lý Website
      </button>
    </div>
  );

  if (websites.length === 0) {
    return (
      <div className="space-y-6">
        {renderTabSelector()}
        
        {activeTab === "dashboard" ? (
          <div className="glass py-20 text-center rounded-2xl max-w-xl mx-auto mt-12 shadow-sm p-6">
            <Globe className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-sm font-bold text-white">Không tìm thấy Website nào trong hệ thống</p>
            <p className="text-[11px] text-slate-300 mt-1.5 mb-6">Bạn cần đăng ký ít nhất một website để xem bảng thống kê</p>
            <button
              onClick={() => handleTabChange("websites")}
              className="bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all duration-150 shadow-lg shadow-red-600/20"
            >
              Đăng ký Website mới
            </button>
          </div>
        ) : (
          <Websites />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {renderTabSelector()}

      {activeTab === "websites" ? (
        <Websites />
      ) : (
        <>
      {/* Top Controls Bar - Sticky on Desktop with blur */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 glass p-4.5 rounded-2xl md:sticky md:top-4 z-20 transition-all duration-300">
        
        {/* Left Side: Website selection */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/5 border border-white/10 text-white rounded-xl">
            <Globe className="w-4 h-4" />
          </div>
          <select
            value={selectedWebId}
            onChange={(e) => handleWebsiteChange(e.target.value)}
            className="bg-white/5 border border-white/10 hover:bg-white/10 text-sm text-white py-2 px-3.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500/30 font-bold shadow-sm cursor-pointer transition-all duration-200"
          >
            {websites.map((web: any) => (
              <option key={web._id} value={web._id} className="bg-slate-900 text-white">
                {web.name} ({web.domain})
              </option>
            ))}
          </select>

          <button
            onClick={handleRefreshAll}
            className="p-2 text-white hover:bg-white/10 rounded-xl border border-white/10 bg-white/5 transition-all duration-200 shadow-sm"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Right Side: Period selection */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/5 border border-white/10 rounded-xl text-white">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-white py-2 px-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500/30 font-bold shadow-sm cursor-pointer transition-all duration-200"
            >
              <option value="today" className="bg-slate-900 text-white">Hôm nay</option>
              <option value="yesterday" className="bg-slate-900 text-white">Hôm qua</option>
              <option value="7days" className="bg-slate-900 text-white">7 ngày qua</option>
              <option value="30days" className="bg-slate-900 text-white">30 ngày qua</option>
              <option value="month" className="bg-slate-900 text-white">Tháng này</option>
              <option value="prev_month" className="bg-slate-900 text-white">Tháng trước</option>
              <option value="year" className="bg-slate-900 text-white">Năm nay</option>
              <option value="custom" className="bg-slate-900 text-white">Tùy chọn...</option>
            </select>
          </div>

          {/* Custom Date Pickers */}
          {period === "custom" && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="bg-white/5 dark:bg-slate-900/40 border border-white/10 text-xs text-white py-1.5 px-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 shadow-sm"
              />
              <span className="text-slate-400 text-xs font-bold">-</span>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="bg-white/5 dark:bg-slate-900/40 border border-white/10 text-xs text-white py-1.5 px-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 shadow-sm"
              />
            </div>
          )}
        </div>
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 bg-red-500/[0.03] dark:bg-red-500/[0.05] border border-red-500/10 dark:border-red-500/20 px-4 py-2.5 rounded-2xl">
          <span className="text-[10px] text-red-500 dark:text-red-400 font-extrabold uppercase tracking-wider mr-2">
            Đang lọc:
          </span>

          {deviceFilter && (
            <span className="flex items-center gap-1.5 bg-red-500/10 dark:bg-red-950/40 border border-red-500/20 dark:border-red-900/50 text-red-500 dark:text-red-400 text-[10px] font-bold px-2.5 py-1 rounded-lg">
              Thiết bị: {deviceFilter}
              <button onClick={() => setDeviceFilter("")} className="hover:text-red-400 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {countryFilter && (
            <span className="flex items-center gap-1.5 bg-red-500/10 dark:bg-red-950/40 border border-red-500/20 dark:border-red-900/50 text-red-500 dark:text-red-400 text-[10px] font-bold px-2.5 py-1 rounded-lg">
              Quốc gia: {countryFilter}
              <button onClick={() => setCountryFilter("")} className="hover:text-red-400 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          {pageFilter && (
            <span className="flex items-center gap-1.5 bg-red-500/10 dark:bg-red-950/40 border border-red-500/20 dark:border-red-900/50 text-red-500 dark:text-red-400 text-[10px] font-bold px-2.5 py-1 rounded-lg">
              Trang: {pageFilter}
              <button onClick={() => setPageFilter("")} className="hover:text-red-400 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}

          <button
            onClick={clearAllFilters}
            className="text-[10px] text-slate-550 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 underline font-bold ml-auto transition-colors"
          >
            Xóa tất cả bộ lọc
          </button>
        </div>
      )}

      {/* High Level Metrics Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <CardMetric
          title="Lượt xem trang"
          value={isMetricsLoading ? "..." : (currentMetrics.pageViews || 0).toLocaleString()}
          change={changeMetrics.pageViews}
          icon={Eye}
        />
        <CardMetric
          title="Khách truy cập"
          value={isMetricsLoading ? "..." : (currentMetrics.visitors || 0).toLocaleString()}
          change={changeMetrics.visitors}
          icon={Users}
        />
        <CardMetric
          title="Số phiên truy cập"
          value={isMetricsLoading ? "..." : (currentMetrics.sessions || 0).toLocaleString()}
          change={changeMetrics.sessions}
          icon={Globe}
        />
        <CardMetric
          title="Thời gian trung bình"
          value={isMetricsLoading ? "..." : formatDuration(currentMetrics.avgDuration)}
          change={changeMetrics.avgDuration}
          icon={Clock}
        />
        <CardMetric
          title="Tỷ lệ thoát"
          value={isMetricsLoading ? "..." : `${currentMetrics.bounceRate || 0}%`}
          change={changeMetrics.bounceRate}
          icon={Percent}
          isBounceRate
        />
      </div>

      {/* Main Charts & Feed Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend line Chart - 2/3 width on large screens */}
        <div className="lg:col-span-2">
          {isChartsLoading ? (
            <div className="glass h-[400px] flex items-center justify-center text-xs text-slate-400 italic">
              Đang vẽ biểu đồ xu hướng...
            </div>
          ) : (
            <ChartTraffic data={charts} />
          )}
        </div>

        {/* Realtime online active users count + details */}
        <div>
          <div className="glass p-6 flex flex-col justify-between h-full min-h-[400px]">
            <div>
              <h4 className="text-base font-extrabold text-slate-900">Đang truy cập</h4>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">Thống kê số lượng phiên truy cập trực tiếp ngay bây giờ</p>
            </div>

            <div className="flex flex-col items-center justify-center my-6">
              <div className="relative flex items-center justify-center mb-4">
                {/* Pulsing glow circles behind number */}
                <span className="absolute w-28 h-28 rounded-full bg-emerald-500/10 animate-ping"></span>
                <span className="absolute w-20 h-20 rounded-full bg-emerald-500/20 animate-pulse-slow"></span>
                <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 shadow-inner">
                  <Users className="w-6 h-6 text-emerald-600 animate-pulse" />
                </div>
              </div>
              <span className="text-6xl font-black tracking-tighter text-slate-900 leading-none">{onlineCount}</span>
              <span className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-widest mt-3.5 flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Người dùng Online
              </span>
            </div>

            {/* Active pages list of online users */}
            <div className="space-y-2.5 max-h-36 overflow-y-auto pr-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Các trang đang xem:</span>
              {activePagesRealtime.length === 0 ? (
                <div className="text-[10px] text-slate-400 italic font-semibold">Không có phiên tích cực</div>
              ) : (
                activePagesRealtime.map((ap: any, index: number) => (
                  <div key={index} className="flex justify-between items-center text-xs py-2 px-3 bg-slate-50 border border-slate-100/50 rounded-xl">
                    <span className="text-slate-700 font-semibold truncate max-w-[80%]">{ap.url}</span>
                    <span className="font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg text-[10px]">
                      {ap.count}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Breakdowns section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ChartPieBreakdown
          title="Thiết bị truy cập"
          subtitle="Tỷ lệ phân bổ theo loại thiết bị của khách"
          data={breakdowns.devices}
        />

        <ListBreakdown
          title="Trang xem nhiều nhất"
          columnName="Đường dẫn trang"
          data={breakdowns.pages}
          onFilterClick={setPageFilter}
        />

        <ListBreakdown
          title="Nguồn giới thiệu"
          columnName="Nguồn / Tên miền"
          data={breakdowns.referrers}
        />
      </div>

      {/* Bottom Grid: Locations breakdown & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ListBreakdown
            title="Quốc gia"
            columnName="Tên quốc gia"
            data={breakdowns.countries}
            onFilterClick={setCountryFilter}
            heightClass="h-[520px]"
          />
        </div>
        <div className="lg:col-span-2">
          <FeedActivity feed={realtimeFeed} />
        </div>
      </div>
        </>
      )}
    </div>
  );
}          
