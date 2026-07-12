import React, { useState, useEffect } from 'react';
import { UserSession } from '../types';
import { 
  UserCog, UserPlus, Shield, User, Trash2, Mail, 
  Lock, CheckCircle2, XCircle, Search, Filter, KeyRound, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'hr';
  status: 'نشط' | 'غير نشط';
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('الكل');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'hr' as 'admin' | 'hr',
    status: 'نشط' as 'نشط' | 'غير نشط',
  });

  // Toast feedback state
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const loadUsers = () => {
    const localUsers = localStorage.getItem('hr_system_users_list');
    if (localUsers) {
      try {
        setUsers(JSON.parse(localUsers));
      } catch (e) {
        setUsers(getInitialSystemUsers());
      }
    } else {
      const initial = getInitialSystemUsers();
      setUsers(initial);
      localStorage.setItem('hr_system_users_list', JSON.stringify(initial));
    }
  };

  const saveUsers = (updatedList: SystemUser[]) => {
    setUsers(updatedList);
    localStorage.setItem('hr_system_users_list', JSON.stringify(updatedList));
  };

  const getInitialSystemUsers = (): SystemUser[] => {
    return [
      {
        id: '1',
        name: 'مسؤول النظام',
        email: 'admin@hr.com',
        role: 'admin',
        status: 'نشط',
        created_at: '2026-01-10',
      },
      {
        id: '2',
        name: 'HR 1',
        email: 'hr1@hr.com',
        role: 'hr',
        status: 'نشط',
        created_at: '2026-03-15',
      },
      {
        id: '3',
        name: 'HR 2',
        email: 'hr2@hr.com',
        role: 'hr',
        status: 'نشط',
        created_at: '2026-05-20',
      }
    ];
  };

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'hr',
      status: 'نشط',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setToast({ type: 'error', message: 'يرجى ملء جميع الحقول المطلوبة' });
      return;
    }

    // Check duplicate email
    if (users.some(u => u.email.toLowerCase() === formData.email.toLowerCase())) {
      setToast({ type: 'error', message: 'البريد الإلكتروني هذا مستخدم بالفعل في النظام' });
      return;
    }

    const newUser: SystemUser = {
      id: Math.random().toString(36).substring(2, 11),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: formData.status,
      created_at: new Date().toISOString().split('T')[0],
    };

    const updated = [...users, newUser];
    saveUsers(updated);
    setIsModalOpen(false);
    setToast({ type: 'success', message: `تمت إضافة المستخدم (${formData.name}) بنجاح كـ ${formData.role === 'admin' ? 'مدير نظام' : 'موظف HR'}` });
  };

  const handleDeleteConfirm = () => {
    if (!deleteCandidateId) return;

    // Prevent deleting the main admin
    const target = users.find(u => u.id === deleteCandidateId);
    if (target?.email === 'admin@hr.com') {
      setToast({ type: 'error', message: 'لا يمكن حذف الحساب الرئيسي لمسؤول النظام' });
      setDeleteCandidateId(null);
      return;
    }

    const updated = users.filter(u => u.id !== deleteCandidateId);
    saveUsers(updated);
    setToast({ type: 'success', message: 'تم حذف مستخدم النظام بنجاح' });
    setDeleteCandidateId(null);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'الكل' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

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
              <p className="text-xs font-light text-slate-400">تنبيه الصلاحيات</p>
              <p className="text-xs font-bold text-slate-700 mt-0.5">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">إدارة مستخدمي النظام والصلاحيات</h1>
          <p className="text-slate-400 text-sm mt-0.5 font-light">إضافة وتعديل حسابات المدراء وأخصائيي الموارد البشرية المتحكمين بالنظام</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-100 cursor-pointer"
        >
          <UserPlus className="w-4.5 h-4.5" />
          <span>إضافة مستخدم جديد</span>
        </button>
      </div>

      {/* Searching / Filtering row */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm shadow-slate-100/20 flex flex-col md:flex-row items-center gap-3">
        <div className="relative w-full md:flex-1">
          <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="البحث باسم المستخدم أو البريد الإلكتروني..."
            className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:bg-white rounded-xl text-sm text-slate-800 transition-all outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-500 w-full md:w-auto justify-between md:justify-start">
          <span>دور الصلاحية:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-transparent border-none text-xs text-slate-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="الكل">الكل</option>
            <option value="admin">مسؤول النظام (Admin)</option>
            <option value="hr">HR</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm shadow-slate-100/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium text-xs select-none">
              <tr>
                <th className="py-4 px-6">المستخدم</th>
                <th className="py-4 px-6">البريد الإلكتروني</th>
                <th className="py-4 px-6">الدور الوظيفي والصلاحيات</th>
                <th className="py-4 px-6">حالة الحساب</th>
                <th className="py-4 px-6">تاريخ الإنشاء</th>
                <th className="py-4 px-6 text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0
                        ${user.role === 'admin' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                        {user.name ? user.name[0] : 'U'}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">{user.name}</h4>
                        <span className="text-[10px] text-slate-400 font-light">معرف: {user.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-500 font-mono" dir="ltr">
                    {user.email}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                      ${user.role === 'admin' 
                        ? 'bg-indigo-50 text-indigo-600 border border-indigo-100/30' 
                        : 'bg-emerald-50 text-emerald-600 border border-emerald-100/30'}`}>
                      {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      <span>{user.role === 'admin' ? 'مسؤول النظام (Admin)' : 'أخصائي HR'}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 text-xs">
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'نشط' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      <span>{user.status}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-500 font-mono">
                    {user.created_at}
                  </td>
                  <td className="py-4 px-6 text-left">
                    {user.email !== 'admin@hr.com' ? (
                      <button
                        onClick={() => setDeleteCandidateId(user.id)}
                        className="p-2 hover:bg-rose-50 hover:text-rose-600 rounded-lg text-slate-400 transition-colors cursor-pointer"
                        title="حذف المستخدم"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="text-xs text-slate-300 font-light pl-2 select-none">أساسي</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white border border-slate-100 rounded-2xl shadow-xl p-6 z-10 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mx-auto mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              
              <h3 className="text-md font-bold text-slate-800">إلغاء صلاحية الوصول للمستخدم</h3>
              <p className="text-slate-500 text-xs mt-2 font-light leading-relaxed">
                هل أنت متأكد من رغبتك في حذف هذا المستخدم وسحب صلاحية الدخول للنظام نهائياً؟
              </p>

              <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-50 mt-6">
                <button
                  onClick={() => setDeleteCandidateId(null)}
                  className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-100 transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition-all shadow-lg cursor-pointer"
                >
                  نعم، حذف المستخدم
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add User Modal */}
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
              className="relative w-full max-w-md bg-white border border-slate-100 rounded-2xl shadow-xl p-6 z-10"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <h3 className="text-md font-bold text-slate-800">إضافة مستخدم نظام جديد</h3>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">اسم المستخدم الثنائي</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="مثال: صالح محمد"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">البريد الإلكتروني</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 pointer-events-none">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      required
                      dir="ltr"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="user@hr.com"
                      className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">كلمة المرور المؤقتة</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 pointer-events-none">
                      <KeyRound className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">دور الصلاحية</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'hr' })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none cursor-pointer"
                    >
                      <option value="hr">أخصائي HR</option>
                      <option value="admin">مسؤول النظام (Admin)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">الحالة المبدئية</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'نشط' | 'غير نشط' })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none cursor-pointer"
                    >
                      <option value="نشط">نشط</option>
                      <option value="غير نشط">غير نشط</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold border border-slate-100 transition-colors cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all shadow-lg shadow-indigo-100 cursor-pointer"
                  >
                    إنشاء حساب
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
