import React from 'react';
import { LayoutDashboard, Users, UserCheck, CalendarDays, ArrowUpLeft, Info, Sparkles, FolderOpen } from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard() {
  // We will build a beautiful "empty" dashboard structure as requested,
  // showing the framework cards, stats indicators with placeholder/zero values, and a clean empty state card.
  
  const placeholderStats = [
    {
      title: 'إجمالي الموظفين',
      value: '٠',
      change: 'لا يوجد موظفين مسجلين',
      icon: Users,
      color: 'indigo',
    },
    {
      title: 'الموظفين النشطين',
      value: '٠',
      change: 'بانتظار تهيئة قاعدة البيانات',
      icon: UserCheck,
      color: 'emerald',
    },
    {
      title: 'طلبات الإجازة المعلقة',
      value: '٠',
      change: 'لا يوجد طلبات حالية',
      icon: CalendarDays,
      color: 'amber',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-gradient-to-l from-slate-900 to-slate-800 rounded-2xl text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs border border-indigo-500/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>لوحة التحكم الأساسية</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">مرحباً بك في نظام إدارة الموارد البشرية</h1>
            <p className="text-slate-300 text-sm mt-1.5 font-light">تم إنشاء الهيكل والواجهات بنجاح. هذا العرض هو هيكل أولي للمشروع بانتظار ربط الجداول وقاعدة البيانات.</p>
          </div>
          <div className="shrink-0">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl text-xs font-medium backdrop-blur-md transition-all">
              قيد التطوير والربط
            </span>
          </div>
        </div>
      </motion.div>

      {/* Grid of Empty Stats Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {placeholderStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm shadow-slate-100/30 flex items-center justify-between"
            >
              <div className="space-y-2">
                <span className="text-sm text-slate-400 font-light block">{stat.title}</span>
                <span className="text-3xl font-bold text-slate-800 block">{stat.value}</span>
                <span className="text-xs text-slate-400 font-light flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-slate-300" />
                  {stat.change}
                </span>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center 
                ${stat.color === 'indigo' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100/50' : ''}
                ${stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/50' : ''}
                ${stat.color === 'amber' ? 'bg-amber-50 text-amber-600 border border-amber-100/50' : ''}
              `}>
                <Icon className="w-6 h-6" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty Dashboard Main Content Area */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white border border-slate-100 rounded-2xl p-8 text-center min-h-[300px] flex flex-col items-center justify-center shadow-xs"
      >
        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 mb-4">
          <FolderOpen className="w-8 h-8 text-indigo-300" />
        </div>
        <h3 className="text-lg font-bold text-slate-700">لا توجد بيانات لعرضها حالياً</h3>
        <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto font-light leading-relaxed">
          لوحة التحكم فارغة وجاهزة لاستقبال البيانات بمجرد إنشاء الجداول وربط نظام الموارد البشرية بقاعدة بيانات Supabase.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <span className="px-3.5 py-1.5 bg-slate-50 border border-slate-100 text-slate-500 rounded-xl text-xs font-medium">
            React v19
          </span>
          <span className="px-3.5 py-1.5 bg-slate-50 border border-slate-100 text-slate-500 rounded-xl text-xs font-medium">
            Tailwind v4
          </span>
          <span className="px-3.5 py-1.5 bg-slate-50 border border-slate-100 text-slate-500 rounded-xl text-xs font-medium">
            Supabase SDK
          </span>
        </div>
      </motion.div>
    </div>
  );
}
