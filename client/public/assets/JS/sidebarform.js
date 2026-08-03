document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("cName").value.trim();
    const mobile = document.getElementById("cMobile").value.trim();
    const email = document.getElementById("cEmail").value.trim();
    const location = document.getElementById("cLocation").value.trim();

    // ✅ Basic validation
    if (!name || !mobile || !email || !location) {
        alert("Please fill all fields");
        return;
    }

    const whatsappNumber = "919948962952";

    const message =
        `📌 *New Admission Enquiry*\n\n` +
        `*Name:* ${name}\n` +
        `*Mobile:* ${mobile}\n` +
        `*Email:* ${email}\n` +
        `*Location:* ${location}`;

    const whatsappURL =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    // ✅ Open WhatsApp
    window.open(whatsappURL, "_blank");

    // Track this as a GA4 event + Google Ads conversion, if gtag is loaded
    // (see client/src/config/tracking.js to configure IDs)
    if (typeof window.gtag === "function") {
        window.gtag("event", "generate_lead", { form_name: "whatsapp_modal" });
    }
    // Also fire the Meta Pixel Lead event, if the Pixel is loaded
    if (typeof window.fbq === "function") {
        window.fbq("track", "Lead", { content_name: "whatsapp_modal" });
    }

    // ✅ Close modal safely (only if modal exists)
    const modalEl = document.getElementById("contactModal");
    if (modalEl) {
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) modalInstance.hide();
    }

    // ✅ Success popup (optional)
    const popup = document.getElementById("successPopup");
    if (popup) {
        popup.style.display = "flex";
        setTimeout(() => popup.style.display = "none", 7000);
    }

    // ✅ Reset form
    document.getElementById("contactForm").reset();
});