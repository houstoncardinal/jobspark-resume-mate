import * as React from "react";
import type { AnnotationSpan, AnnotationCategory } from "@/lib/annotation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const CATEGORY_COLOR: Record<AnnotationCategory, string> = {
  keywords: "bg-primary/20 ring-1 ring-primary",
  impact: "bg-accent/20 ring-1 ring-accent",
  format: "bg-muted/50 ring-1 ring-muted-foreground/30",
  redundancy: "bg-warning/20 ring-1 ring-warning",
  clarity: "bg-secondary/30 ring-1 ring-secondary",
  grammar: "bg-destructive/20 ring-1 ring-destructive",
};

interface ResumeHighlighterProps {
  text: string;
  annotations: AnnotationSpan[];
  onChange: (newText: string) => void;
}

export const ResumeHighlighter: React.FC<ResumeHighlighterProps> = ({ text, annotations, onChange }) => {
  const [selectedIdx, setSelectedIdx] = React.useState<number | null>(null);

  const applyReplacement = (idx: number) => {
    const ann = annotations[idx];
    if (!ann?.replacement) return;
    const before = text.slice(0, ann.start);
    const after = text.slice(ann.end);
    const newText = before + ann.replacement + after;
    onChange(newText);
  };

  // Build segments
  const segments: Array<{ start: number; end: number; annIdx?: number }> = [];
  let cursor = 0;
  const sorted = [...annotations].sort((a,b) => a.start - b.start);
  for (const [i, ann] of sorted.entries()) {
    if (ann.start > cursor) segments.push({ start: cursor, end: ann.start });
    segments.push({ start: ann.start, end: ann.end, annIdx: i });
    cursor = ann.end;
  }
  if (cursor < text.length) segments.push({ start: cursor, end: text.length });

  return (
    <div className="space-y-3">
      <div className="text-xs text-muted-foreground flex flex-wrap gap-2">
        <span>Legend:</span>
        {Object.entries(CATEGORY_COLOR).map(([k, cls]) => (
          <Badge key={k} className={cls}>{k}</Badge>
        ))}
      </div>
      <div className="border rounded-md p-3 whitespace-pre-wrap leading-relaxed text-sm">
        {segments.map((seg, i) => {
          const slice = text.slice(seg.start, seg.end);
          if (seg.annIdx == null) return <span key={i}>{slice}</span>;
          const ann = sorted[seg.annIdx];
          const isSelected = selectedIdx === seg.annIdx;
          return (
            <span key={i} className={`cursor-pointer px-0.5 ${CATEGORY_COLOR[ann.category]} ${isSelected ? 'ring-2' : ''}`} onClick={() => setSelectedIdx(isSelected ? null : seg.annIdx)} title={ann.message}>
              {slice}
            </span>
          );
        })}
      </div>
      {selectedIdx != null && (
        <div className="rounded-md border p-3 space-y-2">
          <div className="text-sm font-medium">Suggestion</div>
          <div className="text-sm text-foreground">{sorted[selectedIdx].message}</div>
          <div className="text-xs text-muted-foreground">{sorted[selectedIdx].suggestion}</div>
          {sorted[selectedIdx].replacement && (
            <div className="flex gap-2">
              <Button size="sm" onClick={() => applyReplacement(selectedIdx!)}>Apply Change</Button>
              <Button size="sm" variant="outline" onClick={() => setSelectedIdx(null)}>Dismiss</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 