import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AppliedItem { jobId: string; title: string; company: string; url: string; at: number; resumeName?: string; }

const toCsv = (rows: AppliedItem[]) => {
  const header = ["Date","Company","Title","URL","Resume"].join(",");
  const lines = rows.map(r => [new Date(r.at).toISOString(), r.company, r.title, r.url, r.resumeName || ""].map(v => `"${(v||"").replace(/"/g,'""')}"`).join(","));
  return [header, ...lines].join("\n");
};

const AppliedJobs = () => {
  const [items, setItems] = useState<AppliedItem[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem('appliedJobs');
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  const filtered = useMemo(() => {
    const term = q.toLowerCase().trim();
    if (!term) return items;
    return items.filter(i => `${i.company} ${i.title}`.toLowerCase().includes(term));
  }, [items, q]);

  const exportCsv = () => {
    const blob = new Blob([toCsv(filtered)], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `applied-jobs-${Date.now()}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const clearAll = () => {
    if (!confirm('Clear applied jobs history?')) return;
    localStorage.removeItem('appliedJobs');
    setItems([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Applied Jobs</CardTitle>
            <CardDescription>Your application log (local to your device)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Input placeholder="Filter by company or title" value={q} onChange={(e)=>setQ(e.target.value)} className="w-64" />
              <Button variant="outline" onClick={exportCsv}>Export CSV</Button>
              <Button variant="outline" onClick={clearAll}>Clear</Button>
            </div>
            <div className="grid gap-3">
              {filtered.map((it, idx) => (
                <div key={`${it.jobId}-${it.at}-${idx}`} className="border rounded-md p-3 text-sm flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{it.title}</div>
                    <div className="text-muted-foreground truncate">{it.company} • {new Date(it.at).toLocaleString()}</div>
                    <div className="text-muted-foreground truncate">Resume: {it.resumeName || '—'}</div>
                  </div>
                  <div className="flex-shrink-0">
                    <a href={it.url} target="_blank" rel="noopener noreferrer" className="underline">View</a>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="text-xs text-muted-foreground">No applications yet.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AppliedJobs; 