import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Briefcase, 
  FileText, 
  TrendingUp, 
  Star, 
  Calendar, 
  MapPin, 
  Clock,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Eye,
  Target,
  Award,
  Users,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Resume {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  is_primary: boolean;
  ats_score?: number;
  views?: number;
}

interface JobApplication {
  id: string;
  job_title: string;
  company: string;
  applied_at: string;
  status: 'applied' | 'reviewed' | 'interview' | 'rejected' | 'offered';
  location: string;
  salary?: string;
}

interface JobMatch {
  id: string;
  job_title: string;
  company: string;
  match_score: number;
  location: string;
  salary: string;
  posted_at: string;
}

export const JobSeekerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
  const [stats, setStats] = useState({
    totalApplications: 0,
    interviews: 0,
    offers: 0,
    profileViews: 0
  });

  useEffect(() => {
    // Mock data - replace with actual API calls
    setResumes([
      {
        id: '1',
        title: 'Software Engineer Resume',
        created_at: '2024-01-15',
        updated_at: '2024-01-20',
        is_primary: true,
        ats_score: 92,
        views: 45
      },
      {
        id: '2',
        title: 'Product Manager Resume',
        created_at: '2024-01-10',
        updated_at: '2024-01-18',
        is_primary: false,
        ats_score: 88,
        views: 23
      }
    ]);

    setApplications([
      {
        id: '1',
        job_title: 'Senior Software Engineer',
        company: 'Tech Corp',
        applied_at: '2024-01-20',
        status: 'interview',
        location: 'San Francisco, CA',
        salary: '$120,000 - $150,000'
      },
      {
        id: '2',
        job_title: 'Full Stack Developer',
        company: 'StartupXYZ',
        applied_at: '2024-01-18',
        status: 'reviewed',
        location: 'Remote',
        salary: '$90,000 - $120,000'
      }
    ]);

    setJobMatches([
      {
        id: '1',
        job_title: 'React Developer',
        company: 'Innovation Labs',
        match_score: 95,
        location: 'New York, NY',
        salary: '$110,000 - $140,000',
        posted_at: '2024-01-21'
      },
      {
        id: '2',
        job_title: 'Frontend Engineer',
        company: 'Design Co',
        match_score: 88,
        location: 'Austin, TX',
        salary: '$100,000 - $130,000',
        posted_at: '2024-01-20'
      }
    ]);

    setStats({
      totalApplications: 12,
      interviews: 3,
      offers: 1,
      profileViews: 67
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'reviewed': return 'bg-yellow-100 text-yellow-800';
      case 'interview': return 'bg-purple-100 text-purple-800';
      case 'offered': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.full_name}!</h1>
              <p className="text-gray-600">Manage your job search and career growth</p>
            </div>
            <div className="flex items-center gap-4">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Upload Resume
              </Button>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
                </div>
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Interviews</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.interviews}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Job Offers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.offers}</p>
                </div>
                <Award className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Profile Views</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.profileViews}</p>
                </div>
                <Eye className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="resumes">Resumes</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="matches">Job Matches</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Applications */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                  <CardDescription>Your latest job applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {applications.slice(0, 3).map((app) => (
                      <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{app.job_title}</h4>
                          <p className="text-sm text-gray-600">{app.company}</p>
                          <p className="text-xs text-gray-500">{app.location}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(app.status)}>
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">{app.applied_at}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Job Matches */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Job Matches</CardTitle>
                  <CardDescription>Jobs that match your profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {jobMatches.slice(0, 3).map((job) => (
                      <div key={job.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{job.job_title}</h4>
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-600">{job.match_score}%</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{job.company}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{job.location}</span>
                          <span>{job.salary}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="resumes" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Resumes</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create New Resume
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume) => (
                <Card key={resume.id} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{resume.title}</CardTitle>
                      {resume.is_primary && (
                        <Badge variant="secondary">Primary</Badge>
                      )}
                    </div>
                    <CardDescription>
                      Updated {new Date(resume.updated_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {resume.ats_score && (
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>ATS Score</span>
                            <span className="font-medium">{resume.ats_score}%</span>
                          </div>
                          <Progress value={resume.ats_score} className="h-2" />
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Views: {resume.views}</span>
                        <span>Created: {new Date(resume.created_at).toLocaleDateString()}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Job Applications</h2>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export to CSV
              </Button>
            </div>

            <div className="space-y-4">
              {applications.map((app) => (
                <Card key={app.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{app.job_title}</h3>
                        <p className="text-gray-600">{app.company}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {app.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Applied {new Date(app.applied_at).toLocaleDateString()}
                          </div>
                          {app.salary && (
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4" />
                              {app.salary}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`${getStatusColor(app.status)} text-sm px-3 py-1`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </Badge>
                        <div className="mt-2">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="matches" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Job Matches</h2>
              <Button variant="outline">
                <Target className="h-4 w-4 mr-2" />
                Refresh Matches
              </Button>
            </div>

            <div className="space-y-4">
              {jobMatches.map((job) => (
                <Card key={job.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{job.job_title}</h3>
                          <div className="flex items-center gap-1">
                            <Target className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-600">{job.match_score}% Match</span>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-2">{job.company}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            {job.salary}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Posted {new Date(job.posted_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Button className="mb-2">
                          Apply Now
                        </Button>
                        <div>
                          <Button size="sm" variant="outline">
                            Save Job
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
