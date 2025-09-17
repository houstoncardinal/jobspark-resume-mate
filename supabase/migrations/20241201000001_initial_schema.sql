-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  location TEXT,
  industry TEXT,
  experience_level TEXT CHECK (experience_level IN ('entry', 'mid', 'senior', 'executive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job applications tracking
CREATE TABLE public.job_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  job_id TEXT NOT NULL,
  job_title TEXT NOT NULL,
  company TEXT NOT NULL,
  job_url TEXT,
  resume_name TEXT,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'applied' CHECK (status IN ('applied', 'interview', 'rejected', 'offered', 'withdrawn')),
  notes TEXT,
  salary_offered NUMERIC,
  interview_date TIMESTAMP WITH TIME ZONE
);

-- Resume library (cloud storage)
CREATE TABLE public.resume_library (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  template TEXT DEFAULT 'modern' CHECK (template IN ('modern', 'classic', 'minimal')),
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job search analytics
CREATE TABLE public.search_analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  query TEXT,
  location TEXT,
  region TEXT,
  sources TEXT[],
  results_count INTEGER DEFAULT 0,
  searched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Company reviews and ratings
CREATE TABLE public.company_reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  job_title TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  pros TEXT,
  cons TEXT,
  work_life_balance INTEGER CHECK (work_life_balance >= 1 AND work_life_balance <= 5),
  salary_satisfaction INTEGER CHECK (salary_satisfaction >= 1 AND salary_satisfaction <= 5),
  management_quality INTEGER CHECK (management_quality >= 1 AND management_quality <= 5),
  career_opportunities INTEGER CHECK (career_opportunities >= 1 AND career_opportunities <= 5),
  overall_experience TEXT,
  salary_range_min NUMERIC,
  salary_range_max NUMERIC,
  employment_type TEXT CHECK (employment_type IN ('full-time', 'part-time', 'contract', 'internship')),
  remote_work BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Salary insights
CREATE TABLE public.salary_insights (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  job_title TEXT NOT NULL,
  company TEXT,
  location TEXT,
  salary_min NUMERIC,
  salary_max NUMERIC,
  currency TEXT DEFAULT 'USD',
  employment_type TEXT CHECK (employment_type IN ('full-time', 'part-time', 'contract', 'internship')),
  experience_level TEXT CHECK (experience_level IN ('entry', 'mid', 'senior', 'executive')),
  remote_work BOOLEAN DEFAULT FALSE,
  source TEXT, -- 'user_submitted', 'job_posting', 'review'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts and content
CREATE TABLE public.blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  featured_image_url TEXT,
  tags TEXT[],
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0
);

-- User engagement tracking
CREATE TABLE public.user_engagement (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'resume_upload', 'job_search', 'job_apply', 'resume_optimize', 'blog_read'
  target_id TEXT, -- job_id, resume_id, blog_post_id, etc.
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Success stories
CREATE TABLE public.success_stories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  story TEXT NOT NULL,
  before_resume TEXT,
  after_resume TEXT,
  job_title TEXT,
  company TEXT,
  salary_increase NUMERIC,
  time_to_hire INTEGER, -- days
  featured BOOLEAN DEFAULT FALSE,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job market trends (aggregated data)
CREATE TABLE public.job_market_trends (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  date DATE NOT NULL,
  job_title TEXT NOT NULL,
  location TEXT,
  remote_percentage NUMERIC,
  avg_salary_min NUMERIC,
  avg_salary_max NUMERIC,
  job_count INTEGER,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_job_applications_user_id ON public.job_applications(user_id);
CREATE INDEX idx_job_applications_applied_at ON public.job_applications(applied_at);
CREATE INDEX idx_resume_library_user_id ON public.resume_library(user_id);
CREATE INDEX idx_search_analytics_searched_at ON public.search_analytics(searched_at);
CREATE INDEX idx_company_reviews_company ON public.company_reviews(company);
CREATE INDEX idx_salary_insights_job_title ON public.salary_insights(job_title);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(published, published_at);
CREATE INDEX idx_user_engagement_user_id ON public.user_engagement(user_id);
CREATE INDEX idx_success_stories_featured ON public.success_stories(featured, approved);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_resume_library_updated_at
  BEFORE UPDATE ON public.resume_library
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_company_reviews_updated_at
  BEFORE UPDATE ON public.company_reviews
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_success_stories_updated_at
  BEFORE UPDATE ON public.success_stories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Row Level Security (RLS) policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_engagement ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Job applications policies
CREATE POLICY "Users can view own applications" ON public.job_applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications" ON public.job_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications" ON public.job_applications
  FOR UPDATE USING (auth.uid() = user_id);

-- Resume library policies
CREATE POLICY "Users can view own resumes" ON public.resume_library
  FOR SELECT USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can insert own resumes" ON public.resume_library
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resumes" ON public.resume_library
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resumes" ON public.resume_library
  FOR DELETE USING (auth.uid() = user_id);

-- Company reviews policies
CREATE POLICY "Anyone can view reviews" ON public.company_reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own reviews" ON public.company_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON public.company_reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Salary insights policies
CREATE POLICY "Anyone can view salary insights" ON public.salary_insights
  FOR SELECT USING (true);

CREATE POLICY "Users can insert salary insights" ON public.salary_insights
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Blog posts policies
CREATE POLICY "Anyone can view published posts" ON public.blog_posts
  FOR SELECT USING (published = true);

CREATE POLICY "Authors can manage own posts" ON public.blog_posts
  FOR ALL USING (auth.uid() = author_id);

-- Success stories policies
CREATE POLICY "Anyone can view approved stories" ON public.success_stories
  FOR SELECT USING (approved = true);

CREATE POLICY "Users can insert own stories" ON public.success_stories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stories" ON public.success_stories
  FOR UPDATE USING (auth.uid() = user_id);

-- User engagement policies
CREATE POLICY "Users can view own engagement" ON public.user_engagement
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own engagement" ON public.user_engagement
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Search analytics policies (anonymous allowed)
CREATE POLICY "Anyone can insert search analytics" ON public.search_analytics
  FOR INSERT WITH CHECK (true);

-- Job market trends policies (public read)
CREATE POLICY "Anyone can view job market trends" ON public.job_market_trends
  FOR SELECT USING (true);
