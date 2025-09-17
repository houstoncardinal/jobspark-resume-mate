import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { JobSearch } from "@/components/JobSearch";
import { ResumeUpload } from "@/components/ResumeUpload";
import { MatchDashboard } from "@/components/MatchDashboard";
import { ResumeOptimizer } from "@/components/ResumeOptimizer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [activeTab, setActiveTab] = useState("search");
  const [uploadedResume, setUploadedResume] = useState<File | null>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const { toast } = useToast();

  // Auto-navigate when job is selected
  const handleJobSelect = (job: any) => {
    setSelectedJob(job);
    toast({
      title: "Job Selected!",
      description: `Selected ${job.title} at ${job.company}. Upload your resume to see the match analysis.`,
    });
    
    // If resume already uploaded, go to match analysis
    if (uploadedResume) {
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
    
    // If job already selected, go to match analysis
    if (selectedJob) {
      setTimeout(() => {
        setActiveTab("match");
        toast({
          title: "Match Analysis Ready",
          description: "Your resume has been analyzed against the selected job.",
        });
      }, 1500); // Allow upload animation to complete
    } else {
      toast({
        title: "Resume Uploaded!",
        description: "Now select a job from the Job Search tab to see match analysis.",
      });
      setTimeout(() => setActiveTab("search"), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            AI-Powered Job Match & Resume Optimizer
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            Search jobs, optimize your resume in real-time, and beat ATS scanners with our intelligent matching system.
          </p>
          
          {/* Progress Status */}
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className={`p-4 rounded-lg border-2 transition-all ${
                selectedJob 
                  ? 'border-success bg-success/10 text-success-foreground' 
                  : 'border-dashed border-muted-foreground/30 bg-muted/20'
              }`}>
                <div className="flex items-center justify-center gap-2">
                  {selectedJob ? (
                    <>
                      <div className="h-3 w-3 bg-success rounded-full" />
                      <span className="font-medium">Job Selected: {selectedJob.title}</span>
                    </>
                  ) : (
                    <>
                      <div className="h-3 w-3 border-2 border-muted-foreground/50 rounded-full" />
                      <span className="text-muted-foreground">Select a Job</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className={`p-4 rounded-lg border-2 transition-all ${
                uploadedResume 
                  ? 'border-success bg-success/10 text-success-foreground' 
                  : 'border-dashed border-muted-foreground/30 bg-muted/20'
              }`}>
                <div className="flex items-center justify-center gap-2">
                  {uploadedResume ? (
                    <>
                      <div className="h-3 w-3 bg-success rounded-full" />
                      <span className="font-medium">Resume Uploaded: {uploadedResume.name}</span>
                    </>
                  ) : (
                    <>
                      <div className="h-3 w-3 border-2 border-muted-foreground/50 rounded-full" />
                      <span className="text-muted-foreground">Upload Resume</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {uploadedResume && selectedJob && (
              <div className="p-3 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
                <span className="text-sm font-medium text-primary">
                  🎉 Ready for AI Analysis & Optimization!
                </span>
              </div>
            )}
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
              {uploadedResume && (
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-success rounded-full" />
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="match" 
              className="relative"
              disabled={!uploadedResume || !selectedJob}
            >
              Match Analysis
              {uploadedResume && selectedJob && (
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-success rounded-full animate-pulse" />
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="optimize" 
              className="relative"
              disabled={!uploadedResume || !selectedJob}
            >
              Resume Optimizer
              {uploadedResume && selectedJob && (
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