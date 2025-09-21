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
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  Code,
  Globe,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  RotateCcw,
  Settings,
  Wand2,
  Zap,
  Target,
  TrendingUp,
  Users,
  Building2,
  BookOpen,
  Lightbulb,
  Heart,
  ThumbsUp,
  Crown,
  Diamond,
  Flame,
  Rocket,
  Shield,
  Lock,
  Unlock,
  RefreshCw,
  Play,
  Pause,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Octagon,
  Pentagon,
  Star as StarIcon,
  Moon,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  Wind,
  Droplets,
  Flame as FireIcon,
  Mountain,
  TreePine,
  Leaf,
  Flower2
} from 'lucide-react';
import { RESUME_TEMPLATES, type ResumeTemplate } from '@/lib/ResumeTemplates';
import { ResumePreview } from '@/components/resume/ResumePreview';

interface EnhancedResumeBuilderProps {
  onSave?: (resumeData: any) => void;
  initialData?: any;
}

export const ResumeBuilder: React.FC<EnhancedResumeBuilderProps> = ({
  onSave,
  initialData
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate | null>(null);
  const [resumeData, setResumeData] = useState<any>(initialData || {});
  const [activeTab, setActiveTab] = useState('templates');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTemplatePreview, setShowTemplatePreview] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<ResumeTemplate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Template categories with icons and colors
  const templateCategories = [
    { id: 'all', name: 'All Templates', icon: Star, color: 'bg-blue-500' },
    { id: 'professional', name: 'Professional', icon: Briefcase, color: 'bg-blue-500' },
    { id: 'creative', name: 'Creative', icon: Palette, color: 'bg-blue-500' },
    { id: 'modern', name: 'Modern', icon: Zap, color: 'bg-blue-500' },
    { id: 'minimalist', name: 'Minimalist', icon: Type, color: 'bg-blue-500' },
    { id: 'executive', name: 'Executive', icon: Crown, color: 'bg-blue-500' }
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTemplates = selectedCategory === 'all' 
    ? RESUME_TEMPLATES 
    : RESUME_TEMPLATES.filter(template => template.category === selectedCategory);

  const handleTemplateSelect = (template: ResumeTemplate) => {
    setSelectedTemplate(template);
    setActiveTab('editor');
    setResumeData({
      ...resumeData,
      templateId: template.id,
      template: template
    });
    toast({
      title: "Template Selected!",
      description: `You've selected the ${template.name} template. Let's start building your resume!`,
    });
  };

  const handlePreviewTemplate = (template: ResumeTemplate) => {
    setPreviewTemplate(template);
    setShowTemplatePreview(true);
  };

  const handleFieldChange = (section: string, field: string, value: any) => {
    setResumeData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayFieldAdd = (section: string, field: string) => {
    const newItem = getDefaultArrayItem(section, field);
    setResumeData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: [
          ...(prev[section]?.[field] || []),
          newItem
        ]
      }
    }));
  };

  const handleArrayFieldRemove = (section: string, field: string, index: number) => {
    setResumeData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: prev[section]?.[field]?.filter((_: any, i: number) => i !== index) || []
      }
    }));
  };

  const getDefaultArrayItem = (section: string, field: string) => {
    switch (section) {
      case 'experience':
        return {
          title: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: ''
        };
      case 'education':
        return {
          degree: '',
          institution: '',
          location: '',
          graduationDate: '',
          gpa: '',
          honors: ''
        };
      case 'projects':
        return {
          name: '',
          description: '',
          technologies: [],
          url: '',
          github: ''
        };
      default:
        return {};
    }
  };

  const handleSave = async () => {
    if (!selectedTemplate) {
      toast({
        title: "No Template Selected",
        description: "Please select a template before saving.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onSave) {
        onSave(resumeData);
      }
      
      toast({
        title: "Resume Saved!",
        description: "Your resume has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving your resume.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = (format: 'pdf' | 'docx' | 'txt') => {
    toast({
      title: "Export Started",
      description: `Your resume is being exported as ${format.toUpperCase()}.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Resume Builder</h1>
              </div>
              {selectedTemplate && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {selectedTemplate.name}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="flex items-center space-x-2"
              >
                <Eye className="w-4 h-4" />
                <span>{isPreviewMode ? 'Edit' : 'Preview'}</span>
              </Button>
              
              {selectedTemplate && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSave}
                    disabled={isGenerating}
                    className="flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </Button>
                  
                  <Select onValueChange={handleExport}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Export" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="docx">Word</SelectItem>
                      <SelectItem value="txt">Text</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedTemplate ? (
          // Template Selection
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Choose Your Perfect Resume Template
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Select from our professionally designed templates to create a stunning resume that stands out to employers.
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2">
              {templateCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 ${
                      selectedCategory === category.id 
                        ? category.color + ' text-white border-0' 
                        : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{category.name}</span>
                  </Button>
                );
              })}
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <div className="relative">
                      {/* Template Preview */}
                      <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center space-y-4 p-8">
                            <div className="w-16 h-16 bg-blue-500 rounded-lg mx-auto flex items-center justify-center">
                              <FileText className="w-8 h-8 text-white" />
                            </div>
                            <div className="space-y-2">
                              <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
                              <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto"></div>
                            </div>
                            <div className="space-y-1">
                              <div className="h-2 bg-gray-200 rounded w-full"></div>
                              <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                              <div className="h-2 bg-gray-200 rounded w-4/6"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Template Info */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {template.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePreviewTemplate(template)}
                              className="flex items-center space-x-1"
                            >
                              <Eye className="w-4 h-4" />
                              <span>Preview</span>
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleTemplateSelect(template)}
                              className="flex items-center space-x-1 bg-blue-600 hover:from-blue-700 hover:to-purple-700"
                            >
                              <Check className="w-4 h-4" />
                              <span>Use Template</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          // Resume Editor
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Editor Panel */}
            <div className={`${isPreviewMode ? 'hidden' : 'block'} space-y-6`}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="editor" className="flex items-center space-x-2">
                    <Edit3 className="w-4 h-4" />
                    <span>Editor</span>
                  </TabsTrigger>
                  <TabsTrigger value="templates" className="flex items-center space-x-2">
                    <Layout className="w-4 h-4" />
                    <span>Templates</span>
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </TabsTrigger>
                  <TabsTrigger value="ai" className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Assistant</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="editor" className="space-y-6">
                  {/* Resume Editor Form */}
                  <div className="space-y-6">
                    {selectedTemplate && Object.entries(selectedTemplate.fields).map(([sectionKey, section]) => (
                      <Card key={sectionKey} className="border-0 bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            {sectionKey === 'contact' && <User className="w-5 h-5" />}
                            {sectionKey === 'summary' && <FileText className="w-5 h-5" />}
                            {sectionKey === 'experience' && <Briefcase className="w-5 h-5" />}
                            {sectionKey === 'education' && <GraduationCap className="w-5 h-5" />}
                            {sectionKey === 'skills' && <Code className="w-5 h-5" />}
                            {sectionKey === 'projects' && <Rocket className="w-5 h-5" />}
                            <span className="capitalize">{sectionKey.replace(/([A-Z])/g, ' $1').trim()}</span>
                            {section.required && <span className="text-red-500">*</span>}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {Object.entries(section.fields).map(([fieldKey, field]) => (
                            <div key={fieldKey} className="space-y-2">
                              <Label htmlFor={fieldKey} className="text-sm font-medium">
                                {field.label}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                              </Label>
                              
                              {field.type === 'text' && (
                                <Input
                                  id={fieldKey}
                                  placeholder={field.placeholder}
                                  value={resumeData[sectionKey]?.[fieldKey] || ''}
                                  onChange={(e) => handleFieldChange(sectionKey, fieldKey, e.target.value)}
                                />
                              )}
                              
                              {field.type === 'textarea' && (
                                <Textarea
                                  id={fieldKey}
                                  placeholder={field.placeholder}
                                  value={resumeData[sectionKey]?.[fieldKey] || ''}
                                  onChange={(e) => handleFieldChange(sectionKey, fieldKey, e.target.value)}
                                  rows={4}
                                />
                              )}
                              
                              {field.type === 'array' && (
                                <div className="space-y-3">
                                  {(resumeData[sectionKey]?.[fieldKey] || []).map((item: any, index: number) => (
                                    <Card key={index} className="p-4 border border-gray-200">
                                      <div className="flex items-start justify-between mb-3">
                                        <h4 className="font-medium">Item {index + 1}</h4>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleArrayFieldRemove(sectionKey, fieldKey, index)}
                                          className="text-red-500 hover:text-red-700"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </Button>
                                      </div>
                                      <div className="space-y-3">
                                        {Object.keys(item).map((itemField) => (
                                          <div key={itemField}>
                                            <Label className="text-xs text-gray-600 capitalize">
                                              {itemField.replace(/([A-Z])/g, ' $1').trim()}
                                            </Label>
                                            <Input
                                              placeholder={`Enter ${itemField}`}
                                              value={item[itemField] || ''}
                                              onChange={(e) => {
                                                const newItems = [...(resumeData[sectionKey]?.[fieldKey] || [])];
                                                newItems[index] = { ...newItems[index], [itemField]: e.target.value };
                                                setResumeData(prev => ({
                                                  ...prev,
                                                  [sectionKey]: {
                                                    ...prev[sectionKey],
                                                    [fieldKey]: newItems
                                                  }
                                                }));
                                              }}
                                            />
                                          </div>
                                        ))}
                                      </div>
                                    </Card>
                                  ))}
                                  <Button
                                    variant="outline"
                                    onClick={() => handleArrayFieldAdd(sectionKey, fieldKey)}
                                    className="w-full"
                                  >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add {field.label}
                                  </Button>
                                </div>
                              )}
                              
                              {field.helpText && (
                                <p className="text-xs text-gray-500">{field.helpText}</p>
                              )}
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="templates">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-xl font-semibold mb-2">Change Template</h3>
                      <p className="text-gray-600">Select a different template for your resume</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {RESUME_TEMPLATES.map((template) => (
                        <Card 
                          key={template.id} 
                          className={`cursor-pointer transition-all duration-200 ${
                            selectedTemplate?.id === template.id 
                              ? 'ring-2 ring-blue-500 bg-blue-50' 
                              : 'hover:shadow-md'
                          }`}
                          onClick={() => handleTemplateSelect(template)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{template.name}</h4>
                              {selectedTemplate?.id === template.id && (
                                <Check className="w-5 h-5 text-blue-500" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{template.description}</p>
                            <Badge variant="secondary" className="mt-2 text-xs">
                              {template.category}
                            </Badge>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="settings">
                  <div className="space-y-6">
                    <Card className="border-0 bg-white/80 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle>Resume Settings</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Color Scheme</Label>
                          <div className="flex space-x-2">
                            {['blue', 'purple', 'green', 'red', 'orange', 'gray'].map((color) => (
                              <Button
                                key={color}
                                variant="outline"
                                size="sm"
                                className={`w-8 h-8 p-0 bg-${color}-500 hover:bg-${color}-600`}
                              />
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Font Family</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select font" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="inter">Inter</SelectItem>
                              <SelectItem value="helvetica">Helvetica</SelectItem>
                              <SelectItem value="times">Times New Roman</SelectItem>
                              <SelectItem value="poppins">Poppins</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="ai">
                  <div className="space-y-6">
                    <Card className="border-0 bg-gradient-to-r from-purple-50 to-pink-50">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Sparkles className="w-5 h-5 text-purple-600" />
                          <span>AI Resume Assistant</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-600">
                          Get AI-powered suggestions to improve your resume content, optimize for ATS systems, and enhance your professional presentation.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Button className="flex items-center space-x-2 h-12">
                            <Wand2 className="w-4 h-4" />
                            <span>Optimize Content</span>
                          </Button>
                          <Button variant="outline" className="flex items-center space-x-2 h-12">
                            <Target className="w-4 h-4" />
                            <span>ATS Optimization</span>
                          </Button>
                          <Button variant="outline" className="flex items-center space-x-2 h-12">
                            <TrendingUp className="w-4 h-4" />
                            <span>Improve Keywords</span>
                          </Button>
                          <Button variant="outline" className="flex items-center space-x-2 h-12">
                            <Zap className="w-4 h-4" />
                            <span>Generate Summary</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Preview Panel */}
            <div className={`${isPreviewMode ? 'lg:col-span-2' : 'lg:col-span-1'} space-y-4`}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Live Preview</h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              
              <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''} transition-all duration-300`}>
                <div className={`${isFullscreen ? 'h-full overflow-auto' : 'max-h-[800px] overflow-auto'} border border-gray-200 rounded-lg bg-white shadow-lg`}>
                  <ResumePreview 
                    template={selectedTemplate}
                    data={resumeData}
                    isFullscreen={isFullscreen}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Template Preview Modal */}
      <Dialog open={showTemplatePreview} onOpenChange={setShowTemplatePreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Template Preview: {previewTemplate?.name}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {previewTemplate && (
              <div className="border border-gray-200 rounded-lg p-8 bg-white">
                <ResumePreview 
                  template={previewTemplate}
                  data={{}}
                  isPreview={true}
                />
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowTemplatePreview(false)}>
                Close
              </Button>
              <Button onClick={() => {
                if (previewTemplate) {
                  handleTemplateSelect(previewTemplate);
                  setShowTemplatePreview(false);
                }
              }}>
                Use This Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResumeBuilder;
