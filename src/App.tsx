import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ResumeBuilder from "./pages/ResumeBuilder";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import AppliedJobs from "./pages/AppliedJobs";
import Fortune500Dashboard from "./pages/Fortune500Dashboard";
import { Dashboard } from "@/components/Dashboard";
import { trackPageView } from "./lib/analytics";

const queryClient = new QueryClient();

// Component to track route changes
const AnalyticsTracker = () => {
  const location = useLocation();
  
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AnalyticsTracker />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/builder" element={<ResumeBuilder />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/applied" element={<AppliedJobs />} />
            <Route path="/fortune500" element={<Fortune500Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
