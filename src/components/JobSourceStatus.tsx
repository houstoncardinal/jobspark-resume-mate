import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, RefreshCw, ExternalLink, Info } from 'lucide-react';
import { testAPIConnections, getAvailableSources } from '@/lib/job-aggregator';

interface JobSourceStatusProps {
  onSourceToggle?: (sourceId: string, enabled: boolean) => void;
  enabledSources?: string[];
}

export const JobSourceStatus: React.FC<JobSourceStatusProps> = ({
  onSourceToggle,
  enabledSources = []
}) => {
  const [apiStatus, setApiStatus] = useState<Record<string, boolean>>({});
  const [testing, setTesting] = useState(false);
  const [sources] = useState(getAvailableSources());

  const testConnections = async () => {
    setTesting(true);
    try {
      const status = await testAPIConnections();
      setApiStatus(status);
    } catch (error) {
      console.error('Error testing API connections:', error);
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    testConnections();
  }, []);

  const getStatusIcon = (sourceId: string) => {
    const status = apiStatus[sourceId];
    if (status === undefined) return <Clock className="h-4 w-4 text-gray-400" />;
    if (status) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusText = (sourceId: string) => {
    const status = apiStatus[sourceId];
    if (status === undefined) return 'Not tested';
    if (status) return 'Working';
    return 'Error';
  };

  const getStatusColor = (sourceId: string) => {
    const status = apiStatus[sourceId];
    if (status === undefined) return 'bg-gray-100 text-gray-800';
    if (status) return 'bg-green-100 text-green-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Job Source Status
            </CardTitle>
            <CardDescription>
              Monitor the status of all job search APIs and sources
            </CardDescription>
          </div>
          <Button
            onClick={testConnections}
            disabled={testing}
            variant="outline"
            size="sm"
          >
            {testing ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Test All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sources.map((source) => (
            <div
              key={source.id}
              className={`p-4 border rounded-lg ${
                enabledSources.includes(source.id) ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(source.id)}
                  <h3 className="font-medium text-gray-900">{source.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(source.id)}>
                    {getStatusText(source.id)}
                  </Badge>
                  {!source.free && (
                    <Badge variant="outline" className="text-xs">
                      API Key Required
                    </Badge>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{source.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={source.id}
                    checked={enabledSources.includes(source.id)}
                    onChange={(e) => onSourceToggle?.(source.id, e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor={source.id} className="text-sm text-gray-700">
                    Enable
                  </label>
                </div>
                
                {source.id === 'usajobs' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open('https://www.usajobs.gov', '_blank')}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">API Key Setup Required</p>
              <p>
                To use paid job sources like Indeed, LinkedIn, and ZipRecruiter, 
                you'll need to add API keys to your environment variables. 
                Free sources like USAJobs and RemoteOK work immediately.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
