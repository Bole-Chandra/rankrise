import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import EnquiryForm from '../components/EnquiryForm';
import { trackCallClick } from '../utils/analytics';

const faqData = [
  { q: 'Why should I choose Rankrise for NEET, IIT-JEE, and EAMCET coaching in Hyderabad?', a: 'Rankrise is committed to helping students achieve their dream of securing admission into top Medical and Engineering colleges. Our coaching methodology focuses on conceptual learning, disciplined preparation, experienced faculty guidance, personalized mentoring, regular mock tests, detailed performance analysis, and continuous doubt clarification. Students receive an exam-oriented study plan that improves both speed and accuracy while building strong fundamentals. The institute also provides a focused academic environment with structured programs for day scholars and residential students.' },
  { q: 'Which courses are available at Rankrise?', a: 'Rankrise offers comprehensive coaching programs including: NEET Long Term Coaching NEET Short Term Coaching IIT-JEE (Main & Advanced) Long Term Coaching IIT-JEE Short Term Coaching EAMCET Coaching BITSAT Coaching Intermediate MPC with IIT-JEE Intermediate MPC with EAMCET Intermediate BiPC with NEET Foundation Programs for School Students Every course is designed according to the latest examination pattern and syllabus.' },
  { q: 'Who can join Rankrise coaching?', a: 'Students from different academic backgrounds can join depending on their goals. Class 11 students Class 12 students Intermediate MPC students Intermediate BiPC students NEET Repeaters IIT-JEE Repeaters EAMCET Aspirants Students seeking integrated Intermediate with entrance coaching Admission counselors help students choose the most suitable course based on their academic level and career aspirations.' },
  { q: 'What makes Rankrise different from other coaching institutes?', a: 'Rankrise emphasizes complete academic development rather than rote learning. Students benefit from: Experienced faculty Individual mentoring Small batch attention Daily practice sessions Weekly and monthly grand tests Performance tracking Regular parent interaction Doubt-solving sessions Time management techniques Competitive exam strategies Motivation and career guidance This structured approach helps students prepare confidently for highly competitive entrance examinations.' },
  { q: 'How are classes conducted at Rankrise?', a: 'Classes follow a scientific learning methodology. Every topic includes: Concept explanation Practical examples Problem-solving sessions Shortcuts and techniques Daily assignments Homework evaluation Doubt clarification Chapter-wise revision Unit tests Grand tests Students receive continuous academic support throughout the course.' },
  { q: 'Do students receive personal attention?', a: 'Absolutely. Every student is monitored individually. Faculty members regularly review: Attendance Test performance Subject-wise improvement Weak topics Study habits Time management Revision progress This personalized mentoring ensures that no student is left behind.' },
  { q: 'How often are tests conducted?', a: 'Rankrise follows a systematic testing schedule. Students attend: Daily practice tests Weekly assessments Monthly grand tests Full syllabus mock exams Previous year paper practice NEET model exams IIT-JEE pattern tests EAMCET online practice exams Each test is followed by detailed analysis and improvement strategies.' },
  { q: 'Does Rankrise provide study material?', a: 'Yes. Students receive carefully prepared study material including: Theory notes Formula books Practice worksheets Assignment books Previous year questions Model papers Mock tests Revision notes Quick reference materials Study material is regularly updated according to the latest syllabus and examination pattern.' },
  { q: 'How does Rankrise improve students\' exam performance?', a: 'The institute focuses on: Strong fundamentals Concept clarity Regular revisions Time management Smart problem-solving Speed improvement Accuracy enhancement Stress management Exam temperament This balanced preparation helps students perform confidently during actual examinations.' },
  { q: 'Does Rankrise provide hostel facilities?', a: 'Yes. Residential students receive: Safe hostel accommodation Hygienic food Study hours supervision Discipline Academic monitoring CCTV security Dedicated wardens Peaceful study environment The hostel atmosphere encourages focused preparation.' },
  { q: 'How do parents track their child\'s progress?', a: 'Parents receive regular academic updates including: Attendance reports Test scores Subject performance Faculty feedback Improvement suggestions Counseling sessions Strong parent-institute communication helps students remain motivated.' },
  { q: 'Are doubt-clearing sessions available?', a: 'Yes. Dedicated doubt-clearing sessions are conducted regularly. Students may ask questions during class, after class, or during special doubt-solving sessions to ensure every concept is fully understood.' },
  { q: 'Where are Rankrise coaching centers located?', a: 'Rankrise has multiple coaching centers in Hyderabad, including KPHB (main campus), Chandanagar, SR Nagar, and Dilsukhnagar, allowing students to choose a convenient branch.' },
  { q: 'How can I take admission at Rankrise?', a: 'Students can: Visit the nearest Rankrise campus. Meet the admission counseling team. Choose the appropriate program. Complete the registration process. Begin classes according to the academic schedule. The admissions team assists students and parents throughout the enrollment process.' },
];

const Home = () => {
  // 1. Manage animated count states for the metrics panel
  const [counts, setCounts] = useState({
    iit: 0,
    neet: 0,
    eamcet: 0,
    bitsat: 0
  });

  // "Rankrise Trained Students" counters and course cards use a fade/slide-in
  // animation that only plays once they scroll into view — this was
  // originally driven by a plain-JS IntersectionObserver (assets/JS/script.js)
  // that isn't loaded in this app, which left them permanently hidden
  // (opacity: 0 in style.css). Handling it here in React instead.
  const [statsVisible, setStatsVisible] = useState(false);
  const [coursesVisible, setCoursesVisible] = useState(false);
  const [showAboutMore, setShowAboutMore] = useState(false);
  const statsRef = useRef(null);
  const coursesRef = useRef(null);

  // 2. Main layout side effect (Scroll tracking, AOS triggers, and Counter engine)
  useEffect(() => {
    // Scroll page view instantly back to top on load
    window.scrollTo(0, 0);
    if (window.AOS) window.AOS.refresh();

    // Target values configuration block
    const targets = {
      iit: 74574,
      neet: 61826,
      eamcet: 52250,
      bitsat: 15645
    };

    const duration = 2000; // Animation running duration (2 seconds)
    const frameRate = 1000 / 60; // 60 FPS viewport standard
    const totalSteps = Math.round(duration / frameRate);
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / totalSteps;

      if (progress >= 1) {
        setCounts(targets);
        clearInterval(timer);
      } else {
        setCounts({
          iit: Math.floor(targets.iit * progress),
          neet: Math.floor(targets.neet * progress),
          eamcet: Math.floor(targets.eamcet * progress),
          bitsat: Math.floor(targets.bitsat * progress)
        });
      }
    }, frameRate);

    return () => clearInterval(timer);
  }, []);

  // 3. Reveal-on-scroll for the trained-students stat cards
  useEffect(() => {
    const node = statsRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStatsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // 4. Reveal-on-scroll for the course cards
  useEffect(() => {
    const node = coursesRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCoursesVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-page">
      <Helmet>
        <title>Rankrise Educational Institutions | Best IIT-JEE, NEET & EAMCET Coaching in Hyderabad</title>
        <meta name="description" content="Rankrise is a leading coaching institute in Hyderabad since 2011, offering IIT-JEE, NEET, EAMCET & BITSAT coaching with proven results. Join 15,000+ successful students." />
        <meta name="keywords" content="IIT JEE coaching Hyderabad, NEET coaching Hyderabad, EAMCET coaching, best coaching institute Hyderabad, Rankrise" />
        <link rel="canonical" href="https://rankrise.in/" />
        <meta property="og:title" content="Rankrise Educational Institutions | Best IIT-JEE, NEET & EAMCET Coaching in Hyderabad" />
        <meta property="og:description" content="Rankrise is a leading coaching institute in Hyderabad since 2011, offering IIT-JEE, NEET, EAMCET & BITSAT coaching with proven results. Join 15,000+ successful students." />
        <meta property="og:url" content="https://rankrise.in/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Rankrise Educational Institutions" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqData.map((item) => ({
              '@type': 'Question',
              name: item.q,
              acceptedAnswer: { '@type': 'Answer', text: item.a },
            })),
          })}
        </script>
      </Helmet>
      <div>
        <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel" data-bs-interval={2200}>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <picture>
                <source media="(max-width: 576px)" srcSet="/assets/public/home-mobile-1.webp" draggable="false" alt="Best IIT JEE Mains & NEET Coaching Institute in Hyderabad" />
                <source media="(max-width: 992px)" srcSet="/assets/public/home-mobile-1.webp" draggable="false" alt="Best IIT JEE Mains & NEET Coaching Institute in Hyderabad" />
                <img className="d-block w-100" draggable="false" src="/assets/public/banner2.webp" alt="Best IIT JEE Mains & NEET Coaching Institute in Hyderabad" loading="eager" fetchpriority="high" />
              </picture>
            </div>
            <div className="carousel-item">
              <picture>
                <source media="(max-width: 576px)" srcSet="/assets/public/JEE-Result-Banner-responsive.webp" draggable="false" alt="Best IIT JEE Mains & NEET Coaching Institute in Hyderabad" />
                <source media="(max-width: 992px)" srcSet="/assets/public/JEE-Result-Banner-responsive.webp" draggable="false" alt="Best IIT JEE Mains & NEET Coaching Institute in Hyderabad" />
                <img className="d-block w-100" src="/assets/public/banner3.webp" alt="Best IIT JEE Mains & NEET Coaching Institute in Hyderabad" loading="lazy" draggable="false" />
              </picture>
            </div>
            <div className="carousel-item">
              <picture>
                <source media="(max-width: 576px)" srcSet="/assets/public/home-mobile-2.webp" draggable="false" alt="Best IIT JEE Mains & NEET Coaching Institute in Hyderabad" />
                <source media="(max-width: 992px)" srcSet="/assets/public/home-mobile-2.webp" draggable="false" alt="Best IIT JEE Mains & NEET Coaching Institute in Hyderabad" />
                <img className="d-block w-100" src="/assets/public/banner1.webp" alt="Best IIT JEE Mains & NEET Coaching Institute in Hyderabad" loading="lazy" draggable="false" />
              </picture>
            </div>
            <div className="carousel-item">
              <picture>
                <source media="(max-width: 576px)" srcSet="/assets/public/NEET-Result-Banner-responsive.webp" draggable="false" alt="Best IIT JEE Mains & NEET Coaching Institute in Hyderabad" />
                <source media="(max-width: 992px)" srcSet="/assets/public/NEET-Result-Banner-responsive.webp" draggable="false" alt="Best IIT JEE Mains & NEET Coaching Institute in Hyderabad" />
                <img className="d-block w-100" src="/assets/public/banner4.webp" alt="Best IIT JEE Mains & NEET Coaching Institute in Hyderabad" loading="lazy" draggable="false" />
              </picture>
            </div>
            <div className="carousel-item">
              <picture>
                <source media="(max-width: 576px)" srcSet="/assets/public/Eamcet-result-banner.webp" draggable="false" alt="Best IIT JEE Mains & NEET Coaching Institute in Hyderabad" />
                <source media="(max-width: 992px)" srcSet="/assets/public/Eamcet-result-banner.webp" draggable="false" alt="Best IIT JEE Mains & NEET Coaching Institute in Hyderabad" />
                <img className="d-block w-100" src="/assets/public/banner5.webp" alt="Best IIT JEE Mains & NEET Coaching Institute in Hyderabad" loading="lazy" draggable="false" />
              </picture>
            </div>
          </div>
          <div className="custom-carousel-controls d-none d-md-block">
            <button className="carousel-control-prev mb-2" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true" />
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next d-none d-md-block" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true" />
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
        <section className="updates-section">
          <div className="container-fluid d-flex align-items-center p-0">
            <div className="updates-label px-3 py-1 text-white fw-bold">
              UPDATES
            </div>
            <div className="updates-marquee flex-grow-1">
              <marquee behavior="scroll" direction="left" scrollamount={6} className="scroller py-0">
                LONG TERM &amp; SHORT TERM Coaching for IIT-JEE | NEET | EAMCET &amp; INTERMEDIATE for MPC / BIPC Admissions Are In
                Progress. Join Today!!
              </marquee>
            </div>
          </div>
        </section>


        <div className="container py-md-5 py-2 d-none d-md-block">
          <div id="cardCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval={1800}>
            <div className="carousel-inner">
              <div className="carousel-item active">
                <div className="row">
                  <div className="col-md-6 col-lg-6">
                    <div className="card rankcards">
                      <img src="/assets/public/IIT-JEE.webp" className="card-img-top" alt="IIT-JEE coaching at Rankrise" loading="lazy" />
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-6">
                    <div className="card rankcards">
                      <img src="/assets/public/EAMCETBANNER.webp" className="card-img-top" alt="EAMCET coaching at Rankrise" loading="lazy" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="carousel-item">
                <div className="row">
                  <div className="col-md-6 mb-2 col-lg-6">
                    <div className="card rankcards">
                      <img src="/assets/public/NEET.webp" className="card-img-top" alt="NEET coaching at Rankrise" loading="lazy" />
                    </div>
                  </div>
                  <div className="col-md-6 mb-2 col-lg-6">
                    <div className="card rankcards">
                      <img src="/assets/public/JEE MAINS&BITSAT BANNER.webp" className="card-img-top" alt="JEE Mains and BITSAT coaching at Rankrise" loading="lazy" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container py-md-4 py-2 d-block d-md-none">
          <div className="text-center">
            <div
              style={{ backgroundColor: "#A5D6A7" }}
              className="p-2 rounded-3"
            >
              <p className="fw-bold mb-1 admission-title text-dark" style={{ fontSize: '1.5rem', lineHeight: 1.2 }}>
                ADMISSIONS OPEN
              </p>
            </div>
            <p style={{ fontSize: 20 }} className="mb-1  d-inline-flex ">
              Enquire Now or call:
              <a href="tel:9948962952" onClick={() => trackCallClick('9948962952', 'home_page')} style={{ textDecoration: 'none', color: '#000' }} className="fw-bold">
                9948962952
              </a>
            </p>
          </div>
          <div className="sidebar shadow enquiry-box ">
            <div className="text-center">
              <p className="fw-bold formsubheading text-center d-block w-100" style={{ fontSize: 24 }}>Your Success, Our Mission</p>
            </div>
            <EnquiryForm
              idPrefix="mobile_"
              buttonClassName="submit-btn mt-3 btn btn-warning w-100 fw-bold py-2"
              buttonStyle={{ background: '#ffc107', color: '#000', borderRadius: 8, fontSize: 15 }}
            />
          </div>
          <div id="successPopup" className="popup-box">
            <div className="popup-content">
              <img src="/assets/public/successicon.webp" alt="" style={{ width: 80 }} loading="lazy" />
              <p style={{ fontSize: '1.5rem', fontWeight: 500, marginBottom: '0.5rem', lineHeight: 1.2 }}>Submitted Successfully!</p>
              <p>
                Thank you! Your details have been shared successfully.<br />
                Our team will contact you soon.
              </p>
            </div>
          </div>
        </div>
        <section>
          <div className="container">
            <div className="section-title text-center">
              <h2>About Us</h2>
            </div>
            <div className="row my-3 align-items-center">
              <div className="col-md-8 col-lg-8 col-xl-7 order-md-1 order-2">
                <h3 style={{ color: '#187b31', fontWeight: 900 }} className="my-3">WELCOME TO RANKRISE</h3>
                <h1 className="fw-bolder subHcolor" style={{ fontSize: 20 }}>Best INTERMEDIATE COLLEGE with NEET, IIT-JEE, and
                  EAMCET
                  Coaching in HYDERABAD.</h1>
                <p className="Textstyle">At <strong>Rankrise </strong>,we are committed to empowering students
                  to achieve exceptional scores in medical and engineering entrance
                  examinations.with over <strong>14+ years of experience</strong> and a proven track record
                  of guiding students to secure all-India ranks,we offer a comprehensive
                  range of courses tailored to meet the unique needs of each aspirant.
                </p>
                <div id="moreContent" className={`mt-3 content-hidden${showAboutMore ? ' show' : ''}`}>
                  <p className="Textstyle">
                    Our curriculum is systematically structured, covering foundational concepts to advanced applications.
                    We follow a student-centric approach, blending interactive classroom teaching, comprehensive study
                    material,
                    daily practice, regular mock tests, and personalized doubt clarification to ensure complete learning.
                  </p>
                  <p className="Textstyle">
                    Our experienced faculty members are dedicated mentors who guide students academically and emotionally
                    throughout their preparation journey.
                  </p>
                  <p className="Textstyle">
                    with consistent results and strong student success stories, <strong>Rankrise</strong>
                    continues to shape
                    the futures of
                    thousands of aspirants, helping them secure admissions in top medical and engineering institutions across
                    India.
                  </p>
                </div>
                <button
                  type="button"
                  id="viewMoreBtn"
                  className="btn viewbtn"
                  onClick={() => setShowAboutMore((v) => !v)}
                  aria-expanded={showAboutMore}
                >
                  {showAboutMore ? 'View Less' : 'View More'}
                </button>
              </div>
              <div className="col-md-4 col-lg-4 col-xl-5 order-md-2 order-1">
                <img src="/assets/public/About-Banner.webp" alt="About Rankrise Educational Institutions" className="w-100" loading="lazy" />
              </div>
            </div>
          </div>
        </section>
        <section id="call-to-action" className="call-to-action section dark-background">
          <img src="/assets/public/mainlogobg.webp" alt="" loading="lazy" />
          <div className="container">
            <div className="row aos-init aos-animate" data-aos="zoom-in" data-aos-delay={100}>
              <div className="text-center text-xl-start w-100">
                <div className="section-title text-center">
                  <h2 className="mt-5 text-white">Rankrise Trained Students</h2>
                </div>
                <h3 className="text-center text-white" style={{ fontSize: '1.5rem', fontWeight: 500 }}>Hyderabad's Premier Coaching Institute</h3>
                <div className="trained-students-section my-4" ref={statsRef}>
                  <div className="container text-center">
                    <div className="row justify-content-center mt-4">

                      <div className="col-lg-3 col-md-3 col-sm-12 stat-card">
                        <div className={`stat-box${statsVisible ? ' visible' : ''}`}>
                          <h4>IIT-JEE</h4>
                          <h3 className="count">{counts.iit.toLocaleString('en-IN')}</h3><span>+</span>
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-3 col-sm-12 stat-card">
                        <div className={`stat-box${statsVisible ? ' visible' : ''}`}>
                          <h4>NEET</h4>
                          <h3 className="count">{counts.neet.toLocaleString('en-IN')}</h3><span>+</span>
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-3 col-sm-12 stat-card">
                        <div className={`stat-box${statsVisible ? ' visible' : ''}`}>
                          <h4>EAMCET</h4>
                          <h3 className="count">{counts.eamcet.toLocaleString('en-IN')}</h3><span>+</span>
                        </div>
                      </div>

                      <div className="col-lg-3 col-md-3 col-sm-12 stat-card">
                        <div className={`stat-box${statsVisible ? ' visible' : ''}`}>
                          <h4>BITSAT</h4>
                          <h3 className="count">{counts.bitsat.toLocaleString('en-IN')}</h3><span>+</span>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="courses-section py-5" ref={coursesRef}>
          <div className="container">

            {/* FIXED: Added mb-5 to force a clean layout space below the text title */}
            <div className="section-title text-center mb-5">
              <h2 className="my-3">COURSES OFFERED</h2>
            </div>

            {/* FIXED: Added mt-2 to the grid row container for a secondary margin buffer */}
            <div className="container-fluid px-md-5">
              <div className="row g-4 align-items-stretch mt-2">

                {/* IIT-JEE Long Term */}
                <div className="col-lg-4 col-md-6 col-sm-12 d-flex">
                  <Link to="/courses/iit-jee" className="course-link w-100">
                    <div className={`course-card w-100 h-100${coursesVisible ? " animate-down" : ""}`}>
                      <i className="fa-solid fa-user-graduate" />
                      <h3>IIT-JEE</h3>
                      <h4>LONG TERM</h4>
                      <p>
                        We offer top-notch long-term coaching designed to provide students with expert guidance and a
                        clear path to cracking the IIT-JEE exam.
                      </p>
                    </div>
                  </Link>
                </div>

                {/* NEET Long Term */}
                <div className="col-lg-4 col-md-6 col-sm-12 d-flex">
                  <Link to="/courses/neet" className="course-link w-100">
                    <div className={`course-card w-100 h-100${coursesVisible ? " animate-down" : ""}`}>
                      <i className="fa-solid fa-stethoscope" />
                      <h3>NEET</h3>
                      <h4>LONG TERM</h4>
                      <p>
                        Our expert NEET long-term coaching ensures students achieve top ranks and secure admissions to
                        the best medical colleges.
                      </p>
                    </div>
                  </Link>
                </div>

                {/* EAMCET Long Term */}
                <div className="col-lg-4 col-md-6 col-sm-12 d-flex">
                  <Link to="/courses/eamcet" className="course-link w-100">
                    <div className={`course-card w-100 h-100${coursesVisible ? " animate-down" : ""}`}>
                      <i className="fa-solid fa-gears" />
                      <h3>EAMCET</h3>
                      <h4>LONG TERM</h4>
                      <p>
                        We provide expert long-term programs designed to equip students with the skills and knowledge to
                        secure top ranks in EAMCET.
                      </p>
                    </div>
                  </Link>
                </div>

                {/* MPC with IIT-JEE */}
                <div className="col-lg-4 col-md-6 col-sm-12 d-flex">
                  <Link to="/college/mpc-iit" className="course-link w-100">
                    <div className={`course-card w-100 h-100${coursesVisible ? " animate-down" : ""}`}>
                      <i className="fa-solid fa-users-gear" />
                      <h3>MPC with IIT-JEE</h3>
                      <p>
                        Rankrise Jr. College’s MPC with IIT-JEE course delivers focused learning, rigorous practice,
                        and expert support to help students achieve their IIT goals.
                      </p>
                    </div>
                  </Link>
                </div>

                {/* BIPC with NEET */}
                <div className="col-lg-4 col-md-6 col-sm-12 d-flex">
                  <Link to="/college/bipc-neet" className="course-link w-100">
                    <div className={`course-card w-100 h-100${coursesVisible ? " animate-down" : ""}`}>
                      <i className="fa-solid fa-user-doctor" />
                      <h3>BIPC with NEET</h3>
                      <p>
                        Rankrise Jr. College offers BiPC with NEET coaching focused on strong fundamentals, expert teaching,
                        and disciplined preparation for top medical ranks.
                      </p>
                    </div>
                  </Link>
                </div>

                {/* MPC with EAMCET */}
                <div className="col-lg-4 col-md-6 col-sm-12 d-flex">
                  <Link to="/college/mpc-eamcet" className="course-link w-100">
                    <div className={`course-card w-100 h-100${coursesVisible ? " animate-down" : ""}`}>
                      <i className="fa-solid fa-graduation-cap" />
                      <h3>MPC with EAMCET</h3>
                      <p>
                        Rankrise Jr. College offers Intermediate MPC with EAMCET coaching focused on strong concepts,
                        expert mentoring, and result-driven training for top ranks.
                      </p>
                    </div>
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </section>
        <section>
          <div className="container">
            <div className="section-title text-center" data-aos="fade-up">
              <h2 className="my-2 my-md-5">Why Students Choose Rankrise?</h2>
            </div>
            <div className="row my-3 align-items-center">
              <div className="col-md-6 col-lg-5" data-aos="fade-right">
                <img src="/assets/public/whychooseus.webp" alt="Why choose Rankrise" className="w-100" loading="lazy" />
              </div>
              <div className="col-md-6 col-lg-7" data-aos="fade-left">
                <h6 className="fw-bolder subHcolor">Best NEET, IIT-JEE, BITSAT, and EAMCET Coaching Institute in HYDERABAD.</h6>
                <p className="Textstyle">
                  At <strong >Rankrise</strong>, we focus on building strong academic foundations
                  while shaping students into confident achievers. Our experienced faculty offer clear concept-based teaching
                  that makes learning simple,
                  structured, and result-driven. Every student receives personalized mentorship
                  and consistent doubt-support, ensuring they never feel left behind at any stage of preparation.
                </p>
                <p className="Textstyle">
                  Our curriculum is designed to strengthen fundamentals, develop analytical thinking,
                  and enhance problem-solving skills essential for <strong>NEET, IIT-JEE, and
                    EAMCET</strong>. Students
                  are guided through regular assignments, practice sessions, and mock tests that simulate
                  real exam patterns, helping them gain accuracy, speed, and confidence.
                </p>
                <p className="Textstyle">
                  We believe in disciplined learning and a supportive environment that encourages curiosity,
                  consistency, and growth. with well-planned study schedules, performance tracking, and continuous
                  feedback, students develop the mindset and work ethic needed to perform at their best.
                </p>
                <p className="Textstyle">
                  Over the years, <strong>Rankrise</strong> has helped countless students secure admissions
                  in top medical and engineering colleges. Our commitment is simple—provide the right guidance,
                  strong academic support, and complete motivation to help every student achieve their goals.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section style={{ backgroundColor: '#f9f9f9' }} className="py-5" id="imageslider">
          <div className="container text-center">
            <div className="section-title text-center">
              <div className="mb-5">
                <h2>Rankrise Student Life at Campus
                </h2>
                <p style={{ fontSize: 20 }}>Where study comfort, and guidance come together for top results.</p>
              </div>
            </div>
            <div className="image-slider">
              <div className="slider-track">
                <img src="/assets/public/sliderimg1.webp" alt="Student 1" loading="lazy" />
                <img src="/assets/public/sliderimg2.webp" alt="Student 2" loading="lazy" />
                <img src="/assets/public/sliderimg3.webp" alt="Student 3" loading="lazy" />
                <img src="/assets/public/sliderimg5.webp" alt="Student 5" loading="lazy" />
                <img src="/assets/public/sliderimg6.webp" alt="Student 6" loading="lazy" />
                <img src="/assets/public/sliderimg7.webp" alt="Student 7" loading="lazy" />
                <img src="/assets/public/sliderimg8.webp" alt="Student 8" loading="lazy" />
                <img src="/assets/public/sliderimg1.webp" alt="Student 1" loading="lazy" />
                <img src="/assets/public/sliderimg2.webp" alt="Student 2" loading="lazy" />
                <img src="/assets/public/sliderimg3.webp" alt="Student 3" loading="lazy" />
                <img src="/assets/public/sliderimg4.webp" alt="Student 4" loading="lazy" />
                <img src="/assets/public/sliderimg5.webp" alt="Student 5" loading="lazy" />
                <img src="/assets/public/sliderimg6.webp" alt="Student 6" loading="lazy" />
                <img src="/assets/public/sliderimg7.webp" alt="Student 7" loading="lazy" />
              </div>
            </div>
          </div>
        </section>
        <section className="py-4 py-md-5" style={{ background: '#f6f6f6' }}>
          {/* Custom CSS for Smooth Scrolling & Preventing Overlaps */}
          <style>{`
    .marquee-wrapper {
      display: flex;
      width: 100%;
      overflow: hidden;
    }
    .marquee-content {
      display: flex;
      animation: marqueeScroll 25s linear infinite;
    }
    .marquee-content:hover {
      animation-play-state: paused;
    }
    @keyframes marqueeScroll {
      0% { transform: translateX(0%); }
      100% { transform: translateX(-50%); }
    }
    .review-card-custom {
      min-width: 380px; 
      max-width: 420px;
      font-size: 1.05rem;
    }
    @media (max-width: 576px) {
      .review-card-custom {
        min-width: 300px;
        max-width: 320px;
        font-size: 0.95rem;
      }
    }
  `}</style>

          <div className="container">
            {/* FAQ SECTION */}
            <div className="row">
              <div className="col-12">
                <h2 className="mb-4 text-center fw-bold">Frequently Asked Questions</h2>
              </div>
            </div>

            <div className="row faq-section-row" id="faqAccordion">
              {/* Left Column (FAQs 1-7) */}
              <div className="col-md-6 mb-3 mb-md-0">
                <div className="accordion custom-accordion">

                  <div className="accordion-item mb-2">
                    <h2 className="accordion-header" id="headingOne">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
                        1. Why should I choose Rankrise for NEET, IIT-JEE, and EAMCET coaching in Hyderabad?
                      </button>
                    </h2>
                    <div id="collapseOne" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div className="accordion-body" style={{ whiteSpace: 'pre-line' }}>
                        Rankrise is committed to helping students achieve their dream of securing admission into top Medical and Engineering colleges. Our coaching methodology focuses on conceptual learning, disciplined preparation, experienced faculty guidance, personalized mentoring, regular mock tests, detailed performance analysis, and continuous doubt clarification. Students receive an exam-oriented study plan that improves both speed and accuracy while building strong fundamentals. The institute also provides a focused academic environment with structured programs for day scholars and residential students.
                      </div>
                    </div>
                  </div>

                  <div className="accordion-item mb-2">
                    <h2 className="accordion-header" id="headingTwo">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo">
                        2. Which courses are available at Rankrise?
                      </button>
                    </h2>
                    <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div className="accordion-body" style={{ whiteSpace: 'pre-line' }}>
                        Rankrise offers comprehensive coaching programs including:
                        NEET Long Term Coaching
                        NEET Short Term Coaching
                        IIT-JEE (Main & Advanced) Long Term Coaching
                        IIT-JEE Short Term Coaching
                        EAMCET Coaching
                        BITSAT Coaching
                        Intermediate MPC with IIT-JEE
                        Intermediate MPC with EAMCET
                        Intermediate BiPC with NEET
                        Foundation Programs for School Students
                        Every course is designed according to the latest examination pattern and syllabus.
                      </div>
                    </div>
                  </div>

                  <div className="accordion-item mb-2">
                    <h2 className="accordion-header" id="headingThree">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree">
                        3. Who can join Rankrise coaching?
                      </button>
                    </h2>
                    <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div className="accordion-body" style={{ whiteSpace: 'pre-line' }}>
                        Students from different academic backgrounds can join depending on their goals.
                        Class 11 students
                        Class 12 students
                        Intermediate MPC students
                        Intermediate BiPC students
                        NEET Repeaters
                        IIT-JEE Repeaters
                        EAMCET Aspirants
                        Students seeking integrated Intermediate with entrance coaching
                        Admission counselors help students choose the most suitable course based on their academic level and career aspirations.
                      </div>
                    </div>
                  </div>

                  <div className="accordion-item mb-2">
                    <h2 className="accordion-header" id="headingFour">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour">
                        4. What makes Rankrise different from other coaching institutes?
                      </button>
                    </h2>
                    <div id="collapseFour" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div className="accordion-body" style={{ whiteSpace: 'pre-line' }}>
                        Rankrise emphasizes complete academic development rather than rote learning.
                        Students benefit from:
                        Experienced faculty
                        Individual mentoring
                        Small batch attention
                        Daily practice sessions
                        Weekly and monthly grand tests
                        Performance tracking
                        Regular parent interaction
                        Doubt-solving sessions
                        Time management techniques
                        Competitive exam strategies
                        Motivation and career guidance
                        This structured approach helps students prepare confidently for highly competitive entrance examinations.
                      </div>
                    </div>
                  </div>

                  <div className="accordion-item mb-2">
                    <h2 className="accordion-header" id="headingFive">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive">
                        5. How are classes conducted at Rankrise?
                      </button>
                    </h2>
                    <div id="collapseFive" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div className="accordion-body" style={{ whiteSpace: 'pre-line' }}>
                        Classes follow a scientific learning methodology.
                        Every topic includes:
                        Concept explanation
                        Practical examples
                        Problem-solving sessions
                        Shortcuts and techniques
                        Daily assignments
                        Homework evaluation
                        Doubt clarification
                        Chapter-wise revision
                        Unit tests
                        Grand tests
                        Students receive continuous academic support throughout the course.
                      </div>
                    </div>
                  </div>

                  <div className="accordion-item mb-2">
                    <h2 className="accordion-header" id="headingSix">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSix">
                        6. Do students receive personal attention?
                      </button>
                    </h2>
                    <div id="collapseSix" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div className="accordion-body" style={{ whiteSpace: 'pre-line' }}>
                        Absolutely.
                        Every student is monitored individually.
                        Faculty members regularly review:
                        Attendance
                        Test performance
                        Subject-wise improvement
                        Weak topics
                        Study habits
                        Time management
                        Revision progress
                        This personalized mentoring ensures that no student is left behind.
                      </div>
                    </div>
                  </div>

                  <div className="accordion-item mb-2">
                    <h2 className="accordion-header" id="headingSeven">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSeven">
                        7. How often are tests conducted?
                      </button>
                    </h2>
                    <div id="collapseSeven" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div className="accordion-body" style={{ whiteSpace: 'pre-line' }}>
                        Rankrise follows a systematic testing schedule.
                        Students attend:
                        Daily practice tests
                        Weekly assessments
                        Monthly grand tests
                        Full syllabus mock exams
                        Previous year paper practice
                        NEET model exams
                        IIT-JEE pattern tests
                        EAMCET online practice exams
                        Each test is followed by detailed analysis and improvement strategies.
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Right Column (FAQs 8-14) */}
              <div className="col-md-6">
                <div className="accordion custom-accordion">

                  <div className="accordion-item mb-2">
                    <h2 className="accordion-header" id="headingEight">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEight">
                        8. Does Rankrise provide study material?
                      </button>
                    </h2>
                    <div id="collapseEight" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div className="accordion-body" style={{ whiteSpace: 'pre-line' }}>
                        Yes.
                        Students receive carefully prepared study material including:
                        Theory notes
                        Formula books
                        Practice worksheets
                        Assignment books
                        Previous year questions
                        Model papers
                        Mock tests
                        Revision notes
                        Quick reference materials
                        Study material is regularly updated according to the latest syllabus and examination pattern.
                      </div>
                    </div>
                  </div>

                  <div className="accordion-item mb-2">
                    <h2 className="accordion-header" id="headingNine">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseNine">
                        9. How does Rankrise improve students' exam performance?
                      </button>
                    </h2>
                    <div id="collapseNine" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div className="accordion-body" style={{ whiteSpace: 'pre-line' }}>
                        The institute focuses on:
                        Strong fundamentals
                        Concept clarity
                        Regular revisions
                        Time management
                        Smart problem-solving
                        Speed improvement
                        Accuracy enhancement
                        Stress management
                        Exam temperament
                        This balanced preparation helps students perform confidently during actual examinations.
                      </div>
                    </div>
                  </div>

                  <div className="accordion-item mb-2">
                    <h2 className="accordion-header" id="headingTen">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTen">
                        10. Does Rankrise provide hostel facilities?
                      </button>
                    </h2>
                    <div id="collapseTen" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div className="accordion-body" style={{ whiteSpace: 'pre-line' }}>
                        Yes.
                        Residential students receive:
                        Safe hostel accommodation
                        Hygienic food
                        Study hours supervision
                        Discipline
                        Academic monitoring
                        CCTV security
                        Dedicated wardens
                        Peaceful study environment
                        The hostel atmosphere encourages focused preparation.
                      </div>
                    </div>
                  </div>

                  <div className="accordion-item mb-2">
                    <h2 className="accordion-header" id="headingEleven">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEleven">
                        11. How do parents track their child's progress?
                      </button>
                    </h2>
                    <div id="collapseEleven" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div className="accordion-body" style={{ whiteSpace: 'pre-line' }}>
                        Parents receive regular academic updates including:
                        Attendance reports
                        Test scores
                        Subject performance
                        Faculty feedback
                        Improvement suggestions
                        Counseling sessions
                        Strong parent-institute communication helps students remain motivated.
                      </div>
                    </div>
                  </div>

                  <div className="accordion-item mb-2">
                    <h2 className="accordion-header" id="headingTwelve">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwelve">
                        12. Are doubt-clearing sessions available?
                      </button>
                    </h2>
                    <div id="collapseTwelve" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div className="accordion-body" style={{ whiteSpace: 'pre-line' }}>
                        Yes.
                        Dedicated doubt-clearing sessions are conducted regularly.
                        Students may ask questions during class, after class, or during special doubt-solving sessions to ensure every concept is fully understood.
                      </div>
                    </div>
                  </div>

                  <div className="accordion-item mb-2">
                    <h2 className="accordion-header" id="headingThirteen">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThirteen">
                        13. Where are Rankrise coaching centers located?
                      </button>
                    </h2>
                    <div id="collapseThirteen" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div className="accordion-body" style={{ whiteSpace: 'pre-line' }}>
                        Rankrise has multiple coaching centers in Hyderabad, including KPHB (main campus), Chandanagar, SR Nagar, and Dilsukhnagar, allowing students to choose a convenient branch.
                      </div>
                    </div>
                  </div>

                  <div className="accordion-item mb-2">
                    <h2 className="accordion-header" id="headingFourteen">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFourteen">
                        14. How can I take admission at Rankrise?
                      </button>
                    </h2>
                    <div id="collapseFourteen" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div className="accordion-body" style={{ whiteSpace: 'pre-line' }}>
                        Students can:
                        Visit the nearest Rankrise campus.
                        Meet the admission counseling team.
                        Choose the appropriate program.
                        Complete the registration process.
                        Begin classes according to the academic schedule.
                        The admissions team assists students and parents throughout the enrollment process.
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <hr className="my-5" style={{ opacity: '0.1' }} />

            {/* PARENT REVIEWS SECTION (Moved Down, Right-To-Left Continuous Animation) */}
            <div className="row mt-4">
              <div className="col-12">
                <h2 className="mb-4 text-center fw-bold">What Our Parents Say</h2>

                <div className="reviews-container overflow-hidden position-relative rounded shadow-sm bg-white py-4">
                  <div className="marquee-wrapper">

                    {/* Double the list to ensure endless looping text layout with zero breaks */}
                    <div className="marquee-content">
                      {/* Card 1 */}
                      <div className="review-card-custom mx-3 p-4 bg-light rounded border">
                        <div className="d-flex align-items-center mb-3">
                          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '48px', height: '48px', fontWeight: 'bold', fontSize: '1.2rem' }}>S</div>
                          <div>
                            <h5 className="mb-0 fw-bold">Srinivas Rao</h5>
                            <div className="text-warning small mt-1"><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i></div>
                          </div>
                        </div>
                        <p className="text-muted mb-0">"Excellent faculty and great infrastructure. My son improved his score significantly in just 6 months. Highly recommend Rankrise for IIT-JEE coaching."</p>
                      </div>

                      {/* Card 2 */}
                      <div className="review-card-custom mx-3 p-4 bg-light rounded border">
                        <div className="d-flex align-items-center mb-3">
                          <div className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '48px', height: '48px', fontWeight: 'bold', fontSize: '1.2rem' }}>P</div>
                          <div>
                            <h5 className="mb-0 fw-bold">Priya Reddy</h5>
                            <div className="text-warning small mt-1"><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i></div>
                          </div>
                        </div>
                        <p className="text-muted mb-0">"The best institute for NEET preparation in Hyderabad. The daily mock tests and personalized attention helped my daughter crack the exam."</p>
                      </div>

                      {/* Card 3 */}
                      <div className="review-card-custom mx-3 p-4 bg-light rounded border">
                        <div className="d-flex align-items-center mb-3">
                          <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '48px', height: '48px', fontWeight: 'bold', fontSize: '1.2rem' }}>K</div>
                          <div>
                            <h5 className="mb-0 fw-bold">Kiran Kumar</h5>
                            <div className="text-warning small mt-1"><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i></div>
                          </div>
                        </div>
                        <p className="text-muted mb-0">"Very disciplined environment. The hostel facilities are safe and clean. Faculty is always available for doubt clearance."</p>
                      </div>

                      {/* Duplicated for Loop Continuity */}
                      <div className="review-card-custom mx-3 p-4 bg-light rounded border">
                        <div className="d-flex align-items-center mb-3">
                          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '48px', height: '48px', fontWeight: 'bold', fontSize: '1.2rem' }}>S</div>
                          <div>
                            <h5 className="mb-0 fw-bold">Srinivas Rao</h5>
                            <div className="text-warning small mt-1"><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i></div>
                          </div>
                        </div>
                        <p className="text-muted mb-0">"Excellent faculty and great infrastructure. My son improved his score significantly in just 6 months. Highly recommend Rankrise for IIT-JEE coaching."</p>
                      </div>

                      <div className="review-card-custom mx-3 p-4 bg-light rounded border">
                        <div className="d-flex align-items-center mb-3">
                          <div className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '48px', height: '48px', fontWeight: 'bold', fontSize: '1.2rem' }}>P</div>
                          <div>
                            <h5 className="mb-0 fw-bold">Priya Reddy</h5>
                            <div className="text-warning small mt-1"><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i></div>
                          </div>
                        </div>
                        <p className="text-muted mb-0">"The best institute for NEET preparation in Hyderabad. The daily mock tests and personalized attention helped my daughter crack the exam."</p>
                      </div>

                      <div className="review-card-custom mx-3 p-4 bg-light rounded border">
                        <div className="d-flex align-items-center mb-3">
                          <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '48px', height: '48px', fontWeight: 'bold', fontSize: '1.2rem' }}>K</div>
                          <div>
                            <h5 className="mb-0 fw-bold">Kiran Kumar</h5>
                            <div className="text-warning small mt-1"><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i></div>
                          </div>
                        </div>
                        <p className="text-muted mb-0">"Very disciplined environment. The hostel facilities are safe and clean. Faculty is always available for doubt clearance."</p>
                      </div>
                    </div>

                  </div>

                  <div className="text-center mt-4 pt-3 border-top">
                    <img src="/assets/public/Rankriseurl-logo.webp" alt="Rankrise" style={{ height: '35px', objectFit: 'contain' }} />
                  </div>

                </div>
              </div>
            </div>

          </div>
        </section>
        <section className="testimonials my-3 my-md-4">
          <div className="section-title text-center">
            <div className="mb-3">
              <h2>Our pride, their success</h2>
              <h6 style={{ fontWeight: 600 }}>A legacy of 80,000 victories</h6>
            </div>
          </div>
          <div className="container">
            <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel" data-bs-interval={4000}>
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <div className="row justify-content-center align-items-center g-0">
                    <div className="col-md-4 col-lg-3 text-center">
                      <img src="/assets/public/Neet42.webp" alt="Rankrise NEET result" className="img-fluid rounded shadow" loading="lazy" />
                    </div>
                    <div className="col-md-8 col-lg-7">
                      <div className="card response1">
                        <div className="card-body">
                          <h2>AIR-42</h2>
                          <p>NEET</p>
                          <h4 style={{ color: '#f9f400' }}>Harinipriya</h4>
                          <p className="mb-0 testimonial-text">
                            Hi, I’m P.Harinipriya. I have secured AIR 42 in NEET 2024.
                            The guidance and support I received from Rankrise Institute were exceptional.
                            The well-structured study plan, regular mock tests, and doubt-clearing sessions
                            made my preparation smooth and effective. The Management and faculty constantly
                            motivated us to push our limits. Securing AIR 42 in NEET was a dream come true!
                            “A Perfect Place for NEET Aspirants!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="carousel-item">
                  <div className="row justify-content-center align-items-center g-0">
                    <div className="col-md-4 col-lg-3 text-center">
                      <img src="/assets/public/Neet58.webp" alt="Rankrise NEET result" className="img-fluid rounded shadow" loading="lazy" />
                    </div>
                    <div className="col-md-8 col-lg-7">
                      <div className="card response1">
                        <div className="card-body">
                          <h2>AIR-58</h2>
                          <p>NEET</p>
                          <h4 style={{ color: '#f9f400' }}>Sri Saivarshni</h4>
                          <p className="mb-0 testimonial-text">
                            What sets this Rankrise institute apart is its high-quality study
                            material and experienced faculty team. Every topic was covered in depth,
                            and the practice tests were designed to simulate the actual NEET exam.
                            The personal mentorship I received helped me improve in weaker areas.
                            Thanks to their constant support, I achieved AIR 58!
                            <br />
                            Sri Saivarshini (NEET AIR 58)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="carousel-item">
                  <div className="row justify-content-center align-items-center g-0">
                    <div className="col-md-4 col-lg-3 text-center">
                      <img src="/assets/public/Neet76.webp" alt="Rankrise NEET result" className="img-fluid rounded shadow" loading="lazy" />
                    </div>
                    <div className="col-md-8 col-lg-7">
                      <div className="card response1">
                        <div className="card-body">
                          <h2>AIR-76</h2>
                          <p>NEET</p>
                          <h4 style={{ color: '#f9f400' }}>Manohar Reddy</h4>
                          <p className="mb-0 testimonial-text">
                            The best part about Rankrise Institute is their well-structured approach
                            to NEET preparation. The daily practice sessions, revision modules,
                            and continuous assessments helped me refine my preparation. The personalized
                            guidance made all the difference. I’m proud to have secured AIR 76!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="carousel-item">
                  <div className="row justify-content-center align-items-center g-0">
                    <div className="col-md-4 col-lg-3 text-center">
                      <img src="/assets/public/IIT-JEE-53.webp" alt="Rankrise IIT-JEE result" className="img-fluid rounded shadow" loading="lazy" />
                    </div>
                    <div className="col-md-8 col-lg-7">
                      <div className="card response1">
                        <div className="card-body">
                          <h2>AIR-53</h2>
                          <p>IIT-JEE</p>
                          <h4 style={{ color: '#f9f400' }}>Abhishek Reddy</h4>
                          <p className="mb-0 testimonial-text">
                            "This Rankrise Institute played a crucial role in my IIT-JEE success.
                            The faculty ensured that every concept was clear, and their strategic
                            approach to problem-solving helped me tackle difficult questions with ease.
                            Their test series was a game-changer, giving me the confidence to face the real exam.
                            I secured AIR 53 in IIT-JEE and am forever grateful. I couldn’t have done it without their
                            support!"
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="carousel-item">
                  <div className="row justify-content-center align-items-center g-0">
                    <div className="col-md-4 col-lg-3 text-center">
                      <img src="/assets/public/IIT-JEE-69.webp" alt="Rankrise IIT-JEE result" className="img-fluid rounded shadow" loading="lazy" />
                    </div>
                    <div className="col-md-8 col-lg-7">
                      <div className="card response1">
                        <div className="card-body">
                          <h2>AIR-69</h2>
                          <p>IIT-JEE</p>
                          <h4 style={{ color: '#f9f400' }}>Kranthi Kiran</h4>
                          <p className="mb-0 testimonial-text">
                            "The constant support and guidance from the faculty helped
                            me stay motivated and focused during the entire course of preparation.
                            The regular tests helped me stay on track, and I was able to analyze
                            my performance and improve my strategy. with their help, I achieved AIR 69,
                            and I am now in the prestigious IIT campus!"
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="carousel-item">
                  <div className="row justify-content-center align-items-center g-0">
                    <div className="col-md-4 col-lg-3 text-center">
                      <img src="/assets/public/IIT-JEE-85.webp" alt="Rankrise IIT-JEE result" className="img-fluid rounded shadow" loading="lazy" />
                    </div>
                    <div className="col-md-8 col-lg-7">
                      <div className="card response1">
                        <div className="card-body">
                          <h2>AIR-85</h2>
                          <p>IIT-JEE</p>
                          <h4 style={{ color: '#f9f400' }}>Sriram Kumar</h4>
                          <p className="mb-0 testimonial-text">
                            "The structured approach to the syllabus at this institute
                            played a huge role in my success. The expert faculty ensured
                            I had a strong foundation in both Physics and Mathematics, two subjects
                            I once struggled with. The weekly assessments, regular doubt-solving classes,
                            and concept-based learning truly made a difference. Securing AIR 85 in IIT-JEE
                            is the result of all the guidance and hard work at this institute!"
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true" />
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next ps-md-5 ps-0" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true" />
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </section>
        <div className="modal fade p-2" id="earlyBirdModal" tabIndex={-1} aria-label="Early Bird Admission Offer">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 bg-transparent position-relative">
              <button type="button" className="btn-close btn-close-white position-absolute top-0 end-0 m-2" data-bs-dismiss="modal" aria-label="Close" />
              <img src="/assets/public/EarlyBird-banner.webp" className="img-fluid d-none d-md-block rounded shadow-lg" alt="Web View Image" loading="lazy" />
              <div className="d-block d-md-none shadow-lg">
                <img src="/assets/public/Early-Bird-Banner-mobile.webp" className="img-fluid " alt="Mobile View Image" loading="lazy" />
                <div className="sidebar text-white shadow" style={{ background: '#e9f6fe', padding: 10 }}>
                  <div className="p-3 rounded" style={{ background: '#e2ffee' }}>
                    <div className="text-center">
                      <h3 className="fw-bold" style={{ fontSize: 25, color: '#015927' }}>ADMISSION ENQUIRY</h3>
                      <p className=" fw-bold my-3 mb-0 text-black">
                        BEGIN YOUR SUCCESS JOURNEY
                      </p>
                      <p className=" fw-bold text-black">
                        with RANKRISE!
                      </p>
                    </div>
                    <EnquiryForm idPrefix="earlybird_" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
