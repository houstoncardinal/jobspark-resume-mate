import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { JobSeekerDashboard } from '@/components/dashboards/JobSeekerDashboard';
import { RecruiterDashboard } from '@/components/dashboards/RecruiterDashboard';
import { EmployerDashboard } from '@/components/dashboards/EmployerDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Please Sign In
            </CardTitle>
            <CardDescription className="text-gray-600">
              You need to be signed in to access your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link to="/signin">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/signin">
                <UserPlus className="h-4 w-4 mr-2" />
                Sign Up
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render the appropriate dashboard based on user role
  switch (user.role) {
    case 'job_seeker':
      return <JobSeekerDashboard />;
    case 'recruiter':
      return <RecruiterDashboard />;
    case 'employer':
      return <EmployerDashboard />;
    default:
      return <JobSeekerDashboard />; // Default to job seeker
  }
};

export default Dashboard;
