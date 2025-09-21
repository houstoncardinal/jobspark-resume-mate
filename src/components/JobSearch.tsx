import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Briefcase, Clock, DollarSign, Building2, Star, Filter, SortAsc, Grid, List, Heart, Share2, ExternalLink, Globe, Users, Calendar, Bookmark, Eye, ArrowRight, ChevronDown, X, Plus, Minus, Check, AlertCircle, Info, Zap, Target, TrendingUp, Award, Shield, Sparkles, Crown, Diamond, Flame, Rocket, Star as StarIcon, CheckCircle, AlertTriangle, RefreshCw, Download, Upload, Settings, Bell, User, LogOut, Menu, X as XIcon } from 'lucide-react';
import { searchAllJobs, getAvailableSources, testAPIConnections } from '@/lib/job-aggregator';
import { LocationAutocomplete } from '@/components/LocationAutocomplete';
import { useToast } from '@/hooks/use-toast';

interface JobSearchProps {
  onJobSelect?: (job: any) => void;
  selectedJob?: any;
}

const JobSearch: React.FC<JobSearchProps> = ({ onJobSelect, selectedJob }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [apiStatus, setApiStatus] = useState<Record<string, boolean>>({});
  const [enabledSources, setEnabledSources] = useState<string[]>([
    'usajobs', 'adzuna', 'indeed', 'linkedin', 'github', 'ziprecruiter', 'rss', 'remoteok'
  ]);
  const { toast } = useToast();

  // Test API connections and load initial jobs
  useEffect(() => {
    testAPIConnections().then(status => {
      setApiStatus(status);
      console.log('🔍 API Status Check:', status);
    });
    handleSearch();
  }, []);

  // Load initial jobs automatically
  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    const startTime = Date.now();
    
    try {
      console.log('🚀 AI-Enhanced Job Search Started');
      console.log('📊 Enabled Sources:', enabledSources);
      console.log('🔍 Search Query:', searchQuery || 'all jobs');
      console.log('📍 Location:', location || 'anywhere');
      
      // Use AI-enhanced job search edge function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-job-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          query: searchQuery || '',
          location: location || '',
          sources: enabledSources,
          limit: 50,
          aiEnhanced: true,
          userProfile: {
            skills: ['JavaScript', 'React', 'Node.js'], // Could be from user profile
            experience: 'mid'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setJobs(data.jobs);
        
        const loadTime = Date.now() - startTime;
        
        // Group results by source for detailed analytics
        const bySource = data.jobs.reduce((acc: Record<string, number>, job: any) => {
          const source = job.source || 'unknown';
          acc[source] = (acc[source] || 0) + 1;
          return acc;
        }, {});
        
        console.log('✅ AI Job Search Results:');
        console.log(`📊 Total Jobs Found: ${data.jobs.length}`);
        console.log('🔗 Jobs by Source:', bySource);
        console.log(`⚡ Load Time: ${loadTime}ms`);
        console.log(`🤖 AI Enhanced: ${data.aiEnhanced}`);
        
        if (data.jobs.length === 0) {
          toast({
            title: "No jobs found",
            description: "Try adjusting your search criteria or checking API connections.",
            variant: "destructive"
          });
        } else {
          const sourceCount = Object.keys(bySource).length;
          toast({
            title: `Found ${data.jobs.length} jobs with AI! 🤖`,
            description: `From ${sourceCount} API sources in ${loadTime}ms`,
          });
        }
      } else {
        throw new Error(data.error || 'Unknown error');
      }
      
    } catch (error) {
      console.error('❌ Job search error:', error);
      toast({
        title: "Search failed",
        description: "Error fetching jobs from APIs. Please try again.",
        variant: "destructive"
      });
      
      // Fallback to local job aggregator
      try {
        const fallbackResults = await searchAllJobs({
          query: searchQuery || '',
          location: location || '',
          limit: 50,
          sources: enabledSources
        });
        setJobs(fallbackResults);
      } catch (fallbackError) {
        console.error('Fallback search failed:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleJobClick = (job: any) => {
    if (onJobSelect) {
      onJobSelect(job);
    }
  };

  const toggleSource = (sourceId: string) => {
    setEnabledSources(prev => 
      prev.includes(sourceId) 
        ? prev.filter(s => s !== sourceId)
        : [...prev, sourceId]
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Multi-API Job Search
          </CardTitle>
          <CardDescription>
            Search across {enabledSources.length} job sources simultaneously
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Inputs */}
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Job title or keywords"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <LocationAutocomplete
              value={location}
              onChange={setLocation}
              placeholder="City, state, or remote"
              className="w-48"
            />
            <Button onClick={handleSearch} disabled={loading} className="bg-primary hover:bg-primary/90">
              <Search className="h-4 w-4 mr-2" />
              {loading ? 'Searching...' : 'Search All APIs'}
            </Button>
          </div>

          {/* API Status Indicators */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">API Status:</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  testAPIConnections().then(status => {
                    setApiStatus(status);
                    console.log('🔍 API Status Check:', status);
                  });
                }}
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                Test
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {getAvailableSources().map(source => {
                const isEnabled = enabledSources.includes(source.id);
                const isActive = apiStatus[source.id] ?? false;
                return (
                  <Badge 
                    key={source.id} 
                    variant={isActive && isEnabled ? "default" : "secondary"}
                    className={`cursor-pointer transition-colors ${
                      isActive && isEnabled ? "bg-green-500 hover:bg-green-600" : 
                      isEnabled ? "bg-blue-500 hover:bg-blue-600" : 
                      "bg-gray-400 hover:bg-gray-500"
                    }`}
                    onClick={() => toggleSource(source.id)}
                  >
                    {source.name} 
                    {isActive ? " ✓" : " ✗"}
                    {!isEnabled && " (disabled)"}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Source Selection */}
          <div className="text-xs text-muted-foreground">
            Click API badges to enable/disable sources. {enabledSources.length} of {getAvailableSources().length} sources enabled.
          </div>
        </CardContent>
      </Card>

      {/* Job Results */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">
              Showing {jobs.length} jobs from {enabledSources.length} sources
            </p>
            {jobs.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Sources: {Object.keys(jobs.reduce((acc: Record<string, number>, job) => {
                  const source = job.source || 'unknown';
                  acc[source] = (acc[source] || 0) + 1;
                  return acc;
                }, {})).join(', ')}
              </p>
            )}
          </div>
        </div>
        
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Searching across {enabledSources.length} APIs...</span>
            </div>
          </div>
        )}
        
        {jobs.length === 0 && !loading && (
          <div className="text-center py-8 text-muted-foreground">
            <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">No jobs found</p>
            <p className="text-sm">Click "Search All APIs" to load jobs from all enabled sources</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={handleSearch}
            >
              Search Now
            </Button>
          </div>
        )}
        
        {jobs.map((job, index) => (
          <Card 
            key={job.id || `${job.title}-${index}`} 
            className={`cursor-pointer transition-all hover:shadow-md ${selectedJob?.id === job.id ? 'ring-2 ring-primary' : ''}`} 
            onClick={() => handleJobClick(job)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      {job.company}
                    </span>
                    {job.source && (
                      <Badge variant="outline" className="text-xs">
                        {job.source.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={(e) => {e.stopPropagation();}}>
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={(e) => {e.stopPropagation();}}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                  {job.url && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      asChild
                      onClick={(e) => {e.stopPropagation();}}
                    >
                      <a href={job.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {job.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {job.location || 'Not specified'}
                </span>
                {job.type && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {job.type}
                  </span>
                )}
                {job.salary && (
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {job.salary}
                  </span>
                )}
                {job.posted && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {job.posted}
                  </span>
                )}
              </div>
              {job.skills && job.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {job.skills.slice(0, 5).map((skill: string, skillIndex: number) => (
                    <Badge key={skillIndex} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {job.skills.length > 5 && (
                    <Badge variant="secondary" className="text-xs">
                      +{job.skills.length - 5} more
                    </Badge>
                  )}
                </div>
              )}
              {job.tags && job.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {job.tags.slice(0, 5).map((tag: string, tagIndex: number) => (
                    <Badge key={tagIndex} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {job.tags.length > 5 && (
                    <Badge variant="secondary" className="text-xs">
                      +{job.tags.length - 5} more
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default JobSearch;