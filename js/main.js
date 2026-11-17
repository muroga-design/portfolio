/**
 * main.js
 * ---------------------------------------------------------------------------
 * Site-wide behavior used on every page:
 *   1. Mobile menu toggle
 *   2. Footer year
 */

/* ---- 1. Mobile menu toggle ---------------------------------------------- */
(function mobileMenu() {
  const toggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");
  if (!toggle || !mobileNav) return;

  toggle.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    });
  });
})();

/* ---- 2. Footer year ------------------------------------------------------ */
(function footerYear() {
  const el = document.querySelector("[data-footer-year]");
  if (el) {
    el.textContent = `© ${new Date().getFullYear()} Sofia Muroga. All rights reserved.`;
  }
})();
