import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./store";
import { AuthProvider } from "./contexts/MockAuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import ThemeWrapper from "./components/layout/ThemeWrapper";

// Lazy loaded components
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const AnalyticsDashboard = lazy(() => import("./pages/AnalyticsDashboard"));

// Fix: Correctly implement lazy loading for named exports
const ApiSettings = lazy(() => 
  import("./pages/ApiSettings/ApiSettings").then(module => ({ 
    default: module.ApiSettings 
  }))
);
const ChatAnalysis = lazy(() => 
  import("./pages/ChatAnalysis/ChatAnalysis").then(module => ({ 
    default: module.ChatAnalysis 
  }))
);
const DashboardEditor = lazy(() => 
  import("./pages/DashboardEditor/DashboardEditor").then(module => ({ 
    default: module.DashboardEditor 
  }))
);
const SavedDashboards = lazy(() => 
  import("./pages/SavedDashboards/SavedDashboards").then(module => ({ 
    default: module.SavedDashboards 
  }))
);
const LandingPage = lazy(() => 
  import("./pages/LandingPage/LandingPage").then(module => ({ 
    default: module.LandingPage 
  }))
);
const Reports = lazy(() => 
  import("./pages/Reports/Reports").then(module => ({ 
    default: module.Reports 
  }))
);
const Settings = lazy(() => 
  import("./pages/Settings/Settings").then(module => ({ 
    default: module.Settings 
  }))
);
const Customers = lazy(() => 
  import("./pages/Customers/Customers").then(module => ({ 
    default: module.Customers 
  }))
);
const Profile = lazy(() => 
  import("./pages/Profile/Profile").then(module => ({ 
    default: module.Profile 
  }))
);
const ProfileEdit = lazy(() => 
  import("./pages/Profile/ProfileEdit").then(module => ({ 
    default: module.ProfileEdit 
  }))
);
const Notifications = lazy(() => 
  import("./pages/Notifications/Notifications").then(module => ({ 
    default: module.Notifications 
  }))
);

// Loading fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen w-full bg-white dark:bg-gray-900">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
  </div>
);

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeWrapper>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Router>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />

                  {/* Protected routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route element={<DashboardLayout />}>
                      <Route
                        path="/"
                        element={<Navigate to="/dashboard" replace />}
                      />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/orders" element={<OrdersPage />} />
                      <Route path="/customers" element={<Customers />} />
                      <Route path="/analytics" element={<AnalyticsDashboard />} />
                      <Route path="/api-settings" element={<ApiSettings />} />
                      <Route path="/chat" element={<ChatAnalysis />} />
                      <Route
                        path="/dashboard-editor"
                        element={<DashboardEditor />}
                      />
                      <Route
                        path="/dashboard-editor/:id"
                        element={<DashboardEditor />}
                      />
                      <Route
                        path="/saved-dashboards"
                        element={<SavedDashboards />}
                      />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/profile/edit" element={<ProfileEdit />} />
                      <Route path="/notifications" element={<Notifications />} />
                    </Route>
                  </Route>

                  {/* Catch all */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </Router>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeWrapper>
    </Provider>
  );
};

export default App;
