// <!-- <<<Navbar Script>>> -->
 document.addEventListener('DOMContentLoaded', function () {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link, .dropdown-item');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href === currentPage) {
        link.classList.add('active');
        const parentDropdown = link.closest('.dropdown');
        if (parentDropdown) {
          parentDropdown.querySelector('.nav-link').classList.add('active');
        }
      }
    });
  });

// <!-- <<<About Us Script>>> -->
const btn = document.getElementById("viewMoreBtn");
const content = document.getElementById("moreContent");

if (btn && content) {
  btn.addEventListener("click", () => {
    content.classList.toggle("show");
    btn.textContent = content.classList.contains("show") ? "View Less" : "View More";
  });
}

// <!-- <<<Count section script>>> -->
// REMOVED: Counter animation is now handled by React in Home.jsx
// This prevents conflicts between React state and vanilla JS DOM manipulation

// <!-- <<<Courses Offered script>>> -->
document.addEventListener("DOMContentLoaded", function () {
  const section = document.querySelector(".courses-section");
  const cards = document.querySelectorAll(".course-card");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        cards.forEach((card, i) => {
          setTimeout(() => {
            card.classList.add("animate-down");
          }, i * 200);
        });
        observer.unobserve(section);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(section);
});

// <!-- <<< rank_predictor Script>>> -->
document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".ppx");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  cards.forEach((card) => observer.observe(card));
});

  // <!-- <<<<Frequently Asked Questions script>>> -->

$(document).ready(function () {

  const openId = localStorage.getItem("openFaqId");
  if (openId) {
    const $item = $(`.faq-item[data-id="${openId}"]`);
    $item.addClass("active");
    $item.find(".faq-answer").slideDown();
  }

  $(".faq-question").on("click", function () {
    const $item = $(this).closest(".faq-item");


    $(".faq-item").not($item).removeClass("active").find(".faq-answer").slideUp();


    $item.toggleClass("active");
    $item.find(".faq-answer").slideToggle();

  
    if ($item.hasClass("active")) {
      localStorage.setItem("openFaqId", $item.data("id"));

      $('html, body').animate({
        scrollTop: $item.offset().top - 20
      }, 500);
    } else {
      localStorage.removeItem("openFaqId");
    }
  });
});


