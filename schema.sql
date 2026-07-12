-- Simple HR System - Database Schema (Phase 3)
-- Copy and paste this script into your Supabase SQL Editor to create the employees table and set up policies.

-- 1. Create employees table
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
    status VARCHAR(50) NOT NULL DEFAULT 'نشط', -- 'نشط', 'إجازة', 'غير نشط'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_employees_email ON public.employees(email);
CREATE INDEX IF NOT EXISTS idx_employees_code ON public.employees(employee_code);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies for Authorized Read & Write Access
-- Note: To allow public demo testing when not logged in to Auth, we allow read/write for anonymous/public.
-- You can restrict this later to auth.role() = 'authenticated' in production.

-- POLICY 1: Enable SELECT (Read) access for all users (or authenticated only)
CREATE POLICY "Allow public read access to employees" 
ON public.employees 
FOR SELECT 
USING (true);

-- POLICY 2: Enable INSERT (Write) access
CREATE POLICY "Allow public insert access to employees" 
ON public.employees 
FOR INSERT 
WITH CHECK (true);

-- POLICY 3: Enable UPDATE (Write) access
CREATE POLICY "Allow public update access to employees" 
ON public.employees 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- POLICY 4: Enable DELETE (Write) access
CREATE POLICY "Allow public delete access to employees" 
ON public.employees 
FOR DELETE 
USING (true);

-- 5. Trigger for automatic updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER trigger_update_employees_updated_at
    BEFORE UPDATE ON public.employees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. Insert dynamic dummy record for testing
INSERT INTO public.employees (employee_code, full_name, national_id, phone, email, department, job_title, hire_date, salary, status)
VALUES (
    'HR-1001',
    'أحمد محمد علي',
    '1029384756',
    '+966501234567',
    'ahmed.ali@example.com',
    'الموارد البشرية',
    'أخصائي أول موارد بشرية',
    '2025-01-15',
    8500.00,
    'نشط'
) ON CONFLICT (employee_code) DO NOTHING;
