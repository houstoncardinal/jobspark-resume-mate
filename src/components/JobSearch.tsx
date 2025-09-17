import { useState } from "react";
import { Search, MapPin, Building2, Clock, DollarSign, ExternalLink, Globe2, Filter, Crosshair } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { searchJobs, type NormalizedJob, type RegionFilter } from "@/lib/jobs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { JobDetails } from "@/components/JobDetails";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const ALL_SOURCES = ["remotive", "arbeitnow", "remoteok", "ziprecruiter", "jooble", "usajobs"] as const;

interface JobSearchProps {
  onJobSelect: (job: any) => void;
  selectedJob?: any;
}

const REGION_META: Record<RegionFilter, { label: string; flag: string }> = {
  "any": { label: "Any region", flag: "🌍" },
  "north-america": { label: "North America", flag: "🇺🇸" },
  "south-america": { label: "South America", flag: "🇧🇷" },
  "europe": { label: "Europe", flag: "🇪🇺" },
  "asia": { label: "Asia", flag: "🇯🇵" },
  "africa": { label: "Africa", flag: "🇿🇦" },
  "oceania": { label: "Oceania", flag: "🇦🇺" },
  "middle-east": { label: "Middle East", flag: "🇦🇪" },
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

export const JobSearch = ({ onJobSelect, selectedJob }: JobSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [region, setRegion] = useState<RegionFilter>("any");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [jobs, setJobs] = useState<NormalizedJob[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsJob, setDetailsJob] = useState<NormalizedJob | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 50;
  const { toast } = useToast();

  const [useGeo, setUseGeo] = useState(false);
  const [geoLabel, setGeoLabel] = useState<string>("");
  const [geoLocationParam, setGeoLocationParam] = useState<string>("");

  const [selectedSources, setSelectedSources] = useState<string[]>([...ALL_SOURCES]);
  const [perSourceLimit, setPerSourceLimit] = useState<number>(30);

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
    try {
      const locationParam = useGeo ? geoLocationParam : "";
      const results = await searchJobs(searchQuery, locationParam, { region, remoteOnly, sources: selectedSources as any, perSourceLimit });
      setJobs(results);
      setPage(1);
      toast({
        title: "Search Complete",
        description: `Found ${results.length} jobs matching your criteria`,
      });
    } catch (e: any) {
      setError(e?.message || "Failed to fetch jobs");
      toast({
        title: "Search Failed",
        description: "There was an error fetching job listings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return "bg-success text-success-foreground";
    if (score >= 60) return "bg-warning text-warning-foreground";
    return "bg-destructive text-destructive-foreground";
  };

  const openDetails = (job: NormalizedJob) => {
    setDetailsJob(job);
    setDetailsOpen(true);
  };

  const totalPages = Math.max(1, Math.ceil(jobs.length / PAGE_SIZE));
  const startIndex = (page - 1) * PAGE_SIZE;
  const pageJobs = jobs.slice(startIndex, startIndex + PAGE_SIZE);

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
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="text-sm">
                  <div className="font-medium mb-1">Sources</div>
                  <div className="flex flex-wrap gap-2">
                    {ALL_SOURCES.map(src => {
                      const checked = selectedSources.includes(src);
                      return (
                        <button
                          key={src}
                          onClick={() => setSelectedSources(checked ? selectedSources.filter(s => s !== src) : [...selectedSources, src])}
                          className={`px-3 py-1 rounded-full border text-xs ${checked ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-foreground/80 hover:text-primary border-muted-foreground/30'}`}
                        >
                          {src}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="text-sm">
                  <div className="font-medium mb-1">Per-source limit</div>
                  <div className="flex items-center gap-2">
                    <Input type="number" min={5} max={100} value={perSourceLimit}
                      onChange={(e) => setPerSourceLimit(Math.max(5, Math.min(100, Number(e.target.value) || 30)))}
                      className="w-28" />
                    <span className="text-muted-foreground text-xs">results/source</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-destructive text-sm mt-3">{error}</div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {pageJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <button onClick={() => openDetails(job)} className="text-left">
                      <h3 className="text-xl font-semibold text-foreground hover:underline">{job.title}</h3>
                    </button>
                    <Badge variant="secondary" className="capitalize">{job.source}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      <span>{job.company}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location || "Remote"}</span>
                    </div>
                    {job.salary && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{job.salary}</span>
                      </div>
                    )}
                    {job.posted && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{job.posted}</span>
                      </div>
                    )}
                  </div>
                  {job.description && (
                    <p className="text-foreground mb-3 line-clamp-3" dangerouslySetInnerHTML={{ __html: job.description }} />
                  )}
                  {job.requirements && job.requirements.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.requirements.slice(0, 6).map((req, index) => (
                        <Badge key={index} variant="secondary">{req}</Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="ml-4 flex gap-2">
                  {job.url && (
                    <Button asChild variant="outline">
                      <a href={job.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                        View <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  <Button 
                    onClick={() => onJobSelect(job)}
                    variant={selectedJob?.id === job.id ? "default" : "outline"}
                    className={selectedJob?.id === job.id ? "bg-success hover:bg-success/90" : ""}
                  >
                    {selectedJob?.id === job.id ? "Selected ✓" : "Select Job"}
                  </Button>
                </div>
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