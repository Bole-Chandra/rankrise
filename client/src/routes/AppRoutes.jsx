import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Home stays eagerly loaded — it's the single most common entry point
// (direct visits, ads, search results), so there's no reason to make it
// wait on an extra network round-trip the way less-common pages can.
import Home from '../pages/Home';
import ProtectedUserRoute from '../components/ProtectedUserRoute';

// Everything else loads on demand — this is what actually fixes "reduce
// unused JavaScript": a visitor to the homepage no longer downloads the
// Admin dashboard, the Quill rich-text blog editor, or any other page
// they didn't ask for.
const About = lazy(() => import('../pages/About'));
const Admissions = lazy(() => import('../pages/Admissions'));
const Blogs = lazy(() => import('../pages/Blogs'));
const BlogPostView = lazy(() => import('../pages/BlogPostView'));
const Contact = lazy(() => import('../pages/Contact'));
const Gallery = lazy(() => import('../pages/Gallery'));
const VideoGallery = lazy(() => import('../pages/VideoGallery'));
const Login = lazy(() => import('../pages/Login'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Signup = lazy(() => import('../pages/Signup'));
const UserLogin = lazy(() => import('../pages/UserLogin'));
const VerifyEmail = lazy(() => import('../pages/VerifyEmail'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/ResetPassword'));
const UserDashboard = lazy(() => import('../pages/UserDashboard'));
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy'));
const TermsConditions = lazy(() => import('../pages/TermsConditions'));

// Course Pages
const IITJEE = lazy(() => import('../pages/Courses/IITJEE'));
const NEET = lazy(() => import('../pages/Courses/NEET'));
const EAMCET = lazy(() => import('../pages/Courses/EAMCET'));
const BITSAT = lazy(() => import('../pages/Courses/BITSAT'));

// College Pages
const MPC_IIT = lazy(() => import('../pages/College/MPC_IIT'));
const BiPC_NEET = lazy(() => import('../pages/College/BiPC_NEET'));
const MPC_EAMCET = lazy(() => import('../pages/College/MPC_EAMCET'));

// Landing Pages
const TopIIT = lazy(() => import('../pages/TopIIT'));
const TopNEET = lazy(() => import('../pages/TopNEET'));
const TopEAMCET = lazy(() => import('../pages/TopEAMCET'));

// Minimal, unobtrusive loading state for the brief moment a lazy page's JS
// is being fetched — deliberately plain so it never looks like a bug.
const RouteFallback = () => (
  <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div className="spinner-border text-success" role="status" style={{ width: '2.5rem', height: '2.5rem' }}>
      <span className="visually-hidden">Loading…</span>
    </div>
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/index.html" element={<Navigate replace to="/" />} />

        {/* Main Pages */}
        <Route path="/about" element={<About />} />
        <Route path="/aboutus.html" element={<Navigate replace to="/about" />} />

        <Route path="/admissions" element={<Admissions />} />

        <Route path="/contact" element={<Contact />} />
        <Route path="/contact.html" element={<Navigate replace to="/contact" />} />
        <Route path="/conatct.html" element={<Navigate replace to="/contact" />} />

        <Route path="/blog" element={<Blogs />} />
        <Route path="/blog.html" element={<Navigate replace to="/blog" />} />
        <Route path="/blog/:slug" element={<BlogPostView />} />

        <Route path="/gallery" element={<Navigate replace to="/gallery/photo" />} />
        <Route path="/gallery/photo" element={<Gallery />} />
        <Route path="/gallery/video" element={<VideoGallery />} />
        <Route path="/gallery.html" element={<Navigate replace to="/gallery/photo" />} />

        {/* Admin Panel */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />

        {/* Student / Teacher Auth + Dashboard */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard" element={<ProtectedUserRoute><UserDashboard /></ProtectedUserRoute>} />

        {/* Policies */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/privacy-policy.html" element={<Navigate replace to="/privacy-policy" />} />

        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/terms-conditions.html" element={<Navigate replace to="/terms-conditions" />} />

        {/* Coaching Pages */}
        <Route path="/courses/iit-jee" element={<IITJEE />} />
        <Route path="/best-iit-coaching-in-hyderabad.html" element={<Navigate replace to="/courses/iit-jee" />} />

        <Route path="/courses/neet" element={<NEET />} />
        <Route path="/best-neet-coaching-in-hyderabad.html" element={<Navigate replace to="/courses/neet" />} />

        <Route path="/courses/eamcet" element={<EAMCET />} />
        <Route path="/best-eamcet-coaching-in-hyderabad.html" element={<Navigate replace to="/courses/eamcet" />} />

        <Route path="/courses/bitsat" element={<BITSAT />} />
        <Route path="/best-bitsat-coaching-in-hyderabad.html" element={<Navigate replace to="/courses/bitsat" />} />

        {/* Junior College Pages */}
        <Route path="/college/mpc-iit" element={<MPC_IIT />} />
        <Route path="/mpc-with-iit-coaching-hyderabad.html" element={<Navigate replace to="/college/mpc-iit" />} />

        <Route path="/college/bipc-neet" element={<BiPC_NEET />} />
        <Route path="/bipc-with-neet-coaching-hyderabad.html" element={<Navigate replace to="/college/bipc-neet" />} />

        <Route path="/college/mpc-eamcet" element={<MPC_EAMCET />} />
        <Route path="/mpc-with-eamcet-coaching-hyderabad.html" element={<Navigate replace to="/college/mpc-eamcet" />} />

        {/* Landing Comparison Pages */}
        <Route path="/top-iit-institutes" element={<TopIIT />} />
        <Route path="/Top-IIT-Coaching-Institutes-in-Hyderabad.html" element={<Navigate replace to="/top-iit-institutes" />} />

        <Route path="/top-neet-institutes" element={<TopNEET />} />
        <Route path="/Top-NEET-Coaching-Institute-in-Hyderabad.html" element={<Navigate replace to="/top-neet-institutes" />} />

        <Route path="/top-eamcet-institutes" element={<TopEAMCET />} />
        <Route path="/Top-EAMCET-Coaching-Institutes-in-Hyderabad.html" element={<Navigate replace to="/top-eamcet-institutes" />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
