import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Briefcase, 
  Users, 
  Award, 
  Upload, 
  Edit, 
  Save, 
  X, 
  Plus,
  ExternalLink,
  Download,
  Eye,
  Star,
  Target,
  Calendar,
  DollarSign,
  Code,
  BookOpen,
  Languages,
  Trophy,
  FileText,
  Linkedin,
  Github,
  Instagram,
  Twitter,
  TrendingUp,
  BarChart3,
  UserCheck,
  Settings,
  PlusCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/supabaseClient';

interface EmployerProfile {
  id: string;
  user_id: string;
  company_id: string;
  position: string;
  department: string;
  years_experience: number;
  company_size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  industry: string;
  company_stage: 'startup' | 'growth' | 'established' | 'enterprise';
  hiring_needs: string[];
  budget_range_min: number;
  budget_range_max: number;
  currency: string;
  locations: string[];
  work_models: string[];
  linkedin_url: string;
  bio: string;
  created_at: string;
  updated_at: string;
}

interface Company {
  id: string;
  name: string;
  description: string;
  website: string;
  logo_url: string;
  industry: string;
  size: string;
  founded_year: number;
  headquarters: string;
  social_links: any;
  created_at: string;
  updated_at: string;
}

const EmployerProfile: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<EmployerProfile | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Form state
  const [formData, setFormData] = useState({
    position: '',
    department: '',
    years_experience: 0,
    company_size: 'startup' as const,
    industry: '',
    company_stage: 'startup' as const,
    hiring_needs: [] as string[],
    budget_range_min: 0,
    budget_range_max: 0,
    currency: 'USD',
    locations: [] as string[],
    work_models: [] as string[],
    linkedin_url: '',
    bio: '',
  });

  const [companyFormData, setCompanyFormData] = useState({
    name: '',
    description: '',
    website: '',
    logo_url: '',
    industry: '',
    size: '',
    founded_year: new Date().getFullYear(),
    headquarters: '',
    social_links: {
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: ''
    }
  });

  const [tempHiringNeed, setTempHiringNeed] = useState('');
  const [tempLocation, setTempLocation] = useState('');

  const commonIndustries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing',
    'Consulting', 'Non-profit', 'Government', 'Media', 'Entertainment', 'Real Estate',
    'Automotive', 'Aerospace', 'Energy', 'Telecommunications', 'Food & Beverage'
  ];

  const commonHiringNeeds = [
    'Software Engineers', 'Product Managers', 'Data Scientists', 'Designers',
    'Marketing Specialists', 'Sales Representatives', 'Customer Success',
    'Operations', 'HR Professionals', 'Finance Analysts', 'DevOps Engineers',
    'QA Engineers', 'Business Analysts', 'Project Managers'
  ];

  const workModels = ['Remote', 'Hybrid', 'On-site', 'Flexible'];

  const companySizes = [
    { value: 'startup', label: 'Startup (1-10 employees)' },
    { value: 'small', label: 'Small (11-50 employees)' },
    { value: 'medium', label: 'Medium (51-200 employees)' },
    { value: 'large', label: 'Large (201-1000 employees)' },
    { value: 'enterprise', label: 'Enterprise (1000+ employees)' }
  ];

  const companyStages = [
    { value: 'startup', label: 'Startup' },
    { value: 'growth', label: 'Growth Stage' },
    { value: 'established', label: 'Established' },
    { value: 'enterprise', label: 'Enterprise' }
  ];

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchCompany();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('employer_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setFormData({
          position: data.position || '',
          department: data.department || '',
          years_experience: data.years_experience || 0,
          company_size: data.company_size || 'startup',
          industry: data.industry || '',
          company_stage: data.company_stage || 'startup',
          hiring_needs: data.hiring_needs || [],
          budget_range_min: data.budget_range_min || 0,
          budget_range_max: data.budget_range_max || 0,
          currency: data.currency || 'USD',
          locations: data.locations || [],
          work_models: data.work_models || [],
          linkedin_url: data.linkedin_url || '',
          bio: data.bio || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCompany = async () => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', profile?.company_id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setCompany(data);
        setCompanyFormData({
          name: data.name || '',
          description: data.description || '',
          website: data.website || '',
          logo_url: data.logo_url || '',
          industry: data.industry || '',
          size: data.size || '',
          founded_year: data.founded_year || new Date().getFullYear(),
          headquarters: data.headquarters || '',
          social_links: data.social_links || {
            linkedin: '',
            twitter: '',
            facebook: '',
            instagram: ''
          }
        });
      }
    } catch (error) {
      console.error('Error fetching company:', error);
    }
  };

  const saveProfile = async () => {
    try {
      const { error } = await supabase
        .from('employer_profiles')
        .upsert({
          user_id: user?.id,
          ...formData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });

      setEditing(false);
      fetchProfile();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile.",
        variant: "destructive",
      });
    }
  };

  const saveCompany = async () => {
    try {
      const { error } = await supabase
        .from('companies')
        .upsert({
          id: company?.id || undefined,
          ...companyFormData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Company information updated successfully!",
      });

      fetchCompany();
    } catch (error) {
      console.error('Error saving company:', error);
      toast({
        title: "Error",
        description: "Failed to save company information.",
        variant: "destructive",
      });
    }
  };

  const addItem = (field: string, value: string, setter: (value: string) => void) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field as keyof typeof prev] as string[], value.trim()]
      }));
      setter('');
    }
  };

  const removeItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).filter((_, i) => i !== index)
    }));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getCompanySizeColor = (size: string) => {
    switch (size) {
      case 'startup': return 'bg-green-100 text-green-800';
      case 'small': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-purple-100 text-purple-800';
      case 'large': return 'bg-orange-100 text-orange-800';
      case 'enterprise': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.avatar_url} alt={user?.full_name} />
                <AvatarFallback className="text-lg">
                  {getInitials(user?.full_name || '')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user?.full_name}</h1>
                <p className="text-gray-600">{formData.position || 'Employer'}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge className={getCompanySizeColor(formData.company_size)}>
                    {companySizes.find(s => s.value === formData.company_size)?.label}
                  </Badge>
                  <Badge variant="outline">{formData.industry}</Badge>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              {editing ? (
                <>
                  <Button onClick={saveProfile} className="bg-blue-600 hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setEditing(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="hiring">Hiring</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCheck className="h-5 w-5 mr-2" />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                      disabled={!editing}
                      placeholder="e.g., HR Director"
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                      disabled={!editing}
                      placeholder="e.g., Human Resources"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    disabled={!editing}
                    placeholder="Tell us about your professional background..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="years_experience">Years of Experience</Label>
                    <Input
                      id="years_experience"
                      type="number"
                      value={formData.years_experience}
                      onChange={(e) => setFormData(prev => ({ ...prev, years_experience: parseInt(e.target.value) || 0 }))}
                      disabled={!editing}
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company_size">Company Size</Label>
                    <select
                      id="company_size"
                      value={formData.company_size}
                      onChange={(e) => setFormData(prev => ({ ...prev, company_size: e.target.value as any }))}
                      disabled={!editing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {companySizes.map(size => (
                        <option key={size.value} value={size.value}>{size.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="company_stage">Company Stage</Label>
                    <select
                      id="company_stage"
                      value={formData.company_stage}
                      onChange={(e) => setFormData(prev => ({ ...prev, company_stage: e.target.value as any }))}
                      disabled={!editing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {companyStages.map(stage => (
                        <option key={stage.value} value={stage.value}>{stage.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Company Tab */}
          <TabsContent value="company" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Company Information
                </CardTitle>
                <CardDescription>
                  Manage your company profile and information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company_name">Company Name</Label>
                    <Input
                      id="company_name"
                      value={companyFormData.name}
                      onChange={(e) => setCompanyFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Acme Corporation"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={companyFormData.website}
                      onChange={(e) => setCompanyFormData(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://www.company.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="company_description">Company Description</Label>
                  <Textarea
                    id="company_description"
                    value={companyFormData.description}
                    onChange={(e) => setCompanyFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your company..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <select
                      id="industry"
                      value={companyFormData.industry}
                      onChange={(e) => setCompanyFormData(prev => ({ ...prev, industry: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Industry</option>
                      {commonIndustries.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="founded_year">Founded Year</Label>
                    <Input
                      id="founded_year"
                      type="number"
                      value={companyFormData.founded_year}
                      onChange={(e) => setCompanyFormData(prev => ({ ...prev, founded_year: parseInt(e.target.value) || new Date().getFullYear() }))}
                      placeholder="2020"
                    />
                  </div>
                  <div>
                    <Label htmlFor="headquarters">Headquarters</Label>
                    <Input
                      id="headquarters"
                      value={companyFormData.headquarters}
                      onChange={(e) => setCompanyFormData(prev => ({ ...prev, headquarters: e.target.value }))}
                      placeholder="e.g., San Francisco, CA"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={saveCompany} className="bg-green-600 hover:bg-green-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Company Info
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hiring Tab */}
          <TabsContent value="hiring" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Hiring Needs
                </CardTitle>
                <CardDescription>
                  Define your current hiring requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={tempHiringNeed}
                    onChange={(e) => setTempHiringNeed(e.target.value)}
                    placeholder="Add a hiring need"
                    onKeyPress={(e) => e.key === 'Enter' && addItem('hiring_needs', tempHiringNeed, setTempHiringNeed)}
                  />
                  <Button onClick={() => addItem('hiring_needs', tempHiringNeed, setTempHiringNeed)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {formData.hiring_needs.map((need, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {need}
                      {editing && (
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeItem('hiring_needs', index)}
                        />
                      )}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {commonHiringNeeds.filter(need => !formData.hiring_needs.includes(need)).map(need => (
                    <Button
                      key={need}
                      variant="outline"
                      size="sm"
                      onClick={() => addItem('hiring_needs', need, setTempHiringNeed)}
                      disabled={!editing}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {need}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Budget Range
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="budget_min">Minimum Budget</Label>
                    <Input
                      id="budget_min"
                      type="number"
                      value={formData.budget_range_min}
                      onChange={(e) => setFormData(prev => ({ ...prev, budget_range_min: parseInt(e.target.value) || 0 }))}
                      disabled={!editing}
                      placeholder="50000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="budget_max">Maximum Budget</Label>
                    <Input
                      id="budget_max"
                      type="number"
                      value={formData.budget_range_max}
                      onChange={(e) => setFormData(prev => ({ ...prev, budget_range_max: parseInt(e.target.value) || 0 }))}
                      disabled={!editing}
                      placeholder="100000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <select
                      id="currency"
                      value={formData.currency}
                      onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                      disabled={!editing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="CAD">CAD</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Work Locations & Models
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Work Models</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {workModels.map(model => (
                      <Button
                        key={model}
                        variant={formData.work_models.includes(model) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          if (editing) {
                            setFormData(prev => ({
                              ...prev,
                              work_models: prev.work_models.includes(model)
                                ? prev.work_models.filter(m => m !== model)
                                : [...prev.work_models, model]
                            }));
                          }
                        }}
                        disabled={!editing}
                      >
                        {model}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="locations">Preferred Locations</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex gap-2">
                      <Input
                        value={tempLocation}
                        onChange={(e) => setTempLocation(e.target.value)}
                        placeholder="Add a location"
                        onKeyPress={(e) => e.key === 'Enter' && addItem('locations', tempLocation, setTempLocation)}
                        disabled={!editing}
                      />
                      <Button 
                        onClick={() => addItem('locations', tempLocation, setTempLocation)}
                        disabled={!editing}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {formData.locations.map((location, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {location}
                          {editing && (
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => removeItem('locations', index)}
                            />
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">
                    +2 from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">
                    +15% from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Hired Candidates</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">
                    +3 from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest hiring activity and job postings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New job posting: Senior Developer</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Candidate hired: John Smith</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New application received</p>
                      <p className="text-xs text-gray-500">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmployerProfile;
