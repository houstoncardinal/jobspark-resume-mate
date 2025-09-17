export interface PdlOptions {
  baseUrl?: string;
}

const API_KEY = import.meta.env.VITE_PDL_API_KEY as string | undefined;
const BASE_URL = (import.meta.env.VITE_PDL_BASE_URL as string | undefined) || 'https://api.peopledatalabs.com/v5';

function ensureKey() {
  if (!API_KEY) throw new Error('Missing VITE_PDL_API_KEY');
}

export async function pdlEnrichPerson(params: Record<string, string>, options?: PdlOptions) {
  ensureKey();
  const url = new URL(`${options?.baseUrl || BASE_URL}/person/enrich`);
  Object.entries(params || {}).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), {
    headers: { 'accept': 'application/json', 'x-api-key': API_KEY! },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PDL error ${res.status}: ${text}`);
  }
  return res.json();
}

export async function pdlCompanyEnrich(params: Record<string, string>, options?: PdlOptions) {
  ensureKey();
  const url = new URL(`${options?.baseUrl || BASE_URL}/company/enrich`);
  Object.entries(params || {}).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), {
    headers: { 'accept': 'application/json', 'x-api-key': API_KEY! },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PDL error ${res.status}: ${text}`);
  }
  return res.json();
}

export function isPdlConfigured() {
  return !!API_KEY;
} 