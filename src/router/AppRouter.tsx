import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import TransactionsPage from '../pages/TransactionsPage';
import InvestmentsPage from '../pages/InvestmentsPage';
import GoalsPage from '../pages/GoalsPage';
import StocksPage from '../pages/StocksPage';
import SalaryPlannerPage from '../pages/SalaryPlannerPage';
import IPOListPage from '../pages/IPOListPage';
import IPODetailPage from '../pages/IPODetailPage';
import LandingPage from '../pages/LandingPage';
import PricingPage from '../pages/PricingPage';
import AppLayout from '../components/layout/AppLayout';
import LoginPage from '../pages/Auth/LoginPage';
import { useAuth } from '../context/AuthContext';

const PrivateRoutes: React.FC = () => (
  <AppLayout>
    <Routes>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/transactions" element={<TransactionsPage />} />
      <Route path="/goals" element={<GoalsPage />} />
      <Route path="/investments" element={<InvestmentsPage />} />
      <Route path="/stocks" element={<StocksPage />} />
      <Route path="/salary-planner" element={<SalaryPlannerPage />} />
      <Route path="/ipos" element={<IPOListPage />} />
      <Route path="/ipos/:id" element={<IPODetailPage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  </AppLayout>
);

const AppRouter: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
      <Route path="/landing" element={<Navigate to="/" replace />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route
        path="/*"
        element={
          user ? (
            <PrivateRoutes />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

export default AppRouter;
