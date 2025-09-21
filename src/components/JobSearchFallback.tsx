import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Briefcase, Clock, DollarSign, Building2 } from 'lucide-react';

interface JobSearchFallbackProps {
  onJobSelect?: (job: any) => void;
  selectedJob?: any;
}

const JobSearchFallback: React.FC<JobSearchFallbackProps> = ({ onJobSelect, selectedJob }) => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Job Search</h1>
        <p className="text-gray-600">Search for your next opportunity</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search jobs, companies, or keywords..."
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700"
          size="sm"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Sample Jobs */}
      <div className="grid gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                  Software Engineer
                </CardTitle>
                <CardDescription className="text-gray-600 mb-3">
                  Tech Company • San Francisco, CA
                </CardDescription>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    <span>Full-time</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>Remote</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span>$80,000 - $120,000</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              We are looking for a talented Software Engineer to join our growing team. 
              You will work on exciting projects using modern technologies.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">2 days ago</span>
              </div>
              <Button 
                onClick={() => onJobSelect?.({
                  id: '1',
                  title: 'Software Engineer',
                  company: 'Tech Company',
                  location: 'San Francisco, CA',
                  type: 'Full-time',
                  salary: { min: 80000, max: 120000, currency: 'USD' },
                  description: 'We are looking for a talented Software Engineer...',
                  source: 'Sample'
                })}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                  Product Manager
                </CardTitle>
                <CardDescription className="text-gray-600 mb-3">
                  Startup Inc • New York, NY
                </CardDescription>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    <span>Full-time</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>On-site</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span>$90,000 - $130,000</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Join our product team as a Product Manager and help shape the future of our platform. 
              You will work with cross-functional teams to define product strategy.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">1 day ago</span>
              </div>
              <Button 
                onClick={() => onJobSelect?.({
                  id: '2',
                  title: 'Product Manager',
                  company: 'Startup Inc',
                  location: 'New York, NY',
                  type: 'Full-time',
                  salary: { min: 90000, max: 130000, currency: 'USD' },
                  description: 'Join our product team as a Product Manager...',
                  source: 'Sample'
                })}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center mt-8">
        <p className="text-gray-500 mb-4">Job search is loading...</p>
        <Button 
          onClick={() => window.location.reload()}
          variant="outline"
        >
          Refresh Page
        </Button>
      </div>
    </div>
  );
};

export default JobSearchFallback;
