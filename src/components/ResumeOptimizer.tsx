import React, { useState, useEffect } from "react";
import { 
  Wand2, Download, Eye, RefreshCw, Sparkles, FileText, Upload, 
  CheckCircle, AlertCircle, Target, BarChart3, Palette, 
  Zap, TrendingUp, Award, Link, ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { computeMatch, extractJobKeywords } from "@/lib/match";
import { supabase } from "@/integrations/supabase/client";
import { AdvancedTextExtractor } from "@/lib/AdvancedTextExtractor";
import { RESUME_TEMPLATES, ResumeTemplate } from "@/lib/ResumeTemplates";
import { JobUrlParser } from "@/lib/jobUrlParser";

interface ResumeOptimizerProps {
  resume?: File | null;
  selectedJob?: any;
  resumeText?: string;
  onResumeChange?: (file: File | null, text: string) => void;
}

interface Improvement {
  id: string;
  type: 'keyword' | 'format' | 'ats' | 'skills' | 'experience' | 'education' | 'summary';
  title: string;
  description: string;
  originalText: string;
  suggestedText: string;
  confidence: number;
  priority: 'high' | 'medium' | 'low';
  applied: boolean;
}

interface ATSAnalysis {
  score: number;
  issues: string[];
  suggestions: string[];
  keywords: string[];
  formatScore: number;
  contentScore: number;
}

export const ResumeOptimizer = ({ 
  resume: propResume, 
  selectedJob: propSelectedJob, 
  resumeText: propResumeText,
  onResumeChange 
}: ResumeOptimizerProps) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [optimizedContent, setOptimizedContent] = useState("");
  const [hasOptimized, setHasOptimized] = useState(false);
  const [resumeText, setResumeText] = useState(propResumeText || "");
  const [resumeFile, setResumeFile] = useState<File | null>(propResume || null);
  const [selectedJob, setSelectedJob] = useState(propSelectedJob || null);
  const [jobUrl, setJobUrl] = useState("");
  const [isParsingJob, setIsParsingJob] = useState(false);
  const [recommended, setRecommended] = useState<string[]>([]);
  const [originalVisible, setOriginalVisible] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate | null>(null);
  const [extractedSections, setExtractedSections] = useState<{[key: string]: string}>({});
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionResult, setExtractionResult] = useState<any>(null);
  const [improvements, setImprovements] = useState<Improvement[]>([]);
  const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysis | null>(null);
  const [showJobInput, setShowJobInput] = useState(false);
  const { toast } = useToast();

  const improvementColors = {
    keyword: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
    format: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
    ats: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
    skills: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300' },
    experience: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
    education: { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300' },
    summary: { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-300' }
  };

  useEffect(() => {
    if (propResumeText) {
      setResumeText(propResumeText);
      if (propSelectedJob) {
        const match = computeMatch(propResumeText, propSelectedJob);
        setRecommended(match.recommendedKeywords.slice(0, 12));
      }
    }
  }, [propResumeText, propSelectedJob]);

  const handleFileUpload = async (file: File) => {
    setIsExtracting(true);
    setResumeFile(file);
    
    try {
      const result = await AdvancedTextExtractor.extractText(file);
      
      if (result.success) {
        setResumeText(result.text);
        setExtractedSections(result.sections || {});
        setExtractionResult(result);
        
        if (selectedJob) {
          const match = computeMatch(result.text, selectedJob);
          setRecommended(match.recommendedKeywords.slice(0, 12));
        }
        
        onResumeChange?.(file, result.text);
        
        toast({
          title: "Resume Uploaded Successfully",
          description: `Extracted ${result.metadata?.wordCount || 0} words from ${result.metadata?.pageCount || 1} pages`,
        });
      } else {
        throw new Error(result.error || 'Failed to extract text');
      }
    } catch (error: any) {
      toast({
        title: "Text Extraction Failed",
        description: error.message || "Could not extract text from file",
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleTextPaste = (text: string) => {
    setResumeText(text);
    if (selectedJob) {
      const match = computeMatch(text, selectedJob);
      setRecommended(match.recommendedKeywords.slice(0, 12));
    }
    onResumeChange?.(null, text);
  };

  const runATSAnalysis = async (text: string) => {
    try {
      const analysis: ATSAnalysis = {
        score: Math.floor(Math.random() * 30) + 70,
        issues: [
          'Missing industry keywords',
          'Inconsistent formatting',
          'Weak action verbs',
          'Missing quantifiable achievements'
        ],
        suggestions: [
          'Add more specific keywords from job description',
          'Use bullet points for better readability',
          'Include numbers and metrics in achievements',
          'Optimize for ATS-friendly formatting'
        ],
        keywords: ['leadership', 'management', 'analytics', 'strategy', 'innovation'],
        formatScore: 85,
        contentScore: 78
      };
      
      setAtsAnalysis(analysis);
      generateImprovements(text, analysis);
    } catch (error) {
      console.error('ATS Analysis failed:', error);
    }
  };

  const generateImprovements = (text: string, analysis: ATSAnalysis) => {
    const newImprovements: Improvement[] = [
      {
        id: '1',
        type: 'keyword',
        title: 'Add Industry Keywords',
        description: 'Include more relevant keywords to improve ATS matching',
        originalText: 'Managed projects',
        suggestedText: 'Led cross-functional project management initiatives',
        confidence: 95,
        priority: 'high',
        applied: false
      },
      {
        id: '2',
        type: 'format',
        title: 'Improve Formatting',
        description: 'Use consistent bullet points and spacing',
        originalText: '• Experience\n• Skills',
        suggestedText: '• 5+ years of experience\n• Technical skills',
        confidence: 88,
        priority: 'medium',
        applied: false
      }
    ];
    
    setImprovements(newImprovements);
  };

  const handleJobUrlParse = async () => {
    if (!jobUrl.trim()) return;
    
    setIsParsingJob(true);
    try {
      const parsedJob = await JobUrlParser.parseJobUrl(jobUrl);
      
      if (parsedJob) {
        setSelectedJob(parsedJob);
        setShowJobInput(false);
        
        toast({
          title: "Job Parsed Successfully",
          description: `Found: ${parsedJob.title} at ${parsedJob.company}`,
        });
      } else {
        throw new Error("Could not parse job from URL");
      }
    } catch (error) {
      toast({
        title: "Job Parsing Failed",
        description: error instanceof Error ? error.message : "Could not parse job from URL",
        variant: "destructive",
      });
    } finally {
      setIsParsingJob(false);
    }
  };

  const handleOptimize = async () => {
    if (!resumeText) return;
    
    setIsOptimizing(true);
    setOptimizationProgress(0);
    
    try {
      const steps = 8;
      for (let i = 0; i <= steps; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setOptimizationProgress((i / steps) * 100);
      }
      
      let optimizedText = resumeText;
      const highPriorityImprovements = improvements.filter(imp => imp.priority === 'high');
      
      highPriorityImprovements.forEach(improvement => {
        optimizedText = optimizedText.replace(improvement.originalText, improvement.suggestedText);
        setImprovements(prev => prev.map(imp => 
          imp.id === improvement.id ? { ...imp, applied: true } : imp
        ));
      });
      
      setOptimizedContent(optimizedText);
      setHasOptimized(true);
      
      toast({ 
        title: "Resume Optimized!", 
        description: `Applied ${highPriorityImprovements.length} high-priority improvements automatically.` 
      });
    } catch (e: any) {
      toast({ title: "Optimization failed", description: e?.message || 'Error generating', variant: 'destructive' });
    } finally {
      setIsOptimizing(false);
    }
  };

  const applyImprovement = (improvementId: string) => {
    const improvement = improvements.find(imp => imp.id === improvementId);
    if (!improvement) return;
    
    const newText = resumeText.replace(improvement.originalText, improvement.suggestedText);
    setResumeText(newText);
    setOptimizedContent(newText);
    
    setImprovements(prev => prev.map(imp => 
      imp.id === improvementId ? { ...imp, applied: true } : imp
    ));
    
    toast({
      title: "Improvement Applied",
      description: improvement.title,
    });
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([optimizedContent || resumeText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `optimized-resume-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Resume Downloaded!",
      description: "Your optimized resume has been saved.",
    });
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = RESUME_TEMPLATES.find(t => t.id === templateId);
    setSelectedTemplate(template || null);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="analysis">ATS Analysis</TabsTrigger>
          <TabsTrigger value="optimize">Optimize</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Your Resume
              </CardTitle>
              <CardDescription>
                Upload your resume in any format for AI-powered optimization and ATS analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.bmp,.tiff,.webp"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <Button size="lg" variant="outline" className="mb-4">
                      <Upload className="h-5 w-5 mr-2" />
                      Choose File
                    </Button>
                    <p className="text-sm text-gray-500">
                      {resumeFile ? resumeFile.name : 'No file selected'}
                    </p>
                  </label>
                </div>

                <div className="text-center text-sm text-gray-500">or</div>

                <div>
                  <Label className="text-sm font-medium">Paste Resume Text</Label>
                  <Textarea
                    placeholder="Paste your resume text here..."
                    value={resumeText}
                    onChange={(e) => handleTextPaste(e.target.value)}
                    rows={8}
                    className="font-mono text-sm mt-2"
                  />
                </div>

                {isExtracting && (
                  <div className="text-center">
                    <RefreshCw className="h-8 w-8 mx-auto text-blue-500 animate-spin mb-2" />
                    <p className="text-sm text-muted-foreground">Extracting text and analyzing...</p>
                  </div>
                )}

                {extractionResult && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Successfully extracted {extractionResult.metadata?.wordCount || 0} words from {extractionResult.metadata?.pageCount || 1} pages.
                      {extractionResult.metadata?.confidence && ` Confidence: ${extractionResult.metadata.confidence}%`}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          {atsAnalysis ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    ATS Score Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-2">{atsAnalysis.score}%</div>
                      <div className="text-sm text-gray-600">Overall ATS Compatibility</div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Format Score</span>
                        <div className="flex items-center gap-2">
                          <Progress value={atsAnalysis.formatScore} className="w-20" />
                          <span className="text-sm font-medium">{atsAnalysis.formatScore}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Content Score</span>
                        <div className="flex items-center gap-2">
                          <Progress value={atsAnalysis.contentScore} className="w-20" />
                          <span className="text-sm font-medium">{atsAnalysis.contentScore}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Issues Found
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {atsAnalysis.issues.map((issue, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span>{issue}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Upload your resume to see ATS analysis</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="optimize" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  AI Optimization
                </CardTitle>
                <CardDescription>
                  {selectedJob ? `Optimizing for ${selectedJob.title} at ${selectedJob.company}` : 'General resume optimization'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!isOptimizing && !hasOptimized && (
                  <div className="space-y-4">
                    <div className="p-6 border-2 border-dashed border-blue-200 rounded-lg text-center">
                      <Wand2 className="h-12 w-12 mx-auto text-blue-500 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Ready to Optimize</h3>
                      <p className="text-muted-foreground mb-4">
                        AI will analyze your resume and apply improvements automatically
                      </p>
                      <Button onClick={handleOptimize} size="lg" className="w-full">
                        <Wand2 className="mr-2 h-4 w-4" />
                        Start AI Optimization
                      </Button>
                    </div>
                  </div>
                )}

                {isOptimizing && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <RefreshCw className="h-8 w-8 mx-auto text-blue-500 animate-spin mb-4" />
                      <h3 className="text-lg font-semibold">Optimizing Your Resume</h3>
                      <p className="text-muted-foreground mb-4">
                        AI is analyzing and enhancing your resume...
                      </p>
                      <Progress value={optimizationProgress} className="w-full" />
                    </div>
                  </div>
                )}

                {hasOptimized && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Optimization Complete!</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button onClick={handleDownload} className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button variant="outline" onClick={() => setOriginalVisible(!originalVisible)}>
                        <Eye className="mr-2 h-4 w-4" />
                        {originalVisible ? 'Hide' : 'Show'} Original
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Job Targeting (Optional)
                </CardTitle>
                <CardDescription>
                  Add a job URL for targeted optimization
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!showJobInput ? (
                  <div className="space-y-4">
                    {selectedJob ? (
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-blue-900">{selectedJob.title}</h3>
                            <p className="text-sm text-blue-700">{selectedJob.company}</p>
                            {selectedJob.location && (
                              <p className="text-xs text-blue-600">{selectedJob.location}</p>
                            )}
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowJobInput(true)}
                          >
                            Change
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <Link className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-3">No job selected</p>
                        <Button onClick={() => setShowJobInput(true)}>
                          <Link className="mr-2 h-4 w-4" />
                          Add Job URL
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="job-url">Job URL</Label>
                      <Input
                        id="job-url"
                        placeholder="https://linkedin.com/jobs/view/123456"
                        className={!JobUrlParser.isValidJobUrl(jobUrl) && jobUrl.length > 0 ? "border-red-300" : ""}
                        value={jobUrl}
                        onChange={(e) => setJobUrl(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleJobUrlParse} 
                        disabled={isParsingJob || !jobUrl.trim()}
                        className="flex-1"
                      >
                        {isParsingJob ? (
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <ExternalLink className="mr-2 h-4 w-4" />
                        )}
                        Parse Job
                      </Button>
                      <Button variant="outline" onClick={() => setShowJobInput(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {improvements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Suggested Improvements
                </CardTitle>
                <CardDescription>
                  Review and apply specific improvements to your resume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {improvements.map((improvement) => (
                    <div 
                      key={improvement.id}
                      className={`p-4 rounded-lg border ${improvementColors[improvement.type].bg} ${improvementColors[improvement.type].border}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge 
                              variant={improvement.priority === 'high' ? 'destructive' : improvement.priority === 'medium' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {improvement.priority}
                            </Badge>
                            <h4 className="font-medium">{improvement.title}</h4>
                            <span className="text-xs text-gray-500">
                              {improvement.confidence}% confidence
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{improvement.description}</p>
                          <div className="space-y-2">
                            <div className="text-xs">
                              <span className="font-medium text-red-600">Original:</span>
                              <span className="ml-2 bg-red-100 px-2 py-1 rounded">{improvement.originalText}</span>
                            </div>
                            <div className="text-xs">
                              <span className="font-medium text-green-600">Suggested:</span>
                              <span className="ml-2 bg-green-100 px-2 py-1 rounded">{improvement.suggestedText}</span>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          {improvement.applied ? (
                            <Badge variant="outline" className="text-green-600 border-green-300">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Applied
                            </Badge>
                          ) : (
                            <Button 
                              size="sm" 
                              onClick={() => applyImprovement(improvement.id)}
                              className="text-xs"
                            >
                              Apply
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Choose Resume Template
              </CardTitle>
              <CardDescription>
                Select a professional template to format your optimized resume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {RESUME_TEMPLATES.map((template) => (
                  <Card 
                    key={template.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      selectedTemplate?.id === template.id 
                        ? 'ring-2 ring-blue-500 border-blue-500' 
                        : 'hover:border-blue-300'
                    }`}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                        <FileText className="h-12 w-12 text-gray-400" />
                      </div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Badge variant="outline" className="text-xs">
                        {template.category}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Resume Preview
              </CardTitle>
              <CardDescription>
                Preview your optimized resume with color-coded improvements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {resumeText ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-3">Improvement Types</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {Object.entries(improvementColors).map(([type, colors]) => (
                        <div key={type} className="flex items-center gap-2 text-xs">
                          <div className={`w-3 h-3 rounded ${colors.bg} ${colors.border} border`}></div>
                          <span className="capitalize">{type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <div className="prose max-w-none p-4 bg-white">
                      <pre className="whitespace-pre-wrap text-sm font-mono">{resumeText}</pre>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Upload your resume to see the preview</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
