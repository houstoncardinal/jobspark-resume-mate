import { chatComplete } from "@/lib/ai";
import type { NormalizedJob } from "@/lib/jobs";

export type AnnotationCategory = "keywords" | "impact" | "format" | "redundancy" | "clarity" | "grammar";

export interface AnnotationSpan {
  start: number; // inclusive char index
  end: number;   // exclusive char index
  category: AnnotationCategory;
  message: string;
  suggestion: string; // human readable suggestion
  replacement?: string; // optional suggested replacement text
}

const safeParse = (text: string): AnnotationSpan[] | null => {
  try {
    const arr = JSON.parse(text);
    if (Array.isArray(arr)) return arr as AnnotationSpan[];
    return null;
  } catch {
    return null;
  }
};

export async function analyzeResumeTextForAnnotations(job: NormalizedJob | null, resumeText: string): Promise<AnnotationSpan[]> {
  const system = { role: "system", content: "You are a precise resume editor that returns span-level annotations for improvements. Always return STRICT minified JSON array of annotations." } as const;
  const jobCtx = job ? `Job: ${job.title} at ${job.company}\nReq: ${(job.requirements||[]).join(', ')}\nDesc: ${(job.description||'').replace(/<[^>]+>/g,' ')}` : "Job: (none)";
  const user = {
    role: "user",
    content: `Text to annotate (UTF-16 indices):\n${resumeText}\n---\n${jobCtx}\nReturn ONLY a minified JSON array of objects: {start:number,end:number,category:'keywords'|'impact'|'format'|'redundancy'|'clarity'|'grammar',message:string,suggestion:string,replacement?:string}. Use non-overlapping spans. Focus on: missing keywords aligned to job, weak bullets (lack impact/metrics), formatting issues, redundancies, unclear statements, and grammar. Keep spans short (phrases or single bullet lines).`
  } as const;
  const content = await chatComplete([system as any, user as any], { temperature: 0.2, maxTokens: 1400 });
  const parsed = safeParse(content);
  return parsed || [];
} 