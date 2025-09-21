import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const pdlApiKey = Deno.env.get('PDL_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface JobListing {
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

interface JobSearchParams {
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
  aiEnhanced?: boolean;
  userProfile?: {
    skills?: string[];
    experience?: string;
    preferences?: any;
  };
}

// Enhanced job search with AI analysis
async function enhancedJobSearch(params: JobSearchParams): Promise<JobListing[]> {
  console.log('🤖 Starting AI-Enhanced Job Search:', params);

  // First, get jobs from multiple sources
  const jobs = await aggregateJobs(params);
  
  if (!params.aiEnhanced || !openAIApiKey) {
    return jobs;
  }

  // AI Enhancement: Analyze and rank jobs based on user profile
  try {
    const enhancedJobs = await analyzeJobsWithAI(jobs, params);
    return enhancedJobs;
  } catch (error) {
    console.error('AI enhancement error:', error);
    return jobs; // Fallback to regular jobs if AI fails
  }
}

async function aggregateJobs(params: JobSearchParams): Promise<JobListing[]> {
  const allJobs: JobListing[] = [];
  const sources = params.sources || ['usajobs', 'remoteok', 'adzuna', 'linkedin', 'indeed', 'github', 'ziprecruiter', 'rss'];
  
  console.log(`🔍 Starting aggregation from ${sources.length} sources:`, sources);

  const searchPromises = sources.map(source => searchJobSource(source, params));
  
  try {
    const results = await Promise.allSettled(searchPromises);
    
    results.forEach((result, index) => {
      const sourceName = sources[index];
      if (result.status === 'fulfilled') {
        const jobs = result.value;
        if (jobs.length > 0) {
          allJobs.push(...jobs);
          console.log(`✅ ${sourceName}: ${jobs.length} jobs found`);
        } else {
          console.log(`⚠️ ${sourceName}: 0 jobs found (may need API keys or different query)`);
        }
      } else {
        console.error(`❌ ${sourceName} failed:`, result.reason);
      }
    });

    // Remove duplicates based on title + company combination
    const uniqueJobs = allJobs.filter((job, index, self) => 
      index === self.findIndex(j => 
        j.title.toLowerCase() === job.title.toLowerCase() && 
        j.company.toLowerCase() === job.company.toLowerCase()
      )
    );

    console.log(`📊 Aggregation complete:`);
    console.log(`   Total jobs collected: ${allJobs.length}`);
    console.log(`   Unique jobs after dedup: ${uniqueJobs.length}`);
    console.log(`   Sources attempted: ${sources.length}`);
    
    // Group by source for detailed reporting
    const bySource = allJobs.reduce((acc: Record<string, number>, job) => {
      const source = job.source || 'unknown';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {});
    console.log(`   Jobs by source:`, bySource);
    
    return uniqueJobs.slice(0, params.limit || 50);
  } catch (error) {
    console.error('Job aggregation error:', error);
    return [];
  }
}

async function searchJobSource(source: string, params: JobSearchParams): Promise<JobListing[]> {
  console.log(`🔍 Searching ${source} with query: "${params.query || 'any'}" location: "${params.location || 'any'}"`);
  
  switch (source) {
    case 'usajobs':
      return await searchUSAJobs(params);
    case 'remoteok':
      return await searchRemoteOK(params);
    case 'adzuna':
      return await searchAdzuna(params);
    case 'linkedin':
      return await searchLinkedIn(params);
    case 'indeed':
      return await searchIndeed(params);
    case 'github':
      return await searchGitHub(params);
    case 'ziprecruiter':
      return await searchZipRecruiter(params);
    case 'rss':
      return await searchRSS(params);
    default:
      console.log(`⚠️ Unknown source: ${source}`);
      return [];
  }
}

// USAJobs API
async function searchUSAJobs(params: JobSearchParams): Promise<JobListing[]> {
  try {
    const searchParams = new URLSearchParams({
      Keyword: params.query || '',
      LocationName: params.location || '',
      ResultsPerPage: '25',
    });

    const response = await fetch(`https://data.usajobs.gov/api/search?${searchParams}`, {
      headers: {
        'Host': 'data.usajobs.gov',
        'User-Agent': 'Gigm8 Job Search Platform (contact@gigm8.com)',
        'Authorization-Key': Deno.env.get('USAJOBS_API_KEY') || '',
      },
    });

    if (!response.ok) return [];

    const data = await response.json();
    
    return data.SearchResult?.SearchResultItems?.map((job: any) => ({
      id: `usajobs-${job.MatchedObjectId}`,
      title: job.MatchedObjectDescriptor?.PositionTitle || 'Government Position',
      company: job.MatchedObjectDescriptor?.OrganizationName || 'U.S. Government',
      location: job.MatchedObjectDescriptor?.PositionLocationDisplay || 'Various Locations',
      description: job.MatchedObjectDescriptor?.UserArea?.Details?.JobSummary || '',
      source: 'USAJobs',
      url: job.MatchedObjectDescriptor?.ApplyURI?.[0] || '',
      type: 'Full-time',
      posted: job.MatchedObjectDescriptor?.PublicationStartDate,
      remote: job.MatchedObjectDescriptor?.PositionLocationDisplay?.toLowerCase().includes('remote') || false,
    })) || [];
  } catch (error) {
    console.error('USAJobs error:', error);
    return [];
  }
}

// RemoteOK API
async function searchRemoteOK(params: JobSearchParams): Promise<JobListing[]> {
  try {
    const response = await fetch('https://remoteok.io/api');
    if (!response.ok) return [];

    const data = await response.json();
    
    return data.slice(1).filter((job: any) => 
      !params.query || 
      job.position?.toLowerCase().includes(params.query.toLowerCase()) ||
      job.company?.toLowerCase().includes(params.query.toLowerCase())
    ).slice(0, 25).map((job: any) => ({
      id: `remoteok-${job.id}`,
      title: job.position || 'Remote Position',
      company: job.company || 'Unknown Company',
      location: 'Remote',
      description: job.description || '',
      source: 'RemoteOK',
      url: job.url || '',
      type: job.contract ? 'Contract' : 'Full-time',
      posted: job.date,
      remote: true,
      salary: job.salary_min || job.salary_max ? {
        min: job.salary_min,
        max: job.salary_max,
        currency: 'USD',
      } : undefined,
    }));
  } catch (error) {
    console.error('RemoteOK error:', error);
    return [];
  }
}

// Adzuna API
async function searchAdzuna(params: JobSearchParams): Promise<JobListing[]> {
  const adzunaId = Deno.env.get('ADZUNA_APP_ID');
  const adzunaKey = Deno.env.get('ADZUNA_APP_KEY');
  
  if (!adzunaId || !adzunaKey) return [];

  try {
    const searchParams = new URLSearchParams({
      app_id: adzunaId,
      app_key: adzunaKey,
      what: params.query || '',
      where: params.location || '',
      results_per_page: '25',
    });

    const response = await fetch(`https://api.adzuna.com/v1/api/jobs/us/search/1?${searchParams}`);
    if (!response.ok) return [];

    const data = await response.json();
    
    return data.results?.map((job: any) => ({
      id: `adzuna-${job.id}`,
      title: job.title || 'Job Position',
      company: job.company?.display_name || 'Unknown Company',
      location: job.location?.display_name || 'Unknown Location',
      description: job.description || '',
      source: 'Adzuna',
      url: job.redirect_url || '',
      type: job.contract_type || 'Full-time',
      posted: job.created,
      remote: job.remote || false,
      salary: job.salary_min || job.salary_max ? {
        min: job.salary_min,
        max: job.salary_max,
        currency: 'USD',
      } : undefined,
    })) || [];
  } catch (error) {
    console.error('Adzuna error:', error);
    return [];
  }
}

// LinkedIn API (simplified - requires OAuth)
async function searchLinkedIn(params: JobSearchParams): Promise<JobListing[]> {
  // LinkedIn API requires proper OAuth setup and approval
  // For now, return empty but log the attempt
  console.log('🔗 LinkedIn: API requires OAuth approval - returning empty');
  return [];
}

// Indeed API (simplified - requires approval)
async function searchIndeed(params: JobSearchParams): Promise<JobListing[]> {
  // Indeed API requires approval and proper setup
  // For now, return empty but log the attempt
  console.log('🔗 Indeed: API requires approval - returning empty');
  return [];
}

// GitHub Jobs API (mock implementation)
async function searchGitHub(params: JobSearchParams): Promise<JobListing[]> {
  // GitHub Jobs API was discontinued, but we can search GitHub issues/repos
  console.log('🔗 GitHub: Jobs API discontinued - returning empty');
  return [];
}

// ZipRecruiter API (mock implementation)
async function searchZipRecruiter(params: JobSearchParams): Promise<JobListing[]> {
  // ZipRecruiter API requires approval
  console.log('🔗 ZipRecruiter: API requires approval - returning empty');
  return [];
}

// RSS Jobs (mock implementation)
async function searchRSS(params: JobSearchParams): Promise<JobListing[]> {
  // Could implement RSS feed parsing for various job sites
  console.log('🔗 RSS: Not implemented yet - returning empty');
  return [];
}

async function analyzeJobsWithAI(jobs: JobListing[], params: JobSearchParams): Promise<JobListing[]> {
  if (!openAIApiKey) return jobs;

  try {
    const userProfile = params.userProfile || {};
    const jobsText = jobs.slice(0, 10).map(job => 
      `Title: ${job.title}\nCompany: ${job.company}\nLocation: ${job.location}\nDescription: ${job.description?.substring(0, 200)}...`
    ).join('\n\n');

    const prompt = `As a job matching AI, analyze these jobs for a candidate with:
    Skills: ${userProfile.skills?.join(', ') || 'Not specified'}
    Experience Level: ${userProfile.experience || 'Not specified'}
    Query: ${params.query || 'General search'}

    Jobs to analyze:
    ${jobsText}

    For each job, provide a match score (0-100) and brief reason. Format as JSON array:
    [{"jobIndex": 0, "matchScore": 85, "reason": "Strong match because..."}]`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert job matching AI. Always respond with valid JSON.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status);
      return jobs;
    }

    const aiData = await response.json();
    const analysis = JSON.parse(aiData.choices[0].message.content);

    // Add AI scores to jobs and sort by match score
    const enhancedJobs = jobs.map((job, index) => {
      const aiMatch = analysis.find((a: any) => a.jobIndex === index);
      return {
        ...job,
        aiScore: aiMatch?.matchScore || 0,
        aiReason: aiMatch?.reason || '',
      };
    });

    return enhancedJobs.sort((a: any, b: any) => (b.aiScore || 0) - (a.aiScore || 0));

  } catch (error) {
    console.error('AI analysis error:', error);
    return jobs;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const params: JobSearchParams = await req.json();
    
    console.log('🔍 AI Job Search Request received:', {
      query: params.query || 'any',
      location: params.location || 'any',
      sources: params.sources || [],
      sourcesCount: params.sources?.length || 0,
      aiEnhanced: params.aiEnhanced,
      limit: params.limit || 50
    });

    const results = await enhancedJobSearch(params);

    console.log('📊 Final Results Summary:', {
      totalJobs: results.length,
      uniqueSources: [...new Set(results.map(job => job.source))],
      aiEnhanced: params.aiEnhanced && !!openAIApiKey
    });

    return new Response(JSON.stringify({
      success: true,
      jobs: results,
      totalCount: results.length,
      aiEnhanced: params.aiEnhanced && !!openAIApiKey,
      sourcesUsed: [...new Set(results.map(job => job.source))],
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('AI Job Search Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      jobs: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});