import React from 'react';
import { PageType, UserSession } from '../types';
import { Menu, Calendar, Clock, Bell, Settings, HelpCircle } from 'lucide-react';

interface TopbarProps {
  currentPage: PageType;
  onMenuToggle: () => void;
  session: UserSession | null;
}

export default function Topbar({ currentPage, onMenuToggle, session }: TopbarProps) {
  // Get Arabic label for the current page
  const getPageTitle = (page: PageType) => {
    switch (page) {
      case 'dashboard':
        return 'لوحة التحكم والمؤشرات';
      case 'employees':
        return 'إدارة الموظفين';
      default:
        return 'النظام';
    }
  };

  // Format today's date elegantly in Arabic
  const getArabicDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date().toLocaleDateString('ar-EG', options);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-100 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger menu */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 hover:bg-slate-50 border border-slate-100 rounded-xl text-slate-600 transition-colors cursor-pointer"
          aria-label="قائمة التنقل"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page Title */}
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">
            {getPageTitle(currentPage)}
          </h2>
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
            <span>{getArabicDate()}</span>
          </div>
        </div>
      </div>

      {/* Topbar Actions */}
      <div className="flex items-center gap-3">
        {/* Optional Search / Info */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-500">
          <Clock className="w-3.5 h-3.5 text-indigo-500" />
          <span>التوقيت: {new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>

        {/* Notifications and Settings Icons */}
        <button className="p-2 hover:bg-slate-50 text-slate-500 hover:text-indigo-600 rounded-xl border border-transparent hover:border-slate-100 transition-all cursor-pointer relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-rose-500"></span>
        </button>

        <button className="p-2 hover:bg-slate-50 text-slate-500 hover:text-indigo-600 rounded-xl border border-transparent hover:border-slate-100 transition-all cursor-pointer">
          <Settings className="w-5 h-5" />
        </button>

        <span className="h-5 w-px bg-slate-100 mx-1"></span>

        {/* Tiny Profile Display */}
        {session && (
          <div className="flex items-center gap-2">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-700 leading-3">{session.name || 'مدير'}</span>
              <span className="text-[10px] text-slate-400 font-light mt-0.5">
                {session.role || 'مسؤول الموارد'}
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-xs text-indigo-600">
              {session.name ? session.name[0] : 'U'}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
