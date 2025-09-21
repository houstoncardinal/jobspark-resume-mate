import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Briefcase, Clock, DollarSign, Building2, Star, Filter, SortAsc, Grid, List, Heart, Share2, ExternalLink, Globe, Users, Calendar, Bookmark, Eye, ArrowRight, ChevronDown, X, Plus, Minus, Check, AlertCircle, Info, Zap, Target, TrendingUp, Award, Shield, Sparkles, Crown, Diamond, Flame, Rocket, Star as StarIcon, CheckCircle, AlertTriangle, RefreshCw, Download, Upload, Settings, Bell, User, LogOut, Menu, X as XIcon } from 'lucide-react';

interface JobSearchProps {
  onJobSelect?: (job: any) => void;
  selectedJob?: any;
}

const JobSearch: React.FC<JobSearchProps> = ({ onJobSelect, selectedJob }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Software Engineer',
      company: 'Tech Company Inc.',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$120,000 - $150,000',
      description: 'We are looking for a talented software engineer to join our team and help build amazing products.',
      tags: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker'],
      posted: '2 days ago'
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'StartupXYZ',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$100,000 - $130,000',
      description: 'Join our product team and help shape the future of our platform with innovative solutions.',
      tags: ['Product Management', 'Agile', 'User Research', 'Analytics', 'Strategy'],
      posted: '1 week ago'
    },
    {
      id: 3,
      title: 'UX Designer',
      company: 'Design Studio',
      location: 'Remote',
      type: 'Contract',
      salary: '$80,000 - $100,000',
      description: 'Create beautiful and intuitive user experiences for our clients across various industries.',
      tags: ['Figma', 'User Research', 'Prototyping', 'UI/UX', 'Design Systems'],
      posted: '3 days ago'
    },
    {
      id: 4,
      title: 'Data Scientist',
      company: 'AI Corp',
      location: 'Seattle, WA',
      type: 'Full-time',
      salary: '$130,000 - $160,000',
      description: 'Work with large datasets and machine learning models to solve complex business problems.',
      tags: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Statistics'],
      posted: '5 days ago'
    },
    {
      id: 5,
      title: 'Marketing Manager',
      company: 'Growth Co',
      location: 'Austin, TX',
      type: 'Full-time',
      salary: '$90,000 - $110,000',
      description: 'Lead marketing campaigns and drive growth for our expanding product portfolio.',
      tags: ['Digital Marketing', 'SEO', 'Content Strategy', 'Analytics', 'Campaign Management'],
      posted: '1 day ago'
    },
    {
      id: 6,
      title: 'DevOps Engineer',
      company: 'Cloud Solutions',
      location: 'Denver, CO',
      type: 'Full-time',
      salary: '$110,000 - $140,000',
      description: 'Manage infrastructure and deployment pipelines for our cloud-based applications.',
      tags: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
      posted: '4 days ago'
    }
  ]);

  const handleSearch = () => {
    setLoading(true);
    // Simulate search with a delay
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleJobClick = (job: any) => {
    if (onJobSelect) {
      onJobSelect(job);
    }
  };

  return (
    <div className="w-full">
      {/* Search Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Find Your Dream Job</CardTitle>
          <CardDescription>Search thousands of job opportunities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Job title or keywords"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <Card 
            key={job.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleJobClick(job)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                    {job.title}
                  </CardTitle>
                  <CardDescription className="text-lg font-medium text-blue-600 mb-2">
                    {job.company}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle save functionality
                    }}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle share functionality
                    }}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {job.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {job.type}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  {job.salary}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{job.posted}</span>
                <Button 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJobClick(job);
                  }}
                >
                  Apply Now
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {job.tags && job.tags.length > 0 ? job.tags.slice(0, 5).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                )) : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default JobSearch;
