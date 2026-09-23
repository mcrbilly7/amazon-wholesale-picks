(function () {
  "use strict";

  const grid = document.getElementById("product-grid");
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

  function escapeHtml(str) {
    return String(str)
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
      product.amazonPriceApprox
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

  function cardHtml(p) {
    const level = p.ungatingLevel || "med";
    return `
      <article class="card" data-id="${escapeHtml(p.id)}">
        <div class="card-top">
          <span class="category-badge">${escapeHtml(p.category)}</span>
          <span class="ungating-pill ${ungatingClass(level)}">${escapeHtml(ungatingLabel(level))}</span>
        </div>
        <p class="card-brand">${escapeHtml(p.brand)}</p>
        <h2 class="card-name">${escapeHtml(p.name)}</h2>
        <p class="card-price">${escapeHtml(p.amazonPriceApprox)}</p>
        <p class="card-why">${escapeHtml(p.whyFit)}</p>
        <p class="card-asin">ASIN ${escapeHtml(p.asin)}</p>
        <div class="card-actions">
          <a class="btn btn-amazon" href="${escapeHtml(p.sourceUrl)}" target="_blank" rel="noopener noreferrer">Amazon</a>
          <button type="button" class="btn btn-details" data-details="${escapeHtml(p.id)}">Details</button>
        </div>
      </article>
    `;
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
    grid.innerHTML = filtered.map(cardHtml).join("");
  }

  function openModal(product) {
    const level = product.ungatingLevel || "med";
    modalBody.innerHTML = `
      <p class="modal-brand">${escapeHtml(product.brand)}</p>
      <h2 id="modal-title">${escapeHtml(product.name)}</h2>
      <div class="modal-meta">
        <span class="category-badge">${escapeHtml(product.category)}</span>
        <span class="ungating-pill ${ungatingClass(level)}">${escapeHtml(ungatingLabel(level))}</span>
        <span class="modal-price">${escapeHtml(product.amazonPriceApprox)}</span>
        <span class="modal-asin">ASIN ${escapeHtml(product.asin)}</span>
      </div>
      <div class="modal-section">
        <h3>Why it fits</h3>
        <p>${escapeHtml(product.whyFit)}</p>
      </div>
      <div class="modal-section">
        <h3>Ungating</h3>
        <p>${escapeHtml(product.ungating)}</p>
      </div>
      <div class="modal-section">
        <h3>Wholesale notes</h3>
        <p>${escapeHtml(product.wholesaleNotes)}</p>
      </div>
      <div class="modal-section">
        <h3>Cautions</h3>
        <p>${escapeHtml(product.cautions)}</p>
      </div>
      <div class="modal-actions">
        <a class="btn btn-amazon" href="${escapeHtml(product.sourceUrl)}" target="_blank" rel="noopener noreferrer">View on Amazon</a>
        <button type="button" class="btn btn-details" id="modal-dismiss">Close</button>
      </div>
    `;
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

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-details]");
    if (!btn) return;
    const product = findById(btn.getAttribute("data-details"));
    if (product) openModal(product);
  });

  modalClose.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modalBackdrop.hidden) closeModal();
  });

  render();
})();
