/**
 * project-filter.js
 * ---------------------------------------------------------------------------
 * Filters the project catalogue by category. Each .project-card carries a
 * data-categories attribute (comma-separated). Filtering is pure show/hide —
 * no data model needed, since the cards are already hand-written in HTML.
 */
(function () {
  const chips = document.querySelectorAll("[data-filter-chip]");
  const cards = document.querySelectorAll("[data-categories]");
  const countEl = document.querySelector("[data-filter-count]");
  const emptyState = document.querySelector("[data-empty-state]");

  if (chips.length === 0 || cards.length === 0) return;

  function applyFilter(category) {
    let visibleCount = 0;

    cards.forEach((card) => {
      const categories = card.getAttribute("data-categories").split(",");
      const matches = category === "all" || categories.includes(category);
      card.style.display = matches ? "" : "none";
      if (matches) visibleCount += 1;
    });

    if (countEl) {
      countEl.textContent = `${visibleCount} ${visibleCount === 1 ? "project" : "projects"}`;
    }
    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.setAttribute("aria-pressed", "false"));
      chip.setAttribute("aria-pressed", "true");
      applyFilter(chip.getAttribute("data-filter-chip"));
    });
  });

  applyFilter("all");
})();
