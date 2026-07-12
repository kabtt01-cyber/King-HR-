import React from 'react';
import { Users, UserPlus, Search, Filter, FolderOpen, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function EmployeesPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">قائمة الموظفين</h1>
          <p className="text-slate-400 text-sm mt-0.5 font-light">إدارة سجلات الموظفين وعقود العمل والبيانات الأساسية</p>
        </div>
        <button 
          disabled
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 border border-slate-200 text-slate-400 rounded-xl text-sm font-medium cursor-not-allowed"
        >
          <UserPlus className="w-4 h-4" />
          <span>إضافة موظف جديد</span>
        </button>
      </div>

      {/* Filter and Search Bar (Placeholder UI) */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm shadow-slate-100/20 flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            disabled
            placeholder="البحث باسم الموظف، البريد أو القسم..."
            className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-150 rounded-xl text-sm text-slate-400 placeholder-slate-400 cursor-not-allowed focus:outline-none"
          />
        </div>

        {/* Filters Skeletons */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button 
            disabled 
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-50 border border-slate-150 text-slate-400 rounded-xl text-xs cursor-not-allowed"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>فلترة حسب القسم</span>
          </button>
          
          <button 
            disabled 
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-50 border border-slate-150 text-slate-400 rounded-xl text-xs cursor-not-allowed"
          >
            <span>الحالة: الكل</span>
          </button>
        </div>
      </div>

      {/* Empty State Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-slate-100 rounded-2xl p-10 text-center min-h-[350px] flex flex-col items-center justify-center shadow-xs"
      >
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 mb-5 animate-pulse">
          <Users className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-700">لا توجد سجلات موظفين في الوقت الحالي</h3>
        <p className="text-slate-400 text-sm mt-1.5 max-w-md mx-auto font-light leading-relaxed">
          هذه الصفحة فارغة لعدم وجود جداول أو بيانات مخزنة. سيتم استعراض وإدارة جميع موظفيك وعقودهم وتفاصيل أقسامهم هنا بمجرد تهيئة قاعدة بياناتك.
        </p>

        {/* Info Box */}
        <div className="mt-8 p-4 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 text-xs flex items-start gap-3 max-w-lg text-right">
          <AlertCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-slate-700">ملاحظة للمطور:</p>
            <p className="font-light text-slate-500 leading-normal">
              تم تجهيز التصميم بكامل التنسيقات المتجاوبة ودعم الاتجاه من اليمين إلى اليسار (RTL). يمكنك البدء لاحقاً بإنشاء جدول <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-mono">employees</code> في Supabase وربط عمليات الاستعلام والفلترة بسهولة.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
