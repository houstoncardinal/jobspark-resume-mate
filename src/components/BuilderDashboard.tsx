import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  Eye, 
  TrendingUp, 
  Award, 
  Mail, 
  Settings, 
  User, 
  Menu,
  X,
  CheckCircle,
  BarChart3,
  Crown,
  ArrowLeft,
  Home,
  PlusCircle,
  Zap
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

// Import tool components
import { ResumeOptimizer } from '@/components/ResumeOptimizer';
import { ResumeBuilder } from '@/components/ResumeBuilder';
import { TemplateShowcase } from '@/components/TemplateShowcase';
import { ResumeUpload } from '@/components/ResumeUpload';
import CoverLetterBuilder from '@/pages/CoverLetterBuilder';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: string;
  color: string;
  component: React.ComponentType<any>;
}

const tools: Tool[] = [
  {
    id: 'ai-optimizer',
    name: 'AI Resume Optimizer',
    description: 'Upload and optimize your resume with AI-powered suggestions and ATS compatibility',
    icon: Sparkles,
    category: 'optimize',
    color: 'from-blue-500 to-blue-600',
    component: ResumeOptimizer
  },
  {
    id: 'builder',
    name: 'Resume Builder',
    description: 'Create professional resumes from scratch with guided templates',
    icon: FileText,
    category: 'create',
    color: 'from-purple-500 to-purple-600',
    component: ResumeBuilder
  },
  {
    id: 'upload',
    name: 'Resume Upload',
    description: 'Upload your existing resume for analysis and optimization',
    icon: Upload,
    category: 'upload',
    color: 'from-green-500 to-green-600',
    component: ResumeUpload
  },
  {
    id: 'templates',
    name: 'Template Gallery',
    description: 'Browse and customize professional resume templates',
    icon: Award,
    category: 'create',
    color: 'from-orange-500 to-orange-600',
    component: TemplateShowcase
  },
  {
    id: 'cover-letter',
    name: 'Cover Letter Builder',
    description: 'Create compelling cover letters tailored to job applications',
    icon: Mail,
    category: 'create',
    color: 'from-indigo-500 to-indigo-600',
    component: CoverLetterBuilder
  },
  {
    id: 'ats-scanner',
    name: 'ATS Scanner',
    description: 'Scan your resume for ATS compatibility and keyword optimization',
    icon: Eye,
    category: 'analyze',
    color: 'from-pink-500 to-pink-600',
    component: () => <div className="p-8 text-center text-gray-500">ATS Scanner - Coming Soon</div>
  }
];

interface BuilderDashboardProps {
  onToolSelect?: (toolId: string) => void;
}

export const BuilderDashboard: React.FC<BuilderDashboardProps> = ({ onToolSelect }) => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadedResume, setUploadedResume] = useState<File | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId);
    setSidebarOpen(false); // Close mobile sidebar when tool is selected
    if (onToolSelect) {
      onToolSelect(toolId);
    }
  };

  const handleBackToDashboard = () => {
    setSelectedTool(null);
  };

  const selectedToolData = tools.find(tool => tool.id === selectedTool);

  const Sidebar = ({ className }: { className?: string }) => (
    <div className={cn("flex flex-col h-full bg-white border-r", className)}>
      {/* Logo/Header */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Crown className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Resume Builder</h2>
            <p className="text-sm text-gray-600">Professional Tools</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {/* Dashboard Home */}
        <button
          onClick={handleBackToDashboard}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
            !selectedTool 
              ? "bg-blue-50 text-blue-600 border border-blue-200 shadow-sm" 
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          )}
        >
          <Home className={cn("h-5 w-5", !selectedTool ? "text-blue-600" : "text-gray-500")} />
          <span className="font-medium">Dashboard</span>
        </button>

        <Separator className="my-4" />
        
        {/* Tools */}
        <div className="space-y-1">
          <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tools</h3>
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            const isActive = selectedTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => handleToolSelect(tool.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                  isActive 
                    ? "bg-blue-50 text-blue-600 border border-blue-200 shadow-sm" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <IconComponent className={cn("h-5 w-5", isActive ? "text-blue-600" : "text-gray-500")} />
                <div className="flex-1 min-w-0">
                  <span className="font-medium block truncate">{tool.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
          <div className="w-10 h-10 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Welcome Back!</p>
            <p className="text-xs text-gray-600">Premium User</p>
          </div>
          <Settings className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </div>
  );

  const renderDashboardHome = () => (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Professional Resume Tools
            </h1>
            <p className="text-gray-600 text-lg">
              Everything you need to create, optimize, and perfect your resume
            </p>
          </div>
          <Button className="hidden lg:flex bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Crown className="h-4 w-4 mr-2" />
            Upgrade to Pro
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                  <p className="text-sm text-gray-600">Resumes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">97%</p>
                  <p className="text-sm text-gray-600">ATS Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Mail className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">2</p>
                  <p className="text-sm text-gray-600">Cover Letters</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                  <p className="text-sm text-gray-600">Applications</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Access Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const IconComponent = tool.icon;
          return (
            <Card 
              key={tool.id}
              className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 border-gray-200 hover:border-gray-300 bg-white"
              onClick={() => handleToolSelect(tool.id)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg",
                    `bg-gradient-to-br ${tool.color}`
                  )}>
                    <IconComponent className="h-7 w-7 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                  {tool.name}
                </CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button 
                  className={cn(
                    "w-full text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200",
                    `bg-gradient-to-r ${tool.color} hover:scale-105`
                  )}
                >
                  Launch Tool
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderToolInterface = () => {
    if (!selectedToolData) return null;
    
    const ToolComponent = selectedToolData.component;
    
    return (
      <div className="h-full flex flex-col">
        {/* Tool Header */}
        <div className="bg-white border-b px-6 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleBackToDashboard}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                `bg-gradient-to-br ${selectedToolData.color}`
              )}>
                <selectedToolData.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedToolData.name}</h2>
                <p className="text-sm text-gray-600">{selectedToolData.description}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tool Content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          <ToolComponent 
            onResumeUpload={setUploadedResume}
            uploadedResume={uploadedResume}
            onTemplateSelect={setSelectedTemplate}
            selectedTemplate={selectedTemplate}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-80">
                <Sidebar />
              </SheetContent>
            </Sheet>
            <h1 className="text-lg font-bold text-gray-900">
              {selectedToolData ? selectedToolData.name : 'Resume Builder'}
            </h1>
          </div>
        </div>
      </div>

      <div className="flex h-screen lg:h-auto">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 h-screen sticky top-0">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {selectedTool ? renderToolInterface() : renderDashboardHome()}
        </div>
      </div>
    </div>
  );
};