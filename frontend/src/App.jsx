import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import MobileOnlyGuard from './components/MobileOnlyGuard';
import { ProtectedRoute, PublicRoute } from './components/RouteGuards';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ReferralPage from './pages/ReferralPage';
import RegisterPage from './pages/RegisterPage';
import TasksPage from './pages/TasksPage';
import WalletPage from './pages/WalletPage';

export default function App() {
  return (
    <MobileOnlyGuard>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/referrals" element={<ReferralPage />} />
            <Route path="/wallet" element={<WalletPage />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MobileOnlyGuard>
  );
}