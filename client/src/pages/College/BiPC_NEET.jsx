import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import EnquiryForm from '../../components/EnquiryForm';
import DocumentList from '../../components/DocumentList';
import { trackCallClick } from '../../utils/analytics';

const BiPC_NEET = () => {
  // State variables to handle the "View More" toggles matching the working pattern
  const [showOverview, setShowOverview] = useState(false);
  const [showWhyChoose, setShowWhyChoose] = useState(false);
  const [showMethodology, setShowMethodology] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (window.AOS) window.AOS.refresh();
  }, []);

  return (
    <div className="bipcneet-page">
      <Helmet>
        <title>BiPC with NEET Integrated Course | Rankrise Jr College</title>
        <meta name="description" content="Rankrise BiPC with NEET integrated coaching in Hyderabad. 2-year Intermediate + NEET program with expert Biology faculty and medical entrance preparation." />
        <meta name="keywords" content="BiPC NEET Hyderabad, intermediate with NEET, junior college NEET coaching" />
        <link rel="canonical" href="https://rankrise.in/college/bipc-neet" />
        <meta property="og:title" content="BiPC with NEET Integrated Course | Rankrise Jr College" />
        <meta property="og:description" content="Rankrise BiPC with NEET integrated coaching in Hyderabad. 2-year Intermediate + NEET program with expert Biology faculty and medical entrance preparation." />
        <meta property="og:url" content="https://rankrise.in/college/bipc-neet" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Rankrise Educational Institutions" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: 'BiPC with NEET (Intermediate Integrated)',
            description: "Best BiPC with NEET Coaching Institute in Hyderabad",
            provider: {
              '@type': 'EducationalOrganization',
              name: 'Rankrise Educational Institutions',
              sameAs: 'https://rankrise.in',
            },
            url: 'https://rankrise.in/college/bipc-neet',
            courseMode: ['Onsite'],
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://rankrise.in/' },
              { '@type': 'ListItem', position: 2, name: 'BiPC with NEET', item: 'https://rankrise.in/college/bipc-neet' },
            ],
          })}
        </script>
      </Helmet>

      <div>
        {/* Hero Section */}
        <section>
          <div className="hero-section position-relative d-none d-md-block">
            <div>
              <img src="/assets/public/INTERMEDIATE-NEET Banner.webp" alt="Best BIPC with NEET Coaching Institute in Hyderabad" style={{ width: '100%', borderBottom: '2px solid #005826' }} loading="eager" />
            </div>
          </div>
          <div className="hero-section-mobile d-md-none">
            <div>
              <img src="/assets/public/juniorslider2.webp" alt="Best BIPC with NEET Coaching Institute in Hyderabad" style={{ width: '100%', borderBottom: '2px solid #005826' }} loading="lazy" />
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
                    <a href="tel:9948962952" onClick={() => trackCallClick('9948962952', 'bipc_neet_page')} style={{ textDecoration: 'none', color: '#000' }} className="fw-bold">
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
                        <li><Link to="/courses/bitsat" className="redirections">BITSAT Coaching</Link></li>
                      </ul>
                    </div>
                    <div className="col-md-7">
                      <ul>
                        <li><Link to="/college/mpc-iit" className="redirections">INTER: MPC with IIT-JEE</Link></li>
                        <li><Link to="/college/mpc-eamcet" className="redirections">INTER: MPC with EAMCET</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="d-none d-md-block">
                    <img src="/assets/public/EAMCETBANNER.webp" alt="EAMCET Banner" className="w-100" loading="lazy" />
                  </div>
                </div>
              </div>

              {/* Main Content Tabs Section */}
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
                          <h2>BIPC with NEET(UG) Overview</h2>
                        </div>
                        <div>
                          <h1 className="fw-bolder text-danger subHcolor" style={{ fontSize: 20, color: '#dc3545' }}>Best BIPC with NEET Coaching Institute in Hyderabad</h1>
                          <p className="Textstyle">
                            <strong className="fw-bold text-black subHcolor">Rankrise Junior College</strong> offers a powerful integrated program that combines <strong className="fw-bold text-black subHcolor">Intermediate (BIPC)</strong> education with <strong className="fw-bold text-black subHcolor">expert NEET coaching,</strong> designed to help students build a strong academic foundation while preparing for India’s toughest medical entrance exams. As one of the <strong className="fw-bold text-black subHcolor">Best Junior College with NEET Coaching in Hyderabad,</strong> Rankrise provides a structured study environment, result-driven teaching methods, and personalized guidance to help students excel both in board exams and the NEET examination.
                          </p>

                          {/* Toggleable Overview Content */}
                          {showOverview && (
                            <div className="mt-3">
                              <p className="Textstyle">
                                Our NEET-integrated curriculum covers <strong className="fw-bold text-black subHcolor">Botany, Zoology, Physics,</strong> and Chemistry in a systematic and application-oriented manner. Students receive classroom teaching, daily practice worksheets, topic-wise tests, and weekend grand tests to strengthen their understanding and improve exam accuracy. The learning approach emphasizes conceptual clarity, problem-solving, and clinical reasoning—skills essential to score high in NEET.
                              </p>
                              <p className="Textstyle">
                                NEET is conducted annually by the <strong className="fw-bold text-black subHcolor">National Testing Agency (NTA),</strong> and Rankrise ensures that students stay updated on exam patterns, syllabus, and important notifications through regular academic updates and guidance sessions.
                              </p>
                              <p className="Textstyle">
                                With experienced faculty, disciplined study schedules, and continuous performance tracking, Rankrise Junior College helps students confidently aim for top medical colleges and build a successful career in the field of medicine.
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
                            <h5 className="text-danger fw-bolder subHcolor" style={{ color: '#dc3545' }}>Official Websites:</h5>
                            <h5 className="d-inline">
                              <a href="https://nta.ac.in/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>nta.ac</a>
                            </h5>
                            <span className="mx-2">|</span>
                            <h5 className="d-inline">
                              <a href="https://jeemain.nta.nic.in/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>jeemain.nta.nic</a>
                            </h5>
                            <span className="mx-2">|</span>
                            <h5 className="d-inline">
                              <a href="https://jeeadv.ac.in/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>jeeadv.ac</a>
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
                              BIPC with NNET Coaching (Integrated Intermediate Course)
                            </li>
                            <li className="mb-2">
                              <i className="fas fa-star me-2" style={{ color: '#187b31' }} />
                              BIPCS With NEET Long Term Program (For 12th Passed Students / Repeaters)
                            </li>
                            <li className="mb-2">
                              <i className="fas fa-star me-2" style={{ color: '#187b31' }} />
                              BIPC With NEET Short Term / Crash Course
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
                        {/* Why Choose Block */}
                        <div className="mb-4">
                          <h4 className="text-success fw-bold">Why Choose Rankrise for BIPC With NEET Coaching?</h4>
                          <p className="Textstyle mb-0">
                            <strong className="fw-bold text-black subHcolor">Rankrise Institute</strong> is one of the <strong className="fw-bold text-black subHcolor">Best BIPC With NEET Institutes in Hyderabad,</strong> trusted by students and parents for its commitment to academic excellence and consistent results. We believe in empowering every student with strong fundamentals, logical thinking, and exam-focused strategies that lead to success in NEET.
                          </p>

                          {/* Toggleable Why Choose Content */}
                          {showWhyChoose && (
                            <div className="mt-2">
                              <p className="Textstyle">
                                At <strong className="fw-bold text-black subHcolor">Rankrise,</strong> learning is led by highly experienced and expert faculty who combine innovative teaching methods with personalized mentorship. Our scientifically designed curriculum ensures complete coverage of concepts while promoting deep understanding and application skills.
                              </p>
                              <p className="Textstyle">
                                Regular mock tests, performance tracking, and doubt-clearing sessions help students evaluate their progress and strengthen their preparation. With state-of-the-art classrooms and a disciplined learning environment, Rankrise <strong className="fw-bold text-black subHcolor">provides</strong> the ideal setting for focused learning.
                              </p>
                              <p className="Textstyle">
                                Every year, <strong className="fw-bold text-black subHcolor">Rankrise</strong> students secure top ranks and admissions in IITs, NITs, and top engineering institutes — proving that success begins here.
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

                          <h6 className="fw-bolder text-danger subHcolor mt-2" style={{ color: '#dc3545' }}>1. Concept Clarity First</h6>
                          <p className="Textstyle mb-2">
                            At <strong className="fw-bold text-black subHcolor">Rankrise,</strong> we strongly believe that a student’s success in NEET begins with clear conceptual understanding. Each chapter is taught from the fundamentals to the advanced level, ensuring students understand the core logic behind every formula, theorem, and scientific principle.This approach helps students think independently and solve problems without relying on memorization.
                          </p>

                          {/* Toggleable Pedagogy Content */}
                          {showMethodology && (
                            <div>
                              <h6 className="fw-bolder text-danger subHcolor mt-3" style={{ color: '#dc3545' }}>2. Application Through Practice</h6>
                              <p className="Textstyle mb-2">
                                Learning is incomplete without practice. That’s why we provide Daily Practice Sheets (DPPs), topic-based assignments, and previous year question sets to strengthen understanding. Students learn to apply concepts to simple, moderate, and high-difficulty problems, improving speed and accuracy over time.
                              </p>
                              <h6 className="fw-bolder text-danger subHcolor mt-3" style={{ color: '#dc3545' }}>3. Regular Testing and Analysis</h6>
                              <p className="Textstyle mb-2">
                                We conduct weekly chapter tests, monthly cumulative tests, and full-length mock exams modeled exactly on NEET patterns. Detailed performance reports help students identify strengths and work on weaker areas with support from faculty.
                              </p>
                              <h6 className="fw-bolder text-danger subHcolor mt-3" style={{ color: '#dc3545' }}>4. Mentorship and Doubt Support</h6>
                              <p className="Textstyle mb-2">
                                Every student receives personal guidance and dedicated doubt-clearing sessions, along with motivation and exam strategy mentoring. This ensures students stay confident, disciplined, and consistently improving.
                              </p>
                              <h6 className="fw-bolder mt-3">Our Pedagogy in Action (The RANKRISE Cycle)</h6>
                              <ul className="arrowicon" style={{ fontSize: 14 }}>
                                <li><strong className="fw-bold text-black subHcolor">LEARN: </strong>Engaging lectures focused on conceptual clarity.</li>
                                <li><strong className="fw-bold text-black subHcolor">PRACTICE: </strong>Solving extensive problems from study materials question banks.</li>
                                <li><strong className="fw-bold text-black subHcolor">TEST: </strong>Regular assessments and grand mock tests.</li>
                                <li><strong className="fw-bold text-black subHcolor">ANALYZE: </strong>Detailed performance reports and identification of weak areas.</li>
                                <li><strong className="fw-bold text-black subHcolor">IMPROVE: </strong>Targeted doubt clearing, remedial classes, and personalized feedback.</li>
                                <li><strong className="fw-bold text-black subHcolor">REVISE: </strong>Strategic revision schedules and quick recap sessions.</li>
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
                        <li><Link to="/courses/bitsat" className="redirections">BITSAT Coaching</Link></li>
                        <li><Link to="/college/mpc-iit" className="redirections">INTER: MPC with IIT-JEE</Link></li>
                        <li><Link to="/college/bipc-neet" className="redirections">INTER: BIPC with NEET</Link></li>
                      </ul>
                    </div>
                  </div>

                  {/* Tab 2: Exam Pattern */}
                  <div className="tab-pane fade" id="tab2">
                    <DocumentList course="bipc-neet" section="exam-pattern" />
                  </div>

                  {/* Tab 3: Syllabus */}
                  <div className="tab-pane fade" id="tab3">
                    <DocumentList course="bipc-neet" section="syllabus" />
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

export default BiPC_NEET;