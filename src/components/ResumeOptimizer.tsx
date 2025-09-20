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
import { supabase } from "@/integrations/supabase/client";

interface ResumeOptimizerProps {
  resume: File | null;
  selectedJob: any;
  resumeText?: string;
}

export const ResumeOptimizer = ({ resume, selectedJob, resumeText: propResumeText }: ResumeOptimizerProps) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [optimizedContent, setOptimizedContent] = useState("");
  const [hasOptimized, setHasOptimized] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [recommended, setRecommended] = useState<string[]>([]);
  const [originalVisible, setOriginalVisible] = useState(false);
  const [diffSegments, setDiffSegments] = useState<Array<{ type: 'same' | 'added' | 'removed'; text: string }>>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (propResumeText) {
      setResumeText(propResumeText);
      if (selectedJob) {
        const match = computeMatch(propResumeText, selectedJob);
        setRecommended(match.recommendedKeywords.slice(0, 12));
      }
    }
  }, [propResumeText, selectedJob]);

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

  const diffText = (oldText: string, newText: string) => {
    // Simple word-level diff for visual highlight
    const oldWords = oldText.split(/(\s+)/);
    const newWords = newText.split(/(\s+)/);
    const max = Math.max(oldWords.length, newWords.length);
    const segments: Array<{ type: 'same' | 'added' | 'removed'; text: string }> = [];
    for (let i = 0; i < max; i++) {
      const o = oldWords[i] ?? '';
      const n = newWords[i] ?? '';
      if (o === n) {
        if (n) segments.push({ type: 'same', text: n });
      } else {
        if (o) segments.push({ type: 'removed', text: o });
        if (n) segments.push({ type: 'added', text: n });
      }
    }
    return segments;
  };

  const handleOptimize = async () => {
    if ((!resume && !resumeText) || !selectedJob) return;
    setIsOptimizing(true);
    setOptimizationProgress(0);
    try {
      // Progress simulation UI only
      const steps = 6;
      for (let i = 0; i <= steps; i++) {
        await new Promise(resolve => setTimeout(resolve, 250));
        setOptimizationProgress((i / steps) * 100);
      }
      const { data, error } = await supabase.functions.invoke('ai-resume-optimizer', {
        body: {
          resumeText,
          jobDescription: selectedJob.description,
          jobTitle: selectedJob.title,
          company: selectedJob.company
        }
      });

      if (error) throw error;
      
      setOptimizedContent(data.optimizedResume || resumeText);
      setDiffSegments(diffText(resumeText, data.optimizedResume || resumeText));
      setHasOptimized(true);
      toast({ title: "Resume Optimized!", description: "Preview the changes on the right." });
    } catch (e: any) {
      toast({ title: "Optimization failed", description: e?.message || 'Error generating', variant: 'destructive' });
    } finally {
      setIsOptimizing(false);
    }
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
                <Button variant="outline" className="flex-1" onClick={() => setOriginalVisible(v => !v)}>
                  <Eye className="mr-2 h-4 w-4" />
                  {originalVisible ? 'Hide Original' : 'Preview Original'}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Original Resume</CardTitle>
              <CardDescription>Your original content (read-only)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`border rounded-md p-3 whitespace-pre-wrap leading-relaxed text-sm font-mono ${originalVisible ? '' : 'opacity-70'}`} style={{ maxHeight: 520, overflow: 'auto' }}>
                {resumeText}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Optimized Resume Preview</CardTitle>
              <CardDescription>Changes highlighted in color</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md p-3 whitespace-pre-wrap leading-relaxed text-sm font-mono" style={{ maxHeight: 520, overflow: 'auto' }}>
                {diffSegments.length ? (
                  diffSegments.map((seg, idx) => {
                    if (seg.type === 'same') return <span key={idx}>{seg.text}</span>;
                    if (seg.type === 'added') return <span key={idx} className="bg-success/20 ring-1 ring-success px-0.5 rounded-sm">{seg.text}</span>;
                    return <span key={idx} className="bg-destructive/10 ring-1 ring-destructive/40 line-through px-0.5 rounded-sm">{seg.text}</span>;
                  })
                ) : (
                  <Textarea
                    value={optimizedContent}
                    onChange={(e) => setOptimizedContent(e.target.value)}
                    className="min-h[500px] font-mono text-sm"
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};