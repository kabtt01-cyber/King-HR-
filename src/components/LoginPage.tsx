import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserSession } from '../types';
import { KeyRound, Mail, UserCheck, AlertCircle, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginPageProps {
  onLoginSuccess: (session: UserSession) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError('الرجاء إدخال البريد الإلكتروني أو اسم المستخدم وكلمة المرور');
      setLoading(false);
      return;
    }

    // Resolve username to corresponding email if needed
    let loginEmail = email.trim();
    const resolvedLower = loginEmail.toLowerCase();
    if (resolvedLower === 'admin') {
      loginEmail = 'admin@hr.com';
    } else if (resolvedLower === 'hr1') {
      loginEmail = 'hr1@hr.com';
    } else if (resolvedLower === 'hr2') {
      loginEmail = 'hr2@hr.com';
    }

    try {
      let loggedIn = false;
      let sessionData: any = null;

      if (isSupabaseConfigured) {
        try {
          let { data, error: sbError } = await supabase.auth.signInWithPassword({
            email: loginEmail,
            password,
          });

          // Auto-provisioning/sign-up for our 3 demo accounts on first login attempt if they don't exist in Supabase yet
          if (sbError && (loginEmail === 'admin@hr.com' || loginEmail === 'hr1@hr.com' || loginEmail === 'hr2@hr.com')) {
            const isCorrectPassword = 
              (loginEmail === 'admin@hr.com' && password === 'Admin@123') ||
              (loginEmail === 'hr1@hr.com' && password === 'Hr@12345') ||
              (loginEmail === 'hr2@hr.com' && password === 'Hr@54321');

            if (isCorrectPassword) {
              const role = loginEmail === 'admin@hr.com' ? 'admin' : 'hr';
              const name = loginEmail === 'admin@hr.com' ? 'مسؤول النظام' : (loginEmail === 'hr1@hr.com' ? 'HR 1' : 'HR 2');
              
              const { error: signUpError } = await supabase.auth.signUp({
                email: loginEmail,
                password,
                options: {
                  data: {
                    full_name: name,
                    role: role,
                  }
                }
              });

              if (!signUpError) {
                const retry = await supabase.auth.signInWithPassword({
                  email: loginEmail,
                  password,
                });
                data = retry.data;
                sbError = retry.error;
              }
            }
          }

          if (!sbError && data?.user) {
            const assignedRole: 'admin' | 'hr' = (data.user.email?.toLowerCase().includes('hr') || data.user.user_metadata?.role === 'hr') ? 'hr' : 'admin';
            sessionData = {
              email: data.user.email || loginEmail,
              isDemo: false,
              name: data.user.user_metadata?.full_name || (assignedRole === 'admin' ? 'مسؤول النظام' : 'أخصائي HR'),
              role: assignedRole,
            };
            loggedIn = true;
          }
        } catch (e) {
          console.warn('Supabase auth attempt failed, trying local fallback...', e);
        }
      }

      // Local fallback checking hr_system_users_list
      if (!loggedIn) {
        const localUsersStr = localStorage.getItem('hr_system_users_list');
        let localUsers: any[] = [];
        if (localUsersStr) {
          try {
            localUsers = JSON.parse(localUsersStr);
          } catch (e) {}
        }

        if (localUsers.length === 0) {
          localUsers = [
            {
              id: '1',
              name: 'مسؤول النظام',
              email: 'admin@hr.com',
              role: 'admin',
              status: 'نشط',
              created_at: '2026-01-10',
              password: 'Admin@123',
              username: 'admin'
            },
            {
              id: '2',
              name: 'HR 1',
              email: 'hr1@hr.com',
              role: 'hr',
              status: 'نشط',
              created_at: '2026-03-15',
              password: 'Hr@12345',
              username: 'hr1'
            },
            {
              id: '3',
              name: 'HR 2',
              email: 'hr2@hr.com',
              role: 'hr',
              status: 'نشط',
              created_at: '2026-05-20',
              password: 'Hr@54321',
              username: 'hr2'
            }
          ];
          localStorage.setItem('hr_system_users_list', JSON.stringify(localUsers));
        }

        const inputLower = email.trim().toLowerCase();
        const matchedUser = localUsers.find(u => 
          (u.email?.toLowerCase() === inputLower || 
           u.username?.toLowerCase() === inputLower || 
           u.name?.toLowerCase() === inputLower) && 
          u.password === password
        );

        if (matchedUser) {
          if (matchedUser.status === 'غير نشط') {
            setError('هذا الحساب غير نشط حالياً. يرجى مراجعة مسؤول النظام.');
            setLoading(false);
            return;
          }

          sessionData = {
            email: matchedUser.email,
            isDemo: true,
            name: matchedUser.name,
            role: matchedUser.role,
          };
          loggedIn = true;
        }
      }

      if (loggedIn && sessionData) {
        onLoginSuccess(sessionData);
      } else {
        setError('اسم المستخدم أو كلمة المرور غير صحيحة.');
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="login_page_container" className="min-h-screen flex items-center justify-center bg-slate-50/50 p-4 transition-colors">
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-100/50 p-8 relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 mb-4 border border-indigo-100">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">بوابة الموارد البشرية والرواتب</h1>
          <p className="text-slate-400 text-sm mt-2 font-light">الرجاء تسجيل الدخول للوصول إلى النظام</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2">البريد الإلكتروني أو اسم المستخدم</label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 pointer-events-none">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="text"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="اسم المستخدم أو البريد الإلكتروني"
                className="w-full pl-4 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2">كلمة المرور</label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 pointer-events-none">
                <KeyRound className="w-5 h-5" />
              </span>
              <input
                type="password"
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-4 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all text-sm shadow-lg shadow-indigo-100 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? 'جاري التحقق...' : 'تسجيل الدخول'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

