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
  UserCheck, 
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
  Building2,
  Settings,
  PlusCircle,
  Handshake,
  Search,
  Filter,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/supabaseClient';

interface RecruiterProfile {
  id: string;
  user_id: string;
  company_id: string;
  current_title: string;
  department: string;
  years_experience: number;
  specializations: string[];
  industries: string[];
  job_levels: string[];
  locations: string[];
  budget_range_min: number;
  budget_range_max: number;
  currency: string;
  hiring_volume: number;
  team_size: number;
  linkedin_url: string;
  bio: string;
  achievements: string[];
  certifications: string[];
  created_at: string;
  updated_at: string;
}

interface ClientCompany {
  id: string;
  name: string;
  industry: string;
  size: string;
  contact_person: string;
  contact_email: string;
  status: 'active' | 'inactive' | 'prospect';
  created_at: string;
}

const RecruiterProfile: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<RecruiterProfile | null>(null);
  const [clientCompanies, setClientCompanies] = useState<ClientCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Form state
  const [formData, setFormData] = useState({
    current_title: '',
    department: '',
    years_experience: 0,
    specializations: [] as string[],
    industries: [] as string[],
    job_levels: [] as string[],
    locations: [] as string[],
    budget_range_min: 0,
    budget_range_max: 0,
    currency: 'USD',
    hiring_volume: 0,
    team_size: 0,
    linkedin_url: '',
    bio: '',
    achievements: [] as string[],
    certifications: [] as string[],
  });

  const [tempSpecialization, setTempSpecialization] = useState('');
  const [tempIndustry, setTempIndustry] = useState('');
  const [tempLocation, setTempLocation] = useState('');
  const [tempAchievement, setTempAchievement] = useState('');
  const [tempCertification, setTempCertification] = useState('');

  const commonSpecializations = [
    'Technology', 'Healthcare', 'Finance', 'Sales', 'Marketing', 'Operations',
    'Human Resources', 'Engineering', 'Product Management', 'Data Science',
    'Design', 'Customer Success', 'Business Development', 'Executive Search'
  ];

  const commonIndustries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing',
    'Consulting', 'Non-profit', 'Government', 'Media', 'Entertainment', 'Real Estate',
    'Automotive', 'Aerospace', 'Energy', 'Telecommunications', 'Food & Beverage'
  ];

  const jobLevels = [
    'Entry Level', 'Mid Level', 'Senior Level', 'Executive', 'C-Level'
  ];

  const experienceLevels = [
    { value: 1, label: '1-2 years' },
    { value: 3, label: '3-5 years' },
    { value: 6, label: '6-10 years' },
    { value: 11, label: '11-15 years' },
    { value: 16, label: '16+ years' }
  ];

  const hiringVolumes = [
    { value: 1, label: '1-5 hires/month' },
    { value: 6, label: '6-10 hires/month' },
    { value: 11, label: '11-20 hires/month' },
    { value: 21, label: '21-50 hires/month' },
    { value: 51, label: '50+ hires/month' }
  ];

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchClientCompanies();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('recruiter_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setFormData({
          current_title: data.current_title || '',
          department: data.department || '',
          years_experience: data.years_experience || 0,
          specializations: data.specializations || [],
          industries: data.industries || [],
          job_levels: data.job_levels || [],
          locations: data.locations || [],
          budget_range_min: data.budget_range_min || 0,
          budget_range_max: data.budget_range_max || 0,
          currency: data.currency || 'USD',
          hiring_volume: data.hiring_volume || 0,
          team_size: data.team_size || 0,
          linkedin_url: data.linkedin_url || '',
          bio: data.bio || '',
          achievements: data.achievements || [],
          certifications: data.certifications || [],
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

  const fetchClientCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('client_companies')
        .select('*')
        .eq('recruiter_id', user?.id);

      if (error) {
        console.error('Error fetching client companies:', error);
        return;
      }

      setClientCompanies(data || []);
    } catch (error) {
      console.error('Error fetching client companies:', error);
    }
  };

  const saveProfile = async () => {
    try {
      const { error } = await supabase
        .from('recruiter_profiles')
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

  const getExperienceLevelColor = (years: number) => {
    if (years <= 2) return 'bg-green-100 text-green-800';
    if (years <= 5) return 'bg-blue-100 text-blue-800';
    if (years <= 10) return 'bg-purple-100 text-purple-800';
    return 'bg-gold-100 text-gold-800';
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
                <p className="text-gray-600">{formData.current_title || 'Recruiter'}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge className={getExperienceLevelColor(formData.years_experience)}>
                    {formData.years_experience}+ years experience
                  </Badge>
                  <Badge variant="outline">{formData.hiring_volume} hires/month</Badge>
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="specializations">Specializations</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
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
                    <Label htmlFor="current_title">Current Title</Label>
                    <Input
                      id="current_title"
                      value={formData.current_title}
                      onChange={(e) => setFormData(prev => ({ ...prev, current_title: e.target.value }))}
                      disabled={!editing}
                      placeholder="e.g., Senior Technical Recruiter"
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                      disabled={!editing}
                      placeholder="e.g., Talent Acquisition"
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
                    placeholder="Tell us about your recruiting experience and expertise..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="years_experience">Years of Experience</Label>
                    <select
                      id="years_experience"
                      value={formData.years_experience}
                      onChange={(e) => setFormData(prev => ({ ...prev, years_experience: parseInt(e.target.value) || 0 }))}
                      disabled={!editing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {experienceLevels.map(level => (
                        <option key={level.value} value={level.value}>{level.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="hiring_volume">Hiring Volume</Label>
                    <select
                      id="hiring_volume"
                      value={formData.hiring_volume}
                      onChange={(e) => setFormData(prev => ({ ...prev, hiring_volume: parseInt(e.target.value) || 0 }))}
                      disabled={!editing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {hiringVolumes.map(volume => (
                        <option key={volume.value} value={volume.value}>{volume.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="team_size">Team Size</Label>
                    <Input
                      id="team_size"
                      type="number"
                      value={formData.team_size}
                      onChange={(e) => setFormData(prev => ({ ...prev, team_size: parseInt(e.target.value) || 0 }))}
                      disabled={!editing}
                      placeholder="5"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Specializations Tab */}
          <TabsContent value="specializations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Specializations
                </CardTitle>
                <CardDescription>
                  Define your areas of expertise in recruiting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={tempSpecialization}
                    onChange={(e) => setTempSpecialization(e.target.value)}
                    placeholder="Add a specialization"
                    disabled={!editing}
                    onKeyPress={(e) => e.key === 'Enter' && addItem('specializations', tempSpecialization, setTempSpecialization)}
                  />
                  <Button 
                    onClick={() => addItem('specializations', tempSpecialization, setTempSpecialization)}
                    disabled={!editing}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {formData.specializations.map((specialization, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {specialization}
                      {editing && (
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeItem('specializations', index)}
                        />
                      )}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {commonSpecializations.filter(spec => !formData.specializations.includes(spec)).map(spec => (
                    <Button
                      key={spec}
                      variant="outline"
                      size="sm"
                      onClick={() => addItem('specializations', spec, setTempSpecialization)}
                      disabled={!editing}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {spec}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Industries
                </CardTitle>
                <CardDescription>
                  Select industries you recruit for
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={tempIndustry}
                    onChange={(e) => setTempIndustry(e.target.value)}
                    placeholder="Add an industry"
                    disabled={!editing}
                    onKeyPress={(e) => e.key === 'Enter' && addItem('industries', tempIndustry, setTempIndustry)}
                  />
                  <Button 
                    onClick={() => addItem('industries', tempIndustry, setTempIndustry)}
                    disabled={!editing}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {formData.industries.map((industry, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {industry}
                      {editing && (
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeItem('industries', index)}
                        />
                      )}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {commonIndustries.filter(industry => !formData.industries.includes(industry)).map(industry => (
                    <Button
                      key={industry}
                      variant="outline"
                      size="sm"
                      onClick={() => addItem('industries', industry, setTempIndustry)}
                      disabled={!editing}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {industry}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Job Levels
                </CardTitle>
                <CardDescription>
                  Select job levels you recruit for
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {jobLevels.map(level => (
                    <Button
                      key={level}
                      variant={formData.job_levels.includes(level) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        if (editing) {
                          setFormData(prev => ({
                            ...prev,
                            job_levels: prev.job_levels.includes(level)
                              ? prev.job_levels.filter(l => l !== level)
                              : [...prev.job_levels, level]
                          }));
                        }
                      }}
                      disabled={!editing}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Handshake className="h-5 w-5 mr-2" />
                  Client Companies
                </CardTitle>
                <CardDescription>
                  Manage your client relationships
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clientCompanies.length > 0 ? (
                    clientCompanies.map((company) => (
                      <div key={company.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{company.name}</h3>
                          <p className="text-sm text-gray-500">{company.industry} • {company.size}</p>
                          <p className="text-sm text-gray-500">{company.contact_person} • {company.contact_email}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={company.status === 'active' ? 'default' : 'secondary'}>
                            {company.status}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No client companies yet</h3>
                      <p className="text-gray-500 mb-4">Start building your client base by adding companies you work with.</p>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Client Company
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={tempAchievement}
                      onChange={(e) => setTempAchievement(e.target.value)}
                      placeholder="Add an achievement"
                      disabled={!editing}
                      onKeyPress={(e) => e.key === 'Enter' && addItem('achievements', tempAchievement, setTempAchievement)}
                    />
                    <Button 
                      onClick={() => addItem('achievements', tempAchievement, setTempAchievement)}
                      disabled={!editing}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {formData.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>{achievement}</span>
                        {editing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem('achievements', index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={tempCertification}
                      onChange={(e) => setTempCertification(e.target.value)}
                      placeholder="Add a certification"
                      disabled={!editing}
                      onKeyPress={(e) => e.key === 'Enter' && addItem('certifications', tempCertification, setTempCertification)}
                    />
                    <Button 
                      onClick={() => addItem('certifications', tempCertification, setTempCertification)}
                      disabled={!editing}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {formData.certifications.map((certification, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>{certification}</span>
                        {editing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem('certifications', index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Placements</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">
                    +3 from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Successful Hires</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18</div>
                  <p className="text-xs text-muted-foreground">
                    +2 from last month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Client Companies</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{clientCompanies.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Active relationships
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">75%</div>
                  <p className="text-xs text-muted-foreground">
                    +5% from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest recruiting activity and placements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Successfully placed: Senior Developer at TechCorp</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New client onboarded: StartupXYZ</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New job posting: Product Manager</p>
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

export default RecruiterProfile;
