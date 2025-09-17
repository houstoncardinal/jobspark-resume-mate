import { useState, useCallback } from "react";
import * as React from "react";
import { Upload, FileText, Check, AlertCircle, ClipboardPaste, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface ResumeUploadProps {
  onResumeUpload: (file: File) => void;
  uploadedResume?: File | null;
}

export const ResumeUpload = ({ onResumeUpload, uploadedResume: existingResume }: ResumeUploadProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(existingResume || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [pastedText, setPastedText] = useState("");
  const { toast } = useToast();

  // Update local state when prop changes
  React.useEffect(() => {
    if (existingResume && !uploadedFile) {
      setUploadedFile(existingResume);
    }
  }, [existingResume, uploadedFile]);

  const dispatchResumeText = (text: string) => {
    try { localStorage.setItem('resumeText', text); } catch {}
    const event = new CustomEvent("resume-text-updated", { detail: { text } });
    window.dispatchEvent(event);
  };

  const dispatchNavigate = (tab: string) => {
    const event = new CustomEvent("navigate-tab", { detail: { tab } });
    window.dispatchEvent(event);
  };

  const runAuditSoon = () => {
    try { localStorage.setItem('autoRunAudit', '1'); } catch {}
    const evt = new Event('run-audit');
    setTimeout(() => window.dispatchEvent(evt), 400);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    if (file && (file.type === 'application/pdf' || file.type.includes('document') || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'text/plain')) {
      handleFileUpload(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, Word document, or plain text file",
        variant: "destructive",
      });
    }
  }, []);

  const extractPdfText = async (file: File) => {
    try {
      // Load pdf.js from CDN to avoid bundler type issues
      // @ts-ignore
      const pdfjs = await import(/* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.mjs');
      // @ts-ignore
      const workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.mjs';
      // @ts-ignore
      pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
      const arrayBuffer = await file.arrayBuffer();
      // @ts-ignore
      const doc = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      let text = '';
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((it: any) => it.str);
        text += strings.join(' ') + '\n';
      }
      return text;
    } catch (e) {
      return '';
    }
  };

  const extractDocxText = async (file: File) => {
    try {
      // Load mammoth from CDN for browser
      // @ts-ignore
      const mammoth = (await import(/* @vite-ignore */ 'https://unpkg.com/mammoth/mammoth.browser.min.js')).default || (window as any).mammoth;
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value || '';
    } catch (e) {
      return '';
    }
  };

  const tryExtractText = async (file: File) => {
    if (file.type === 'text/plain') {
      try { return await file.text(); } catch { return ''; }
    }
    if (file.type === 'application/pdf') {
      return await extractPdfText(file);
    }
    if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.toLowerCase().endsWith('.docx')) {
      return await extractDocxText(file);
    }
    return '';
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadedFile(file);
          onResumeUpload(file);
          (async () => {
            const text = await tryExtractText(file);
            if (text.trim()) {
              dispatchResumeText(text);
              toast({ title: "Text extracted", description: "We parsed your resume text for analysis." });
            }
          })();
          toast({
            title: "Resume uploaded successfully",
            description: "Next: run Match Analysis, AI Audit, or open the Resume Builder",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handlePasteUse = () => {
    if (!pastedText.trim()) {
      toast({ title: "No text provided", description: "Paste your resume text first.", variant: "destructive" });
      return;
    }
    dispatchResumeText(pastedText);
    toast({ title: "Resume text ready", description: "Opening Match Analysis..." });
    dispatchNavigate('match');
  };

  const hasSelectedJob = () => {
    try { return !!localStorage.getItem('selectedJob'); } catch { return false; }
  };

  const openBuilder = () => {
    window.location.href = '/builder';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resume Upload
          </CardTitle>
          <CardDescription>
            Upload your resume or paste text to get started with AI-powered optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver
                ? 'border-primary bg-primary/5'
                : uploadedFile
                ? 'border-success bg-success/5'
                : 'border-border hover:border-primary/50'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
          >
            {isUploading ? (
              <div className="space-y-4">
                <Upload className="h-12 w-12 mx-auto text-primary animate-pulse" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Uploading Resume...</p>
                  <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                  <p className="text-sm text-muted-foreground">{uploadProgress}% complete</p>
                </div>
              </div>
            ) : uploadedFile ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="p-3 rounded-full bg-success/20">
                    <Check className="h-8 w-8 text-success" />
                  </div>
                </div>
                <div>
                  <p className="text-lg font-medium text-success">Resume Uploaded Successfully</p>
                  <p className="text-muted-foreground">{uploadedFile.name}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button variant="outline" onClick={() => document.getElementById('resume-upload')?.click()}>Upload Different Resume</Button>
                  <Button onClick={() => { dispatchNavigate('match'); }}>
                    Go to Match Analysis <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                  <Button onClick={() => { if (hasSelectedJob()) { dispatchNavigate('match'); runAuditSoon(); } else { toast({ title: 'Select a job first', description: 'Choose a job to tailor the audit.' }); dispatchNavigate('search'); } }}>
                    Run AI Audit <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                  <Button onClick={openBuilder}>
                    Open Resume Builder <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-lg font-medium">Drop your resume here</p>
                  <p className="text-muted-foreground">or click to browse files</p>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => document.getElementById('resume-upload')?.click()}
                >
                  Choose File
                </Button>
              </div>
            )}
            
            <input
              id="resume-upload"
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">Or paste your resume text</div>
            </div>
            <Textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste the full text of your resume here..."
              className="min-h-[160px]"
            />
            <div className="flex justify-end mt-2">
              <Button onClick={handlePasteUse}>
                <ClipboardPaste className="h-4 w-4 mr-2" />
                Use Pasted Text
              </Button>
            </div>
          </div>

          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Supported formats: PDF, DOC, DOCX, TXT. Your resume will be analyzed for ATS compatibility and optimized for job matching.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};