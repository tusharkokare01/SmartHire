import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import { ROUTES, USER_ROLES } from './utils/constants';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Candidate Pages
import CandidateDashboard from './pages/candidate/Dashboard';
import ResumeBuilder from './pages/candidate/ResumeBuilder';
import MyResumes from './pages/candidate/MyResumes';
import ResumeScorer from './pages/candidate/ResumeScorer';
import CoverLetterGenerator from './pages/candidate/CoverLetterGenerator';
import JobSearch from './pages/candidate/JobSearch';
import AppliedJobs from './pages/candidate/AppliedJobs';
import MockInterview from './pages/candidate/MockInterview';
import CandidateInterviews from './pages/candidate/CandidateInterviews';
import CandidateAssessments from './pages/candidate/CandidateAssessments';
import Subscription from './pages/candidate/Subscription';
import Settings from './pages/candidate/Settings';
import ChangePassword from './pages/candidate/ChangePassword';
import ProfileSettings from './pages/candidate/ProfileSettings';
import MessagesPage from './pages/candidate/MessagesPage';

// HR Pages
import HRDashboard from './pages/hr/Dashboard';

import HRCandidates from './pages/hr/HRApplications';
import HRMeetings from './pages/hr/HRMeetings';
import HRMCQ from './pages/hr/HRMCQ';
import HRMessages from './pages/hr/HRMessages';
import HRSettings from './pages/hr/HRSettings';
import HRProfileSettings from './pages/hr/HRProfileSettings';
import HRChangePassword from './pages/hr/HRChangePassword';
import HRJobs from './pages/hr/HRJobs';
import PostJob from './pages/hr/PostJob';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />

          {/* Candidate Routes */}
          <Route
            path={ROUTES.CANDIDATE_DASHBOARD}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.CANDIDATE]}>
                <CandidateDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.MY_RESUMES}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.CANDIDATE]}>
                <MyResumes />
              </ProtectedRoute>
            }
          />
          <Route
            path={`${ROUTES.RESUME_BUILDER}/:id?`}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.CANDIDATE]}>
                <ResumeBuilder />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.RESUME_SCORER}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.CANDIDATE]}>
                <ResumeScorer />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.COVER_LETTER}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.CANDIDATE]}>
                <CoverLetterGenerator />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.JOB_SEARCH}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.CANDIDATE]}>
                <JobSearch />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.APPLIED_JOBS}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.CANDIDATE]}>
                <AppliedJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/candidate/assessments"
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.CANDIDATE]}>
                <CandidateAssessments />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.MOCK_INTERVIEW}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.CANDIDATE]}>
                <MockInterview />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.CANDIDATE_INTERVIEWS}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.CANDIDATE]}>
                <CandidateInterviews />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.SUBSCRIPTION}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.CANDIDATE]}>
                <Subscription />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.SETTINGS}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.CANDIDATE]}>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.CHANGE_PASSWORD}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.CANDIDATE]}>
                <ChangePassword />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.PROFILE_SETTINGS}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.CANDIDATE]}>
                <ProfileSettings />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.MESSAGES}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.CANDIDATE]}>
                <MessagesPage />
              </ProtectedRoute>
            }
          />

          {/* HR Routes */}
          <Route
            path={ROUTES.HR_DASHBOARD}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.HR]}>
                <HRDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.HR_CANDIDATES}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.HR]}>
                <HRCandidates />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.HR_MEETINGS}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.HR]}>
                <HRMeetings />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.HR_MESSAGES}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.HR]}>
                <HRMessages />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.HR_SETTINGS}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.HR]}>
                <HRSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.HR_PROFILE}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.HR]}>
                <HRProfileSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.HR_CHANGE_PASSWORD}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.HR]}>
                <HRChangePassword />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.HR_MCQ}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.HR]}>
                <HRMCQ />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr/jobs"
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.HR]}>
                <HRJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr/post-job"
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.HR]}>
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr/jobs/edit/:id"
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.HR]}>
                <PostJob />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
