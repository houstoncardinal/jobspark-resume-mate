import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText,
  Sparkles,
  Download,
  Copy,
  Eye,
  Mail,
  User,
  Building2,
  Calendar,
  MapPin,
  Zap,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CoverLetterBuilderInternal = () => {
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    yourName: '',
    yourEmail: '',
    yourPhone: '',
    hiringManagerName: '',
    jobDescription: '',
    yourExperience: '',
    yourSkills: '',
    whyCompany: ''
  });
  
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const { toast } = useToast();

  const templates = [
    {
      id: 'professional',
      name: 'Professional',
      description: 'Clean, traditional format',
      color: 'blue'
    },
    {
      id: 'modern',
      name: 'Modern',
      description: 'Contemporary design',
      color: 'purple'
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Bold, expressive style',
      color: 'pink'
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateCoverLetter = async () => {
    if (!formData.jobTitle || !formData.companyName || !formData.yourName) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least your name, job title, and company name.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate AI generation process
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate personalized cover letter
      const letter = generatePersonalizedLetter();
      setGeneratedLetter(letter);
      setGenerationProgress(100);
      
      toast({
        title: "Cover Letter Generated!",
        description: "Your personalized cover letter is ready for review.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating your cover letter. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePersonalizedLetter = () => {
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `${currentDate}

${formData.hiringManagerName ? `Dear ${formData.hiringManagerName}` : 'Dear Hiring Manager'},

I am writing to express my strong interest in the ${formData.jobTitle} position at ${formData.companyName}. With my background in ${formData.yourExperience || 'relevant experience'} and expertise in ${formData.yourSkills || 'key skills'}, I am confident that I would be a valuable addition to your team.

${formData.whyCompany ? `What particularly attracts me to ${formData.companyName} is ${formData.whyCompany}. This aligns perfectly with my career goals and values.` : ''}

In my previous roles, I have developed strong skills in ${formData.yourSkills || 'various areas'} and have consistently delivered results that exceed expectations. My experience includes:

• ${formData.yourExperience || 'Relevant professional experience'}
• Strong problem-solving and analytical capabilities
• Excellent communication and collaboration skills
• Proven track record of meeting deadlines and exceeding goals

I am particularly drawn to this opportunity because it would allow me to contribute to ${formData.companyName}'s continued success while further developing my expertise in ${formData.jobTitle.toLowerCase()}.

I would welcome the opportunity to discuss how my background and enthusiasm can contribute to your team's success. Thank you for considering my application. I look forward to hearing from you soon.

Sincerely,
${formData.yourName}
${formData.yourEmail}
${formData.yourPhone}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLetter);
    toast({
      title: "Copied!",
      description: "Cover letter copied to clipboard.",
    });
  };

  const downloadLetter = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedLetter], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${formData.companyName}_${formData.jobTitle}_CoverLetter.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Cover Letter Builder</h1>
        <p className="text-lg text-gray-600">Create compelling, personalized cover letters that get results</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                  <Input
                    placeholder="John Doe"
                    value={formData.yourName}
                    onChange={(e) => handleInputChange('yourName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={formData.yourEmail}
                    onChange={(e) => handleInputChange('yourEmail', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <Input
                  placeholder="(555) 123-4567"
                  value={formData.yourPhone}
                  onChange={(e) => handleInputChange('yourPhone', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-green-600" />
                Job & Company Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                  <Input
                    placeholder="Software Engineer"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                  <Input
                    placeholder="Tech Company Inc."
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hiring Manager Name</label>
                <Input
                  placeholder="Jane Smith (optional)"
                  value={formData.hiringManagerName}
                  onChange={(e) => handleInputChange('hiringManagerName', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                <Textarea
                  placeholder="Paste the job description here to get better personalization..."
                  value={formData.jobDescription}
                  onChange={(e) => handleInputChange('jobDescription', e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Your Background
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Experience</label>
                <Textarea
                  placeholder="Briefly describe your relevant work experience..."
                  value={formData.yourExperience}
                  onChange={(e) => handleInputChange('yourExperience', e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Key Skills</label>
                <Textarea
                  placeholder="List your key skills relevant to this position..."
                  value={formData.yourSkills}
                  onChange={(e) => handleInputChange('yourSkills', e.target.value)}
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Why This Company?</label>
                <Textarea
                  placeholder="What interests you about this company specifically?"
                  value={formData.whyCompany}
                  onChange={(e) => handleInputChange('whyCompany', e.target.value)}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-600" />
                Template Style
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedTemplate === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-sm font-medium">{template.name}</div>
                    <div className="text-xs text-gray-600">{template.description}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <Button
            onClick={generateCoverLetter}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3"
            size="lg"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                Generating Cover Letter...
              </>
            ) : (
              <>
                <Zap className="h-5 w-5 mr-2" />
                Generate Cover Letter
              </>
            )}
          </Button>

          {isGenerating && (
            <div className="space-y-2">
              <Progress value={generationProgress} className="w-full" />
              <p className="text-sm text-center text-gray-600">
                {generationProgress < 30 && "Analyzing your information..."}
                {generationProgress >= 30 && generationProgress < 60 && "Personalizing content..."}
                {generationProgress >= 60 && generationProgress < 90 && "Crafting your cover letter..."}
                {generationProgress >= 90 && "Finalizing..."}
              </p>
            </div>
          )}
        </div>

        {/* Preview/Output */}
        <div className="space-y-6">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-green-600" />
                  Cover Letter Preview
                </CardTitle>
                {generatedLetter && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadLetter}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {generatedLetter ? (
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800 font-sans">
                    {generatedLetter}
                  </pre>
                </div>
              ) : (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Cover Letter Yet</h3>
                  <p className="text-gray-600">
                    Fill out the form and click "Generate Cover Letter" to create your personalized cover letter.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterBuilderInternal;