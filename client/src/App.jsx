import React, { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import TopInfoBar from './components/TopInfoBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWidgets from './components/FloatingWidgets';
import ContactModal from './components/ContactModal';
import AppRoutes from './routes/AppRoutes';
import { trackPageView } from './utils/analytics';
import { UserAuthProvider } from './context/UserAuthContext';
import './index.css';

// Scroll to top on every route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    // Re-init AOS animations on page change
    if (window.AOS) {
      window.AOS.refresh();
    }
  }, [pathname]);
  return null;
};

// Fire a GA4 page_view on every route change (gtag's automatic page_view
// only fires once, when the script first loads — this covers client-side
// navigation, which is most of the traffic in a single-page app).
const PageViewTracker = () => {
  const location = useLocation();
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);
  return null;
};

// Layout wrapper that hides public chrome on admin pages
const AppLayout = () => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      <PageViewTracker />
      {!isAdmin && <TopInfoBar />}
      {!isAdmin && <Navbar />}
      
      <main className={isAdmin ? '' : 'page-content'}>
        <AppRoutes />
      </main>

      {!isAdmin && <Footer />}
      {!isAdmin && <FloatingWidgets />}
      {!isAdmin && <ContactModal />}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <UserAuthProvider>
        <AppLayout />
      </UserAuthProvider>
    </BrowserRouter>
  );
}

export default App;
