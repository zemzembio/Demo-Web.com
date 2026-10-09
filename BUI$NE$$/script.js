/* PRERJA BARBER CLUB demo
   Built with vanilla JavaScript + jQuery.
   To enable real WhatsApp booking, enter the business number below in international format,
   digits only, e.g. Kosovo: 3834XXXXXXXX. Leave empty while presenting this as a demo. */
const WHATSAPP_NUMBER = "";

// Vanilla JavaScript: set booking date minimum to today and keep the year current.
const dateInput = document.getElementById("booking-date");
const yearTarget = document.getElementById("current-year");
if (dateInput) {
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
  dateInput.min = localToday;
}
if (yearTarget) yearTarget.textContent = String(new Date().getFullYear());

$(function () {
  const $body = $("body");
  const $menuToggle = $(".menu-toggle");
  const $nav = $(".primary-nav");
  const $toast = $("#toast");
  let toastTimer;

  function showToast(message) {
    clearTimeout(toastTimer);
    $toast.text(message).addClass("is-visible");
    toastTimer = setTimeout(() => $toast.removeClass("is-visible"), 3600);
  }

  function closeMenu() {
    $menuToggle.attr("aria-expanded", "false");
    $nav.removeClass("is-open");
    $body.removeClass("menu-open");
  }

  // Mobile navigation.
  $menuToggle.on("click", function () {
    const opening = $(this).attr("aria-expanded") !== "true";
    $(this).attr("aria-expanded", String(opening));
    $nav.toggleClass("is-open", opening);
    $body.toggleClass("menu-open", opening);
  });
  $nav.find("a").on("click", closeMenu);
  $(document).on("keydown", function (event) {
    if (event.key === "Escape") {
      closeMenu();
      closeLightbox();
    }
  });

  // Stagger simple reveal transitions as sections enter the viewport.
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -20px 0px" });
    revealElements.forEach((element, index) => {
      element.style.transitionDelay = `${Math.min(index % 4, 3) * 65}ms`;
      observer.observe(element);
    });
  } else {
    revealElements.forEach(element => element.classList.add("is-revealed"));
  }

  // Gallery filters.
  $(".filter-button").on("click", function () {
    const filter = $(this).data("filter");
    $(".filter-button").removeClass("is-active").attr("aria-pressed", "false");
    $(this).addClass("is-active").attr("aria-pressed", "true");
    $(".gallery-item").each(function () {
      const matches = filter === "all" || $(this).data("category") === filter;
      $(this).toggleClass("is-hidden", !matches);
      if (matches) $(this).stop(true, true).css("opacity", 0).animate({ opacity: 1 }, 230);
    });
  }).attr("aria-pressed", function () { return $(this).hasClass("is-active") ? "true" : "false"; });

  // Lightbox for gallery images.
  const $lightbox = $("#lightbox");
  const $lightboxImage = $("#lightbox-image");
  function openLightbox(src, alt) {
    $lightboxImage.attr({ src, alt: alt || "Fotografi e zmadhuar" });
    $lightbox.addClass("is-open").attr("aria-hidden", "false");
    $body.css("overflow", "hidden");
    $lightbox.find(".lightbox-close").trigger("focus");
  }
  function closeLightbox() {
    if (!$lightbox.hasClass("is-open")) return;
    $lightbox.removeClass("is-open").attr("aria-hidden", "true");
    $lightboxImage.attr("src", "");
    $body.css("overflow", "");
  }
  $(".gallery-item").on("click", function () {
    const fullImage = $(this).data("full") || $(this).find("img").attr("src");
    openLightbox(fullImage, $(this).find("img").attr("alt"));
  });
  $lightbox.find(".lightbox-close").on("click", closeLightbox);
  $lightbox.on("click", function (event) {
    if (event.target === this) closeLightbox();
  });

  // Booking form: validates client-side and either opens WhatsApp or clearly stays in demo mode.
  const $bookingForm = $("#booking-form");
  const $formMessage = $("#form-message");
  $bookingForm.on("submit", function (event) {
    event.preventDefault();
    $formMessage.removeClass("is-visible is-error").text("");

    const form = this;
    if (!form.checkValidity()) {
      form.reportValidity();
      $formMessage.addClass("is-visible is-error").text("Plotëso fushat e kërkuara dhe kontrollo të dhënat para se të vazhdosh.");
      return;
    }

    const data = {
      name: $("#customer-name").val().trim(),
      phone: $("#customer-phone").val().trim(),
      service: $("#service-select").val(),
      barber: $("#barber-select").val(),
      date: $("#booking-date").val(),
      time: $("#booking-time").val(),
      notes: $("#booking-notes").val().trim()
    };

    // Basic phone sanity check. The business can apply a stricter local format if needed.
    const phoneDigits = data.phone.replace(/\D/g, "");
    if (phoneDigits.length < 7) {
      $formMessage.addClass("is-visible is-error").text("Kontrollo numrin e telefonit. Shkruaj një numër të vlefshëm kontakti.");
      $("#customer-phone").trigger("focus");
      return;
    }

    const message = [
      "Përshëndetje PRERJA Barber Club! Dua të kërkoj një termin:",
      `Emri: ${data.name}`,
      `Telefoni: ${data.phone}`,
      `Shërbimi: ${data.service}`,
      `Berberi: ${data.barber}`,
      `Data: ${data.date}`,
      `Ora: ${data.time}`,
      data.notes ? `Shënim: ${data.notes}` : ""
    ].filter(Boolean).join("\n");

    if (WHATSAPP_NUMBER.trim()) {
      const url = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank", "noopener,noreferrer");
      $formMessage.addClass("is-visible").text("U përgatit mesazhi për WhatsApp. Dërgoje mesazhin për t'i kërkuar biznesit konfirmimin e terminit.");
    } else {
      $formMessage.addClass("is-visible").text("Demo funksionale: formulari u validua, por kërkesa nuk u dërgua. Për rezervime reale, vendos numrin WhatsApp të biznesit te WHATSAPP_NUMBER në script.js.");
      showToast("Formulari u kontrollua. Demo mode: nuk u dërgua rezervim real.");
    }
  });

  // Service-row arrow buttons point to the appointment form with no dead-end interaction.
  $(".service-arrow, .team-meta>a").on("click", function () {
    const label = $(this).attr("aria-label") || "";
    const lower = label.toLowerCase();
    if (lower.includes("skin fade")) $("#service-select").val("Skin fade · €12");
    else if (lower.includes("klasike")) $("#service-select").val("Prerje klasike · €10");
    else if (lower.includes("mjekr")) $("#service-select").val("Rregullim i mjekrës · €6");
    else if (lower.includes("fëmijë")) $("#service-select").val("Prerje për fëmijë · €8");
    else if (lower.includes("prerje dhe mjekër")) $("#service-select").val("Prerje + mjekër · €16");
    const barberMatch = label.match(/me (Ardin|Leartin|Drinin)/i);
    if (barberMatch) {
      const barberNames = { ardin: "Ardi Krasniqi", leartin: "Leart Berisha", drinin: "Drin Gashi" };
      $("#barber-select").val(barberNames[barberMatch[1].toLowerCase()] || "Nuk ka preferencë");
    }
  });

  // Keep clicks on anchor links smooth and close the mobile menu on navigation.
  $("a[href^='#']").on("click", function (event) {
    const target = document.querySelector(this.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    closeMenu();
    target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  });
});
