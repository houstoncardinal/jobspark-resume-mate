import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wand2, FileText, Building2, Highlighter as HighlighterIcon, RefreshCw, Upload, Scissors, List, AlignJustify, Sparkles } from "lucide-react";
import { chatComplete } from "@/lib/ai";
import { isPdlConfigured, pdlEnrichPerson } from "@/lib/pdl";
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
  const [activeMode, setActiveMode] = useState<"edit" | "create">("edit");
  const [createForm, setCreateForm] = useState({
    fullName: "",
    headline: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    experience: "",
    education: "",
    skills: "",
  });
  const [enrichQuery, setEnrichQuery] = useState("");
  const [isEnriching, setIsEnriching] = useState(false);
  const [template, setTemplate] = useState<'modern' | 'classic' | 'minimal'>('modern');
  const [libraryName, setLibraryName] = useState("");
  const [library, setLibrary] = useState<Array<{ name: string; content: string; updatedAt: number }>>([]);

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

  // Persist editor text locally for continuity
  useEffect(() => {
    try {
      const saved = localStorage.getItem("builderResumeText");
      if (saved && !resumeText) setResumeText(saved);
      const libRaw = localStorage.getItem('resumeLibrary');
      if (libRaw) setLibrary(JSON.parse(libRaw));
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const t = setTimeout(() => { try { localStorage.setItem("builderResumeText", resumeText); } catch {} }, 300);
    return () => clearTimeout(t);
  }, [resumeText]);
  useEffect(() => {
    try { localStorage.setItem('resumeLibrary', JSON.stringify(library)); } catch {}
  }, [library]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setAiOutput("");
    try {
      const system = { role: "system", content: "You are an expert resume writer and ATS optimization assistant." } as const;
      const user = { role: "user", content: `Create a tailored resume.
Job: ${job?.title || 'N/A'} at ${job?.company || 'N/A'}
Location: ${job?.location || ''}
Requirements: ${(job?.requirements||[]).join(', ')}
Description: ${(job?.description||'').replace(/<[^>]+>/g, ' ')}
---
Resume Text:
${resumeText}
---
Instructions: Rewrite the resume to align with the job while keeping truthful experience. Improve ATS formatting, add missing but relevant skills from the requirements if plausible, and optimize keywords. Return a clean resume in plain text with clear sections.` } as const;
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

  const handleQuickApply = async () => {
    if (!resumeText.trim() || !job) return;
    setIsGenerating(true);
    setAiOutput("");
    try {
      const system = { role: "system", content: "You are an expert resume writer. Tailor the provided resume to the target job without inventing new roles. Improve impact, quantify achievements, align keywords, keep truthful details." } as const;
      const user = { role: "user", content: `Original Resume:
${resumeText}

Target Job:
${job.title} at ${job.company}
Location: ${job.location || ''}
Requirements: ${(job?.requirements||[]).join(', ')}
Description: ${(job?.description||'').replace(/<[^>]+>/g,' ')}

Return: A tailored resume in clean plain text with strong section headers and succinct bullets.` } as const;
      const content = await chatComplete([system as any, user] as any, { temperature: 0.5, maxTokens: 1800 });
      setAiOutput(content);
      setResumeText(content);
    } catch (e: any) {
      setAiOutput(`Error: ${e?.message || 'Failed to tailor'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const normalizeSpacing = () => {
    setResumeText(prev => prev.replace(/\s+$/gm, "").replace(/\n{3,}/g, "\n\n"));
  };
  const bulletify = () => {
    setResumeText(prev => prev.split("\n").map(line => {
      if (!line.trim()) return line;
      if (/^[\u2022\-\*]/.test(line.trim())) return line;
      return `• ${line.trim()}`;
    }).join("\n"));
  };
  const sectionize = () => {
    setResumeText(prev => prev.replace(/^(summary|experience|education|skills|projects|certifications)\b/gi, (m) => m.toUpperCase()));
  };
  const copyResume = async () => { try { await navigator.clipboard.writeText(resumeText); } catch {} };
  const copyOutput = async () => { try { await navigator.clipboard.writeText(aiOutput); } catch {} };
  const exportTxt = () => {
    const blob = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `resume-${Date.now()}.txt`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };
  const exportDocx = async () => {
    try {
      // Load docx UMD bundle from CDN at runtime
      // @ts-ignore
      const docx = await import(/* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/docx@8.5.0/build/index.umd.js');
      const { Document, Paragraph, Packer } = (docx as any);
      const lines = (resumeText || '').split('\n');
      const children = lines.map((l: string) => new Paragraph({ text: l }));
      const doc = new Document({ sections: [{ properties: {}, children }] });
      const blob = await Packer.toBlob(doc);
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `resume-${Date.now()}.docx`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    } catch (e) {
      console.error(e);
    }
  };
  const printPdf = () => {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<html><head><title>Resume</title><style>body{font-family:ui-sans-serif,system-ui,Arial;line-height:1.5;padding:24px;white-space:pre-wrap}</style></head><body>${resumeText.replace(/</g,'&lt;')}</body></html>`);
    w.document.close();
    w.focus();
    w.print();
  };
  const applyTemplate = (mode: 'modern'|'classic'|'minimal') => {
    setTemplate(mode);
    setResumeText(prev => {
      let t = prev;
      // Normalize headings
      t = t.replace(/^([A-Z ]{3,})$/gm, (m)=>m.trim());
      const map: Record<string,string> = mode==='classic' ? {
        'SUMMARY':'Summary','EXPERIENCE':'Professional Experience','EDUCATION':'Education','SKILLS':'Skills','PROJECTS':'Projects','CERTIFICATIONS':'Certifications','HEADLINE':'Headline','NAME':'Name'
      } : mode==='minimal' ? {
        'SUMMARY':'Summary','EXPERIENCE':'Experience','EDUCATION':'Education','SKILLS':'Skills'
      } : {
        'SUMMARY':'SUMMARY','EXPERIENCE':'EXPERIENCE','EDUCATION':'EDUCATION','SKILLS':'SKILLS','PROJECTS':'PROJECTS'
      };
      Object.entries(map).forEach(([k,v])=>{ const re=new RegExp(`^${k}\\s*$`,'gmi'); t = t.replace(re, v); });
      // Bullet style
      if (mode==='minimal') {
        t = t.replace(/^•\s+/gm, '- ');
      } else if (mode==='classic') {
        t = t.replace(/^[-•]\s+/gm, '• ');
      }
      return t;
    });
  };
  const saveToLibrary = () => {
    const name = libraryName.trim() || `Resume ${new Date().toLocaleString()}`;
    const existingIdx = library.findIndex(i => i.name === name);
    const item = { name, content: resumeText, updatedAt: Date.now() };
    if (existingIdx >= 0) {
      const copy = [...library]; copy[existingIdx] = item; setLibrary(copy);
    } else {
      setLibrary([item, ...library]);
    }
    setLibraryName(name);
  };
  const loadFromLibrary = (name: string) => {
    const it = library.find(i => i.name === name); if (it) setResumeText(it.content);
  };
  const deleteFromLibrary = (name: string) => {
    setLibrary(library.filter(i => i.name !== name));
  };
  const oneClickApply = () => {
    if (!job?.url) return;
    try {
      const appliedRaw = localStorage.getItem('appliedJobs');
      const list = appliedRaw ? JSON.parse(appliedRaw) : [];
      list.unshift({ jobId: job.id, title: job.title, company: job.company, url: job.url, at: Date.now(), resumeName: libraryName || 'unsaved' });
      localStorage.setItem('appliedJobs', JSON.stringify(list.slice(0,200)));
    } catch {}
    window.open(job.url, '_blank');
  };

  const handleUploadToEditor = async (file: File) => {
    const tryExtractText = async (f: File) => {
      if (f.type === 'text/plain') { try { return await f.text(); } catch { return ''; } }
      if (f.type === 'application/pdf') {
        // @ts-ignore
        const pdfjs = await import(/* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.mjs');
        // @ts-ignore
        pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.mjs';
        const buf = await file.arrayBuffer();
        // @ts-ignore
        const doc = await pdfjs.getDocument({ data: buf }).promise;
        let text = '';
        for (let i = 1; i <= doc.numPages; i++) {
          const page = await doc.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((it: any) => it.str);
          text += strings.join(' ') + '\n';
        }
        return text;
      }
      if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.toLowerCase().endsWith('.docx')) {
        // @ts-ignore
        const mammoth = (await import(/* @vite-ignore */ 'https://unpkg.com/mammoth/mammoth.browser.min.js')).default || (window as any).mammoth;
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value || '';
      }
      return '';
    };
    const text = await tryExtractText(file);
    if (text.trim()) setResumeText(text);
  };

  const handleCreateResume = async () => {
    setIsGenerating(true);
    try {
      const system = { role: 'system', content: 'You create professional ATS-friendly resumes. Use the provided answers to produce a complete resume with clean sections, concise bullets, and quantified impact. No hallucinations.' } as const;
      const user = { role: 'user', content: `Create a resume from this questionnaire. Return only the resume text.

Name: ${createForm.fullName}
Headline: ${createForm.headline}
Contact: ${createForm.email} | ${createForm.phone} | ${createForm.location}
Summary: ${createForm.summary}
Experience: ${createForm.experience}
Education: ${createForm.education}
Skills: ${createForm.skills}` } as const;
      const content = await chatComplete([system as any, user as any], { temperature: 0.5, maxTokens: 1600 });
      setResumeText(content);
      setActiveMode('edit');
    } catch (e: any) {
      setAiOutput(`Error: ${e?.message || 'Failed to create resume'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEnrich = async () => {
    if (!enrichQuery.trim() || !isPdlConfigured()) return;
    setIsEnriching(true);
    try {
      const params: Record<string,string> = {};
      if (/@/.test(enrichQuery)) params.email = enrichQuery.trim();
      else if (/linkedin\.com\//i.test(enrichQuery)) params.profile = enrichQuery.trim();
      else params.name = enrichQuery.trim();
      const data = await pdlEnrichPerson(params);
      const name = data?.full_name || data?.name || createForm.fullName;
      const headline = data?.job_title || data?.title || createForm.headline;
      const loc = data?.location_name || data?.location?.name || createForm.location;
      const skills = (data?.skills || []).slice(0, 20).join(", ");
      const exp = (data?.experience || [])
        .slice(0, 3)
        .map((e: any) => `${e?.company} — ${e?.title} (${e?.start_date || ''}–${e?.end_date || 'Present'})\n• ${[e?.summary||''].filter(Boolean).join(' ')}`)
        .join("\n\n");
      const edu = (data?.education || [])
        .slice(0, 2)
        .map((e: any) => `${e?.school} — ${e?.degree || ''} ${e?.graduation_year ? '('+e?.graduation_year+')' : ''}`)
        .join("\n");
      const summary = data?.summary || createForm.summary;
      const synthesized = `NAME\n${name || ''}\n\nHEADLINE\n${headline || ''}\n\nSUMMARY\n${summary || ''}\n\nEXPERIENCE\n${exp || ''}\n\nEDUCATION\n${edu || ''}\n\nSKILLS\n${skills || ''}`;
      if (!resumeText.trim()) setResumeText(synthesized);
      setCreateForm(cf => ({
        ...cf,
        fullName: name || cf.fullName,
        headline: headline || cf.headline,
        location: loc || cf.location,
        summary: summary || cf.summary,
        experience: exp || cf.experience,
        education: edu || cf.education,
        skills: skills || cf.skills,
      }));
    } catch (e: any) {
      setAiOutput(`PDL enrich failed: ${e?.message || 'error'}`);
    } finally {
      setIsEnriching(false);
    }
  };

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
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleQuickApply} disabled={isGenerating}><Sparkles className="h-4 w-4 mr-2" /> Quick Tailor</Button>
                  <Button variant="default" onClick={oneClickApply} disabled={!job?.url}>One‑Click Apply</Button>
                  <Button variant="outline" onClick={() => setJob(null)} className="w-full sm:w-auto">Clear</Button>
                </div>
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
            <CardDescription>Upload or paste, then edit live. Use the toolbar to clean formatting.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(!import.meta.env.VITE_OPENAI_API_KEY || (!isPdlConfigured() && enrichQuery)) && (
              <div className="rounded-md border bg-warning/10 text-warning-foreground px-3 py-2 text-xs">
                {!import.meta.env.VITE_OPENAI_API_KEY ? 'Missing VITE_OPENAI_API_KEY — AI features will be limited. ' : ''}
                {!isPdlConfigured() && enrichQuery ? 'Missing VITE_PDL_API_KEY — enrichment disabled.' : ''}
              </div>
            )}
            <Tabs value={activeMode} onValueChange={(v)=>setActiveMode(v as any)}>
              <TabsList className="mb-4 flex flex-wrap gap-2">
                <TabsTrigger value="edit">Edit Existing</TabsTrigger>
                <TabsTrigger value="create">Create New</TabsTrigger>
              </TabsList>

              <TabsContent value="edit" className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <label className="inline-flex items-center gap-2 border rounded-md px-3 py-2 cursor-pointer">
                    <Upload className="h-4 w-4" />
                    <span>Upload to Editor</span>
                    <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={(e)=>{ const f=e.target.files?.[0]; if (f) handleUploadToEditor(f); }} />
                  </label>
                  <Button variant="outline" onClick={sectionize}><Scissors className="h-4 w-4 mr-2" /> Section Headings</Button>
                  <Button variant="outline" onClick={bulletify}><List className="h-4 w-4 mr-2" /> Bulletify Lines</Button>
                  <Button variant="outline" onClick={normalizeSpacing}><AlignJustify className="h-4 w-4 mr-2" /> Normalize Spacing</Button>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Template</span>
                    <select value={template} onChange={(e)=>applyTemplate(e.target.value as any)} className="border rounded px-2 py-1 text-sm bg-background">
                      <option value="modern">Modern</option>
                      <option value="classic">Classic</option>
                      <option value="minimal">Minimal</option>
                    </select>
                  </div>
                  <Button onClick={runAnnotations} disabled={isAnnotating}>
                    {isAnnotating ? (<><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Analyzing...</>) : (<><HighlighterIcon className="h-4 w-4 mr-2" />Highlight Improvements</>)}
                  </Button>
                  {isPdlConfigured() && (
                    <>
                      <Input placeholder="Enrich by email/LinkedIn/name" value={enrichQuery} onChange={(e)=>setEnrichQuery(e.target.value)} className="w-56" />
                      <Button variant="outline" onClick={handleEnrich} disabled={isEnriching || !enrichQuery.trim()}>{isEnriching ? 'Enriching…' : 'Enrich'}</Button>
                    </>
                  )}
                  <Button variant="outline" onClick={copyResume}>Copy</Button>
                  <Button variant="outline" onClick={exportTxt}>Export TXT</Button>
                  <Button variant="outline" onClick={exportDocx}>Export DOCX</Button>
                  <Button variant="outline" onClick={printPdf}>Print PDF</Button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Textarea value={resumeText} onChange={(e)=>setResumeText(e.target.value)} className="min-h-[280px]" placeholder="Paste your resume..." />
                  <div className="border rounded-md p-2 overflow-auto max-h-[60vh]">
                    <ResumeHighlighter text={resumeText} annotations={annotations} onChange={setResumeText} />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Input placeholder="Save as…" value={libraryName} onChange={(e)=>setLibraryName(e.target.value)} className="w-56" />
                  <Button variant="default" onClick={saveToLibrary}>Save</Button>
                  {library.length > 0 && <span className="text-xs text-muted-foreground">Library</span>}
                  {library.slice(0,5).map(it => (
                    <div key={it.name} className="flex items-center gap-1 border rounded px-2 py-1 text-xs">
                      <button onClick={()=>loadFromLibrary(it.name)} className="underline">{it.name}</button>
                      <button onClick={()=>deleteFromLibrary(it.name)} aria-label="delete" title="Delete" className="text-destructive">×</button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button onClick={handleGenerate} disabled={isGenerating || !resumeText}>
                    <Wand2 className="h-4 w-4 mr-2" /> {isGenerating ? 'Generating...' : 'Generate Tailored Resume'}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="create" className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input placeholder="Full Name" value={createForm.fullName} onChange={(e)=>setCreateForm({...createForm, fullName:e.target.value})} />
                  <Input placeholder="Headline (e.g., Frontend Developer)" value={createForm.headline} onChange={(e)=>setCreateForm({...createForm, headline:e.target.value})} />
                  <Input placeholder="Email" value={createForm.email} onChange={(e)=>setCreateForm({...createForm, email:e.target.value})} />
                  <Input placeholder="Phone" value={createForm.phone} onChange={(e)=>setCreateForm({...createForm, phone:e.target.value})} />
                  <Input placeholder="Location" value={createForm.location} onChange={(e)=>setCreateForm({...createForm, location:e.target.value})} />
                </div>
                <Textarea placeholder="Short professional summary" value={createForm.summary} onChange={(e)=>setCreateForm({...createForm, summary:e.target.value})} />
                <Textarea placeholder="Experience (roles, bullets, achievements)" value={createForm.experience} onChange={(e)=>setCreateForm({...createForm, experience:e.target.value})} className="min-h-[140px]" />
                <Textarea placeholder="Education (degree, school, year)" value={createForm.education} onChange={(e)=>setCreateForm({...createForm, education:e.target.value})} />
                <Textarea placeholder="Skills (comma separated)" value={createForm.skills} onChange={(e)=>setCreateForm({...createForm, skills:e.target.value})} />
                <div className="flex gap-2">
                  <Button onClick={handleCreateResume} disabled={isGenerating}><Wand2 className="h-4 w-4 mr-2" /> {isGenerating ? 'Creating...' : 'Create Resume'}</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Output</CardTitle>
            <CardDescription>Copy and refine as needed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">Your AI-tailored resume will appear here</div>
              <Button size="sm" variant="outline" onClick={copyOutput}>Copy</Button>
            </div>
            <Textarea value={aiOutput} onChange={(e)=>setAiOutput(e.target.value)} className="min-h-[400px] font-mono text-sm" placeholder="Your AI-tailored resume will appear here" />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ResumeBuilder;
