// Job Database Operations
// Note: This file provides job-related database functionality
// Currently using local storage as fallback since database tables are not yet created

import { JobListing } from './job-aggregator';

export interface SavedJob {
  id: string;
  job_id: string;
  user_id: string;
  job_title: string;
  company: string;
  location: string;
  salary?: string;
  status: 'saved' | 'applied' | 'interview' | 'offered' | 'rejected' | 'reviewed';
  applied_at?: string;
  created_at: string;
  updated_at: string;
}

export interface JobSearchHistory {
  id: string;
  user_id: string;
  query: string;
  location?: string;
  results_count: number;
  searched_at: string;
}

// Temporary local storage implementation until database tables are created
const SAVED_JOBS_KEY = 'saved_jobs';
const SEARCH_HISTORY_KEY = 'search_history';

// Save a job to user's saved jobs (using localStorage for now)
export async function saveJob(userId: string, job: JobListing): Promise<boolean> {
  try {
    const savedJobs = getSavedJobsFromStorage();
    const newSavedJob: SavedJob = {
      id: `saved_${Date.now()}`,
      job_id: job.id,
      user_id: userId,
      job_title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary ? `${job.salary.min || 0}-${job.salary.max || 0} ${job.salary.currency || 'USD'}` : undefined,
      status: 'saved',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    savedJobs.push(newSavedJob);
    localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(savedJobs));
    return true;
  } catch (error) {
    console.error('Error saving job:', error);
    return false;
  }
}

// Get user's saved jobs (from localStorage for now)
export async function getSavedJobs(userId: string): Promise<SavedJob[]> {
  try {
    const savedJobs = getSavedJobsFromStorage();
    return savedJobs.filter(job => job.user_id === userId);
  } catch (error) {
    console.error('Error getting saved jobs:', error);
    return [];
  }
}

// Update job application status (using localStorage for now)
export async function updateJobStatus(userId: string, jobId: string, status: SavedJob['status']): Promise<boolean> {
  try {
    const savedJobs = getSavedJobsFromStorage();
    const jobIndex = savedJobs.findIndex(job => job.job_id === jobId && job.user_id === userId);
    
    if (jobIndex !== -1) {
      savedJobs[jobIndex].status = status;
      savedJobs[jobIndex].updated_at = new Date().toISOString();
      
      if (status === 'applied') {
        savedJobs[jobIndex].applied_at = new Date().toISOString();
      }
      
      localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(savedJobs));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error updating job status:', error);
    return false;
  }
}

// Remove a job from saved jobs (using localStorage for now)
export async function removeSavedJob(userId: string, jobId: string): Promise<boolean> {
  try {
    const savedJobs = getSavedJobsFromStorage();
    const filteredJobs = savedJobs.filter(job => !(job.job_id === jobId && job.user_id === userId));
    localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(filteredJobs));
    return true;
  } catch (error) {
    console.error('Error removing saved job:', error);
    return false;
  }
}

// Get application stats (using localStorage for now)
export async function getApplicationStats(userId: string): Promise<Record<string, number>> {
  try {
    const savedJobs = await getSavedJobs(userId);
    const stats: Record<string, number> = {
      saved: 0,
      applied: 0,
      interview: 0,
      offered: 0,
      rejected: 0,
      reviewed: 0
    };

    savedJobs.forEach(job => {
      stats[job.status]++;
    });

    return stats;
  } catch (error) {
    console.error('Error getting application stats:', error);
    return {};
  }
}

// Save search query to history (using localStorage for now)
export async function saveSearchHistory(userId: string, query: string, location?: string, resultsCount: number = 0): Promise<void> {
  try {
    const history = getSearchHistoryFromStorage();
    const searchEntry: JobSearchHistory = {
      id: `search_${Date.now()}`,
      user_id: userId,
      query,
      location,
      results_count: resultsCount,
      searched_at: new Date().toISOString()
    };

    history.unshift(searchEntry);
    // Keep only last 50 searches
    const trimmedHistory = history.slice(0, 50);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error('Error saving search history:', error);
  }
}

// Get user's search history (from localStorage for now)
export async function getSearchHistory(userId: string): Promise<JobSearchHistory[]> {
  try {
    const history = getSearchHistoryFromStorage();
    return history.filter(entry => entry.user_id === userId);
  } catch (error) {
    console.error('Error getting search history:', error);
    return [];
  }
}

// Helper functions for localStorage
function getSavedJobsFromStorage(): SavedJob[] {
  try {
    const saved = localStorage.getItem(SAVED_JOBS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error parsing saved jobs from storage:', error);
    return [];
  }
}

function getSearchHistoryFromStorage(): JobSearchHistory[] {
  try {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error parsing search history from storage:', error);
    return [];
  }
}

// Analytics functions (mock implementation for now)
export async function getSearchAnalytics(timeframe: 'day' | 'week' | 'month' = 'week'): Promise<any> {
  try {
    // Mock analytics data until database is set up
    return {
      totalSearches: Math.floor(Math.random() * 1000),
      uniqueUsers: Math.floor(Math.random() * 500),
      topQueries: ['software engineer', 'data scientist', 'product manager'],
      searchTrends: []
    };
  } catch (error) {
    console.error('Error getting search analytics:', error);
    return null;
  }
}

// Check if job is saved by user
export async function isJobSaved(userId: string, jobId: string): Promise<boolean> {
  try {
    const savedJobs = await getSavedJobs(userId);
    return savedJobs.some(job => job.job_id === jobId);
  } catch (error) {
    console.error('Error checking if job is saved:', error);
    return false;
  }
}
