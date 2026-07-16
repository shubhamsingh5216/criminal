import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import DashboardPage from '../pages/DashboardPage';
import AddCriminalPage from '../pages/AddCriminalPage';
import MatchCriminalPage from '../pages/MatchCriminalPage';
import DatabasePage from '../pages/DatabasePage';
import SettingsPage from '../pages/SettingsPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="add-criminal" element={<AddCriminalPage />} />
        <Route path="match-criminal" element={<MatchCriminalPage />} />
        <Route path="database" element={<DatabasePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
