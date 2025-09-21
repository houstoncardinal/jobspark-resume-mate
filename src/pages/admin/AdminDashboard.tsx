import { useState, useEffect } from "react";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  FileText, 
  Briefcase, 
  BookOpen, 
  Settings, 
  Shield, 
  BarChart3,
  RefreshCw,
  Bell,
  Activity,
  CheckCircle,
  Clock,
  TrendingUp,
  DollarSign,
  Eye,
  UserCheck,
  AlertCircle,
  Database,
  Mail,
  Globe,
  Lock,
  Wrench,
  Zap
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { UserManagement } from "@/components/admin/UserManagement";
import { JobManagement } from "@/components/admin/JobManagement";
import { ContentManagement } from "@/components/admin/ContentManagement";
import { SettingsManagement } from "@/components/admin/SettingsManagement";
import JobSourceDiagnostics from "@/components/admin/JobSourceDiagnostics";

interface DashboardStats {
  totalUsers: number;
  newUsersToday: number;
  totalJobs: number;
  pendingJobs: number;
  totalBlogs: number;
  publishedBlogs: number;
  totalResumes: number;
  verifiedResumes: number;
  totalRevenue: number;
  monthlyRevenue: number;
  systemHealth: 'excellent' | 'good' | 'warning' | 'critical';
}

export const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    newUsersToday: 0,
    totalJobs: 0,
    pendingJobs: 0,
    totalBlogs: 0,
    publishedBlogs: 0,
    totalResumes: 0,
    verifiedResumes: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    systemHealth: 'excellent'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setStats({
        totalUsers: 12345,
        newUsersToday: 45,
        totalJobs: 5678,
        pendingJobs: 123,
        totalBlogs: 234,
        publishedBlogs: 189,
        totalResumes: 9876,
        verifiedResumes: 7654,
        totalRevenue: 1234567.89,
        monthlyRevenue: 54321.00,
        systemHealth: 'excellent'
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const refreshData = () => {
    setLoading(true);
    const timer = setTimeout(() => {
      setStats({
        totalUsers: 12345 + Math.floor(Math.random() * 100),
        newUsersToday: 45 + Math.floor(Math.random() * 10),
        totalJobs: 5678 + Math.floor(Math.random() * 20),
        pendingJobs: 123 + Math.floor(Math.random() * 5),
        totalBlogs: 234 + Math.floor(Math.random() * 3),
        publishedBlogs: 189 + Math.floor(Math.random() * 2),
        totalResumes: 9876 + Math.floor(Math.random() * 30),
        verifiedResumes: 7654 + Math.floor(Math.random() * 15),
        totalRevenue: 1234567.89 + Math.floor(Math.random() * 1000),
        monthlyRevenue: 54321.00 + Math.floor(Math.random() * 500),
        systemHealth: 'excellent'
      });
      setLoading(false);
      toast({
        title: "Data Refreshed",
        description: "Dashboard data has been updated.",
      });
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading admin dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage your Gigm8 platform</p>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={refreshData} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">
              <BarChart3 className="h-4 w-4 mr-2" /> Overview
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" /> Users
            </TabsTrigger>
            <TabsTrigger value="jobs">
              <Briefcase className="h-4 w-4 mr-2" /> Jobs
            </TabsTrigger>
            <TabsTrigger value="content">
              <BookOpen className="h-4 w-4 mr-2" /> Content
            </TabsTrigger>
            <TabsTrigger value="sources">
              <Wrench className="h-4 w-4 mr-2" /> Job Sources
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" /> Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                  <p className="text-xs text-gray-500">+ {stats.newUsersToday} new users today</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                  <Briefcase className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalJobs.toLocaleString()}</div>
                  <p className="text-xs text-gray-500">{stats.pendingJobs} pending approval</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalBlogs.toLocaleString()}</div>
                  <p className="text-xs text-gray-500">{stats.publishedBlogs} published</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Resumes</CardTitle>
                  <FileText className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalResumes.toLocaleString()}</div>
                  <p className="text-xs text-gray-500">{stats.verifiedResumes} verified</p>
                </CardContent>
              </Card>
            </div>

            {/* Revenue and System Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Total and monthly revenue.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <span className="text-lg font-medium">Total Revenue:</span>
                    </div>
                    <span className="text-xl font-bold text-green-600">${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      <span className="text-lg font-medium">Monthly Revenue:</span>
                    </div>
                    <span className="text-xl font-bold text-blue-600">${stats.monthlyRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <Button className="w-full bg-blue-600">View Full Report</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>Health of core services.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-gray-600" />
                      <span className="font-medium">API Service</span>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" /> Operational
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-gray-600" />
                      <span className="font-medium">Database</span>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" /> Operational
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-gray-600" />
                      <span className="font-medium">Email Service</span>
                    </div>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200">
                      <AlertCircle className="h-3 w-3 mr-1" /> Degraded
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-gray-600" />
                      <span className="font-medium">Job Sources</span>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" /> Operational
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions on the platform.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">User <span className="text-blue-600">John Doe</span> registered.</p>
                      <p className="text-sm text-gray-500">2 minutes ago</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">New job posting for <span className="text-green-600">Senior React Developer</span> at Acme Corp.</p>
                      <p className="text-sm text-gray-500">1 hour ago</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Blog post <span className="text-purple-600">"The Future of AI in Recruitment"</span> published.</p>
                      <p className="text-sm text-gray-500">3 hours ago</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-medium">Resume <span className="text-orange-600">#12345</span> updated by Jane Smith.</p>
                      <p className="text-sm text-gray-500">Yesterday</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Perform common administrative tasks.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button className="bg-blue-600">
                  <Users className="h-4 w-4 mr-2" /> Add New User
                </Button>
                <Button variant="outline">
                  <Briefcase className="h-4 w-4 mr-2" /> Create Job Posting
                </Button>
                <Button variant="outline">
                  <BookOpen className="h-4 w-4 mr-2" /> Write New Blog
                </Button>
                <Button variant="outline">
                  <Wrench className="h-4 w-4 mr-2" /> Test Job Sources
                </Button>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" /> Update Site Settings
                </Button>
                <Button variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" /> View Analytics
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-4">
            <UserManagement />
          </TabsContent>
          <TabsContent value="jobs" className="mt-4">
            <JobManagement />
          </TabsContent>
          <TabsContent value="content" className="mt-4">
            <ContentManagement />
          </TabsContent>
          <TabsContent value="sources" className="mt-4">
            <JobSourceDiagnostics />
          </TabsContent>
          <TabsContent value="settings" className="mt-4">
            <SettingsManagement />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};
