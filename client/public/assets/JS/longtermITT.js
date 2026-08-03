// Toggle Why Choose Rankrise
const whyToggle = document.getElementById("whyToggle");
const whyToggleText = whyToggle.querySelector(".toggle-text");
const whyToggleIcon = whyToggle.querySelector("i");

whyToggle.onclick = function () {
    let short = document.getElementById("whyShort");
    let full = document.getElementById("whyFull");

    if (full.classList.contains("d-none")) {
        full.classList.remove("d-none");
        short.classList.add("d-none");
        whyToggleText.textContent = "View Less";
        whyToggleIcon.classList.remove("fa-arrow-right");
        whyToggleIcon.classList.add("fa-arrow-up");
    } else {
        full.classList.add("d-none");
        short.classList.remove("d-none");
        whyToggleText.textContent = "View More";
        whyToggleIcon.classList.remove("fa-arrow-up");
        whyToggleIcon.classList.add("fa-arrow-right");
    }
};


// Toggle Teaching Methodology
const teachToggle = document.getElementById("teachToggle");
const teachToggleText = teachToggle.querySelector(".toggle-text");
const teachToggleIcon = teachToggle.querySelector("i");

teachToggle.onclick = function () {
    let short = document.getElementById("teachShort");
    let full = document.getElementById("teachFull");

    if (full.classList.contains("d-none")) {
        full.classList.remove("d-none");
        short.classList.add("d-none");
        teachToggleText.textContent = "View Less";
        teachToggleIcon.classList.remove("fa-arrow-right");
        teachToggleIcon.classList.add("fa-arrow-up");
    } else {
        full.classList.add("d-none");
        short.classList.remove("d-none");
        teachToggleText.textContent = "View More";
        teachToggleIcon.classList.remove("fa-arrow-up");
        teachToggleIcon.classList.add("fa-arrow-right");
    }
};
