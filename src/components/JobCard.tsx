import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Building2, ExternalLink } from 'lucide-react';
import { JobListing } from '@/lib/job-aggregator';

interface JobCardProps {
  job: JobListing;
  onClick: (job: JobListing) => void;
}

export const JobCard = React.memo<JobCardProps>(({ job, onClick }) => {
  const handleClick = React.useCallback(() => {
    onClick(job);
  }, [job, onClick]);

  const formatSalary = React.useMemo(() => {
    if (!job.salary) return null;
    const { min, max, currency = 'USD', period = 'year' } = job.salary;
    if (min && max) {
      return `$${min.toLocaleString()} - $${max.toLocaleString()} ${currency}/${period}`;
    } else if (min) {
      return `$${min.toLocaleString()}+ ${currency}/${period}`;
    } else if (max) {
      return `Up to $${max.toLocaleString()} ${currency}/${period}`;
    }
    return null;
  }, [job.salary]);

  const timeAgo = React.useMemo(() => {
    if (!job.posted) return 'Recently posted';
    const date = new Date(job.posted);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  }, [job.posted]);

  return (
    <Card 
      className="hover:shadow-lg transition-all duration-200 cursor-pointer border hover:border-blue-200 group"
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                {job.title}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                <Building2 className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{job.company}</span>
              </div>
            </div>
            <Badge variant="outline" className="text-xs flex-shrink-0">
              {job.source}
            </Badge>
          </div>

          {/* Location and Type */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{job.location}</span>
              {job.remote && (
                <Badge variant="secondary" className="text-xs ml-2">
                  Remote
                </Badge>
              )}
            </div>
          </div>

          {/* Job Type and Salary */}
          <div className="flex items-center gap-2 flex-wrap">
            {job.type && (
              <Badge variant="outline" className="text-xs">
                {job.type}
              </Badge>
            )}
            {job.experience && (
              <Badge variant="outline" className="text-xs">
                {job.experience}
              </Badge>
            )}
            {formatSalary && (
              <Badge variant="secondary" className="text-xs">
                {formatSalary}
              </Badge>
            )}
          </div>

          {/* Description */}
          {job.description && (
            <p className="text-sm text-gray-600 line-clamp-3">
              {job.description.slice(0, 150)}...
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>{timeAgo}</span>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-xs">
                View Details
              </Button>
              {job.url && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(job.url, '_blank');
                  }}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

JobCard.displayName = 'JobCard';
