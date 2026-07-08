import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { websiteApi, analyticsApi } from "../lib/api";
import CardMetric from "../components/CardMetric";
import ChartTraffic from "../components/ChartTraffic";
import ChartPieBreakdown from "../components/ChartPieBreakdown";
import ListBreakdown from "../components/ListBreakdown";
import FeedActivity from "../components/FeedActivity";
import {
  Users,
  Eye,
  Clock,
  Percent,
  Calendar,
  Globe,
  X,
  RefreshCw,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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
    return <div className="py-20 text-center text-sm text-gray-500">Đang tải cấu hình dự án...</div>;
  }

  if (websites.length === 0) {
    return (
      <div className="glass py-20 text-center rounded-xl max-w-xl mx-auto mt-12">
        <Globe className="w-12 h-12 text-gray-700 mx-auto mb-3" />
        <p className="text-sm font-semibold text-gray-400">Không tìm thấy Website nào trong hệ thống</p>
        <p className="text-xs text-gray-500 mt-1 mb-6">Bạn cần đăng ký ít nhất một website để xem bảng thống kê</p>
        <button
          onClick={() => navigate("/websites")}
          className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-all duration-150 shadow-lg shadow-red-600/10"
        >
          Đi tới trang đăng ký Website
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-gray-900/20 border border-gray-800/40 p-4 rounded-xl backdrop-blur-md">
        
        {/* Left Side: Website selection */}
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-red-500 flex-shrink-0" />
          <select
            value={selectedWebId}
            onChange={(e) => handleWebsiteChange(e.target.value)}
            className="bg-gray-950 border border-gray-800 text-sm text-gray-200 py-1.5 px-3 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 font-semibold"
          >
            {websites.map((web: any) => (
              <option key={web._id} value={web._id}>
                {web.name} ({web.domain})
              </option>
            ))}
          </select>

          <button
            onClick={handleRefreshAll}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-800/40 rounded-lg transition-all duration-150"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Right Side: Period selection */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="bg-gray-950 border border-gray-800 text-xs text-gray-300 py-1.5 px-2.5 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            >
              <option value="today">Hôm nay</option>
              <option value="yesterday">Hôm qua</option>
              <option value="7days">7 ngày qua</option>
              <option value="30days">30 ngày qua</option>
              <option value="month">Tháng này</option>
              <option value="prev_month">Tháng trước</option>
              <option value="year">Năm nay</option>
              <option value="custom">Tùy chọn...</option>
            </select>
          </div>

          {/* Custom Date Pickers */}
          {period === "custom" && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-200">
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="bg-gray-950 border border-gray-800 text-xs text-gray-300 py-1 px-2 rounded focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
              <span className="text-gray-600 text-xs">-</span>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="bg-gray-950 border border-gray-800 text-xs text-gray-300 py-1 px-2 rounded focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 bg-red-500/5 border border-red-500/10 px-4 py-2.5 rounded-xl">
          <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider mr-2">
            Đang lọc:
          </span>

          {deviceFilter && (
            <span className="flex items-center gap-1 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-semibold px-2 py-0.5 rounded-md">
              Thiết bị: {deviceFilter}
              <button onClick={() => setDeviceFilter("")} className="hover:text-red-400">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {countryFilter && (
            <span className="flex items-center gap-1 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-semibold px-2 py-0.5 rounded-md">
              Quốc gia: {countryFilter}
              <button onClick={() => setCountryFilter("")} className="hover:text-red-400">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {pageFilter && (
            <span className="flex items-center gap-1 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-semibold px-2 py-0.5 rounded-md">
              Trang: {pageFilter}
              <button onClick={() => setPageFilter("")} className="hover:text-red-400">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={clearAllFilters}
            className="text-[10px] text-gray-400 hover:text-gray-200 underline font-semibold ml-auto transition-all"
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
            <div className="glass h-[400px] flex items-center justify-center text-sm text-gray-500 rounded-xl">
              Đang vẽ biểu đồ xu hướng...
            </div>
          ) : (
            <ChartTraffic data={charts} />
          )}
        </div>

        {/* Realtime online active users count + details */}
        <div>
          <div className="glass p-6 rounded-xl flex flex-col justify-between h-full min-h-[400px]">
            <div>
              <h4 className="text-lg font-bold text-white mb-2">Đang truy cập</h4>
              <p className="text-xs text-gray-400 mb-6">Thống kê số lượng phiên truy cập trực tiếp ngay bây giờ</p>
            </div>

            <div className="flex flex-col items-center justify-center my-6">
              <div className="relative flex items-center justify-center mb-3">
                {/* Pulsing glow circles behind number */}
                <span className="absolute w-24 h-24 rounded-full bg-emerald-500/10 animate-ping"></span>
                <span className="absolute w-16 h-16 rounded-full bg-emerald-500/20 animate-pulse-slow"></span>
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                  <Users className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
              <span className="text-5xl font-black tracking-tight text-white">{onlineCount}</span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mt-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Người dùng Online
              </span>
            </div>

            {/* Active pages list of online users */}
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              <span className="text-[10px] uppercase font-bold text-gray-500">Các trang đang xem:</span>
              {activePagesRealtime.length === 0 ? (
                <div className="text-[10px] text-gray-600 italic">Không có phiên tích cực</div>
              ) : (
                activePagesRealtime.map((ap: any, index: number) => (
                  <div key={index} className="flex justify-between items-center text-xs">
                    <span className="text-gray-300 font-medium truncate max-w-[80%]">{ap.url}</span>
                    <span className="font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
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
          />
        </div>
        <div className="lg:col-span-2">
          <FeedActivity feed={realtimeFeed} />
        </div>
      </div>
    </div>
  );
}
