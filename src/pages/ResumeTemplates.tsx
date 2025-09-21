import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { PAGE_SEO } from '@/lib/seo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft,
  Eye,
  Download,
  Star,
  Filter,
  Search,
  FileText,
  Award,
  Users,
  Briefcase
} from 'lucide-react';

const ResumeTemplates = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Templates', count: 24 },
    { id: 'professional', name: 'Professional', count: 8 },
    { id: 'creative', name: 'Creative', count: 6 },
    { id: 'modern', name: 'Modern', count: 5 },
    { id: 'minimalist', name: 'Minimalist', count: 5 }
  ];

  const templates = [
    {
      id: 1,
      name: 'Professional Classic',
      category: 'professional',
      description: 'Clean and traditional design perfect for corporate roles',
      image: '/api/placeholder/300/400',
      rating: 4.8,
      downloads: 1250,
      price: 'Free',
      featured: true
    },
    {
      id: 2,
      name: 'Modern Executive',
      category: 'modern',
      description: 'Sleek design with bold typography for executive positions',
      image: '/api/placeholder/300/400',
      rating: 4.9,
      downloads: 980,
      price: 'Free',
      featured: true
    },
    {
      id: 3,
      name: 'Creative Portfolio',
      category: 'creative',
      description: 'Eye-catching design for creative professionals',
      image: '/api/placeholder/300/400',
      rating: 4.7,
      downloads: 750,
      price: 'Free',
      featured: false
    },
    {
      id: 4,
      name: 'Minimalist Clean',
      category: 'minimalist',
      description: 'Simple and elegant design that focuses on content',
      image: '/api/placeholder/300/400',
      rating: 4.6,
      downloads: 1100,
      price: 'Free',
      featured: false
    },
    {
      id: 5,
      name: 'Tech Professional',
      category: 'professional',
      description: 'Perfect for software engineers and tech professionals',
      image: '/api/placeholder/300/400',
      rating: 4.8,
      downloads: 890,
      price: 'Free',
      featured: true
    },
    {
      id: 6,
      name: 'Creative Designer',
      category: 'creative',
      description: 'Bold and colorful design for graphic designers',
      image: '/api/placeholder/300/400',
      rating: 4.5,
      downloads: 650,
      price: 'Free',
      featured: false
    }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <SEO seoData={PAGE_SEO['/resume-templates']} url="/resume-templates" />
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => window.history.back()}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Resume Tools
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume Templates</h1>
            <p className="text-gray-600">Choose from professionally designed resume templates</p>
          </div>

          {/* Filters and Search */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                    className="text-sm"
                  >
                    {category.name} ({category.count})
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center">
                    <FileText className="h-16 w-16 text-gray-400" />
                  </div>
                  {template.featured && (
                    <Badge className="absolute top-2 left-2 bg-blue-600">
                      Featured
                    </Badge>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <span className="text-sm font-medium text-green-600">{template.price}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{template.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      <span>{template.downloads}</span>
                    </div>
                  </div>
                  <Button className="w-full">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ResumeTemplates;
