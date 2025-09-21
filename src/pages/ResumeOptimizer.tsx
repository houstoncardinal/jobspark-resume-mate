import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { PAGE_SEO } from '@/lib/seo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Upload, 
  FileText, 
  Sparkles, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  Download,
  Eye,
  BarChart3,
  Target,
  Zap,
  TrendingUp
} from 'lucide-react';

const ResumeOptimizer = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [optimizationResults, setOptimizationResults] = useState({
    atsScore: 85,
    keywordMatch: 78,
    suggestions: [
      'Add more industry-specific keywords',
      'Quantify your achievements with numbers',
      'Improve action verb usage',
      'Optimize for ATS formatting'
    ]
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResumeFile(file);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysisComplete(true);
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <>
      <SEO seoData={PAGE_SEO['/resume-optimizer']} url="/resume-optimizer" />
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => window.history.back()}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Resume Tools
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume Optimizer</h1>
            <p className="text-gray-600">Upload your resume and get AI-powered optimization suggestions</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Your Resume
                </CardTitle>
                <CardDescription>
                  Upload your current resume in PDF, DOC, or DOCX format
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="cursor-pointer"
                  >
                    <Button variant="outline" className="mb-2">
                      Choose File
                    </Button>
                    <p className="text-sm text-gray-500">
                      {resumeFile ? resumeFile.name : 'No file selected'}
                    </p>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description (Optional)
                  </label>
                  <Textarea
                    placeholder="Paste the job description to optimize your resume for specific roles..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button 
                  onClick={handleAnalyze}
                  disabled={!resumeFile || isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Analyze Resume
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Analysis Results
                </CardTitle>
                <CardDescription>
                  Your resume analysis and optimization suggestions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!analysisComplete ? (
                  <div className="text-center py-8">
                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Upload your resume to see analysis results</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* ATS Score */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-blue-900">ATS Compatibility Score</span>
                        <span className="text-2xl font-bold text-blue-600">{optimizationResults.atsScore}%</span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${optimizationResults.atsScore}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Keyword Match */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-green-900">Keyword Match</span>
                        <span className="text-2xl font-bold text-green-600">{optimizationResults.keywordMatch}%</span>
                      </div>
                      <div className="w-full bg-green-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${optimizationResults.keywordMatch}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Suggestions */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Optimization Suggestions</h3>
                      <div className="space-y-2">
                        {optimizationResults.suggestions.map((suggestion, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                            <span className="text-sm text-gray-700">{suggestion}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download Optimized Resume
                      </Button>
                      <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ResumeOptimizer;
