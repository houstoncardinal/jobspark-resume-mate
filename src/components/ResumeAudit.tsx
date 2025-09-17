import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Download, FileSearch, RefreshCw } from "lucide-react";
import { chatComplete } from "@/lib/ai";
import type { NormalizedJob } from "@/lib/jobs";

interface ResumeAuditProps {
  resumeText: string;
  job: NormalizedJob;
}

interface AuditReport {
  summary: string;
  atsFindings: string[];
  keywordGaps: string[];
  accomplishmentsSuggestions: string[];
  bulletRewrites: string[];
  formattingRecommendations: string[];
  prioritizedActions: { action: string; impact: "high" | "medium" | "low" }[];
}

const safeParse = (text: string): AuditReport | null => {
  try {
    const obj = JSON.parse(text);
    return obj as AuditReport;
  } catch {
    return null;
  }
};

export const ResumeAudit: React.FC<ResumeAuditProps> = ({ resumeText, job }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [report, setReport] = React.useState<AuditReport | null>(null);
  const [raw, setRaw] = React.useState<string>("");
  const hasAutoRun = React.useRef(false);

  const generate = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setReport(null);
    setRaw("");
    const system = { role: "system", content: "You are a senior resume auditor specializing in ATS optimization and outcome-focused writing." } as const;
    const user = {
      role: "user",
      content: `Create a JSON resume audit tailored to this job. Return ONLY minified JSON with keys: summary (string), atsFindings (string[]), keywordGaps (string[]), accomplishmentsSuggestions (string[]), bulletRewrites (string[]), formattingRecommendations (string[]), prioritizedActions ({action:string,impact:'high'|'medium'|'low'}[]).\nJob: ${job.title} at ${job.company}\nLocation: ${job.location || 'Remote'}\nRequirements: ${(job.requirements||[]).join(', ')}\nDescription: ${(job.description||'').replace(/<[^>]+>/g,' ')}\n---\nResume:\n${resumeText}`
    } as const;
    try {
      const content = await chatComplete([system as any, user as any], { temperature: 0.4, maxTokens: 1600 });
      setRaw(content);
      const parsed = safeParse(content);
      if (parsed) setReport(parsed);
    } catch (e: any) {
      setRaw(`Error: ${e?.message || 'Failed to generate report'}`);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const handler = () => generate();
    window.addEventListener("run-audit", handler);
    // localStorage auto run flag
    try {
      const flag = localStorage.getItem("autoRunAudit");
      if (flag === "1" && !hasAutoRun.current && resumeText) {
        hasAutoRun.current = true;
        localStorage.removeItem("autoRunAudit");
        generate();
      }
    } catch {}
    return () => window.removeEventListener("run-audit", handler);
  }, [resumeText]);

  const download = () => {
    const blob = new Blob([report ? JSON.stringify(report, null, 2) : raw], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resume-audit-${job.company?.replace(/\s+/g,'-').toLowerCase() || 'report'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileSearch className="h-5 w-5" /> AI Resume Audit</CardTitle>
        <CardDescription>Actionable enhancements tailored to the selected job</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!report && !raw && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Generate a full audit report with prioritized actions</div>
            <Button onClick={generate} disabled={isLoading}>
              {isLoading ? (<><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Generating...</>) : 'Generate Audit'}
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="space-y-3">
            <div className="text-sm">Analyzing resume and job requirements...</div>
            <Progress value={70} />
          </div>
        )}

        {report && (
          <div className="space-y-6">
            <div>
              <div className="font-medium mb-1">Summary</div>
              <p className="text-sm text-foreground">{report.summary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="font-medium mb-2">ATS Findings</div>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {report.atsFindings.map((i, idx) => (<li key={idx}>{i}</li>))}
                </ul>
              </div>
              <div>
                <div className="font-medium mb-2">Formatting Recommendations</div>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {report.formattingRecommendations.map((i, idx) => (<li key={idx}>{i}</li>))}
                </ul>
              </div>
            </div>

            <div>
              <div className="font-medium mb-2">Keyword Gaps</div>
              <div className="flex flex-wrap gap-2">
                {report.keywordGaps.map((k, idx) => (<Badge key={idx} variant="secondary">{k}</Badge>))}
              </div>
            </div>

            <div>
              <div className="font-medium mb-2">Accomplishment Suggestions</div>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {report.accomplishmentsSuggestions.map((s, idx) => (<li key={idx}>{s}</li>))}
              </ul>
            </div>

            <div>
              <div className="font-medium mb-2">Bullet Rewrites</div>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {report.bulletRewrites.map((s, idx) => (<li key={idx}>{s}</li>))}
              </ul>
            </div>

            <div>
              <div className="font-medium mb-2">Prioritized Actions</div>
              <div className="space-y-2">
                {report.prioritizedActions.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-md border">
                    <div className="text-sm">{p.action}</div>
                    <Badge className={p.impact === 'high' ? 'bg-destructive text-destructive-foreground' : p.impact === 'medium' ? 'bg-warning text-warning-foreground' : 'bg-secondary'}>
                      {p.impact}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={generate}><RefreshCw className="h-4 w-4 mr-2" /> Regenerate</Button>
              <Button onClick={download}><Download className="h-4 w-4 mr-2" /> Download JSON</Button>
            </div>
          </div>
        )}

        {!isLoading && !report && raw && (
          <div className="text-sm text-muted-foreground">{raw}</div>
        )}
      </CardContent>
    </Card>
  );
}; 