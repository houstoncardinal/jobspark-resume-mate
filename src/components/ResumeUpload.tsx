import { useState, useCallback } from "react";
import * as React from "react";
import { Upload, FileText, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface ResumeUploadProps {
  onResumeUpload: (file: File) => void;
  uploadedResume?: File | null;
}

export const ResumeUpload = ({ onResumeUpload, uploadedResume: existingResume }: ResumeUploadProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(existingResume || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

  // Update local state when prop changes
  React.useEffect(() => {
    if (existingResume && !uploadedFile) {
      setUploadedFile(existingResume);
    }
  }, [existingResume, uploadedFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && (file.type === 'application/pdf' || file.type.includes('document'))) {
      handleFileUpload(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or Word document",
        variant: "destructive",
      });
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadedFile(file);
          onResumeUpload(file);
          toast({
            title: "Resume uploaded successfully",
            description: "Your resume has been parsed and is ready for optimization",
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resume Upload
          </CardTitle>
          <CardDescription>
            Upload your resume to get started with AI-powered optimization
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
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById('resume-upload')?.click()}
                >
                  Upload Different Resume
                </Button>
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
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Supported formats: PDF, DOC, DOCX. Your resume will be analyzed for ATS compatibility and optimized for job matching.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {uploadedFile && (
        <Card>
          <CardHeader>
            <CardTitle>Resume Analysis</CardTitle>
            <CardDescription>
              AI-powered insights about your resume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-success/10">
                <div className="text-2xl font-bold text-success">87%</div>
                <div className="text-sm text-muted-foreground">ATS Score</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-warning/10">
                <div className="text-2xl font-bold text-warning">6</div>
                <div className="text-sm text-muted-foreground">Skills Detected</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-primary/10">
                <div className="text-2xl font-bold text-primary">4.2</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};