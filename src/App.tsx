
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Index from "./pages/Index";
import CVDatabase from "./pages/CVDatabase";
import ContactUs from "./pages/ContactUs";
import OurServices from "./pages/OurServices";
import LoginRegister from "./pages/LoginRegister";
import Humanitarian from "./pages/Humanitarian";
import SubmitJob from "./pages/SubmitJob";
import ViewJobs from "./pages/ViewJobs";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminAds from "./pages/admin/AdminAds";
import AdminContacts from "./pages/admin/AdminContacts";
import AdminContent from "./pages/admin/AdminContent";
import AdminMedia from "./pages/admin/AdminMedia";

function App() {
  return (
    <Router>
      <Routes>
        {/* ── Public routes ─────────────────────────────── */}
        <Route path="/" element={<Index />} />
        <Route path="/cv-database" element={<CVDatabase />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/our-services" element={<OurServices />} />
        <Route path="/humanitarian" element={<Humanitarian />} />
        <Route path="/login-register" element={<LoginRegister />} />

        {/* ── Protected routes (login required) ─────────── */}
        <Route
          path="/view-jobs"
          element={
            <ProtectedRoute>
              <ViewJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/submit-job"
          element={
            <ProtectedRoute>
              <SubmitJob />
            </ProtectedRoute>
          }
        />

        {/* ── Admin routes (session check inside layout) ── */}
        <Route path="/ssuunnlliitt" element={<AdminLogin />} />
        <Route path="/ssuunnlliitt/dashboard" element={<AdminDashboard />} />
        <Route path="/ssuunnlliitt/jobs" element={<AdminJobs />} />
        <Route path="/ssuunnlliitt/ads" element={<AdminAds />} />
        <Route path="/ssuunnlliitt/contacts" element={<AdminContacts />} />
        <Route path="/ssuunnlliitt/content" element={<AdminContent />} />
        <Route path="/ssuunnlliitt/media" element={<AdminMedia />} />
      </Routes>
    </Router>
  );
}

export default App;
