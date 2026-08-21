import { Link } from 'react-router-dom';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import EnquiryForm from '../components/EnquiryForm';
const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    if (window.AOS) window.AOS.refresh();
  }, []);

  return (
    <div className="about-page">
      <Helmet>
        <title>About Rankrise | Our Mission, Vision & Legacy Since 2011</title>
        <meta name="description" content="Learn about Rankrise Educational Institutions - Hyderabad's trusted coaching center since 2011. Our expert faculty, proven methodology, and 15,000+ trained students." />
        <meta name="keywords" content="about Rankrise, coaching institute history, Rankrise mission, best teachers Hyderabad" />
        <link rel="canonical" href="https://rankrise.in/about" />
        <meta property="og:title" content="About Rankrise | Our Mission, Vision & Legacy Since 2011" />
        <meta property="og:description" content="Learn about Rankrise Educational Institutions - Hyderabad's trusted coaching center since 2011. Our expert faculty, proven methodology, and 15,000+ trained students." />
        <meta property="og:url" content="https://rankrise.in/about" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Rankrise Educational Institutions" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://rankrise.in/' },
              { '@type': 'ListItem', position: 2, name: 'About Us', item: 'https://rankrise.in/about' },
            ],
          })}
        </script>
      </Helmet>
      <div>
        <section>
          <div className="hero-section position-relative d-none d-md-block">
            <div>
              <img src="/assets/public/aboutbanner.webp" alt="Best Coaching Institutes for NEET, IIT JEE Main & Advanced, and Olympiads - Rankrise Coaching Centers" style={{ width: '100%', borderBottom: '2px solid #005826' }} loading="eager" />
            </div>
          </div>
          <div className="hero-section-mobile d-md-none">
            <div>
              <img src="/assets/public/Aboutus-mobile.webp" alt="Best Coaching Institutes for NEET, IIT JEE Main & Advanced, and Olympiads - Rankrise Coaching Centers" style={{ width: '100%', borderBottom: '2px solid #005826' }} loading="lazy" />
            </div>
          </div>
        </section>

        <section className="my-5">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-7 col-md-7">
                <div className="row align-items-center justify-content-center mb-4">
                  <div className="col-md-2">
                    <div className="sideborder" />
                  </div>
                  <div className="col-md-5">
                    <h2 style={{ fontStyle: 'italic', color: '#006700' }} className="text-center">About RANKRISE</h2>
                  </div>
                  <div className="col-md-2">
                    <div className="sideborder" />
                  </div>
                </div>
                <h1 className="fw-bolder subHcolor" style={{ fontSize: 20 }}>Best INTER COLLEGE with IIT-JEE (Mains &amp; Advanced) |
                  NEET | EAMCET &amp; BITSAT
                  Coaching in Hyderabad.
                </h1>
                <p className="Textstyle">
                  RANKRISE Junior College is a leading institution committed to
                  providing high-quality Intermediate education integrated with
                  top-level coaching for <strong>IIT-JEE, NEET &amp; EAMCET.</strong> We focus on strong
                  fundamentals,
                  disciplined learning, and continuous academic growth, ensuring every student receives
                  the right guidance to achieve their dream career.
                </p>
                <p className="Textstyle">At <strong>Rankrise</strong>, we understand that Intermediate is the
                  foundation stage of
                  a student’s
                  academic journey. That’s why our curriculum is designed to develop clarity in concepts,
                  scientific thinking, analytical problem-solving, and exam-oriented preparation.
                  Our experienced faculty, structured study plans, and mentoring support help students
                  progress confidently at every step.
                </p>
              </div>
              <div className="col-md-5">
                <div className="sidebar text-white shadow enquiry-box ">
                  <div className="text-center">
                    <h3 className="fw-bold">ADMISSION ENQUIRY</h3>
                    <p className="formsubheading fw-bold mb-0 d-block text-center">
                      BEGIN YOUR SUCCESS JOURNEY
                    </p>
                    <p className="formsubheading fw-bold">
                      with RANKRISE!
                    </p>
                  </div>
                  <EnquiryForm />
                </div>
              </div>
            </div>
          </div></section>
        <section>
          <div className="section-title text-center">
            <h2 className="my-3">Our Vision &amp; Our Mission</h2>
          </div>
          <div className="container text-center">
            <img src="/assets/public/ourvision-ourmission.webp" alt="Rankrise vision and mission" style={{ width: '85%' }} loading="lazy" />
          </div>
        </section>
        <section className="mb-5">
          <div className="section-title text-center">
            <h2 className="my-3">We Offered for</h2>
          </div>
          <div className="container">
            <div className="course-links my-4">
              {/* First Row: 3 Equal Items */}
              <div className="row g-3 justify-content-center mb-3">
                <div className="col-12 col-md-4">
                  <Link
                    to="/college/mpc-iit"
                    className="card text-decoration-none h-100 shadow-sm border text-center p-3 hover-card"
                  >
                    <span className="fw-bold text-primary m-0">MPC with IIT-JEE Coaching</span>
                  </Link>
                </div>

                <div className="col-12 col-md-4">
                  <Link
                    to="/college/bipc-neet"
                    className="card text-decoration-none h-100 shadow-sm border text-center p-3 hover-card"
                  >
                    <span className="fw-bold text-primary m-0">BIPC with NEET Coaching</span>
                  </Link>
                </div>

                <div className="col-12 col-md-4">
                  <Link
                    to="/college/mpc-eamcet"
                    className="card text-decoration-none h-100 shadow-sm border text-center p-3 hover-card"
                  >
                    <span className="fw-bold text-primary m-0">MPC with EAMCET Coaching</span>
                  </Link>
                </div>
              </div>

              {/* Second Row: 4 Equal Items */}
              <div className="row g-3 justify-content-center">
                <div className="col-12 col-md-3">
                  <Link
                    to="/courses/iit-jee"
                    className="card text-decoration-none h-100 shadow-sm border text-center p-3 hover-card"
                  >
                    <span className="fw-bold text-primary m-0">IIT-JEE Coaching</span>
                  </Link>
                </div>

                <div className="col-12 col-md-3">
                  <Link
                    to="/courses/neet"
                    className="card text-decoration-none h-100 shadow-sm border text-center p-3 hover-card"
                  >
                    <span className="fw-bold text-primary m-0">NEET Coaching</span>
                  </Link>
                </div>

                <div className="col-12 col-md-3">
                  <Link
                    to="/courses/eamcet"
                    className="card text-decoration-none h-100 shadow-sm border text-center p-3 hover-card"
                  >
                    <span className="fw-bold text-primary m-0">EAMCET Coaching</span>
                  </Link>
                </div>

                <div className="col-12 col-md-3">
                  <Link
                    to="/courses/bitsat"
                    className="card text-decoration-none h-100 shadow-sm border text-center p-3 hover-card"
                  >
                    <span className="fw-bold text-primary m-0">BITSAT Coaching</span>
                  </Link>
                </div>
              </div>
            </div>
            <div>
              <div className="row justify-content-center">
                <div className="col-md-5 col-lg-5">
                  <h3 className="text-style1">Hostel / Campus Culture</h3>
                  <div className="my-4">
                    <p className="mb-0"><i className="fa fa-share me-2" aria-hidden="true" style={{ color: '#157015' }} />Peaceful,
                      discipline-oriented campus
                      environment</p>
                    <p className="mb-0"><i className="fa fa-share me-2" aria-hidden="true" style={{ color: '#157015' }} />Safe &amp; secure
                      residential facility with
                      caretaker monitoring</p>
                    <p><i className="fa fa-share me-2" aria-hidden="true" style={{ color: '#157015' }} />Balanced daily routine for
                      study, rest, and
                      refreshment</p>
                  </div>
                </div>
                <div className="col-md-1 col-lg-1">
                  <div className="middleborder" />
                </div>
                <div className="col-md-5 col-lg-5">
                  <h3 className="text-style1">Our Commitment</h3>
                  <div className="my-4">
                    <p>
                      We don’t just teach — we mentor, support, and build confidence.
                      At <strong>Rankrise, </strong> your education is planned, monitored, and guided,
                      so that success becomes achievable and expected.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="features-section py-0">
          <div className="container">
            <div className="section-title text-center">
              <h2 className="my-2 my-md-5">Rankrise Advantages</h2>
            </div>
            <div className="row">
              <div className="col-lg-6 col-md-6 mb-3 mb-md-0">
                <div className="feature-card">
                  <div className="card-front">
                    <div className="icon-text mb-3">
                      <i className="fa-solid fa-book-open" />
                      <h3>Expert &amp; Experienced Faculty</h3>
                    </div>
                    <ul className="features-list list-unstyled">
                      <li className="d-flex align-items-start">
                        <i className="fa-solid fa-arrow-right me-2 mt-1" />
                        <span>Highly qualified subject specialists</span>
                      </li>
                      <li className="d-flex align-items-start">
                        <i className="fa-solid fa-arrow-right me-2 mt-1" />
                        <span>Focus on concept clarity and problem-solving</span>
                      </li>
                      <li className="d-flex align-items-start">
                        <i className="fa-solid fa-arrow-right me-2 mt-1" />
                        <span>Friendly guidance and academic mentoring</span>
                      </li>
                    </ul>
                  </div>
                  <div className="card-back">
                    <img src="/assets/public/Faculty.webp" alt="Expert & Experienced Faculty at Rankrise" loading="lazy" />
                    <h3>Expert Faculty</h3>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 mb-3 mb-md-0">
                <div className="feature-card">
                  <div className="card-front">
                    <div className="icon-text mb-3">
                      <i className="fa-solid fa-diagram-project" />
                      <h3>Structured &amp; Result-Oriented Curriculum</h3>
                    </div>
                    <ul className="features-list list-unstyled">
                      <li className="d-flex align-items-start">
                        <i className="fa-solid fa-arrow-right me-2 mt-1" />
                        <span>Systematic lesson planning</span>
                      </li>
                      <li className="d-flex align-items-start">
                        <i className="fa-solid fa-arrow-right me-2 mt-1" />
                        <span>Balanced theory + application approach</span>
                      </li>
                      <li className="d-flex align-items-start">
                        <i className="fa-solid fa-arrow-right me-2 mt-1" />
                        <span>Covers board + entrance exam requirements</span>
                      </li>
                    </ul>
                  </div>
                  <div className="card-back">
                    <img src="/assets/public/Curriculum.webp" alt="Structured & Result-Oriented Curriculum" loading="lazy" />
                    <h3>Structured &amp; Result-Oriented Curriculum</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 col-md-6 mb-md-0 mb-3">
                <div className="feature-card">
                  <div className="card-front">
                    <div className="icon-text mb-3">
                      <i className="fa-solid fa-chalkboard-user" />
                      <h3>Personalized Mentorship</h3>
                    </div>
                    <ul className="features-list list-unstyled">
                      <li className="d-flex align-items-start">
                        <i className="fa-solid fa-arrow-right me-2 mt-1" />
                        <span>Individual performance tracking</span>
                      </li>
                      <li className="d-flex align-items-start">
                        <i className="fa-solid fa-arrow-right me-2 mt-1" />
                        <span>Regular doubt-clearing sessions</span>
                      </li>
                      <li className="d-flex align-items-start">
                        <i className="fa-solid fa-arrow-right me-2 mt-1" />
                        <span>Academic counseling and motivation</span>
                      </li>
                    </ul>
                  </div>
                  <div className="card-back">
                    <img src="/assets/public/PersonalizedMentorship.webp" alt="Personalized Mentorship at Rankrise" loading="lazy" />
                    <h3>Personalized Mentorship</h3>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 mb-3 mb-md-0">
                <div className="feature-card">
                  <div className="card-front">
                    <div className="icon-text mb-3">
                      <i className="fa-solid fa-list-check" />
                      <h3>Daily Practice &amp; Assignments</h3>
                    </div>
                    <ul className="features-list list-unstyled">
                      <li className="d-flex align-items-start">
                        <i className="fa-solid fa-arrow-right me-2 mt-1" />
                        <span>Topic-wise worksheets and practice sheets </span>
                      </li>
                      <li className="d-flex align-items-start">
                        <i className="fa-solid fa-arrow-right me-2 mt-1" />
                        <span>Reinforces concepts learned in class </span>
                      </li>
                      <li className="d-flex align-items-start">
                        <i className="fa-solid fa-arrow-right me-2 mt-1" />
                        <span>Builds consistency and accuracy</span>
                      </li>
                    </ul>
                  </div>
                  <div className="card-back">
                    <img src="/assets/public/DailyPracticeAssignments.webp" alt="Daily Practice & Assignments" loading="lazy" />
                    <h3>Daily Practice &amp; Assignments</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 col-md-6 mb-md-0 mb-3">
                <div className="feature-card">
                  <div className="card-front">
                    <div className="icon-text mb-3">
                      <i className="fa-solid fa-clipboard-check" />
                      <h3>Weekly &amp; Monthly Test Series</h3>
                    </div>
                    <ul className="features-list list-unstyled">
                      <li className="d-flex align-items-start">
                        <i className="fa-solid fa-arrow-right me-2 mt-1" />
                        <span>Real-exam pattern tests </span>
                      </li>
                      <li className="d-flex align-items-start">
                        <i className="fa-solid fa-arrow-right me-2 mt-1" />
                        <span>Detailed performance reports </span>
                      </li>
                      <li className="d-flex align-items-start">
                        <i className="fa-solid fa-arrow-right me-2 mt-1" />
                        <span>Helps improve speed and time management</span>
                      </li>
                    </ul>
                  </div>
                  <div className="card-back">
                    <img src="/assets/public/WeeklyMonthlyTestSeries.webp" alt="Weekly & Monthly Test Series" loading="lazy" />
                    <h3>Weekly &amp; Monthly Test Series</h3>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 mb-3 mb-md-0">
                <div className="feature-card">
                  <div className="card-front">
                    <div className="icon-text mb-3">
                      <i className="fa-solid fa-trophy" />
                      <h3>Strong Competitive Exam Training</h3>
                    </div>
                    <ul className="features-list list-unstyled">
                      <li className="d-flex align-items-start">
                        <i className="fa-solid fa-arrow-right me-2 mt-1" />
                        <span>NEET / IIT-JEE / EAMCET targeted preparation </span>
                      </li>
                      <li className="d-flex align-items-start">
                        <i className="fa-solid fa-arrow-right me-2 mt-1" />
                        <span>Previous year papers &amp; model questions</span>
                      </li>
                      <li className="d-flex align-items-start">
                        <i className="fa-solid fa-arrow-right me-2 mt-1" />
                        <span>Techniques to handle difficult questions</span>
                      </li>
                    </ul>
                  </div>
                  <div className="card-back">
                    <img src="/assets/public/StrongCompetitiveExamTraining.webp" alt="Strong Competitive Exam Training" loading="lazy" />
                    <h3>Strong Competitive Exam Training</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 col-md-6 mb-md-0 mb-3">
                <div className="feature-card">
                  <div className="card-front">
                    <div className="icon-text mb-3">
                      <i className="fa-solid fa-people-group" />
                      <h3>Disciplined &amp; Student-Friendly Environment</h3>
                    </div>
                    <ul className="features-list list-unstyled">
                      <li className="d-flex align-items-start">
                        <i className="fa-solid fa-arrow-right me-2 mt-1" />
                        <span>Structured study hours and supervision </span>
                      </li>
                      <li className="d-flex align-items-start">
                        <i className="fa-solid fa-arrow-right me-2 mt-1" />
                        <span>Focus on concentration and productivity</span>
                      </li>
                      <li className="d-flex align-items-start">
                        <i className="fa-solid fa-arrow-right me-2 mt-1" />
                        <span>Supportive academic atmosphere</span>
                      </li>
                    </ul>
                  </div>
                  <div className="card-back">
                    <img src="/assets/public/discipline.webp" alt="Disciplined & Student-Friendly Environment" loading="lazy" />
                    <h3>Disciplined &amp; Student-Friendly Environment</h3>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 mb-3 mb-md-0">
                <div className="feature-card">
                  <div className="card-front">
                    <div className="icon-text mb-3">
                      <i className="fa-solid fa-laptop-code" />
                      <h3>Smart Classrooms &amp; Digital Support</h3>
                    </div>
                    <ul className="features-list list-unstyled">
                      <li className="d-flex align-items-start">
                        <i className="fa-solid fa-arrow-right me-2 mt-1" />
                        <span> Visual learning tools to enhance understanding </span>
                      </li>
                      <li className="d-flex align-items-start">
                        <i className="fa-solid fa-arrow-right me-2 mt-1" />
                        <span> Recorded sessions / extra learning aid (if needed)</span>
                      </li>
                      <li className="d-flex align-items-start">
                        <i className="fa-solid fa-arrow-right me-2 mt-1" />
                        <span>Modern educational facilities</span>
                      </li>
                    </ul>
                  </div>
                  <div className="card-back">
                    <img src="/assets/public/SmartClassroomsDigital Support.webp" alt="Smart Classrooms & Digital Support" loading="lazy" />
                    <h3>Smart Classrooms &amp; Digital Support</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 col-md-6 mb-md-0 mb-3">
                <div className="feature-card">
                  <div className="card-front">
                    <div className="icon-text mb-3">
                      <i className="fa-solid fa-shield-halved" />
                      <h3>Safe &amp; Supervised Hostel Facilities</h3>
                    </div>
                    <ul className="features-list list-unstyled">
                      <li className="d-flex align-items-start">
                        <i className="fa-solid fa-arrow-right me-2 mt-1" />
                        <span> Separate hostels for boys and girls </span>
                      </li>
                      <li className="d-flex align-items-start">
                        <i className="fa-solid fa-arrow-right me-2 mt-1" />
                        <span> Hygienic food &amp; study-hour monitoring</span>
                      </li>
                      <li className="d-flex align-items-start">
                        <i className="fa-solid fa-arrow-right me-2 mt-1" />
                        <span>CCTV security and warden support</span>
                      </li>
                    </ul>
                  </div>
                  <div className="card-back">
                    <img src="/assets/public/SafeSupervisedHostelFacilities.webp" alt="Safe & Supervised Hostel Facilities" loading="lazy" />
                    <h3>Safe &amp; Supervised Hostel Facilities</h3>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 mb-3 mb-md-0">
                <div className="feature-card">
                  <div className="card-front">
                    <div className="icon-text mb-3">
                      <i className="fa-solid fa-chart-line" />
                      <h3>Proven Track Record of Results</h3>
                    </div>
                    <ul className="features-list list-unstyled">
                      <li className="d-flex align-items-start">
                        <i className="fa-solid fa-arrow-right me-2 mt-1" />
                        <span> Students placed in top medical &amp; engineering colleges </span>
                      </li>
                      <li className="d-flex align-items-start">
                        <i className="fa-solid fa-arrow-right me-2 mt-1" />
                        <span> Consistent rank holders every year</span>
                      </li>
                      <li className="d-flex align-items-start">
                        <i className="fa-solid fa-arrow-right me-2 mt-1" />
                        <span>Trusted by parents and toppers alike</span>
                      </li>
                    </ul>
                  </div>
                  <div className="card-back">
                    <img src="/assets/public/ProvenTrackRecordofResults.webp" alt="Proven Track Record of Results" loading="lazy" />
                    <h3>Proven Track Record of Results</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


      </div>

    </div>

  );
};

export default About;
