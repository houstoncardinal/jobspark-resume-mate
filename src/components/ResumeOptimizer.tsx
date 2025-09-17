import { useState } from "react";
import { Wand2, Download, Eye, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface ResumeOptimizerProps {
  resume: File | null;
  selectedJob: any;
}

export const ResumeOptimizer = ({ resume, selectedJob }: ResumeOptimizerProps) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [optimizedContent, setOptimizedContent] = useState("");
  const [hasOptimized, setHasOptimized] = useState(false);
  const { toast } = useToast();

  const handleOptimize = async () => {
    if (!resume || !selectedJob) return;
    
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
    
    // Mock optimized content with job-specific keywords
    const jobKeywords = selectedJob.requirements?.join(', ') || "React, TypeScript, JavaScript";
    const mockOptimizedContent = `SENIOR FRONTEND DEVELOPER

PROFESSIONAL SUMMARY
Results-driven Senior Frontend Developer with 5+ years of experience in ${jobKeywords}. Proven track record of delivering high-performance web applications using ${selectedJob.requirements?.[0] || 'React'}, ${selectedJob.requirements?.[1] || 'TypeScript'}, and ${selectedJob.requirements?.[2] || 'modern web technologies'}. Expert in agile development methodologies with strong focus on user experience and scalable architecture.

TECHNICAL SKILLS
• Frontend: ${selectedJob.requirements?.slice(0, 4).join(', ') || 'React, TypeScript, Next.js, JavaScript (ES6+)'}
• Styling: Tailwind CSS, CSS3, Sass, Styled Components  
• State Management: Redux, Context API, Zustand
• APIs: GraphQL, REST, Apollo Client
• Tools: Git, Webpack, Vite, Docker
• Testing: Jest, React Testing Library, Cypress

PROFESSIONAL EXPERIENCE

Senior Frontend Developer | ${selectedJob.company} | 2021 - Present
• Developed and maintained 15+ ${selectedJob.requirements?.[0] || 'React'} applications serving 100K+ daily active users
• Implemented ${selectedJob.requirements?.[1] || 'TypeScript'} across all projects, reducing bugs by 40%
• Built responsive interfaces using ${selectedJob.requirements?.[3] || 'CSS'}, improving mobile engagement by 35%
• Integrated ${selectedJob.requirements?.[4] || 'REST'} APIs, reducing data fetching time by 50%
• Collaborated in agile development sprints, consistently delivering features on time

Frontend Developer | TechCorp Solutions | 2019 - 2021
• Created ${selectedJob.requirements?.[0] || 'React'}-based dashboard, improving page load speeds by 60%
• Developed component library with ${selectedJob.requirements?.[3] || 'CSS frameworks'}, used across 8 different projects
• Implemented automated testing with Jest, achieving 85% code coverage
• Worked closely with UX/UI designers to implement pixel-perfect interfaces

EDUCATION
Bachelor of Science in Computer Science | University of Technology | 2019
Relevant Coursework: ${selectedJob.requirements?.slice(0, 3).join(', ') || 'Web Development, Software Engineering, Database Design'}

CERTIFICATIONS
• ${selectedJob.requirements?.[0] || 'React'} Developer Certification
• ${selectedJob.requirements?.[1] || 'TypeScript'} Advanced Certification
• Agile Development Practitioner`;

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

  const improvements = [
    { 
      type: "Keywords", 
      count: 8, 
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

  if (!resume || !selectedJob) {
    return (
      <Alert>
        <Wand2 className="h-4 w-4" />
        <AlertDescription>
          Please upload a resume and select a job to start optimization.
        </AlertDescription>
      </Alert>
    );
  }

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
                <Button onClick={handleOptimize} size="lg">
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
              className="min-h-[500px] font-mono text-sm"
              placeholder="Optimized resume content will appear here..."
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};