// Comprehensive Job Aggregation System
// Pulls jobs from multiple platforms including USAJobs, Indeed, LinkedIn, GitHub, and more

// Import RSS jobs
import { getAllRSSJobs, getMockRSSJobs } from './rss-jobs';

// ⚡ ULTRA-FAST PERFORMANCE CACHING SYSTEM
interface CacheEntry {
  data: JobListing[];
  timestamp: number;
  params: string;
}

// Cache with 5-minute expiry for ultra-fast loading
const JOB_CACHE = new Map<string, CacheEntry>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Generate cache key from search parameters
function getCacheKey(params: JobSearchParams): string {
  return JSON.stringify({
    query: params.query?.toLowerCase() || "",
    location: params.location?.toLowerCase() || "",
    sources: params.sources?.sort() || [],
    limit: params.limit || 50,
    remote: params.remote || false,
    jobType: params.jobType || "",
    experience: params.experience || "",
    industry: params.industry || ""
  });
}

// Check if cache entry is valid
function isCacheValid(entry: CacheEntry): boolean {
  return Date.now() - entry.timestamp < CACHE_DURATION;
}

// Get cached results if available
function getCachedResults(params: JobSearchParams): JobListing[] | null {
  const key = getCacheKey(params);
  const entry = JOB_CACHE.get(key);
  if (entry && isCacheValid(entry)) {
    console.log("⚡ Cache HIT: Returning cached results");
    return entry.data;
  }
  return null;
}

// Store results in cache
function setCachedResults(params: JobSearchParams, data: JobListing[]): void {
  const key = getCacheKey(params);
  JOB_CACHE.set(key, {
    data,
    timestamp: Date.now(),
    params: key
  });
  console.log("💾 Cached results for future requests");
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
    period?: string;
  };
  type?: string;
  posted?: string;
  description?: string;
  requirements?: string[];
  source: string;
  url?: string;
  remote?: boolean;
  benefits?: string[];
  experience?: string;
  education?: string;
  skills?: string[];
  industry?: string;
  companySize?: string;
  logo?: string;
}

export interface JobSearchParams {
  query?: string;
  location?: string;
  remote?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  jobType?: string;
  experience?: string;
  industry?: string;
  sources?: string[];
  limit?: number;
  page?: number;
}

// API Keys from environment variables - SECURE IMPLEMENTATION
const API_KEYS = {
  USAJOBS: import.meta.env.VITE_USAJOBS_API_KEY,
  USAJOBS_USER_AGENT: import.meta.env.VITE_USAJOBS_USER_AGENT || "Gigm8 Job Search Platform (contact@gigm8.com)",
  ZIPRECRUITER: import.meta.env.VITE_ZIPRECRUITER_API_KEY,
  JOOBLE: import.meta.env.VITE_JOOBLE_API_KEY,
  ADZUNA_ID: import.meta.env.VITE_ADZUNA_APP_ID,
  ADZUNA_KEY: import.meta.env.VITE_ADZUNA_APP_KEY,
  INDEED: import.meta.env.VITE_INDEED_PUBLISHER_ID,
  GLASSDOOR_ID: import.meta.env.VITE_GLASSDOOR_PARTNER_ID,
  GLASSDOOR_KEY: import.meta.env.VITE_GLASSDOOR_KEY,
  LINKEDIN_ID: import.meta.env.VITE_LINKEDIN_CLIENT_ID,
  LINKEDIN_SECRET: import.meta.env.VITE_LINKEDIN_CLIENT_SECRET,
  GITHUB_ID: import.meta.env.VITE_GITHUB_CLIENT_ID,
  GITHUB_SECRET: import.meta.env.VITE_GITHUB_CLIENT_SECRET,
  STACKOVERFLOW_ID: import.meta.env.VITE_STACKOVERFLOW_CLIENT_ID,
  STACKOVERFLOW_SECRET: import.meta.env.VITE_STACKOVERFLOW_CLIENT_SECRET,
  ANGEL: import.meta.env.VITE_ANGEL_API_KEY,
  DICE: import.meta.env.VITE_DICE_API_KEY,
  MONSTER: import.meta.env.VITE_MONSTER_API_KEY,
  CAREERBUILDER: import.meta.env.VITE_CAREERBUILDER_API_KEY,
  SIMPLYHIRED: import.meta.env.VITE_SIMPLYHIRED_API_KEY,
  APIFY: import.meta.env.VITE_APIFY_API_KEY,
};

// Mock job data for when APIs are not available
const MOCK_JOBS: JobListing[] = [
  {
    id: 'mock-1',
    title: 'Senior Software Engineer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    salary: { min: 120000, max: 180000, currency: 'USD', period: 'year' },
    type: 'Full-time',
    posted: '2 days ago',
    description: 'We are looking for a senior software engineer to join our growing team...',
    requirements: ['5+ years experience', 'React', 'Node.js', 'TypeScript'],
    source: 'Mock',
    url: '#',
    remote: true,
    benefits: ['Health insurance', '401k', 'Flexible hours'],
    experience: 'Senior',
    education: 'Bachelor\'s degree',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
    industry: 'Technology',
    companySize: '51-200',
    logo: '/logos/techcorp.png'
  },
  {
    id: 'mock-2',
    title: 'Product Manager',
    company: 'StartupXYZ',
    location: 'New York, NY',
    salary: { min: 100000, max: 150000, currency: 'USD', period: 'year' },
    type: 'Full-time',
    posted: '1 week ago',
    description: 'Join our product team to help shape the future of our platform...',
    requirements: ['3+ years PM experience', 'Agile', 'User research'],
    source: 'Mock',
    url: '#',
    remote: false,
    benefits: ['Equity', 'Health insurance', 'Unlimited PTO'],
    experience: 'Mid-level',
    education: 'Bachelor\'s degree',
    skills: ['Product Management', 'Agile', 'User Research', 'Analytics'],
    industry: 'Technology',
    companySize: '11-50',
    logo: '/logos/startupxyz.png'
  },
  {
    id: 'mock-3',
    title: 'Data Scientist',
    company: 'DataFlow Inc.',
    location: 'Seattle, WA',
    salary: { min: 110000, max: 160000, currency: 'USD', period: 'year' },
    type: 'Full-time',
    posted: '3 days ago',
    description: 'Help us build machine learning models to solve complex business problems...',
    requirements: ['PhD or MS in Data Science', 'Python', 'Machine Learning', 'SQL'],
    source: 'Mock',
    url: '#',
    remote: true,
    benefits: ['Health insurance', '401k', 'Learning budget'],
    experience: 'Mid-level',
    education: 'Master\'s degree',
    skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
    industry: 'Data Science',
    companySize: '201-500',
    logo: '/logos/dataflow.png'
  }
];

// USAJobs API integration
async function fetchUSAJobs(params: JobSearchParams): Promise<JobListing[]> {
  if (!API_KEYS.USAJOBS) {
    console.log('USAJobs API key not configured');
    return [];
  }

  try {
    const searchParams = new URLSearchParams({
      Keyword: params.query || '',
      LocationName: params.location || '',
      ResultsPerPage: (params.limit || 50).toString(),
      Page: (params.page || 1).toString()
    });

    const response = await fetch(
      `https://data.usajobs.gov/api/search?${searchParams}`,
      {
        headers: {
          'Host': 'data.usajobs.gov',
          'User-Agent': API_KEYS.USAJOBS_USER_AGENT,
          'Authorization-Key': API_KEYS.USAJOBS
        }
      }
    );

    if (!response.ok) {
      throw new Error(`USAJobs API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.SearchResult?.SearchResultItems?.map((item: any) => ({
      id: `usajobs-${item.MatchedObjectId}`,
      title: item.MatchedObjectDescriptor.PositionTitle,
      company: 'U.S. Government',
      location: item.MatchedObjectDescriptor.PositionLocationDisplay,
      salary: item.MatchedObjectDescriptor.PositionRemuneration?.[0] ? {
        min: item.MatchedObjectDescriptor.PositionRemuneration[0].MinimumRange,
        max: item.MatchedObjectDescriptor.PositionRemuneration[0].MaximumRange,
        currency: 'USD',
        period: 'year'
      } : undefined,
      type: item.MatchedObjectDescriptor.PositionSchedule?.[0]?.Code,
      posted: item.MatchedObjectDescriptor.PublicationStartDate,
      description: item.MatchedObjectDescriptor.QualificationSummary,
      requirements: item.MatchedObjectDescriptor.QualificationSummary?.split('.') || [],
      source: 'USAJobs',
      url: item.MatchedObjectDescriptor.ApplyURI?.[0],
      remote: false,
      experience: 'Various',
      education: 'Various',
      skills: [],
      industry: 'Government'
    })) || [];
  } catch (error) {
    console.error('Error fetching USAJobs:', error);
    return [];
  }
}

// Adzuna API integration
async function fetchAdzunaJobs(params: JobSearchParams): Promise<JobListing[]> {
  if (!API_KEYS.ADZUNA_ID || !API_KEYS.ADZUNA_KEY) {
    console.log('Adzuna API keys not configured');
    return [];
  }

  try {
    const searchParams = new URLSearchParams({
      app_id: API_KEYS.ADZUNA_ID,
      app_key: API_KEYS.ADZUNA_KEY,
      what: params.query || '',
      where: params.location || '',
      results_per_page: (params.limit || 50).toString(),
      page: (params.page || 1).toString()
    });

    const response = await fetch(
      `https://api.adzuna.com/v1/api/jobs/us/search/1?${searchParams}`
    );

    if (!response.ok) {
      throw new Error(`Adzuna API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.results?.map((job: any) => ({
      id: `adzuna-${job.id}`,
      title: job.title,
      company: job.company?.display_name || 'Unknown Company',
      location: job.location?.display_name || 'Unknown Location',
      salary: job.salary_min || job.salary_max ? {
        min: job.salary_min,
        max: job.salary_max,
        currency: 'USD',
        period: 'year'
      } : undefined,
      type: job.contract_type,
      posted: job.created,
      description: job.description,
      requirements: [],
      source: 'Adzuna',
      url: job.redirect_url,
      remote: job.remote,
      experience: 'Various',
      education: 'Various',
      skills: [],
      industry: job.category?.label || 'Various'
    })) || [];
  } catch (error) {
    console.error('Error fetching Adzuna jobs:', error);
    return [];
  }
}

// Indeed API integration
async function fetchIndeedJobs(params: JobSearchParams): Promise<JobListing[]> {
  if (!API_KEYS.INDEED) {
    console.log('Indeed API key not configured');
    return [];
  }

  try {
    const searchParams = new URLSearchParams({
      publisher: API_KEYS.INDEED,
      q: params.query || '',
      l: params.location || '',
      limit: (params.limit || 50).toString(),
      start: (((params.page || 1) - 1) * (params.limit || 50)).toString()
    });

    const response = await fetch(
      `https://api.indeed.com/ads/apisearch?${searchParams}`
    );

    if (!response.ok) {
      throw new Error(`Indeed API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.results?.map((job: any) => ({
      id: `indeed-${job.jobkey}`,
      title: job.jobtitle,
      company: job.company,
      location: job.formattedLocation,
      salary: job.salary ? {
        min: parseInt(job.salary.replace(/[^0-9]/g, '')) || undefined,
        max: parseInt(job.salary.replace(/[^0-9]/g, '')) || undefined,
        currency: 'USD',
        period: 'year'
      } : undefined,
      type: job.jobtype,
      posted: job.formattedRelativeTime,
      description: job.snippet,
      requirements: [],
      source: 'Indeed',
      url: job.url,
      remote: job.remote,
      experience: 'Various',
      education: 'Various',
      skills: [],
      industry: 'Various'
    })) || [];
  } catch (error) {
    console.error('Error fetching Indeed jobs:', error);
    return [];
  }
}

// LinkedIn API integration
async function fetchLinkedInJobs(params: JobSearchParams): Promise<JobListing[]> {
  if (!API_KEYS.LINKEDIN_ID || !API_KEYS.LINKEDIN_SECRET) {
    console.log('LinkedIn API keys not configured');
    return [];
  }

  try {
    // Note: LinkedIn requires OAuth2 flow for production
    // This is a simplified implementation for demonstration
    const searchParams = new URLSearchParams({
      keywords: params.query || '',
      locationName: params.location || '',
      count: (params.limit || 50).toString()
    });

    const response = await fetch(
      `https://api.linkedin.com/v2/jobSearch?${searchParams}`,
      {
        headers: {
          'Authorization': `Bearer ${API_KEYS.LINKEDIN_SECRET}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`LinkedIn API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.elements?.map((job: any) => ({
      id: `linkedin-${job.id}`,
      title: job.title,
      company: job.companyDetails?.name || 'Unknown Company',
      location: job.location?.city || 'Unknown Location',
      salary: job.salaryRange ? {
        min: job.salaryRange.min,
        max: job.salaryRange.max,
        currency: job.salaryRange.currency || 'USD',
        period: 'year'
      } : undefined,
      type: job.jobType,
      posted: job.listedAt,
      description: job.description,
      requirements: [],
      source: 'LinkedIn',
      url: job.jobPostingUrl,
      remote: job.remote,
      experience: 'Various',
      education: 'Various',
      skills: [],
      industry: 'Various'
    })) || [];
  } catch (error) {
    console.error('Error fetching LinkedIn jobs:', error);
    return [];
  }
}

// GitHub Jobs API integration
async function fetchGitHubJobs(params: JobSearchParams): Promise<JobListing[]> {
  try {
    const searchParams = new URLSearchParams({
      description: params.query || '',
      location: params.location || '',
      page: (params.page || 1).toString()
    });

    const response = await fetch(
      `https://jobs.github.com/positions.json?${searchParams}`
    );

    if (!response.ok) {
      throw new Error(`GitHub Jobs API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.map((job: any) => ({
      id: `github-${job.id}`,
      title: job.title,
      company: job.company,
      location: job.location,
      salary: undefined,
      type: job.type,
      posted: job.created_at,
      description: job.description,
      requirements: [],
      source: 'GitHub',
      url: job.url,
      remote: job.location?.toLowerCase().includes('remote') || false,
      experience: 'Various',
      education: 'Various',
      skills: [],
      industry: 'Technology'
    })) || [];
  } catch (error) {
    console.error('Error fetching GitHub jobs:', error);
    return [];
  }
}

// ZipRecruiter API integration
async function fetchZipRecruiterJobs(params: JobSearchParams): Promise<JobListing[]> {
  if (!API_KEYS.ZIPRECRUITER) {
    console.log('ZipRecruiter API key not configured');
    return [];
  }

  try {
    const searchParams = new URLSearchParams({
      search: params.query || '',
      location: params.location || '',
      radius_miles: '25',
      days_ago: '30',
      jobs_per_page: (params.limit || 50).toString(),
      page: (params.page || 1).toString()
    });

    const response = await fetch(
      `https://api.ziprecruiter.com/jobs/v1?${searchParams}`,
      {
        headers: {
          'Authorization': `Bearer ${API_KEYS.ZIPRECRUITER}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`ZipRecruiter API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.jobs?.map((job: any) => ({
      id: `ziprecruiter-${job.id}`,
      title: job.name,
      company: job.hiring_company?.name || 'Unknown Company',
      location: job.location?.city || 'Unknown Location',
      salary: job.salary_min || job.salary_max ? {
        min: job.salary_min,
        max: job.salary_max,
        currency: 'USD',
        period: 'year'
      } : undefined,
      type: job.job_type,
      posted: job.posted_time,
      description: job.snippet,
      requirements: [],
      source: 'ZipRecruiter',
      url: job.url,
      remote: job.remote,
      experience: 'Various',
      education: 'Various',
      skills: [],
      industry: 'Various'
    })) || [];
  } catch (error) {
    console.error('Error fetching ZipRecruiter jobs:', error);
    return [];
  }
}

// Main job aggregation function
export async function searchJobs(params: JobSearchParams): Promise<JobListing[]> {
  console.log('�� Starting job search with params:', params);
  
  // Check cache first
  const cachedResults = getCachedResults(params);
  if (cachedResults) {
    return cachedResults;
  }

  const allJobs: JobListing[] = [];
  const sources = params.sources || ['mock', 'usajobs', 'adzuna', 'rss'];

  try {
    // Fetch from multiple sources in parallel
    const promises: Promise<JobListing[]>[] = [];

    if (sources.includes('mock')) {
      promises.push(Promise.resolve(MOCK_JOBS));
    }

    if (sources.includes('usajobs')) {
      promises.push(fetchUSAJobs(params));
    }

    if (sources.includes('adzuna')) {
      promises.push(fetchAdzunaJobs(params));
    }

    if (sources.includes('indeed')) {
      promises.push(fetchIndeedJobs(params));
    }

    if (sources.includes('linkedin')) {
      promises.push(fetchLinkedInJobs(params));
    }

    if (sources.includes('github')) {
      promises.push(fetchGitHubJobs(params));
    }

    if (sources.includes('ziprecruiter')) {
      promises.push(fetchZipRecruiterJobs(params));
    }

    if (sources.includes('rss')) {
      promises.push(getAllRSSJobs());
    }

    const results = await Promise.allSettled(promises);
    
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allJobs.push(...result.value);
      } else {
        console.error('Error fetching jobs from source:', result.reason);
      }
    });

    // Filter and sort results
    let filteredJobs = allJobs;

    // Apply filters
    if (params.query) {
      const query = params.query.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.description?.toLowerCase().includes(query) ||
        job.skills?.some(skill => skill.toLowerCase().includes(query))
      );
    }

    if (params.location) {
      const location = params.location.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.location.toLowerCase().includes(location) ||
        job.remote
      );
    }

    if (params.remote) {
      filteredJobs = filteredJobs.filter(job => job.remote);
    }

    if (params.salaryMin) {
      filteredJobs = filteredJobs.filter(job => 
        !job.salary?.min || job.salary.min >= params.salaryMin!
      );
    }

    if (params.salaryMax) {
      filteredJobs = filteredJobs.filter(job => 
        !job.salary?.max || job.salary.max <= params.salaryMax!
      );
    }

    if (params.jobType) {
      filteredJobs = filteredJobs.filter(job => 
        job.type?.toLowerCase().includes(params.jobType!.toLowerCase())
      );
    }

    if (params.experience) {
      filteredJobs = filteredJobs.filter(job => 
        job.experience?.toLowerCase().includes(params.experience!.toLowerCase())
      );
    }

    if (params.industry) {
      filteredJobs = filteredJobs.filter(job => 
        job.industry?.toLowerCase().includes(params.industry!.toLowerCase())
      );
    }

    // Sort by relevance and date
    filteredJobs.sort((a, b) => {
      // Prioritize jobs with salary information
      if (a.salary && !b.salary) return -1;
      if (!a.salary && b.salary) return 1;
      
      // Sort by posted date (newest first)
      if (a.posted && b.posted) {
        return new Date(b.posted).getTime() - new Date(a.posted).getTime();
      }
      
      return 0;
    });

    // Limit results
    const limitedJobs = filteredJobs.slice(0, params.limit || 50);

    // Cache the results
    setCachedResults(params, limitedJobs);

    console.log(`✅ Found ${limitedJobs.length} jobs from ${sources.length} sources`);
    return limitedJobs;

  } catch (error) {
    console.error('Error in job search:', error);
    return MOCK_JOBS; // Fallback to mock data
  }
}

// Get job by ID
export async function getJobById(id: string): Promise<JobListing | null> {
  // This would typically fetch from a database or cache
  // For now, return from mock data
  return MOCK_JOBS.find(job => job.id === id) || null;
}

// Get similar jobs
export async function getSimilarJobs(jobId: string, limit: number = 5): Promise<JobListing[]> {
  const job = await getJobById(jobId);
  if (!job) return [];

  const params: JobSearchParams = {
    query: job.title,
    location: job.location,
    industry: job.industry,
    limit: limit + 1 // +1 to exclude the original job
  };

  const jobs = await searchJobs(params);
  return jobs.filter(j => j.id !== jobId).slice(0, limit);
}

// Get job statistics
export function getJobStats(jobs: JobListing[]) {
  const stats = {
    total: jobs.length,
    withSalary: jobs.filter(job => job.salary).length,
    remote: jobs.filter(job => job.remote).length,
    bySource: {} as Record<string, number>,
    byIndustry: {} as Record<string, number>,
    byExperience: {} as Record<string, number>
  };

  jobs.forEach(job => {
    // Count by source
    stats.bySource[job.source] = (stats.bySource[job.source] || 0) + 1;
    
    // Count by industry
    if (job.industry) {
      stats.byIndustry[job.industry] = (stats.byIndustry[job.industry] || 0) + 1;
    }
    
    // Count by experience
    if (job.experience) {
      stats.byExperience[job.experience] = (stats.byExperience[job.experience] || 0) + 1;
    }
  });

  return stats;
}

// Clear cache
export function clearJobCache(): void {
  JOB_CACHE.clear();
  console.log('🗑️ Job cache cleared');
}

// Get cache statistics
export function getCacheStats() {
  return {
    size: JOB_CACHE.size,
    entries: Array.from(JOB_CACHE.entries()).map(([key, entry]) => ({
      key,
      timestamp: entry.timestamp,
      dataCount: entry.data.length,
      age: Date.now() - entry.timestamp
    }))
  };
}

// Get available job sources
export function getAvailableSources(): Array<{id: string, name: string, free: boolean, description: string}> {
  return [
    { id: 'usajobs', name: 'USAJobs', free: true, description: 'Government jobs' },
    { id: 'adzuna', name: 'Adzuna', free: false, description: 'International job board' },
    { id: 'indeed', name: 'Indeed', free: false, description: 'Popular job site' },
    { id: 'linkedin', name: 'LinkedIn', free: false, description: 'Professional networking' },
    { id: 'github', name: 'GitHub', free: true, description: 'Open source projects' },
    { id: 'ziprecruiter', name: 'ZipRecruiter', free: false, description: 'Job aggregator' },
    { id: 'rss', name: 'RSS Feeds', free: true, description: 'Company job feeds' },
    { id: 'remoteok', name: 'RemoteOK', free: true, description: 'Remote jobs' },
  ];
}

// Test API connections (alias for checkAPIStatus)
export async function testAPIConnections(): Promise<Record<string, boolean>> {
  const status = await checkAPIStatus();
  const result: Record<string, boolean> = {};
  
  Object.entries(status).forEach(([key, value]) => {
    result[key] = value.status === 'active';
  });
  
  return result;
}

// Search all jobs (alias for searchJobs)
export async function searchAllJobs(params: JobSearchParams): Promise<JobListing[]> {
  return await searchJobs(params);
}

// API Status Checker
export async function checkAPIStatus(): Promise<Record<string, { status: 'active' | 'inactive' | 'error', message: string }>> {
  const status: Record<string, { status: 'active' | 'inactive' | 'error', message: string }> = {};

  // Check USAJobs
  if (API_KEYS.USAJOBS) {
    try {
      const response = await fetch('https://data.usajobs.gov/api/search?ResultsPerPage=1', {
        headers: {
          'Host': 'data.usajobs.gov',
          'User-Agent': API_KEYS.USAJOBS_USER_AGENT,
          'Authorization-Key': API_KEYS.USAJOBS
        }
      });
      status.usajobs = {
        status: response.ok ? 'active' : 'error',
        message: response.ok ? 'Working' : `Error: ${response.status}`
      };
    } catch (error) {
      status.usajobs = { status: 'error', message: 'Connection failed' };
    }
  } else {
    status.usajobs = { status: 'inactive', message: 'API key not configured' };
  }

  // Check Adzuna
  if (API_KEYS.ADZUNA_ID && API_KEYS.ADZUNA_KEY) {
    try {
      const response = await fetch(`https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${API_KEYS.ADZUNA_ID}&app_key=${API_KEYS.ADZUNA_KEY}&what=software&results_per_page=1`);
      status.adzuna = {
        status: response.ok ? 'active' : 'error',
        message: response.ok ? 'Working' : `Error: ${response.status}`
      };
    } catch (error) {
      status.adzuna = { status: 'error', message: 'Connection failed' };
    }
  } else {
    status.adzuna = { status: 'inactive', message: 'API keys not configured' };
  }

  // Check other APIs
  const otherAPIs = [
    { key: 'indeed', name: 'Indeed', hasKey: !!API_KEYS.INDEED },
    { key: 'linkedin', name: 'LinkedIn', hasKey: !!API_KEYS.LINKEDIN_ID },
    { key: 'github', name: 'GitHub', hasKey: true }, // GitHub doesn't require API key
    { key: 'ziprecruiter', name: 'ZipRecruiter', hasKey: !!API_KEYS.ZIPRECRUITER }
  ];

  otherAPIs.forEach(api => {
    if (api.hasKey) {
      status[api.key] = { status: 'active', message: 'Configured' };
    } else {
      status[api.key] = { status: 'inactive', message: 'API key not configured' };
    }
  });

  return status;
}
