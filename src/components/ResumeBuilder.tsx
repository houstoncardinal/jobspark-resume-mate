import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Upload, 
  Download, 
  Save, 
  Eye, 
  Edit3, 
  Sparkles, 
  FileText, 
  Copy, 
  Trash2, 
  Plus,
  X,
  Check,
  Star,
  Palette,
  Layout,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Link,
  Image,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Languages,
  Code,
  Heart,
  Music,
  Camera,
  BookOpen,
  Zap,
  Target,
  TrendingUp,
  Calendar,
  Clock,
  Globe,
  Building2,
  Users,
  Settings,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  RotateCw,
  Maximize2,
  Minimize2,
  MoreHorizontal
} from 'lucide-react';

interface ResumeSection {
  id: string;
  type: 'header' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'languages' | 'interests' | 'custom';
  title: string;
  content: string;
  order: number;
  visible: boolean;
}

interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  category: 'modern' | 'classic' | 'creative' | 'minimal';
  preview: string;
  sections: ResumeSection[];
  styling: {
    fontFamily: string;
    fontSize: string;
    colorScheme: string;
    spacing: string;
    layout: string;
  };
}

const resumeTemplates: ResumeTemplate[] = [
  {
    id: 'modern-professional',
    name: 'Modern Professional',
    description: 'Clean, contemporary design perfect for tech and business roles',
    category: 'modern',
    preview: 'bg-gradient-to-br from-blue-50 to-indigo-100',
    sections: [
      { id: 'header', type: 'header', title: 'Contact Information', content: '', order: 1, visible: true },
      { id: 'summary', type: 'summary', title: 'Professional Summary', content: '', order: 2, visible: true },
      { id: 'experience', type: 'experience', title: 'Work Experience', content: '', order: 3, visible: true },
      { id: 'education', type: 'education', title: 'Education', content: '', order: 4, visible: true },
      { id: 'skills', type: 'skills', title: 'Skills', content: '', order: 5, visible: true },
      { id: 'projects', type: 'projects', title: 'Projects', content: '', order: 6, visible: true }
    ],
    styling: {
      fontFamily: 'Inter',
      fontSize: 'medium',
      colorScheme: 'blue',
      spacing: 'comfortable',
      layout: 'single-column'
    }
  },
  {
    id: 'classic-executive',
    name: 'Classic Executive',
    description: 'Traditional, authoritative design for senior positions',
    category: 'classic',
    preview: 'bg-gradient-to-br from-gray-50 to-slate-100',
    sections: [
      { id: 'header', type: 'header', title: 'Contact Information', content: '', order: 1, visible: true },
      { id: 'summary', type: 'summary', title: 'Executive Summary', content: '', order: 2, visible: true },
      { id: 'experience', type: 'experience', title: 'Professional Experience', content: '', order: 3, visible: true },
      { id: 'education', type: 'education', title: 'Education & Certifications', content: '', order: 4, visible: true },
      { id: 'skills', type: 'skills', title: 'Core Competencies', content: '', order: 5, visible: true },
      { id: 'awards', type: 'certifications', title: 'Awards & Recognition', content: '', order: 6, visible: true }
    ],
    styling: {
      fontFamily: 'Times New Roman',
      fontSize: 'medium',
      colorScheme: 'gray',
      spacing: 'compact',
      layout: 'single-column'
    }
  },
  {
    id: 'creative-portfolio',
    name: 'Creative Portfolio',
    description: 'Bold, artistic design for creative professionals',
    category: 'creative',
    preview: 'bg-gradient-to-br from-purple-50 to-pink-100',
    sections: [
      { id: 'header', type: 'header', title: 'About Me', content: '', order: 1, visible: true },
      { id: 'summary', type: 'summary', title: 'Creative Vision', content: '', order: 2, visible: true },
      { id: 'experience', type: 'experience', title: 'Creative Experience', content: '', order: 3, visible: true },
      { id: 'projects', type: 'projects', title: 'Portfolio', content: '', order: 4, visible: true },
      { id: 'skills', type: 'skills', title: 'Creative Skills', content: '', order: 5, visible: true },
      { id: 'interests', type: 'interests', title: 'Inspiration', content: '', order: 6, visible: true }
    ],
    styling: {
      fontFamily: 'Poppins',
      fontSize: 'large',
      colorScheme: 'purple',
      spacing: 'spacious',
      layout: 'two-column'
    }
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    description: 'Simple, elegant design that lets content shine',
    category: 'minimal',
    preview: 'bg-gradient-to-br from-green-50 to-emerald-100',
    sections: [
      { id: 'header', type: 'header', title: 'Contact', content: '', order: 1, visible: true },
      { id: 'summary', type: 'summary', title: 'About', content: '', order: 2, visible: true },
      { id: 'experience', type: 'experience', title: 'Experience', content: '', order: 3, visible: true },
      { id: 'education', type: 'education', title: 'Education', content: '', order: 4, visible: true },
      { id: 'skills', type: 'skills', title: 'Skills', content: '', order: 5, visible: true }
    ],
    styling: {
      fontFamily: 'Helvetica',
      fontSize: 'small',
      colorScheme: 'green',
      spacing: 'minimal',
      layout: 'single-column'
    }
  }
];

const sectionTemplates = {
  header: {
    title: 'Contact Information',
    content: `John Doe
Senior Software Engineer
john.doe@email.com | (555) 123-4567
San Francisco, CA | linkedin.com/in/johndoe
github.com/johndoe | portfolio.johndoe.com`
  },
  summary: {
    title: 'Professional Summary',
    content: `Experienced software engineer with 5+ years of expertise in full-stack development, 
cloud architecture, and team leadership. Proven track record of delivering scalable solutions 
that drive business growth and improve user experience. Passionate about clean code, 
continuous learning, and mentoring junior developers.`
  },
  experience: {
    title: 'Work Experience',
    content: `Senior Software Engineer | Tech Company Inc. | 2021 - Present
• Led development of microservices architecture serving 1M+ users
• Improved system performance by 40% through optimization and caching
• Mentored 3 junior developers and established code review processes
• Collaborated with product team to define technical requirements

Software Engineer | StartupXYZ | 2019 - 2021
• Built responsive web applications using React, Node.js, and PostgreSQL
• Implemented CI/CD pipelines reducing deployment time by 60%
• Participated in agile development process with 2-week sprints
• Contributed to open-source projects with 500+ GitHub stars`
  },
  education: {
    title: 'Education',
    content: `Bachelor of Science in Computer Science
University of California, Berkeley | 2015 - 2019
• GPA: 3.8/4.0
• Relevant Coursework: Data Structures, Algorithms, Database Systems
• Senior Project: Machine Learning-based Recommendation System`
  },
  skills: {
    title: 'Technical Skills',
    content: `Programming Languages: JavaScript, TypeScript, Python, Java, Go
Frameworks & Libraries: React, Node.js, Express, Django, Spring Boot
Databases: PostgreSQL, MongoDB, Redis, Elasticsearch
Cloud & DevOps: AWS, Docker, Kubernetes, Terraform, Jenkins
Tools: Git, VS Code, Postman, Figma, Jira`
  },
  projects: {
    title: 'Key Projects',
    content: `E-Commerce Platform | 2023
• Full-stack application with React frontend and Node.js backend
• Implemented payment processing with Stripe API
• Deployed on AWS with auto-scaling and load balancing
• Result: 50% increase in conversion rate

Task Management App | 2022
• Real-time collaboration features using WebSockets
• Mobile-responsive design with React Native
• Integrated with Google Calendar and Slack APIs
• Users: 10,000+ active monthly users`
  }
};

export const ResumeBuilder: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'create' | 'edit'>('create');
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate | null>(null);
  const [resumeSections, setResumeSections] = useState<ResumeSection[]>([]);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [resumeTitle, setResumeTitle] = useState('My Resume');
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved resume on component mount
  useEffect(() => {
    const savedResume = localStorage.getItem('resumeBuilderData');
    if (savedResume) {
      try {
        const data = JSON.parse(savedResume);
        setResumeSections(data.sections || []);
        setResumeTitle(data.title || 'My Resume');
        if (data.template) {
          setSelectedTemplate(data.template);
        }
      } catch (error) {
        console.error('Error loading saved resume:', error);
      }
    }
  }, []);

  // Save resume data to localStorage
  const saveResumeData = () => {
    const data = {
      title: resumeTitle,
      sections: resumeSections,
      template: selectedTemplate,
      lastModified: new Date().toISOString()
    };
    localStorage.setItem('resumeBuilderData', JSON.stringify(data));
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(saveResumeData, 30000);
    return () => clearInterval(interval);
  }, [resumeSections, resumeTitle, selectedTemplate]);

  const handleTemplateSelect = (template: ResumeTemplate) => {
    setSelectedTemplate(template);
    setResumeSections(template.sections.map(section => ({ ...section })));
    setIsTemplateModalOpen(false);
    toast({
      title: "Template Applied!",
      description: `You're now using the ${template.name} template.`,
    });
  };

  const handleSectionAdd = (type: ResumeSection['type']) => {
    const newSection: ResumeSection = {
      id: `${type}-${Date.now()}`,
      type,
      title: sectionTemplates[type]?.title || 'New Section',
      content: sectionTemplates[type]?.content || '',
      order: resumeSections.length + 1,
      visible: true
    };
    setResumeSections([...resumeSections, newSection]);
  };

  const handleSectionUpdate = (sectionId: string, updates: Partial<ResumeSection>) => {
    setResumeSections(sections =>
      sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    );
  };

  const handleSectionDelete = (sectionId: string) => {
    setResumeSections(sections => sections.filter(section => section.id !== sectionId));
  };

  const handleSectionReorder = (fromIndex: number, toIndex: number) => {
    const newSections = [...resumeSections];
    const [movedSection] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, movedSection);
    setResumeSections(newSections.map((section, index) => ({ ...section, order: index + 1 })));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      // Parse the content and create sections
      const newSections: ResumeSection[] = [
        {
          id: 'uploaded-content',
          type: 'custom',
          title: 'Uploaded Content',
          content,
          order: 1,
          visible: true
        }
      ];
      setResumeSections(newSections);
      toast({
        title: "File Uploaded!",
        description: "Your file has been imported into the resume builder.",
      });
    };
    reader.readAsText(file);
  };

  const handleSaveToProfile = async () => {
    if (!user) {
      toast({
        title: "Please Sign In",
        description: "You need to be signed in to save your resume.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Here you would typically save to your backend/database
      // For now, we'll save to localStorage with user context
      const resumeData = {
        id: `resume-${Date.now()}`,
        title: resumeTitle,
        sections: resumeSections,
        template: selectedTemplate,
        userId: user.id,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };

      const savedResumes = JSON.parse(localStorage.getItem('userResumes') || '[]');
      savedResumes.push(resumeData);
      localStorage.setItem('userResumes', JSON.stringify(savedResumes));

      toast({
        title: "Resume Saved!",
        description: "Your resume has been saved to your profile.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = (format: 'pdf' | 'docx' | 'txt') => {
    const content = resumeSections
      .filter(section => section.visible)
      .map(section => `${section.title}\n${section.content}`)
      .join('\n\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeTitle}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Resume Exported!",
      description: `Your resume has been exported as ${format.toUpperCase()}.`,
    });
  };

  const renderSectionEditor = (section: ResumeSection) => (
    <Card key={section.id} className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Input
              value={section.title}
              onChange={(e) => handleSectionUpdate(section.id, { title: e.target.value })}
              className="font-semibold text-lg border-none p-0 h-auto"
            />
            <Badge variant="outline" className="text-xs">
              {section.type}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingSection(editingSection === section.id ? null : section.id)}
            >
              {editingSection === section.id ? <Eye className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSectionDelete(section.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {editingSection === section.id ? (
          <Textarea
            value={section.content}
            onChange={(e) => handleSectionUpdate(section.id, { content: e.target.value })}
            className="min-h-[200px] resize-none"
            placeholder="Enter your content here..."
          />
        ) : (
          <div className="whitespace-pre-wrap text-gray-700">
            {section.content || 'Click edit to add content...'}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderPreview = () => (
    <div className="bg-white p-8 shadow-lg max-w-4xl mx-auto">
      <div className="prose prose-lg max-w-none">
        {resumeSections
          .filter(section => section.visible)
          .sort((a, b) => a.order - b.order)
          .map(section => (
            <div key={section.id} className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-500 pb-2">
                {section.title}
              </h2>
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {section.content}
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Resume Builder</h1>
              <p className="text-lg text-gray-600">Create professional resumes with AI assistance</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setIsTemplateModalOpen(true)}
                className="flex items-center gap-2"
              >
                <Layout className="h-4 w-4" />
                Templates
              </Button>
              <Button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                {isPreviewMode ? 'Edit' : 'Preview'}
              </Button>
            </div>
          </div>

          {/* Resume Title */}
          <div className="flex items-center gap-4 mb-6">
            <Input
              value={resumeTitle}
              onChange={(e) => setResumeTitle(e.target.value)}
              className="text-2xl font-bold border-none bg-transparent p-0 h-auto"
              placeholder="Enter resume title..."
            />
            {selectedTemplate && (
              <Badge className="bg-blue-100 text-blue-800">
                {selectedTemplate.name}
              </Badge>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          {!isPreviewMode && (
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="text-lg">Resume Sections</CardTitle>
                  <CardDescription>Add and organize your resume content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Add Section Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(sectionTemplates).map(([type, template]) => (
                      <Button
                        key={type}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSectionAdd(type as ResumeSection['type'])}
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        {template.title}
                      </Button>
                    ))}
                  </div>

                  {/* File Upload */}
                  <div className="pt-4 border-t">
                    <Label htmlFor="file-upload" className="text-sm font-medium">
                      Upload Existing Resume
                    </Label>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".txt,.doc,.docx"
                      onChange={handleFileUpload}
                      ref={fileInputRef}
                      className="mt-2"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t space-y-2">
                    <Button
                      onClick={handleSaveToProfile}
                      disabled={isSaving || !user}
                      className="w-full"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save to Profile'}
                    </Button>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport('pdf')}
                      >
                        PDF
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport('docx')}
                      >
                        DOCX
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport('txt')}
                      >
                        TXT
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content Area */}
          <div className={isPreviewMode ? 'lg:col-span-4' : 'lg:col-span-3'}>
            {isPreviewMode ? (
              renderPreview()
            ) : (
              <div className="space-y-6">
                {resumeSections.length === 0 ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Start Building Your Resume
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Choose a template or add sections to get started
                      </p>
                      <Button
                        onClick={() => setIsTemplateModalOpen(true)}
                        className="flex items-center gap-2"
                      >
                        <Layout className="h-4 w-4" />
                        Choose Template
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  resumeSections
                    .sort((a, b) => a.order - b.order)
                    .map(section => renderSectionEditor(section))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Template Selection Modal */}
      <Dialog open={isTemplateModalOpen} onOpenChange={setIsTemplateModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Choose a Resume Template</DialogTitle>
            <p className="text-gray-600">Select a template to get started with your resume</p>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {resumeTemplates.map((template) => (
              <Card
                key={template.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                onClick={() => handleTemplateSelect(template)}
              >
                <CardHeader>
                  <div className={`w-full h-32 rounded-lg ${template.preview} mb-4 flex items-center justify-center`}>
                    <FileText className="h-16 w-16 text-gray-600" />
                  </div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{template.category}</Badge>
                    <Button size="sm">Use Template</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
