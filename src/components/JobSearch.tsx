import { useState } from "react";
import { Search, MapPin, Building2, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Mock job data
const mockJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc",
    location: "San Francisco, CA",
    salary: "$120k - $150k",
    type: "Full-time",
    posted: "2 days ago",
    description: "We're looking for a Senior Frontend Developer with React, TypeScript, and modern web technologies...",
    requirements: ["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL", "5+ years experience"],
    matchScore: 85
  },
  {
    id: 2,
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    location: "Remote",
    salary: "$100k - $130k",
    type: "Full-time",
    posted: "1 day ago",
    description: "Join our fast-growing startup as a Full Stack Engineer working on cutting-edge products...",
    requirements: ["React", "Node.js", "Python", "AWS", "MongoDB", "3+ years experience"],
    matchScore: 72
  },
  {
    id: 3,
    title: "React Developer",
    company: "Innovation Labs",
    location: "New York, NY",
    salary: "$90k - $120k",
    type: "Contract",
    posted: "3 days ago",
    description: "Looking for a skilled React Developer to build interactive user interfaces...",
    requirements: ["React", "JavaScript", "CSS", "Git", "REST APIs", "2+ years experience"],
    matchScore: 78
  }
];

interface JobSearchProps {
  onJobSelect: (job: any) => void;
}

export const JobSearch = ({ onJobSelect }: JobSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState(mockJobs);
  const { toast } = useToast();

  const handleSearch = () => {
    // Mock search functionality
    toast({
      title: "Search Complete",
      description: `Found ${jobs.length} jobs matching your criteria`,
    });
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return "bg-success text-success-foreground";
    if (score >= 60) return "bg-warning text-warning-foreground";
    return "bg-destructive text-destructive-foreground";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Job Search
          </CardTitle>
          <CardDescription>
            Find jobs that match your skills and experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Job title, keywords, or company"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSearch}>
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {jobs.map((job) => (
          <Card key={job.id} className="cursor-pointer hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-foreground">{job.title}</h3>
                    <Badge className={getMatchColor(job.matchScore)}>
                      {job.matchScore}% Match
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      <span>{job.company}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{job.posted}</span>
                    </div>
                  </div>
                  <p className="text-foreground mb-3">{job.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.requirements.map((req, index) => (
                      <Badge key={index} variant="secondary">{req}</Badge>
                    ))}
                  </div>
                </div>
                <div className="ml-4">
                  <Button 
                    onClick={() => onJobSelect(job)}
                    variant="outline"
                  >
                    Analyze Match
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};