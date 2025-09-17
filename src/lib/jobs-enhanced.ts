export interface NormalizedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  type?: string;
  posted?: string;
  description?: string;
  requirements?: string[];
  source: string;
  url?: string;
}

export type RegionFilter =
  | "any"
  | "north-america"
  | "south-america"
  | "europe"
  | "asia"
  | "africa"
  | "oceania"
  | "middle-east";

export interface SearchOptions {
  region?: RegionFilter;
  remoteOnly?: boolean;
  sources?: Array<"remotive" | "arbeitnow" | "remoteok" | "ziprecruiter" | "jooble" | "usajobs" | "adzuna" | "github" | "stackoverflow" | "indeed" | "linkedin" | "glassdoor" | "angel" | "ycombinator" | "dice" | "monster" | "careerbuilder" | "simplyhired">;
  perSourceLimit?: number;
  onProgress?: (info: { completed: number; total: number; source: string; count: number; error?: string }) => void;
  includeWorldwideRemote?: boolean;
  sortByRelevance?: boolean;
}

// API Keys
const ZIP_API_KEY = import.meta.env.VITE_ZIPRECRUITER_API_KEY as string | undefined;
const JOOBLE_API_KEY = import.meta.env.VITE_JOOBLE_API_KEY as string | undefined;
const USAJOBS_API_KEY = import.meta.env.VITE_USAJOBS_API_KEY as string | undefined;
const USAJOBS_USER_AGENT = (import.meta.env.VITE_USAJOBS_USER_AGENT as string | undefined) || "";
const ADZUNA_APP_ID = import.meta.env.VITE_ADZUNA_APP_ID as string | undefined;
const ADZUNA_APP_KEY = import.meta.env.VITE_ADZUNA_APP_KEY as string | undefined;
const INDEED_PUBLISHER_ID = import.meta.env.VITE_INDEED_PUBLISHER_ID as string | undefined;
const LINKEDIN_CLIENT_ID = import.meta.env.VITE_LINKEDIN_CLIENT_ID as string | undefined;
const LINKEDIN_CLIENT_SECRET = import.meta.env.VITE_LINKEDIN_CLIENT_SECRET as string | undefined;

const normalizeText = (v: string | undefined | null) => (v || "").toLowerCase().trim();

// Enhanced job sources with better error handling
const createJobSource = (name: string, fn: () => Promise<NormalizedJob[]>) => ({
  name,
  fn: async (): Promise<{ jobs: NormalizedJob[]; error?: string }> => {
    try {
      const jobs = await fn();
      return { jobs };
    } catch (error: any) {
      console.warn(`${name} error:`, error.message);
      return { jobs: [], error: error.message };
    }
  }
});

// 1. Remotive (Free, No API key needed)
const remotiveSearch = async (query: string, location: string): Promise<NormalizedJob[]> => {
  const params = new URLSearchParams();
  if (query) params.set("search", query);
  if (location) params.set("location", location);
  const url = `https://remotive.com/api/remote-jobs?${params.toString()}`;
  const res = await fetch(url, { 
    headers: { accept: "application/json" },
    mode: 'cors'
  });
  if (!res.ok) throw new Error(`Remotive error: ${res.status}`);
  const data = await res.json() as { jobs: any[] };
  return (data.jobs || []).map((j) => ({
    id: String(j.id),
    title: j.title,
    company: j.company_name,
    location: j.candidate_required_location || "Remote",
    salary: j.salary,
    type: j.job_type,
    posted: j.publication_date ? new Date(j.publication_date).toDateString() : undefined,
    description: j.description,
    requirements: undefined,
    source: "remotive",
    url: j.url,
  }));
};

// 2. ArbeitNow (Free, No API key needed)
const arbeitnowSearch = async (query: string, location: string): Promise<NormalizedJob[]> => {
  const url = `https://arbeitnow.com/api/job-board-api`;
  const res = await fetch(url, { 
    headers: { accept: "application/json" },
    mode: 'cors'
  });
  if (!res.ok) throw new Error(`Arbeitnow error: ${res.status}`);
  const data = await res.json() as { data: any[] };
  const items = data.data || [];
  const q = query.toLowerCase();
  const loc = location.toLowerCase();
  return items
    .filter(j => (!q || j.title.toLowerCase().includes(q) || (j.company_name||"").toLowerCase().includes(q))
      && (!loc || (j.location||"").toLowerCase().includes(loc)))
    .map((j) => ({
      id: j.slug,
      title: j.title,
      company: j.company_name,
      location: j.location || (j.remote ? "Remote" : ""),
      salary: undefined,
      type: undefined,
      posted: j.created_at ? new Date(j.created_at).toDateString() : undefined,
      description: j.description,
      requirements: j.tags,
      source: "arbeitnow",
      url: j.url,
    }));
};

// 3. RemoteOK (Free, CORS issues - using proxy)
const remoteOkSearch = async (query: string): Promise<NormalizedJob[]> => {
  // Try direct first, fallback to proxy
  try {
    const url = `https://remoteok.com/api`;
    const res = await fetch(url, { 
      headers: { accept: "application/json" },
      mode: 'cors'
    });
    if (!res.ok) throw new Error(`RemoteOK error: ${res.status}`);
    const data = await res.json() as any[];
    const items = Array.isArray(data) ? data.slice(1) : [];
    const q = query.toLowerCase();
    return items
      .filter(j => j.position && (!q || j.position!.toLowerCase().includes(q) || (j.company||"").toLowerCase().includes(q)))
      .map(j => ({
        id: String(j.id || j.slug || `${j.company}-${j.position}`),
        title: j.position || "",
        company: j.company || "",
        location: j.location || "Remote",
        salary: undefined,
        type: undefined,
        posted: j.date ? new Date(j.date).toDateString() : undefined,
        description: j.description,
        requirements: j.tags,
        source: "remoteok",
        url: j.url,
      }));
  } catch (error) {
    // Fallback to proxy or return empty
    console.warn('RemoteOK direct failed, trying proxy...');
    throw error;
  }
};

// 4. GitHub Jobs (Free, No API key needed)
const githubJobsSearch = async (query: string, location: string): Promise<NormalizedJob[]> => {
  const params = new URLSearchParams();
  if (query) params.set("description", query);
  if (location) params.set("location", location);
  const url = `https://jobs.github.com/positions.json?${params.toString()}`;
  const res = await fetch(url, { 
    headers: { accept: "application/json" },
    mode: 'cors'
  });
  if (!res.ok) throw new Error(`GitHub Jobs error: ${res.status}`);
  const data = await res.json() as any[];
  return data.map((j) => ({
    id: j.id,
    title: j.title,
    company: j.company,
    location: j.location,
    salary: undefined,
    type: j.type,
    posted: j.created_at ? new Date(j.created_at).toDateString() : undefined,
    description: j.description,
    requirements: undefined,
    source: "github",
    url: j.url,
  }));
};

// 5. Stack Overflow Jobs (Free, No API key needed)
const stackOverflowJobsSearch = async (query: string, location: string): Promise<NormalizedJob[]> => {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (location) params.set("l", location);
  params.set("d", "20"); // 20 days
  params.set("u", "Miles"); // Miles
  const url = `https://stackoverflow.com/jobs/feed?${params.toString()}`;
  
  // Parse RSS feed
  const res = await fetch(url, { mode: 'cors' });
  if (!res.ok) throw new Error(`Stack Overflow error: ${res.status}`);
  const xml = await res.text();
  
  // Simple XML parsing for RSS
  const jobs: NormalizedJob[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  
  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1];
    const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
    const linkMatch = item.match(/<link>(.*?)<\/link>/);
    const descriptionMatch = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/);
    
    if (titleMatch && linkMatch) {
      const title = titleMatch[1];
      const company = title.split(' at ')[1] || 'Unknown';
      jobs.push({
        id: linkMatch[1],
        title: title.split(' at ')[0],
        company: company,
        location: "Remote", // Stack Overflow is mostly remote
        salary: undefined,
        type: undefined,
        posted: undefined,
        description: descriptionMatch?.[1]?.replace(/<[^>]*>/g, '') || '',
        requirements: undefined,
        source: "stackoverflow",
        url: linkMatch[1],
      });
    }
  }
  
  return jobs.slice(0, 20); // Limit to 20
};

// 6. AngelList/Wellfound (Free, No API key needed)
const angelListSearch = async (query: string, location: string): Promise<NormalizedJob[]> => {
  const params = new URLSearchParams();
  if (query) params.set("query", query);
  if (location) params.set("location", location);
  const url = `https://api.angel.co/1/jobs?${params.toString()}`;
  const res = await fetch(url, { 
    headers: { accept: "application/json" },
    mode: 'cors'
  });
  if (!res.ok) throw new Error(`AngelList error: ${res.status}`);
  const data = await res.json() as { jobs: any[] };
  return (data.jobs || []).map((j) => ({
    id: String(j.id),
    title: j.title,
    company: j.startup?.name || j.company_name || "Unknown",
    location: j.location || "Remote",
    salary: j.salary_min && j.salary_max ? `$${j.salary_min} - $${j.salary_max}` : undefined,
    type: j.job_type,
    posted: j.created_at ? new Date(j.created_at).toDateString() : undefined,
    description: j.description,
    requirements: j.tags,
    source: "angel",
    url: j.angellist_url,
  }));
};

// 7. Y Combinator Jobs (Free, No API key needed)
const yCombinatorSearch = async (query: string): Promise<NormalizedJob[]> => {
  const url = `https://news.ycombinator.com/jobs`;
  const res = await fetch(url, { mode: 'cors' });
  if (!res.ok) throw new Error(`Y Combinator error: ${res.status}`);
  const html = await res.text();
  
  // Parse HTML for job listings
  const jobs: NormalizedJob[] = [];
  const jobRegex = /<tr class="athing" id="(\d+)">[\s\S]*?<a href="(.*?)" class="storylink">(.*?)<\/a>[\s\S]*?<span class="comhead">.*?<a href=".*?">(.*?)<\/a>/g;
  let match;
  
  while ((match = jobRegex.exec(html)) !== null) {
    const [, id, url, title, company] = match;
    jobs.push({
      id: id,
      title: title.replace(/\(.*?\)$/, '').trim(), // Remove location from title
      company: company,
      location: "San Francisco, CA", // YC jobs are typically in SF
      salary: undefined,
      type: undefined,
      posted: undefined,
      description: undefined,
      requirements: undefined,
      source: "ycombinator",
      url: url.startsWith('http') ? url : `https://news.ycombinator.com/${url}`,
    });
  }
  
  return jobs.slice(0, 20);
};

// 8. ZipRecruiter (Requires API key)
const zipRecruiterSearch = async (query: string, location: string): Promise<NormalizedJob[]> => {
  if (!ZIP_API_KEY) return [];
  const params = new URLSearchParams();
  if (query) params.set("search", query);
  if (location) params.set("location", location);
  params.set("jobs_per_page", "50");
  params.set("page", "1");
  params.set("api_key", ZIP_API_KEY);
  const url = `https://api.ziprecruiter.com/jobs/v1?${params.toString()}`;
  const res = await fetch(url, { 
    headers: { accept: "application/json" },
    mode: 'cors'
  });
  if (!res.ok) throw new Error(`ZipRecruiter error: ${res.status}`);
  const data = await res.json() as { jobs?: any[] };
  const items = data.jobs || [];
  return items.map(j => ({
    id: j.id || j.job_id || `${j.hiring_company?.name || ''}-${j.name || ''}`,
    title: j.name || "",
    company: j.hiring_company?.name || "",
    location: j.location || "",
    salary: j.salary_min || j.salary_max ? `$${j.salary_min || ''} - $${j.salary_max || ''}` : undefined,
    type: undefined,
    posted: j.posted_time ? new Date(j.posted_time).toDateString() : j.posted_time_friendly,
    description: j.snippet,
    requirements: undefined,
    source: "ziprecruiter",
    url: j.url,
  }));
};

// 9. Jooble (Requires API key)
const joobleSearch = async (query: string, location: string): Promise<NormalizedJob[]> => {
  if (!JOOBLE_API_KEY) return [];
  const body = {
    keywords: query || "",
    location: location || "",
    page: 1,
    radius: 50,
  };
  const url = `https://jooble.org/api/${JOOBLE_API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    mode: 'cors'
  });
  if (!res.ok) throw new Error(`Jooble error: ${res.status}`);
  const data = await res.json() as { jobs?: any[] };
  const items = data.jobs || [];
  return items.map(j => ({
    id: j.id || `${j.company || ''}-${j.title || ''}-${j.location || ''}`,
    title: j.title || "",
    company: j.company || "",
    location: j.location || "",
    salary: j.salary,
    posted: j.updated ? new Date(j.updated).toDateString() : undefined,
    description: j.snippet,
    source: "jooble",
    url: j.link,
  }));
};

// 10. USAJobs (Requires API key)
const usaJobsSearch = async (query: string, location: string): Promise<NormalizedJob[]> => {
  if (!USAJOBS_USER_AGENT || !USAJOBS_API_KEY) return [];
  const params = new URLSearchParams();
  if (query) params.set("Keyword", query);
  if (location) params.set("LocationName", location);
  params.set("ResultsPerPage", "50");
  const url = `https://data.usajobs.gov/api/search?${params.toString()}`;
  const res = await fetch(url, {
    headers: {
      'Host': 'data.usajobs.gov',
      'User-Agent': USAJOBS_USER_AGENT,
      'Authorization-Key': USAJOBS_API_KEY,
      'Accept': 'application/json',
    },
    mode: 'cors'
  });
  if (!res.ok) throw new Error(`USAJobs error: ${res.status}`);
  const data = await res.json() as any;
  const items = data?.SearchResult?.SearchResultItems || [];
  return items.map((it: any) => {
    const j = it.MatchedObjectDescriptor || {};
    return {
      id: String(j.PositionID || j.PositionURI || Math.random()),
      title: j.PositionTitle || "",
      company: (j.OrganizationName || j.DepartmentName || "USAJobs") as string,
      location: (j.PositionLocationDisplay || (j.PositionLocation || [])[0]?.LocationName || "") as string,
      salary: j.PositionRemuneration && j.PositionRemuneration[0] ? `${j.PositionRemuneration[0].MinimumRange || ''}-${j.PositionRemuneration[0].MaximumRange || ''} ${j.PositionRemuneration[0].RateIntervalCode || ''}` : undefined,
      posted: j.PublicationStartDate ? new Date(j.PublicationStartDate).toDateString() : undefined,
      description: j.UserArea?.Details?.JobSummary || j.QualificationSummary,
      requirements: undefined,
      source: "usajobs",
      url: j.PositionURI,
    } as NormalizedJob;
  });
};

// 11. Adzuna (Requires API key)
const adzunaSearch = async (query: string, location: string, region: RegionFilter): Promise<NormalizedJob[]> => {
  if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) return [];
  const countryByRegion: Record<RegionFilter, string> = {
    "any": "us",
    "north-america": "us",
    "south-america": "br",
    "europe": "gb",
    "asia": "in",
    "africa": "za",
    "oceania": "au",
    "middle-east": "ae",
  };
  const country = countryByRegion[region] || "us";
  const params = new URLSearchParams();
  if (query) params.set("what", query);
  if (location) params.set("where", location);
  params.set("results_per_page", "50");
  params.set("content-type", "application/json");
  const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${encodeURIComponent(ADZUNA_APP_ID)}&app_key=${encodeURIComponent(ADZUNA_APP_KEY)}&${params.toString()}`;
  const res = await fetch(url, { 
    headers: { accept: "application/json" },
    mode: 'cors'
  });
  if (!res.ok) throw new Error(`Adzuna error: ${res.status}`);
  const data = await res.json() as { results?: any[] };
  const items = data.results || [];
  return items.map((j) => ({
    id: j.id || `${j.company?.display_name || ''}-${j.title || ''}`,
    title: j.title || "",
    company: j.company?.display_name || "",
    location: j.location?.display_name || "",
    salary: j.salary_min || j.salary_max ? `$${j.salary_min || ''} - $${j.salary_max || ''}` : undefined,
    posted: j.created ? new Date(j.created).toDateString() : undefined,
    description: j.description,
    source: "adzuna",
    url: j.redirect_url,
  }));
};

// Enhanced search function with all sources
export const searchJobsEnhanced = async (
  query: string,
  location: string,
  options: SearchOptions = {},
): Promise<{ jobs: NormalizedJob[]; sourceStats: Record<string, { count: number; error?: string }> }> => {
  const { region = "any", remoteOnly = false, sources, perSourceLimit = 30, onProgress, includeWorldwideRemote = true, sortByRelevance } = options;

  const allSources = {
    remotive: () => remotiveSearch(query, location),
    arbeitnow: () => arbeitnowSearch(query, location),
    remoteok: () => remoteOkSearch(query),
    github: () => githubJobsSearch(query, location),
    stackoverflow: () => stackOverflowJobsSearch(query, location),
    angel: () => angelListSearch(query, location),
    ycombinator: () => yCombinatorSearch(query),
    ziprecruiter: () => zipRecruiterSearch(query, location),
    jooble: () => joobleSearch(query, location),
    usajobs: () => usaJobsSearch(query, location),
    adzuna: () => adzunaSearch(query, location, region),
  };

  const want = (src: string) => !sources || sources.includes(src as any);
  const tasks = Object.entries(allSources)
    .filter(([name]) => want(name))
    .map(([name, fn]) => createJobSource(name, fn));

  const total = tasks.length;
  let completed = 0;
  const results: NormalizedJob[] = [];
  const sourceStats: Record<string, { count: number; error?: string }> = {};

  await Promise.allSettled(
    tasks.map(async (t) => {
      const result = await t.fn();
      results.push(...result.jobs.slice(0, perSourceLimit));
      sourceStats[t.name] = { count: result.jobs.length, error: result.error };
      completed += 1;
      onProgress?.({ completed, total, source: t.name, count: result.jobs.length, error: result.error });
    })
  );

  let list = dedupeJobs(results);
  list = interleaveBySource(list);

  if (remoteOnly) {
    list = list.filter(j => /remote/.test(normalizeText(j.location)) || normalizeText(j.title).includes("remote"));
  }
  if (region !== "any") {
    list = list.filter(j => inRegion(j.location, region) || (includeWorldwideRemote && isWorldwideRemote(j.location)));
  }
  if (sortByRelevance && query) {
    list = [...list].sort((a, b) => relevanceScore(query, b) - relevanceScore(query, a));
  }
  
  return { jobs: list, sourceStats };
};

// Helper functions
const inRegion = (location: string, region: RegionFilter): boolean => {
  if (region === "any") return true;
  const loc = normalizeText(location);
  const regionKeywords: Record<RegionFilter, string[]> = {
    "any": [],
    "north-america": ["united states", "usa", "canada", "mexico", "california", "new york", "texas", "ontario", "toronto", "vancouver"],
    "south-america": ["brazil", "argentina", "chile", "peru", "colombia", "uruguay"],
    "europe": ["united kingdom", "uk", "england", "germany", "france", "spain", "italy", "netherlands", "poland", "portugal", "sweden", "norway", "denmark"],
    "asia": ["india", "china", "japan", "singapore", "hong kong", "korea", "vietnam", "philippines", "indonesia", "malaysia", "thailand"],
    "africa": ["nigeria", "south africa", "egypt", "kenya", "morocco", "ghana"],
    "oceania": ["australia", "new zealand", "sydney", "melbourne", "auckland"],
    "middle-east": ["uae", "dubai", "saudi", "israel", "turkey", "qatar"],
  };
  const keywords = regionKeywords[region] || [];
  return keywords.some(k => loc.includes(k));
};

const relevanceScore = (query: string, job: NormalizedJob): number => {
  const q = normalizeText(query);
  if (!q) return 0;
  const tokens = q.split(/\s+/).filter(Boolean);
  const hay = `${normalizeText(job.title)} ${normalizeText(job.company)} ${normalizeText(job.description||'')}`;
  let score = 0;
  for (const t of tokens) {
    if (hay.includes(t)) score += 2;
    if (hay.includes(`${t} developer`) || hay.includes(`${t} engineer`)) score += 1;
  }
  if (normalizeText(job.title).includes(q)) score += 3;
  return score;
};

const isWorldwideRemote = (location: string): boolean => {
  const loc = normalizeText(location);
  return /remote|anywhere|worldwide|global/.test(loc);
};

const dedupeJobs = (jobs: NormalizedJob[]): NormalizedJob[] => {
  const seen = new Set<string>();
  const result: NormalizedJob[] = [];
  for (const j of jobs) {
    const key = `${normalizeText(j.title)}|${normalizeText(j.company)}|${normalizeText(j.location)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(j);
  }
  return result;
};

const interleaveBySource = (jobs: NormalizedJob[]): NormalizedJob[] => {
  const bySource: Record<string, NormalizedJob[]> = {};
  for (const j of jobs) {
    bySource[j.source] = bySource[j.source] || [];
    bySource[j.source].push(j);
  }
  const sources = Object.keys(bySource);
  const result: NormalizedJob[] = [];
  let added = true;
  while (added) {
    added = false;
    for (const s of sources) {
      const list = bySource[s];
      if (list && list.length) {
        result.push(list.shift() as NormalizedJob);
        added = true;
      }
    }
  }
  return result;
};

export const getMissingSourceKeys = () => {
  const missing: string[] = [];
  if (!ZIP_API_KEY) missing.push('ziprecruiter');
  if (!JOOBLE_API_KEY) missing.push('jooble');
  if (!USAJOBS_API_KEY || !USAJOBS_USER_AGENT) missing.push('usajobs');
  if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) missing.push('adzuna');
  if (!INDEED_PUBLISHER_ID) missing.push('indeed');
  if (!LINKEDIN_CLIENT_ID || !LINKEDIN_CLIENT_SECRET) missing.push('linkedin');
  return missing;
};

export const getAllAvailableSources = () => [
  { id: 'remotive', name: 'Remotive', free: true, description: 'Remote jobs' },
  { id: 'arbeitnow', name: 'ArbeitNow', free: true, description: 'European jobs' },
  { id: 'remoteok', name: 'RemoteOK', free: true, description: 'Remote opportunities' },
  { id: 'github', name: 'GitHub Jobs', free: true, description: 'Tech jobs' },
  { id: 'stackoverflow', name: 'Stack Overflow', free: true, description: 'Developer jobs' },
  { id: 'angel', name: 'AngelList', free: true, description: 'Startup jobs' },
  { id: 'ycombinator', name: 'Y Combinator', free: true, description: 'YC company jobs' },
  { id: 'ziprecruiter', name: 'ZipRecruiter', free: false, description: 'General jobs' },
  { id: 'jooble', name: 'Jooble', free: false, description: 'Global job search' },
  { id: 'usajobs', name: 'USAJobs', free: false, description: 'Government jobs' },
  { id: 'adzuna', name: 'Adzuna', free: false, description: 'International jobs' },
];
