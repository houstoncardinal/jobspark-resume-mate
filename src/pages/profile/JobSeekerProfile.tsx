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
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Briefcase, 
  GraduationCap, 
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
  Building2,
  Code,
  BookOpen,
  Languages,
  Trophy,
  FileText,
  Linkedin,
  Github,
  Instagram,
  Twitter
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/supabaseClient';

interface JobSeekerProfile {
  id: string;
  user_id: string;
  current_title: string;
  desired_title: string;
  experience_level: 'entry' | 'mid' | 'senior' | 'executive';
  salary_expectation_min: number;
  salary_expectation_max: number;
  currency: string;
  availability: 'immediate' | '2weeks' | '1month' | 'flexible';
  work_preference: 'remote' | 'hybrid' | 'onsite';
  willing_to_relocate: boolean;
  preferred_locations: string[];
  skills: string[];
  industries: string[];
  job_types: string[];
  resume_url: string;
  portfolio_url: string;
  linkedin_url: string;
  github_url: string;
  website_url: string;
  bio: string;
  achievements: string[];
  certifications: string[];
  languages: string[];
  created_at: string;
  updated_at: string;
}

const JobSeekerProfile: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<JobSeekerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Form state
  const [formData, setFormData] = useState({
    current_title: '',
    desired_title: '',
    experience_level: 'entry' as const,
    salary_expectation_min: 0,
    salary_expectation_max: 0,
    currency: 'USD',
    availability: 'immediate' as const,
    work_preference: 'remote' as const,
    willing_to_relocate: false,
    preferred_locations: [] as string[],
    skills: [] as string[],
    industries: [] as string[],
    job_types: [] as string[],
    resume_url: '',
    portfolio_url: '',
    linkedin_url: '',
    github_url: '',
    website_url: '',
    bio: '',
    achievements: [] as string[],
    certifications: [] as string[],
    languages: [] as string[],
  });

  const [tempSkill, setTempSkill] = useState('');
  const [tempLocation, setTempLocation] = useState('');
  const [tempAchievement, setTempAchievement] = useState('');
  const [tempCertification, setTempCertification] = useState('');
  const [tempLanguage, setTempLanguage] = useState('');

  const commonSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'Java', 'C++', 'SQL',
    'AWS', 'Docker', 'Kubernetes', 'Git', 'Agile', 'Scrum', 'Project Management',
    'Data Analysis', 'Machine Learning', 'UI/UX Design', 'Marketing', 'Sales'
  ];

  const commonIndustries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing',
    'Consulting', 'Non-profit', 'Government', 'Media', 'Entertainment', 'Real Estate'
  ];

  const commonJobTypes = [
    'Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance', 'Temporary'
  ];

  const commonLanguages = [
    'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean',
    'Portuguese', 'Italian', 'Russian', 'Arabic', 'Hindi'
  ];

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('job_seeker_profiles')
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
          desired_title: data.desired_title || '',
          experience_level: data.experience_level || 'entry',
          salary_expectation_min: data.salary_expectation_min || 0,
          salary_expectation_max: data.salary_expectation_max || 0,
          currency: data.currency || 'USD',
          availability: data.availability || 'immediate',
          work_preference: data.work_preference || 'remote',
          willing_to_relocate: data.willing_to_relocate || false,
          preferred_locations: data.preferred_locations || [],
          skills: data.skills || [],
          industries: data.industries || [],
          job_types: data.job_types || [],
          resume_url: data.resume_url || '',
          portfolio_url: data.portfolio_url || '',
          linkedin_url: data.linkedin_url || '',
          github_url: data.github_url || '',
          website_url: data.website_url || '',
          bio: data.bio || '',
          achievements: data.achievements || [],
          certifications: data.certifications || [],
          languages: data.languages || [],
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

  const saveProfile = async () => {
    try {
      const { error } = await supabase
        .from('job_seeker_profiles')
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

  const getExperienceLevelColor = (level: string) => {
    switch (level) {
      case 'entry': return 'bg-green-100 text-green-800';
      case 'mid': return 'bg-blue-100 text-blue-800';
      case 'senior': return 'bg-purple-100 text-purple-800';
      case 'executive': return 'bg-gold-100 text-gold-800';
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
                <p className="text-gray-600">{formData.current_title || 'Job Seeker'}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge className={getExperienceLevelColor(formData.experience_level)}>
                    {formData.experience_level.charAt(0).toUpperCase() + formData.experience_level.slice(1)}
                  </Badge>
                  <Badge variant="outline">{formData.work_preference}</Badge>
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
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Basic Information
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
                      placeholder="e.g., Software Engineer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="desired_title">Desired Title</Label>
                    <Input
                      id="desired_title"
                      value={formData.desired_title}
                      onChange={(e) => setFormData(prev => ({ ...prev, desired_title: e.target.value }))}
                      disabled={!editing}
                      placeholder="e.g., Senior Software Engineer"
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
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="experience_level">Experience Level</Label>
                    <select
                      id="experience_level"
                      value={formData.experience_level}
                      onChange={(e) => setFormData(prev => ({ ...prev, experience_level: e.target.value as any }))}
                      disabled={!editing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="entry">Entry Level</option>
                      <option value="mid">Mid Level</option>
                      <option value="senior">Senior Level</option>
                      <option value="executive">Executive</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="availability">Availability</Label>
                    <select
                      id="availability"
                      value={formData.availability}
                      onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value as any }))}
                      disabled={!editing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="immediate">Immediate</option>
                      <option value="2weeks">2 Weeks</option>
                      <option value="1month">1 Month</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="work_preference">Work Preference</Label>
                    <select
                      id="work_preference"
                      value={formData.work_preference}
                      onChange={(e) => setFormData(prev => ({ ...prev, work_preference: e.target.value as any }))}
                      disabled={!editing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="onsite">On-site</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Salary Expectations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Salary Expectations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="salary_min">Minimum Salary</Label>
                    <Input
                      id="salary_min"
                      type="number"
                      value={formData.salary_expectation_min}
                      onChange={(e) => setFormData(prev => ({ ...prev, salary_expectation_min: parseInt(e.target.value) || 0 }))}
                      disabled={!editing}
                      placeholder="50000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="salary_max">Maximum Salary</Label>
                    <Input
                      id="salary_max"
                      type="number"
                      value={formData.salary_expectation_max}
                      onChange={(e) => setFormData(prev => ({ ...prev, salary_expectation_max: parseInt(e.target.value) || 0 }))}
                      disabled={!editing}
                      placeholder="80000"
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
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="h-5 w-5 mr-2" />
                  Skills
                </CardTitle>
                <CardDescription>
                  Add your technical and soft skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={tempSkill}
                      onChange={(e) => setTempSkill(e.target.value)}
                      placeholder="Add a skill"
                      disabled={!editing}
                      onKeyPress={(e) => e.key === 'Enter' && addItem('skills', tempSkill, setTempSkill)}
                    />
                    <Button 
                      onClick={() => addItem('skills', tempSkill, setTempSkill)}
                      disabled={!editing}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        {editing && (
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeItem('skills', index)}
                          />
                        )}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {commonSkills.filter(skill => !formData.skills.includes(skill)).map(skill => (
                      <Button
                        key={skill}
                        variant="outline"
                        size="sm"
                        onClick={() => addItem('skills', skill, setTempSkill)}
                        disabled={!editing}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {skill}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Industries */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Industries
                </CardTitle>
                <CardDescription>
                  Select industries you're interested in
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={tempLocation}
                      onChange={(e) => setTempLocation(e.target.value)}
                      placeholder="Add an industry"
                      disabled={!editing}
                      onKeyPress={(e) => e.key === 'Enter' && addItem('industries', tempLocation, setTempLocation)}
                    />
                    <Button 
                      onClick={() => addItem('industries', tempLocation, setTempLocation)}
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
                        onClick={() => addItem('industries', industry, setTempLocation)}
                        disabled={!editing}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {industry}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Portfolio & Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="resume_url">Resume URL</Label>
                    <Input
                      id="resume_url"
                      value={formData.resume_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, resume_url: e.target.value }))}
                      disabled={!editing}
                      placeholder="https://example.com/resume.pdf"
                    />
                  </div>
                  <div>
                    <Label htmlFor="portfolio_url">Portfolio URL</Label>
                    <Input
                      id="portfolio_url"
                      value={formData.portfolio_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, portfolio_url: e.target.value }))}
                      disabled={!editing}
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin_url">LinkedIn</Label>
                    <Input
                      id="linkedin_url"
                      value={formData.linkedin_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                      disabled={!editing}
                      placeholder="https://linkedin.com/in/yourname"
                    />
                  </div>
                  <div>
                    <Label htmlFor="github_url">GitHub</Label>
                    <Input
                      id="github_url"
                      value={formData.github_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                      disabled={!editing}
                      placeholder="https://github.com/yourname"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
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
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Job Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="job_types">Job Types</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {commonJobTypes.map(jobType => (
                        <Button
                          key={jobType}
                          variant={formData.job_types.includes(jobType) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            if (editing) {
                              setFormData(prev => ({
                                ...prev,
                                job_types: prev.job_types.includes(jobType)
                                  ? prev.job_types.filter(t => t !== jobType)
                                  : [...prev.job_types, jobType]
                              }));
                            }
                          }}
                          disabled={!editing}
                        >
                          {jobType}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="willing_to_relocate"
                      checked={formData.willing_to_relocate}
                      onChange={(e) => setFormData(prev => ({ ...prev, willing_to_relocate: e.target.checked }))}
                      disabled={!editing}
                      className="rounded"
                    />
                    <Label htmlFor="willing_to_relocate">Willing to relocate</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="preferred_locations">Preferred Locations</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex gap-2">
                      <Input
                        value={tempLocation}
                        onChange={(e) => setTempLocation(e.target.value)}
                        placeholder="Add a location"
                        disabled={!editing}
                        onKeyPress={(e) => e.key === 'Enter' && addItem('preferred_locations', tempLocation, setTempLocation)}
                      />
                      <Button 
                        onClick={() => addItem('preferred_locations', tempLocation, setTempLocation)}
                        disabled={!editing}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {formData.preferred_locations.map((location, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {location}
                          {editing && (
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => removeItem('preferred_locations', index)}
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
        </Tabs>
      </div>
    </div>
  );
};

export default JobSeekerProfile;
