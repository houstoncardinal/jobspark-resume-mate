import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Index from "@/pages/Index";
import ResumeBuilderPage from "@/pages/ResumeBuilder";
import ResumeOptimizer from "@/pages/ResumeOptimizer";
import ResumeTemplates from "@/pages/ResumeTemplates";
import ResumeScanner from "@/pages/ResumeScanner";
import CoverLetterBuilder from "@/pages/CoverLetterBuilder";
import ResumeReview from "@/pages/ResumeReview";
import Blog from "@/pages/Blog";
import Jobs from "@/pages/Jobs";
import Candidates from "@/pages/Candidates";
import Fortune500Dashboard from "@/pages/Fortune500Dashboard";
import Dashboard from "@/components/Dashboard";
import SignIn from "@/pages/SignIn";
import EmailVerificationSuccess from "@/pages/EmailVerificationSuccess";
import AdminPage from "@/pages/admin/AdminPage";
import NetworkingHubPage from "@/pages/NetworkingHub";
import { JobSeekerProfile } from "@/pages/profile/JobSeekerProfile";
import { RecruiterProfile } from "@/pages/profile/RecruiterProfile";
import { EmployerProfile } from "@/pages/profile/EmployerProfile";
import { StudentProfile } from "@/pages/profile/StudentProfile";
import NotFound from "@/pages/NotFound";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <AnalyticsTracker />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/builder" element={<ResumeBuilderPage />} />
            <Route path="/resume-optimizer" element={<ResumeOptimizer />} />
            <Route path="/resume-templates" element={<ResumeTemplates />} />
            <Route path="/resume-scanner" element={<ResumeScanner />} />
            <Route path="/cover-letter-builder" element={<CoverLetterBuilder />} />
            <Route path="/resume-review" element={<ResumeReview />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/networking" element={<NetworkingHubPage />} />
            <Route path="/fortune500" element={<Fortune500Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/email-verified" element={<EmailVerificationSuccess />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/profile/job-seeker" element={<JobSeekerProfile />} />
            <Route path="/profile/recruiter" element={<RecruiterProfile />} />
            <Route path="/profile/employer" element={<EmployerProfile />} />
            <Route path="/profile/student" element={<StudentProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
