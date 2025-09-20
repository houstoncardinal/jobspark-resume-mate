import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Search, 
  MessageSquare, 
  Calendar, 
  Star,
  Plus,
  Filter,
  Download,
  Eye,
  UserCheck,
  UserX,
  Clock,
  Target,
  TrendingUp,
  BarChart3,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location: string;
  current_role: string;
  experience_years: number;
  skills: string[];
  match_score: number;
  status: 'new' | 'reviewed' | 'shortlisted' | 'interviewed' | 'hired' | 'rejected';
  applied_at: string;
  last_contact?: string;
  resume_url?: string;
  linkedin_url?: string;
}

interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  status: 'active' | 'paused' | 'closed';
  applications_count: number;
  created_at: string;
  salary_range?: string;
}

interface Interview {
  id: string;
  candidate_name: string;
  job_title: string;
  scheduled_at: string;
  type: 'phone' | 'video' | 'in-person';
  status: 'scheduled' | 'completed' | 'cancelled';
  interviewer: string;
  notes?: string;
}

export const RecruiterDashboard: React.FC = () => {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [stats, setStats] = useState({
    totalCandidates: 0,
    activeJobs: 0,
    interviewsToday: 0,
    hiredThisMonth: 0
  });

  useEffect(() => {
    // Mock data - replace with actual API calls
    setCandidates([
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        current_role: 'Senior Software Engineer',
        experience_years: 5,
        skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
        match_score: 92,
        status: 'shortlisted',
        applied_at: '2024-01-20',
        last_contact: '2024-01-22',
        resume_url: '/resumes/sarah-johnson.pdf',
        linkedin_url: 'https://linkedin.com/in/sarahjohnson'
      },
      {
        id: '2',
        name: 'Michael Chen',
        email: 'michael.chen@email.com',
        location: 'Austin, TX',
        current_role: 'Full Stack Developer',
        experience_years: 3,
        skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
        match_score: 88,
        status: 'interviewed',
        applied_at: '2024-01-18',
        last_contact: '2024-01-21'
      }
    ]);

    setJobPostings([
      {
        id: '1',
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        location: 'San Francisco, CA',
        type: 'full-time',
        status: 'active',
        applications_count: 45,
        created_at: '2024-01-15',
        salary_range: '$120,000 - $150,000'
      },
      {
        id: '2',
        title: 'Frontend Developer',
        company: 'StartupXYZ',
        location: 'Remote',
        type: 'full-time',
        status: 'active',
        applications_count: 32,
        created_at: '2024-01-10',
        salary_range: '$90,000 - $120,000'
      }
    ]);

    setInterviews([
      {
        id: '1',
        candidate_name: 'Sarah Johnson',
        job_title: 'Senior Software Engineer',
        scheduled_at: '2024-01-25T10:00:00Z',
        type: 'video',
        status: 'scheduled',
        interviewer: 'John Smith',
        notes: 'Technical interview - React and Node.js focus'
      },
      {
        id: '2',
        candidate_name: 'Michael Chen',
        job_title: 'Full Stack Developer',
        scheduled_at: '2024-01-24T14:00:00Z',
        type: 'phone',
        status: 'scheduled',
        interviewer: 'Jane Doe'
      }
    ]);

    setStats({
      totalCandidates: 156,
      activeJobs: 8,
      interviewsToday: 3,
      hiredThisMonth: 5
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'reviewed': return 'bg-yellow-100 text-yellow-800';
      case 'shortlisted': return 'bg-purple-100 text-purple-800';
      case 'interviewed': return 'bg-orange-100 text-orange-800';
      case 'hired': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getJobStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-red-100 text-red-800';
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
              <h1 className="text-3xl font-bold text-gray-900">Recruiter Dashboard</h1>
              <p className="text-gray-600">Manage candidates and job postings</p>
            </div>
            <div className="flex items-center gap-4">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Post New Job
              </Button>
              <Button variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Search Candidates
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
                  <p className="text-sm font-medium text-gray-600">Total Candidates</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCandidates}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeJobs}</p>
                </div>
                <Briefcase className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Interviews Today</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.interviewsToday}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Hired This Month</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.hiredThisMonth}</p>
                </div>
                <Award className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="jobs">Job Postings</TabsTrigger>
            <TabsTrigger value="interviews">Interviews</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Candidates */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Candidates</CardTitle>
                  <CardDescription>Latest candidate applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {candidates.slice(0, 3).map((candidate) => (
                      <div key={candidate.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {candidate.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium">{candidate.name}</h4>
                            <p className="text-sm text-gray-600">{candidate.current_role}</p>
                            <p className="text-xs text-gray-500">{candidate.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(candidate.status)}>
                            {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                          </Badge>
                          <div className="flex items-center gap-1 mt-1">
                            <Target className="h-3 w-3 text-green-600" />
                            <span className="text-xs text-green-600">{candidate.match_score}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Interviews */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Interviews</CardTitle>
                  <CardDescription>Today's scheduled interviews</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {interviews.slice(0, 3).map((interview) => (
                      <div key={interview.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{interview.candidate_name}</h4>
                          <Badge variant="outline">{interview.type}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{interview.job_title}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(interview.scheduled_at).toLocaleString()}
                          </div>
                          <span>with {interview.interviewer}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="candidates" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Candidates</h2>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {candidates.map((candidate) => (
                <Card key={candidate.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-lg font-medium text-blue-600">
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{candidate.name}</h3>
                          <p className="text-gray-600">{candidate.current_role}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {candidate.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {candidate.experience_years} years exp
                            </div>
                            <div className="flex items-center gap-1">
                              <Target className="h-4 w-4" />
                              {candidate.match_score}% match
                            </div>
                          </div>
                          <div className="flex gap-1 mt-2">
                            {candidate.skills.slice(0, 3).map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {candidate.skills.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{candidate.skills.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`${getStatusColor(candidate.status)} text-sm px-3 py-1 mb-2`}>
                          {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                        </Badge>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Contact
                          </Button>
                          <Button size="sm" variant="outline">
                            <Calendar className="h-4 w-4 mr-1" />
                            Schedule
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                      <Badge className={getJobStatusColor(job.status)}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </Badge>
                    </div>
                    <CardDescription>{job.company}</CardDescription>
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
                      {job.salary_range && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <TrendingUp className="h-4 w-4" />
                          {job.salary_range}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{job.applications_count} applications</span>
                        <span className="text-gray-500">Posted {new Date(job.created_at).toLocaleDateString()}</span>
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

          <TabsContent value="interviews" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Interviews</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Interview
              </Button>
            </div>

            <div className="space-y-4">
              {interviews.map((interview) => (
                <Card key={interview.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{interview.candidate_name}</h3>
                        <p className="text-gray-600">{interview.job_title}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(interview.scheduled_at).toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {interview.type.charAt(0).toUpperCase() + interview.type.slice(1)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {interview.interviewer}
                          </div>
                        </div>
                        {interview.notes && (
                          <p className="text-sm text-gray-600 mt-2 italic">"{interview.notes}"</p>
                        )}
                      </div>
                      <div className="text-right">
                        <Badge className={`${getStatusColor(interview.status)} text-sm px-3 py-1 mb-2`}>
                          {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                        </Badge>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Notes
                          </Button>
                          <Button size="sm" variant="outline">
                            <Calendar className="h-4 w-4 mr-1" />
                            Reschedule
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
