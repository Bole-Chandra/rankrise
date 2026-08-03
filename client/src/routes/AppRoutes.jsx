import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Home from '../pages/Home';
import About from '../pages/About';
import Admissions from '../pages/Admissions';
import Blogs from '../pages/Blogs';
import BlogPostView from '../pages/BlogPostView';
import Contact from '../pages/Contact';
import Gallery from '../pages/Gallery';
import VideoGallery from '../pages/VideoGallery';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Signup from '../pages/Signup';
import UserLogin from '../pages/UserLogin';
import VerifyEmail from '../pages/VerifyEmail';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import UserDashboard from '../pages/UserDashboard';
import ProtectedUserRoute from '../components/ProtectedUserRoute';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsConditions from '../pages/TermsConditions';

// Course Pages
import IITJEE from '../pages/Courses/IITJEE';
import NEET from '../pages/Courses/NEET';
import EAMCET from '../pages/Courses/EAMCET';
import BITSAT from '../pages/Courses/BITSAT';

// College Pages
import MPC_IIT from '../pages/College/MPC_IIT';
import BiPC_NEET from '../pages/College/BiPC_NEET';
import MPC_EAMCET from '../pages/College/MPC_EAMCET';

// Landing Pages
import TopIIT from '../pages/TopIIT';
import TopNEET from '../pages/TopNEET';
import TopEAMCET from '../pages/TopEAMCET';

const AppRoutes = () => {
  return (
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
  );
};

export default AppRoutes;
