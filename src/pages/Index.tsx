import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { JobSearch } from "@/components/JobSearch";
import { ResumeUpload } from "@/components/ResumeUpload";
import { MatchDashboard } from "@/components/MatchDashboard";
import { ResumeOptimizer } from "@/components/ResumeOptimizer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Search as SearchIcon, FileText, Sparkles, HelpCircle } from "lucide-react";
import { setSeo, injectJsonLd } from "@/lib/seo";
import { Footer } from "@/components/Footer";

const Index = () => {
  const [activeTab, setActiveTab] = useState("search");
  const [uploadedResume, setUploadedResume] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>("");
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    setSeo({
      title: "Gigm8 — Find Jobs, Match & Optimize Your Resume",
      description: "Discover curated jobs worldwide, analyze your resume against any role, and optimize with AI to improve ATS scores and keyword alignment.",
      canonical: "https://jobspark.app/",
    });
    injectJsonLd('jsonld-website', {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Gigm8",
      "url": "https://jobspark.app/",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://jobspark.app/?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    });
  }, []);

  // Load persisted resume text
  useEffect(() => {
    try {
      const saved = localStorage.getItem("resumeText");
      if (saved) setResumeText(saved);
    } catch {}
  }, []);

  useEffect(() => {
    const handler = (e: any) => {
      const text = e?.detail?.text || "";
      setResumeText(text);
      try { localStorage.setItem("resumeText", text); } catch {}
      if (selectedJob) {
        setActiveTab("match");
      }
    };
    const navHandler = (e: any) => {
      const tab = e?.detail?.tab;
      if (tab) setActiveTab(tab);
    };
    window.addEventListener("resume-text-updated", handler as any);
    window.addEventListener("navigate-tab", navHandler as any);
    return () => {
      window.removeEventListener("resume-text-updated", handler as any);
      window.removeEventListener("navigate-tab", navHandler as any);
    };
  }, [selectedJob]);

  // Auto-navigate when job is selected
  const handleJobSelect = (job: any) => {
    setSelectedJob(job);
    try { localStorage.setItem("selectedJob", JSON.stringify(job)); } catch {}
    toast({
      title: "Job Selected!",
      description: `Selected ${job.title} at ${job.company}. Upload your resume to see the match analysis.`,
    });
    
    if (uploadedResume || resumeText) {
      setActiveTab("match");
      toast({
        title: "Match Analysis Ready",
        description: "Analyzing your resume against the selected job requirements.",
      });
    } else {
      setActiveTab("resume");
    }
  };

  // Auto-navigate when resume is uploaded
  const handleResumeUpload = (file: File) => {
    setUploadedResume(file);
    
    if (selectedJob) {
      setTimeout(() => {
        setActiveTab("match");
        toast({
          title: "Match Analysis Ready",
          description: "Your resume has been analyzed against the selected job.",
        });
      }, 1500);
    } else {
      toast({
        title: "Resume Uploaded!",
        description: "Now select a job from the Job Search tab to see match analysis.",
      });
      setTimeout(() => setActiveTab("search"), 1500);
    }
  };

  const step1Done = !!selectedJob;
  const step2Done = !!(uploadedResume || resumeText);
  const step3Ready = step1Done && step2Done;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <section className="mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
                Find Great Jobs. Perfect Your Resume.
              </h1>
              <p className="text-muted-foreground text-base md:text-lg mb-6 max-w-xl">
                Gigm8 brings together high-quality job listings with an AI resume toolkit so you can search, match, and optimize in one place.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => { setActiveTab('search'); const el = document.getElementById('job-search'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>
                  <SearchIcon className="h-4 w-4 mr-2" /> Start Searching
                </Button>
                <Button variant="outline" onClick={() => setActiveTab('optimize')}>
                  <Sparkles className="h-4 w-4 mr-2" /> Optimize Resume
                </Button>
              </div>
            </div>
            <div className="rounded-xl border p-4 bg-gradient-to-br from-primary/5 to-accent/10">
              <div className="text-sm text-muted-foreground mb-2">Tools</div>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="secondary" className="justify-start" onClick={() => setActiveTab('search')}><SearchIcon className="h-4 w-4 mr-2" /> Job Search</Button>
                <Button variant="secondary" className="justify-start" onClick={() => setActiveTab('resume')}><FileText className="h-4 w-4 mr-2" /> Resume Upload</Button>
                <Button variant="secondary" className="justify-start" disabled={!(uploadedResume || resumeText) || !selectedJob} onClick={() => setActiveTab('match')}><CheckCircle2 className="h-4 w-4 mr-2" /> Match Analysis</Button>
                <Button variant="secondary" className="justify-start" disabled={!(uploadedResume || resumeText) || !selectedJob} onClick={() => setActiveTab('optimize')}><Sparkles className="h-4 w-4 mr-2" /> Resume Optimizer</Button>
              </div>
            </div>
          </div>
        </section>

        <Tabs id="job-search" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-8 flex gap-2 overflow-x-auto no-scrollbar">
            <TabsTrigger value="search" className="relative flex-shrink-0 whitespace-nowrap px-4 py-2">
              Job Search
              {selectedJob && (
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-success rounded-full" />
              )}
            </TabsTrigger>
            <TabsTrigger value="resume" className="relative flex-shrink-0 whitespace-nowrap px-4 py-2" id="upload">
              Resume Upload
              {(uploadedResume || resumeText) && (
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-success rounded-full" />
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="match" 
              className="relative flex-shrink-0 whitespace-nowrap px-4 py-2"
              id="match"
              disabled={!(uploadedResume || resumeText) || !selectedJob}
            >
              Match Analysis
              {(uploadedResume || resumeText) && selectedJob && (
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-success rounded-full animate-pulse" />
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="optimize" 
              className="relative flex-shrink-0 whitespace-nowrap px-4 py-2"
              disabled={!(uploadedResume || resumeText) || !selectedJob}
            >
              Resume Optimizer
              {(uploadedResume || resumeText) && selectedJob && (
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-accent rounded-full" />
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            <JobSearch onJobSelect={handleJobSelect} selectedJob={selectedJob} />
          </TabsContent>

          <TabsContent value="resume" className="space-y-6">
            <ResumeUpload onResumeUpload={handleResumeUpload} uploadedResume={uploadedResume} />
          </TabsContent>

          <TabsContent value="match" className="space-y-6">
            <MatchDashboard resume={uploadedResume} selectedJob={selectedJob} resumeText={resumeText} />
          </TabsContent>

          <TabsContent value="optimize" className="space-y-6">
            <ResumeOptimizer resume={uploadedResume} selectedJob={selectedJob} resumeText={resumeText} />
          </TabsContent>
        </Tabs>

        <section id="help" className="mt-10 border rounded-lg p-5 bg-muted/20">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="h-5 w-5" />
            <h2 className="text-lg font-semibold">How it works</h2>
          </div>
          <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
            <li>Search for a role using keywords. Use Filters to pick Region, Remote, or your location.</li>
            <li>Select a job you like. We save it and show full details.</li>
            <li>Upload or paste your resume text. We auto-extract text from PDF/DOCX when possible.</li>
            <li>Open Match Analysis to see scores, keyword gaps, and suggestions.</li>
            <li>Open the Resume Builder to see color-coded highlights and apply AI fixes or generate a tailored version.</li>
          </ol>
        </section>

        <Footer />
      </main>
    </div>
  );
};

export default Index;