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
import ForEmployers from "@/pages/ForEmployers";
import Community from "@/pages/Community";
import Dashboard from "@/components/Dashboard";
import SignIn from "@/pages/SignIn";
import EmailVerificationSuccess from "@/pages/EmailVerificationSuccess";
import AdminPage from "@/pages/admin/AdminPage";
import NetworkingHubPage from "@/pages/NetworkingHub";
import JobSeekerProfile from "@/pages/profile/JobSeekerProfile";
import RecruiterProfile from "@/pages/profile/RecruiterProfile";
import EmployerProfile from "@/pages/profile/EmployerProfile";
import StudentProfile from "@/pages/profile/StudentProfile";
import PostJob from "@/pages/PostJob";
import AppliedJobs from "@/pages/AppliedJobs";
import NotFound from "@/pages/NotFound";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import ErrorBoundary from "@/components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen flex flex-col m-0 p-0">
              <AnalyticsTracker />
              <Header />
              <main className="flex-1">
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
                  <Route path="/for-employers" element={<ForEmployers />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/email-verification-success" element={<EmailVerificationSuccess />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/networking-hub" element={<NetworkingHubPage />} />
                  
                  {/* Profile Routes */}
                  <Route path="/profile/job-seeker" element={<JobSeekerProfile />} />
                  <Route path="/profile/recruiter" element={<RecruiterProfile />} />
                  <Route path="/profile/employer" element={<EmployerProfile />} />
                  <Route path="/profile/student" element={<StudentProfile />} />
                  
                  {/* Job Management Routes */}
                  <Route path="/employer/post-job" element={<PostJob />} />
                  <Route path="/recruiter/post-job" element={<PostJob />} />
                  <Route path="/applied-jobs" element={<AppliedJobs />} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
              <Toaster />
            </div>
          </Router>
        </AuthProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
