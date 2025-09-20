import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ResumeManager } from '@/components/ResumeManager';
import { 
  FileText, 
  Briefcase, 
  Target, 
  BarChart3, 
  Settings, 
  User,
  TrendingUp,
  Calendar,
  Clock,
  Star,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Download,
  Share2,
  Bell,
  Heart,
  Bookmark,
  MessageSquare,
  Users,
  Building2,
  MapPin,
  DollarSign,
  Award,
  Zap,
  Sparkles
} from 'lucide-react';

export const JobSeekerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - in a real app, this would come from your backend
  const profileStats = {
    profileCompleteness: 85,
    applicationsSent: 12,
    interviewsScheduled: 3,
    jobMatches: 8,
    resumeViews: 24
  };

  const recentApplications = [
    {
      id: 1,
      company: 'Tech Corp',
      position: 'Senior Frontend Developer',
      status: 'Applied',
      date: '2024-01-15',
      match: 92
    },
    {
      id: 2,
      company: 'StartupXYZ',
      position: 'Full Stack Engineer',
      status: 'Interview',
      date: '2024-01-12',
      match: 88
    },
    {
      id: 3,
      company: 'BigTech Inc',
      position: 'React Developer',
      status: 'Rejected',
      date: '2024-01-10',
      match: 76
    }
  ];

  const jobMatches = [
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'Innovation Labs',
      location: 'San Francisco, CA',
      salary: '$120,000 - $150,000',
      match: 95,
      type: 'Full-time',
      posted: '2 days ago'
    },
    {
      id: 2,
      title: 'Frontend Engineer',
      company: 'Creative Agency',
      location: 'Remote',
      salary: '$100,000 - $130,000',
      match: 89,
      type: 'Full-time',
      posted: '1 week ago'
    },
    {
      id: 3,
      title: 'JavaScript Developer',
      company: 'E-commerce Giant',
      location: 'New York, NY',
      salary: '$110,000 - $140,000',
      match: 87,
      type: 'Full-time',
      posted: '3 days ago'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Applied': return 'bg-blue-100 text-blue-800';
      case 'Interview': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Job Seeker Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back! Here's your career overview.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Application
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Profile Complete</p>
                  <p className="text-2xl font-bold text-gray-900">{profileStats.profileCompleteness}%</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <Progress value={profileStats.profileCompleteness} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{profileStats.applicationsSent}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Interviews</p>
                  <p className="text-2xl font-bold text-gray-900">{profileStats.interviewsScheduled}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Job Matches</p>
                  <p className="text-2xl font-bold text-gray-900">{profileStats.jobMatches}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resume Views</p>
                  <p className="text-2xl font-bold text-gray-900">{profileStats.resumeViews}</p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Eye className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="resumes">Resumes</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="matches">Job Matches</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Applications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Recent Applications
                  </CardTitle>
                  <CardDescription>Your latest job applications and their status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentApplications.map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{application.position}</h4>
                        <p className="text-sm text-gray-600">{application.company}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getStatusColor(application.status)}>
                            {application.status}
                          </Badge>
                          <span className="text-xs text-gray-500">{application.date}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{application.match}% match</div>
                        <Progress value={application.match} className="w-20 mt-1" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Top Job Matches */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Top Job Matches
                  </CardTitle>
                  <CardDescription>Jobs that match your profile perfectly</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {jobMatches.map((job) => (
                    <div key={job.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{job.title}</h4>
                          <p className="text-sm text-gray-600">{job.company}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              {job.salary}
                            </span>
                            <span>{job.type}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">{job.match}% match</div>
                          <Progress value={job.match} className="w-20 mt-1" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm">
                          Apply
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Common tasks to help you in your job search</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button asChild className="h-auto p-6 flex flex-col items-center gap-3">
                    <a href="/builder">
                      <FileText className="h-8 w-8" />
                      <div className="text-center">
                        <div className="font-semibold">Build Resume</div>
                        <div className="text-sm opacity-90">Create or update your resume</div>
                      </div>
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="h-auto p-6 flex flex-col items-center gap-3">
                    <a href="/#job-search">
                      <Briefcase className="h-8 w-8" />
                      <div className="text-center">
                        <div className="font-semibold">Find Jobs</div>
                        <div className="text-sm opacity-90">Search for new opportunities</div>
                      </div>
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="h-auto p-6 flex flex-col items-center gap-3">
                    <a href="/#match">
                      <Target className="h-8 w-8" />
                      <div className="text-center">
                        <div className="font-semibold">Match Analysis</div>
                        <div className="text-sm opacity-90">Analyze job compatibility</div>
                      </div>
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resumes Tab */}
          <TabsContent value="resumes">
            <ResumeManager />
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Job Applications</CardTitle>
                <CardDescription>Track all your job applications and their progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentApplications.map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-6 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900">{application.position}</h4>
                        <p className="text-gray-600">{application.company}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge className={getStatusColor(application.status)}>
                            {application.status}
                          </Badge>
                          <span className="text-sm text-gray-500">Applied on {application.date}</span>
                          <span className="text-sm font-medium text-gray-700">{application.match}% match</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Job Matches Tab */}
          <TabsContent value="matches">
            <Card>
              <CardHeader>
                <CardTitle>Job Matches</CardTitle>
                <CardDescription>Jobs that match your skills and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobMatches.map((job) => (
                    <div key={job.id} className="p-6 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900">{job.title}</h4>
                          <p className="text-gray-600">{job.company}</p>
                          <div className="flex items-center gap-6 mt-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {job.salary}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {job.posted}
                            </span>
                            <Badge variant="outline">{job.type}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900">{job.match}% match</div>
                          <Progress value={job.match} className="w-24 mt-2" />
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-4">
                        <Button size="sm">
                          Apply Now
                        </Button>
                        <Button variant="outline" size="sm">
                          <Heart className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Application Trends</CardTitle>
                  <CardDescription>Your application activity over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <BarChart3 className="h-16 w-16" />
                    <p className="ml-4">Chart visualization coming soon</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skills Analysis</CardTitle>
                  <CardDescription>Your most in-demand skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">React</span>
                      <div className="flex items-center gap-2">
                        <Progress value={95} className="w-20" />
                        <span className="text-sm text-gray-600">95%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">JavaScript</span>
                      <div className="flex items-center gap-2">
                        <Progress value={90} className="w-20" />
                        <span className="text-sm text-gray-600">90%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">TypeScript</span>
                      <div className="flex items-center gap-2">
                        <Progress value={85} className="w-20" />
                        <span className="text-sm text-gray-600">85%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Node.js</span>
                      <div className="flex items-center gap-2">
                        <Progress value={80} className="w-20" />
                        <span className="text-sm text-gray-600">80%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your personal information and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue="john.doe@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue="San Francisco, CA"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue="Experienced software engineer with 5+ years of expertise in full-stack development..."
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button>Save Changes</Button>
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
