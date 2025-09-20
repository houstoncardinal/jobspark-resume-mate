import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "@/pages/Index";
import ResumeBuilder from "@/pages/ResumeBuilder";
import Blog from "@/pages/Blog";
import AppliedJobs from "@/pages/AppliedJobs";
import Fortune500Dashboard from "@/pages/Fortune500Dashboard";
import Dashboard from "@/components/Dashboard";
import SignIn from "@/pages/SignIn";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <Router>
        <AnalyticsTracker />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/builder" element={<ResumeBuilder />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/applied" element={<AppliedJobs />} />
          <Route path="/fortune500" element={<Fortune500Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
