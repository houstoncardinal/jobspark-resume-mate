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
    <div className={cn("flex flex-col h-full bg-white border-r border-gray-200 shadow-sm", className)}>
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {/* Dashboard Home */}
        <button
          onClick={handleBackToDashboard}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group",
            !selectedTool 
              ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm" 
              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          )}
        >
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
            !selectedTool ? "bg-blue-100" : "bg-gray-100 group-hover:bg-gray-200"
          )}>
            <Home className={cn("h-4 w-4", !selectedTool ? "text-blue-600" : "text-gray-600")} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-semibold">Dashboard</span>
            <p className="text-xs text-gray-500 mt-0.5">Overview & Stats</p>
          </div>
        </button>

        <div className="py-2">
          <div className="h-px bg-gray-200"></div>
        </div>
        
        {/* Tools */}
        <div className="space-y-1">
          {tools.map((tool) => {
            const IconComponent = tool.icon;
            const isActive = selectedTool === tool.id;
            
            // Define tool-specific colors
            const getToolColors = (toolId: string) => {
              switch(toolId) {
                case 'ai-optimizer':
                  return {
                    bg: isActive ? 'bg-blue-50' : 'hover:bg-blue-50/50',
                    text: isActive ? 'text-blue-700' : 'text-gray-700 hover:text-blue-600',
                    border: isActive ? 'border-blue-200' : 'border-transparent',
                    iconBg: isActive ? 'bg-blue-100' : 'bg-blue-50 group-hover:bg-blue-100',
                    iconColor: isActive ? 'text-blue-600' : 'text-blue-500'
                  };
                case 'builder':
                  return {
                    bg: isActive ? 'bg-purple-50' : 'hover:bg-purple-50/50',
                    text: isActive ? 'text-purple-700' : 'text-gray-700 hover:text-purple-600',
                    border: isActive ? 'border-purple-200' : 'border-transparent',
                    iconBg: isActive ? 'bg-purple-100' : 'bg-purple-50 group-hover:bg-purple-100',
                    iconColor: isActive ? 'text-purple-600' : 'text-purple-500'
                  };
                case 'upload':
                  return {
                    bg: isActive ? 'bg-green-50' : 'hover:bg-green-50/50',
                    text: isActive ? 'text-green-700' : 'text-gray-700 hover:text-green-600',
                    border: isActive ? 'border-green-200' : 'border-transparent',
                    iconBg: isActive ? 'bg-green-100' : 'bg-green-50 group-hover:bg-green-100',
                    iconColor: isActive ? 'text-green-600' : 'text-green-500'
                  };
                case 'templates':
                  return {
                    bg: isActive ? 'bg-orange-50' : 'hover:bg-orange-50/50',
                    text: isActive ? 'text-orange-700' : 'text-gray-700 hover:text-orange-600',
                    border: isActive ? 'border-orange-200' : 'border-transparent',
                    iconBg: isActive ? 'bg-orange-100' : 'bg-orange-50 group-hover:bg-orange-100',
                    iconColor: isActive ? 'text-orange-600' : 'text-orange-500'
                  };
                case 'cover-letter':
                  return {
                    bg: isActive ? 'bg-indigo-50' : 'hover:bg-indigo-50/50',
                    text: isActive ? 'text-indigo-700' : 'text-gray-700 hover:text-indigo-600',
                    border: isActive ? 'border-indigo-200' : 'border-transparent',
                    iconBg: isActive ? 'bg-indigo-100' : 'bg-indigo-50 group-hover:bg-indigo-100',
                    iconColor: isActive ? 'text-indigo-600' : 'text-indigo-500'
                  };
                case 'ats-scanner':
                  return {
                    bg: isActive ? 'bg-pink-50' : 'hover:bg-pink-50/50',
                    text: isActive ? 'text-pink-700' : 'text-gray-700 hover:text-pink-600',
                    border: isActive ? 'border-pink-200' : 'border-transparent',
                    iconBg: isActive ? 'bg-pink-100' : 'bg-pink-50 group-hover:bg-pink-100',
                    iconColor: isActive ? 'text-pink-600' : 'text-pink-500'
                  };
                default:
                  return {
                    bg: isActive ? 'bg-gray-50' : 'hover:bg-gray-50',
                    text: isActive ? 'text-gray-700' : 'text-gray-700 hover:text-gray-900',
                    border: isActive ? 'border-gray-200' : 'border-transparent',
                    iconBg: isActive ? 'bg-gray-100' : 'bg-gray-50 group-hover:bg-gray-100',
                    iconColor: isActive ? 'text-gray-600' : 'text-gray-500'
                  };
              }
            };
            
            const colors = getToolColors(tool.id);
            
            return (
              <button
                key={tool.id}
                onClick={() => handleToolSelect(tool.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group border",
                  colors.bg,
                  colors.text,
                  colors.border
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                  colors.iconBg
                )}>
                  <IconComponent className={cn("h-4 w-4", colors.iconColor)} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-semibold block truncate">{tool.name}</span>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    {tool.id === 'ai-optimizer' && 'AI-powered optimization'}
                    {tool.id === 'builder' && 'Build from scratch'}
                    {tool.id === 'upload' && 'Upload existing resume'}
                    {tool.id === 'templates' && 'Professional templates'}
                    {tool.id === 'cover-letter' && 'Matching cover letters'}
                    {tool.id === 'ats-scanner' && 'ATS compatibility check'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">Welcome Back!</p>
            <p className="text-xs text-gray-500">Premium User</p>
          </div>
          <Settings className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
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
      <div className="h-full flex flex-col bg-white">
        {/* Minimal Tool Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleBackToDashboard}
              className="text-gray-500 hover:text-gray-700 -ml-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <selectedToolData.icon className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">{selectedToolData.name}</h2>
            </div>
          </div>
        </div>
        
        {/* Tool Content - Full Canvas */}
        <div className="flex-1 overflow-auto">
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
              <SheetContent side="left" className="p-0 w-72">
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
        <div className="hidden lg:block w-72 h-screen sticky top-0">
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