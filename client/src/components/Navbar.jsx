import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-2">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src="/assets/public/Rankriselogo.webp" alt="Rankrise Logo" height="50" loading="eager" />
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar"
          aria-controls="mainNavbar" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="mainNavbar">
          <ul className="navbar-nav mb-2 mb-lg-0 text-md-center text-start">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/')}`} to="/">HOME</Link>
            </li>

            <li className="nav-item">
              <Link className={`nav-link ${isActive('/aboutus.html')}`} to="/about">ABOUT US</Link>
            </li>

            {/* LONG TERM & SHORT TERM DROPDOWN */}
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="longTermDropdown" data-bs-toggle="dropdown"
                aria-expanded="false">
                LONG TERM & SHORT TERM
              </a>
              <ul className="dropdown-menu" aria-labelledby="longTermDropdown">
                <li><Link className="dropdown-item" to="/courses/iit-jee">IIT-JEE Coaching</Link></li>
                <li><Link className="dropdown-item" to="/courses/neet">NEET Coaching</Link></li>
                <li><Link className="dropdown-item" to="/courses/eamcet">EAMCET Coaching</Link></li>
                <li><Link className="dropdown-item" to="/courses/bitsat">BITSAT Coaching</Link></li>
              </ul>
            </li>

            {/* JUNIOR COLLEGE DROPDOWN */}
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="jrCollegeDropdown" role="button" data-bs-toggle="dropdown"
                aria-expanded="false">
                JUNIOR COLLEGE
              </a>
              <ul className="dropdown-menu" aria-labelledby="jrCollegeDropdown">
                <li><Link className="dropdown-item" to="/college/mpc-iit">MPC with IIT-JEE</Link></li>
                <li><Link className="dropdown-item" to="/college/bipc-neet">BIPC with NEET</Link></li>
                <li><Link className="dropdown-item" to="/college/mpc-eamcet">MPC with EAMCET</Link></li>
              </ul>
            </li>
            {/* GALLERY DROPDOWN */}
            <li className="nav-item dropdown">
              <a className={`nav-link dropdown-toggle ${isActive('/gallery') || isActive('/gallery/video') || isActive('/gallery/photo') ? 'active' : ''}`}
                href="#" id="galleryDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                GALLERY
              </a>
              <ul className="dropdown-menu" aria-labelledby="galleryDropdown">
                <li><Link className="dropdown-item" to="/gallery/photo">Photo Gallery</Link></li>
                <li><Link className="dropdown-item" to="/gallery/video">Video Gallery</Link></li>
              </ul>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/blog.html') || isActive('/blog') ? 'active' : ''}`} to="/blog">BLOG</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/contact.html')}`} to="/contact">CONTACT US</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
