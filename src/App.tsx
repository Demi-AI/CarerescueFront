import { BrowserRouter, Navigate, Route, Routes, Link } from 'react-router';
import { AppProvider } from './context/AppContext';
import AppLayout from './layouts/AppLayout';
import DashboardPage from './pages/DashboardPage';
import EventsPage from './pages/EventsPage';
import RescuePage from './pages/RescuePage';
import PlanComparisonPage from './pages/PlanComparisonPage';
import AnalyticsPage from './pages/AnalyticsPage';
import RecordsPage from './pages/RecordsPage';
import SettingsPage from './pages/SettingsPage';
export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="rescue" element={<RescuePage />} />
            <Route path="rescue/:shiftId" element={<PlanComparisonPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="records" element={<RecordsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route
              path="*"
              element={
                <section className="panel">
                  <h2>找不到頁面</h2>
                  <Link to="/dashboard">返回總覽</Link>
                </section>
              }
            />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
