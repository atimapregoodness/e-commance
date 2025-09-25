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
  // Mobile nav toggle
  // ---------------------------
  // ---------------------------
  // Mobile Navbar Toggle
  // ---------------------------
  const mobileToggle = document.querySelector(".mobile-toggle");
  const siteHeader = document.querySelector(".site-header");
  const mobileNav = document.querySelector(".mobile-nav");
  const navOverlay = document.querySelector(".nav-overlay");

  if (mobileToggle && siteHeader && mobileNav && navOverlay) {
    const toggleMenu = () => {
      siteHeader.classList.toggle("open");
      mobileNav.classList.toggle("active");
      navOverlay.classList.toggle("active");
    };

    mobileToggle.addEventListener("click", toggleMenu);

    // Close menu when clicking overlay
    navOverlay.addEventListener("click", toggleMenu);
  }

  if (brandSection) {
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
  }

  // ---------------------------
  // Promo slider
  // ---------------------------
  const promoTrack = document.getElementById("promoTrack");
  const dotsContainer = document.getElementById("promoDots");

  if (promoTrack && dotsContainer) {
    const promoImages = promoTrack.querySelectorAll("img");
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
  }
});
