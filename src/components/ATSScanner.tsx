import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Eye,
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  Target,
  Zap,
  Download,
  RefreshCw,
  Search,
  TrendingUp,
  Award,
  Flag
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AdvancedTextExtractor } from '@/lib/AdvancedTextExtractor';

interface ATSMetrics {
  overallScore: number;
  formatScore: number;
  keywordScore: number;
  structureScore: number;
  readabilityScore: number;
  sectionScore: number;
}

interface ATSIssue {
  type: 'critical' | 'warning' | 'suggestion';
  category: string;
  title: string;
  description: string;
  fix: string;
  impact: 'high' | 'medium' | 'low';
}

interface KeywordAnalysis {
  found: string[];
  missing: string[];
  density: { [key: string]: number };
  recommendations: string[];
}

const ATSScanner = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [metrics, setMetrics] = useState<ATSMetrics | null>(null);
  const [issues, setIssues] = useState<ATSIssue[]>([]);
  const [keywordAnalysis, setKeywordAnalysis] = useState<KeywordAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState('upload');
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setResumeFile(file);
    
    try {
      const result = await AdvancedTextExtractor.extractText(file);
      setResumeText(result.text);
      
      toast({
        title: "Resume Uploaded!",
        description: "Your resume has been processed and is ready for ATS scanning.",
      });
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "There was an error processing your resume. Please try again.",
        variant: "destructive"
      });
    }
  };

  const performATSScan = async () => {
    if (!resumeText) {
      toast({
        title: "No Resume Detected",
        description: "Please upload a resume first.",
        variant: "destructive"
      });
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setActiveTab('results');

    // Simulate scanning process
    const progressSteps = [
      { progress: 20, message: "Analyzing document format..." },
      { progress: 40, message: "Scanning for ATS compatibility..." },
      { progress: 60, message: "Checking keywords and phrases..." },
      { progress: 80, message: "Evaluating structure and sections..." },
      { progress: 100, message: "Generating recommendations..." }
    ];

    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setScanProgress(step.progress);
    }

    // Perform actual analysis
    const analysisResults = analyzeResumeForATS(resumeText, jobDescription);
    setMetrics(analysisResults.metrics);
    setIssues(analysisResults.issues);
    setKeywordAnalysis(analysisResults.keywords);

    setIsScanning(false);
    
    toast({
      title: "ATS Scan Complete!",
      description: `Your resume scored ${analysisResults.metrics.overallScore}% ATS compatibility.`,
    });
  };

  const analyzeResumeForATS = (text: string, jobDesc: string): {
    metrics: ATSMetrics;
    issues: ATSIssue[];
    keywords: KeywordAnalysis;
  } => {
    // Format analysis
    const hasProperSections = /EXPERIENCE|EDUCATION|SKILLS|SUMMARY/i.test(text);
    const hasPhoneNumber = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(text);
    const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(text);
    const hasBulletPoints = /•|\*|-/.test(text);
    
    // Structure analysis
    const wordCount = text.split(/\s+/).length;
    const sectionCount = text.split(/\n\s*\n/).length;
    const averageWordsPerSection = wordCount / sectionCount;
    
    // Keyword analysis
    const commonKeywords = [
      'leadership', 'management', 'communication', 'teamwork', 'problem-solving',
      'analytical', 'strategic', 'innovative', 'collaborative', 'results-driven',
      'experienced', 'accomplished', 'successful', 'skilled', 'proficient'
    ];
    
    const jobKeywords = jobDesc ? extractKeywordsFromJobDescription(jobDesc) : [];
    const allKeywords = [...commonKeywords, ...jobKeywords];
    
    const foundKeywords = allKeywords.filter(keyword => 
      new RegExp(`\\b${keyword}\\b`, 'i').test(text)
    );
    
    const missingKeywords = allKeywords.filter(keyword => 
      !new RegExp(`\\b${keyword}\\b`, 'i').test(text)
    );

    // Calculate scores
    const formatScore = (
      (hasProperSections ? 25 : 0) +
      (hasPhoneNumber ? 25 : 0) +
      (hasEmail ? 25 : 0) +
      (hasBulletPoints ? 25 : 0)
    );

    const structureScore = Math.min(100, Math.max(0, 
      (sectionCount >= 4 ? 30 : sectionCount * 7.5) +
      (averageWordsPerSection > 50 && averageWordsPerSection < 200 ? 40 : 20) +
      (wordCount >= 300 && wordCount <= 800 ? 30 : 15)
    ));

    const keywordScore = Math.min(100, (foundKeywords.length / allKeywords.length) * 100);
    const readabilityScore = Math.min(100, Math.max(60, 100 - (text.length / wordCount - 5) * 10));
    const sectionScore = hasProperSections ? 90 : 50;

    const overallScore = Math.round(
      (formatScore * 0.25) +
      (structureScore * 0.2) +
      (keywordScore * 0.25) +
      (readabilityScore * 0.15) +
      (sectionScore * 0.15)
    );

    // Generate issues
    const issues: ATSIssue[] = [];
    
    if (!hasEmail) {
      issues.push({
        type: 'critical',
        category: 'Contact Info',
        title: 'Missing Email Address',
        description: 'Your resume doesn\'t contain a valid email address.',
        fix: 'Add your professional email address at the top of your resume.',
        impact: 'high'
      });
    }

    if (!hasPhoneNumber) {
      issues.push({
        type: 'warning',
        category: 'Contact Info',
        title: 'Missing Phone Number',
        description: 'No phone number detected in your resume.',
        fix: 'Include your phone number in the contact information section.',
        impact: 'medium'
      });
    }

    if (!hasBulletPoints) {
      issues.push({
        type: 'warning',
        category: 'Format',
        title: 'No Bullet Points Detected',
        description: 'Bullet points help ATS systems parse your content better.',
        fix: 'Use bullet points to list your achievements and responsibilities.',
        impact: 'medium'
      });
    }

    if (wordCount < 300) {
      issues.push({
        type: 'warning',
        category: 'Content',
        title: 'Resume Too Short',
        description: 'Your resume appears to be quite brief.',
        fix: 'Add more details about your experience and achievements.',
        impact: 'medium'
      });
    }

    if (keywordScore < 50) {
      issues.push({
        type: 'suggestion',
        category: 'Keywords',
        title: 'Low Keyword Density',
        description: 'Your resume contains few relevant keywords.',
        fix: 'Include more industry-relevant keywords and skills.',
        impact: 'high'
      });
    }

    return {
      metrics: {
        overallScore,
        formatScore,
        keywordScore,
        structureScore,
        readabilityScore,
        sectionScore
      },
      issues,
      keywords: {
        found: foundKeywords,
        missing: missingKeywords.slice(0, 10),
        density: foundKeywords.reduce((acc, keyword) => {
          const matches = text.match(new RegExp(`\\b${keyword}\\b`, 'gi'));
          acc[keyword] = matches ? matches.length : 0;
          return acc;
        }, {} as { [key: string]: number }),
        recommendations: missingKeywords.slice(0, 5)
      }
    };
  };

  const extractKeywordsFromJobDescription = (jobDesc: string): string[] => {
    const commonJobKeywords = [
      'required', 'experience', 'skills', 'bachelor', 'master', 'degree',
      'years', 'proficient', 'knowledge', 'familiar', 'responsible',
      'manage', 'develop', 'create', 'implement', 'maintain', 'support'
    ];
    
    // Simple keyword extraction - in a real app, this would be more sophisticated
    const words = jobDesc.toLowerCase().split(/[^a-zA-Z]+/).filter(word => 
      word.length > 3 && !commonJobKeywords.includes(word)
    );
    
    // Return most frequent words
    const frequency: { [key: string]: number } = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const exportReport = () => {
    if (!metrics) return;
    
    const report = `ATS Compatibility Report
Generated: ${new Date().toLocaleDateString()}

Overall Score: ${metrics.overallScore}%
- Format Score: ${metrics.formatScore}%
- Keyword Score: ${metrics.keywordScore}%
- Structure Score: ${metrics.structureScore}%
- Readability Score: ${metrics.readabilityScore}%
- Section Score: ${metrics.sectionScore}%

Issues Found: ${issues.length}
${issues.map(issue => `- ${issue.title}: ${issue.description}`).join('\n')}

Keywords Found: ${keywordAnalysis?.found.length || 0}
Missing Keywords: ${keywordAnalysis?.missing.join(', ') || 'None'}
`;

    const element = document.createElement('a');
    const file = new Blob([report], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'ATS_Report.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">ATS Compatibility Scanner</h1>
        <p className="text-lg text-gray-600">Analyze your resume's compatibility with Applicant Tracking Systems</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload Resume</TabsTrigger>
          <TabsTrigger value="job-desc">Job Description</TabsTrigger>
          <TabsTrigger value="results">Scan Results</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-blue-600" />
                Upload Your Resume
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!resumeFile ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Resume</h3>
                  <p className="text-gray-600 mb-4">
                    Supported formats: PDF, DOC, DOCX
                  </p>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="max-w-xs mx-auto"
                  />
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div>
                      <h3 className="font-medium text-green-900">{resumeFile.name}</h3>
                      <p className="text-sm text-green-700">Resume uploaded successfully</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button onClick={() => setActiveTab('job-desc')}>
                      Next: Add Job Description
                    </Button>
                    <Button variant="outline" onClick={() => setResumeFile(null)}>
                      Upload Different File
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="job-desc" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Job Description (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Paste the job description to get more targeted keyword analysis and recommendations.
              </p>
              <textarea
                className="w-full h-40 p-3 border border-gray-300 rounded-lg resize-none"
                placeholder="Paste the job description here for better keyword matching..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={performATSScan} disabled={!resumeText}>
                  <Eye className="h-4 w-4 mr-2" />
                  Start ATS Scan
                </Button>
                <Button variant="outline" onClick={() => setActiveTab('upload')}>
                  Back to Upload
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {isScanning ? (
            <Card>
              <CardContent className="p-12 text-center">
                <RefreshCw className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Scanning Your Resume</h3>
                <p className="text-gray-600 mb-4">
                  Analyzing ATS compatibility and generating recommendations...
                </p>
                <Progress value={scanProgress} className="w-full max-w-md mx-auto" />
              </CardContent>
            </Card>
          ) : metrics ? (
            <div className="space-y-6">
              {/* Overall Score */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      ATS Compatibility Score
                    </CardTitle>
                    <Button variant="outline" onClick={exportReport}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className={`text-6xl font-bold ${getScoreColor(metrics.overallScore)}`}>
                      {metrics.overallScore}%
                    </div>
                    <Badge className={`mt-2 ${getScoreBadgeColor(metrics.overallScore)}`}>
                      {metrics.overallScore >= 80 ? 'Excellent' : 
                       metrics.overallScore >= 60 ? 'Good' : 'Needs Improvement'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {Object.entries({
                      'Format': metrics.formatScore,
                      'Keywords': metrics.keywordScore,
                      'Structure': metrics.structureScore,
                      'Readability': metrics.readabilityScore,
                      'Sections': metrics.sectionScore
                    }).map(([category, score]) => (
                      <div key={category} className="text-center">
                        <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
                          {score}%
                        </div>
                        <div className="text-sm text-gray-600">{category}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Issues */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    Issues & Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {issues.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">No Issues Found!</h3>
                      <p className="text-gray-600">Your resume passes all ATS compatibility checks.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {issues.map((issue, index) => (
                        <div key={index} className={`p-4 rounded-lg border-l-4 ${
                          issue.type === 'critical' ? 'bg-red-50 border-red-500' :
                          issue.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                          'bg-blue-50 border-blue-500'
                        }`}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                {issue.type === 'critical' ? <XCircle className="h-4 w-4 text-red-600" /> :
                                 issue.type === 'warning' ? <AlertTriangle className="h-4 w-4 text-yellow-600" /> :
                                 <Flag className="h-4 w-4 text-blue-600" />}
                                <h4 className="font-medium text-gray-900">{issue.title}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {issue.category}
                                </Badge>
                              </div>
                              <p className="text-gray-700 mb-2">{issue.description}</p>
                              <p className="text-sm text-gray-600">
                                <strong>Fix:</strong> {issue.fix}
                              </p>
                            </div>
                            <Badge className={`${
                              issue.impact === 'high' ? 'bg-red-100 text-red-800' :
                              issue.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {issue.impact} impact
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Keywords */}
              {keywordAnalysis && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-purple-600" />
                      Keyword Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Found Keywords ({keywordAnalysis.found.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {keywordAnalysis.found.map((keyword, index) => (
                            <Badge key={index} className="bg-green-100 text-green-800">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-600" />
                          Missing Keywords
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {keywordAnalysis.missing.map((keyword, index) => (
                            <Badge key={index} className="bg-red-100 text-red-800">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No Scan Results</h3>
                <p className="text-gray-600 mb-4">
                  Upload your resume and start the ATS scan to see detailed compatibility analysis.
                </p>
                <Button onClick={() => setActiveTab('upload')}>
                  Upload Resume
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ATSScanner;