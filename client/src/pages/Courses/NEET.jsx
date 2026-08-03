import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import EnquiryForm from '../../components/EnquiryForm';
import { trackCallClick } from '../../utils/analytics';

const NEET = () => {
  // State variables to handle the "View More" toggles - exactly like BITSAT
  const [showOverview, setShowOverview] = useState(false);
  const [showWhyChoose, setShowWhyChoose] = useState(false);
  const [showMethodology, setShowMethodology] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (window.AOS) window.AOS.refresh();
  }, []);

  return (
    <div className="neet-page">
      <Helmet>
        <title>Best NEET Coaching in Hyderabad | Rankrise</title>
        <meta name="description" content="Rankrise offers the best NEET coaching in Hyderabad with expert Biology, Chemistry & Physics faculty. Structured curriculum for medical entrance exam success." />
        <meta name="keywords" content="NEET coaching Hyderabad, best NEET institute, medical entrance coaching, NEET preparation" />
        <link rel="canonical" href="https://rankrise.in/courses/neet" />
        <meta property="og:title" content="Best NEET Coaching in Hyderabad | Rankrise" />
        <meta property="og:description" content="Rankrise offers the best NEET coaching in Hyderabad with expert Biology, Chemistry & Physics faculty. Structured curriculum for medical entrance exam success." />
        <meta property="og:url" content="https://rankrise.in/courses/neet" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Rankrise Educational Institutions" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: 'NEET Long Term & Short Term Coaching',
            description: "Rankrise offers the best NEET coaching in Hyderabad with expert Biology, Chemistry & Physics faculty. Structured curriculum for medical entrance exam success.",
            provider: {
              '@type': 'EducationalOrganization',
              name: 'Rankrise Educational Institutions',
              sameAs: 'https://rankrise.in',
            },
            url: 'https://rankrise.in/courses/neet',
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
              { '@type': 'ListItem', position: 2, name: 'NEET Coaching', item: 'https://rankrise.in/courses/neet' },
            ],
          })}
        </script>
      </Helmet>

      <div>
        {/* Banner Section */}
        <section>
          <div className="hero-section position-relative d-none d-md-block">
            <div>
              <img src="/assets/public/NEET-Website-Banner.JPG" alt="Best NEET Coaching Institute in Hyderabad" style={{ width: '100%', borderBottom: '2px solid #005826' }} loading="eager" />
            </div>
          </div>
          <div className="hero-section-mobile d-md-none">
            <div className="dual-hero-slider">
              <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <img src="/assets/public/hero-slider3.JPG" className="img-fluid hero-img" alt="Best NEET Coaching Institute in Hyderabad" />
                  </div>
                  <div className="carousel-item">
                    <img src="/assets/public/hero-slider4.JPG" className="img-fluid hero-img" alt="Best NEET Coaching Institute in Hyderabad" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Section */}
        <section>
          <div className="container">
            <div className="row">
              {/* Sidebar Section */}
              <div className="col-12 col-md-5 order-1 order-md-2 mt-3 mt-md-3">
                <div className="text-center">
                  <div style={{ background: '#ffc107' }} className="p-2">
                    <h4 className="fw-bold mb-1 admission-title">
                      ADMISSION OPEN for 2026–2027
                    </h4>
                  </div>
                  <p style={{ fontSize: 20 }} className="mb-1 d-inline-flex">
                    Enquire Now or call:&nbsp;
                    <a href="tel:9948962952" onClick={() => trackCallClick('9948962952', 'neet_course_page')} style={{ textDecoration: 'none', color: '#000' }} className="fw-bold">
                      9948962952
                    </a>
                  </p>
                </div>
                <div className="sidebar text-white shadow enquiry-box">
                  <h3 className="fw-bold formsubheading text-center d-inline-flex" style={{ fontSize: 24 }}>
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
                        <li><Link to="/college/bipc-neet" className="redirections">INTER: MPC with EAMCET</Link></li>
                        <li><Link to="/college/mpc-eamcet" className="redirections">INTER: BIPC with NEET</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="d-none d-md-block">
                    <img src="/assets/public/JEE Mains & BITSAT Banner.JPG" alt="Best NEET Coaching in Hyderabad" className="w-100" loading="eager" />
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
                          <h2>NEET Overview</h2>
                        </div>
                        <div>
                          {/* Heading elements retain their red brand color identity like BITSAT */}
                          <h1 className="fw-bolder text-danger" style={{ fontSize: 20, color: '#dc3545' }}>Best NEET Coaching Institute in Hyderabad</h1>
                          <p className="Textstyle">
                            <strong className="fw-bold text-black">Rankrise</strong> is recognized as <strong className="fw-bold text-black">the Best NEET Coaching Institute in Hyderabad,</strong> offering a comprehensive learning ecosystem designed to help students excel in the National Eligibility cum Entrance Test (NEET). Our NEET coaching program is structured to build strong fundamentals in <strong className="fw-bold text-black">Physics, Chemistry, and Biology,</strong> ensuring students gain complete clarity over every concept required for medical entrance examinations.
                          </p>

                          {/* Toggleable Overview Content */}
                          {showOverview && (
                            <div className="mt-3">
                              <p className="Textstyle">
                                The <strong className="fw-bold text-black">NEET exam</strong>, conducted by the National Testing Agency (NTA), is one of India’s most competitive tests for securing admission into MBBS, BDS, AYUSH, and other medical courses. Understanding the depth and difficulty of this exam, Rankrise provides a <strong className="fw-bold text-black">carefully planned curriculum, experienced faculty,</strong> and <strong className="fw-bold text-black">daily practice support</strong> to help students master the syllabus effectively.
                              </p>
                              <p className="Textstyle">
                                Our teaching methodology combines <strong className="fw-bold text-black">interactive classroom sessions, NCERT-based learning, regular mock tests,</strong> and <strong className="fw-bold text-black">personalized doubt-clearing</strong> to ensure students stay ahead in their preparation. We offer <strong className="fw-bold text-black">both long-term and short-term NEET coaching,</strong> catering to Class 11, Class 12, and repeaters aiming for top ranks.
                              </p>
                              <p className="Textstyle">
                                With disciplined study schedules, performance tracking, and mentor guidance, Rankrise has built a strong legacy of results. Our goal is to empower every medical aspirant with the confidence, knowledge, and skills needed to succeed in NEET and secure admission to top government medical colleges across India.
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
                            <h5 className="text-danger fw-bolder" style={{ color: '#dc3545' }}>Official Website:</h5>
                            <h5 className="d-inline">
                              <a href="https://nta.ac.in" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>nta.ac.in</a>
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
                              BiPC with NEET Coaching (Integrated Intermediate Course)
                            </li>
                            <li className="mb-2">
                              <i className="fas fa-star me-2" style={{ color: '#187b31' }} />
                              NEET Long Term Program (For 12th Passed Students / Repeaters)
                            </li>
                            <li className="mb-2">
                              <i className="fas fa-star me-2" style={{ color: '#187b31' }} />
                              NEET Short Term / Crash Course
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
                          <h4 className="text-success fw-bold">Why Choose Rankrise for NEET Coaching?</h4>
                          <p className="Textstyle mb-0">
                            As the <strong className="fw-bold text-black">Best NEET Coaching Institute in Hyderabad, Rankrise</strong> is committed to delivering a structured, result-focused learning experience that helps students excel in one of India’s toughest medical entrance exams. Our NEET coaching program is powered by <strong className="fw-bold text-black">expert faculty,</strong> well-researched study materials, and a proven teaching methodology that builds strong conceptual understanding in <strong className="fw-bold text-black">Physics, Chemistry, and Biology.</strong>
                          </p>

                          {showWhyChoose && (
                            <div className="mt-2">
                              <p className="Textstyle">
                                At <strong className="fw-bold text-black">Rankrise,</strong> students receive <strong className="fw-bold text-black">personalized mentorship,</strong> regular doubt-clearing sessions, and continuous performance tracking to ensure steady improvement. Our <strong className="fw-bold text-black">NCERT-focused curriculum,</strong> daily practice sheets, and weekly mock tests are designed to enhance accuracy, time management, and exam confidence.
                              </p>
                              <p className="Textstyle">
                                We also provide a disciplined study environment, both for day-scholar and residential students, making <strong className="fw-bold text-black">Rankrise</strong> the preferred choice for NEET aspirants across India. With consistent results and a strong selection record in top medical colleges, <strong className="fw-bold text-black">Rankrise</strong> stands as the trusted destination for students seeking <strong className="fw-bold text-black">high-quality NEET coaching in Hyderabad.</strong>
                              </p>
                              <p className="Textstyle">
                                Every year, <strong className="fw-bold text-black">Rankrise</strong> students secure top ranks and admissions in premium government medical colleges and top healthcare universities — proving that success begins here.
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

                          {/* Subheading retains BITSAT style Red color standards */}
                          <h6 className="fw-bolder text-danger mt-2" style={{ color: '#dc3545' }}>1. Concept-Based Classroom Teaching</h6>
                          <p className="Textstyle mb-2">
                            At <strong className="fw-bold text-black">Rankrise,</strong> every <strong className="fw-bold text-black">NEET</strong> aspirant is trained with strong conceptual clarity. Our expert faculty explain topics step-by-step, starting from the basics and moving toward advanced applications. This structured approach helps students understand Biology, Physics, and Chemistry deeply rather than memorizing facts, ensuring long-term retention and exam accuracy.
                          </p>

                          {showMethodology && (
                            <div>
                              <h6 className="fw-bolder text-danger mt-3" style={{ color: '#dc3545' }}>2. Daily Practice &amp; Application-Oriented Learning</h6>
                              <p className="Textstyle mb-2">
                                We follow a structured methodology where students engage in Daily Practice Papers (DPPs), topic-wise worksheets, and chapter-wise assignments. This consistent practice helps students apply concepts effectively, improve analytical thinking, and master NEET-type questions with accuracy and speed.
                              </p>
                              <h6 className="fw-bolder text-danger mt-3" style={{ color: '#dc3545' }}>3. Regular Tests, Assessments &amp; Performance Tracking</h6>
                              <p className="Textstyle mb-2">
                                We conduct weekly tests, part-syllabus exams, and full-length NEET mock tests to evaluate progress. Detailed performance analytics help identify strengths and weak areas. Faculty review test results individually with students, providing corrective measures and improvement plans to ensure steady academic growth.
                              </p>
                              <h6 className="fw-bolder text-danger mt-3" style={{ color: '#dc3545' }}>4. Personalized Mentorship &amp; Doubt-Clearing Support</h6>
                              <p className="Textstyle mb-3">
                                Rankrise offers continuous one-on-one doubt sessions, mentoring support, and academic counseling. Students are encouraged to ask questions freely, clarify concepts, and overcome learning gaps. Our mentorship ecosystem ensures that every student receives the guidance they need to stay motivated and prepared for NEET.
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
                        <li><Link to="/courses/iit-jee" className="redirections">IIT-JEE Coaching</Link></li>
                        <li><Link to="/courses/neet" className="redirections">NEET Coaching</Link></li>
                        <li><Link to="/courses/eamcet" className="redirections">EAMCET Coaching</Link></li>
                        <li><Link to="/college/mpc-iit" className="redirections">INTER: MPC with IIT-JEE</Link></li>
                        <li><Link to="/college/bipc-neet" className="redirections">INTER: MPC with EAMCET</Link></li>
                        <li><Link to="/college/mpc-eamcet" className="redirections">INTER: BIPC with NEET</Link></li>
                      </ul>
                    </div>
                  </div>

                  {/* Tab 2: Exam Pattern */}
                  <div className="tab-pane fade" id="tab2">
                    <section className="coming-section my-5">
                      <h2 className="coming-title fw-bold display-6">
                        <span className="yellow">COMING</span> SOON
                      </h2>
                      <p className="mt-3 fs-5">Stay tuned for something amazing!</p>
                    </section>
                  </div>

                  {/* Tab 3: Syllabus */}
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

export default NEET;