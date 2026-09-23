(function () {
  "use strict";

  const grid = document.getElementById("product-grid");
  const starterGrid = document.getElementById("starter-grid");
  const starterTotal = document.getElementById("starter-total");
  const emptyState = document.getElementById("empty-state");
  const resultsCount = document.getElementById("results-count");
  const searchInput = document.getElementById("search");
  const ungatingFilter = document.getElementById("ungating-filter");
  const categoryChips = document.getElementById("category-chips");
  const modalBackdrop = document.getElementById("modal-backdrop");
  const modalBody = document.getElementById("modal-body");
  const modalClose = document.getElementById("modal-close");

  let products = Array.isArray(window.PRODUCTS) ? window.PRODUCTS.slice() : [];
  let activeCategory = "all";

  const PLACEHOLDER_SVG =
    '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
    '<rect x="3" y="5" width="18" height="14" rx="1.5" stroke="currentColor" stroke-width="1.5"/>' +
    '<circle cx="8.5" cy="10" r="1.5" fill="currentColor" opacity="0.55"/>' +
    '<path d="M3.5 16.5l5-4.5 3.5 3 2.5-2.5 6 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
    "</svg>";

  function escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function ungatingLabel(level) {
    if (level === "low") return "Low–Med";
    if (level === "high") return "Med–High";
    return "Med";
  }

  function ungatingClass(level) {
    if (level === "low") return "level-low";
    if (level === "high") return "level-high";
    return "level-med";
  }

  function matchesUngating(product, filter) {
    if (filter === "all") return true;
    return product.ungatingLevel === filter;
  }

  function matchesCategory(product, category) {
    if (category === "all") return true;
    return product.category === category;
  }

  function matchesSearch(product, query) {
    if (!query) return true;
    const hay = [
      product.name,
      product.brand,
      product.category,
      product.asin,
      product.whyFit,
      product.amazonPriceApprox,
      product.wholesaleSourceName
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(query);
  }

  function getFiltered() {
    const query = (searchInput.value || "").trim().toLowerCase();
    const ungating = ungatingFilter.value;
    return products.filter(
      (p) =>
        matchesCategory(p, activeCategory) &&
        matchesUngating(p, ungating) &&
        matchesSearch(p, query)
    );
  }

  function photoHtml(p, className) {
    const wrapClass = className || "card-photo";
    if (p.imageUrl) {
      return (
        '<div class="' +
        wrapClass +
        '">' +
        (p.starterPick ? '<span class="starter-badge">Starter</span>' : "") +
        '<img src="' +
        escapeHtml(p.imageUrl) +
        '" alt="' +
        escapeHtml(p.name) +
        '" loading="lazy" decoding="async" />' +
        "</div>"
      );
    }
    return (
      '<div class="' +
      wrapClass +
      '" aria-hidden="true">' +
      (p.starterPick ? '<span class="starter-badge">Starter</span>' : "") +
      '<div class="photo-placeholder">' +
      PLACEHOLDER_SVG +
      "<span>Photo pending</span>" +
      "</div></div>"
    );
  }

  function cardHtml(p, opts) {
    opts = opts || {};
    const level = p.ungatingLevel || "med";
    const spend = p.estimatedInventorySpend
      ? '<p class="card-spend">Est. inventory · ' +
        escapeHtml(p.estimatedInventorySpend) +
        "</p>"
      : "";
    const starterClass = p.starterPick && opts.markStarter ? " is-starter" : "";

    return (
      '<article class="card' +
      starterClass +
      '" data-id="' +
      escapeHtml(p.id) +
      '">' +
      photoHtml(p) +
      '<div class="card-body">' +
      '<div class="card-top">' +
      '<span class="category-badge">' +
      escapeHtml(p.category) +
      "</span>" +
      '<span class="ungating-pill ' +
      ungatingClass(level) +
      '">' +
      escapeHtml(ungatingLabel(level)) +
      "</span>" +
      "</div>" +
      '<p class="card-brand">' +
      escapeHtml(p.brand) +
      "</p>" +
      '<h2 class="card-name">' +
      escapeHtml(p.name) +
      "</h2>" +
      '<div class="card-price-row">' +
      '<p class="card-price">' +
      escapeHtml(p.amazonPriceApprox) +
      "</p>" +
      spend +
      "</div>" +
      '<p class="card-why">' +
      escapeHtml(p.whyFit) +
      "</p>" +
      '<p class="card-asin">ASIN ' +
      escapeHtml(p.asin) +
      "</p>" +
      '<div class="card-actions">' +
      '<a class="btn btn-amazon" href="' +
      escapeHtml(p.sourceUrl) +
      '" target="_blank" rel="noopener noreferrer">View on Amazon</a>' +
      '<button type="button" class="btn btn-details" data-details="' +
      escapeHtml(p.id) +
      '">Details</button>' +
      "</div></div></article>"
    );
  }

  function renderStarter() {
    if (!starterGrid) return;
    const starters = products.filter((p) => p.starterPick);
    if (!starters.length) {
      starterGrid.innerHTML =
        '<p class="empty-state">No starter picks marked yet. Set starterPick: true on products.</p>';
      if (starterTotal) starterTotal.textContent = "";
      return;
    }
    starterGrid.innerHTML = starters
      .map((p) => cardHtml(p, { markStarter: true }))
      .join("");
    if (starterTotal) {
      const spends = starters
        .map((p) => p.estimatedInventorySpend)
        .filter(Boolean);
      starterTotal.textContent = spends.length
        ? "Combined est. inventory spend (research guess): ~$450–$530 across these four SKUs. Re-check case packs before ordering."
        : "Starter SKUs marked — add estimatedInventorySpend when you have case-pack quotes.";
    }
  }

  function render() {
    const filtered = getFiltered();
    resultsCount.textContent = String(filtered.length);

    if (!filtered.length) {
      grid.innerHTML = "";
      emptyState.hidden = false;
      return;
    }

    emptyState.hidden = true;
    grid.innerHTML = filtered.map((p) => cardHtml(p)).join("");
  }

  function wholesaleBlock(product) {
    const bits = [];
    if (product.wholesaleSourceName) {
      bits.push("<p><strong>Source:</strong> " + escapeHtml(product.wholesaleSourceName) + "</p>");
    }
    if (product.wholesaleUrl) {
      bits.push(
        '<p><a href="' +
          escapeHtml(product.wholesaleUrl) +
          '" target="_blank" rel="noopener noreferrer">Wholesale link</a></p>'
      );
    }
    if (product.contactEmail) {
      bits.push(
        '<p><strong>Contact:</strong> <a href="mailto:' +
          escapeHtml(product.contactEmail) +
          '">' +
          escapeHtml(product.contactEmail) +
          "</a></p>"
      );
    }
    bits.push("<p>" + escapeHtml(product.wholesaleNotes) + "</p>");
    return bits.join("");
  }

  function openModal(product) {
    const level = product.ungatingLevel || "med";
    const spend = product.estimatedInventorySpend
      ? '<div class="modal-section"><h3>Est. inventory spend</h3><p>' +
        escapeHtml(product.estimatedInventorySpend) +
        " (research guess — verify case packs)</p></div>"
      : "";

    modalBody.innerHTML =
      photoHtml(product, "modal-photo") +
      '<div class="modal-content">' +
      '<p class="modal-brand">' +
      escapeHtml(product.brand) +
      "</p>" +
      '<h2 id="modal-title">' +
      escapeHtml(product.name) +
      "</h2>" +
      '<div class="modal-meta">' +
      '<span class="category-badge">' +
      escapeHtml(product.category) +
      "</span>" +
      '<span class="ungating-pill ' +
      ungatingClass(level) +
      '">' +
      escapeHtml(ungatingLabel(level)) +
      "</span>" +
      '<span class="modal-price">' +
      escapeHtml(product.amazonPriceApprox) +
      "</span>" +
      '<span class="modal-asin">ASIN ' +
      escapeHtml(product.asin) +
      "</span>" +
      "</div>" +
      '<div class="modal-section"><h3>Why it fits</h3><p>' +
      escapeHtml(product.whyFit) +
      "</p></div>" +
      '<div class="modal-section"><h3>Ungating</h3><p>' +
      escapeHtml(product.ungating) +
      "</p></div>" +
      '<div class="modal-section"><h3>Wholesale notes</h3>' +
      wholesaleBlock(product) +
      "</div>" +
      '<div class="modal-section"><h3>Cautions</h3><p>' +
      escapeHtml(product.cautions) +
      "</p></div>" +
      spend +
      '<div class="modal-actions">' +
      '<a class="btn btn-amazon" href="' +
      escapeHtml(product.sourceUrl) +
      '" target="_blank" rel="noopener noreferrer">View on Amazon</a>' +
      '<button type="button" class="btn btn-details" id="modal-dismiss">Close</button>' +
      "</div></div>";

    modalBackdrop.hidden = false;
    document.body.classList.add("modal-open");
    modalClose.focus();

    const dismiss = document.getElementById("modal-dismiss");
    if (dismiss) dismiss.addEventListener("click", closeModal);
  }

  function closeModal() {
    modalBackdrop.hidden = true;
    document.body.classList.remove("modal-open");
    modalBody.innerHTML = "";
  }

  function findById(id) {
    return products.find((p) => p.id === id);
  }

  function onDetailsClick(e) {
    const btn = e.target.closest("[data-details]");
    if (!btn) return;
    const product = findById(btn.getAttribute("data-details"));
    if (product) openModal(product);
  }

  categoryChips.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    activeCategory = btn.getAttribute("data-category") || "all";
    categoryChips.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-active"));
    btn.classList.add("is-active");
    render();
  });

  searchInput.addEventListener("input", render);
  ungatingFilter.addEventListener("change", render);

  grid.addEventListener("click", onDetailsClick);
  if (starterGrid) starterGrid.addEventListener("click", onDetailsClick);

  modalClose.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modalBackdrop.hidden) closeModal();
  });

  renderStarter();
  render();
})();
