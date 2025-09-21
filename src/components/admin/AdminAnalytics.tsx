import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Briefcase, 
  FileText, 
  BookOpen,
  Eye,
  Heart,
  Share2,
  MessageSquare,
  Download,
  RefreshCw,
  Calendar,
  DollarSign,
  Target,
  Zap,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Clock,
  Activity,
  PieChart,
  LineChart,
  BarChart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/supabaseClient";

interface AnalyticsData {
  totalUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  totalJobs: number;
  newJobsToday: number;
  approvedJobs: number;
  pendingJobs: number;
  totalBlogs: number;
  publishedBlogs: number;
  totalResumes: number;
  verifiedResumes: number;
  totalApplications: number;
  newApplicationsToday: number;
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  userGrowth: Array<{date: string, count: number}>;
  jobGrowth: Array<{date: string, count: number}>;
  blogGrowth: Array<{date: string, count: number}>;
  topCountries: Array<{country: string, count: number}>;
  topJobCategories: Array<{category: string, count: number}>;
  topBlogTags: Array<{tag: string, count: number}>;
  deviceStats: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  hourlyActivity: Array<{hour: number, activity: number}>;
}

export const AdminAnalytics = () => {
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    newUsersToday: 0,
    newUsersThisWeek: 0,
    newUsersThisMonth: 0,
    totalJobs: 0,
    newJobsToday: 0,
    approvedJobs: 0,
    pendingJobs: 0,
    totalBlogs: 0,
    publishedBlogs: 0,
    totalResumes: 0,
    verifiedResumes: 0,
    totalApplications: 0,
    newApplicationsToday: 0,
    totalViews: 0,
    totalLikes: 0,
    totalShares: 0,
    userGrowth: [],
    jobGrowth: [],
    blogGrowth: [],
    topCountries: [],
    topJobCategories: [],
    topBlogTags: [],
    deviceStats: { desktop: 0, mobile: 0, tablet: 0 },
    hourlyActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const today = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case '1d':
          startDate.setDate(today.getDate() - 1);
          break;
        case '7d':
          startDate.setDate(today.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(today.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(today.getDate() - 90);
          break;
        default:
          startDate.setDate(today.getDate() - 7);
      }

      // Load all analytics data in parallel
      const [
        usersResult,
        jobsResult,
        blogsResult,
        resumesResult,
        applicationsResult
      ] = await Promise.all([
        supabase.from('profiles').select('id, created_at, location'),
        supabase.from('job_postings').select('id, status, created_at, views, employment_type'),
        supabase.from('blog_posts').select('id, status, created_at, views, likes, shares, tags'),
        supabase.from('resume_files').select('id, is_verified, created_at'),
        supabase.from('job_applications').select('id, created_at')
      ]);

      // Process user data
      const users = usersResult.data || [];
      const newUsersToday = users.filter(u => 
        new Date(u.created_at).toDateString() === today.toDateString()
      ).length;
      const newUsersThisWeek = users.filter(u => 
        new Date(u.created_at) >= new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      ).length;
      const newUsersThisMonth = users.filter(u => 
        new Date(u.created_at) >= new Date(today.getFullYear(), today.getMonth(), 1)
      ).length;

      // Process job data
      const jobs = jobsResult.data || [];
      const newJobsToday = jobs.filter(j => 
        new Date(j.created_at).toDateString() === today.toDateString()
      ).length;
      const approvedJobs = jobs.filter(j => j.status === 'approved').length;
      const pendingJobs = jobs.filter(j => j.status === 'pending').length;
      const totalJobViews = jobs.reduce((sum, job) => sum + (job.views || 0), 0);

      // Process blog data
      const blogs = blogsResult.data || [];
      const publishedBlogs = blogs.filter(b => b.status === 'published').length;
      const totalBlogViews = blogs.reduce((sum, blog) => sum + (blog.views || 0), 0);
      const totalLikes = blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0);
      const totalShares = blogs.reduce((sum, blog) => sum + (blog.shares || 0), 0);

      // Process resume data
      const resumes = resumesResult.data || [];
      const verifiedResumes = resumes.filter(r => r.is_verified).length;

      // Process application data
      const applications = applicationsResult.data || [];
      const newApplicationsToday = applications.filter(a => 
        new Date(a.created_at).toDateString() === today.toDateString()
      ).length;

      // Generate growth data (simplified for demo)
      const userGrowth = generateGrowthData(users, startDate, today);
      const jobGrowth = generateGrowthData(jobs, startDate, today);
      const blogGrowth = generateGrowthData(blogs, startDate, today);

      // Generate top categories/tags (simplified for demo)
      const topJobCategories = generateTopCategories(jobs);
      const topBlogTags = generateTopTags(blogs);

      setAnalytics({
        totalUsers: users.length,
        newUsersToday,
        newUsersThisWeek,
        newUsersThisMonth,
        totalJobs: jobs.length,
        newJobsToday,
        approvedJobs,
        pendingJobs,
        totalBlogs: blogs.length,
        publishedBlogs,
        totalResumes: resumes.length,
        verifiedResumes,
        totalApplications: applications.length,
        newApplicationsToday,
        totalViews: totalJobViews + totalBlogViews,
        totalLikes,
        totalShares,
        userGrowth,
        jobGrowth,
        blogGrowth,
        topCountries: [], // Would need location data
        topJobCategories,
        topBlogTags,
        deviceStats: { desktop: 60, mobile: 35, tablet: 5 }, // Mock data
        hourlyActivity: generateHourlyActivity()
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateGrowthData = (data: any[], startDate: Date, endDate: Date) => {
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const result = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const count = data.filter(item => 
        new Date(item.created_at).toDateString() === date.toDateString()
      ).length;
      result.push({
        date: date.toISOString().split('T')[0],
        count
      });
    }
    
    return result;
  };

  const generateTopCategories = (jobs: any[]) => {
    const categories: { [key: string]: number } = {};
    jobs.forEach(job => {
      const category = job.employment_type || 'other';
      categories[category] = (categories[category] || 0) + 1;
    });
    
    return Object.entries(categories)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const generateTopTags = (blogs: any[]) => {
    const tags: { [key: string]: number } = {};
    blogs.forEach(blog => {
      if (blog.tags) {
        blog.tags.forEach((tag: string) => {
          tags[tag] = (tags[tag] || 0) + 1;
        });
      }
    });
    
    return Object.entries(tags)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const generateHourlyActivity = () => {
    const result = [];
    for (let hour = 0; hour < 24; hour++) {
      result.push({
        hour,
        activity: Math.floor(Math.random() * 100) // Mock data
      });
    }
    return result;
  };

  const exportAnalytics = () => {
    const csvContent = [
      ['Metric', 'Value'],
      ['Total Users', analytics.totalUsers],
      ['New Users Today', analytics.newUsersToday],
      ['Total Jobs', analytics.totalJobs],
      ['Approved Jobs', analytics.approvedJobs],
      ['Total Blogs', analytics.totalBlogs],
      ['Published Blogs', analytics.publishedBlogs],
      ['Total Views', analytics.totalViews],
      ['Total Likes', analytics.totalLikes],
      ['Total Shares', analytics.totalShares]
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analytics.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Platform performance and user insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportAnalytics} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={loadAnalytics} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{analytics.newUsersToday} today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Job Postings</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalJobs.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.approvedJobs} approved, {analytics.pendingJobs} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalBlogs.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.publishedBlogs} published
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.totalLikes} likes, {analytics.totalShares} shares
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Growth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New user registrations over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <BarChart className="h-12 w-12 mx-auto mb-2" />
                <p>Chart visualization would go here</p>
                <p className="text-sm">Data points: {analytics.userGrowth.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job Postings</CardTitle>
            <CardDescription>Job posting trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <LineChart className="h-12 w-12 mx-auto mb-2" />
                <p>Chart visualization would go here</p>
                <p className="text-sm">Data points: {analytics.jobGrowth.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Categories and Tags */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Job Categories</CardTitle>
            <CardDescription>Most popular job types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topJobCategories.map((category, index) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{index + 1}</Badge>
                    <span className="text-sm font-medium">
                      {category.category.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">{category.count} jobs</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Blog Tags</CardTitle>
            <CardDescription>Most used blog tags</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topBlogTags.map((tag, index) => (
                <div key={tag.tag} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{index + 1}</Badge>
                    <span className="text-sm font-medium">#{tag.tag}</span>
                  </div>
                  <span className="text-sm text-gray-500">{tag.count} posts</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Device Usage</CardTitle>
          <CardDescription>Platform usage by device type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Monitor className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Desktop</p>
                <p className="text-2xl font-bold">{analytics.deviceStats.desktop}%</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Mobile</p>
                <p className="text-2xl font-bold">{analytics.deviceStats.mobile}%</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Tablet className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Tablet</p>
                <p className="text-2xl font-bold">{analytics.deviceStats.tablet}%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity Summary</CardTitle>
          <CardDescription>Key metrics for the selected time period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">+{analytics.newUsersToday}</div>
              <div className="text-sm text-gray-500">New Users Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">+{analytics.newJobsToday}</div>
              <div className="text-sm text-gray-500">New Jobs Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">+{analytics.newApplicationsToday}</div>
              <div className="text-sm text-gray-500">New Applications Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{analytics.verifiedResumes}</div>
              <div className="text-sm text-gray-500">Verified Resumes</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
