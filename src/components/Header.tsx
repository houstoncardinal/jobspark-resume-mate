import { Search, FileText, BarChart3, Zap, Sparkles, SlidersHorizontal, Globe2, ToggleRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="border-b bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary-hover shadow-sm">
              <img src="/logo.svg" alt="Gigm8" className="h-6 w-auto" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-foreground">Gigm8</h1>
              <p className="text-sm text-muted-foreground">Jobs • Matching • AI Resume Builder</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <Search className="h-4 w-4" />
              <span className="text-sm">Job Search</span>
            </Link>
            <a href="#upload" className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors">
              <FileText className="h-4 w-4" />
              <span className="text-sm">Resume Upload</span>
            </a>
            <a href="#match" className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors">
              <BarChart3 className="h-4 w-4" />
              <span className="text-sm">Match Analysis</span>
            </a>
          </nav>

          <Button asChild variant="default" className="shadow">
            <Link to="/builder">Open Resume Builder</Link>
          </Button>
        </div>

        <div className="mt-3 hidden md:flex items-center gap-2 text-xs">
          <a href="#filters" className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-foreground/90 hover:text-primary hover:border-primary transition-colors">
            <SlidersHorizontal className="h-3 w-3" /> Filters
          </a>
          <a href="#filters" className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-foreground/90 hover:text-primary hover:border-primary transition-colors">
            <Globe2 className="h-3 w-3" /> Region
          </a>
          <a href="#filters" className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-foreground/90 hover:text-primary hover:border-primary transition-colors">
            <ToggleRight className="h-3 w-3" /> Remote Only
          </a>
          <a href="#help" className="ml-auto inline-flex items-center gap-1 rounded-full border px-3 py-1 text-foreground/90 hover:text-primary hover:border-primary transition-colors">
            <HelpCircle className="h-3 w-3" /> Help
          </a>
        </div>
      </div>
    </header>
  );
};