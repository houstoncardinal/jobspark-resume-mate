import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Sparkles, 
  Download, 
  Eye, 
  Zap, 
  Shield, 
  Users, 
  Star,
  ArrowRight,
  CheckCircle,
  Crown,
  Palette,
  Type,
  Briefcase,
  Rocket,
  Target,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ResumeBuilderLanding: React.FC = () => {
  const features = [
    {
      icon: FileText,
      title: 'Professional Templates',
      description: 'Choose from 4+ professionally designed templates crafted by experts',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Optimization',
      description: 'Get AI suggestions to improve your resume content and ATS compatibility',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Eye,
      title: 'Live Preview',
      description: 'See your resume come to life with real-time preview as you type',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Download,
      title: 'Multiple Formats',
      description: 'Export your resume in PDF, Word, or plain text formats',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Shield,
      title: 'ATS Optimized',
      description: 'Templates designed to pass Applicant Tracking Systems',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Zap,
      title: 'Quick & Easy',
      description: 'Build a professional resume in minutes, not hours',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const templates = [
    {
      name: 'Professional Classic',
      category: 'Professional',
      description: 'Clean, traditional design perfect for corporate roles',
      color: 'from-blue-500 to-cyan-500',
      icon: Briefcase
    },
    {
      name: 'Modern Minimalist',
      category: 'Modern',
      description: 'Sleek, contemporary design with clean lines',
      color: 'from-green-500 to-emerald-500',
      icon: Type
    },
    {
      name: 'Creative Portfolio',
      category: 'Creative',
      description: 'Bold, creative design perfect for designers and creatives',
      color: 'from-pink-500 to-rose-500',
      icon: Palette
    },
    {
      name: 'Executive Premium',
      category: 'Executive',
      description: 'Sophisticated design for senior executives and C-level positions',
      color: 'from-amber-500 to-yellow-500',
      icon: Crown
    }
  ];

  const stats = [
    { number: '10K+', label: 'Resumes Created' },
    { number: '95%', label: 'ATS Pass Rate' },
    { number: '4.9/5', label: 'User Rating' },
    { number: '24/7', label: 'Support Available' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full text-lg font-medium">
              <Sparkles className="w-5 h-5" />
              <span>AI-Powered Resume Builder</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
              Create Your Perfect
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {' '}Resume
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Build a stunning, ATS-optimized resume in minutes with our professional templates and AI-powered suggestions. 
              Land your dream job with confidence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                asChild
                className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Link to="/builder">
                  <Rocket className="w-5 h-5 mr-2" />
                  Start Building Now
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                asChild
                className="text-lg px-8 py-6 bg-white/80 hover:bg-white border-2 border-gray-300 hover:border-gray-400 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link to="/builder">
                  <Eye className="w-5 h-5 mr-2" />
                  View Templates
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-2000"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">
              Everything You Need to Build the Perfect Resume
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive resume builder includes all the tools and features you need to create a professional resume that stands out.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:scale-105">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">
              Professional Templates for Every Industry
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our collection of professionally designed templates, each crafted to help you stand out in your field.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {templates.map((template, index) => {
              const Icon = template.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm hover:scale-105">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 bg-gradient-to-r ${template.color} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {template.description}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {template.category}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Build Your Perfect Resume?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of professionals who have already created stunning resumes with our builder.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                asChild
                className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Link to="/builder">
                  <FileText className="w-5 h-5 mr-2" />
                  Start Building Now
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                asChild
                className="text-lg px-8 py-6 border-2 border-white text-white hover:bg-white hover:text-blue-600 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Link to="/builder">
                  <Eye className="w-5 h-5 mr-2" />
                  View Templates
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResumeBuilderLanding;
