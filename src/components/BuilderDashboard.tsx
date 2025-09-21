import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  Eye, 
  TrendingUp, 
  Award, 
  Mail, 
  Settings, 
  Home, 
  User, 
  Bell, 
  Search,
  Menu,
  X,
  ChevronRight,
  CheckCircle,
  Zap,
  Target,
  Palette,
  Download,
  Share2,
  BarChart3,
  MessageSquare,
  Crown,
  Star,
  ArrowRight,
  PlusCircle,
  Folder,
  Clock,
  Globe,
  Briefcase
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: string;
  features: string[];
  color: string;
  bgColor: string;
  popular?: boolean;
  route?: string;
  component?: React.ComponentType;
}

const tools: Tool[] = [
  {
    id: 'ai-optimizer',
    name: 'AI Resume Optimizer',
    description: 'Upload and optimize your resume with AI-powered suggestions and ATS compatibility',
    icon: Sparkles,
    category: 'optimize',
    features: ['AI Analysis', 'ATS Optimization', 'Text Extraction', 'Template Selection'],
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    popular: true,
    route: '/resume-optimizer'
  },
  {
    id: 'builder',
    name: 'Resume Builder',
    description: 'Create professional resumes from scratch with guided templates',
    icon: FileText,
    category: 'create',
    features: ['Guided Builder', 'Professional Templates', 'Real-time Preview', 'Multi-format Export'],
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    id: 'scanner', 
    name: 'ATS Scanner',
    description: 'Scan your resume for ATS compatibility and keyword optimization',
    icon: Eye,
    category: 'analyze',
    features: ['ATS Score', 'Keyword Analysis', 'Format Check', 'Improvement Tips'],
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50'
  },
  {
    id: 'templates',
    name: 'Template Gallery',
    description: 'Browse and customize professional resume templates',
    icon: Award,
    category: 'create',
    features: ['Modern Designs', 'Industry Specific', 'Customizable', 'One-click Apply'],
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    id: 'cover-letter',
    name: 'Cover Letter Builder',
    description: 'Create compelling cover letters tailored to job applications',
    icon: Mail,
    category: 'create',
    features: ['Job-Specific', 'AI Content', 'Templates', 'Matching Resume Style'],
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-50'
  },
  {
    id: 'analytics',
    name: 'Resume Analytics',
    description: 'Track your resume performance and application success rates',
    icon: BarChart3,
    category: 'analyze',
    features: ['Performance Tracking', 'Success Metrics', 'Industry Benchmarks', 'Export Reports'],
    color: 'from-pink-500 to-pink-600',
    bgColor: 'bg-pink-50'
  }
];

const categories = [
  { id: 'all', name: 'All Tools', icon: Home },
  { id: 'create', name: 'Create', icon: PlusCircle },
  { id: 'optimize', name: 'Optimize', icon: Zap },
  { id: 'analyze', name: 'Analyze', icon: BarChart3 }
];

interface BuilderDashboardProps {
  onToolSelect?: (toolId: string) => void;
}

export const BuilderDashboard: React.FC<BuilderDashboardProps> = ({ onToolSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const filteredTools = selectedCategory === 'all' 
    ? tools 
    : tools.filter(tool => tool.category === selectedCategory);

  const handleToolSelect = (tool: Tool) => {
    setSelectedTool(tool.id);
    if (tool.route) {
      navigate(tool.route);
    }
    if (onToolSelect) {
      onToolSelect(tool.id);
    }
  };

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
        {categories.map((category) => {
          const IconComponent = category.icon;
          const isActive = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                isActive 
                  ? "bg-blue-50 text-blue-600 border border-blue-200 shadow-sm" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <IconComponent className={cn("h-5 w-5", isActive ? "text-blue-600" : "text-gray-500")} />
              <span className="font-medium">{category.name}</span>
              {category.id === 'all' && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  {tools.length}
                </Badge>
              )}
            </button>
          );
        })}
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
            <h1 className="text-lg font-bold text-gray-900">Resume Builder</h1>
          </div>
          <Button variant="ghost" size="sm">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="flex h-screen lg:h-auto">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 h-screen sticky top-0">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
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

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTools.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <Card 
                    key={tool.id}
                    className={cn(
                      "cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2",
                      tool.popular 
                        ? "border-blue-200 shadow-lg ring-2 ring-blue-500/20 bg-gradient-to-br from-blue-50 to-indigo-50" 
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    )}
                    onClick={() => handleToolSelect(tool)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg",
                          tool.bgColor,
                          `bg-gradient-to-br ${tool.color}`
                        )}>
                          <IconComponent className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex flex-col gap-2">
                          {tool.popular && (
                            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              Popular
                            </Badge>
                          )}
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
                      <div className="space-y-2 mb-6">
                        {tool.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Button 
                        className={cn(
                          "w-full text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200",
                          `bg-gradient-to-r ${tool.color} hover:scale-105`
                        )}
                      >
                        Launch Tool
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Recent Activity */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Resume optimized</p>
                      <p className="text-sm text-gray-600">Software Engineer - Senior.pdf</p>
                    </div>
                    <p className="text-sm text-gray-500">2 hours ago</p>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Resume created</p>
                      <p className="text-sm text-gray-600">Marketing Manager.pdf</p>
                    </div>
                    <p className="text-sm text-gray-500">1 day ago</p>
                  </div>
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Mail className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Cover letter created</p>
                      <p className="text-sm text-gray-600">Tech Company Application</p>
                    </div>
                    <p className="text-sm text-gray-500">3 days ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};