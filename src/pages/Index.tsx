import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { JobSearch } from "@/components/JobSearch";
import { ResumeUpload } from "@/components/ResumeUpload";
import { MatchDashboard } from "@/components/MatchDashboard";
import { ResumeOptimizer } from "@/components/ResumeOptimizer";
import { JobSearchDiagnostics } from "@/components/JobSearchDiagnostics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Search as SearchIcon, FileText, Sparkles, HelpCircle, Wrench } from "lucide-react";
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
      canonical: "https://gigm8.com/",
    });
    injectJsonLd('jsonld-website', {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Gigm8",
      "url": "https://gigm8.com/",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://gigm8.com/?q={search_term_string}",
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
      localStorage.setItem("resumeText", text);
    };
    window.addEventListener("resume-text-updated", handler as any);
    return () => window.removeEventListener("resume-text-updated", handler as any);
  }, []);

  const handleResumeUpload = (file: File) => {
    setUploadedResume(file);
    toast({
      title: "Resume Uploaded!",
      description: "Your resume has been processed and is ready for analysis.",
    });
  };

  const handleJobSelect = (job: any) => {
    setSelectedJob(job);
    toast({
      title: "Job Selected!",
      description: `You've selected ${job.title} at ${job.company}. Ready for analysis!`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section - Two Column */}
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Original Text Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                Find Your <span className="text-primary">Dream Job</span>
                <br />
                <span className="text-2xl md:text-4xl text-muted-foreground font-normal">
                  Match • Optimize • Apply
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto lg:mx-0">
                Discover high-quality job listings worldwide, analyze your resume against any role, 
                and use AI to optimize your application for better results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  size="lg" 
                  onClick={() => document.getElementById('job-search')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-lg px-8 py-6"
                >
                  <SearchIcon className="h-5 w-5 mr-2" />
                  Start Job Search
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => setActiveTab("upload")}
                  className="text-lg px-8 py-6"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Upload Resume
                </Button>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/bg.jpg" 
                  alt="Professional job search and career development" 
                  className="w-full h-auto object-cover"
                />
                {/* Overlay for better text contrast if needed */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Tools Panel */}
        <section className="mb-12">
          <div className="bg-card/50 backdrop-blur-sm border rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-center mb-6">Powerful Job Search Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <SearchIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">1. Search Jobs</h3>
                <p className="text-sm text-muted-foreground">Find opportunities across multiple job boards</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">2. Upload Resume</h3>
                <p className="text-sm text-muted-foreground">Analyze your resume against job requirements</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">3. AI Optimize</h3>
                <p className="text-sm text-muted-foreground">Get AI-powered resume improvements</p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 overflow-x-auto no-scrollbar">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <SearchIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Job Search</span>
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Resume Upload</span>
            </TabsTrigger>
            <TabsTrigger value="match" className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span className="hidden sm:inline">Match Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="optimize" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">AI Optimize</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" id="job-search">
            <JobSearch onJobSelect={handleJobSelect} selectedJob={selectedJob} />
          </TabsContent>

          <TabsContent value="upload">
            <ResumeUpload onResumeUpload={handleResumeUpload} uploadedResume={uploadedResume} />
          </TabsContent>

          <TabsContent value="match">
            <MatchDashboard resume={uploadedResume} selectedJob={selectedJob} resumeText={resumeText} />
          </TabsContent>

          <TabsContent value="optimize">
            <ResumeOptimizer resume={uploadedResume} selectedJob={selectedJob} resumeText={resumeText} />
          </TabsContent>
        </Tabs>

        {/* Diagnostics Section */}
        <section className="mt-12">
          <JobSearchDiagnostics />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
