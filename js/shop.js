/* ═══════════════════════════════════════════
   PROJECT INKED — Shop Page Logic
   Category Filter & Sort Dropdown
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  let currentCategory = 'all';
  let currentSort = 'featured';

  function filterAndSortProducts() {
    let products = currentCategory === 'all'
      ? [...PRODUCTS]
      : PRODUCTS.filter(p => p.category === currentCategory);

    switch (currentSort) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'discount':
        products.sort((a, b) => {
          const discA = a.originalPrice ? a.originalPrice - a.price : 0;
          const discB = b.originalPrice ? b.originalPrice - b.price : 0;
          return discB - discA;
        });
        break;
      case 'featured':
      default:
        products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return products;
  }

  function renderShopGrid() {
    const grid = document.getElementById('shop-grid');
    const countEl = document.getElementById('shop-count');

    if (!grid) return;

    const products = filterAndSortProducts();

    if (countEl) {
      countEl.textContent = `${products.length} items`;
    }

    if (products.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="emoji">🔍</div>
          <p>No items in this category</p>
        </div>
      `;
    } else {
      grid.innerHTML = products.map(p => window.renderProductCard(p)).join('');
    }
  }

  // Bind category buttons
  const catBtns = document.querySelectorAll('.filter-cat');
  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.cat || 'all';
      renderShopGrid();
    });
  });

  // Bind sort select
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    // Check URL params for sort
    const urlParams = new URLSearchParams(window.location.search);
    const sortParam = urlParams.get('sort');
    if (sortParam) {
      currentSort = sortParam;
      sortSelect.value = sortParam;
    }

    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderShopGrid();
    });
  }

  // Initial render
  renderShopGrid();
})();
