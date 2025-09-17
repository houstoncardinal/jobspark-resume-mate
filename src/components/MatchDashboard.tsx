import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, XCircle, Target, Zap, TrendingUp } from "lucide-react";
import { computeMatch, extractJobKeywords } from "@/lib/match";
import type { NormalizedJob } from "@/lib/jobs";
import React from "react";
import { ResumeAudit } from "@/components/ResumeAudit";

interface MatchDashboardProps {
  resume: File | null;
  selectedJob: NormalizedJob | null;
}

export const MatchDashboard = ({ resume, selectedJob }: MatchDashboardProps) => {
  const [resumeText, setResumeText] = React.useState<string>("");
  const [match, setMatch] = React.useState<ReturnType<typeof computeMatch> | null>(null);

  React.useEffect(() => {
    const handler = (e: any) => {
      const text = e?.detail?.text || "";
      setResumeText(text);
    };
    window.addEventListener("resume-text-updated", handler as any);
    return () => window.removeEventListener("resume-text-updated", handler as any);
  }, []);

  React.useEffect(() => {
    if (!selectedJob) return;
    const text = resumeText || "";
    if (text.trim()) {
      const m = computeMatch(text, selectedJob);
      setMatch(m);
    } else {
      setMatch(null);
    }
  }, [resumeText, selectedJob]);

  if ((!resume && !resumeText) || !selectedJob) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please upload a resume or paste text and select a job to see the match analysis.
        </AlertDescription>
      </Alert>
    );
  }

  const defaultKeywords = selectedJob ? extractJobKeywords(selectedJob, 12) : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Match Analysis
          </CardTitle>
          <CardDescription>
            AI-powered analysis of your resume against the selected job posting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`text-4xl font-bold ${match ? (match.overallMatchPercent >= 80 ? 'text-success' : match.overallMatchPercent >= 60 ? 'text-warning' : 'text-destructive') : 'text-muted-foreground'} mb-2`}>
                {match ? `${match.overallMatchPercent}%` : '--'}
              </div>
              <div className="text-sm text-muted-foreground mb-4">Overall Match</div>
              <Progress value={match ? match.overallMatchPercent : 0} className="w-full" />
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{match ? `${match.atsCompatibilityPercent}%` : '--'}</div>
              <div className="text-sm text-muted-foreground mb-4">ATS Compatibility</div>
              <Progress value={match ? match.atsCompatibilityPercent : 0} className="w-full" />
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">{match ? `${match.keywordsMatchPercent}%` : '--'}</div>
              <div className="text-sm text-muted-foreground mb-4">Keywords Match</div>
              <Progress value={match ? match.keywordsMatchPercent : 0} className="w-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Keywords
            </CardTitle>
            <CardDescription>Top terms from the job and your coverage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {(match ? match.matchedKeywords.slice(0, 20) : defaultKeywords.slice(0, 10)).map((kw, i) => (
                <Badge key={i} className="bg-success text-success-foreground">{kw}</Badge>
              ))}
            </div>
            {match && (
              <div className="flex flex-wrap gap-2">
                {match.missingKeywords.slice(0, 20).map((kw, i) => (
                  <Badge key={i} variant="secondary">{kw}</Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Improvement Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {match ? (
              match.recommendedKeywords.slice(0, 8).map((kw, index) => (
                <Alert key={index}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Add "{kw}" to boost keyword match</AlertDescription>
                </Alert>
              ))
            ) : (
              defaultKeywords.slice(0, 6).map((kw, index) => (
                <Alert key={index}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Ensure your resume mentions "{kw}"</AlertDescription>
                </Alert>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {resumeText && selectedJob && (
        <ResumeAudit resumeText={resumeText} job={selectedJob} />
      )}
    </div>
  );
};