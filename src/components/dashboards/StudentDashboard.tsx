import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  Briefcase, 
  Target, 
  TrendingUp, 
  BookOpen, 
  Users, 
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Star,
  ExternalLink,
  Plus,
  Eye,
  FileText,
  Lightbulb,
  Award,
  Building2,
  Code,
  Heart
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'paid' | 'unpaid' | 'stipend';
  duration: string;
  deadline: string;
  description: string;
  requirements: string[];
  applied: boolean;
}

interface CareerGoal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progress: number;
  completed: boolean;
}

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [internships, setInternships] = useState<Internship[]>([]);
  const [careerGoals, setCareerGoals] = useState<CareerGoal[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    setInternships([
      {
        id: '1',
        title: 'Software Engineering Intern',
        company: 'TechCorp',
        location: 'San Francisco, CA',
        type: 'paid',
        duration: '3 months',
        deadline: '2024-02-15',
        description: 'Work on cutting-edge web applications using React and Node.js',
        requirements: ['JavaScript', 'React', 'Node.js', 'Git'],
        applied: false
      },
      {
        id: '2',
        title: 'Data Science Intern',
        company: 'DataFlow Inc',
        location: 'Remote',
        type: 'stipend',
        duration: '6 months',
        deadline: '2024-03-01',
        description: 'Analyze large datasets and build machine learning models',
        requirements: ['Python', 'SQL', 'Machine Learning', 'Statistics'],
        applied: true
      },
      {
        id: '3',
        title: 'Marketing Intern',
        company: 'GrowthCo',
        location: 'New York, NY',
        type: 'unpaid',
        duration: '4 months',
        deadline: '2024-02-28',
        description: 'Support digital marketing campaigns and social media management',
        requirements: ['Social Media', 'Content Creation', 'Analytics', 'Communication'],
        applied: false
      }
    ]);

    setCareerGoals([
      {
        id: '1',
        title: 'Complete Software Engineering Internship',
        description: 'Gain hands-on experience in full-stack development',
        targetDate: '2024-06-01',
        progress: 25,
        completed: false
      },
      {
        id: '2',
        title: 'Build Portfolio Website',
        description: 'Create a professional portfolio showcasing my projects',
        targetDate: '2024-03-15',
        progress: 60,
        completed: false
      },
      {
        id: '3',
        title: 'Learn Machine Learning',
        description: 'Complete online course and build ML project',
        targetDate: '2024-05-01',
        progress: 40,
        completed: false
      }
    ]);

    setLoading(false);
  }, []);

  const handleApplyToInternship = (internshipId: string) => {
    setInternships(prev => 
      prev.map(internship => 
        internship.id === internshipId 
          ? { ...internship, applied: true }
          : internship
      )
    );
    toast({
      title: "Application Submitted",
      description: "Your application has been submitted successfully!",
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'stipend': return 'bg-blue-100 text-blue-800';
      case 'unpaid': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-gray-500';
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.full_name}! Track your academic and career progress.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications Sent</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{internships.filter(i => i.applied).length}</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Career Goals</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{careerGoals.length}</div>
              <p className="text-xs text-muted-foreground">
                {careerGoals.filter(g => g.completed).length} completed
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Skills Learned</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                +3 this month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Network Connections</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">
                +5 this week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Internships */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Recommended Internships
                </CardTitle>
                <CardDescription>
                  Internship opportunities tailored to your interests and skills
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {internships.map((internship) => (
                  <div key={internship.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{internship.title}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Building2 className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">{internship.company}</span>
                          <span>•</span>
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">{internship.location}</span>
                        </div>
                        <p className="text-gray-600 mt-2">{internship.description}</p>
                        <div className="flex items-center space-x-4 mt-3">
                          <Badge className={getTypeColor(internship.type)}>
                            {internship.type.charAt(0).toUpperCase() + internship.type.slice(1)}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            <Clock className="h-4 w-4 inline mr-1" />
                            {internship.duration}
                          </span>
                          <span className="text-sm text-gray-500">
                            Deadline: {new Date(internship.deadline).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {internship.requirements.slice(0, 3).map((req, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                          {internship.requirements.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{internship.requirements.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        {internship.applied ? (
                          <Badge className="bg-green-100 text-green-800">
                            Applied
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleApplyToInternship(internship.id)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Apply Now
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Career Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Career Goals
                </CardTitle>
                <CardDescription>
                  Track your progress towards achieving your career objectives
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {careerGoals.map((goal) => (
                  <div key={goal.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Target: {new Date(goal.targetDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={goal.completed ? "default" : "outline"}>
                        {goal.completed ? "Completed" : "In Progress"}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getProgressColor(goal.progress)}`}
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Goal
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Actions & Resources */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Update Resume
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Code className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Network
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Learn New Skill
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {internships
                  .filter(i => !i.applied)
                  .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                  .slice(0, 3)
                  .map((internship) => (
                    <div key={internship.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="text-sm font-medium">{internship.title}</p>
                        <p className="text-xs text-gray-500">{internship.company}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(internship.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* Learning Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Learning Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <div className="flex items-center">
                      <Code className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-sm">JavaScript Course</span>
                    </div>
                    <Badge variant="outline" className="text-xs">In Progress</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <div className="flex items-center">
                      <Award className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm">React Certification</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800 text-xs">Completed</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 text-purple-600 mr-2" />
                      <span className="text-sm">Soft Skills Workshop</span>
                    </div>
                    <Badge variant="outline" className="text-xs">Available</Badge>
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

export default StudentDashboard;
