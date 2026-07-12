import React, { useState, useEffect } from 'react';
import { PageType, UserSession } from './types';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import EmployeesPage from './components/EmployeesPage';
import { supabase } from './lib/supabase';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Restore session from localStorage if available (simple persistence)
  useEffect(() => {
    const savedSession = localStorage.getItem('hr_system_session');
    if (savedSession) {
      try {
        setSession(JSON.parse(savedSession));
      } catch (e) {
        localStorage.removeItem('hr_system_session');
      }
    }
  }, []);

  const handleLoginSuccess = (newSession: UserSession) => {
    setSession(newSession);
    localStorage.setItem('hr_system_session', JSON.stringify(newSession));
    setCurrentPage('dashboard');
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // Ignore if Supabase is not configured
    }
    setSession(null);
    localStorage.removeItem('hr_system_session');
  };

  // Render the current active main content
  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'employees':
        return <EmployeesPage />;
      default:
        return <Dashboard />;
    }
  };

  // If there is no active session, show the login page
  if (!session) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div id="app_layout_wrapper" className="min-h-screen bg-slate-50/50 flex text-right font-sans antialiased text-slate-800" dir="rtl">
      {/* Sidebar Component */}
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onLogout={handleLogout}
        session={session}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Topbar Component */}
        <Topbar
          currentPage={currentPage}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          session={session}
        />

        {/* Dynamic Main Page Content with smooth animation */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Humble Footer */}
        <footer className="py-4 px-8 border-t border-slate-100/80 text-center text-xs text-slate-400 font-light flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl w-full mx-auto">
          <span>نظام إدارة الموارد البشرية - الإصدار الأولي الفني</span>
          <span className="text-slate-300">تم التطوير والبرمجة بدعم كامل للغة العربية والـ RTL</span>
        </footer>
      </div>
    </div>
  );
}
