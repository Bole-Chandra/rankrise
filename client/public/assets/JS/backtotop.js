document.addEventListener("DOMContentLoaded", function () {
  console.log("JS Loaded ✅");

  const backToTopBtn = document.getElementById("backToTop");
  console.log("Button:", backToTopBtn);

  if (!backToTopBtn) return;

  window.addEventListener("scroll", function () {
    if (window.scrollY > 200) {
      backToTopBtn.style.display = "flex";
    } else {
      backToTopBtn.style.display = "none";
    }
  });

  backToTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
});
