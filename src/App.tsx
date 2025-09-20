import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Index from "@/pages/Index";
import ResumeBuilderPage from "@/pages/ResumeBuilder";
import Blog from "@/pages/Blog";
import AppliedJobs from "@/pages/AppliedJobs";
import Fortune500Dashboard from "@/pages/Fortune500Dashboard";
import Dashboard from "@/components/Dashboard";
import SignIn from "@/pages/SignIn";
import EmailVerificationSuccess from "@/pages/EmailVerificationSuccess";
import NotFound from "@/pages/NotFound";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";

function App() {
  return (
    <AuthProvider>
      <Router>
        <AnalyticsTracker />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/builder" element={<ResumeBuilderPage />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/applied" element={<AppliedJobs />} />
          <Route path="/fortune500" element={<Fortune500Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/email-verified" element={<EmailVerificationSuccess />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
