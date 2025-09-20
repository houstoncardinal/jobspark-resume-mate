-- Comprehensive User Schema for All Roles
-- This migration creates tables for all user types with their specific data

-- Update profiles table to include role-specific fields
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'job_seeker';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS first_name VARCHAR(100);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location VARCHAR(200);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS timezone VARCHAR(50);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';

-- Job Seeker specific table
CREATE TABLE IF NOT EXISTS job_seeker_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    current_title VARCHAR(200),
    desired_title VARCHAR(200),
    experience_level VARCHAR(50), -- entry, mid, senior, executive
    salary_expectation_min INTEGER,
    salary_expectation_max INTEGER,
    currency VARCHAR(3) DEFAULT 'USD',
    availability VARCHAR(50), -- immediate, 2weeks, 1month, flexible
    work_preference VARCHAR(50), -- remote, hybrid, onsite
    willing_to_relocate BOOLEAN DEFAULT FALSE,
    preferred_locations TEXT[],
    skills TEXT[],
    industries TEXT[],
    job_types TEXT[], -- full-time, part-time, contract, internship
    resume_url TEXT,
    portfolio_url TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    website_url TEXT,
    bio TEXT,
    achievements TEXT[],
    certifications TEXT[],
    languages TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recruiter specific table
CREATE TABLE IF NOT EXISTS recruiter_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id),
    current_title VARCHAR(200),
    department VARCHAR(100),
    years_experience INTEGER,
    specializations TEXT[], -- tech, healthcare, finance, etc.
    industries TEXT[],
    job_levels TEXT[], -- entry, mid, senior, executive
    locations TEXT[],
    budget_range_min INTEGER,
    budget_range_max INTEGER,
    currency VARCHAR(3) DEFAULT 'USD',
    hiring_volume INTEGER, -- jobs per month
    team_size INTEGER,
    linkedin_url TEXT,
    bio TEXT,
    achievements TEXT[],
    certifications TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employer/Company specific table
CREATE TABLE IF NOT EXISTS employer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id),
    position VARCHAR(200), -- CEO, HR Director, etc.
    department VARCHAR(100),
    years_experience INTEGER,
    company_size VARCHAR(50), -- startup, small, medium, large, enterprise
    industry VARCHAR(100),
    company_stage VARCHAR(50), -- startup, growth, established, enterprise
    hiring_needs TEXT[],
    budget_range_min INTEGER,
    budget_range_max INTEGER,
    currency VARCHAR(3) DEFAULT 'USD',
    locations TEXT[],
    work_models TEXT[], -- remote, hybrid, onsite
    linkedin_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student specific table
CREATE TABLE IF NOT EXISTS student_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    university VARCHAR(200),
    degree_program VARCHAR(200),
    graduation_year INTEGER,
    gpa DECIMAL(3,2),
    major VARCHAR(100),
    minor VARCHAR(100),
    expected_graduation DATE,
    career_goals TEXT,
    interests TEXT[],
    skills TEXT[],
    projects TEXT[],
    internships TEXT[],
    volunteer_work TEXT[],
    extracurriculars TEXT[],
    portfolio_url TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    resume_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced companies table
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE,
    description TEXT,
    website_url TEXT,
    logo_url TEXT,
    industry VARCHAR(100),
    company_size VARCHAR(50),
    founded_year INTEGER,
    headquarters VARCHAR(200),
    locations TEXT[],
    work_models TEXT[], -- remote, hybrid, onsite
    benefits TEXT[],
    culture TEXT[],
    values TEXT[],
    mission TEXT,
    vision TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    facebook_url TEXT,
    instagram_url TEXT,
    youtube_url TEXT,
    verified BOOLEAN DEFAULT FALSE,
    featured BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User verification table
CREATE TABLE IF NOT EXISTS user_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    verification_type VARCHAR(50), -- email, phone, identity
    verification_code VARCHAR(10),
    verification_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    verified_at TIMESTAMP WITH TIME ZONE,
    attempts INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User onboarding progress table
CREATE TABLE IF NOT EXISTS onboarding_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    step VARCHAR(50),
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email_verified ON profiles(email_verified);
CREATE INDEX IF NOT EXISTS idx_job_seeker_profiles_user_id ON job_seeker_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_recruiter_profiles_user_id ON recruiter_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_employer_profiles_user_id ON employer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_user_id ON student_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);
CREATE INDEX IF NOT EXISTS idx_user_verifications_user_id ON user_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_progress_user_id ON onboarding_progress(user_id);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_job_seeker_profiles_updated_at BEFORE UPDATE ON job_seeker_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recruiter_profiles_updated_at BEFORE UPDATE ON recruiter_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employer_profiles_updated_at BEFORE UPDATE ON employer_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_profiles_updated_at BEFORE UPDATE ON student_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_onboarding_progress_updated_at BEFORE UPDATE ON onboarding_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE job_seeker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruiter_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE employer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_progress ENABLE ROW LEVEL SECURITY;

-- Job Seeker policies
CREATE POLICY "Users can view own job seeker profile" ON job_seeker_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own job seeker profile" ON job_seeker_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own job seeker profile" ON job_seeker_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own job seeker profile" ON job_seeker_profiles FOR DELETE USING (auth.uid() = user_id);

-- Recruiter policies
CREATE POLICY "Users can view own recruiter profile" ON recruiter_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own recruiter profile" ON recruiter_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own recruiter profile" ON recruiter_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own recruiter profile" ON recruiter_profiles FOR DELETE USING (auth.uid() = user_id);

-- Employer policies
CREATE POLICY "Users can view own employer profile" ON employer_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own employer profile" ON employer_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own employer profile" ON employer_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own employer profile" ON employer_profiles FOR DELETE USING (auth.uid() = user_id);

-- Student policies
CREATE POLICY "Users can view own student profile" ON student_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own student profile" ON student_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own student profile" ON student_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own student profile" ON student_profiles FOR DELETE USING (auth.uid() = user_id);

-- Company policies
CREATE POLICY "Anyone can view companies" ON companies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert companies" ON companies FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own companies" ON companies FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM employer_profiles WHERE company_id = companies.id));

-- Verification policies
CREATE POLICY "Users can view own verifications" ON user_verifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own verifications" ON user_verifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own verifications" ON user_verifications FOR UPDATE USING (auth.uid() = user_id);

-- Onboarding policies
CREATE POLICY "Users can view own onboarding progress" ON onboarding_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own onboarding progress" ON onboarding_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own onboarding progress" ON onboarding_progress FOR UPDATE USING (auth.uid() = user_id);
