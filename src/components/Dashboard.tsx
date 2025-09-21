import { useAuth } from "@/contexts/AuthContext";
import { JobSeekerDashboard } from "./dashboards/JobSeekerDashboard";
import { RecruiterDashboard } from "./dashboards/RecruiterDashboard";
import { EmployerDashboard } from "./dashboards/EmployerDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Loader2, ShieldAlert, Crown, Users, Briefcase, Building2, GraduationCap, Settings } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [selectedRole, setSelectedRole] = useState("admin");

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="mt-4 text-lg text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <CardTitle className="text-2xl">Access Denied</CardTitle>
              <CardDescription>Please sign in to view your dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800">
                <Link to="/signin">Sign In / Sign Up</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Check if user is super admin
  const isSuperAdmin = (user as any).user_metadata?.role === 'super_admin' || (user as any).user_metadata?.role === 'admin';

  if (isSuperAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Crown className="h-8 w-8 text-yellow-500" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
                <p className="text-gray-600">Access all platform dashboards and management tools</p>
              </div>
            </div>
          </div>

          <Tabs value={selectedRole} onValueChange={setSelectedRole} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Admin
              </TabsTrigger>
              <TabsTrigger value="job_seeker" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Job Seeker
              </TabsTrigger>
              <TabsTrigger value="recruiter" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Recruiter
              </TabsTrigger>
              <TabsTrigger value="employer" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Employer
              </TabsTrigger>
              <TabsTrigger value="student" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Student
              </TabsTrigger>
            </TabsList>

            <TabsContent value="admin">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Admin Management
                  </CardTitle>
                  <CardDescription>
                    Access the full admin dashboard for platform management
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button asChild className="h-20 flex flex-col gap-2">
                      <Link to="/admin">
                        <Settings className="h-6 w-6" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-20 flex flex-col gap-2">
                      <Link to="/admin?tab=users">
                        <Users className="h-6 w-6" />
                        <span>User Management</span>
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-20 flex flex-col gap-2">
                      <Link to="/admin?tab=jobs">
                        <Briefcase className="h-6 w-6" />
                        <span>Job Management</span>
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-20 flex flex-col gap-2">
                      <Link to="/admin?tab=blogs">
                        <Building2 className="h-6 w-6" />
                        <span>Blog Management</span>
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-20 flex flex-col gap-2">
                      <Link to="/admin?tab=resumes">
                        <GraduationCap className="h-6 w-6" />
                        <span>Resume Management</span>
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-20 flex flex-col gap-2">
                      <Link to="/admin?tab=analytics">
                        <Settings className="h-6 w-6" />
                        <span>Analytics</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="job_seeker">
              <JobSeekerDashboard />
            </TabsContent>

            <TabsContent value="recruiter">
              <RecruiterDashboard />
            </TabsContent>

            <TabsContent value="employer">
              <EmployerDashboard />
            </TabsContent>

            <TabsContent value="student">
              <JobSeekerDashboard /> {/* Students use similar dashboard to job seekers */}
            </TabsContent>
          </Tabs>
        </main>
        <Footer />
      </div>
    );
  }

  // Regular user role-based dashboard
  switch ((user as any).user_metadata?.role) {
    case 'job_seeker':
      return <JobSeekerDashboard />;
    case 'recruiter':
      return <RecruiterDashboard />;
    case 'employer':
      return <EmployerDashboard />;
    case 'student':
      return <JobSeekerDashboard />; // Students use similar dashboard to job seekers
    default:
      return (
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
            <Card className="w-full max-w-md text-center">
              <CardHeader>
                <ShieldAlert className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <CardTitle className="text-2xl">Role Not Recognized</CardTitle>
                <CardDescription>Your account role is not defined. Please contact support.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => (user as any).signOut?.()} className="w-full bg-gradient-to-r from-red-600 to-orange-700 hover:from-red-700 hover:to-orange-800">
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </main>
          <Footer />
        </div>
      );
  }
};

export default Dashboard;
