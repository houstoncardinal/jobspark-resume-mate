import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { JobSearch } from "@/components/JobSearch";
import { ResumeUpload } from "@/components/ResumeUpload";
import { MatchDashboard } from "@/components/MatchDashboard";
import { ResumeOptimizer } from "@/components/ResumeOptimizer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Search as SearchIcon, FileText, Sparkles } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("search");
  const [uploadedResume, setUploadedResume] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>("");
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const { toast } = useToast();

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
        <div className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Match a Job. Optimize Your Resume. Apply with Confidence.
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              Choose a job, upload or paste your resume, get instant match analytics and AI-powered edits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg border transition-all ${step1Done ? 'border-success bg-success/10' : 'border-dashed border-muted-foreground/30'}`}>
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step1Done ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {step1Done ? <CheckCircle2 className="h-5 w-5" /> : <SearchIcon className="h-5 w-5" />}
                </div>
                <div>
                  <div className="font-medium">1. Select a Job</div>
                  <div className="text-xs text-muted-foreground">Find the role you want to target</div>
                </div>
              </div>
              <div className="mt-3">
                <Button size="sm" variant="outline" onClick={() => setActiveTab('search')}>Go to Job Search</Button>
              </div>
            </div>

            <div className={`p-4 rounded-lg border transition-all ${step2Done ? 'border-success bg-success/10' : 'border-dashed border-muted-foreground/30'}`}>
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step2Done ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {step2Done ? <CheckCircle2 className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                </div>
                <div>
                  <div className="font-medium">2. Upload or Paste Resume</div>
                  <div className="text-xs text-muted-foreground">Provide your latest resume text or file</div>
                </div>
              </div>
              <div className="mt-3">
                <Button size="sm" variant="outline" onClick={() => setActiveTab('resume')}>Go to Upload</Button>
              </div>
            </div>

            <div className={`p-4 rounded-lg border transition-all ${step3Ready ? 'border-primary bg-primary/10' : 'border-dashed border-muted-foreground/30'}`}>
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step3Ready ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium">3. Analyze & Optimize</div>
                  <div className="text-xs text-muted-foreground">See match scores and apply AI edits in real time</div>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button size="sm" onClick={() => setActiveTab('match')} disabled={!step3Ready}>Open Match Analysis</Button>
                <Button size="sm" variant="outline" onClick={() => setActiveTab('optimize')} disabled={!step3Ready}>Open Resume Builder</Button>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="search" className="relative">
              Job Search
              {selectedJob && (
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-success rounded-full" />
              )}
            </TabsTrigger>
            <TabsTrigger value="resume" className="relative">
              Resume Upload
              {(uploadedResume || resumeText) && (
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-success rounded-full" />
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="match" 
              className="relative"
              disabled={!(uploadedResume || resumeText) || !selectedJob}
            >
              Match Analysis
              {(uploadedResume || resumeText) && selectedJob && (
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-success rounded-full animate-pulse" />
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="optimize" 
              className="relative"
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
            <MatchDashboard 
              resume={uploadedResume} 
              selectedJob={selectedJob} 
            />
          </TabsContent>

          <TabsContent value="optimize" className="space-y-6">
            <ResumeOptimizer 
              resume={uploadedResume} 
              selectedJob={selectedJob} 
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;