import React, { useState } from 'react';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { PAGE_SEO } from '@/lib/seo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Upload,
  FileText,
  Star,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  MessageSquare,
  Download,
  Eye,
  BarChart3
} from 'lucide-react';

const ResumeReview = () => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewComplete, setReviewComplete] = useState(false);
  const [reviewData, setReviewData] = useState({
    overallScore: 8.5,
    categories: [
      { name: 'Content Quality', score: 9.0, comment: 'Excellent content with strong achievements' },
      { name: 'Format & Design', score: 8.0, comment: 'Good formatting, could use more visual hierarchy' },
      { name: 'ATS Compatibility', score: 7.5, comment: 'Generally ATS-friendly, some improvements needed' },
      { name: 'Keywords', score: 8.5, comment: 'Good keyword usage throughout the resume' }
    ],
    strengths: [
      'Strong quantifiable achievements',
      'Clear and concise descriptions',
      'Good use of action verbs',
      'Professional formatting'
    ],
    improvements: [
      'Add more industry-specific keywords',
      'Consider adding a skills section',
      'Include more metrics and numbers',
      'Optimize for ATS scanning'
    ],
    expertComments: [
      {
        section: 'Professional Summary',
        rating: 4,
        comment: 'Your professional summary effectively highlights your key strengths and career objectives. Consider adding a specific achievement or metric to make it more compelling.'
      },
      {
        section: 'Work Experience',
        rating: 5,
        comment: 'Excellent work experience section with strong action verbs and quantifiable results. The progression of responsibilities is clearly demonstrated.'
      },
      {
        section: 'Education',
        rating: 4,
        comment: 'Education section is well-formatted. Consider adding relevant coursework or academic achievements if applicable.'
      }
    ]
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResumeFile(file);
    }
  };

  const handleReview = async () => {
    setIsReviewing(true);
    // Simulate expert review process
    setTimeout(() => {
      setReviewComplete(true);
      setIsReviewing(false);
    }, 5000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 8) return 'bg-green-100';
    if (score >= 6) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <>
      <SEO seoData={PAGE_SEO['/resume-review']} url="/resume-review" />
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume Review</h1>
            <p className="text-gray-600">Get professional feedback from resume experts</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Submit Your Resume
                </CardTitle>
                <CardDescription>
                  Upload your resume for expert review and detailed feedback
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

                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">What You'll Get:</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Detailed expert analysis</li>
                    <li>• Section-by-section feedback</li>
                    <li>• Improvement recommendations</li>
                    <li>• Priority action items</li>
                  </ul>
                </div>

                <Button 
                  onClick={handleReview}
                  disabled={!resumeFile || isReviewing}
                  className="w-full"
                >
                  {isReviewing ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Reviewing Resume...
                    </>
                  ) : (
                    <>
                      <Star className="h-4 w-4 mr-2" />
                      Submit for Review
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
                  Review Results
                </CardTitle>
                <CardDescription>
                  Your detailed resume review and expert feedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!reviewComplete ? (
                  <div className="text-center py-8">
                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Upload your resume to see review results</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Overall Score */}
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        {reviewData.overallScore}/10
                      </div>
                      <div className="flex justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-5 w-5 ${
                              i < Math.floor(reviewData.overallScore / 2) 
                                ? 'text-yellow-400' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">Overall Rating</p>
                    </div>

                    {/* Category Scores */}
                    <div className="space-y-3">
                      {reviewData.categories.map((category, index) => (
                        <div key={index} className={`${getScoreBgColor(category.score)} rounded-lg p-3`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{category.name}</span>
                            <span className={`font-bold ${getScoreColor(category.score)}`}>
                              {category.score}/10
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">{category.comment}</p>
                        </div>
                      ))}
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

          {/* Detailed Review Section */}
          {reviewComplete && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Strengths */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {reviewData.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span className="text-sm text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Improvements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-700">
                    <AlertCircle className="h-5 w-5" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {reviewData.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                        <span className="text-sm text-gray-700">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Expert Comments */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Expert Comments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reviewData.expertComments.map((comment, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{comment.section}</h4>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${
                                  i < comment.rating 
                                    ? 'text-yellow-400' 
                                    : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">{comment.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ResumeReview;
