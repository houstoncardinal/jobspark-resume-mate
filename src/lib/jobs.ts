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

const ZIP_API_KEY = import.meta.env.VITE_ZIPRECRUITER_API_KEY as string | undefined;

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

export const searchJobs = async (
  query: string,
  location: string,
  options: SearchOptions = {},
): Promise<NormalizedJob[]> => {
  const { region = "any", remoteOnly = false } = options;
  let combined: NormalizedJob[] = [];
  try {
    const results = await remotiveSearch(query, location);
    combined = combined.concat(results);
  } catch {}
  try {
    const fallback = await arbeitnowSearch(query, location);
    combined = combined.concat(fallback);
  } catch {}
  try {
    const r = await remoteOkSearch(query);
    combined = combined.concat(r);
  } catch {}
  try {
    const zr = await zipRecruiterSearch(query, location);
    combined = combined.concat(zr);
  } catch {}

  let list = dedupeJobs(combined);
  if (remoteOnly) {
    list = list.filter(j => /remote/.test(normalizeText(j.location)) || normalizeText(j.title).includes("remote"));
  }
  if (region !== "any") {
    list = list.filter(j => inRegion(j.location, region));
  }
  return list;
}; 