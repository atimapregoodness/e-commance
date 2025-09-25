// public/js/main.js
document.addEventListener("DOMContentLoaded", () => {
  // ---------------------------
  // Smooth scroll for anchor links
  // ---------------------------
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // ---------------------------
  // Header scroll effect
  // ---------------------------
  const header = document.querySelector(".site-header");
  const toggleBtn = document.querySelector(".mobile-toggle");

  // Create overlay
  const overlay = document.createElement("div");
  overlay.classList.add("nav-overlay");
  document.body.appendChild(overlay);

  // Mobile toggle
  toggleBtn.addEventListener("click", () => {
    header.classList.toggle("open");
    overlay.classList.toggle("active");
  });

  // Close menu when overlay is clicked
  overlay.addEventListener("click", () => {
    header.classList.remove("open");
    overlay.classList.remove("active");
  });

  // Scroll brand hide
  const brandSection = document.querySelector(".brand-section");
  let isHidden = false;
  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 80 && !isHidden) {
          brandSection.classList.add("hide-brand");
          isHidden = true;
        } else if (window.scrollY <= 80 && isHidden) {
          brandSection.classList.remove("hide-brand");
          isHidden = false;
        }
        ticking = false;
      });
      ticking = true;
    }
  });

  const promoTrack = document.getElementById("promoTrack");
  const promoImages = promoTrack.querySelectorAll("img");
  const dotsContainer = document.getElementById("promoDots");

  let currentIndex = 0;

  // Create dots
  promoImages.forEach((_, index) => {
    const dot = document.createElement("button");
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => showSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll("button");

  function showSlide(index) {
    promoTrack.style.transform = `translateX(-${index * 100}%)`;
    currentIndex = index;
    updateDots();
  }

  function updateDots() {
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });
  }

  // Auto-slide
  let interval = setInterval(nextSlide, 4000);

  function nextSlide() {
    const newIndex = (currentIndex + 1) % promoImages.length;
    showSlide(newIndex);
  }

  // Pause on hover
  promoTrack.addEventListener("mouseenter", () => clearInterval(interval));
  promoTrack.addEventListener("mouseleave", () => {
    interval = setInterval(nextSlide, 4000);
  });
});
