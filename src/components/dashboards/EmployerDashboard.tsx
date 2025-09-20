import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Briefcase, 
  Users, 
  TrendingUp, 
  DollarSign,
  Plus,
  Edit,
  Eye,
  BarChart3,
  Calendar,
  MapPin,
  Clock,
  Target,
  Star,
  Award,
  Download,
  Settings,
  Mail,
  Phone,
  Globe,
  FileText,
  UserCheck,
  UserX
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface CompanyProfile {
  id: string;
  name: string;
  industry: string;
  size: string;
  location: string;
  website: string;
  description: string;
  logo_url?: string;
  founded_year?: number;
  employee_count?: number;
}

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  status: 'draft' | 'active' | 'paused' | 'closed';
  applications_count: number;
  views_count: number;
  created_at: string;
  salary_min?: number;
  salary_max?: number;
  requirements: string[];
  benefits: string[];
}

interface Application {
  id: string;
  job_title: string;
  candidate_name: string;
  candidate_email: string;
  applied_at: string;
  status: 'new' | 'reviewed' | 'shortlisted' | 'interviewed' | 'hired' | 'rejected';
  experience_years: number;
  skills: string[];
  match_score: number;
  resume_url?: string;
}

interface Analytics {
  total_jobs: number;
  active_jobs: number;
  total_applications: number;
  applications_this_month: number;
  hire_rate: number;
  average_time_to_hire: number;
  top_skills: { skill: string; count: number }[];
  applications_by_status: { status: string; count: number }[];
}

export const EmployerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  useEffect(() => {
    // Mock data - replace with actual API calls
    setCompanyProfile({
      id: '1',
      name: 'Tech Innovations Inc.',
      industry: 'Technology',
      size: '51-200 employees',
      location: 'San Francisco, CA',
      website: 'https://techinnovations.com',
      description: 'Leading technology company focused on AI and machine learning solutions.',
      founded_year: 2018,
      employee_count: 150
    });

    setJobPostings([
      {
        id: '1',
        title: 'Senior Software Engineer',
        department: 'Engineering',
        location: 'San Francisco, CA',
        type: 'full-time',
        status: 'active',
        applications_count: 45,
        views_count: 234,
        created_at: '2024-01-15',
        salary_min: 120000,
        salary_max: 150000,
        requirements: ['5+ years experience', 'React, Node.js', 'AWS', 'TypeScript'],
        benefits: ['Health insurance', '401k', 'Remote work', 'Stock options']
      },
      {
        id: '2',
        title: 'Product Manager',
        department: 'Product',
        location: 'Remote',
        type: 'full-time',
        status: 'active',
        applications_count: 32,
        views_count: 189,
        created_at: '2024-01-10',
        salary_min: 100000,
        salary_max: 130000,
        requirements: ['3+ years PM experience', 'Agile methodology', 'Data analysis'],
        benefits: ['Health insurance', '401k', 'Flexible hours', 'Learning budget']
      }
    ]);

    setApplications([
      {
        id: '1',
        job_title: 'Senior Software Engineer',
        candidate_name: 'Sarah Johnson',
        candidate_email: 'sarah.johnson@email.com',
        applied_at: '2024-01-20',
        status: 'shortlisted',
        experience_years: 5,
        skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
        match_score: 92,
        resume_url: '/resumes/sarah-johnson.pdf'
      },
      {
        id: '2',
        job_title: 'Product Manager',
        candidate_name: 'Michael Chen',
        candidate_email: 'michael.chen@email.com',
        applied_at: '2024-01-18',
        status: 'interviewed',
        experience_years: 4,
        skills: ['Product Management', 'Agile', 'Data Analysis', 'Figma'],
        match_score: 88,
        resume_url: '/resumes/michael-chen.pdf'
      }
    ]);

    setAnalytics({
      total_jobs: 12,
      active_jobs: 8,
      total_applications: 156,
      applications_this_month: 23,
      hire_rate: 12.5,
      average_time_to_hire: 18,
      top_skills: [
        { skill: 'React', count: 45 },
        { skill: 'JavaScript', count: 38 },
        { skill: 'Python', count: 32 },
        { skill: 'AWS', count: 28 }
      ],
      applications_by_status: [
        { status: 'new', count: 45 },
        { status: 'reviewed', count: 32 },
        { status: 'shortlisted', count: 18 },
        { status: 'interviewed', count: 12 },
        { status: 'hired', count: 8 },
        { status: 'rejected', count: 41 }
      ]
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'reviewed': return 'bg-yellow-100 text-yellow-800';
      case 'shortlisted': return 'bg-purple-100 text-purple-800';
      case 'interviewed': return 'bg-orange-100 text-orange-800';
      case 'hired': return 'bg-green-100 text-green-800';
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
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{companyProfile?.name}</h1>
                <p className="text-gray-600">Employer Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Post New Job
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Company Settings
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
                  <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics?.active_jobs}</p>
                </div>
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics?.total_applications}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Hire Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics?.hire_rate}%</p>
                </div>
                <Award className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Time to Hire</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics?.average_time_to_hire} days</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="jobs">Job Postings</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Applications */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                  <CardDescription>Latest job applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {applications.slice(0, 3).map((app) => (
                      <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{app.candidate_name}</h4>
                          <p className="text-sm text-gray-600">{app.job_title}</p>
                          <p className="text-xs text-gray-500">{app.experience_years} years experience</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(app.status)}>
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </Badge>
                          <div className="flex items-center gap-1 mt-1">
                            <Target className="h-3 w-3 text-green-600" />
                            <span className="text-xs text-green-600">{app.match_score}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Skills */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Skills in Applications</CardTitle>
                  <CardDescription>Most common skills among candidates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics?.top_skills.slice(0, 5).map((skill, index) => (
                      <div key={skill.skill} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">{skill.skill}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(skill.count / analytics.top_skills[0].count) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-8">{skill.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Job Postings</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create New Job
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobPostings.map((job) => (
                <Card key={job.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <Badge className={getStatusColor(job.status)}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </Badge>
                    </div>
                    <CardDescription>{job.department}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Briefcase className="h-4 w-4" />
                        {job.type.charAt(0).toUpperCase() + job.type.slice(1)}
                      </div>
                      {job.salary_min && job.salary_max && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <DollarSign className="h-4 w-4" />
                          ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Applications:</span>
                          <span className="ml-1 font-medium">{job.applications_count}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Views:</span>
                          <span className="ml-1 font-medium">{job.views_count}</span>
                        </div>
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
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Applications</h2>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {applications.map((app) => (
                <Card key={app.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{app.candidate_name}</h3>
                        <p className="text-gray-600">{app.job_title}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {app.candidate_email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Applied {new Date(app.applied_at).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            {app.match_score}% match
                          </div>
                        </div>
                        <div className="flex gap-1 mt-2">
                          {app.skills.slice(0, 4).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {app.skills.length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                              +{app.skills.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`${getStatusColor(app.status)} text-sm px-3 py-1 mb-2`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </Badge>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View Resume
                          </Button>
                          <Button size="sm" variant="outline">
                            <UserCheck className="h-4 w-4 mr-1" />
                            Shortlist
                          </Button>
                          <Button size="sm" variant="outline">
                            <Calendar className="h-4 w-4 mr-1" />
                            Interview
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Applications by Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Applications by Status</CardTitle>
                  <CardDescription>Distribution of applications across different stages</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics?.applications_by_status.map((status) => (
                      <div key={status.status} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(status.status)}>
                            {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(status.count / analytics.total_applications) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-8">{status.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Company Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Company Performance</CardTitle>
                  <CardDescription>Key metrics for your hiring process</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Hire Rate</span>
                      <span className="text-2xl font-bold text-green-600">{analytics?.hire_rate}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Avg. Time to Hire</span>
                      <span className="text-2xl font-bold text-blue-600">{analytics?.average_time_to_hire} days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Applications This Month</span>
                      <span className="text-2xl font-bold text-purple-600">{analytics?.applications_this_month}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Jobs Posted</span>
                      <span className="text-2xl font-bold text-orange-600">{analytics?.total_jobs}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
