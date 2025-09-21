/** @jsxImportSource react */
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
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
import { searchAllJobs, getAvailableSources, testAPIConnections, JobListing, JobSearchParams, getCurrentLocation } from '@/lib/job-aggregator';
import { saveJob, applyToJob, logJobSearch, getJobApplicationStats } from '@/lib/job-database';
import { useAuth } from '@/contexts/AuthContext';
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
    query: '',
    location: '',
    remote: false,
    sources: ['usajobs', 'remoteok', 'adzuna', 'jooble', 'github', 'rss'],
    limit: 50
  });
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'salary'>('relevance');
  const [apiStatus, setApiStatus] = useState<Record<string, boolean>>({});
  const [sources, setSources] = useState(getAvailableSources());
  const [userLocation, setUserLocation] = useState<{city: string, state: string} | null>(null);
  const [filters, setFilters] = useState({
    salaryMin: 0,
    salaryMax: 200000,
    jobType: '',
    experience: '',
    industry: '',
    remoteOnly: false
  });
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [applicationStats, setApplicationStats] = useState({
    total: 0,
    applied: 0,
    interviews: 0,
    offers: 0,
    rejections: 0
  });
  const { user } = useAuth();
  const { toast } = useToast();

  // Load jobs on component mount and when search params change
  useEffect(() => {
    loadJobs();
  }, [searchParams]);

  // Test API connections on mount
  useEffect(() => {
    testConnections();
  }, []);

  // Get user location on mount
  useEffect(() => {
    getLocation();
  }, []);

  // Load user data when authenticated
  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const getLocation = async () => {
    try {
      const location = await getCurrentLocation();
      if (location) {
        setUserLocation({ city: location.city, state: location.state });
        setSearchParams(prev => ({
          ...prev,
          location: `${location.city}, ${location.state}`
        }));
        toast({
          title: "Location detected",
          description: `Showing jobs near ${location.city}, ${location.state}`,
        });
      }
    } catch (error) {
      console.error('Location error:', error);
    }
  };

  const loadUserData = async () => {
    if (!user) return;
    
    try {
      const stats = await getJobApplicationStats(user.id);
      setApplicationStats(stats);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const testConnections = async () => {
    const status = await testAPIConnections();
    setApiStatus(status);
  };

  const loadJobs = async () => {
    setLoading(true);
    try {
      const results = await searchAllJobs(searchParams);
      setJobs(results);
      
      // Log search analytics
      if (user) {
        await logJobSearch(
          user.id,
          searchParams.query || '',
          searchParams.location || '',
          searchParams.sources || [],
          results.length
        );
      }
      
      if (results.length === 0) {
        toast({
          title: "No jobs found",
          description: "Try adjusting your search criteria or check if API keys are configured.",
          variant: "destructive",
        });
      } else {
        toast({
          title: `Found ${results.length} jobs`,
          description: `Search completed successfully from ${[...new Set(results.map(job => job.source))].join(', ')}.`,
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
    setSearchParams(prev => ({ ...prev, ...newParams }));
  };

  const handleSourceToggle = (sourceId: string) => {
    setSearchParams(prev => ({
      ...prev,
      sources: prev.sources?.includes(sourceId)
        ? prev.sources.filter(s => s !== sourceId)
        : [...(prev.sources || []), sourceId]
    }));
  };

  const handleFilterChange = (filterName: string, value: any) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const applyFilters = () => {
    setSearchParams(prev => ({
      ...prev,
      salaryMin: filters.salaryMin,
      salaryMax: filters.salaryMax,
      jobType: filters.jobType,
      experience: filters.experience,
      industry: filters.industry,
      remote: filters.remoteOnly
    }));
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      salaryMin: 0,
      salaryMax: 200000,
      jobType: '',
      experience: '',
      industry: '',
      remoteOnly: false
    });
    setSearchParams(prev => ({
      ...prev,
      salaryMin: undefined,
      salaryMax: undefined,
      jobType: undefined,
      experience: undefined,
      industry: undefined,
      remote: false
    }));
  };

  const handleSaveJob = async (job: JobListing) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to save jobs.",
        variant: "destructive",
      });
      return;
    }

    try {
      const success = await saveJob(user.id, job);
      if (success) {
        setSavedJobs(prev => new Set([...prev, job.id]));
        toast({
          title: "Job saved",
          description: "Job has been saved to your applications.",
        });
      } else {
        toast({
          title: "Error saving job",
          description: "There was an error saving the job. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error saving job:', error);
      toast({
        title: "Error saving job",
        description: "There was an error saving the job. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleApplyToJob = async (job: JobListing) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to apply for jobs.",
        variant: "destructive",
      });
      return;
    }

    try {
      const success = await applyToJob(user.id, job);
      if (success) {
        setApplicationStats(prev => ({ ...prev, applied: prev.applied + 1, total: prev.total + 1 }));
        toast({
          title: "Application submitted",
          description: "Your application has been submitted successfully.",
        });
      } else {
        toast({
          title: "Error applying",
          description: "There was an error submitting your application. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error applying to job:', error);
      toast({
        title: "Error applying",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    }
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
      'Mock Data': 'bg-yellow-100 text-yellow-800',
    };
    return colors[source] || 'bg-gray-100 text-gray-800';
  };

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
      <SEO {...PAGE_SEO.jobs} />
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          {/* Search Header */}
          <div className="mb-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Find Your Dream Job
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Discover opportunities from top companies worldwide
              </p>
              {userLocation && (
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  <MapPin className="w-4 h-4 mr-2" />
                  Showing jobs near {userLocation.city}, {userLocation.state}
                </div>
              )}
              {user && applicationStats.total > 0 && (
                <div className="mt-4 flex justify-center gap-4 text-sm text-gray-600">
                  <span>Applications: {applicationStats.applied}</span>
                  <span>Interviews: {applicationStats.interviews}</span>
                  <span>Offers: {applicationStats.offers}</span>
                </div>
              )}
            </div>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto mb-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Job title, keywords, or company"
                      value={searchParams.query}
                      onChange={(e) => handleSearch({ query: e.target.value })}
                      className="pl-10 h-12 text-lg"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="City, state, or remote"
                      value={searchParams.location}
                      onChange={(e) => handleSearch({ location: e.target.value })}
                      className="pl-10 h-12 text-lg"
                    />
                  </div>
                </div>
                <Button 
                  onClick={loadJobs} 
                  disabled={loading}
                  className="h-12 px-8"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                  Search
                </Button>
              </div>
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
                
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="date">Date Posted</SelectItem>
                    <SelectItem value="salary">Salary</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
                <Button variant="outline" size="sm" onClick={testConnections}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sliders className="w-5 h-5" />
                    Advanced Filters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Salary Range */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Salary Range
                      </label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            ${filters.salaryMin.toLocaleString()} - ${filters.salaryMax.toLocaleString()}
                          </span>
                        </div>
                        <Slider
                          value={[filters.salaryMin, filters.salaryMax]}
                          onValueChange={([min, max]) => handleFilterChange('salaryMin', min) || handleFilterChange('salaryMax', max)}
                          max={200000}
                          step={5000}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Job Type */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Job Type
                      </label>
                      <Select value={filters.jobType} onValueChange={(value) => handleFilterChange('jobType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Types</SelectItem>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Freelance">Freelance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Experience Level */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Experience Level
                      </label>
                      <Select value={filters.experience} onValueChange={(value) => handleFilterChange('experience', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Levels</SelectItem>
                          <SelectItem value="Entry">Entry Level</SelectItem>
                          <SelectItem value="Mid-level">Mid Level</SelectItem>
                          <SelectItem value="Senior">Senior Level</SelectItem>
                          <SelectItem value="Executive">Executive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Industry */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Industry
                      </label>
                      <Select value={filters.industry} onValueChange={(value) => handleFilterChange('industry', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Industries</SelectItem>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Design">Design</SelectItem>
                          <SelectItem value="Data Science">Data Science</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remote-only"
                        checked={filters.remoteOnly}
                        onCheckedChange={(checked) => handleFilterChange('remoteOnly', checked)}
                      />
                      <label htmlFor="remote-only" className="text-sm font-medium text-gray-700">
                        Remote only
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 mt-6">
                    <Button variant="outline" onClick={() => setShowFilters(false)}>
                      Cancel
                    </Button>
                    <Button onClick={applyFilters}>
                      Apply Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Job Sources Status */}
            <div className="flex flex-wrap gap-2 mb-6">
              {sources.map((source) => (
                <div key={source.id} className="flex items-center gap-2">
                  <Checkbox
                    id={source.id}
                    checked={searchParams.sources?.includes(source.id)}
                    onCheckedChange={() => handleSourceToggle(source.id)}
                  />
                  <label htmlFor={source.id} className="flex items-center gap-2 text-sm">
                    <span className={apiStatus[source.id] ? 'text-green-600' : 'text-red-600'}>
                      {apiStatus[source.id] ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    </span>
                    {source.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                {loading ? 'Searching...' : `${sortedJobs.length} Jobs Found`}
              </h2>
              <div className="text-sm text-gray-500">
                Showing results from {[...new Set(sortedJobs.map(job => job.source))].join(', ')}
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Searching for jobs...</span>
              </div>
            ) : sortedJobs.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search criteria or check different job sources.
                  </p>
                  <Button onClick={loadJobs} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {sortedJobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedJob(job)}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{job.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mb-2">
                            <Building2 className="w-4 h-4" />
                            {job.company}
                          </CardDescription>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatDate(job.posted)}
                            </div>
                            {job.salary && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                {formatSalary(job)}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={getSourceColor(job.source)}>
                            {job.source}
                          </Badge>
                          {job.remote && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              Remote
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                        {job.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveJob(job);
                            }}
                          >
                            <Heart className={`w-4 h-4 mr-1 ${savedJobs.has(job.id) ? 'fill-red-500 text-red-500' : ''}`} />
                            {savedJobs.has(job.id) ? 'Saved' : 'Save'}
                          </Button>
                          <Button size="sm" variant="outline">
                            <Share2 className="w-4 h-4 mr-1" />
                            Share
                          </Button>
                        </div>
                        <Button 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApplyToJob(job);
                          }}
                        >
                          Apply Now
                          <ExternalLink className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        <Footer />

        {/* Job Detail Modal */}
        {selectedJob && (
          <JobDetailModal
            job={selectedJob}
            isOpen={!!selectedJob}
            onClose={() => setSelectedJob(null)}
          />
        )}
      </div>
    </>
  );
};

export default JobsPage;
