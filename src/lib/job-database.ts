// Job Database Integration
// Handles job data persistence and retrieval from Supabase

import { supabase } from '@/integrations/supabase/client';
import { JobListing } from './job-aggregator';

export interface SavedJob {
  id: string;
  user_id: string;
  job_id: string;
  job_title: string;
  company: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  job_url?: string;
  source: string;
  remote: boolean;
  description?: string;
  saved_at: string;
  applied_at?: string;
  status: 'saved' | 'applied' | 'interview' | 'rejected' | 'offered';
}

export interface JobSearchHistory {
  id: string;
  user_id: string;
  query: string;
  location: string;
  sources: string[];
  results_count: number;
  searched_at: string;
}

// Save a job to user's saved jobs
export async function saveJob(userId: string, job: JobListing): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('job_applications')
      .insert({
        user_id: userId,
        job_id: job.id,
        job_title: job.title,
        company: job.company,
        job_url: job.url,
        status: 'saved'
      });

    if (error) {
      console.error('Error saving job:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error saving job:', error);
    return false;
  }
}

// Get user's saved jobs
export async function getSavedJobs(userId: string): Promise<SavedJob[]> {
  try {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('user_id', userId)
      .order('applied_at', { ascending: false });

    if (error) {
      console.error('Error fetching saved jobs:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching saved jobs:', error);
    return [];
  }
}

// Apply to a job
export async function applyToJob(userId: string, job: JobListing, resumeName?: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('job_applications')
      .insert({
        user_id: userId,
        job_id: job.id,
        job_title: job.title,
        company: job.company,
        job_url: job.url,
        resume_name: resumeName,
        status: 'applied'
      });

    if (error) {
      console.error('Error applying to job:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error applying to job:', error);
    return false;
  }
}

// Update job application status
export async function updateJobStatus(
  applicationId: string, 
  status: 'applied' | 'interview' | 'rejected' | 'offered' | 'withdrawn',
  notes?: string,
  salaryOffered?: number,
  interviewDate?: string
): Promise<boolean> {
  try {
    const updateData: any = { status };
    
    if (notes) updateData.notes = notes;
    if (salaryOffered) updateData.salary_offered = salaryOffered;
    if (interviewDate) updateData.interview_date = interviewDate;

    const { error } = await supabase
      .from('job_applications')
      .update(updateData)
      .eq('id', applicationId);

    if (error) {
      console.error('Error updating job status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating job status:', error);
    return false;
  }
}

// Log job search analytics
export async function logJobSearch(
  userId: string | null,
  query: string,
  location: string,
  sources: string[],
  resultsCount: number,
  ipAddress?: string,
  userAgent?: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('search_analytics')
      .insert({
        user_id: userId,
        query,
        location,
        sources,
        results_count: resultsCount,
        ip_address: ipAddress,
        user_agent: userAgent
      });

    if (error) {
      console.error('Error logging search analytics:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error logging search analytics:', error);
    return false;
  }
}

// Get job search history for a user
export async function getJobSearchHistory(userId: string): Promise<JobSearchHistory[]> {
  try {
    const { data, error } = await supabase
      .from('search_analytics')
      .select('*')
      .eq('user_id', userId)
      .order('searched_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching search history:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching search history:', error);
    return [];
  }
}

// Get popular job searches (for analytics)
export async function getPopularSearches(limit: number = 10): Promise<Array<{query: string, count: number}>> {
  try {
    const { data, error } = await supabase
      .from('search_analytics')
      .select('query')
      .not('query', 'is', null)
      .not('query', 'eq', '');

    if (error) {
      console.error('Error fetching popular searches:', error);
      return [];
    }

    // Count query frequency
    const queryCounts: Record<string, number> = {};
    data?.forEach(item => {
      queryCounts[item.query] = (queryCounts[item.query] || 0) + 1;
    });

    // Sort by count and return top results
    return Object.entries(queryCounts)
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching popular searches:', error);
    return [];
  }
}

// Get job application statistics for a user
export async function getJobApplicationStats(userId: string): Promise<{
  total: number;
  applied: number;
  interviews: number;
  offers: number;
  rejections: number;
}> {
  try {
    const { data, error } = await supabase
      .from('job_applications')
      .select('status')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching application stats:', error);
      return { total: 0, applied: 0, interviews: 0, offers: 0, rejections: 0 };
    }

    const stats = {
      total: data?.length || 0,
      applied: 0,
      interviews: 0,
      offers: 0,
      rejections: 0
    };

    data?.forEach(item => {
      switch (item.status) {
        case 'applied':
          stats.applied++;
          break;
        case 'interview':
          stats.interviews++;
          break;
        case 'offered':
          stats.offers++;
          break;
        case 'rejected':
          stats.rejections++;
          break;
      }
    });

    return stats;
  } catch (error) {
    console.error('Error fetching application stats:', error);
    return { total: 0, applied: 0, interviews: 0, offers: 0, rejections: 0 };
  }
}
