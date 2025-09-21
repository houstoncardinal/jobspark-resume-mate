import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Users, 
  Building2, 
  Save, 
  Eye, 
  Send,
  Plus,
  X,
  Calendar,
  Target,
  FileText,
  CheckCircle,
  AlertCircle,
  Globe,
  Home,
  Smartphone,
  Laptop
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/supabaseClient';
import { useNavigate } from 'react-router-dom';

interface JobPosting {
  id?: string;
  title: string;
  company_id: string;
  posted_by: string;
  description: string;
  requirements: string[];
  benefits: string[];
  location: string;
  remote_allowed: boolean;
  salary_min: number;
  salary_max: number;
  currency: string;
  employment_type: 'full-time' | 'part-time' | 'contract' | 'internship';
  experience_level: 'entry' | 'mid' | 'senior' | 'executive';
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'expired';
  is_featured: boolean;
  is_urgent: boolean;
  application_deadline: string;
  views: number;
  applications_count: number;
  created_at?: string;
  updated_at?: string;
}

const PostJob: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [previewMode, setPreviewMode] = useState(false);

  // Form state
  const [formData, setFormData] = useState<JobPosting>({
    title: '',
    company_id: '',
    posted_by: user?.id || '',
    description: '',
    requirements: [],
    benefits: [],
    location: '',
    remote_allowed: false,
    salary_min: 0,
    salary_max: 0,
    currency: 'USD',
    employment_type: 'full-time',
    experience_level: 'entry',
    status: 'draft',
    is_featured: false,
    is_urgent: false,
    application_deadline: '',
    views: 0,
    applications_count: 0,
  });

  const [tempRequirement, setTempRequirement] = useState('');
  const [tempBenefit, setTempBenefit] = useState('');

  const employmentTypes = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' }
  ];

  const experienceLevels = [
    { value: 'entry', label: 'Entry Level' },
    { value: 'mid', label: 'Mid Level' },
    { value: 'senior', label: 'Senior Level' },
    { value: 'executive', label: 'Executive' }
  ];

  const currencies = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'CAD', label: 'CAD (C$)' }
  ];

  const commonRequirements = [
    'Bachelor\'s degree in relevant field',
    '2+ years of experience',
    'Strong communication skills',
    'Problem-solving abilities',
    'Team player',
    'Proficiency in [specific technology]',
    'Previous experience in [industry]',
    'Portfolio of previous work',
    'Certification in [relevant field]',
    'Willingness to travel'
  ];

  const commonBenefits = [
    'Health insurance',
    'Dental insurance',
    'Vision insurance',
    '401(k) matching',
    'Paid time off',
    'Flexible work hours',
    'Remote work options',
    'Professional development',
    'Gym membership',
    'Stock options',
    'Bonuses',
    'Maternity/paternity leave'
  ];

  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, posted_by: user.id }));
    }
  }, [user]);

  const addItem = (field: 'requirements' | 'benefits', value: string, setter: (value: string) => void) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      setter('');
    }
  };

  const removeItem = (field: 'requirements' | 'benefits', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const saveJob = async (status: 'draft' | 'pending') => {
    try {
      setLoading(true);
      
      const jobData = {
        ...formData,
        status,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('job_postings')
        .insert(jobData)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: status === 'draft' ? "Job saved as draft!" : "Job posted successfully!",
      });

      navigate('/employer/jobs');
    } catch (error) {
      console.error('Error saving job:', error);
      toast({
        title: "Error",
        description: "Failed to save job posting.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getExperienceLevelColor = (level: string) => {
    switch (level) {
      case 'entry': return 'bg-green-100 text-green-800';
      case 'mid': return 'bg-blue-100 text-blue-800';
      case 'senior': return 'bg-purple-100 text-purple-800';
      case 'executive': return 'bg-gold-100 text-gold-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEmploymentTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-blue-100 text-blue-800';
      case 'part-time': return 'bg-green-100 text-green-800';
      case 'contract': return 'bg-orange-100 text-orange-800';
      case 'internship': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Post a New Job</h1>
              <p className="text-gray-600">Create a job posting to attract top talent</p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {previewMode ? 'Edit' : 'Preview'}
              </Button>
            </div>
          </div>
        </div>

        {previewMode ? (
          /* Preview Mode */
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{formData.title || 'Job Title'}</CardTitle>
                    <CardDescription className="flex items-center space-x-2 mt-2">
                      <Building2 className="h-4 w-4" />
                      <span>Company Name</span>
                      <span>•</span>
                      <MapPin className="h-4 w-4" />
                      <span>{formData.location || 'Location'}</span>
                      {formData.remote_allowed && (
                        <>
                          <span>•</span>
                          <Badge variant="outline">Remote</Badge>
                        </>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={getExperienceLevelColor(formData.experience_level)}>
                      {experienceLevels.find(l => l.value === formData.experience_level)?.label}
                    </Badge>
                    <Badge className={getEmploymentTypeColor(formData.employment_type)}>
                      {employmentTypes.find(t => t.value === formData.employment_type)?.label}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Salary */}
                {(formData.salary_min > 0 || formData.salary_max > 0) && (
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="text-lg font-semibold">
                      {formData.salary_min > 0 && formData.salary_max > 0
                        ? `${formData.currency} ${formData.salary_min.toLocaleString()} - ${formData.salary_max.toLocaleString()}`
                        : formData.salary_min > 0
                        ? `${formData.currency} ${formData.salary_min.toLocaleString()}+`
                        : `Up to ${formData.currency} ${formData.salary_max.toLocaleString()}`
                      }
                    </span>
                  </div>
                )}

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Job Description</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {formData.description || 'Job description will appear here...'}
                  </p>
                </div>

                {/* Requirements */}
                {formData.requirements.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {formData.requirements.map((req, index) => (
                        <li key={index} className="text-gray-700">{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Benefits */}
                {formData.benefits.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Benefits</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {formData.benefits.map((benefit, index) => (
                        <li key={index} className="text-gray-700">{benefit}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Application Deadline */}
                {formData.application_deadline && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Application deadline: {new Date(formData.application_deadline).toLocaleDateString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Edit Mode */
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>
                    Essential details about the job position
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Senior Software Engineer"
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="employment_type">Employment Type *</Label>
                      <select
                        id="employment_type"
                        value={formData.employment_type}
                        onChange={(e) => setFormData(prev => ({ ...prev, employment_type: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                      >
                        {employmentTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="experience_level">Experience Level *</Label>
                      <select
                        id="experience_level"
                        value={formData.experience_level}
                        onChange={(e) => setFormData(prev => ({ ...prev, experience_level: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                      >
                        {experienceLevels.map(level => (
                          <option key={level.value} value={level.value}>{level.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="e.g., San Francisco, CA"
                        className="mt-1"
                      />
                    </div>
                    <div className="flex items-center space-x-2 mt-6">
                      <input
                        type="checkbox"
                        id="remote_allowed"
                        checked={formData.remote_allowed}
                        onChange={(e) => setFormData(prev => ({ ...prev, remote_allowed: e.target.checked }))}
                        className="rounded"
                      />
                      <Label htmlFor="remote_allowed">Remote work allowed</Label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Job Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the role, responsibilities, and what makes this opportunity unique..."
                      rows={6}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Salary & Compensation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="salary_min">Minimum Salary</Label>
                      <Input
                        id="salary_min"
                        type="number"
                        value={formData.salary_min}
                        onChange={(e) => setFormData(prev => ({ ...prev, salary_min: parseInt(e.target.value) || 0 }))}
                        placeholder="50000"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="salary_max">Maximum Salary</Label>
                      <Input
                        id="salary_max"
                        type="number"
                        value={formData.salary_max}
                        onChange={(e) => setFormData(prev => ({ ...prev, salary_max: parseInt(e.target.value) || 0 }))}
                        placeholder="80000"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <select
                        id="currency"
                        value={formData.currency}
                        onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                      >
                        {currencies.map(currency => (
                          <option key={currency.value} value={currency.value}>{currency.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Application Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="application_deadline">Application Deadline</Label>
                    <Input
                      id="application_deadline"
                      type="date"
                      value={formData.application_deadline}
                      onChange={(e) => setFormData(prev => ({ ...prev, application_deadline: e.target.value }))}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is_featured"
                        checked={formData.is_featured}
                        onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                        className="rounded"
                      />
                      <Label htmlFor="is_featured">Featured job posting</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is_urgent"
                        checked={formData.is_urgent}
                        onChange={(e) => setFormData(prev => ({ ...prev, is_urgent: e.target.checked }))}
                        className="rounded"
                      />
                      <Label htmlFor="is_urgent">Urgent hiring</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Requirements Tab */}
            <TabsContent value="requirements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Job Requirements
                  </CardTitle>
                  <CardDescription>
                    List the skills, qualifications, and experience required for this position
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={tempRequirement}
                      onChange={(e) => setTempRequirement(e.target.value)}
                      placeholder="Add a requirement"
                      onKeyPress={(e) => e.key === 'Enter' && addItem('requirements', tempRequirement, setTempRequirement)}
                    />
                    <Button onClick={() => addItem('requirements', tempRequirement, setTempRequirement)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {formData.requirements.map((req, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>{req}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem('requirements', index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {commonRequirements.filter(req => !formData.requirements.includes(req)).map(req => (
                      <Button
                        key={req}
                        variant="outline"
                        size="sm"
                        onClick={() => addItem('requirements', req, setTempRequirement)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {req}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Benefits Tab */}
            <TabsContent value="benefits" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Benefits & Perks
                  </CardTitle>
                  <CardDescription>
                    Highlight the benefits and perks you offer to attract top talent
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={tempBenefit}
                      onChange={(e) => setTempBenefit(e.target.value)}
                      placeholder="Add a benefit"
                      onKeyPress={(e) => e.key === 'Enter' && addItem('benefits', tempBenefit, setTempBenefit)}
                    />
                    <Button onClick={() => addItem('benefits', tempBenefit, setTempBenefit)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {formData.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>{benefit}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem('benefits', index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {commonBenefits.filter(benefit => !formData.benefits.includes(benefit)).map(benefit => (
                      <Button
                        key={benefit}
                        variant="outline"
                        size="sm"
                        onClick={() => addItem('benefits', benefit, setTempBenefit)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {benefit}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* Action Buttons */}
        {!previewMode && (
          <div className="flex justify-between items-center bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-sm text-gray-500">
              {formData.title ? 'Ready to post' : 'Complete the form to continue'}
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => saveJob('draft')}
                disabled={loading || !formData.title}
              >
                <Save className="h-4 w-4 mr-2" />
                Save as Draft
              </Button>
              <Button
                onClick={() => saveJob('pending')}
                disabled={loading || !formData.title || !formData.description}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4 mr-2" />
                {loading ? 'Posting...' : 'Post Job'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostJob;
