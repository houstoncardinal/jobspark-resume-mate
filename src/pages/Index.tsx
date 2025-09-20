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
import { CheckCircle2, Search as SearchIcon, FileText, Sparkles, HelpCircle, Wrench, ArrowRight, Star, Users, TrendingUp, Shield, Zap } from "lucide-react";
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

  const handleResumeUpload = (file: File, text: string) => {
    setUploadedResume(file);
    setResumeText(text);
    localStorage.setItem("resumeText", text);
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
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container mx-auto px-4">
        {/* Hero Section - Two Column */}
        <section className="py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                  <Star className="h-4 w-4" />
                  Trusted by 10,000+ Job Seekers
                </div>
                
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-gray-900">
                  Find Your{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    Dream Job
                  </span>{" "}
                  with AI
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  Discover high-quality job listings worldwide, analyze your resume against any role, 
                  and use AI to optimize your application for better results.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => document.getElementById('job-search')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
                >
                  <SearchIcon className="h-5 w-5 mr-2" />
                  Start Job Search
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => setActiveTab("upload")}
                  className="text-lg px-8 py-6 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Upload Resume
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">50K+</div>
                  <div className="text-sm text-gray-600">Job Listings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">95%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">24/7</div>
                  <div className="text-sm text-gray-600">AI Support</div>
                </div>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/bg.PNG" 
                  alt="Professional job search and career development" 
                  className="w-full h-auto object-cover"
                />
                {/* Overlay for better text contrast if needed */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -top-4 -left-4 bg-white rounded-xl shadow-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">AI Optimized</div>
                    <div className="text-sm text-gray-600">Resume Score: 95%</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Job Matches</div>
                    <div className="text-sm text-gray-600">12 new opportunities</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50 rounded-2xl my-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Powerful Job Search Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to find, analyze, and land your dream job
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                <SearchIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Job Search</h3>
              <p className="text-gray-600 leading-relaxed">
                Find opportunities across multiple job boards with AI-powered matching and filtering
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Resume Analysis</h3>
              <p className="text-gray-600 leading-relaxed">
                Upload and analyze your resume against job requirements with detailed insights
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                <Sparkles className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Optimization</h3>
              <p className="text-gray-600 leading-relaxed">
                Get AI-powered resume improvements and personalized recommendations
              </p>
            </div>
          </div>
        </section>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 overflow-x-auto no-scrollbar bg-white border border-gray-200">
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
