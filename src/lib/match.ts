import type { NormalizedJob } from "@/lib/jobs";

export interface MatchResult {
  overallMatchPercent: number;
  atsCompatibilityPercent: number;
  keywordsMatchPercent: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendedKeywords: string[];
}

const normalize = (text: string) =>
  (text || "")
    .toLowerCase()
    .replace(/<[^>]+>/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const tokenize = (text: string) => normalize(text).split(" ").filter(Boolean);

const stopwords = new Set([
  "and","or","the","a","an","to","of","in","for","on","with","by","at","as","is","are","be","this","that","from","over","into","about","your","our","their"
]);

export const extractJobKeywords = (job: NormalizedJob, max = 25): string[] => {
  const source = `${job.title || ""} ${job.description || ""} ${(job.requirements || []).join(" ")}`;
  const tokens = tokenize(source).filter(w => !stopwords.has(w) && w.length > 2);
  const freq: Record<string, number> = {};
  for (const w of tokens) freq[w] = (freq[w] || 0) + 1;
  const sorted = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .map(([w]) => w);
  // Prefer provided requirements first
  const reqs = (job.requirements || []).map(normalize);
  const deduped = Array.from(new Set([...reqs, ...sorted]));
  return deduped.slice(0, max);
};

export const computeMatch = (resumeText: string, job: NormalizedJob): MatchResult => {
  const resumeTokens = new Set(tokenize(resumeText).filter(w => !stopwords.has(w)));
  const jobKeywords = extractJobKeywords(job, 40);
  const matched: string[] = [];
  const missing: string[] = [];
  for (const kw of jobKeywords) {
    if (resumeTokens.has(kw)) matched.push(kw); else missing.push(kw);
  }
  const keywordsMatchPercent = jobKeywords.length ? Math.round((matched.length / jobKeywords.length) * 100) : 0;
  // Simple heuristics for ATS: presence of sections and bullet points
  const atsSignals = [
    /experience/i.test(resumeText),
    /education/i.test(resumeText),
    /skills?/i.test(resumeText),
    /\n\s*•|\n\s*-/i.test(resumeText),
  ];
  const atsCompatibilityPercent = Math.round((atsSignals.filter(Boolean).length / atsSignals.length) * 100);
  // Overall weighted score
  const overallMatchPercent = Math.round(0.7 * keywordsMatchPercent + 0.3 * atsCompatibilityPercent);
  const recommendedKeywords = missing.slice(0, 15);
  return {
    overallMatchPercent,
    atsCompatibilityPercent,
    keywordsMatchPercent,
    matchedKeywords: matched,
    missingKeywords: missing,
    recommendedKeywords,
  };
}; 