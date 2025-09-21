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
  job_url?: string;
  resume_name?: string;
  applied_at: string;
  status: 'applied' | 'interview' | 'rejected' | 'offered' | 'withdrawn';
  notes?: string;
  salary_offered?: number;
  interview_date?: string;
}

export interface JobSearchHistory {
  id: string;
  user_id: string;
  query: string;
  location?: string;
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
        status: 'applied'
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
export async function updateJobStatus(jobId: string, status: SavedJob['status'], notes?: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('job_applications')
      .update({ 
        status,
        notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId);

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

// Delete a job application
export async function deleteJobApplication(jobId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('job_applications')
      .delete()
      .eq('id', jobId);

    if (error) {
      console.error('Error deleting job application:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting job application:', error);
    return false;
  }
}

// Save search analytics
export async function saveSearchAnalytics(
  userId: string,
  query: string,
  location?: string,
  sources?: string[],
  resultsCount: number = 0
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('search_analytics')
      .insert({
        user_id: userId,
        query,
        location,
        sources,
        results_count: resultsCount
      });

    if (error) {
      console.error('Error saving search analytics:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error saving search analytics:', error);
    return false;
  }
}

// Get search analytics for a user
export async function getSearchAnalytics(userId: string): Promise<JobSearchHistory[]> {
  try {
    const { data, error } = await supabase
      .from('search_analytics')
      .select('*')
      .eq('user_id', userId)
      .order('searched_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching search analytics:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching search analytics:', error);
    return [];
  }
}

// Get job application statistics
export async function getJobApplicationStats(userId: string): Promise<{
  total: number;
  applied: number;
  interview: number;
  rejected: number;
  offered: number;
}> {
  try {
    const { data, error } = await supabase
      .from('job_applications')
      .select('status')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching job application stats:', error);
      return { total: 0, applied: 0, interview: 0, rejected: 0, offered: 0 };
    }

    const stats = {
      total: data.length,
      applied: data.filter(job => job.status === 'applied').length,
      interview: data.filter(job => job.status === 'interview').length,
      rejected: data.filter(job => job.status === 'rejected').length,
      offered: data.filter(job => job.status === 'offered').length
    };

    return stats;
  } catch (error) {
    console.error('Error fetching job application stats:', error);
    return { total: 0, applied: 0, interview: 0, rejected: 0, offered: 0 };
  }
}
