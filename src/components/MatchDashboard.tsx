import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, XCircle, Target, Zap, TrendingUp } from "lucide-react";

interface MatchDashboardProps {
  resume: File | null;
  selectedJob: any;
}

export const MatchDashboard = ({ resume, selectedJob }: MatchDashboardProps) => {
  if (!resume || !selectedJob) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please upload a resume and select a job to see the match analysis.
        </AlertDescription>
      </Alert>
    );
  }

  const matchScore = selectedJob.matchScore || 0;
  const skillsMatch = [
    { skill: "React", match: true, level: "Expert" },
    { skill: "TypeScript", match: true, level: "Advanced" },
    { skill: "Next.js", match: false, level: "None" },
    { skill: "Tailwind CSS", match: true, level: "Intermediate" },
    { skill: "GraphQL", match: false, level: "None" },
  ];

  const improvements = [
    { type: "missing", text: "Add Next.js experience to increase match by +8%" },
    { type: "enhance", text: "Highlight GraphQL projects to boost technical score" },
    { type: "keywords", text: "Include 'agile development' keyword for ATS optimization" },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

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
              <div className={`text-4xl font-bold ${getScoreColor(matchScore)} mb-2`}>
                {matchScore}%
              </div>
              <div className="text-sm text-muted-foreground mb-4">Overall Match</div>
              <Progress value={matchScore} className="w-full" />
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">92%</div>
              <div className="text-sm text-muted-foreground mb-4">ATS Compatibility</div>
              <Progress value={92} className="w-full" />
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">76%</div>
              <div className="text-sm text-muted-foreground mb-4">Keywords Match</div>
              <Progress value={76} className="w-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Skills Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {skillsMatch.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  {item.match ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
                  <span className="font-medium">{item.skill}</span>
                </div>
                <Badge variant={item.match ? "default" : "destructive"}>
                  {item.level}
                </Badge>
              </div>
            ))}
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
            {improvements.map((item, index) => (
              <Alert key={index}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{item.text}</AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Requirements vs Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Required Experience: 5+ years</h4>
              <div className="flex items-center gap-2">
                <Progress value={85} className="flex-1" />
                <span className="text-sm text-muted-foreground">4.2 years (85% match)</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Technical Skills: React, TypeScript</h4>
              <div className="flex items-center gap-2">
                <Progress value={90} className="flex-1" />
                <span className="text-sm text-muted-foreground">Strong match (90%)</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Industry Experience: SaaS/Tech</h4>
              <div className="flex items-center gap-2">
                <Progress value={100} className="flex-1" />
                <span className="text-sm text-muted-foreground">Perfect match (100%)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};