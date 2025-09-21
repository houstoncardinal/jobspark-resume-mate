import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { JobSeekerDashboard } from '@/components/dashboards/JobSeekerDashboard';
import { EmployerDashboard } from '@/components/dashboards/EmployerDashboard';
import { RecruiterDashboard } from '@/components/dashboards/RecruiterDashboard';
import StudentDashboard from '@/components/dashboards/StudentDashboard';

const RoleBasedDashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to access your dashboard</h2>
          <p className="text-gray-600">You need to be logged in to view your personalized dashboard.</p>
        </div>
      </div>
    );
  }

  switch (user.role) {
    case 'job_seeker':
      return <JobSeekerDashboard />;
    case 'employer':
      return <EmployerDashboard />;
    case 'recruiter':
      return <RecruiterDashboard />;
    case 'student':
      return <StudentDashboard />;
    default:
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Unknown Role</h2>
            <p className="text-gray-600">Your account role is not recognized. Please contact support.</p>
          </div>
        </div>
      );
  }
};

export default RoleBasedDashboard;
