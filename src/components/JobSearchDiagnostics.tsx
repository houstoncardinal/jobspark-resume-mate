import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";

interface SourceTest {
  name: string;
  status: 'testing' | 'success' | 'error' | 'not_tested';
  error?: string;
  jobCount?: number;
}

export const JobSearchDiagnostics = () => {
  const [tests, setTests] = useState<SourceTest[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const testSources = async () => {
    setIsRunning(true);
    setTests([]);
    
    const sources = [
      { name: 'remotive', url: 'https://remotive.com/api/remote-jobs' },
      { name: 'arbeitnow', url: 'https://arbeitnow.com/api/job-board-api' },
      { name: 'remoteok', url: 'https://remoteok.com/api' },
    ];

    const results: SourceTest[] = sources.map(s => ({ name: s.name, status: 'not_tested' }));
    setTests([...results]);

    for (let i = 0; i < sources.length; i++) {
      const source = sources[i];
      results[i].status = 'testing';
      setTests([...results]);

      try {
        const response = await fetch(source.url, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        });
        
        if (response.ok) {
          const data = await response.json();
          results[i] = {
            name: source.name,
            status: 'success',
            jobCount: Array.isArray(data) ? data.length : (data.jobs?.length || data.data?.length || 0)
          };
        } else {
          results[i] = {
            name: source.name,
            status: 'error',
            error: `HTTP ${response.status}: ${response.statusText}`
          };
        }
      } catch (error: any) {
        results[i] = {
          name: source.name,
          status: 'error',
          error: error.message || 'Network error'
        };
      }
      
      setTests([...results]);
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between tests
    }
    
    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'testing': return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'testing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Job Source Diagnostics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Test which job sources are working and identify connection issues.
        </p>
        
        <Button onClick={testSources} disabled={isRunning} className="w-full">
          {isRunning ? "Testing Sources..." : "Run Diagnostics"}
        </Button>

        {tests.length > 0 && (
          <div className="space-y-2">
            {tests.map((test, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(test.status)}
                  <span className="font-medium capitalize">{test.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(test.status)}>
                    {test.status === 'testing' ? 'Testing...' :
                     test.status === 'success' ? 'Working' :
                     test.status === 'error' ? 'Failed' : 'Not tested'}
                  </Badge>
                  {test.jobCount !== undefined && (
                    <span className="text-sm text-muted-foreground">
                      {test.jobCount} jobs
                    </span>
                  )}
                </div>
                {test.error && (
                  <div className="w-full mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                    {test.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tests.some(t => t.status === 'error') && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">Troubleshooting Tips:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• CORS errors: Some sources block browser requests. This is normal for some APIs.</li>
              <li>• Try using only working sources in your search.</li>
              <li>• Check your internet connection.</li>
              <li>• Some sources may be temporarily down.</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
