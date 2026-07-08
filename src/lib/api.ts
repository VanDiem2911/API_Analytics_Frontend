import axios from "axios";

const API_URL = (import.meta as any).env.VITE_API_URL || "";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically inject JWT Bearer Token in each request if saved
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("analytics_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Automatically handle 401 Unauthorized errors (expired/invalid sessions)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const url = error.config?.url;
      // Do not redirect if it's the login route itself
      if (url && !url.includes("/api/auth/login")) {
        localStorage.removeItem("analytics_token");
        localStorage.removeItem("analytics_user_name");
        localStorage.removeItem("analytics_user_role");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authApi = {
  login: async (credentials: any) => {
    const res = await apiClient.post("/api/auth/login", credentials);
    return res.data;
  },
  register: async (userData: any) => {
    const res = await apiClient.post("/api/auth/register", userData);
    return res.data;
  },
};

// Website CRUD APIs
export const websiteApi = {
  list: async () => {
    const res = await apiClient.get("/api/websites");
    return res.data;
  },
  create: async (data: { name: string; domain: string }) => {
    const res = await apiClient.post("/api/websites", data);
    return res.data;
  },
  update: async (id: string, data: { name?: string; domain?: string; status?: string }) => {
    const res = await apiClient.put(`/api/websites/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await apiClient.delete(`/api/websites/${id}`);
    return res.data;
  },
};

// Analytics Data APIs
export const analyticsApi = {
  getMetrics: async (params: {
    websiteId: string;
    period: string;
    startDate?: string;
    endDate?: string;
    browser?: string;
    device?: string;
    country?: string;
    page?: string;
    campaign?: string;
  }) => {
    const res = await apiClient.get("/api/analytics/metrics", { params });
    return res.data;
  },
  getCharts: async (params: {
    websiteId: string;
    period: string;
    startDate?: string;
    endDate?: string;
    browser?: string;
    device?: string;
    country?: string;
    page?: string;
    campaign?: string;
  }) => {
    const res = await apiClient.get("/api/analytics/charts", { params });
    return res.data;
  },
  getBreakdowns: async (params: {
    websiteId: string;
    period: string;
    startDate?: string;
    endDate?: string;
    browser?: string;
    device?: string;
    country?: string;
    page?: string;
    campaign?: string;
  }) => {
    const res = await apiClient.get("/api/analytics/breakdowns", { params });
    return res.data;
  },
  getRealtime: async (websiteId: string) => {
    const res = await apiClient.get("/api/analytics/realtime", {
      params: { websiteId },
    });
    return res.data;
  },
};
