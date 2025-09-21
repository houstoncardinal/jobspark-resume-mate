/** @jsxImportSource react */
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { SEO } from '@/components/SEO';
import { PAGE_SEO } from '@/lib/seo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { JobDetailModal } from '@/components/JobDetailModal';
import { useToast } from '@/hooks/use-toast';
import { searchAllJobs, getAvailableSources, testAPIConnections, JobListing, JobSearchParams } from '@/lib/job-aggregator';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign, 
  Building2, 
  Star,
  Filter,
  SortAsc,
  Grid,
  List,
  Heart,
  Share2,
  ExternalLink,
  Globe,
  Users,
  TrendingUp,
  Award,
  Calendar,
  Bookmark,
  Eye,
  ChevronDown,
  ChevronUp,
  X,
  RefreshCw,
  Zap,
  Target,
  Shield,
  Sparkles,
  Crown,
  Flame,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info,
  Lightbulb,
  Sliders,
  RotateCcw,
  Diamond,
  Tag,
  Bell,
  Plus,
  Minus,
  Loader2
} from 'lucide-react';

const JobsPage = () => {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<JobSearchParams>({
    query: 'software engineer',
    location: '',
    remote: false,
    sources: ['usajobs', 'adzuna', 'indeed', 'linkedin', 'github', 'ziprecruiter', 'rss', 'remoteok'],
    limit: 50
  });
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'salary'>('relevance');
  const [apiStatus, setApiStatus] = useState<Record<string, boolean>>({});
  const [sources, setSources] = useState(getAvailableSources());
  const { toast } = useToast();

  // Load jobs on component mount and when search params change (with debouncing)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadJobs();
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchParams]);

  // Test API connections on mount
  useEffect(() => {
    testConnections();
  }, []);

  const testConnections = async () => {
    const status = await testAPIConnections();
    setApiStatus(status);
  };

  const loadJobs = async () => {
    setLoading(true);
    try {
      const results = await searchAllJobs(searchParams);
      setJobs(results);
      
      if (results.length === 0) {
        toast({
          title: "No jobs found",
          description: "Try adjusting your search criteria or using different sources.",
        });
      } else {
        toast({
          title: `Found ${results.length} jobs`,
          description: `Search completed successfully.`,
        });
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
      toast({
        title: "Error loading jobs",
        description: "There was an error fetching job listings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newParams: Partial<JobSearchParams>) => {
    // Convert "any" values to undefined to clear filters
    const processedParams = { ...newParams };
    if (processedParams.jobType === 'any') processedParams.jobType = undefined;
    if (processedParams.experience === 'any') processedParams.experience = undefined;
    if (processedParams.industry === 'any') processedParams.industry = undefined;
    
    setSearchParams(prev => ({ ...prev, ...processedParams }));
  };

  const handleSourceToggle = (sourceId: string) => {
    setSearchParams(prev => {
      const currentSources = prev.sources || [];
      const newSources = currentSources.includes(sourceId)
        ? currentSources.filter(s => s !== sourceId)
        : [...currentSources, sourceId];
      
      return {
        ...prev,
        sources: newSources
      };
    });
  };

  const formatSalary = (job: JobListing) => {
    if (!job.salary) return 'Salary not specified';
    
    const { min, max, currency = 'USD', period = 'year' } = job.salary;
    const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);
    
    if (min && max) {
      return `$${formatNumber(min)} - $${formatNumber(max)}/${period}`;
    } else if (min) {
      return `$${formatNumber(min)}+/${period}`;
    } else if (max) {
      return `Up to $${formatNumber(max)}/${period}`;
    }
    
    return 'Salary not specified';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Date not specified';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const getSourceColor = (source: string) => {
    const colors: Record<string, string> = {
      'USAJobs': 'bg-blue-100 text-blue-800',
      'RemoteOK': 'bg-green-100 text-green-800',
      'Adzuna': 'bg-purple-100 text-purple-800',
      'Jooble': 'bg-orange-100 text-orange-800',
      'GitHub': 'bg-gray-100 text-gray-800',
      'Indeed': 'bg-indigo-100 text-indigo-800',
      'LinkedIn': 'bg-blue-100 text-blue-800',
      'Stack Overflow': 'bg-orange-100 text-orange-800',
    };
    return colors[source] || 'bg-gray-100 text-gray-800';
  };

  // Convert JobListing to Job for modal compatibility
  const convertJobListingToJob = (jobListing: JobListing) => ({
    id: jobListing.id,
    title: jobListing.title,
    company: jobListing.company,
    location: jobListing.location,
    type: (jobListing.type?.toLowerCase() as 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote') || 'full-time',
    experienceLevel: (jobListing.experience?.toLowerCase() as 'entry' | 'mid' | 'senior' | 'executive') || 'mid',
    salary: {
      min: jobListing.salary?.min || 0,
      max: jobListing.salary?.max || 0,
      currency: jobListing.salary?.currency || 'USD',
    },
    description: jobListing.description || '',
    requirements: jobListing.requirements || [],
    benefits: jobListing.benefits || [],
    postedAt: jobListing.posted || new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    applications: 0,
    views: 0,
    rating: 4.5,
    featured: false,
    urgent: false,
    remote: jobListing.remote || false,
    visaSponsorship: false,
    equity: false,
    tags: jobListing.skills || [],
    industry: jobListing.industry || 'Technology',
    url: jobListing.url,
    source: jobListing.source,
  });

  const sortedJobs = [...jobs].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.posted || '').getTime() - new Date(a.posted || '').getTime();
      case 'salary':
        const aSalary = a.salary?.min || 0;
        const bSalary = b.salary?.min || 0;
        return bSalary - aSalary;
      default:
        return 0; // Relevance sorting would be handled by the API
    }
  });

  return (
    <>
      <SEO seoData={PAGE_SEO['/jobs']} url="/jobs" />
      <div className="bg-gray-50">
        
        <main className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <section className="mb-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Find Your <span className="text-blue-600">Dream Job</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Search thousands of job listings from top companies and job boards worldwide
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="Job title, keywords, or company"
                      value={searchParams.query || ''}
                      onChange={(e) => handleSearch({ query: e.target.value })}
                      className="pl-10 h-12 text-lg"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="City, state, or remote"
                      value={searchParams.location || ''}
                      onChange={(e) => handleSearch({ location: e.target.value })}
                      className="pl-10 h-12 text-lg"
                    />
                  </div>
                </div>
                <Button 
                  onClick={loadJobs}
                  disabled={loading}
                  className="h-12 px-8 text-lg"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <Search className="h-5 w-5 mr-2" />
                  )}
                  Search Jobs
                </Button>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <Button
                variant={searchParams.remote ? "default" : "outline"}
                onClick={() => handleSearch({ remote: !searchParams.remote })}
                className="flex items-center gap-2"
              >
                <Globe className="h-4 w-4" />
                Remote Only
              </Button>
              <Button
                variant="outline"
                                      onClick={() => {
                        setSearchParams({
                          query: '',
                          location: '',
                          remote: false,
                          jobType: 'any',
                          experience: 'any',
                          industry: 'any',
                  sources: ['usajobs', 'adzuna', 'indeed', 'linkedin', 'github', 'ziprecruiter', 'rss', 'remoteok'],
                          limit: 50
                        });
                      }}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Clear Filters
              </Button>
              <Button
                variant="outline"
                onClick={testConnections}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Test APIs
              </Button>
            </div>
          </section>

          {/* Always-Visible Filters */}
          <Card className="mb-8 bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Sliders className="h-6 w-6 text-blue-600" />
                Job Search Filters
              </CardTitle>
              <CardDescription>
                Customize your search to find the perfect opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {/* Job Sources */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900">
                    Job Sources ({sources.filter(s => searchParams.sources?.includes(s.id)).length})
                  </label>
                  <div className="relative">
                    <Select
                      value=""
                      onValueChange={(value) => handleSourceToggle(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Toggle sources" />
                      </SelectTrigger>
                      <SelectContent>
                        {sources.map((source) => (
                          <SelectItem key={source.id} value={source.id}>
                            <div className="flex items-center justify-between w-full">
                              <span className="flex items-center gap-2">
                                {searchParams.sources?.includes(source.id) ? '✓ ' : '○ '}
                                {source.name}
                              </span>
                              {apiStatus[source.id] !== undefined && (
                                <span 
                                  className={`inline-block w-2 h-2 rounded-full ml-2 ${
                                    apiStatus[source.id] ? 'bg-green-500' : 'bg-red-500'
                                  }`} 
                                />
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Job Type */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900">
                    Job Type
                  </label>
                  <Select
                    value={searchParams.jobType || 'any'}
                    onValueChange={(value) => handleSearch({ jobType: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Any type" />
                    </SelectTrigger>
                                            <SelectContent>
                          <SelectItem value="any">Any type</SelectItem>
                          <SelectItem value="full-time">Full-time</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                          <SelectItem value="freelance">Freelance</SelectItem>
                        </SelectContent>
                  </Select>
                </div>

                {/* Experience Level */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900">
                    Experience
                  </label>
                  <Select
                    value={searchParams.experience || 'any'}
                    onValueChange={(value) => handleSearch({ experience: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Any level" />
                    </SelectTrigger>
                                            <SelectContent>
                          <SelectItem value="any">Any level</SelectItem>
                          <SelectItem value="entry">Entry Level</SelectItem>
                          <SelectItem value="mid">Mid Level</SelectItem>
                          <SelectItem value="senior">Senior Level</SelectItem>
                          <SelectItem value="executive">Executive</SelectItem>
                        </SelectContent>
                  </Select>
                </div>

                {/* Industry */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900">
                    Industry
                  </label>
                  <Select
                    value={searchParams.industry || 'any'}
                    onValueChange={(value) => handleSearch({ industry: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Any industry" />
                    </SelectTrigger>
                                            <SelectContent>
                          <SelectItem value="any">Any industry</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="government">Government</SelectItem>
                          <SelectItem value="consulting">Consulting</SelectItem>
                        </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Secondary Filters Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {/* Salary Range */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900">
                    Salary Range (USD)
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={searchParams.salaryMin || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleSearch({ 
                          salaryMin: value ? parseInt(value) : undefined 
                        });
                      }}
                      className="w-full"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={searchParams.salaryMax || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleSearch({ 
                          salaryMax: value ? parseInt(value) : undefined 
                        });
                      }}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Remote Work */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900">
                    Work Type
                  </label>
                  <Button
                    variant={searchParams.remote ? "default" : "outline"}
                    onClick={() => handleSearch({ remote: !searchParams.remote })}
                    className="w-full justify-start"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Remote Only
                  </Button>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-900">
                    Quick Actions
                  </label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchParams({
                          query: '',
                          location: '',
                          remote: false,
                          jobType: 'any',
                          experience: 'any',
                          industry: 'any',
                          sources: ['usajobs', 'remoteok', 'rss'],
                          limit: 50
                        });
                      }}
                      className="flex-1"
                      size="sm"
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                    <Button
                      onClick={loadJobs}
                      disabled={loading}
                      className="flex-1"
                      size="sm"
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      ) : (
                        <Search className="h-4 w-4 mr-1" />
                      )}
                      Search
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Filters Summary */}
          {(searchParams.query || searchParams.location || searchParams.jobType || searchParams.experience || searchParams.industry || searchParams.remote || (searchParams.sources && searchParams.sources.length < 3)) && (
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Active filters:</span>
                {searchParams.query && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Search className="h-3 w-3" />
                    "{searchParams.query}"
                  </Badge>
                )}
                {searchParams.location && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {searchParams.location}
                  </Badge>
                )}
                {searchParams.jobType && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    {searchParams.jobType}
                  </Badge>
                )}
                {searchParams.experience && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    {searchParams.experience} level
                  </Badge>
                )}
                {searchParams.industry && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {searchParams.industry}
                  </Badge>
                )}
                {searchParams.remote && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    Remote only
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchParams({
                      query: '',
                      location: '',
                      remote: false,
                      sources: ['usajobs', 'remoteok', 'rss'],
                      limit: 50
                    });
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear all
                </Button>
              </div>
            </div>
          )}

          {/* Results Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold text-gray-900">
                {loading ? 'Searching...' : `${jobs.length} Jobs Found`}
              </h2>
              <p className="text-gray-600">
                {searchParams.query && `Results for "${searchParams.query}"`}
                {searchParams.location && ` in ${searchParams.location}`}
              </p>
              {jobs.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {Array.from(new Set(jobs.map(job => job.source))).map(source => {
                    const count = jobs.filter(job => job.source === source).length;
                    return (
                      <Badge key={source} variant="outline" className="text-xs">
                        {source}: {count}
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="date">Date Posted</SelectItem>
                  <SelectItem value="salary">Salary</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Searching for jobs...</p>
              </div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search criteria or check different job sources.
              </p>
              <Button onClick={loadJobs} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {sortedJobs.map((job) => (
                <Card 
                  key={job.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedJob(job)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                          {job.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 text-sm text-gray-600">
                          <Building2 className="h-4 w-4" />
                          {job.company}
                        </CardDescription>
                      </div>
                      <Badge className={getSourceColor(job.source)}>
                        {job.source}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.remote ? 'Remote' : job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDate(job.posted)}
                        </div>
                      </div>
                      
                      {job.salary && (
                        <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
                          <DollarSign className="h-4 w-4" />
                          {formatSalary(job)}
                        </div>
                      )}
                      
                      {job.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {job.description.substring(0, 150)}...
                        </p>
                      )}
                      
                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {job.skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {job.skills.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{job.skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
        
        {/* Job Detail Modal */}
        {selectedJob && (
          <JobDetailModal
            job={convertJobListingToJob(selectedJob)}
            isOpen={!!selectedJob}
            onClose={() => setSelectedJob(null)}
            onApply={(job) => {
              // Handle apply logic
              window.open(job.url || '#', '_blank');
            }}
            onSave={(job) => {
              // Handle save logic
              toast({
                title: "Job Saved",
                description: "Job has been saved to your favorites.",
              });
            }}
            onShare={(job) => {
              // Handle share logic
              if (navigator.share) {
                navigator.share({
                  title: job.title,
                  text: `Check out this job: ${job.title} at ${job.company}`,
                  url: job.url || window.location.href,
                });
              }
            }}
          />
        )}
      </div>
    </>
  );
};

export default JobsPage;
