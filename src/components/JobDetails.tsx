import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Building2, Clock, DollarSign, Mail, Phone, Link as LinkIcon, ExternalLink } from "lucide-react";
import type { NormalizedJob } from "@/lib/jobs";
import { extractContacts } from "@/lib/contact";

interface JobDetailsProps {
  job: NormalizedJob | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const JobDetails: React.FC<JobDetailsProps> = ({ job, open, onOpenChange }) => {
  const contacts = React.useMemo(() => job ? extractContacts(job.description || "") : { emails: [], phones: [], links: [] }, [job]);

  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-xl md:max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xl font-semibold truncate">{job.title}</div>
              <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-3 mt-1">
                <span className="flex items-center gap-1 min-w-0"><Building2 className="h-4 w-4" /> <span className="truncate">{job.company}</span></span>
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location || 'Remote'}</span>
                {job.posted && <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {job.posted}</span>}
                {job.salary && <span className="flex items-center gap-1"><DollarSign className="h-4 w-4" /> {job.salary}</span>}
              </div>
            </div>
            <Badge variant="secondary" className="capitalize self-start sm:self-auto">{job.source}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-1">
          {job.requirements && job.requirements.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-2">Key Requirements</div>
              <div className="flex flex-wrap gap-2">
                {job.requirements.map((r, i) => (
                  <Badge key={i} variant="secondary">{r}</Badge>
                ))}
              </div>
            </div>
          )}

          {job.description && (
            <Card>
              <CardContent className="prose dark:prose-invert max-w-none p-4 text-sm">
                <div dangerouslySetInnerHTML={{ __html: job.description }} />
              </CardContent>
            </Card>
          )}

          <div>
            <div className="text-sm font-medium mb-2">Contact & Links</div>
            <div className="flex flex-wrap gap-3">
              {contacts.emails.map((e, i) => (
                <a key={i} href={`mailto:${e}`} className="inline-flex items-center gap-1 text-primary hover:underline">
                  <Mail className="h-4 w-4" /> {e}
                </a>
              ))}
              {contacts.phones.map((p, i) => (
                <a key={i} href={`tel:${p.replace(/\D/g, '')}`} className="inline-flex items-center gap-1 text-primary hover:underline">
                  <Phone className="h-4 w-4" /> {p}
                </a>
              ))}
              {contacts.links.map((l, i) => (
                <a key={i} href={l} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline break-all">
                  <LinkIcon className="h-4 w-4" /> {l}
                </a>
              ))}
              {job.url && (
                <a href={job.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                  <ExternalLink className="h-4 w-4" /> View original posting
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2">
            {job.url && (
              <Button asChild variant="outline" className="w-full sm:w-auto" aria-label="Apply on original job posting">
                <a href={job.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                  Apply <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 