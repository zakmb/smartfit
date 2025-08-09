import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CheckinProvider } from './contexts/CheckinContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { ToastProvider } from './contexts/ToastContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Checkin from './components/Checkin';
import Calendar from './components/Calendar';
import PersonalizationPage from './components/PersonalizationPage';
import Sidebar from './components/Sidebar';
import LoadingSpinner from './components/LoadingSpinner';
import SessionTimeoutModal from './components/SessionTimeoutModal';
import ToastContainer from './components/Toast';
import './App.css';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return currentUser ? <>{children}</> : <Navigate to="/login" />;
}



function AppLayout({ children }: { children: React.ReactNode }) {
  const { 
    showSessionTimeoutModal, 
    setShowSessionTimeoutModal, 
    resetSessionTimeout 
  } = useAuth();

  const handleExtendSession = () => {
    resetSessionTimeout();
    setShowSessionTimeoutModal(false);
  };

  const handleCloseModal = () => {
    setShowSessionTimeoutModal(false);
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
      <SessionTimeoutModal
        isOpen={showSessionTimeoutModal}
        onClose={handleCloseModal}
        onExtend={handleExtendSession}
      />
      <ToastContainer />
    </div>
  );
}

function AppRoutes() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <SettingsProvider>
            <CheckinProvider>
            <Routes>
              <Route path="/login" element={
                <>
                  <Login />
                  <ToastContainer />
                </>
              } />
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <AppLayout>
                      <Dashboard />
                    </AppLayout>
                  </PrivateRoute>
                } 
              />

              <Route 
                path="/checkin" 
                element={
                  <PrivateRoute>
                    <AppLayout>
                      <Checkin />
                    </AppLayout>
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/calendar" 
                element={
                  <PrivateRoute>
                    <AppLayout>
                      <Calendar />
                    </AppLayout>
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/personalization" 
                element={
                  <PrivateRoute>
                    <AppLayout>
                      <PersonalizationPage />
                    </AppLayout>
                  </PrivateRoute>
                } 
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
            </CheckinProvider>
          </SettingsProvider>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default AppRoutes;
