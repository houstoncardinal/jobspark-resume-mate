import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Eye, 
  Check, 
  Star, 
  Crown, 
  Palette, 
  Zap, 
  Type, 
  Briefcase,
  Sparkles,
  ArrowRight,
  Download,
  Share2,
  Heart,
  ThumbsUp
} from 'lucide-react';
import { RESUME_TEMPLATES, type ResumeTemplate } from '@/lib/ResumeTemplates';
import { ResumePreview } from '@/components/resume/ResumePreview';

interface TemplateShowcaseProps {
  onTemplateSelect: (template: ResumeTemplate) => void;
  selectedTemplate?: ResumeTemplate | null;
}

export const TemplateShowcase: React.FC<TemplateShowcaseProps> = ({
  onTemplateSelect,
  selectedTemplate
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewTemplate, setPreviewTemplate] = useState<ResumeTemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const categories = [
    { id: 'all', name: 'All Templates', icon: Star, color: 'from-purple-500 to-pink-500', count: RESUME_TEMPLATES.length },
    { id: 'professional', name: 'Professional', icon: Briefcase, color: 'from-blue-500 to-cyan-500', count: RESUME_TEMPLATES.filter(t => t.category === 'professional').length },
    { id: 'creative', name: 'Creative', icon: Palette, color: 'from-pink-500 to-rose-500', count: RESUME_TEMPLATES.filter(t => t.category === 'creative').length },
    { id: 'modern', name: 'Modern', icon: Zap, color: 'from-green-500 to-emerald-500', count: RESUME_TEMPLATES.filter(t => t.category === 'modern').length },
    { id: 'minimalist', name: 'Minimalist', icon: Type, color: 'from-gray-500 to-slate-500', count: RESUME_TEMPLATES.filter(t => t.category === 'minimalist').length },
    { id: 'executive', name: 'Executive', icon: Crown, color: 'from-amber-500 to-yellow-500', count: RESUME_TEMPLATES.filter(t => t.category === 'executive').length }
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? RESUME_TEMPLATES 
    : RESUME_TEMPLATES.filter(template => template.category === selectedCategory);

  const handlePreview = (template: ResumeTemplate) => {
    setPreviewTemplate(template);
    setShowPreview(true);
  };

  const getTemplatePreview = (template: ResumeTemplate) => {
    // Generate a visual preview based on template characteristics
    const isTwoColumn = template.styling.layout === 'two-column';
    const isHybrid = template.styling.layout === 'hybrid';
    
    return (
      <div className="w-full h-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-800 rounded w-3/4"></div>
            <div className="h-3 bg-gray-600 rounded w-1/2"></div>
            <div className="flex space-x-2">
              <div className="h-2 bg-gray-400 rounded w-16"></div>
              <div className="h-2 bg-gray-400 rounded w-20"></div>
              <div className="h-2 bg-gray-400 rounded w-14"></div>
            </div>
          </div>
          
          {/* Content based on layout */}
          {isTwoColumn ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                <div className="space-y-1">
                  <div className="h-2 bg-gray-400 rounded w-full"></div>
                  <div className="h-2 bg-gray-400 rounded w-5/6"></div>
                  <div className="h-2 bg-gray-400 rounded w-4/6"></div>
                </div>
                <div className="space-y-1">
                  <div className="h-2 bg-gray-400 rounded w-full"></div>
                  <div className="h-2 bg-gray-400 rounded w-3/4"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                <div className="flex flex-wrap gap-1">
                  <div className="h-2 bg-gray-300 rounded w-12"></div>
                  <div className="h-2 bg-gray-300 rounded w-16"></div>
                  <div className="h-2 bg-gray-300 rounded w-14"></div>
                </div>
                <div className="space-y-1">
                  <div className="h-2 bg-gray-400 rounded w-full"></div>
                  <div className="h-2 bg-gray-400 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ) : isHybrid ? (
            <div className="space-y-3">
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="h-2 bg-gray-400 rounded w-full"></div>
                  <div className="h-2 bg-gray-400 rounded w-5/6"></div>
                </div>
                <div className="space-y-1">
                  <div className="h-2 bg-gray-400 rounded w-full"></div>
                  <div className="h-2 bg-gray-400 rounded w-3/4"></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="h-2 bg-gray-400 rounded w-full"></div>
                <div className="h-2 bg-gray-400 rounded w-4/6"></div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              <div className="space-y-1">
                <div className="h-2 bg-gray-400 rounded w-full"></div>
                <div className="h-2 bg-gray-400 rounded w-5/6"></div>
                <div className="h-2 bg-gray-400 rounded w-4/6"></div>
              </div>
              <div className="space-y-1">
                <div className="h-2 bg-gray-400 rounded w-full"></div>
                <div className="h-2 bg-gray-400 rounded w-3/4"></div>
              </div>
              <div className="flex flex-wrap gap-1">
                <div className="h-2 bg-gray-300 rounded w-12"></div>
                <div className="h-2 bg-gray-300 rounded w-16"></div>
                <div className="h-2 bg-gray-300 rounded w-14"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          <span>Professional Templates</span>
        </div>
        <h2 className="text-4xl font-bold text-gray-900">
          Choose Your Perfect Resume Template
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Select from our collection of professionally designed templates, each crafted to help you stand out to employers and land your dream job.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 transition-all duration-200 ${
                selectedCategory === category.id 
                  ? `bg-gradient-to-r ${category.color} text-white border-0 shadow-lg` 
                  : 'bg-white hover:bg-gray-50 border-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{category.name}</span>
              <Badge variant="secondary" className="ml-1 text-xs">
                {category.count}
              </Badge>
            </Button>
          );
        })}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTemplates.map((template) => (
          <Card 
            key={template.id} 
            className={`group hover:shadow-2xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm ${
              selectedTemplate?.id === template.id 
                ? 'ring-2 ring-blue-500 shadow-xl' 
                : 'hover:scale-105'
            }`}
          >
            <CardContent className="p-0">
              <div className="relative">
                {/* Template Preview */}
                <div className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-lg overflow-hidden">
                  {getTemplatePreview(template)}
                </div>
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handlePreview(template)}
                      className="bg-white/90 hover:bg-white text-gray-900"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onTemplateSelect(template)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Use Template
                    </Button>
                  </div>
                </div>
                
                {/* Selected indicator */}
                {selectedTemplate?.id === template.id && (
                  <div className="absolute top-4 right-4">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Template Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{template.name}</h3>
                    <p className="text-gray-600 text-sm">{template.description}</p>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs font-medium ${
                      template.category === 'professional' ? 'bg-blue-100 text-blue-800' :
                      template.category === 'creative' ? 'bg-pink-100 text-pink-800' :
                      template.category === 'modern' ? 'bg-green-100 text-green-800' :
                      template.category === 'minimalist' ? 'bg-gray-100 text-gray-800' :
                      'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {template.category}
                  </Badge>
                </div>
                
                {/* Template Features */}
                <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>{template.styling.layout}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>{template.styling.fontFamily}</span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePreview(template)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <Button
                    onClick={() => onTemplateSelect(template)}
                    className={`flex items-center space-x-2 ${
                      selectedTemplate?.id === template.id
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                    }`}
                  >
                    {selectedTemplate?.id === template.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Selected</span>
                      </>
                    ) : (
                      <>
                        <ArrowRight className="w-4 h-4" />
                        <span>Select</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
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
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Close
              </Button>
              <Button onClick={() => {
                if (previewTemplate) {
                  onTemplateSelect(previewTemplate);
                  setShowPreview(false);
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
