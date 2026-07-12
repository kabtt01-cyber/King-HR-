import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Employee } from '../types';
import { 
  Users, UserPlus, Search, Filter, AlertCircle, Trash2, Edit3, 
  CheckCircle, Plus, X, RefreshCw, Copy, Check, Database, Landmark, 
  Phone, Mail, Calendar, ShieldAlert, ArrowUpDown, ArrowUp, ArrowDown,
  ChevronLeft, ChevronRight, CheckCircle2, XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('الكل');
  const [statusFilter, setStatusFilter] = useState('الكل');

  // Sorting State
  const [sortBy, setSortBy] = useState<keyof Employee>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals & Action State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);

  // Toast State for Success/Error feedback
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    employee_code: '',
    full_name: '',
    national_id: '',
    phone: '',
    email: '',
    department: 'الموارد البشرية',
    job_title: '',
    hire_date: new Date().toISOString().split('T')[0],
    salary: 6000,
    status: 'نشط',
  });

  // DB Mode Flag - tracks if we are reading from actual Supabase or localStorage fallback
  const [usingLocalStorage, setUsingLocalStorage] = useState(!isSupabaseConfigured);

  // SQL Script helper for the user
  const sqlScript = `-- 1. أنشئ جدول الموظفين في Supabase SQL Editor
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_code VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    national_id VARCHAR(50) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    job_title VARCHAR(100) NOT NULL,
    hire_date DATE NOT NULL DEFAULT CURRENT_DATE,
    salary NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) NOT NULL DEFAULT 'نشط',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. تفعيل الحماية RLS
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- 3. تفعيل سياسات الوصول العام للقراءة والكتابة للتجربة الفورية
CREATE POLICY "Allow public read access" ON public.employees FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.employees FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.employees FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete access" ON public.employees FOR DELETE USING (true);`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
  };

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);

    if (isSupabaseConfigured) {
      try {
        const { data, error: sbError } = await supabase
          .from('employees')
          .select('*')
          .order('created_at', { ascending: false });

        if (sbError) {
          throw sbError;
        }

        if (data) {
          setEmployees(data as Employee[]);
          setUsingLocalStorage(false);
        }
      } catch (err: any) {
        console.warn('Supabase employees query failed:', err);
        // Fallback state in UI but not writing to Local Storage
        setEmployees(getInitialDemoEmployees());
        setUsingLocalStorage(true);
      } finally {
        setLoading(false);
      }
    } else {
      // Memory-only fallback state if not configured
      setEmployees(getInitialDemoEmployees());
      setUsingLocalStorage(true);
      setLoading(false);
    }
  };

  const addActivityLog = (action: string, type: 'add' | 'edit' | 'delete' | 'status') => {
    const sessionUser = localStorage.getItem('hr_system_session');
    let userName = 'أخصائي HR';
    if (sessionUser) {
      try {
        userName = JSON.parse(sessionUser).name || userName;
      } catch (e) {}
    }
    const currentLogs = localStorage.getItem('hr_system_activity_logs');
    let logsList = [];
    if (currentLogs) {
      try {
        logsList = JSON.parse(currentLogs);
      } catch (e) {}
    }
    const newLog = {
      id: 'log-' + Math.random().toString(36).substring(2, 11),
      action,
      user: userName,
      time: 'الآن',
      type
    };
    localStorage.setItem('hr_system_activity_logs', JSON.stringify([newLog, ...logsList].slice(0, 10)));
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
        hire_date: '2023-04-12',
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
        hire_date: '2024-01-08',
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
        hire_date: '2022-09-01',
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
        hire_date: '2024-03-10',
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
        hire_date: '2023-08-15',
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

  // Set sorting field & toggle order
  const handleSort = (field: keyof Employee) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setCurrentPage(1); // Reset to first page on sort change
  };

  // Helper render to show sorting icon indicator
  const renderSortIcon = (field: keyof Employee) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-50 group-hover:opacity-100 transition-opacity" />;
    }
    return sortOrder === 'asc' 
      ? <ArrowUp className="w-3.5 h-3.5 text-indigo-600 font-bold" />
      : <ArrowDown className="w-3.5 h-3.5 text-indigo-600 font-bold" />;
  };

  const openAddModal = () => {
    setEditingEmployee(null);
    setFormData({
      employee_code: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      full_name: '',
      national_id: '',
      phone: '',
      email: '',
      department: 'الموارد البشرية',
      job_title: '',
      hire_date: new Date().toISOString().split('T')[0],
      salary: 6000,
      status: 'نشط',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormData({
      employee_code: emp.employee_code,
      full_name: emp.full_name,
      national_id: emp.national_id,
      phone: emp.phone,
      email: emp.email,
      department: emp.department,
      job_title: emp.job_title,
      hire_date: emp.hire_date,
      salary: Number(emp.salary),
      status: emp.status,
    });
    setIsModalOpen(true);
  };

  // Create or Update Action
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSupabaseConfigured) {
      try {
        if (editingEmployee) {
          // Update record in Supabase
          const { error: sbError } = await supabase
            .from('employees')
            .update({
              employee_code: formData.employee_code,
              full_name: formData.full_name,
              national_id: formData.national_id,
              phone: formData.phone,
              email: formData.email,
              department: formData.department,
              job_title: formData.job_title,
              hire_date: formData.hire_date,
              salary: formData.salary,
              status: formData.status,
            })
            .eq('id', editingEmployee.id);

          if (sbError) throw sbError;
          addActivityLog(`تعديل بيانات الموظف ${formData.full_name} (${formData.employee_code})`, 'edit');
          showToast('success', `تم تعديل بيانات الموظف (${formData.full_name}) بنجاح`);
        } else {
          // Insert record into Supabase
          const { error: sbError } = await supabase
            .from('employees')
            .insert([formData]);

          if (sbError) throw sbError;
          addActivityLog(`إضافة الموظف الجديد ${formData.full_name} (${formData.employee_code})`, 'add');
          showToast('success', `تمت إضافة الموظف الجديد (${formData.full_name}) بنجاح`);
        }
        await fetchEmployees();
        setIsModalOpen(false);
      } catch (err: any) {
        showToast('error', err.message || 'فشلت عملية الحفظ في قاعدة البيانات');
      } finally {
        setLoading(false);
      }
    } else {
      showToast('error', 'يرجى تكوين قاعدة بيانات Supabase أولاً للقيام بهذه العملية');
      setLoading(false);
    }
  };

  // Delete Action triggered upon confirmation modal approval
  const handleDeleteConfirm = async () => {
    if (!deleteCandidateId) return;
    setLoading(true);

    const targetEmployeeName = employees.find(emp => emp.id === deleteCandidateId)?.full_name || 'الموظف';

    if (isSupabaseConfigured) {
      try {
        const { error: sbError } = await supabase
          .from('employees')
          .delete()
          .eq('id', deleteCandidateId);

        if (sbError) throw sbError;
        addActivityLog(`حذف ملف الموظف ${targetEmployeeName}`, 'delete');
        showToast('success', `تم حذف ملف الموظف (${targetEmployeeName}) بنجاح`);
        await fetchEmployees();
      } catch (err: any) {
        showToast('error', err.message || 'فشل حذف السجل من قاعدة البيانات');
      } finally {
        setLoading(false);
        setDeleteCandidateId(null);
      }
    } else {
      showToast('error', 'يرجى تكوين قاعدة بيانات Supabase أولاً للقيام بهذه العملية');
      setLoading(false);
      setDeleteCandidateId(null);
    }
  };

  // Filter & Search Logic (Search by full_name, employee_code, phone)
  const filteredEmployees = employees.filter(emp => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      emp.full_name.toLowerCase().includes(searchLower) ||
      emp.employee_code.toLowerCase().includes(searchLower) ||
      emp.phone.toLowerCase().includes(searchLower);

    const matchesDepartment = departmentFilter === 'الكل' || emp.department === departmentFilter;
    const matchesStatus = statusFilter === 'الكل' || emp.status === statusFilter;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Sort Logic
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    // Handle undefined/null gracefully
    if (valA === undefined || valA === null) valA = '';
    if (valB === undefined || valB === null) valB = '';

    // Numeric comparison for salary
    if (sortBy === 'salary') {
      return sortOrder === 'asc' 
        ? Number(valA) - Number(valB)
        : Number(valB) - Number(valA);
    }

    // String comparison (supports Arabic string comparison correctly)
    const strA = String(valA);
    const strB = String(valB);
    return sortOrder === 'asc'
      ? strA.localeCompare(strB, 'ar')
      : strB.localeCompare(strA, 'ar');
  });

  // Pagination calculations
  const totalItems = sortedEmployees.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = sortedEmployees.slice(startIndex, startIndex + itemsPerPage);

  // Handle page navigation
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const departments = ['الكل', 'الموارد البشرية', 'تقنية المعلومات', 'المالية', 'التسويق والمبيعات', 'الخدمات العامة'];

  return (
    <div className="space-y-6 relative">
      {/* Toast Alert Feedback Overlay */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl border shadow-xl bg-white min-w-[280px]"
            style={{
              borderColor: toast.type === 'success' ? '#e2fbe8' : '#fbe2e2',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)'
            }}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
            )}
            <div className="text-right">
              <p className="text-xs font-light text-slate-400">تنبيه النظام</p>
              <p className="text-xs font-bold text-slate-700 mt-0.5">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header with Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">إدارة ملفات وسجلات الموظفين</h1>
          <p className="text-slate-400 text-sm mt-0.5 font-light">إضافة موظفين، تعديل تفاصيل الراتب والمهام، والبحث المتقدم الفوري</p>
        </div>
        <button 
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-100 cursor-pointer"
        >
          <UserPlus className="w-4.5 h-4.5" />
          <span>إضافة موظف جديد</span>
        </button>
      </div>

      {!isSupabaseConfigured && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4.5 flex gap-3 text-sm leading-relaxed">
          <Database className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">تنبيه: لم يتم ربط قاعدة بيانات Supabase بشكل صحيح</p>
            <p className="mt-1 font-light text-amber-750">
              يرجى التأكد من ضبط متغيرات البيئة <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs font-mono">VITE_SUPABASE_URL</code> و <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs font-mono">VITE_SUPABASE_ANON_KEY</code> في إعدادات AI Studio ليتطابقا تماماً مع مشروع Vercel لضمان مزامنة مستخدمي النظام وموظفيه بشكل فوري وتلقائي بين البيئتين.
            </p>
          </div>
        </div>
      )}

      {/* Filters, Search & Sorting Bar */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm shadow-slate-100/20 flex flex-col md:flex-row items-center gap-3">
        {/* Search Input supporting: Name, Employee Code, Phone */}
        <div className="relative w-full md:flex-1">
          <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset to first page upon searching
            }}
            placeholder="البحث بالاسم، الكود، أو رقم الهاتف..."
            className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:bg-white rounded-xl text-sm text-slate-800 transition-all outline-none"
          />
        </div>

        {/* Filters Selectors */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>القسم:</span>
            <select
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent border-none text-xs text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-500">
            <span>الحالة:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent border-none text-xs text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="الكل">الكل</option>
              <option value="نشط">نشط</option>
              <option value="إجازة">إجازة</option>
              <option value="غير نشط">غير نشط</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Responsive Table View */}
      {paginatedEmployees.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center min-h-[300px] flex flex-col items-center justify-center shadow-xs">
          <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 mb-4">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="text-md font-bold text-slate-700">لا يوجد موظفين يطابقون خيارات البحث</h3>
          <p className="text-slate-400 text-xs mt-1.5 font-light">يرجى تجربة تعديل خيارات التصفية أو إضافة موظف جديد.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm shadow-slate-100/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium text-xs select-none">
                <tr>
                  {/* Sorting columns capability */}
                  <th onClick={() => handleSort('full_name')} className="py-4 px-6 cursor-pointer group hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-1.5 justify-start">
                      <span>الموظف</span>
                      {renderSortIcon('full_name')}
                    </div>
                  </th>
                  <th className="py-4 px-6">بيانات الاتصال والهوية</th>
                  <th onClick={() => handleSort('department')} className="py-4 px-6 cursor-pointer group hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-1.5 justify-start">
                      <span>القسم والمسمى الوظيفي</span>
                      {renderSortIcon('department')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('hire_date')} className="py-4 px-6 cursor-pointer group hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-1.5 justify-start">
                      <span>تاريخ التعيين</span>
                      {renderSortIcon('hire_date')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('salary')} className="py-4 px-6 cursor-pointer group hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-1.5 justify-start">
                      <span>الراتب الأساسي</span>
                      {renderSortIcon('salary')}
                    </div>
                  </th>
                  <th onClick={() => handleSort('status')} className="py-4 px-6 cursor-pointer group hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-1.5 justify-start">
                      <span>الحالة</span>
                      {renderSortIcon('status')}
                    </div>
                  </th>
                  <th className="py-4 px-6 text-left">إجراءات السجل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {paginatedEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Employee avatar & Code & Name */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200/60 flex items-center justify-center font-bold text-indigo-600 shrink-0">
                          {emp.full_name ? emp.full_name[0] : 'M'}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800">{emp.full_name}</h4>
                          <span className="inline-block mt-0.5 px-2 py-0.5 bg-slate-100 text-slate-500 font-mono text-[10px] rounded-md font-medium border border-slate-200/20">
                            {emp.employee_code}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* National ID, Phone, Email */}
                    <td className="py-4 px-6 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Landmark className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>الهوية: {emp.national_id}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500" dir="ltr">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{emp.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[150px]">{emp.email}</span>
                      </div>
                    </td>

                    {/* Department & Job title */}
                    <td className="py-4 px-6 text-xs">
                      <span className="inline-block px-2.5 py-1 bg-indigo-50/50 text-indigo-600 border border-indigo-100/30 rounded-lg font-medium mb-1">
                        {emp.department}
                      </span>
                      <p className="text-slate-500 font-medium">{emp.job_title}</p>
                    </td>

                    {/* Hire Date */}
                    <td className="py-4 px-6 text-xs text-slate-500 font-mono">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{emp.hire_date}</span>
                      </div>
                    </td>

                    {/* Salary */}
                    <td className="py-4 px-6 text-sm font-semibold text-slate-800 font-mono">
                      {Number(emp.salary).toLocaleString('ar-EG')} ر.س
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                        ${emp.status === 'نشط' ? 'bg-emerald-50 text-emerald-600' : ''}
                        ${emp.status === 'إجازة' ? 'bg-amber-50 text-amber-600' : ''}
                        ${emp.status === 'غير نشط' ? 'bg-slate-50 text-slate-500 border border-slate-100' : ''}
                      `}>
                        <span className={`w-1.5 h-1.5 rounded-full 
                          ${emp.status === 'نشط' ? 'bg-emerald-500' : ''}
                          ${emp.status === 'إجازة' ? 'bg-amber-500' : ''}
                          ${emp.status === 'غير نشط' ? 'bg-slate-400' : ''}
                        `} />
                        {emp.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-left">
                      <div className="inline-flex items-center gap-1.5" dir="ltr">
                        <button
                          onClick={() => openEditModal(emp)}
                          className="p-2 hover:bg-slate-50 hover:text-indigo-600 border border-transparent hover:border-slate-100 rounded-lg text-slate-400 transition-colors cursor-pointer"
                          title="تعديل الموظف"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteCandidateId(emp.id)}
                          className="p-2 hover:bg-rose-50 hover:text-rose-600 border border-transparent hover:border-rose-100 rounded-lg text-slate-400 transition-colors cursor-pointer"
                          title="حذف الموظف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer Controls */}
          {totalPages > 1 && (
            <div className="bg-slate-50 border-t border-slate-100 py-3.5 px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-500 font-light">
                عرض <strong className="text-slate-700">{startIndex + 1}</strong> إلى <strong className="text-slate-700">{Math.min(startIndex + itemsPerPage, totalItems)}</strong> من أصل <strong className="text-slate-700">{totalItems}</strong> موظف
              </span>
              
              <div className="flex items-center gap-1.5" dir="ltr">
                {/* Previous Page Button */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`px-3 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer
                      ${currentPage === pageNum 
                        ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/10' 
                        : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                  >
                    {pageNum}
                  </button>
                ))}

                {/* Next Page Button */}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Elegant Custom Delete Confirmation Dialog Modal */}
      <AnimatePresence>
        {deleteCandidateId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteCandidateId(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-white border border-slate-100 rounded-2xl shadow-xl p-6 z-10 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mx-auto mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              
              <h3 className="text-md font-bold text-slate-800">تأكيد حذف ملف الموظف</h3>
              <p className="text-slate-500 text-xs mt-2 font-light leading-relaxed">
                هل أنت متأكد من رغبتك في حذف هذا الموظف من النظام بصورة نهائية؟ لا يمكن التراجع عن هذا الإجراء بعد تنفيذه.
              </p>

              <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-50 mt-6">
                <button
                  onClick={() => setDeleteCandidateId(null)}
                  className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-100 transition-colors cursor-pointer"
                >
                  إلغاء الأمر
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={loading}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-all shadow-lg shadow-rose-100 cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'جاري الحذف...' : 'نعم، حذف الموظف'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add / Edit Form Modal Dialog */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-white border border-slate-100 rounded-2xl shadow-xl p-6 md:p-8 z-10 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <h3 className="text-lg font-bold text-slate-800">
                  {editingEmployee ? 'تعديل بيانات الموظف' : 'إضافة سجل موظف جديد'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 hover:bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Employee Code */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">كود الموظف</label>
                    <input
                      type="text"
                      required
                      value={formData.employee_code}
                      onChange={(e) => setFormData({ ...formData, employee_code: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm outline-none transition-all"
                    />
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">الاسم الكامل للموظف</label>
                    <input
                      type="text"
                      required
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="مثال: صالح أحمد الغامدي"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm outline-none transition-all"
                    />
                  </div>

                  {/* National ID */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">رقم الهوية الوطنية / الإقامة</label>
                    <input
                      type="text"
                      required
                      value={formData.national_id}
                      onChange={(e) => setFormData({ ...formData, national_id: e.target.value })}
                      placeholder="10XXXXXXXX"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm outline-none transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">رقم الجوال</label>
                    <input
                      type="text"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+9665XXXXXXXX"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm outline-none transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">البريد الإلكتروني</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="employee@company.com"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm outline-none transition-all"
                    />
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">القسم</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm outline-none transition-all cursor-pointer"
                    >
                      <option value="الموارد البشرية">الموارد البشرية</option>
                      <option value="تقنية المعلومات">تقنية المعلومات</option>
                      <option value="المالية">المالية</option>
                      <option value="التسويق والمبيعات">التسويق والمبيعات</option>
                      <option value="الخدمات العامة">الخدمات العامة</option>
                    </select>
                  </div>

                  {/* Job Title */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">المسمى الوظيفي</label>
                    <input
                      type="text"
                      required
                      value={formData.job_title}
                      onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                      placeholder="مثال: أخصائي موارد بشرية"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm outline-none transition-all"
                    />
                  </div>

                  {/* Salary */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">الراتب الأساسي (ر.س)</label>
                    <input
                      type="number"
                      required
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm outline-none transition-all"
                    />
                  </div>

                  {/* Hire Date */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">تاريخ التعيين</label>
                    <input
                      type="date"
                      required
                      value={formData.hire_date}
                      onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm outline-none transition-all"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">حالة الموظف</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm outline-none transition-all cursor-pointer"
                    >
                      <option value="نشط">نشط</option>
                      <option value="إجازة">إجازة</option>
                      <option value="غير نشط">غير نشط</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-medium border border-slate-100 transition-colors cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-100 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'جاري الحفظ...' : (editingEmployee ? 'حفظ التعديلات' : 'إضافة الموظف')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
