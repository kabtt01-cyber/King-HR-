import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Employee } from '../types';
import { 
  Users, UserCheck, UserMinus, CalendarDays, Search, ArrowLeft, 
  Sparkles, FolderOpen, Landmark, Phone, Mail, Clock, RefreshCw, 
  TrendingUp, BarChart3, Activity, Briefcase, ChevronRight, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SystemLog {
  id: string;
  action: string;
  user: string;
  time: string;
  type: 'add' | 'edit' | 'delete' | 'status';
}

export default function Dashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Search state
  const [quickSearch, setQuickSearch] = useState('');
  
  // Selected employee detail state
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // System Logs State
  const [logs, setLogs] = useState<SystemLog[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: sbError } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });

      if (sbError) throw sbError;
      
      const fetchedEmployees = (data || []) as Employee[];
      setEmployees(fetchedEmployees);
      generateLogs(fetchedEmployees);
    } catch (err: any) {
      console.warn('Supabase dashboard query failed:', err);
      setError('فشلت عملية تحميل بيانات لوحة التحكم من قاعدة بيانات Supabase. يرجى التأكد من الاتصال.');
    } finally {
      setLoading(false);
    }
  };

  const generateLogs = (empList: Employee[]) => {
    // Attempt to load from localStorage first to keep it persistent
    const storedLogs = localStorage.getItem('hr_system_activity_logs');
    if (storedLogs) {
      try {
        setLogs(JSON.parse(storedLogs));
        return;
      } catch (e) {}
    }

    // fallback simulation based on loaded employees
    const simulated: SystemLog[] = [
      {
        id: 'log-1',
        action: 'تحديث بيانات الراتب والمسمى الوظيفي للموظف خالد بن وليد الشمري',
        user: 'سليمان خالد',
        time: 'منذ ساعتين',
        type: 'edit',
      },
      {
        id: 'log-2',
        action: 'تغيير حالة الموظف يوسف عمر الحربي إلى "غير نشط"',
        user: 'سليمان خالد',
        time: 'منذ ٥ ساعات',
        type: 'status',
      },
      {
        id: 'log-3',
        action: 'إضافة سجل موظف جديد: نورة عبد الله الدوسري (قسم التسويق)',
        user: 'هدى عبد الله',
        time: 'يوم أمس',
        type: 'add',
      },
      {
        id: 'log-4',
        action: 'الموافقة على تحديث إجازة محمد سليمان الفوزان',
        user: 'هدى عبد الله',
        time: 'منذ يومين',
        type: 'status',
      },
    ];
    setLogs(simulated);
    localStorage.setItem('hr_system_activity_logs', JSON.stringify(simulated));
  };

  const getInitialDemoEmployees = (): Employee[] => {
    return [
      {
        id: '1',
        employee_code: 'HR-1001',
        full_name: 'سارة عبد الرحمن العتيبي',
        national_id: '1098765432',
        phone: '+966509998887',
        email: 'sara.otaibi@example.com',
        department: 'الموارد البشرية',
        job_title: 'مديرة إدارة الموارد البشرية',
        hire_date: '2025-04-12',
        salary: 14500,
        status: 'نشط',
      },
      {
        id: '2',
        employee_code: 'IT-2005',
        full_name: 'خالد بن وليد الشمري',
        national_id: '1023456789',
        phone: '+966507776665',
        email: 'khalid.shamri@example.com',
        department: 'تقنية المعلومات',
        job_title: 'مهندس برمجيات أول',
        hire_date: '2025-01-08',
        salary: 11200,
        status: 'نشط',
      },
      {
        id: '3',
        employee_code: 'FIN-3001',
        full_name: 'محمد سليمان الفوزان',
        national_id: '1055544433',
        phone: '+966504443332',
        email: 'mohamed.fowzan@example.com',
        department: 'المالية',
        job_title: 'رئيس قسم الحسابات',
        hire_date: '2024-09-01',
        salary: 13000,
        status: 'إجازة',
      },
      {
        id: '4',
        employee_code: 'MKT-4002',
        full_name: 'نورة عبد الله الدوسري',
        national_id: '1088822233',
        phone: '+966503332221',
        email: 'noura.d@example.com',
        department: 'التسويق والمبيعات',
        job_title: 'أخصائية تسويق رقمي',
        hire_date: '2025-03-10',
        salary: 8700,
        status: 'نشط',
      },
      {
        id: '5',
        employee_code: 'HR-1004',
        full_name: 'عبد العزيز فهد السديري',
        national_id: '1044499988',
        phone: '+966501112223',
        email: 'a.sudairy@example.com',
        department: 'الموارد البشرية',
        job_title: 'أخصائي شؤون موظفين',
        hire_date: '2025-08-15',
        salary: 9500,
        status: 'نشط',
      },
      {
        id: '6',
        employee_code: 'IT-2010',
        full_name: 'يوسف عمر الحربي',
        national_id: '1066611122',
        phone: '+966508889990',
        email: 'y.harbi@example.com',
        department: 'تقنية المعلومات',
        job_title: 'مسؤول نظم الحماية',
        hire_date: '2024-05-19',
        salary: 10800,
        status: 'غير نشط',
      }
    ];
  };

  // Calculations for Stats Card
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'نشط').length;
  const vacationEmployees = employees.filter(e => e.status === 'إجازة').length;
  const inactiveEmployees = employees.filter(e => e.status === 'غير نشط').length;

  // Latest added employees (first 4 based on created_at or hire_date descending)
  const latestEmployees = [...employees]
    .sort((a, b) => new Date(b.hire_date).getTime() - new Date(a.hire_date).getTime())
    .slice(0, 4);

  // Department calculation for Bar Chart
  const departmentsList = ['الموارد البشرية', 'تقنية المعلومات', 'المالية', 'التسويق والمبيعات', 'الخدمات العامة'];
  const departmentCounts = departmentsList.map(dept => {
    const count = employees.filter(e => e.department === dept).length;
    return {
      name: dept,
      count,
      percentage: totalEmployees > 0 ? (count / totalEmployees) * 100 : 0
    };
  });

  // Monthly Hires calculation (e.g. 2025/2026 hires)
  const arabicMonths = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
  
  const monthlyHires = arabicMonths.map((monthName, idx) => {
    // Count employees hired in this month (regardless of year, or specifically recent)
    const count = employees.filter(e => {
      const date = new Date(e.hire_date);
      return !isNaN(date.getTime()) && date.getMonth() === idx;
    }).length;

    return {
      month: monthName,
      count
    };
  });

  // Filtered list for Dashboard Instant Quick Search
  const quickSearchResults = quickSearch.trim() === '' ? [] : employees.filter(e => 
    e.full_name.toLowerCase().includes(quickSearch.toLowerCase()) ||
    e.employee_code.toLowerCase().includes(quickSearch.toLowerCase()) ||
    e.phone.toLowerCase().includes(quickSearch.toLowerCase())
  ).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome & Overview Header */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 bg-gradient-to-l from-slate-950 via-slate-900 to-slate-800 rounded-2xl text-white relative overflow-hidden shadow-lg shadow-slate-950/10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-5 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs border border-indigo-500/20 mb-3">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>مؤشرات الأداء اللحظية</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">لوحة تحكم ذكاء الموارد البشرية والرواتب</h1>
            <p className="text-slate-300 text-sm mt-1.5 font-light">مراقبة دورة حياة الموظفين، التعيينات الشهرية، وتوزيع القوى العاملة مباشرة من قاعدة البيانات.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchDashboardData}
              className="p-2.5 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl text-white transition-all cursor-pointer flex items-center gap-2"
              title="تحديث الإحصاءات"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="text-xs">تحديث فوري</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Grid of Dynamic Statistics Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Employees */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm shadow-slate-100/30 flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold block">إجمالي كادر الموظفين</span>
            <span className="text-3xl font-bold text-slate-800 block">{totalEmployees}</span>
            <span className="text-[10px] text-slate-400 font-light flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
              مسجل في قاعدة البيانات
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100/50 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </motion.div>

        {/* Active Employees */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm shadow-slate-100/30 flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold block">الموظفون على رأس العمل</span>
            <span className="text-3xl font-bold text-emerald-600 block">{activeEmployees}</span>
            <span className="text-[10px] text-slate-400 font-light flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              عقود جارية ونشطة حالياً
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/50 flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
        </motion.div>

        {/* Vacation/On-Leave Employees */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm shadow-slate-100/30 flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold block">الموظفون في إجازات</span>
            <span className="text-3xl font-bold text-amber-500 block">{vacationEmployees}</span>
            <span className="text-[10px] text-slate-400 font-light">
              موافقات سنوية ومرضية مستمرة
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 border border-amber-100/50 flex items-center justify-center shrink-0">
            <CalendarDays className="w-6 h-6" />
          </div>
        </motion.div>

        {/* Inactive Employees */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm shadow-slate-100/30 flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold block">عقود معلقة أو غير نشطة</span>
            <span className="text-3xl font-bold text-slate-500 block">{inactiveEmployees}</span>
            <span className="text-[10px] text-slate-400 font-light">
              مستقيلون أو تم إنهاء خدماتهم
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 border border-slate-200/50 flex items-center justify-center shrink-0">
            <UserMinus className="w-6 h-6" />
          </div>
        </motion.div>
      </div>

      {/* Quick Search Widget */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm shadow-slate-100/20 relative">
        <label className="block text-xs font-bold text-slate-700 mb-2">البحث السريع والفوري في الملفات الذاتية</label>
        <div className="relative">
          <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={quickSearch}
            onChange={(e) => setQuickSearch(e.target.value)}
            placeholder="اكتب كود الموظف، الاسم الكامل، أو رقم الهاتف للوصول السريع لملفه..."
            className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:bg-white rounded-xl text-sm text-slate-800 transition-all outline-none"
          />
        </div>

        {/* Quick Search Overlay Dropdown */}
        <AnimatePresence>
          {quickSearch.trim() !== '' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl z-20 max-h-60 overflow-y-auto p-2"
            >
              {quickSearchResults.length === 0 ? (
                <div className="p-4 text-center text-slate-400 text-xs">
                  لا توجد نتائج مطابقة لـ "{quickSearch}"
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {quickSearchResults.map(emp => (
                    <button
                      key={emp.id}
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setQuickSearch('');
                      }}
                      className="w-full p-3 hover:bg-slate-50 flex items-center justify-between text-right transition-colors cursor-pointer rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 font-bold text-indigo-600 flex items-center justify-center text-xs">
                          {emp.full_name[0]}
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-slate-800">{emp.full_name}</h4>
                          <span className="text-[10px] text-slate-400 font-mono">{emp.employee_code} - {emp.department}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-md font-mono text-slate-500">{emp.phone}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Charts & Visualizations Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Department Visual Breakdown Bar Chart */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm shadow-slate-100/10">
          <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-800 text-sm">توزيع كادر الموظفين حسب الإدارات</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-light">تفصيلي بالأقسام</span>
          </div>

          <div className="space-y-4 pt-2">
            {departmentCounts.map((dept, index) => (
              <div key={index} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{dept.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-light">{Math.round(dept.percentage)}%</span>
                    <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{dept.count} موظف</span>
                  </div>
                </div>
                {/* Simulated Custom Bar Chart */}
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dept.percentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-indigo-600 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Recruitments / Hires Timeline Chart */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm shadow-slate-100/10">
          <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-800 text-sm">معدل التعيينات السنوية والجديدة</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-light">تاريخ الإضافة السنوي</span>
          </div>

          {/* Custom Visual Interactive Area graph representation with flex columns */}
          <div className="pt-4 flex items-end justify-between h-48 gap-1.5">
            {monthlyHires.map((item, index) => {
              // Calculate height multiplier based on max count
              const maxVal = Math.max(...monthlyHires.map(m => m.count), 1);
              const barHeightPercentage = (item.count / maxVal) * 85; // cap at 85% for layout
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  {/* Tooltip on hover */}
                  <div className="relative w-full flex justify-center">
                    <span className="absolute bottom-1 bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      {item.count} موظف
                    </span>
                  </div>

                  {/* Vertical bar */}
                  <div className="w-full bg-slate-50 border border-slate-100/40 rounded-t-md hover:bg-indigo-100 transition-all flex items-end justify-center h-full relative overflow-hidden">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${barHeightPercentage}%` }}
                      transition={{ duration: 1, ease: 'easeOut', delay: index * 0.02 }}
                      className={`w-full rounded-t-xs transition-colors group-hover:bg-indigo-600
                        ${item.count > 0 ? 'bg-indigo-500/80' : 'bg-slate-200/40'}`}
                    />
                  </div>

                  {/* Month Label */}
                  <span className="text-[9px] text-slate-400 font-light truncate w-full text-center group-hover:text-indigo-600 transition-colors">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Grid of Recent Employees & Audit logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Added Employees List */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm shadow-slate-100/10">
          <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-800 text-sm">آخر الموظفين الذين تم تعيينهم</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-light">أحدث الإضافات</span>
          </div>

          <div className="divide-y divide-slate-100">
            {latestEmployees.map((emp) => (
              <div key={emp.id} className="py-3 flex items-center justify-between hover:bg-slate-50/40 px-2 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100/50 flex items-center justify-center font-bold text-indigo-600 text-xs">
                    {emp.full_name ? emp.full_name[0] : 'M'}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-800">{emp.full_name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                      {emp.employee_code} • {emp.department}
                    </span>
                  </div>
                </div>

                <div className="text-left">
                  <span className="text-[10px] text-slate-500 block font-mono font-light">{emp.hire_date}</span>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold mt-1
                    ${emp.status === 'نشط' ? 'bg-emerald-50 text-emerald-600' : ''}
                    ${emp.status === 'إجازة' ? 'bg-amber-50 text-amber-600' : ''}
                    ${emp.status === 'غير نشط' ? 'bg-slate-50 text-slate-400' : ''}
                  `}>
                    {emp.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Logs / Activity History panel */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm shadow-slate-100/10">
          <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-800 text-sm">آخر العمليات والتغييرات بالنظام</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-light">سجل تدقيق العمليات</span>
          </div>

          <div className="space-y-4 pt-2">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-3 items-start text-xs text-slate-600 hover:bg-slate-50/50 p-2 rounded-lg transition-all">
                <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0
                  ${log.type === 'add' ? 'bg-emerald-500' : ''}
                  ${log.type === 'edit' ? 'bg-indigo-500' : ''}
                  ${log.type === 'status' ? 'bg-amber-500' : ''}
                  ${log.type === 'delete' ? 'bg-rose-500' : ''}
                `} />
                <div className="flex-1 space-y-0.5">
                  <p className="font-medium text-slate-700">{log.action}</p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-light">
                    <span>بواسطة: {log.user}</span>
                    <span>•</span>
                    <span className="font-mono">{log.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Profile Detail Pop-Up Modal for Search Results */}
      <AnimatePresence>
        {selectedEmployee && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEmployee(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white border border-slate-100 rounded-2xl shadow-2xl p-6 z-10"
            >
              {/* Profile card Header */}
              <div className="text-center pb-4 border-b border-slate-50 mb-4">
                <div className="w-16 h-16 rounded-full bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-xl mx-auto mb-3">
                  {selectedEmployee.full_name[0]}
                </div>
                <h3 className="text-md font-bold text-slate-800">{selectedEmployee.full_name}</h3>
                <span className="text-xs bg-slate-50 text-slate-500 px-2.5 py-0.5 rounded-full font-mono font-medium border border-slate-100 mt-1 inline-block">
                  {selectedEmployee.employee_code}
                </span>
              </div>

              {/* Grid with Employee Details */}
              <div className="space-y-3.5 text-xs text-slate-700">
                <div className="flex items-center justify-between py-1 border-b border-slate-50/40">
                  <span className="text-slate-400 font-light">القسم:</span>
                  <span className="font-semibold text-slate-800">{selectedEmployee.department}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-50/40">
                  <span className="text-slate-400 font-light">المسمى الوظيفي:</span>
                  <span className="font-semibold text-slate-800">{selectedEmployee.job_title}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-50/40">
                  <span className="text-slate-400 font-light">تاريخ التعيين:</span>
                  <span className="font-mono font-semibold text-slate-800">{selectedEmployee.hire_date}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-50/40">
                  <span className="text-slate-400 font-light">رقم الهوية / الإقامة:</span>
                  <span className="font-mono font-semibold text-slate-800">{selectedEmployee.national_id}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-50/40">
                  <span className="text-slate-400 font-light">الراتب الأساسي:</span>
                  <span className="font-mono font-bold text-indigo-600">{Number(selectedEmployee.salary).toLocaleString('ar-EG')} ر.س</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-50/40">
                  <span className="text-slate-400 font-light">رقم الهاتف:</span>
                  <span className="font-mono font-semibold text-slate-800" dir="ltr">{selectedEmployee.phone}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-50/40">
                  <span className="text-slate-400 font-light">البريد الإلكتروني:</span>
                  <span className="font-semibold text-slate-800">{selectedEmployee.email}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400 font-light">الحالة الوظيفية:</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-semibold text-[10px]
                    ${selectedEmployee.status === 'نشط' ? 'bg-emerald-50 text-emerald-600' : ''}
                    ${selectedEmployee.status === 'إجازة' ? 'bg-amber-50 text-amber-600' : ''}
                    ${selectedEmployee.status === 'غير نشط' ? 'bg-slate-50 text-slate-500' : ''}
                  `}>
                    {selectedEmployee.status}
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <div className="mt-5 pt-3 border-t border-slate-50 flex">
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-100 transition-colors cursor-pointer"
                >
                  إغلاق نافذة التفاصيل
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
