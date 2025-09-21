import React, { useState, useEffect } from 'react';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { PAGE_SEO } from '@/lib/seo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft,
  Sparkles,
  Target,
  BarChart3,
  Zap,
  Award,
  Shield,
  Star,
  TrendingUp,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  Link,
  ExternalLink,
  Download,
  Eye,
  Palette
} from 'lucide-react';
import { ResumeOptimizer } from '@/components/ResumeOptimizer';
import { useToast } from '@/hooks/use-toast';

const ResumeOptimizerPage = () => {
  const { toast } = useToast();

  return (
    <>
      <SEO seoData={PAGE_SEO['/resume-optimizer']} url="/resume-optimizer" />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <main className="container mx-auto px-4 py-6">
          {/* Enhanced Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => window.history.back()}
              className="mb-6 hover:bg-blue-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Resume Tools
            </Button>
            
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Sparkles className="h-4 w-4" />
                AI-Powered Resume Optimization
              </div>
              
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
                Optimize Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Resume</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Upload your resume in any format and get instant AI-powered optimization with ATS compatibility analysis, 
                color-coded improvements, and professional template selection.
              </p>
              
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                <div className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Multi-Format Support</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">ATS Analysis</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Auto-Apply Improvements</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Professional Templates</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Smart Upload</h3>
                <p className="text-sm text-gray-600">Upload PDFs, Word docs, images, or paste text directly</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">ATS Analysis</h3>
                <p className="text-sm text-gray-600">Automatic compatibility scoring and issue detection</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">AI Optimization</h3>
                <p className="text-sm text-gray-600">Intelligent improvements with color-coded preview</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Palette className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-2">Templates</h3>
                <p className="text-sm text-gray-600">Professional templates with live preview</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Optimizer Component */}
          <ResumeOptimizer />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ResumeOptimizerPage;
