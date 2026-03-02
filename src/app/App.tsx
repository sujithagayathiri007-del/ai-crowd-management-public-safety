import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router";
import { HomePage } from "./pages/HomePage";
import { DashboardPage } from "./pages/DashboardPage";
import { LiveCamerasPage } from "./pages/LiveCamerasPage";
import { RiskMapPage } from "./pages/RiskMapPage";
import { AlertsPage } from "./pages/AlertsPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { SystemHealthPage } from "./pages/SystemHealthPage";
import { LogsPage } from "./pages/LogsPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route
          path="/live-cameras"
          element={<LiveCamerasPage />}
        />
        <Route path="/risk-map" element={<RiskMapPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/system-health"
          element={<SystemHealthPage />}
        />
        <Route path="/logs" element={<LogsPage />} />
      </Routes>
    </Router>
  );
}