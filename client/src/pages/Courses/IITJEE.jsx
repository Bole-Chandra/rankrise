import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import EnquiryForm from '../../components/EnquiryForm';
import DocumentList from '../../components/DocumentList';
import { trackCallClick } from '../../utils/analytics';

const IITJEE = () => {
  // State variables to handle the "View More" toggles cleanly matching the design standard
  const [showOverview, setShowOverview] = useState(false);
  const [showWhyChoose, setShowWhyChoose] = useState(false);
  const [showMethodology, setShowMethodology] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (window.AOS) window.AOS.refresh();
  }, []);

  return (
    <div className="iitjee-page">
      <Helmet>
        <title>Best IIT-JEE Coaching in Hyderabad | Rankrise</title>
        <meta name="description" content="Join Rankrise for the best IIT-JEE coaching in Hyderabad. Expert faculty, comprehensive study material, and proven track record with AIR 69, 85+ rankers." />
        <meta name="keywords" content="IIT JEE coaching Hyderabad, best JEE institute, IIT coaching center, JEE Advanced preparation" />
        <link rel="canonical" href="https://rankrise.in/courses/iit-jee" />
        <meta property="og:title" content="Best IIT-JEE Coaching in Hyderabad | Rankrise" />
        <meta property="og:description" content="Join Rankrise for the best IIT-JEE coaching in Hyderabad. Expert faculty, comprehensive study material, and proven track record with AIR 69, 85+ rankers." />
        <meta property="og:url" content="https://rankrise.in/courses/iit-jee" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Rankrise Educational Institutions" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: 'IIT-JEE Long Term & Short Term Coaching',
            description: "Join Rankrise for the best IIT-JEE coaching in Hyderabad. Expert faculty, comprehensive study material, and proven track record with AIR 69, 85+ rankers.",
            provider: {
              '@type': 'EducationalOrganization',
              name: 'Rankrise Educational Institutions',
              sameAs: 'https://rankrise.in',
            },
            url: 'https://rankrise.in/courses/iit-jee',
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
              { '@type': 'ListItem', position: 2, name: 'IIT-JEE Coaching', item: 'https://rankrise.in/courses/iit-jee' },
            ],
          })}
        </script>
      </Helmet>

      <div>
        <section>
          {/* Desktop Banner */}
          <div className="hero-section position-relative d-none d-md-block">
            <div>
              <img src="/assets/public/IIT-JEE-Website-Banner.webp" alt="Best IIT Coaching Institute in Hyderabad" style={{ width: '100%', borderBottom: '2px solid #005826' }} loading="eager" />
            </div>
          </div>

          {/* Mobile Banner Carousel */}
          <div className="hero-section-mobile d-md-none">
            <div className="dual-hero-slider">
              <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <div className="row">
                      <div>
                        <img src="/assets/public/hero-slider1.webp" className="img-fluid hero-img" alt="Best IIT Coaching Institute in Hyderabad" />
                      </div>
                    </div>
                  </div>
                  <div className="carousel-item">
                    <div className="row">
                      <div>
                        <img src="/assets/public/hero-slider2.webp" className="img-fluid hero-img" alt="Best IIT Coaching Institute in Hyderabad" />
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
                    <a href="tel:9948962952" onClick={() => trackCallClick('9948962952', 'iitjee_course_page')} style={{ textDecoration: 'none', color: '#000' }} className="fw-bold">
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
                          <h2>IIT-JEE Overview</h2>
                        </div>
                        <div>
                          {/* Heading elements correctly retain their red brand color identity */}
                          <h1 className="fw-bolder text-danger" style={{ fontSize: 20, color: '#dc3545' }}>Best IIT-JEE Coaching Institute in Hyderabad</h1>
                          <p className="Textstyle">
                            <strong className="fw-bold text-black">Rankrise</strong> stands as <strong className="fw-bold text-black">the Best IIT-JEE (Mains &amp; Advanced) Coaching Institute in Hyderabad,</strong> offering a highly structured and results-driven training program for engineering aspirants. With over <strong className="fw-bold text-black">14 years of academic excellence,</strong> Rankrise is committed to delivering a powerful combination of concept clarity, problem-solving skills, and exam-oriented strategies that help students secure top ranks in IIT-JEE.
                          </p>

                          {/* Toggleable Overview Content */}
                          {showOverview && (
                            <div className="mt-3">
                              <p className="Textstyle">
                                <strong className="fw-bold text-black">Our IIT-JEE coaching program</strong> is designed to provide a strong foundation in <strong className="fw-bold text-black">Physics, Chemistry, and Mathematics,</strong> ensuring students gain an in-depth understanding of fundamental and advanced concepts. We follow a systematic teaching methodology that includes interactive classroom sessions, daily practice papers, chapter-wise assignments, and regular doubt-clearing support. Students undergo a series of weekly tests, cumulative assessments, and full-length mock exams that mirror the actual JEE pattern, helping them build speed, accuracy, and confidence.
                              </p>
                              <p className="Textstyle">
                                The <strong className="fw-bold text-black">IIT-JEE</strong> examination is one of India’s most competitive entrance tests, conducted in two stages—JEE Mains and JEE Advanced. Qualifying these exams opens the gateway to prestigious institutes such as IITs, NITs, IIITs, and top engineering universities across the country.
                              </p>
                              <p className="Textstyle">
                                At <strong className="fw-bold text-black">Rankrise</strong>, our expert faculty, personalized mentorship, and disciplined learning environment ensure that every student receives complete academic support for achieving engineering excellence.
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
                              MPC with IIT-JEE Coaching (Integrated Intermediate Course)
                            </li>
                            <li className="mb-2">
                              <i className="fas fa-star me-2" style={{ color: '#187b31' }} />
                              IIT-JEE Long Term Program (For 12th Passed Students / Repeaters)
                            </li>
                            <li className="mb-2">
                              <i className="fas fa-star me-2" style={{ color: '#187b31' }} />
                              IIT-JEE Short Term / Crash Course
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
                          <h4 className="text-success fw-bold">Why Choose Rankrise for IIT-JEE (Mains &amp; Advanced) Coaching?</h4>
                          <p className="Textstyle mb-0">
                            <strong className="fw-bold text-black">Rankrise Institute</strong> is one of the <strong className="fw-bold text-black">Best IIT-JEE Coaching Institutes in Hyderabad,</strong> trusted by students and parents for its commitment to academic excellence and consistent results. We believe in empowering every student with strong fundamentals, logical thinking, and exam-focused strategies that lead to success in JEE Mains and Advanced.
                          </p>

                          {showWhyChoose && (
                            <div className="mt-2">
                              <p className="Textstyle">
                                At <strong className="fw-bold text-black">Rankrise,</strong> learning is led by highly experienced and expert faculty who combine innovative teaching methods with personalized mentorship. Our scientifically designed curriculum ensures complete coverage of concepts while promoting deep understanding and application skills.
                              </p>
                              <p className="Textstyle">
                                Regular mock tests, performance tracking, and doubt-clearing sessions help students evaluate their progress and strengthen their preparation. With state-of-the-art classrooms and a disciplined learning environment, Rankrise provides the ideal setting for focused learning.
                              </p>
                              <p className="Textstyle">
                                Every year, <strong className="fw-bold text-black">Rankrise</strong> students secure top ranks and admissions in IITs, NITs, and top engineering institutes — proving that success begins here.
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
                          <h6 className="fw-bolder text-danger mt-2" style={{ color: '#dc3545' }}>1. Concept Clarity First</h6>
                          <p className="Textstyle mb-2">
                            At <strong className="fw-bold text-black">Rankrise,</strong> we strongly believe that a student’s success in IIT-JEE begins with clear conceptual understanding. Each chapter is taught from the fundamentals to the advanced level, ensuring students understand the core logic behind every formula, theorem, and scientific principle. This approach helps students think independently and solve problems without relying on memorization.
                          </p>

                          {showMethodology && (
                            <div>
                              <h6 className="fw-bolder text-danger mt-3" style={{ color: '#dc3545' }}>2. Application Through Practice</h6>
                              <p className="Textstyle mb-2">
                                Learning is incomplete without practice. That’s why we provide Daily Practice Sheets (DPPs), topic-based assignments, and previous year question sets to strengthen understanding. Students learn to apply concepts to simple, moderate, and high-difficulty problems, improving speed and accuracy over time.
                              </p>
                              <h6 className="fw-bolder text-danger mt-3" style={{ color: '#dc3545' }}>3. Regular Testing and Analysis</h6>
                              <p className="Textstyle mb-2">
                                We conduct weekly chapter tests, monthly cumulative tests, and full-length mock exams modeled exactly on JEE Mains &amp; Advanced patterns. Detailed performance reports help students identify strengths and work on weaker areas with support from faculty.
                              </p>
                              <h6 className="fw-bolder text-danger mt-3" style={{ color: '#dc3545' }}>4. Mentorship and Doubt Support</h6>
                              <p className="Textstyle mb-3">
                                Every student receives personal guidance and dedicated doubt-clearing sessions, along with motivation and exam strategy mentoring. This ensures students stay confident, disciplined, and consistently improving.
                              </p>
                              <h6 className="fw-bolder text-danger mt-3" style={{ color: '#dc3545' }}>Our Pedagogy in Action (The RANKRISE Cycle)</h6>
                              <ul className="arrowicon" style={{ fontSize: 14 }}>
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
                        <li><Link to="/courses/neet" className="redirections">NEET Coaching</Link></li>
                        <li><Link to="/courses/eamcet" className="redirections">EAMCET Coaching</Link></li>
                        <li><Link to="/courses/bitsat" className="redirections">BITSAT Coaching</Link></li>
                        <li><Link to="/college/mpc-iit" className="redirections">INTER: MPC with IIT-JEE</Link></li>
                        <li><Link to="/college/mpc-eamcet" className="redirections">INTER: MPC with EAMCET</Link></li>
                        <li><Link to="/college/bipc-neet" className="redirections">INTER: BIPC with NEET</Link></li>
                      </ul>
                    </div>
                  </div>

                  {/* Tab 2: Exam Pattern */}
                  <div className="tab-pane fade" id="tab2">
                    <DocumentList course="iit-jee" section="exam-pattern" />
                  </div>

                  {/* Tab 3: Syllabus */}
                  <div className="tab-pane fade" id="tab3">
                    <DocumentList course="iit-jee" section="syllabus" />
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

export default IITJEE;