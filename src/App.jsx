import React, { useState, useEffect, lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLocation,
  Navigate
} from "react-router-dom";
import RequireAuth from "./Components/RequireAuth";
import Header from "./Components/Header";
import Dashboard from "./Components/Dashboard";
import LandingHeader from "./Components/Landing/LandingHeader";
import LandingDashboard from "./Components/Landing/LandingDashboard";
import Footer from "./Components/Landing/Footer";
import LandingHome from "./Components/Landing/Home";
import AboutUs from "./Components/Landing/AboutUs";
import ContactUs from "./Components/Landing/ContactUs";
import PageNotFound from "./Components/Landing/PageNotFound";
import PrivacyPolicy from "./Components/Landing/PrivacyPolicy";
import ResumeAnalysisPage from "./Components/Landing/ResumeAnalysisPage";
import TermsOfService from "./Components/Landing/TermsOfService";
import VideoInterviewsPage from "./Components/Landing/VideoInterviewsPage";
import VideoInterview from "./Components/VideoInterview";
import WrittenTests from "./Components/WrittenTests";
import Coaching from "./Components/Coaching";
import ResumeAnalysis from "./Components/ResumeAnalysis";
import StudyPlans from "./Components/StudyPlans";
import InterviewInterface from "./Components/InterviewInterface";
import PopupForm from "./Components/PopupForm";
import LoginPage from "./Components/LoginPage";
import OAuthCallback from "./Components/OAuthCallback";
import Error from "./Components/Errorpage";

import CameraCheck from "./Components/Experimental/CameraCheck";

import ScrollToTop from "./ScrollToTop/ScrollToTop"
import Signup from "./Components/Signup";
import FeedbackPage from "./Components/FeedbackPage";
import FeedbackTemplate from "./Components/FeedbackTemplate"; // legacy
import FeedbackTemplateTest from "./Components/FeedbackTemplates/FeedbackTemplateTest";
const FeedbackRouter = lazy(() => import("./Components/FeedbackTemplates/FeedbackRouter"));
import PopupTemplate from "./Components/PopupTemplate";
import Awesome from "./Components/Experimental/Awesome";
import DraggableCodeEditor from "./Components/Experimental/DraggableCodeEditor";
import PercentileChart from "./Components/Experimental/PercentilePlot";
import LoadingCard from "./Components/Experimental/LoadingCard";
import LoadingEffect from "./Components/LoadingEffect";
import FramerFeedback from "./Components/Experimental/FramerFeedback";
import RainbowTextbox from "./Components/Experimental/RainbowTextBox";
import MyComponent from "./Components/Experimental/myComponent";
import PastReportsTable from "./Components/Experimental/PastReportsTable";
import FeedbackTemp from "./Components/FeedbackTemp";
import TryMesh from "./Components/Experimental/TryMesh";
import IntroPage from "./Components/Experimental/IntroPage";
import IndentableTextarea from "./Components/Experimental/IndenttableTextarea";
import ResumeAnalysisHistory from "./Components/ResumeAnalysisHistory";
import VideoInterviewHistory from "./Components/VideoInterviewHistory";
import ServiceTimeoutError from "./Components/ServiceTimeoutError";
import GenericError from "./Components/GenericError";
import InterviewDisclaimer from "./Components/InterviewDisclaimer";
import InterviewLoadingPopup from "./Components/InterviewLoadingPopup";
import ResumeGeneration from "./Components/ResumeGeneration";
import ForgotPassword from "./Components/ForgotYourPassword";
import { AnimatePresence, motion } from "framer-motion";
import RoleBasedRoute from "./Components/RoleBasedRoute";
import TeacherDashboard from "./Components/Teacher/TeacherDashboard";
import StudentsPerformance from "./Components/Teacher/StudentsPerformance";
import ScheduleSlots from "./Components/Teacher/ScheduleSlots";
import TeacherClasses from "./Components/Teacher/TeacherClasses";
import TeacherClassDetail from "./Components/Teacher/TeacherClassDetail";
import CreateTimeSlot from "./Components/Teacher/CreateTimeSlot";
import CreateAssignment from "./Components/Teacher/CreateAssignment";
import TeacherStudentBatch from "./Components/Teacher/TeacherStudentBatch";
import TeacherStudentDetail from "./Components/Teacher/TeacherStudentDetail";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import UserManagement from "./Components/Admin/UserManagement";
import StudentClasses from "./Components/Student/StudentClasses";
import StudentClassDetail from "./Components/Student/StudentClassDetail";
import StudentInterviewHistory from "./Components/Student/StudentInterviewHistory";
import StudentAssignmentSubmit from "./Components/Student/StudentAssignmentSubmit";
import AssignmentSubmissions from "./Components/Teacher/AssignmentSubmissions";
import LearningPage from "./Components/Learning/LearningPage";
import AccountDashboard from "./Components/Account/AccountDashboard";
import CompleteProfile from "./Components/CompleteProfile";
import ArraysLearningHub from "./Components/Learning/Arrays/ArraysLearningHub";
import ConceptLearningPage from "./Components/Learning/Arrays/ConceptLearningPage";
import PracticePage from "./Components/Learning/Arrays/PracticePage";
import VideoSolutionPage from "./Components/Learning/Arrays/VideoSolutionPage";

const LANDING_PATHS = ["/", "/about", "/video-interviews", "/resume", "/contact", "/dashboard", "/terms-of-service", "/privacy-policy"];

const RootLayout = () => {
  const location = useLocation();
  const isLanding = LANDING_PATHS.includes(location.pathname);
  if (isLanding) {
    return (
      <>
        <ScrollToTop />
        <LandingHeader />
        <Outlet />
        <Footer />
      </>
    );
  }
  return <AppLayout />;
};

const AppLayout = () => {
  const location = useLocation();
  const [sectionChange, setSectionChange] = useState(0);
  const hideNavbarroutes = ["/login", "/login-page", "/interview-interface", "/signup", "/oops-something-wrong", "/forgot-password", "/complete-profile"];
  const isArraysLearningPage = location.pathname.startsWith('/learning/arrays/') && location.pathname !== '/learning/arrays';
  const shouldshownavbar = !hideNavbarroutes.includes(location.pathname) && !isArraysLearningPage;

  useEffect(() => { console.log("Section changed to:", sectionChange); }, [sectionChange]);

  return (
    <>
      <ScrollToTop />
      {shouldshownavbar && <Header setSectionChange={setSectionChange} />}
      <main className="overflow-hidden">
        <motion.div key={location.pathname} initial={{ opacity: 0, x: sectionChange < 0 ? '100%' : sectionChange > 0 ? '-100%' : 0 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, ease: "easeInOut" }}>
          <Outlet />
        </motion.div>
      </main>
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <LandingHome /> },
      { path: "about", element: <AboutUs /> },
      { path: "video-interviews", element: <VideoInterviewsPage /> },
      { path: "resume", element: <ResumeAnalysisPage /> },
      { path: "contact", element: <ContactUs /> },
      { path: "dashboard", element: <LandingDashboard /> },
      { path: "terms-of-service", element: <TermsOfService /> },
      { path: "privacy-policy", element: <PrivacyPolicy /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <Signup />},
      { path: "auth/callback", element: <OAuthCallback /> },
      { path: "complete-profile", element: <RequireAuth><CompleteProfile /></RequireAuth> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "feedback", element: <RequireAuth><FeedbackPage /></RequireAuth> },
      { path: "manage", element: <RequireAuth><RoleBasedRoute allowedRoles={['student']}><Dashboard /></RoleBasedRoute></RequireAuth> },
      { path: "teacher/dashboard", element: <RequireAuth><RoleBasedRoute allowedRoles={['teacher']}><TeacherClasses /></RoleBasedRoute></RequireAuth> },
      { path: "teacher/students", element: <RequireAuth><RoleBasedRoute allowedRoles={['teacher']}><StudentsPerformance /></RoleBasedRoute></RequireAuth> },
      { path: "teacher/students-batch", element: <RequireAuth><RoleBasedRoute allowedRoles={['teacher']}><TeacherStudentBatch /></RoleBasedRoute></RequireAuth> },
      { path: "teacher/student/:studentId", element: <RequireAuth><RoleBasedRoute allowedRoles={['teacher']}><TeacherStudentDetail /></RoleBasedRoute></RequireAuth> },
      { path: "teacher/schedule", element: <RequireAuth><RoleBasedRoute allowedRoles={['teacher']}><ScheduleSlots /></RoleBasedRoute></RequireAuth> },
      { path: "teacher/classes", element: <RequireAuth><RoleBasedRoute allowedRoles={['teacher']}><TeacherClasses /></RoleBasedRoute></RequireAuth> },
      { path: "teacher/class/:id", element: <RequireAuth><RoleBasedRoute allowedRoles={['teacher']}><TeacherClassDetail /></RoleBasedRoute></RequireAuth> },
      { path: "teacher/class/:id/create-slot", element: <RequireAuth><RoleBasedRoute allowedRoles={['teacher']}><CreateTimeSlot /></RoleBasedRoute></RequireAuth> },
      { path: "teacher/class/:id/assign-interview", element: <RequireAuth><RoleBasedRoute allowedRoles={['teacher']}><CreateAssignment /></RoleBasedRoute></RequireAuth> },
      { path: "teacher/assignment/:id/submissions", element: <RequireAuth><RoleBasedRoute allowedRoles={['teacher']}><AssignmentSubmissions /></RoleBasedRoute></RequireAuth> },
      { path: "student/classes", element: <RequireAuth><RoleBasedRoute allowedRoles={['student']}><StudentClasses /></RoleBasedRoute></RequireAuth> },
      { path: "student/class/:id", element: <RequireAuth><RoleBasedRoute allowedRoles={['student']}><StudentClassDetail /></RoleBasedRoute></RequireAuth> },
      { path: "student/assignment/:id", element: <RequireAuth><RoleBasedRoute allowedRoles={['student']}><StudentAssignmentSubmit /></RoleBasedRoute></RequireAuth> },
      { path: "student/interview-history", element: <RequireAuth><RoleBasedRoute allowedRoles={['student']}><StudentInterviewHistory /></RoleBasedRoute></RequireAuth> },
      { path: "admin/dashboard", element: <RequireAuth><RoleBasedRoute allowedRoles={['admin']}><AdminDashboard /></RoleBasedRoute></RequireAuth> },
      { path: "admin/users", element: <RequireAuth><RoleBasedRoute allowedRoles={['admin']}><UserManagement /></RoleBasedRoute></RequireAuth> },
      { path: "video-interview", element: <RequireAuth><RoleBasedRoute allowedRoles={['student']}><VideoInterview /></RoleBasedRoute></RequireAuth> },
      { path: "learning", element: <RequireAuth><RoleBasedRoute allowedRoles={['student']}><LearningPage /></RoleBasedRoute></RequireAuth> },
      { path: "learning/arrays", element: <RequireAuth><RoleBasedRoute allowedRoles={['student']}><ArraysLearningHub /></RoleBasedRoute></RequireAuth> },
      { path: "learning/arrays/:concept", element: <RequireAuth><RoleBasedRoute allowedRoles={['student']}><ConceptLearningPage /></RoleBasedRoute></RequireAuth> },
      { path: "learning/arrays/:concept/practice/:problemId", element: <RequireAuth><RoleBasedRoute allowedRoles={['student']}><PracticePage /></RoleBasedRoute></RequireAuth> },
      { path: "learning/arrays/:concept/video/:problemId", element: <RequireAuth><RoleBasedRoute allowedRoles={['student']}><VideoSolutionPage /></RoleBasedRoute></RequireAuth> },
      { path: "resume-analysis", element: <RequireAuth><RoleBasedRoute allowedRoles={['student']}><ResumeAnalysis /></RoleBasedRoute></RequireAuth> },
      { path: "resume-generation", element: <RequireAuth><ResumeGeneration /></RequireAuth> },
      { path: "interview-interface", element: <RequireAuth requiredState="session" navigateTo="/video-interview"><InterviewInterface /></RequireAuth> },
      { path: "popup-form", element: <RequireAuth><PopupForm /></RequireAuth> },
      { path: "feedback-template", element: <RequireAuth><Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-500" /></div>}><FeedbackRouter /></Suspense></RequireAuth> },
      { path: "resume-analysis-reports", element: <RequireAuth><ResumeAnalysisHistory /></RequireAuth> },
      { path: "video-interview-reports", element: <RequireAuth><VideoInterviewHistory /></RequireAuth> },
      { path: "popup-template", element: <RequireAuth><PopupTemplate /></RequireAuth> },
      { path: "feedback-view", element: <RequireAuth><FeedbackTemp /></RequireAuth> },
      { path: "feedback-template-test", element: <RequireAuth><FeedbackTemplateTest /></RequireAuth> },
      { path: "account", element: <RequireAuth><AccountDashboard /></RequireAuth> },
      { path: "oops-something-wrong", element: <RequireAuth><GenericError /></RequireAuth> },
      { path: "*", element: <PageNotFound /> }
    ]
  }
]);

function App() {

  return <RouterProvider router={router} />;
}

export default App;
