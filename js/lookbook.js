/* ═══════════════════════════════════════════
   PROJECT INKED — Lookbook Gallery & Modal
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  let activeIndex = null;

  function renderLookbookGallery() {
    const grid = document.getElementById('lookbook-grid');
    if (!grid) return;

    grid.innerHTML = LOOKBOOK.map((entry, index) => `
      <div class="lookbook-card" onclick="openLookbookModal(${index})">
        <img src="${entry.image}" alt="${entry.title}" loading="lazy">
        <div class="lookbook-card-overlay">
          <span class="campaign">${entry.campaign}</span>
          <h3 class="title">${entry.title}</h3>
        </div>
      </div>
    `).join('');
  }

  window.openLookbookModal = function (index) {
    activeIndex = index;
    renderModalContent();
    const modal = document.getElementById('lookbook-modal');
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeLookbookModal = function () {
    const modal = document.getElementById('lookbook-modal');
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
    activeIndex = null;
  };

  window.nextLookbookEntry = function () {
    if (activeIndex === null) return;
    activeIndex = (activeIndex + 1) % LOOKBOOK.length;
    renderModalContent();
  };

  window.prevLookbookEntry = function () {
    if (activeIndex === null) return;
    activeIndex = (activeIndex - 1 + LOOKBOOK.length) % LOOKBOOK.length;
    renderModalContent();
  };

  function renderModalContent() {
    if (activeIndex === null) return;
    const entry = LOOKBOOK[activeIndex];
    const container = document.getElementById('lookbook-modal-content');
    if (!container) return;

    container.innerHTML = `
      <div class="lookbook-modal-img">
        <img src="${entry.image}" alt="${entry.title}">
      </div>
      <div class="lookbook-modal-info">
        <span class="campaign">${entry.campaign}</span>
        <h2>${entry.title}</h2>
        <p class="desc">${entry.description}</p>
        <p class="products-tag">Featured Pieces:</p>
        <div class="lookbook-modal-products">
          ${entry.products.map(p => `<span>${p}</span>`).join('')}
        </div>
        <div class="lookbook-modal-nav">
          <button onclick="prevLookbookEntry()">← Previous</button>
          <button onclick="nextLookbookEntry()">Next →</button>
        </div>
      </div>
    `;
  }

  // Close lookbook modal on overlay click or escape key
  document.addEventListener('click', e => {
    const modal = document.getElementById('lookbook-modal');
    if (modal && e.target === modal) closeLookbookModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLookbookModal();
    if (e.key === 'ArrowRight' && activeIndex !== null) nextLookbookEntry();
    if (e.key === 'ArrowLeft' && activeIndex !== null) prevLookbookEntry();
  });

  renderLookbookGallery();
})();
