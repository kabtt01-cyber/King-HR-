export type PageType = 'dashboard' | 'employees' | 'login';

export interface UserSession {
  email: string;
  isDemo: boolean;
  role?: string;
  name?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  status: 'نشط' | 'إجازة' | 'غير نشط';
  joinDate: string;
}
