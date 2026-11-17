/**
 * project-detail.js
 * ---------------------------------------------------------------------------
 * Behaviors specific to individual case study pages:
 *   1. Reading progress bar
 *   2. Sticky table-of-contents scroll-spy (active section highlighting)
 *   3. Image lightbox (Esc/arrow-key navigable)
 */

/* ---- 1. Reading progress bar ------------------------------------------- */
(function progressBar() {
  const fill = document.querySelector("[data-progress-fill]");
  if (!fill) return;

  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
    fill.style.width = `${pct}%`;
  }

  update();
  window.addEventListener("scroll", update, { passive: true });
})();

/* ---- 2. Sticky ToC scroll-spy ------------------------------------------- */
(function tocScrollSpy() {
  const links = document.querySelectorAll("[data-toc-link]");
  if (links.length === 0) return;

  const sections = Array.from(links)
    .map((link) => document.getElementById(link.getAttribute("data-toc-link")))
    .filter(Boolean);

  if (sections.length === 0 || !("IntersectionObserver" in window)) return;

  const linkFor = (id) => document.querySelector(`[data-toc-link="${id}"]`);

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) {
        links.forEach((l) => l.classList.remove("is-active"));
        const active = linkFor(visible[0].target.id);
        if (active) active.classList.add("is-active");
      }
    },
    { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
})();

/* ---- 3. Image lightbox --------------------------------------------------- */
(function lightbox() {
  const lightboxEl = document.getElementById("lightbox");
  if (!lightboxEl) return;

  const imgEl = lightboxEl.querySelector("[data-lightbox-image]");
  const captionEl = lightboxEl.querySelector("[data-lightbox-caption]");
  const closeBtn = lightboxEl.querySelector("[data-lightbox-close]");
  const frame = lightboxEl.querySelector(".lightbox__frame");

  let currentGroup = [];
  let currentIndex = 0;
  let lastTrigger = null;

  function renderCurrent() {
    const item = currentGroup[currentIndex];
    if (!item) return;
    imgEl.src = item.src;
    imgEl.alt = item.alt || "";
    if (captionEl) {
      captionEl.textContent = item.caption || "";
      captionEl.hidden = !item.caption;
    }
  }

  function open(group, index, trigger) {
    currentGroup = group;
    currentIndex = index;
    lastTrigger = trigger;
    renderCurrent();
    lightboxEl.classList.add("is-open");
    lightboxEl.setAttribute("aria-hidden", "false");
    frame.setAttribute("tabindex", "-1");
    frame.focus();
    document.addEventListener("keydown", onKeyDown);
  }

  function close() {
    lightboxEl.classList.remove("is-open");
    lightboxEl.setAttribute("aria-hidden", "true");
    document.removeEventListener("keydown", onKeyDown);
    if (lastTrigger) lastTrigger.focus();
  }

  function onKeyDown(e) {
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") {
      currentIndex = (currentIndex + 1) % currentGroup.length;
      renderCurrent();
    }
    if (e.key === "ArrowLeft") {
      currentIndex = (currentIndex - 1 + currentGroup.length) % currentGroup.length;
      renderCurrent();
    }
  }

  closeBtn.addEventListener("click", close);
  lightboxEl.addEventListener("click", (e) => {
    if (e.target === lightboxEl) close();
  });

  // Each gallery group shares a data-gallery id; triggers within the same
  // group support arrow-key navigation between each other.
  const groups = new Map();
  document.querySelectorAll("[data-lightbox-trigger]").forEach((trigger) => {
    const groupId = trigger.getAttribute("data-gallery") || "default";
    if (!groups.has(groupId)) groups.set(groupId, []);
    groups.get(groupId).push({
      src: trigger.getAttribute("data-full-src"),
      alt: trigger.getAttribute("data-full-alt") || "",
      caption: trigger.getAttribute("data-caption") || "",
      el: trigger,
    });
  });

  groups.forEach((group) => {
    group.forEach((item, index) => {
      item.el.addEventListener("click", () => open(group, index, item.el));
    });
  });
})();
