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
  sources?: Array<"remotive" | "arbeitnow" | "remoteok" | "ziprecruiter" | "jooble" | "usajobs">;
  perSourceLimit?: number;
  onProgress?: (info: { completed: number; total: number; source: string; count: number }) => void;
  includeWorldwideRemote?: boolean;
}

interface RemotiveJob {
  id: number;
  title: string;
  company_name: string;
  candidate_required_location: string;
  salary?: string;
  job_type?: string;
  publication_date?: string;
  description?: string;
  url: string;
}

interface ArbeitNowJob {
  slug: string;
  title: string;
  company_name: string;
  location?: string;
  tags?: string[];
  created_at?: string;
  remote?: boolean;
  url: string;
  description?: string;
}

interface RemoteOkJob {
  id?: number;
  slug?: string;
  date?: string;
  company?: string;
  position?: string;
  tags?: string[];
  location?: string;
  url?: string;
  description?: string;
}

interface ZipRecruiterJob {
  id?: string;
  job_id?: string;
  name?: string;
  hiring_company?: { name?: string };
  location?: string;
  posted_time_friendly?: string;
  posted_time?: string;
  snippet?: string;
  url?: string;
  salary_min?: number;
  salary_max?: number;
}

interface JoobleResponse {
  jobs?: Array<{
    id?: string;
    title?: string;
    company?: string;
    location?: string;
    updated?: string;
    salary?: string;
    link?: string;
    snippet?: string;
  }>;
}

const ZIP_API_KEY = import.meta.env.VITE_ZIPRECRUITER_API_KEY as string | undefined;
const JOOBLE_API_KEY = import.meta.env.VITE_JOOBLE_API_KEY as string | undefined;
const USAJOBS_API_KEY = import.meta.env.VITE_USAJOBS_API_KEY as string | undefined;
const USAJOBS_USER_AGENT = (import.meta.env.VITE_USAJOBS_USER_AGENT as string | undefined) || "";

const normalizeText = (v: string | undefined | null) => (v || "").toLowerCase().trim();

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

const isWorldwideRemote = (location: string): boolean => {
  const loc = normalizeText(location);
  return /remote|anywhere|worldwide|global/.test(loc);
};

const remotiveSearch = async (query: string, location: string): Promise<NormalizedJob[]> => {
  const params = new URLSearchParams();
  if (query) params.set("search", query);
  if (location) params.set("location", location);
  const url = `https://remotive.com/api/remote-jobs?${params.toString()}`;
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`Remotive error: ${res.status}`);
  const data = await res.json() as { jobs: RemotiveJob[] };
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

const arbeitnowSearch = async (query: string, location: string): Promise<NormalizedJob[]> => {
  const url = `https://arbeitnow.com/api/job-board-api`;
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`Arbeitnow error: ${res.status}`);
  const data = await res.json() as { data: ArbeitNowJob[] };
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

const remoteOkSearch = async (query: string): Promise<NormalizedJob[]> => {
  const url = `https://remoteok.com/api`;
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`RemoteOK error: ${res.status}`);
  const data = await res.json() as RemoteOkJob[];
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
};

const zipRecruiterSearch = async (query: string, location: string): Promise<NormalizedJob[]> => {
  if (!ZIP_API_KEY) return [];
  const params = new URLSearchParams();
  if (query) params.set("search", query);
  if (location) params.set("location", location);
  params.set("jobs_per_page", "50");
  params.set("page", "1");
  params.set("api_key", ZIP_API_KEY);
  const url = `https://api.ziprecruiter.com/jobs/v1?${params.toString()}`;
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`ZipRecruiter error: ${res.status}`);
  const data = await res.json() as { jobs?: ZipRecruiterJob[] };
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

const joobleSearch = async (query: string, location: string): Promise<NormalizedJob[]> => {
  if (!JOOBLE_API_KEY) return [];
  const body = {
    keywords: query || "",
    location: location || "",
    page: 1,
    radius: 50,
  } as any;
  const url = `https://jooble.org/api/${JOOBLE_API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Jooble error: ${res.status}`);
  const data = await res.json() as JoobleResponse;
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

export const searchJobs = async (
  query: string,
  location: string,
  options: SearchOptions = {},
): Promise<NormalizedJob[]> => {
  const { region = "any", remoteOnly = false, sources, perSourceLimit = 30, onProgress, includeWorldwideRemote = true } = options;

  const want = (src: string) => !sources || sources.includes(src as any);
  const tasks: Array<{ name: string; fn: () => Promise<NormalizedJob[]> }> = [];
  if (want("remotive")) tasks.push({ name: "remotive", fn: () => remotiveSearch(query, location) });
  if (want("arbeitnow")) tasks.push({ name: "arbeitnow", fn: () => arbeitnowSearch(query, location) });
  if (want("remoteok")) tasks.push({ name: "remoteok", fn: () => remoteOkSearch(query) });
  if (want("ziprecruiter")) tasks.push({ name: "ziprecruiter", fn: () => zipRecruiterSearch(query, location) });
  if (want("jooble")) tasks.push({ name: "jooble", fn: () => joobleSearch(query, location) });
  if (want("usajobs")) tasks.push({ name: "usajobs", fn: () => usaJobsSearch(query, location) });

  const total = tasks.length;
  let completed = 0;
  const results: NormalizedJob[] = [];

  await Promise.allSettled(
    tasks.map(async (t) => {
      try {
        const part = (await t.fn()).slice(0, perSourceLimit);
        results.push(...part);
        completed += 1;
        onProgress?.({ completed, total, source: t.name, count: part.length });
      } catch {
        completed += 1;
        onProgress?.({ completed, total, source: t.name, count: 0 });
      }
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
  return list;
}; 