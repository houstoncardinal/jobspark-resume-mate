import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Wand2, FileText, Building2, Highlighter as HighlighterIcon, RefreshCw } from "lucide-react";
import { chatComplete } from "@/lib/ai";
import type { NormalizedJob } from "@/lib/jobs";
import { analyzeResumeTextForAnnotations, type AnnotationSpan } from "@/lib/annotation";
import { ResumeHighlighter } from "@/components/ResumeHighlighter";
import { setSeo, injectJsonLd } from "@/lib/seo";

const getPersistedJob = (): NormalizedJob | null => {
  try {
    const raw = localStorage.getItem("selectedJob");
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

const persistJob = (job: NormalizedJob | null) => {
  if (!job) return localStorage.removeItem("selectedJob");
  localStorage.setItem("selectedJob", JSON.stringify(job));
};

const ResumeBuilder = () => {
  const [job, setJob] = useState<NormalizedJob | null>(getPersistedJob());
  const [resumeText, setResumeText] = useState("");
  const [aiOutput, setAiOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobUrl, setJobUrl] = useState("");
  const [annotations, setAnnotations] = useState<AnnotationSpan[]>([]);
  const [isAnnotating, setIsAnnotating] = useState(false);

  useEffect(() => {
    setSeo({
      title: "AI Resume Builder — Gigm8",
      description: "Build and tailor your resume with AI in real time. Highlight improvements, fix issues, and generate a tailored version for any job.",
      canonical: "https://jobspark.app/builder",
    });
    injectJsonLd('jsonld-app', {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Gigm8 Resume Builder",
      "applicationCategory": "WebApplication",
      "operatingSystem": "Any",
      "url": "https://jobspark.app/builder"
    });
  }, []);

  useEffect(() => { persistJob(job); }, [job]);

  useEffect(() => {
    const handler = (e: any) => {
      const text = e?.detail?.text || "";
      setResumeText(text);
    };
    window.addEventListener("resume-text-updated", handler as any);
    return () => window.removeEventListener("resume-text-updated", handler as any);
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setAiOutput("");
    try {
      const system = { role: "system", content: "You are an expert resume writer and ATS optimization assistant." } as const;
      const user = { role: "user", content: `Create a tailored resume.\nJob: ${job?.title || 'N/A'} at ${job?.company || 'N/A'}\nLocation: ${job?.location || ''}\nRequirements: ${(job?.requirements||[]).join(', ')}\nDescription: ${(job?.description||'').replace(/<[^>]+>/g, ' ')}\n---\nResume Text:\n${resumeText}\n---\nInstructions: Rewrite the resume to align with the job while keeping truthful experience. Improve ATS formatting, add missing but relevant skills from the requirements if plausible, and optimize keywords. Return a clean resume in plain text with clear sections.` } as const;
      const content = await chatComplete([system as any, user] as any, { temperature: 0.6, maxTokens: 1800 });
      setAiOutput(content);
    } catch (e: any) {
      setAiOutput(`Error: ${e?.message || 'Failed to generate'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const runAnnotations = async () => {
    if (!resumeText.trim()) return;
    setIsAnnotating(true);
    try {
      const anns = await analyzeResumeTextForAnnotations(job, resumeText);
      setAnnotations(anns);
    } catch {
      setAnnotations([]);
    } finally {
      setIsAnnotating(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => { if (resumeText.trim()) runAnnotations(); }, 500);
    return () => clearTimeout(t);
  }, [resumeText, job]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="text-center mb-2">
          <h1 className="text-3xl font-bold">AI Resume Builder</h1>
          <p className="text-muted-foreground">Use with a selected job or standalone</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" /> Target Job</CardTitle>
            <CardDescription>Select a job from search and it will appear here automatically.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {job ? (
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <div className="font-medium truncate">{job.title}</div>
                  <div className="text-sm text-muted-foreground truncate">{job.company} • {job.location || 'Remote'}</div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {(job.requirements||[]).slice(0,6).map((r,i)=>(<Badge key={i} variant="secondary">{r}</Badge>))}
                  </div>
                </div>
                <Button variant="outline" onClick={() => setJob(null)} className="w-full sm:w-auto">Clear</Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">No job selected. Select one in Job Search and it will be saved here.</div>
                <div className="flex gap-2 flex-col sm:flex-row">
                  <Input placeholder="Optional: paste job URL for context" value={jobUrl} onChange={(e)=>setJobUrl(e.target.value)} className="w-full" />
                  <Button variant="outline" disabled className="w-full sm:w-auto">Fetch</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Your Resume</CardTitle>
            <CardDescription>Paste your resume text. The AI highlighter will annotate issues in color.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Textarea value={resumeText} onChange={(e)=>setResumeText(e.target.value)} className="min-h-[240px]" placeholder="Paste your resume..." />
                <div className="flex gap-2 flex-col sm:flex-row">
                  <Button onClick={runAnnotations} disabled={isAnnotating} className="w-full sm:w-auto">
                    {isAnnotating ? (<><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Analyzing...</>) : (<><HighlighterIcon className="h-4 w-4 mr-2" />Highlight Improvements</>)}
                  </Button>
                  <Button onClick={handleGenerate} disabled={isGenerating || !resumeText} className="w-full sm:w-auto">
                    <Wand2 className="h-4 w-4 mr-2" /> {isGenerating ? 'Generating...' : 'Generate Tailored Resume'}
                  </Button>
                </div>
              </div>
              <div className="border rounded-md p-2 overflow-auto max-h-[60vh]">
                <ResumeHighlighter text={resumeText} annotations={annotations} onChange={setResumeText} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Output</CardTitle>
            <CardDescription>Copy and refine as needed</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea value={aiOutput} onChange={(e)=>setAiOutput(e.target.value)} className="min-h-[400px] font-mono text-sm" placeholder="Your AI-tailored resume will appear here" />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ResumeBuilder; 