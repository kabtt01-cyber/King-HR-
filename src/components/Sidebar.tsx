import React from 'react';
import { PageType, UserSession } from '../types';
import { LayoutDashboard, Users, LogOut, Sparkles, X, UserCog, Settings } from 'lucide-react';

interface SidebarProps {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  onLogout: () => void;
  session: UserSession | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ currentPage, setCurrentPage, onLogout, session, isOpen, onClose }: SidebarProps) {
  // Define all available menu items
  const allMenuItems = [
    {
      id: 'dashboard' as PageType,
      label: 'لوحة التحكم',
      icon: LayoutDashboard,
      roles: ['admin', 'hr'],
    },
    {
      id: 'employees' as PageType,
      label: 'إدارة الموظفين',
      icon: Users,
      roles: ['admin', 'hr'],
    },
    {
      id: 'users' as PageType,
      label: 'إدارة المستخدمين',
      icon: UserCog,
      roles: ['admin'], // Admin only
    },
    {
      id: 'settings' as PageType,
      label: 'الإعدادات العامة',
      icon: Settings,
      roles: ['admin'], // Admin only
    },
  ];

  // Filter based on session user role (defaulting to 'hr' if not specified)
  const userRole = session?.role || 'hr';
  const filteredMenuItems = allMenuItems.filter(item => item.roles.includes(userRole));

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 right-0 z-50 w-72 bg-slate-900 text-white border-l border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-10
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div>
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-l from-white to-slate-300 bg-clip-text text-transparent">نظام الرواتب والـ HR</span>
            </div>
            
            {/* Mobile close button */}
            <button 
              onClick={onClose}
              className="lg:hidden p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Card */}
          {session && (
            <div className="p-4 mx-4 my-4 bg-slate-800/40 border border-slate-800/60 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-indigo-400 shrink-0">
                  {session.role === 'admin' ? 'M' : 'H'}
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-semibold text-sm truncate">{session.name || 'مستخدم النظام'}</h4>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{session.email}</p>
                </div>
              </div>
              
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full border
                  ${session.role === 'admin' 
                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' 
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                  {session.role === 'admin' ? 'مسؤول النظام (Admin)' : 'قسم شؤون الموظفين (HR)'}
                </span>
                
                {session.isDemo && (
                  <span className="text-[9px] text-slate-500 font-light shrink-0">وضع تجريبي</span>
                )}
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="px-4 space-y-1.5 mt-2">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer group
                    ${isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10 font-semibold' 
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}
                >
                  <Icon className={`w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-105
                    ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} 
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3.5 px-4 py-3 text-slate-400 hover:bg-rose-950/20 hover:text-rose-400 rounded-xl text-sm font-medium transition-colors cursor-pointer group"
          >
            <LogOut className="w-5 h-5 shrink-0 text-slate-400 group-hover:text-rose-400 transition-colors" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
}

