export type PageType = 'dashboard' | 'employees' | 'users' | 'settings' | 'login';

export interface UserSession {
  email: string;
  isDemo: boolean;
  role?: 'admin' | 'hr';
  name?: string;
}

export interface Employee {
  id: string;
  employee_code: string;
  full_name: string;
  national_id: string;
  phone: string;
  email: string;
  department: string;
  job_title: string;
  hire_date: string;
  salary: number;
  status: 'نشط' | 'إجازة' | 'غير نشط' | string;
  created_at?: string;
  updated_at?: string;
}

