import React, { useState } from 'react';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { PAGE_SEO } from '@/lib/seo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft,
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Download,
  BarChart3,
  Target,
  Zap,
  TrendingUp
} from 'lucide-react';

const ResumeScanner = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanResults, setScanResults] = useState({
    atsScore: 78,
    keywordDensity: 65,
    formatScore: 92,
    issues: [
      { type: 'warning', message: 'Missing industry keywords', severity: 'medium' },
      { type: 'error', message: 'Inconsistent date formatting', severity: 'high' },
      { type: 'info', message: 'Consider adding quantifiable achievements', severity: 'low' }
    ],
    suggestions: [
      'Add more action verbs to strengthen your experience descriptions',
      'Include specific metrics and numbers to quantify your achievements',
      'Ensure consistent formatting throughout the document',
      'Add relevant keywords from the job description'
    ]
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResumeFile(file);
    }
  };

  const handleScan = async () => {
    setIsScanning(true);
    // Simulate scanning process
    setTimeout(() => {
      setScanComplete(true);
      setIsScanning(false);
    }, 4000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <>
      <SEO seoData={PAGE_SEO['/resume-scanner']} url="/resume-scanner" />
      <div className="min-h-screen bg-gray-50">
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume Scanner</h1>
            <p className="text-gray-600">Get instant ATS compatibility and keyword analysis</p>
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
                  Upload your resume to get instant ATS compatibility analysis
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

                <Button 
                  onClick={handleScan}
                  disabled={!resumeFile || isScanning}
                  className="w-full"
                >
                  {isScanning ? (
                    <>
                      <Zap className="h-4 w-4 mr-2 animate-pulse" />
                      Scanning Resume...
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Scan Resume
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
                  Scan Results
                </CardTitle>
                <CardDescription>
                  Your resume analysis and compatibility scores
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!scanComplete ? (
                  <div className="text-center py-8">
                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Upload your resume to see scan results</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* ATS Score */}
                    <div className={`${getScoreBgColor(scanResults.atsScore)} rounded-lg p-4`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">ATS Compatibility</span>
                        <span className={`text-2xl font-bold ${getScoreColor(scanResults.atsScore)}`}>
                          {scanResults.atsScore}%
                        </span>
                      </div>
                      <Progress value={scanResults.atsScore} className="h-2" />
                    </div>

                    {/* Keyword Density */}
                    <div className={`${getScoreBgColor(scanResults.keywordDensity)} rounded-lg p-4`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Keyword Density</span>
                        <span className={`text-2xl font-bold ${getScoreColor(scanResults.keywordDensity)}`}>
                          {scanResults.keywordDensity}%
                        </span>
                      </div>
                      <Progress value={scanResults.keywordDensity} className="h-2" />
                    </div>

                    {/* Format Score */}
                    <div className={`${getScoreBgColor(scanResults.formatScore)} rounded-lg p-4`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Format Quality</span>
                        <span className={`text-2xl font-bold ${getScoreColor(scanResults.formatScore)}`}>
                          {scanResults.formatScore}%
                        </span>
                      </div>
                      <Progress value={scanResults.formatScore} className="h-2" />
                    </div>

                    {/* Issues */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Issues Found</h3>
                      <div className="space-y-2">
                        {scanResults.issues.map((issue, index) => (
                          <div key={index} className="flex items-start gap-2">
                            {issue.type === 'error' && <XCircle className="h-4 w-4 text-red-500 mt-0.5" />}
                            {issue.type === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />}
                            {issue.type === 'info' && <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />}
                            <div>
                              <span className="text-sm text-gray-700">{issue.message}</span>
                              <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                                issue.severity === 'high' ? 'bg-red-100 text-red-700' :
                                issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {issue.severity}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download Report
                      </Button>
                      <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Suggestions Section */}
          {scanComplete && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Improvement Suggestions
                </CardTitle>
                <CardDescription>
                  Actionable tips to improve your resume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {scanResults.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                      <span className="text-sm text-gray-700">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ResumeScanner;
