import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { JobSeekerDashboard } from '@/components/dashboards/JobSeekerDashboard';
import { RecruiterDashboard } from '@/components/dashboards/RecruiterDashboard';
import { EmployerDashboard } from '@/components/dashboards/EmployerDashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8">
          <CardContent className="flex items-center gap-4">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading your dashboard...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8">
          <CardContent className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h2>
            <p className="text-gray-600">You need to be signed in to access your dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  switch (user.role) {
    case 'job_seeker':
      return <JobSeekerDashboard />;
    case 'recruiter':
      return <RecruiterDashboard />;
    case 'employer':
      return <EmployerDashboard />;
    default:
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="p-8">
            <CardContent className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid user role</h2>
              <p className="text-gray-600">Please contact support to resolve this issue.</p>
            </CardContent>
          </Card>
        </div>
      );
  }
};
