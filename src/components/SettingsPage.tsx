import React, { useState, useEffect } from 'react';
import { 
  Settings, Building2, Wallet, Clock, Mail, ShieldAlert, 
  CheckCircle2, XCircle, Save, Percent, Landmark, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State
  const [companyName, setCompanyName] = useState('مؤسسة الرياض للحلول التقنية المتطورة');
  const [taxNumber, setTaxNumber] = useState('310294829300003');
  const [currency, setCurrency] = useState('SAR');
  const [workingHours, setWorkingHours] = useState(8);
  const [weekendDay, setWeekendDay] = useState('الجمعة والسبت');
  const [gosiPercentage, setGosiPercentage] = useState(9.75); // GOSI deduction rate
  const [salaryTaxRate, setSalaryTaxRate] = useState(0); // Personal Income Tax
  const [smtpServer, setSmtpServer] = useState('smtp.company.com');
  const [notifyOnLeave, setNotifyOnLeave] = useState(true);

  useEffect(() => {
    // Load config from localStorage if present
    const saved = localStorage.getItem('hr_system_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCompanyName(parsed.companyName ?? companyName);
        setTaxNumber(parsed.taxNumber ?? taxNumber);
        setCurrency(parsed.currency ?? currency);
        setWorkingHours(parsed.workingHours ?? workingHours);
        setWeekendDay(parsed.weekendDay ?? weekendDay);
        setGosiPercentage(parsed.gosiPercentage ?? gosiPercentage);
        setSalaryTaxRate(parsed.salaryTaxRate ?? salaryTaxRate);
        setSmtpServer(parsed.smtpServer ?? smtpServer);
        setNotifyOnLeave(parsed.notifyOnLeave ?? notifyOnLeave);
      } catch (e) {
        // use defaults
      }
    }
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const config = {
      companyName,
      taxNumber,
      currency,
      workingHours,
      weekendDay,
      gosiPercentage,
      salaryTaxRate,
      smtpServer,
      notifyOnLeave,
    };

    localStorage.setItem('hr_system_settings', JSON.stringify(config));
    
    setTimeout(() => {
      setLoading(false);
      setToast({ type: 'success', message: 'تم حفظ جميع التعديلات والإعدادات بنجاح في النظام' });
    }, 600);
  };

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
              <p className="text-xs font-light text-slate-400">الإعدادات العامة</p>
              <p className="text-xs font-bold text-slate-700 mt-0.5">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">الإعدادات العامة للنظام</h1>
        <p className="text-slate-400 text-sm mt-0.5 font-light">تخصيص هوية المنشأة، معدلات الخصم، ساعات العمل، ومزامنة البريد التنبيهي</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Section 1: Company Profile Info */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm shadow-slate-100/10 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-3 mb-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold text-slate-800 text-sm">بيانات المنشأة والهوية</h3>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">اسم الشركة الرسمي</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">الرقم الضريبي الموحد (VAT)</label>
              <input
                type="text"
                required
                value={taxNumber}
                onChange={(e) => setTaxNumber(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">العملة الافتراضية للنظام</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none cursor-pointer"
              >
                <option value="SAR">ريال سعودي (SAR)</option>
                <option value="AED">درهم إماراتي (AED)</option>
                <option value="KWD">دينار كويتي (KWD)</option>
                <option value="USD">دولار أمريكي (USD)</option>
              </select>
            </div>
          </div>

          {/* Section 2: Financial Settings (GOSI & Taxes) */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm shadow-slate-100/10 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-3 mb-2">
              <Wallet className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold text-slate-800 text-sm">الهيكل المالي والخصومات الأساسية</h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">نسبة التأمينات الاجتماعية - حصة الموظف (%)</label>
              <div className="relative">
                <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 pointer-events-none">
                  <Percent className="w-4 h-4" />
                </span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={gosiPercentage}
                  onChange={(e) => setGosiPercentage(Number(e.target.value))}
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">نسبة ضريبة الدخل على الرواتب (%)</label>
              <div className="relative">
                <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 pointer-events-none">
                  <Percent className="w-4 h-4" />
                </span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={salaryTaxRate}
                  onChange={(e) => setSalaryTaxRate(Number(e.target.value))}
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm outline-none transition-all"
                />
              </div>
              <span className="text-[10px] text-slate-400 font-light mt-1 block">تُطبق الضريبة تلقائياً على إجمالي رواتب الموظفين (0 للمملكة العربية السعودية)</span>
            </div>
          </div>

          {/* Section 3: Time & Shifts */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm shadow-slate-100/10 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-3 mb-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold text-slate-800 text-sm">سياسات الدوام وأيام الغياب</h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">عدد ساعات العمل القياسية يومياً</label>
              <input
                type="number"
                min="4"
                max="12"
                required
                value={workingHours}
                onChange={(e) => setWorkingHours(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">الإجازة الأسبوعية المعتمدة</label>
              <select
                value={weekendDay}
                onChange={(e) => setWeekendDay(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none cursor-pointer"
              >
                <option value="الجمعة والسبت">الجمعة والسبت</option>
                <option value="السبت والأحد">السبت والأحد</option>
                <option value="الجمعة فقط">الجمعة فقط</option>
                <option value="الأحد فقط">الأحد فقط</option>
              </select>
            </div>
          </div>

          {/* Section 4: SMTP Notification sync */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm shadow-slate-100/10 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-3 mb-2">
              <Mail className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold text-slate-800 text-sm">إشعارات البريد التنبيهي</h3>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">خادم البريد SMTP الافتراضي</label>
              <input
                type="text"
                required
                value={smtpServer}
                onChange={(e) => setSmtpServer(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-sm outline-none transition-all"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <h4 className="text-xs font-semibold text-slate-700">تنبيهات طلب الإجازات والرواتب</h4>
                <p className="text-[10px] text-slate-400 font-light mt-0.5">إرسال تنبيه آلي للبريد عند تقديم الموظف لإجازة سنوية</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyOnLeave}
                  onChange={(e) => setNotifyOnLeave(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>

        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 p-4 bg-white border border-slate-100 rounded-2xl">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-100 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'جاري الحفظ والترميز...' : 'حفظ جميع التعديلات'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
