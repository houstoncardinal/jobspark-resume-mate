/** @jsxImportSource react */
import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { PAGE_SEO } from '@/lib/seo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  Eye, 
  Mail, 
  Star,
  ArrowRight,
  CheckCircle,
  Zap,
  Target,
  Award,
  TrendingUp,
  Upload,
  Edit3,
  FileCheck,
  BarChart3,
  MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ResumeBuilderPage = () => {
  const navigate = useNavigate();

  const resumeOptions = [
    {
      id: 'improve',
      title: 'Resume Optimizer',
      description: 'Upload your resume and get AI-powered optimization suggestions',
      icon: TrendingUp,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      features: ['AI Analysis', 'ATS Optimization', 'Keyword Enhancement'],
      popular: true,
      route: '/resume-optimizer'
    },
    {
      id: 'build',
      title: 'Resume Builder',
      description: 'Create a new resume from scratch with guided templates',
      icon: FileText,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      features: ['Guided Builder', 'Templates', 'Real-time Preview'],
      popular: false,
      route: '/resume-builder-new'
    },
    {
      id: 'templates',
      title: 'Resume Templates',
      description: 'Browse professional resume templates by industry',
      icon: Award,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      features: ['Modern Designs', 'Industry Specific', 'One-Click Apply'],
      popular: false,
      route: '/resume-templates'
    },
    {
      id: 'scanner',
      title: 'Resume Scanner',
      description: 'Get instant ATS compatibility and keyword analysis',
      icon: Eye,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      features: ['ATS Score', 'Keyword Analysis', 'Format Check'],
      popular: false,
      route: '/resume-scanner'
    },
    {
      id: 'cover-letter',
      title: 'Cover Letter Builder',
      description: 'Create compelling cover letters for job applications',
      icon: Mail,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600',
      features: ['Job-Specific', 'AI Content', 'Templates'],
      popular: false,
      route: '/cover-letter-builder'
    },
    {
      id: 'review',
      title: 'Resume Review',
      description: 'Get professional feedback from resume experts',
      icon: Star,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      features: ['Expert Review', 'Detailed Report', 'Improvement Plan'],
      popular: false,
      route: '/resume-review'
    }
  ];

  const handleOptionSelect = (route: string) => {
    navigate(route);
  };

  return (
    <>
      <SEO seoData={PAGE_SEO['/builder']} url="/builder" />
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6">
          {/* Hero Section - More Compact */}
          <section className="mb-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
                Build Your <span className="text-blue-600">Perfect Resume</span>
              </h1>
              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                Create, optimize, and perfect your professional resume with our AI-powered tools.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>AI-Powered</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>ATS Optimized</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Professional Templates</span>
                </div>
              </div>
            </div>
          </section>

          {/* Options Grid - More Compact */}
          <section className="py-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Choose Your Resume Tool
              </h2>
              <p className="text-gray-600 max-w-xl mx-auto">
                Select the tool that best fits your needs. Each option is fully functional and ready to use.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {resumeOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <Card 
                    key={option.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 ${
                      option.popular 
                        ? 'border-blue-200 shadow-lg ring-2 ring-blue-500 ring-opacity-20' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleOptionSelect(option.route)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className={`w-10 h-10 ${option.bgColor} rounded-lg flex items-center justify-center mb-3`}>
                          <IconComponent className={`h-5 w-5 ${option.iconColor}`} />
                        </div>
                        {option.popular && (
                          <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                            Popular
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-lg font-bold text-gray-900 mb-2">
                        {option.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600">
                        {option.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-1 mb-4">
                        {option.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Button 
                        className={`w-full ${option.color.replace('from-', 'bg-gradient-to-r from-').replace('to-', ' to-')} hover:opacity-90 text-white text-sm py-2`}
                      >
                        Get Started
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Additional Info - More Compact */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">AI-Powered</h3>
                  <p className="text-gray-600 text-sm">
                    Intelligent analysis and suggestions for your resume.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">ATS Optimized</h3>
                  <p className="text-gray-600 text-sm">
                    Ensure your resume passes through Applicant Tracking Systems.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">Professional</h3>
                  <p className="text-gray-600 text-sm">
                    Create professional resumes that stand out to employers.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ResumeBuilderPage;
