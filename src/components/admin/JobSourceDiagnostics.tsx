import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink, 
  Database,
  Globe,
  Building2,
  Users,
  Clock,
  Activity,
  Zap,
  Shield,
  Settings,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Info
} from 'lucide-react';
import { usajobsAPI, testUSAJobsConnection } from '@/lib/usajobs';

interface JobSource {
  id: string;
  name: string;
  description: string;
  apiEndpoint: string;
  status: 'active' | 'inactive' | 'error' | 'testing';
  lastChecked: string;
  responseTime: number;
  successRate: number;
  totalJobs: number;
  dailyLimit: number;
  usedToday: number;
  apiKey: string;
  healthScore: number;
  errors: string[];
}

const JobSourceDiagnostics = () => {
  const [sources, setSources] = useState<JobSource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Initialize job sources with USAJobs API key
  useEffect(() => {
    const initialSources: JobSource[] = [
      {
        id: 'usajobs',
        name: 'USAJobs.gov',
        description: 'Federal government job listings',
        apiEndpoint: 'https://data.usajobs.gov/api/search',
        status: 'inactive',
        lastChecked: new Date().toISOString(),
        responseTime: 0,
        successRate: 0,
        totalJobs: 0,
        dailyLimit: 1000,
        usedToday: 0,
        apiKey: '4Nx2nq6xUYvNNm8VZFm8rPR3M7/8j336/vLgujfroSU=',
        healthScore: 0,
        errors: []
      },
      {
        id: 'indeed',
        name: 'Indeed API',
        description: 'Job search engine aggregator',
        apiEndpoint: 'https://indeed.com/api',
        status: 'inactive',
        lastChecked: new Date().toISOString(),
        responseTime: 0,
        successRate: 0,
        totalJobs: 0,
        dailyLimit: 500,
        usedToday: 0,
        apiKey: 'your-indeed-api-key',
        healthScore: 0,
        errors: []
      },
      {
        id: 'linkedin',
        name: 'LinkedIn Jobs',
        description: 'Professional network job postings',
        apiEndpoint: 'https://api.linkedin.com/v2',
        status: 'inactive',
        lastChecked: new Date().toISOString(),
        responseTime: 0,
        successRate: 0,
        totalJobs: 0,
        dailyLimit: 100,
        usedToday: 0,
        apiKey: 'your-linkedin-api-key',
        healthScore: 0,
        errors: []
      },
      {
        id: 'glassdoor',
        name: 'Glassdoor',
        description: 'Company reviews and job listings',
        apiEndpoint: 'https://api.glassdoor.com/api/api.htm',
        status: 'inactive',
        lastChecked: new Date().toISOString(),
        responseTime: 0,
        successRate: 0,
        totalJobs: 0,
        dailyLimit: 200,
        usedToday: 0,
        apiKey: 'your-glassdoor-api-key',
        healthScore: 0,
        errors: []
      },
      {
        id: 'ziprecruiter',
        name: 'ZipRecruiter',
        description: 'Job board and recruitment platform',
        apiEndpoint: 'https://api.ziprecruiter.com',
        status: 'inactive',
        lastChecked: new Date().toISOString(),
        responseTime: 0,
        successRate: 0,
        totalJobs: 0,
        dailyLimit: 300,
        usedToday: 0,
        apiKey: 'your-ziprecruiter-api-key',
        healthScore: 0,
        errors: []
      }
    ];
    setSources(initialSources);
  }, []);

  const testUSAJobsAPI = async () => {
    const usajobsSource = sources.find(s => s.id === 'usajobs');
    if (!usajobsSource) return;

    try {
      // Update status to testing
      setSources(prev => prev.map(source => 
        source.id === 'usajobs' 
          ? { ...source, status: 'testing' as const }
          : source
      ));

      const result = await testUSAJobsConnection();
      
      if (result.success) {
        // Get actual job count
        const searchResult = await usajobsAPI.searchJobs({ ResultsPerPage: 1 });
        const totalJobs = searchResult.SearchResult?.SearchResultCountAll || 0;
        const healthScore = Math.min(100, Math.max(0, 100 - (result.responseTime / 100)));
        
        setSources(prev => prev.map(source => 
          source.id === 'usajobs' 
            ? {
                ...source,
                status: 'active' as const,
                lastChecked: new Date().toISOString(),
                responseTime: result.responseTime,
                successRate: 100,
                totalJobs,
                healthScore,
                errors: []
              }
            : source
        ));
      } else {
        throw new Error(result.error || 'Connection failed');
      }
    } catch (error) {
      setSources(prev => prev.map(source => 
        source.id === 'usajobs' 
          ? {
              ...source,
              status: 'error' as const,
              lastChecked: new Date().toISOString(),
              healthScore: 0,
              errors: [error instanceof Error ? error.message : 'Unknown error']
            }
          : source
      ));
    }
  };

  const testAllSources = async () => {
    setIsLoading(true);
    setLastRefresh(new Date());
    
    // Test USAJobs first
    await testUSAJobsAPI();
    
    // Simulate testing other sources
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'testing':
        return <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'testing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const totalJobs = sources.reduce((sum, source) => sum + source.totalJobs, 0);
  const activeSources = sources.filter(s => s.status === 'active').length;
  const averageHealthScore = sources.length > 0 
    ? Math.round(sources.reduce((sum, source) => sum + source.healthScore, 0) / sources.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Job Source Diagnostics</h2>
          <p className="text-gray-600">Monitor and manage all job data sources and APIs</p>
        </div>
        <Button 
          onClick={testAllSources} 
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Testing...' : 'Test All Sources'}
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{totalJobs.toLocaleString()}</p>
              </div>
              <Database className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Sources</p>
                <p className="text-2xl font-bold text-gray-900">{activeSources}/{sources.length}</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Health Score</p>
                <p className={`text-2xl font-bold ${getHealthScoreColor(averageHealthScore)}`}>
                  {averageHealthScore}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Last Updated</p>
                <p className="text-sm text-gray-900">
                  {lastRefresh.toLocaleTimeString()}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Sources List */}
      <div className="grid gap-4">
        {sources.map((source) => (
          <Card key={source.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(source.status)}
                  <div>
                    <CardTitle className="text-lg">{source.name}</CardTitle>
                    <CardDescription>{source.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(source.status)}>
                    {source.status.toUpperCase()}
                  </Badge>
                  {source.id === 'usajobs' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={testUSAJobsAPI}
                      disabled={isLoading}
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Test
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Health Score */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Health Score</span>
                    <span className={`text-sm font-bold ${getHealthScoreColor(source.healthScore)}`}>
                      {source.healthScore}%
                    </span>
                  </div>
                  <Progress value={source.healthScore} className="h-2" />
                </div>

                {/* Response Time */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">Response Time</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {source.responseTime}ms
                  </p>
                </div>

                {/* Total Jobs */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Database className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">Total Jobs</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {source.totalJobs.toLocaleString()}
                  </p>
                </div>

                {/* API Usage */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart3 className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">API Usage</span>
                  </div>
                  <p className="text-sm text-gray-900">
                    {source.usedToday}/{source.dailyLimit} today
                  </p>
                  <Progress 
                    value={(source.usedToday / source.dailyLimit) * 100} 
                    className="h-1 mt-1" 
                  />
                </div>
              </div>

              {/* API Endpoint */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">API Endpoint</span>
                </div>
                <code className="text-sm text-gray-800 break-all">
                  {source.apiEndpoint}
                </code>
              </div>

              {/* Errors */}
              {source.errors.length > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">Errors</span>
                  </div>
                  <ul className="text-sm text-red-700 space-y-1">
                    {source.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Last Checked */}
              <div className="mt-4 text-xs text-gray-500">
                Last checked: {new Date(source.lastChecked).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* USAJobs API Configuration */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Shield className="h-5 w-5" />
            USAJobs API Configuration
          </CardTitle>
          <CardDescription className="text-blue-700">
            Your USAJobs API key is configured and ready to use
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 bg-white rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Settings className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">API Key</span>
              </div>
              <code className="text-sm text-blue-900 break-all">
                {sources.find(s => s.id === 'usajobs')?.apiKey || 'Not configured'}
              </code>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <Info className="h-4 w-4" />
              <span>
                This API key allows you to access federal government job listings from USAJobs.gov
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobSourceDiagnostics;
