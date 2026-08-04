import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import EnquiryForm from '../../components/EnquiryForm';
import { trackCallClick } from '../../utils/analytics';

const EAMCET = () => {
  // State hooks to control the view toggles locally
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);
  const [isWhyExpanded, setIsWhyExpanded] = useState(false);
  const [isTeachExpanded, setIsTeachExpanded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (window.AOS) window.AOS.refresh();
  }, []);

  return (
    <div className="eamcet-page">
      <Helmet>
        <title>Best EAMCET Coaching in Hyderabad | Rankrise</title>
        <meta name="description" content="Top EAMCET coaching institute in Hyderabad. Rankrise provides comprehensive TS/AP EAMCET preparation with expert faculty and result-oriented methodology." />
        <meta name="keywords" content="EAMCET coaching Hyderabad, best EAMCET institute, TS EAMCET preparation, AP EAMCET coaching" />
        <link rel="canonical" href="https://rankrise.in/courses/eamcet" />
        <meta property="og:title" content="Best EAMCET Coaching in Hyderabad | Rankrise" />
        <meta property="og:description" content="Top EAMCET coaching institute in Hyderabad. Rankrise provides comprehensive TS/AP EAMCET preparation with expert faculty and result-oriented methodology." />
        <meta property="og:url" content="https://rankrise.in/courses/eamcet" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Rankrise Educational Institutions" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: 'EAMCET Coaching',
            description: "Top EAMCET coaching institute in Hyderabad. Rankrise provides comprehensive TS/AP EAMCET preparation with expert faculty and result-oriented methodology.",
            provider: {
              '@type': 'EducationalOrganization',
              name: 'Rankrise Educational Institutions',
              sameAs: 'https://rankrise.in',
            },
            url: 'https://rankrise.in/courses/eamcet',
            courseMode: ['Onsite'],
            educationalCredentialAwarded: 'Coaching Completion',
            offers: {
              '@type': 'Offer',
              category: 'Coaching Program',
              availability: 'https://schema.org/InStock',
            },
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://rankrise.in/' },
              { '@type': 'ListItem', position: 2, name: 'EAMCET Coaching', item: 'https://rankrise.in/courses/eamcet' },
            ],
          })}
        </script>
      </Helmet>
      <div>
        <section>
          <div className="hero-section position-relative d-none d-md-block">
            <div>
              <img src="/assets/public/EAMCET-Website-Banner.webp" alt="Best EAMCET Coaching Institute in Hyderabad" style={{ width: '100%', borderBottom: '2px solid #005826' }} loading="eager" />
            </div>
          </div>
          <div className="hero-section-mobile d-md-none">
            <div className="dual-hero-slider">
              <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <div className="row">
                      <div>
                        <img src="/assets/public/hero-slider5.webp" className="img-fluid hero-img" alt="Best EAMCET Coaching Institute in Hyderabad" />
                      </div>
                    </div>
                  </div>
                  <div className="carousel-item">
                    <div className="row">
                      <div>
                        <img src="/assets/public/hero-slider6.webp" className="img-fluid hero-img" alt="Best EAMCET Coaching Institute in Hyderabad" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-5 order-1 order-md-2 mt-3 mt-md-3">
                <div className="text-center">
                  <div style={{ background: '#ffc107' }} className="p-2">
                    <h4 className="fw-bold mb-1 admission-title">
                      ADMISSION OPEN for 2026–2027
                    </h4>
                  </div>
                  <p style={{ fontSize: 20 }} className="mb-1 d-inline-flex">
                    Enquire Now or call:&nbsp;
                    <a href="tel:9948962952" onClick={() => trackCallClick('9948962952', 'eamcet_course_page')} style={{ textDecoration: 'none', color: '#000' }} className="fw-bold">
                      9948962952
                    </a>
                  </p>
                </div>
                <div className="sidebar text-white shadow enquiry-box">
                  <h3 className="fw-bold formsubheading text-center d-inline-flex" style={{ fontSize: 24 }}>Your Success, Our Mission</h3>
                  <EnquiryForm />
                </div>
                <div className="my-3 d-none d-md-block">
                  <h3 className="offereds">Courses Offered</h3>
                  <div className="row">
                    <div className="col-md-5 p-md-0">
                      <ul>
                        <li><Link to="/courses/iit-jee" className="redirections">IIT-JEE Coaching</Link></li>
                        <li><Link to="/courses/neet" className="redirections">NEET Coaching</Link></li>
                        <li><Link to="/courses/eamcet" className="redirections">EAMCET Coaching</Link></li>
                      </ul>
                    </div>
                    <div className="col-md-7">
                      <ul>
                        <li><Link to="/college/mpc-iit" className="redirections">INTER: MPC with IIT-JEE</Link></li>
                        <li><Link to="/college/mpc-eamcet" className="redirections">INTER: MPC with EAMCET</Link></li>
                        <li><Link to="/college/bipc-neet" className="redirections">INTER: BIPC with NEET</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="d-none d-md-block">
                    <img src="/assets/public/JEE Mains & BITSAT Banner.webp" alt="Rankrise Banners" className="w-100" loading="lazy" />
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-7 order-2 order-md-1">
                <ul className="nav nav-tabs border-0 pt-4" id="myTab" role="tablist">
                  <li className="nav-item">
                    <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#tab1">
                      Overview
                    </button>
                  </li>
                  <li className="nav-item">
                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#tab2">
                      Exam Pattern
                    </button>
                  </li>
                  <li className="nav-item">
                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#tab3">
                      Syllabus
                    </button>
                  </li>
                </ul>
                <div className="tab-content mt-3">
                  <div className="tab-pane fade show active" id="tab1">
                    <section>
                      <div className="row mt-4">
                        <div className="section-title">
                          <h2>EAMCET Overview</h2>
                          <h3 />
                        </div>
                        <div>
                          <div>
                            <h1 className="fw-bolder text-danger" style={{ fontSize: '20px', color: '#dc3545' }}>Best EAMCET Coaching Institute in Hyderabad</h1>
                            <p className="Textstyle">
                              <strong>Rankrise</strong> widely stands as <strong>the Best EAMCET Coaching Institute in Hyderabad,</strong> offering a structured and result-oriented approach for students preparing for TS EAMCET and AP EAMCET. Our coaching program is designed to build a strong foundation in <strong>Mathematics, Physics, Chemistry and Biology,</strong> enabling students to score high and secure admissions in top engineering and agricultural colleges.
                            </p>

                            {isOverviewExpanded && (
                              <div className="mt-3">
                                <p className="Textstyle">
                                  The <strong>EAMCET</strong> exam evaluates speed, accuracy, and conceptual clarity. To meet these requirements, <strong>Rankrise</strong> provides a comprehensive training system that includes <strong>chapter-wise lessons, topic-based worksheets, daily practice sessions, and full-length mock tests</strong> that replicate the actual exam pattern.
                                </p>
                                <p className="Textstyle">
                                  Our experienced faculty focus on simplifying concepts, improving problem-solving speed, and strengthening exam strategies. With personalized doubt clearing, performance tracking, and regular feedback, students gain the confidence needed to excel.
                                </p>
                                <p className="Textstyle">
                                  Rankrise’s proven teaching methodology, disciplined learning environment, and consistent results make it the trusted choice for thousands of aspirants aiming to achieve top EAMCET ranks in Telangana and Andhra Pradesh.
                                </p>
                              </div>
                            )}

                            <button
                              onClick={() => setIsOverviewExpanded(!isOverviewExpanded)}
                              className="btn viewbtn mt-2"
                            >
                              {isOverviewExpanded ? 'View Less' : 'View More'}
                            </button>
                          </div>
                          <div className="mt-3">
                            <div>
                              <h5 className="fw-bolder text-danger" style={{ color: '#dc3545' }}>Official Websites:</h5>
                              <h5 className="d-inline">
                                <a href="https://eapcet.tsche.ac.in" style={{ textDecoration: 'none' }}>eapcet.tsche.ac.in</a>
                              </h5>
                              <span className="mx-2">|</span>
                              <h5 className="d-inline">
                                <a href="https://cets.apsche.ap.gov.in" style={{ textDecoration: 'none' }}>cets.apsche.ap.gov.in</a>
                              </h5>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div>
                          <div className="section-title">
                            <h2>Programs Offered</h2>
                          </div>
                          <div>
                            <ul className="list-unstyled">
                              <li className="mb-2">
                                <i className="fas fa-star me-2" style={{ color: '#187b31' }} />
                                EAMCET Coaching (Integrated Intermediate Course)
                              </li>
                              <li className="mb-2">
                                <i className="fas fa-star me-2" style={{ color: '#187b31' }} />
                                EAMCET Long Term Program (For 12th Passed Students / Repeaters)
                              </li>
                              <li className="mb-2">
                                <i className="fas fa-star me-2" style={{ color: '#187b31' }} />
                                EAMCET Short Term / Crash Course
                              </li>
                              <li className="mb-2">
                                <i className="fas fa-star me-2" style={{ color: '#187b31' }} />
                                Residential &amp; Day Scholar Options Available
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </section>
                    <section>
                      <div className="row align-items-center">
                        <div className="mb-3">
                          <h4 className="text-success fw-bold">Why Choose Rankrise for EAMCET <br />Coaching?</h4>

                          <p className="Textstyle">
                            Rankrise is widely preferred by students seeking the Best <strong>EAMCET</strong> Coaching Institute in Hyderabad because of our focused teaching approach and exam-driven learning system. Our <strong>EAMCET</strong> program is designed to strengthen conceptual understanding in Mathematics, Physics, and Chemistry while improving speed, accuracy, and problem-solving skills needed for the TS &amp; AP EAMCET exam.
                          </p>

                          {isWhyExpanded && (
                            <div>
                              <p className="Textstyle">
                                Our experienced faculty simplify complex topics through structured lessons, daily practice questions, and short-cut methods that help students solve questions quickly during the exam. Students receive regular chapter-wise tests, grand tests, and performance analysis to track improvement continuously.
                              </p>
                              <p className="Textstyle">
                                Rankrise provides a supportive learning environment where each student receives guidance through doubt-clearing sessions, assignments, and personalized feedback. Our curriculum aligns perfectly with the <strong>EAMCET</strong> pattern, ensuring that students master both theoretical concepts and application-based problems.
                              </p>
                              <p className="Textstyle">
                                With disciplined study plans, focused mentoring, and consistent practice, Rankrise helps students achieve strong ranks and gain admission into leading engineering colleges across Telangana and Andhra Pradesh.
                              </p>
                            </div>
                          )}

                          <button
                            onClick={() => setIsWhyExpanded(!isWhyExpanded)}
                            className="fw-bold border-0 bg-transparent p-0 mt-2 d-flex align-items-center"
                            style={{ color: '#198754', textDecoration: 'none' }}
                          >
                            <span className="toggle-text me-1">{isWhyExpanded ? 'View Less' : 'View More'}</span>
                            <i className={`fa ${isWhyExpanded ? 'fa-arrow-left' : 'fa-arrow-right'}`} aria-hidden="true" />
                          </button>
                        </div>

                        <div className="mb-3">
                          <h4 className="text-success fw-bold">Our Teaching Methodology &amp; Pedagogy</h4>

                          <div>
                            <h6 className="fw-bolder text-danger" style={{ color: '#dc3545' }}>1. Concept-Focused Classroom Teaching</h6>
                            <p className="Textstyle">
                              At Rankrise, every EAMCET topic is taught with complete conceptual clarity, ensuring students build strong fundamentals in Mathematics, Physics, Chemistry, and Biology. Our structured lessons help students understand core principles rather than memorizing shortcuts, making problem-solving easier and more effective.
                            </p>
                          </div>

                          {isTeachExpanded && (
                            <div>
                              <h6 className="fw-bolder text-danger" style={{ color: '#dc3545' }}>2. Daily Practice Worksheets &amp; Application Training</h6>
                              <p className="Textstyle">
                                To strengthen learning, students receive daily practice sheets that cover formula-based questions, conceptual problems, and application-level exercises. This consistent practice boosts speed, accuracy, and familiarity with the EAMCET question pattern.
                              </p>
                              <h6 className="fw-bolder text-danger" style={{ color: '#dc3545' }}>3. Weekly Tests &amp; Performance Analysis</h6>
                              <p className="Textstyle">
                                Regular chapter-wise and mixed tests help students monitor progress and understand where improvement is needed. Each test is followed by detailed analysis, feedback, and error-correction support, enabling students to steadily increase their scores.
                              </p>
                              <h6 className="fw-bolder text-danger" style={{ color: '#dc3545' }}>4. Doubt-Clarification &amp; Personalized Guidance</h6>
                              <p className="Textstyle">
                                We offer dedicated doubt-clearing sessions where students receive individual support from expert mentors. This personalized assistance resolves learning gaps quickly and helps students stay confident and exam-ready throughout their preparation.
                              </p>
                              <h6 className="fw-bolder text-danger" style={{ color: '#dc3545' }}>Our Pedagogy in Action (The RANKRISE Cycle)</h6>
                              <ul className="arrowicon" style={{ fontSize: 14 }}>
                                <li><strong>LEARN: </strong>Engaging lectures focused on conceptual clarity.</li>
                                <li><strong>PRACTICE: </strong>Solving extensive problems from study materials question banks.</li>
                                <li><strong>TEST: </strong>Regular assessments and grand mock tests.</li>
                                <li><strong>ANALYZE: </strong>Detailed performance reports and identification of weak areas.</li>
                                <li><strong>IMPROVE: </strong>Targeted doubt clearing, remedial classes, and personalized feedback.</li>
                                <li><strong>REVISE: </strong>Strategic revision schedules and quick recap sessions</li>
                              </ul>
                            </div>
                          )}

                          <button
                            onClick={() => setIsTeachExpanded(!isTeachExpanded)}
                            className="fw-bold border-0 bg-transparent p-0 mt-2 d-flex align-items-center"
                            style={{ color: '#198754', textDecoration: 'none' }}
                          >
                            <span className="toggle-text me-1">{isTeachExpanded ? 'View Less' : 'View More'}</span>
                            <i className={`fa ${isTeachExpanded ? 'fa-arrow-left' : 'fa-arrow-right'}`} aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </section>
                    <div className="mt-4 d-block d-md-none">
                      <h3 className="offereds">Courses Offered</h3>
                      <ul>
                        <li><Link to="/courses/iit-jee" className="redirections">IIT-JEE Coaching</Link></li>
                        <li><Link to="/courses/neet" className="redirections">NEET Coaching</Link></li>
                        <li><Link to="/courses/bitsat" className="redirections">BITSAT Coaching</Link></li>
                        <li><Link to="/college/mpc-iit" className="redirections">INTER: MPC with IIT-JEE</Link></li>
                        <li><Link to="/college/mpc-eamcet" className="redirections">INTER: MPC with EAMCET</Link></li>
                        <li><Link to="/college/bipc-neet" className="redirections">INTER: BIPC with NEET</Link></li>
                      </ul>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="tab2">
                    <section className="coming-section my-5">
                      <h2 className="coming-title fw-bold display-6">
                        <span className="yellow">COMING</span> SOON
                      </h2>
                      <p className="mt-3 fs-5">Stay tuned for something amazing!</p>
                    </section>
                  </div>
                  <div className="tab-pane fade" id="tab3">
                    <section className="coming-section my-5">
                      <h2 className="coming-title fw-bold display-6">
                        <span className="yellow">COMING</span> SOON
                      </h2>
                      <p className="mt-3 fs-5">Stay tuned for something amazing!</p>
                    </section>
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

export default EAMCET;