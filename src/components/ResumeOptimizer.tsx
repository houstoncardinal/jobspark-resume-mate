import { useState, useEffect } from "react";
import { Wand2, Download, Eye, RefreshCw, Sparkles, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { computeMatch, extractJobKeywords } from "@/lib/match";

interface ResumeOptimizerProps {
  resume: File | null;
  selectedJob: any;
}

export const ResumeOptimizer = ({ resume, selectedJob }: ResumeOptimizerProps) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [optimizedContent, setOptimizedContent] = useState("");
  const [hasOptimized, setHasOptimized] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [recommended, setRecommended] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const handler = (e: any) => {
      const text = e?.detail?.text || "";
      setResumeText(text);
      if (selectedJob) {
        const match = computeMatch(text, selectedJob);
        setRecommended(match.recommendedKeywords.slice(0, 12));
      }
    };
    window.addEventListener("resume-text-updated", handler as any);
    return () => window.removeEventListener("resume-text-updated", handler as any);
  }, [selectedJob]);

  const handleOptimize = async () => {
    if ((!resume && !resumeText) || !selectedJob) return;
    
    setIsOptimizing(true);
    setOptimizationProgress(0);
    
    // Simulate AI optimization process
    const steps = [
      "Analyzing job requirements...",
      "Extracting resume content...", 
      "Identifying optimization opportunities...",
      "Enhancing keyword density...",
      "Improving ATS compatibility...",
      "Generating optimized version..."
    ];
    
    for (let i = 0; i <= steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setOptimizationProgress((i / steps.length) * 100);
    }
    
    // Use keywords from match to seed content
    const baseKeywords = recommended.length ? recommended : extractJobKeywords(selectedJob, 12);
    const mockOptimizedContent = `OPTIMIZED RESUME\n\nSUMMARY\nResults-driven professional aligned with ${selectedJob.title} at ${selectedJob.company}. Strong experience across: ${baseKeywords.join(', ')}. Proven impact in shipping production features, collaborating cross-functionally, and improving KPIs.\n\nHARD SKILLS\n• ${baseKeywords.slice(0,4).join('  • ')}\n• ${baseKeywords.slice(4,8).join('  • ')}\n• ${baseKeywords.slice(8,12).join('  • ')}\n\nEXPERIENCE\n${selectedJob.company} — Role Relevant to ${selectedJob.title}\n• Delivered features mapped to ${baseKeywords.slice(0,3).join(', ')} improving user engagement 20%\n• Implemented scalable solutions leveraging ${baseKeywords.slice(3,6).join(', ')}\n• Partnered with stakeholders to prioritize roadmap and ship on schedule\n\nEDUCATION & CERTIFICATIONS\n• Bachelor of Science in Computer Science\n• Certifications in ${baseKeywords.slice(0,2).join(', ')}\n`;

    setOptimizedContent(mockOptimizedContent);
    setHasOptimized(true);
    setIsOptimizing(false);
    
    toast({
      title: "Resume Optimized!",
      description: "Your resume has been enhanced for better ATS compatibility and job matching.",
    });
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([optimizedContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `optimized-resume-${selectedJob?.company?.replace(/\s+/g, '-').toLowerCase() || 'job'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Resume Downloaded!",
      description: "Your optimized resume has been saved to your downloads folder.",
    });
  };

  if ((!resume && !resumeText) || !selectedJob) {
    return (
      <Alert>
        <Wand2 className="h-4 w-4" />
        <AlertDescription>
          Please upload a resume or paste text and select a job to start optimization.
        </AlertDescription>
      </Alert>
    );
  }

  const improvements = [
    { 
      type: "Keywords", 
      count: recommended.length || 8, 
      color: "bg-success text-success-foreground",
      description: "Added job-specific keywords"
    },
    { 
      type: "ATS Score", 
      count: 12, 
      color: "bg-primary text-primary-foreground",
      description: "Improved compatibility"
    },
    { 
      type: "Skills", 
      count: 5, 
      color: "bg-accent text-accent-foreground",
      description: "Enhanced technical skills"
    },
    { 
      type: "Format", 
      count: 7, 
      color: "bg-warning text-warning-foreground",
      description: "Better structure"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Resume Optimizer
          </CardTitle>
          <CardDescription>
            Enhance your resume with AI-powered optimization for {selectedJob.title} at {selectedJob.company}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isOptimizing && !hasOptimized && (
            <div className="text-center space-y-4">
              <div className="p-8 border-2 border-dashed border-primary/30 rounded-lg">
                <Wand2 className="h-12 w-12 mx-auto text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Ready to Optimize</h3>
                <p className="text-muted-foreground mb-4">
                  Our AI will analyze your resume and the job requirements to create an optimized version
                </p>
                <div className="flex justify-center gap-2 flex-wrap">
                  {recommended.map((kw, i) => (
                    <Badge key={i} variant="secondary">{kw}</Badge>
                  ))}
                </div>
                <Button onClick={handleOptimize} size="lg" className="mt-4">
                  <Wand2 className="mr-2 h-4 w-4" />
                  Optimize Resume
                </Button>
              </div>
            </div>
          )}

          {isOptimizing && (
            <div className="space-y-4">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 mx-auto text-primary animate-spin mb-4" />
                <h3 className="text-lg font-semibold">Optimizing Your Resume</h3>
                <p className="text-muted-foreground mb-4">
                  AI is analyzing and enhancing your resume...
                </p>
                <Progress value={optimizationProgress} className="w-full max-w-md mx-auto" />
              </div>
            </div>
          )}

          {hasOptimized && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {improvements.map((improvement, index) => (
                  <div key={index} className="text-center">
                    <Badge className={improvement.color}>
                      +{improvement.count} {improvement.type}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {improvement.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview Original
                </Button>
                <Button className="flex-1" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Optimized
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {hasOptimized && (
        <Card>
          <CardHeader>
            <CardTitle>Optimized Resume Preview</CardTitle>
            <CardDescription>
              AI-enhanced version tailored for the selected job
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={optimizedContent}
              onChange={(e) => setOptimizedContent(e.target.value)}
              className="min-h[500px] font-mono text-sm"
              placeholder="Optimized resume content will appear here..."
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};