import { useState } from "react";
import { Header } from "@/components/Header";
import { JobSearch } from "@/components/JobSearch";
import { ResumeUpload } from "@/components/ResumeUpload";
import { MatchDashboard } from "@/components/MatchDashboard";
import { ResumeOptimizer } from "@/components/ResumeOptimizer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [activeTab, setActiveTab] = useState("search");
  const [uploadedResume, setUploadedResume] = useState<File | null>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            AI-Powered Job Match & Resume Optimizer
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Search jobs, optimize your resume in real-time, and beat ATS scanners with our intelligent matching system.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="search">Job Search</TabsTrigger>
            <TabsTrigger value="resume">Resume Upload</TabsTrigger>
            <TabsTrigger value="match">Match Analysis</TabsTrigger>
            <TabsTrigger value="optimize">Resume Optimizer</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            <JobSearch onJobSelect={setSelectedJob} />
          </TabsContent>

          <TabsContent value="resume" className="space-y-6">
            <ResumeUpload onResumeUpload={setUploadedResume} />
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