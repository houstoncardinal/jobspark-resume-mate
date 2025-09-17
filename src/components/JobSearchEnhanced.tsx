import { useState } from "react";
import { Search, MapPin, Building2, Clock, DollarSign, ExternalLink, Globe2, Filter, Crosshair, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { searchJobsEnhanced, type NormalizedJob, type RegionFilter, getAllAvailableSources } from "@/lib/jobs-enhanced";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { JobDetails } from "@/components/JobDetails";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Alert, AlertDescription } from "@/components/ui/alert";

const REGION_META: Record<RegionFilter, { label: string; flag: string }> = {
  "any": { label: "Any region", flag: "🌍" },
  "north-america": { label: "North America", flag: "🇺🇸" },
  "south-america": { label: "South America", flag: "🇧🇷" },
  "europe": { label: "Europe", flag: "🇪🇺" },
  "asia": { label: "Asia", flag: "🇯🇵" },
  "africa": { label: "Africa", flag: "🇿🇦" },
  "oceania": { label: "Oceania", flag: "🇦🇺" },
  "middle-east": { label: "Middle East", flag: "��🇪" },
};

const mapCountryToRegion = (country: string): RegionFilter => {
  const c = country.toLowerCase();
  if (/usa|united states|canada|mexico/.test(c)) return "north-america";
  if (/brazil|argentina|chile|peru|colombia|uruguay/.test(c)) return "south-america";
  if (/uk|united kingdom|england|germany|france|spain|italy|netherlands|poland|portugal|sweden|norway|denmark|ireland|switzerland|austria|belgium|romania|czech|greece|finland|hungary|bulgaria|croatia|serbia/.test(c)) return "europe";
  if (/india|china|japan|singapore|hong kong|korea|vietnam|philippines|indonesia|malaysia|thailand|pakistan|bangladesh|sri lanka|taiwan/.test(c)) return "asia";
  if (/nigeria|south africa|egypt|kenya|morocco|ghana|ethiopia|tunisia|algeria/.test(c)) return "africa";
  if (/australia|new zealand/.test(c)) return "oceania";
  if (/uae|dubai|saudi|israel|turkey|qatar|jordan|lebanon|kuwait|oman|bahrain/.test(c)) return "middle-east";
  return "any";
};

interface JobSearchProps {
  onJobSelect: (job: any) => void;
  selectedJob?: any;
}

export const JobSearchEnhanced = ({ onJobSelect, selectedJob }: JobSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [region, setRegion] = useState<RegionFilter>("any");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [jobs, setJobs] = useState<NormalizedJob[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsJob, setDetailsJob] = useState<NormalizedJob | null>(null);
  const [page, setPage] = useState(1);
  const [sourceStats, setSourceStats] = useState<Record<string, { count: number; error?: string }>>({});
  const PAGE_SIZE = 50;
  const { toast } = useToast();

  const [useGeo, setUseGeo] = useState(false);
  const [geoLabel, setGeoLabel] = useState<string>("");
  const [geoLocationParam, setGeoLocationParam] = useState<string>("");

  const availableSources = getAllAvailableSources();
  const [selectedSources, setSelectedSources] = useState<string[]>(
    availableSources.filter(s => s.free).map(s => s.id)
  );
  const [perSourceLimit, setPerSourceLimit] = useState<number>(30);

  const [progress, setProgress] = useState<{ completed: number; total: number; last?: { source: string; count: number; error?: string } } | null>(null);
  const [includeWorldwideRemote, setIncludeWorldwideRemote] = useState(true);
  const [sortByRelevance, setSortByRelevance] = useState(true);

  const detectGeolocation = async () => {
    if (!navigator.geolocation) {
      toast({ title: "Geolocation not supported", description: "Your browser does not support location detection.", variant: "destructive" });
      setUseGeo(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
        const res = await fetch(url, { headers: { 'accept': 'application/json' } });
        const data = await res.json();
        const city = data.address?.city || data.address?.town || data.address?.village || data.address?.state || "";
        const country = data.address?.country || "";
        const label = [city, country].filter(Boolean).join(", ");
        setGeoLabel(label);
        setGeoLocationParam(city || country || "");
        const mapped = mapCountryToRegion(country);
        if (mapped !== "any") setRegion(mapped);
        toast({ title: "Location detected", description: label || "Using your region" });
      } catch (e) {
        toast({ title: "Failed to detect location", description: "Proceeding without location.", variant: "destructive" });
        setUseGeo(false);
      }
    }, () => {
      toast({ title: "Permission denied", description: "Enable location to use nearby jobs.", variant: "destructive" });
      setUseGeo(false);
    }, { enableHighAccuracy: false, timeout: 8000 });
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    setProgress({ completed: 0, total: selectedSources.length });
    if (selectedSources.length === 0) {
      setIsLoading(false);
      setProgress(null);
      toast({ title: "No sources selected", description: "Please select at least one job source to search.", variant: "destructive" });
      return;
    }
    try {
      const locationParam = useGeo ? geoLocationParam : "";
      const { jobs: results, sourceStats: stats } = await searchJobsEnhanced(searchQuery, locationParam, {
        region,
        remoteOnly,
        sources: selectedSources as any,
        perSourceLimit,
        onProgress: ({ completed, total, source, count, error }) => setProgress({ completed, total, last: { source, count, error } }),
        includeWorldwideRemote,
        sortByRelevance,
      });
      setJobs(results);
      setSourceStats(stats);
      setPage(1);
      toast({
        title: "Search Complete",
        description: `Found ${results.length} jobs across ${selectedSources.length} sources`,
      });
      if (results.length === 0) {
        toast({
          title: "No results",
          description: "Try disabling Remote only, setting Region to Any, removing location, or enabling more sources.",
        });
      }
    } catch (e: any) {
      setError(e?.message || "Failed to fetch jobs");
      toast({
        title: "Search Failed",
        description: "There was an error fetching job listings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setProgress(null);
    }
  };

  const openDetails = (job: NormalizedJob) => {
    setDetailsJob(job);
    setDetailsOpen(true);
  };

  const totalPages = Math.max(1, Math.ceil(jobs.length / PAGE_SIZE));
  const startIndex = (page - 1) * PAGE_SIZE;
  const pageJobs = jobs.slice(startIndex, startIndex + PAGE_SIZE);

  const getSourceIcon = (source: string) => {
    const stats = sourceStats[source];
    if (!stats) return <AlertCircle className="h-4 w-4 text-gray-400" />;
    if (stats.error) return <XCircle className="h-4 w-4 text-red-500" />;
    if (stats.count > 0) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <AlertCircle className="h-4 w-4 text-yellow-500" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Enhanced Job Search
          </CardTitle>
          <CardDescription>
            Search across 11+ job sources with real-time diagnostics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="md:flex-1">
                <Input
                  placeholder="Search keywords (e.g., React, Frontend, AWS)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button onClick={handleSearch} disabled={isLoading} className="md:w-auto w-full">
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </div>

            <div id="filters" className="rounded-lg border bg-muted/30 p-3">
              <div className="flex items-center gap-2 text-sm font-medium mb-2"><Filter className="h-4 w-4" /> Filters</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-center gap-2">
                  <Globe2 className="h-4 w-4 text-muted-foreground" />
                  <Select value={region} onValueChange={(v) => setRegion(v as RegionFilter)}>
                    <SelectTrigger className="w-full">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <span className="animate-pulse">{REGION_META[region].flag}</span>
                          <span>{REGION_META[region].label}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(REGION_META).map(([value, meta]) => (
                        <SelectItem key={value} value={value}>
                          <div className="flex items-center gap-2">
                            <span className="animate-pulse">{meta.flag}</span>
                            <span>{meta.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-3">
                  <Switch id="remote-only" checked={remoteOnly} onCheckedChange={setRemoteOnly} />
                  <label htmlFor="remote-only" className="text-sm text-foreground">Remote only</label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch id="use-geo" checked={useGeo} onCheckedChange={(v) => { setUseGeo(v); if (v) detectGeolocation(); }} />
                  <label htmlFor="use-geo" className="text-sm text-foreground flex items-center gap-1"><Crosshair className="h-4 w-4" /> Use my location</label>
                  {useGeo && geoLabel && (
                    <Badge variant="secondary" className="ml-auto">{geoLabel}</Badge>
                  )}
                </div>
              </div>
              
              <div className="mt-3">
                <div className="text-sm font-medium mb-2">Job Sources</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {availableSources.map(source => {
                    const isSelected = selectedSources.includes(source.id);
                    const stats = sourceStats[source.id];
                    return (
                      <button
                        key={source.id}
                        onClick={() => setSelectedSources(
                          isSelected 
                            ? selectedSources.filter(s => s !== source.id)
                            : [...selectedSources, source.id]
                        )}
                        className={`p-2 rounded-lg border text-left transition-colors ${
                          isSelected 
                            ? 'bg-primary text-primary-foreground border-primary' 
                            : 'bg-background hover:bg-muted border-muted-foreground/30'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {getSourceIcon(source.id)}
                          <div>
                            <div className="text-xs font-medium">{source.name}</div>
                            <div className="text-xs opacity-70">{source.free ? 'Free' : 'API Key'}</div>
                            {stats && (
                              <div className="text-xs">
                                {stats.error ? 'Error' : `${stats.count} jobs`}
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="text-sm">
                  <div className="font-medium mb-1">Per-source limit</div>
                  <div className="flex items-center gap-2">
                    <Input type="number" min={5} max={100} value={perSourceLimit}
                      onChange={(e) => setPerSourceLimit(Math.max(5, Math.min(100, Number(e.target.value) || 30)))}
                      className="w-28" />
                    <span className="text-muted-foreground text-xs">results/source</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Switch id="include-worldwide" checked={includeWorldwideRemote} onCheckedChange={setIncludeWorldwideRemote} />
                  <label htmlFor="include-worldwide" className="text-sm text-foreground">Include worldwide "Remote" in region</label>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Switch id="sort-relevance" checked={sortByRelevance} onCheckedChange={setSortByRelevance} />
                  <label htmlFor="sort-relevance" className="text-foreground">Sort by relevance</label>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <Alert className="mt-3">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 rounded-full border-4 border-primary/30"></div>
              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              <div className="absolute inset-2 rounded-full bg-primary/10 animate-pulse"></div>
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              {progress ? (
                <span>
                  Loading {progress.completed}/{progress.total} sources{progress.last ? ` — ${progress.last.source} (+${progress.last.count})` : ''}
                </span>
              ) : (
                <span>Fetching jobs…</span>
              )}
            </div>
          </div>
        )}
        
        {!isLoading && jobs.length > 0 && (
          <div className="text-xs text-muted-foreground px-2">
            Sources: {Object.entries(sourceStats).map(([s, stats]) => 
              `${s}: ${stats.error ? 'Error' : stats.count}`
            ).join(' • ')}
          </div>
        )}
        
        {pageJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-all duration-200">
            <CardContent className="p-4 md:p-6">
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <button onClick={() => openDetails(job)} className="text-left">
                        <h3 className="text-lg sm:text-xl font-semibold text-foreground hover:underline break-words">{job.title}</h3>
                      </button>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="capitalize self-start">{job.source}</Badge>
                        {job.type && <Badge variant="outline">{job.type}</Badge>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1 min-w-0">
                        <Building2 className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{job.company}</span>
                      </div>
                      <div className="flex items-center gap-1 min-w-0">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{job.location || "Remote"}</span>
                      </div>
                      {job.salary && (
                        <div className="flex items-center gap-1 min-w-0">
                          <DollarSign className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{job.salary}</span>
                        </div>
                      )}
                      {job.posted && (
                        <div className="flex items-center gap-1 min-w-0">
                          <Clock className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{job.posted}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:ml-4">
                    {job.url && (
                      <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                        <a href={job.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1">
                          View <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <Button 
                      onClick={() => onJobSelect(job)}
                      variant={selectedJob?.id === job.id ? "default" : "outline"}
                      size="sm"
                      className={`w-full sm:w-auto ${selectedJob?.id === job.id ? "bg-success hover:bg-success/90" : ""}`}
                    >
                      {selectedJob?.id === job.id ? "Selected ✓" : "Select Job"}
                    </Button>
                  </div>
                </div>
                {job.description && (
                  <p className="text-foreground text-sm line-clamp-3" dangerouslySetInnerHTML={{ __html: job.description }} />
                )}
                {job.requirements && job.requirements.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.slice(0, 6).map((req, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">{req}</Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {!isLoading && pageJobs.length === 0 && (
          <div className="text-sm text-muted-foreground px-2">No results yet. Try searching for a role like "React Developer".</div>
        )}
      </div>

      {jobs.length > PAGE_SIZE && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setPage(p => Math.max(1, p - 1)); }} />
              </PaginationItem>
              {Array.from({ length: totalPages }).slice(0, 5).map((_, idx) => {
                const p = idx + Math.max(1, Math.min(page - 2, totalPages - 4));
                return (
                  <PaginationItem key={p}>
                    <PaginationLink href="#" isActive={p === page} onClick={(e) => { e.preventDefault(); setPage(p); }}>
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext href="#" onClick={(e) => { e.preventDefault(); setPage(p => Math.min(totalPages, p + 1)); }} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <JobDetails job={detailsJob} open={detailsOpen} onOpenChange={setDetailsOpen} />
    </div>
  );
};
