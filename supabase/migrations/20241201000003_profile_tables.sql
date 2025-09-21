-- Create profile tables for different user types

-- Job Seeker Profiles
CREATE TABLE IF NOT EXISTS job_seeker_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  location TEXT,
  experience_level TEXT CHECK (experience_level IN ('entry', 'mid', 'senior', 'executive')),
  skills TEXT,
  education TEXT,
  work_experience TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  availability TEXT CHECK (availability IN ('immediately', '2weeks', '1month', 'flexible')),
  salary_expectation TEXT,
  preferred_locations TEXT,
  job_preferences TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recruiter Profiles
CREATE TABLE IF NOT EXISTS recruiter_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  company_name TEXT,
  title TEXT,
  department TEXT,
  hiring_authority BOOLEAN DEFAULT FALSE,
  specialties TEXT,
  experience_years INTEGER DEFAULT 0,
  linkedin_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employer Profiles
CREATE TABLE IF NOT EXISTS employer_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  company_name TEXT,
  title TEXT,
  department TEXT,
  hiring_authority BOOLEAN DEFAULT FALSE,
  company_size TEXT CHECK (company_size IN ('startup', 'small', 'medium', 'large', 'enterprise')),
  industry TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student Profiles
CREATE TABLE IF NOT EXISTS student_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  university TEXT,
  major TEXT,
  graduation_year INTEGER,
  gpa TEXT,
  skills TEXT,
  interests TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_job_seeker_profiles_user_id ON job_seeker_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_recruiter_profiles_user_id ON recruiter_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_employer_profiles_user_id ON employer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_user_id ON student_profiles(user_id);

-- Create RLS policies
ALTER TABLE job_seeker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruiter_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE employer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;

-- Job Seeker Profiles Policies
CREATE POLICY "Users can view their own job seeker profile" ON job_seeker_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own job seeker profile" ON job_seeker_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own job seeker profile" ON job_seeker_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Recruiter Profiles Policies
CREATE POLICY "Users can view their own recruiter profile" ON recruiter_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recruiter profile" ON recruiter_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recruiter profile" ON recruiter_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Employer Profiles Policies
CREATE POLICY "Users can view their own employer profile" ON employer_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own employer profile" ON employer_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own employer profile" ON employer_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Student Profiles Policies
CREATE POLICY "Users can view their own student profile" ON student_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own student profile" ON student_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own student profile" ON student_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Super Admin can view all profiles
CREATE POLICY "Super admin can view all job seeker profiles" ON job_seeker_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'super_admin'
    )
  );

CREATE POLICY "Super admin can view all recruiter profiles" ON recruiter_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'super_admin'
    )
  );

CREATE POLICY "Super admin can view all employer profiles" ON employer_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'super_admin'
    )
  );

CREATE POLICY "Super admin can view all student profiles" ON student_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'super_admin'
    )
  );
