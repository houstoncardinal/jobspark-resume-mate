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
  GraduationCap, 
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
  BookOpenCheck,
  Lightbulb,
  Heart,
  Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/supabaseClient';

interface StudentProfile {
  id: string;
  user_id: string;
  university: string;
  degree_program: string;
  graduation_year: number;
  gpa: number;
  major: string;
  minor: string;
  expected_graduation: string;
  career_goals: string;
  interests: string[];
  skills: string[];
  projects: string[];
  internships: string[];
  volunteer_work: string[];
  extracurriculars: string[];
  portfolio_url: string;
  linkedin_url: string;
  github_url: string;
  resume_url: string;
  bio: string;
  created_at: string;
  updated_at: string;
}

const StudentProfile: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Form state
  const [formData, setFormData] = useState({
    university: '',
    degree_program: '',
    graduation_year: new Date().getFullYear(),
    gpa: 0,
    major: '',
    minor: '',
    expected_graduation: '',
    career_goals: '',
    interests: [] as string[],
    skills: [] as string[],
    projects: [] as string[],
    internships: [] as string[],
    volunteer_work: [] as string[],
    extracurriculars: [] as string[],
    portfolio_url: '',
    linkedin_url: '',
    github_url: '',
    resume_url: '',
    bio: '',
  });

  const [tempInterest, setTempInterest] = useState('');
  const [tempSkill, setTempSkill] = useState('');
  const [tempProject, setTempProject] = useState('');
  const [tempInternship, setTempInternship] = useState('');
  const [tempVolunteer, setTempVolunteer] = useState('');
  const [tempExtracurricular, setTempExtracurricular] = useState('');

  const commonInterests = [
    'Software Development', 'Data Science', 'Machine Learning', 'Web Design',
    'Mobile Development', 'Cybersecurity', 'Cloud Computing', 'DevOps',
    'Product Management', 'Marketing', 'Finance', 'Healthcare', 'Education',
    'Sustainability', 'Social Impact', 'Entrepreneurship', 'Research'
  ];

  const commonSkills = [
    'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'SQL',
    'AWS', 'Docker', 'Git', 'Figma', 'Adobe Creative Suite', 'Excel',
    'PowerPoint', 'Public Speaking', 'Project Management', 'Leadership',
    'Communication', 'Problem Solving', 'Critical Thinking'
  ];

  const degreePrograms = [
    'Bachelor of Science', 'Bachelor of Arts', 'Bachelor of Engineering',
    'Master of Science', 'Master of Arts', 'Master of Business Administration',
    'PhD', 'Associate Degree', 'Certificate Program', 'Bootcamp'
  ];

  const majors = [
    'Computer Science', 'Software Engineering', 'Information Technology',
    'Data Science', 'Business Administration', 'Marketing', 'Finance',
    'Psychology', 'Biology', 'Chemistry', 'Physics', 'Mathematics',
    'Engineering', 'Design', 'Communications', 'Political Science'
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
        .from('student_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setFormData({
          university: data.university || '',
          degree_program: data.degree_program || '',
          graduation_year: data.graduation_year || new Date().getFullYear(),
          gpa: data.gpa || 0,
          major: data.major || '',
          minor: data.minor || '',
          expected_graduation: data.expected_graduation || '',
          career_goals: data.career_goals || '',
          interests: data.interests || [],
          skills: data.skills || [],
          projects: data.projects || [],
          internships: data.internships || [],
          volunteer_work: data.volunteer_work || [],
          extracurriculars: data.extracurriculars || [],
          portfolio_url: data.portfolio_url || '',
          linkedin_url: data.linkedin_url || '',
          github_url: data.github_url || '',
          resume_url: data.resume_url || '',
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

  const saveProfile = async () => {
    try {
      const { error } = await supabase
        .from('student_profiles')
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

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.7) return 'bg-green-100 text-green-800';
    if (gpa >= 3.3) return 'bg-blue-100 text-blue-800';
    if (gpa >= 3.0) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
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
                <p className="text-gray-600">{formData.university || 'Student'}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge className={getGPAColor(formData.gpa)}>
                    GPA: {formData.gpa.toFixed(2)}
                  </Badge>
                  <Badge variant="outline">{formData.major}</Badge>
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
            <TabsTrigger value="academics">Academics</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="university">University</Label>
                    <Input
                      id="university"
                      value={formData.university}
                      onChange={(e) => setFormData(prev => ({ ...prev, university: e.target.value }))}
                      disabled={!editing}
                      placeholder="e.g., Stanford University"
                    />
                  </div>
                  <div>
                    <Label htmlFor="degree_program">Degree Program</Label>
                    <select
                      id="degree_program"
                      value={formData.degree_program}
                      onChange={(e) => setFormData(prev => ({ ...prev, degree_program: e.target.value }))}
                      disabled={!editing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Degree Program</option>
                      {degreePrograms.map(program => (
                        <option key={program} value={program}>{program}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="major">Major</Label>
                    <select
                      id="major"
                      value={formData.major}
                      onChange={(e) => setFormData(prev => ({ ...prev, major: e.target.value }))}
                      disabled={!editing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Major</option>
                      {majors.map(major => (
                        <option key={major} value={major}>{major}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="minor">Minor</Label>
                    <Input
                      id="minor"
                      value={formData.minor}
                      onChange={(e) => setFormData(prev => ({ ...prev, minor: e.target.value }))}
                      disabled={!editing}
                      placeholder="e.g., Mathematics"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gpa">GPA</Label>
                    <Input
                      id="gpa"
                      type="number"
                      step="0.01"
                      min="0"
                      max="4"
                      value={formData.gpa}
                      onChange={(e) => setFormData(prev => ({ ...prev, gpa: parseFloat(e.target.value) || 0 }))}
                      disabled={!editing}
                      placeholder="3.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="graduation_year">Graduation Year</Label>
                    <Input
                      id="graduation_year"
                      type="number"
                      value={formData.graduation_year}
                      onChange={(e) => setFormData(prev => ({ ...prev, graduation_year: parseInt(e.target.value) || new Date().getFullYear() }))}
                      disabled={!editing}
                      placeholder="2024"
                    />
                  </div>
                  <div>
                    <Label htmlFor="expected_graduation">Expected Graduation</Label>
                    <Input
                      id="expected_graduation"
                      type="date"
                      value={formData.expected_graduation}
                      onChange={(e) => setFormData(prev => ({ ...prev, expected_graduation: e.target.value }))}
                      disabled={!editing}
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
                    placeholder="Tell us about yourself, your interests, and career aspirations..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Academics Tab */}
          <TabsContent value="academics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Skills & Interests
                </CardTitle>
                <CardDescription>
                  Showcase your academic and technical skills
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Skills</Label>
                  <div className="space-y-4 mt-2">
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
                </div>

                <div>
                  <Label>Interests</Label>
                  <div className="space-y-4 mt-2">
                    <div className="flex gap-2">
                      <Input
                        value={tempInterest}
                        onChange={(e) => setTempInterest(e.target.value)}
                        placeholder="Add an interest"
                        disabled={!editing}
                        onKeyPress={(e) => e.key === 'Enter' && addItem('interests', tempInterest, setTempInterest)}
                      />
                      <Button 
                        onClick={() => addItem('interests', tempInterest, setTempInterest)}
                        disabled={!editing}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {formData.interests.map((interest, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {interest}
                          {editing && (
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => removeItem('interests', index)}
                            />
                          )}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {commonInterests.filter(interest => !formData.interests.includes(interest)).map(interest => (
                        <Button
                          key={interest}
                          variant="outline"
                          size="sm"
                          onClick={() => addItem('interests', interest, setTempInterest)}
                          disabled={!editing}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          {interest}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Internships
                </CardTitle>
                <CardDescription>
                  Add your internship experiences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={tempInternship}
                      onChange={(e) => setTempInternship(e.target.value)}
                      placeholder="Add an internship experience"
                      disabled={!editing}
                      onKeyPress={(e) => e.key === 'Enter' && addItem('internships', tempInternship, setTempInternship)}
                    />
                    <Button 
                      onClick={() => addItem('internships', tempInternship, setTempInternship)}
                      disabled={!editing}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {formData.internships.map((internship, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>{internship}</span>
                        {editing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem('internships', index)}
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
                  <Heart className="h-5 w-5 mr-2" />
                  Volunteer Work
                </CardTitle>
                <CardDescription>
                  Add your volunteer experiences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={tempVolunteer}
                      onChange={(e) => setTempVolunteer(e.target.value)}
                      placeholder="Add volunteer experience"
                      disabled={!editing}
                      onKeyPress={(e) => e.key === 'Enter' && addItem('volunteer_work', tempVolunteer, setTempVolunteer)}
                    />
                    <Button 
                      onClick={() => addItem('volunteer_work', tempVolunteer, setTempVolunteer)}
                      disabled={!editing}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {formData.volunteer_work.map((volunteer, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>{volunteer}</span>
                        {editing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem('volunteer_work', index)}
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
                  <Trophy className="h-5 w-5 mr-2" />
                  Extracurricular Activities
                </CardTitle>
                <CardDescription>
                  Add your extracurricular activities and leadership roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={tempExtracurricular}
                      onChange={(e) => setTempExtracurricular(e.target.value)}
                      placeholder="Add an extracurricular activity"
                      disabled={!editing}
                      onKeyPress={(e) => e.key === 'Enter' && addItem('extracurriculars', tempExtracurricular, setTempExtracurricular)}
                    />
                    <Button 
                      onClick={() => addItem('extracurriculars', tempExtracurricular, setTempExtracurricular)}
                      disabled={!editing}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {formData.extracurriculars.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>{activity}</span>
                        {editing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem('extracurriculars', index)}
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

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="h-5 w-5 mr-2" />
                  Projects
                </CardTitle>
                <CardDescription>
                  Showcase your academic and personal projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={tempProject}
                      onChange={(e) => setTempProject(e.target.value)}
                      placeholder="Add a project"
                      disabled={!editing}
                      onKeyPress={(e) => e.key === 'Enter' && addItem('projects', tempProject, setTempProject)}
                    />
                    <Button 
                      onClick={() => addItem('projects', tempProject, setTempProject)}
                      disabled={!editing}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {formData.projects.map((project, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>{project}</span>
                        {editing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem('projects', index)}
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
                  <FileText className="h-5 w-5 mr-2" />
                  Portfolio & Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Career Goals
                </CardTitle>
                <CardDescription>
                  Define your career aspirations and goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="career_goals">Career Goals</Label>
                  <Textarea
                    id="career_goals"
                    value={formData.career_goals}
                    onChange={(e) => setFormData(prev => ({ ...prev, career_goals: e.target.value }))}
                    disabled={!editing}
                    placeholder="Describe your career goals and aspirations..."
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2" />
                  Next Steps
                </CardTitle>
                <CardDescription>
                  Recommended actions to achieve your goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Complete your profile</p>
                      <p className="text-xs text-gray-500">Add more details to make your profile stand out</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Upload your resume</p>
                      <p className="text-xs text-gray-500">Make it easy for employers to find you</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Apply for internships</p>
                      <p className="text-xs text-gray-500">Gain real-world experience in your field</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Build your network</p>
                      <p className="text-xs text-gray-500">Connect with professionals in your industry</p>
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

export default StudentProfile;
