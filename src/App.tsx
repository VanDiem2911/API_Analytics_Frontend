import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Component, Suspense, lazy, type ReactNode } from "react";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Layout = lazy(() => import("./components/Layout"));

// Initialize Query Client for React Query caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30_000,
      gcTime: 10 * 60_000,
      retryDelay: (attemptIndex) =>
        Math.min(1000 * 2 ** attemptIndex, 10_000),
    },
  },
});

function RouteFallback() {
  return (
    <div className="min-h-dvh bg-black px-6 py-20 text-center text-xs font-semibold text-slate-300">
      <div className="mx-auto max-w-xs rounded-2xl border border-white/10 bg-white/5 p-5">
        Đang tải giao diện, vui lòng chờ một chút...
      </div>
    </div>
  );
}

class AppErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-dvh bg-black px-6 py-20 text-center text-sm font-semibold text-slate-200">
          <div className="mx-auto max-w-sm rounded-2xl border border-red-500/20 bg-red-500/10 p-5">
            <p>Không tải được một phần giao diện. Có thể mạng đang yếu hoặc file vừa được cập nhật.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 min-h-11 rounded-xl bg-red-600 px-4 text-xs font-extrabold text-white hover:bg-red-500"
            >
              Tải lại trang
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Protected Route wrapper component
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("analytics_token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Redirect if already logged in
function AuthRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("analytics_token");
  if (token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              {/* Auth Routes */}
              <Route
                path="/login"
                element={
                  <AuthRoute>
                    <Login />
                  </AuthRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <AuthRoute>
                    <Register />
                  </AuthRoute>
                }
              />

              {/* Protected Application Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
              </Route>

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </QueryClientProvider>
    </AppErrorBoundary>
  );
}

export default App;
