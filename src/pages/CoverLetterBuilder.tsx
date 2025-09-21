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
  ArrowLeft,
  FileText,
  Sparkles,
  Download,
  Eye,
  Mail,
  User,
  Building2,
  Calendar,
  MapPin,
  Zap
} from 'lucide-react';

const CoverLetterBuilder = () => {
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    yourName: '',
    yourEmail: '',
    yourPhone: '',
    hiringManagerName: '',
    jobDescription: '',
    yourExperience: '',
    whyInterested: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setCoverLetter(`Dear ${formData.hiringManagerName || 'Hiring Manager'},

I am writing to express my strong interest in the ${formData.jobTitle} position at ${formData.companyName}. With my extensive experience in ${formData.yourExperience}, I am confident that I would be a valuable addition to your team.

${formData.whyInterested}

I am excited about the opportunity to contribute to ${formData.companyName} and would welcome the chance to discuss how my skills and experience align with your needs.

Best regards,
${formData.yourName}`);
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <>
      <SEO seoData={PAGE_SEO['/cover-letter-builder']} url="/cover-letter-builder" />
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cover Letter Builder</h1>
            <p className="text-gray-600">Create compelling cover letters tailored to specific job applications</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Cover Letter Information
                </CardTitle>
                <CardDescription>
                  Fill in the details to generate your personalized cover letter
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title *
                    </label>
                    <Input
                      placeholder="e.g. Software Engineer"
                      value={formData.jobTitle}
                      onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name *
                    </label>
                    <Input
                      placeholder="e.g. Google"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name *
                    </label>
                    <Input
                      placeholder="John Doe"
                      value={formData.yourName}
                      onChange={(e) => handleInputChange('yourName', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Email *
                    </label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={formData.yourEmail}
                      onChange={(e) => handleInputChange('yourEmail', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hiring Manager Name
                  </label>
                  <Input
                    placeholder="e.g. Jane Smith (optional)"
                    value={formData.hiringManagerName}
                    onChange={(e) => handleInputChange('hiringManagerName', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Description *
                  </label>
                  <Textarea
                    placeholder="Paste the job description here..."
                    value={formData.jobDescription}
                    onChange={(e) => handleInputChange('jobDescription', e.target.value)}
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Relevant Experience *
                  </label>
                  <Textarea
                    placeholder="Describe your relevant experience and skills..."
                    value={formData.yourExperience}
                    onChange={(e) => handleInputChange('yourExperience', e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Why You're Interested *
                  </label>
                  <Textarea
                    placeholder="Why are you interested in this position and company?"
                    value={formData.whyInterested}
                    onChange={(e) => handleInputChange('whyInterested', e.target.value)}
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={handleGenerate}
                  disabled={!formData.jobTitle || !formData.companyName || !formData.yourName || !formData.yourEmail || isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                      Generating Cover Letter...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Generate Cover Letter
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Preview Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Cover Letter Preview
                </CardTitle>
                <CardDescription>
                  Your generated cover letter will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!coverLetter ? (
                  <div className="text-center py-8">
                    <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Fill in the form to generate your cover letter</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-white border rounded-lg p-4 max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                        {coverLetter}
                      </pre>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
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

export default CoverLetterBuilder;
