import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import EnquiryForm from '../../components/EnquiryForm';
import DocumentList from '../../components/DocumentList';
import { trackCallClick } from '../../utils/analytics';

const BITSAT = () => {
  // State variables to handle the "View More" toggles
  const [showOverview, setShowOverview] = useState(false);
  const [showWhyChoose, setShowWhyChoose] = useState(false);
  const [showMethodology, setShowMethodology] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (window.AOS) window.AOS.refresh();
  }, []);

  return (
    <div className="bitsat-page">
      <Helmet>
        <title>Best BITSAT Coaching in Hyderabad | Rankrise</title>
        <meta name="description" content="Excel in BITSAT with Rankrise's specialized coaching in Hyderabad. Targeted preparation for BITS Pilani admission with mock tests and expert guidance." />
        <meta name="keywords" content="BITSAT coaching Hyderabad, BITS Pilani preparation, BITSAT coaching center" />
        <link rel="canonical" href="https://rankrise.in/courses/bitsat" />
        <meta property="og:title" content="Best BITSAT Coaching in Hyderabad | Rankrise" />
        <meta property="og:description" content="Excel in BITSAT with Rankrise's specialized coaching in Hyderabad. Targeted preparation for BITS Pilani admission with mock tests and expert guidance." />
        <meta property="og:url" content="https://rankrise.in/courses/bitsat" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Rankrise Educational Institutions" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: 'BITSAT Coaching',
            description: "Excel in BITSAT with Rankrise's specialized coaching in Hyderabad. Targeted preparation for BITS Pilani admission with mock tests and expert guidance.",
            provider: {
              '@type': 'EducationalOrganization',
              name: 'Rankrise Educational Institutions',
              sameAs: 'https://rankrise.in',
            },
            url: 'https://rankrise.in/courses/bitsat',
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
              { '@type': 'ListItem', position: 2, name: 'BITSAT Coaching', item: 'https://rankrise.in/courses/bitsat' },
            ],
          })}
        </script>
      </Helmet>

      <div>
        <section>
          <div className="hero-section position-relative d-none d-md-block">
            <div>
              <img src="/assets/public/BITSAT-Website-Banner.webp" alt="Best BITSAT Coaching Institute in Hyderabad" style={{ width: '100%', borderBottom: '2px solid #005826' }} loading="eager" />
            </div>
          </div>
          <div className="hero-section-mobile d-md-none">
            <div className="dual-hero-slider">
              <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <div className="row">
                      <div>
                        <img src="/assets/public/hero-slider7.webp" className="img-fluid hero-img" alt="Best BITSAT Coaching Institute in Hyderabad" />
                      </div>
                    </div>
                  </div>
                  <div className="carousel-item">
                    <div className="row">
                      <div>
                        <img src="/assets/public/hero-slider8.webp" className="img-fluid hero-img" alt="Best BITSAT Coaching Institute in Hyderabad" />
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
              {/* Sidebar Section */}
              <div className="col-12 col-md-5 order-1 order-md-2 mt-3 mt-md-3">
                <div className="text-center">
                  <div style={{ background: '#ffc107' }} className="p-2">
                    <h4 className="fw-bold mb-1 admission-title">
                      ADMISSIONS OPEN
                    </h4>
                  </div>
                  <p style={{ fontSize: 20 }} className="mb-1 d-inline-flex">
                    Enquire Now or call:&nbsp;
                    <a href="tel:9948962952" onClick={() => trackCallClick('9948962952', 'bitsat_course_page')} style={{ textDecoration: 'none', color: '#000' }} className="fw-bold">
                      9948962952
                    </a>
                  </p>
                </div>
                <div className="sidebar text-white shadow enquiry-box">
                  <h3 className="fw-bold formsubheading text-center d-block w-100" style={{ fontSize: 24 }}>
                    Your Success, Our Mission
                  </h3>
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
                    <img src="/assets/public/JEE Mains & BITSAT Banner.webp" alt="JEE Mains and BITSAT Banner" className="w-100" loading="lazy" />
                  </div>
                </div>
              </div>

              {/* Main Tabs Section */}
              <div className="col-12 col-md-7 order-2 order-md-1">
                <ul className="nav nav-tabs border-0 pt-4" id="myTab" role="tablist">
                  <li className="nav-item">
                    <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#tab1" type="button">
                      Overview
                    </button>
                  </li>
                  <li className="nav-item">
                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#tab2" type="button">
                      Exam Pattern
                    </button>
                  </li>
                  <li className="nav-item">
                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#tab3" type="button">
                      Syllabus
                    </button>
                  </li>
                </ul>

                <div className="tab-content mt-3">
                  {/* Tab 1: Overview */}
                  <div className="tab-pane fade show active" id="tab1">
                    <section>
                      <div className="row mt-4">
                        <div className="section-title">
                          <h2>BITSAT Overview</h2>
                        </div>
                        <div>
                          {/* Heading elements correctly retain their red brand color identity */}
                          <h1 className="fw-bolder text-danger" style={{ fontSize: 20, color: '#dc3545' }}>Best BITSAT Coaching Institute in Hyderabad</h1>
                          <p className="Textstyle">
                            <strong className="fw-bold text-black">Rankrise</strong> is recognized as <strong className="fw-bold text-black">the Best BITSAT Coaching Institute in Hyderabad,</strong> offering a highly structured and result-oriented training program for students aiming for admission into <strong className="fw-bold text-black">BITS Pilani, Goa, and Hyderabad campuses.</strong> Our BITSAT coaching is designed to meet the exam’s unique requirements—speed, accuracy, logical thinking, and strong conceptual clarity in <strong className="fw-bold text-black">Physics, Chemistry, Mathematics, English, and Logical Reasoning.</strong>
                          </p>

                          {/* Toggleable Overview Content */}
                          {showOverview && (
                            <div className="mt-3">
                              <p className="Textstyle">
                                <strong className="fw-bold text-black">BITSAT</strong> is one of India’s most competitive engineering entrance exams, known for its online adaptive pattern and high difficulty level. At <strong className="fw-bold text-black">Rankrise,</strong> we provide a systematic approach with concept-based teaching, <strong className="fw-bold text-black">chapter-wise practice, computer-based mock tests, time-based drills, and personalized doubt sessions.</strong> Our faculty members are experts in delivering techniques that improve problem-solving speed and maximize scores in the adaptive test environment.
                              </p>
                              <p className="Textstyle">
                                With well-planned study materials, digital test platforms, and continuous performance tracking, Rankrise equips students with the confidence and skillset needed to excel in BITSAT. Join <strong className="fw-bold text-black">Rankrise</strong> and take the right step towards securing a seat in one of India’s premier engineering institutes.
                              </p>
                            </div>
                          )}

                          <button
                            onClick={() => setShowOverview(!showOverview)}
                            className="btn viewbtn mt-2"
                            type="button"
                          >
                            {showOverview ? 'View Less' : 'View More'}
                          </button>

                          <div className="mt-4">
                            <h5 className="text-danger fw-bolder" style={{ color: '#dc3545' }}>Official Websites:</h5>
                            <h5 className="d-inline">
                              <a href="https://www.bitsadmission.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>bitsadmission</a>
                            </h5>
                            <span className="mx-2">|</span>
                            <h5 className="d-inline">
                              <a href="https://www.bits-pilani.ac.in" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>bits-pilani</a>
                            </h5>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="section-title">
                          <h2>Programs Offered</h2>
                        </div>
                        <div>
                          <ul className="list-unstyled">
                            <li className="mb-2">
                              <i className="fas fa-star me-2" style={{ color: '#187b31' }} />
                              BITSAT Coaching (Integrated Intermediate Course)
                            </li>
                            <li className="mb-2">
                              <i className="fas fa-star me-2" style={{ color: '#187b31' }} />
                              BITSAT Long Term Program (For 12th Passed Students / Repeaters)
                            </li>
                            <li className="mb-2">
                              <i className="fas fa-star me-2" style={{ color: '#187b31' }} />
                              BITSAT Short Term / Crash Course
                            </li>
                            <li className="mb-2">
                              <i className="fas fa-star me-2" style={{ color: '#187b31' }} />
                              Residential &amp; Day Scholar Options Available
                            </li>
                          </ul>
                        </div>
                      </div>
                    </section>

                    <section>
                      <div className="row align-items-center mt-4">
                        {/* Why Choose Rankrise Block */}
                        <div className="mb-4">
                          <h4 className="text-success fw-bold">Why Choose Rankrise for BITSAT Coaching?</h4>
                          <p className="Textstyle mb-0">
                            Rankrise stands as one of the Best <strong className="fw-bold text-black">BITSAT</strong> Coaching Institutes in Hyderabad, offering a structured, student-focused approach to help aspirants excel in the BITS Admission Test. Our <strong className="fw-bold text-black">BITSAT</strong> program is designed to strengthen conceptual clarity, boost problem-solving speed, and improve accuracy — the three core requirements for this highly competitive exam.
                          </p>

                          {showWhyChoose && (
                            <div className="mt-2">
                              <p className="Textstyle">
                                At Rankrise, students learn through a well-planned combination of concept teaching, chapter-wise drills, daily practice sheets, computer-based mock tests, and exclusive speed-enhancement sessions. Our expert faculty guide students through every topic of Physics, Chemistry, Mathematics, English Proficiency, and Logical Reasoning with simplified explanations and effective strategies.
                              </p>
                              <p className="Textstyle">
                                We provide advanced online test simulations that mirror the actual <strong className="fw-bold text-black">BITSAT</strong> pattern, helping students build familiarity, confidence, and better time management. Regular assessments, performance reviews, and personalized support ensure continuous improvement.
                              </p>
                              <p className="Textstyle">
                                With disciplined learning, individual attention, and a holistic preparation model, Rankrise helps students aim higher and move closer to securing admission into top BITS campuses.
                              </p>
                            </div>
                          )}

                          <button
                            onClick={() => setShowWhyChoose(!showWhyChoose)}
                            className="btn btn-link fw-bold p-0 mt-2 align-items-center d-inline-flex"
                            style={{ color: '#198754', textDecoration: 'none' }}
                            type="button"
                          >
                            <span className="me-1">{showWhyChoose ? 'View Less' : 'View More'}</span>
                            <i className={`fa ${showWhyChoose ? 'fa-arrow-up' : 'fa-arrow-right'}`} aria-hidden="true" />
                          </button>
                        </div>

                        {/* Pedagogy Block */}
                        <div className="mb-3">
                          <h4 className="text-success fw-bold">Our Teaching Methodology &amp; Pedagogy</h4>

                          {/* Subheadings remain locked to Red color brand standard */}
                          <h6 className="fw-bolder text-danger mt-2" style={{ color: '#dc3545' }}>1. Concept-Focused Learning</h6>
                          <p className="Textstyle mb-2">
                            At Rankrise, we strengthen every student’s foundation by ensuring clarity in core Physics, Chemistry, Mathematics, Logical Reasoning, and English concepts. Our faculty break down complex topics into simple, structured steps, helping students understand concepts deeply and apply them effectively in BITSAT’s fast-paced exam format.
                          </p>

                          {showMethodology && (
                            <div>
                              <h6 className="fw-bolder text-danger mt-3" style={{ color: '#dc3545' }}>2. Speed &amp; Accuracy Training</h6>
                              <p className="Textstyle mb-2">
                                BITSAT demands quick thinking and precise execution. We train students through daily practice sheets, time-bound sectional exercises, and speed drills designed to enhance accuracy. This systematic approach helps students improve response time and minimize errors during the online exam.
                              </p>
                              <h6 className="fw-bolder text-danger mt-3" style={{ color: '#dc3545' }}>3. Chapter-Wise and Full-Length Practice Tests</h6>
                              <p className="Textstyle mb-2">
                                Rankrise conducts regular topic tests, online mock exams, and full-length BITSAT simulations that replicate the actual exam interface. These tests help students analyze performance, understand question patterns, and build confidence for the real exam environment.
                              </p>
                              <h6 className="fw-bolder text-danger mt-3" style={{ color: '#dc3545' }}>4. Personalized Doubt Resolution &amp; Performance Tracking</h6>
                              <p className="Textstyle mb-3">
                                Every student receives focused academic support through one-on-one doubt-clearing sessions and continuous progress monitoring. Our mentors guide students individually, helping them strengthen weak areas and improve consistently with a well-planned strategy tailored to BITSAT’s exam requirements.
                              </p>
                              <h6 className="fw-bolder text-danger mt-3" style={{ color: '#dc3545' }}>Our Pedagogy in Action (The RANKRISE Cycle)</h6>
                              <ul className="arrowicon" style={{ fontSize: 14 }}>
                                {/* List elements inside the wrapper explicitly styled as bold black text */}
                                <li><strong className="fw-bold text-black">LEARN: </strong>Engaging lectures focused on conceptual clarity.</li>
                                <li><strong className="fw-bold text-black">PRACTICE: </strong>Solving extensive problems from study materials question banks.</li>
                                <li><strong className="fw-bold text-black">TEST: </strong>Regular assessments and grand mock tests.</li>
                                <li><strong className="fw-bold text-black">ANALYZE: </strong>Detailed performance reports and identification of weak areas.</li>
                                <li><strong className="fw-bold text-black">IMPROVE: </strong>Targeted doubt clearing, remedial classes, and personalized feedback.</li>
                                <li><strong className="fw-bold text-black">REVISE: </strong>Strategic revision schedules and quick recap sessions</li>
                              </ul>
                            </div>
                          )}

                          <button
                            onClick={() => setShowMethodology(!showMethodology)}
                            className="btn btn-link fw-bold p-0 mt-2 align-items-center d-inline-flex"
                            style={{ color: '#198754', textDecoration: 'none' }}
                            type="button"
                          >
                            <span className="me-1">{showMethodology ? 'View Less' : 'View More'}</span>
                            <i className={`fa ${showMethodology ? 'fa-arrow-up' : 'fa-arrow-right'}`} aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </section>

                    {/* Mobile Courses Offered list */}
                    <div className="mt-4 d-block d-md-none">
                      <h3 className="offereds">Courses Offered</h3>
                      <ul>
                        <li><Link to="/courses/iit-jee" className="redirections">IIT-JEE Coaching</Link></li>
                        <li><Link to="/courses/neet" className="redirections">NEET Coaching</Link></li>
                        <li><Link to="/courses/eamcet" className="redirections">EAMCET Coaching</Link></li>
                        <li><Link to="/college/mpc-iit" className="redirections">INTER: MPC with IIT-JEE</Link></li>
                        <li><Link to="/college/mpc-eamcet" className="redirections">INTER: MPC with EAMCET</Link></li>
                        <li><Link to="/college/bipc-neet" className="redirections">INTER: BIPC with NEET</Link></li>
                      </ul>
                    </div>
                  </div>

                  {/* Tab 2: Exam Pattern */}
                  <div className="tab-pane fade" id="tab2">
                    <DocumentList course="bitsat" section="exam-pattern" />
                  </div>

                  {/* Tab 3: Syllabus */}
                  <div className="tab-pane fade" id="tab3">
                    <DocumentList course="bitsat" section="syllabus" />
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

export default BITSAT;