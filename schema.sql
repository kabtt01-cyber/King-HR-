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

-- 7. Create system_users table for persistent administrative system users
CREATE TABLE IF NOT EXISTS public.system_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'hr', -- 'admin', 'hr'
    status VARCHAR(50) NOT NULL DEFAULT 'نشط', -- 'نشط', 'غير نشط'
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for system_users
ALTER TABLE public.system_users ENABLE ROW LEVEL SECURITY;

-- Policies for public testing/synchronization across origins (Vercel and AI Studio)
CREATE POLICY "Allow public read access to system_users" ON public.system_users FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to system_users" ON public.system_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to system_users" ON public.system_users FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete access to system_users" ON public.system_users FOR DELETE USING (true);

-- Insert initial system users if they don't exist
INSERT INTO public.system_users (name, username, email, role, status, password, created_at)
VALUES 
('مسؤول النظام', 'admin', 'admin@hr.com', 'admin', 'نشط', 'Admin@123', '2026-01-10T00:00:00Z'),
('HR 1', 'hr1', 'hr1@hr.com', 'hr', 'نشط', 'Hr@12345', '2026-03-15T00:00:00Z'),
('HR 2', 'hr2', 'hr2@hr.com', 'hr', 'نشط', 'Hr@54321', '2026-05-20T00:00:00Z')
ON CONFLICT (email) DO NOTHING;
