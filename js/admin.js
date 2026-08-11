/* ═══════════════════════════════════════════
   PROJECT INKED — Admin Dashboard & Logic
   Passcode Gate: 12345
   Full CRUD Operations on Products
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  const AUTH_KEY = 'projectinked_admin_authed';
  const REQUIRED_CODE = '12345';

  const gateOverlay = document.getElementById('admin-gate');
  const passcodeInput = document.getElementById('passcode-input');
  const gateForm = document.getElementById('gate-form');
  const gateError = document.getElementById('gate-error');
  const gateBox = document.querySelector('.admin-gate-box');

  const adminContent = document.getElementById('admin-content');
  const lockBtn = document.getElementById('admin-lock');
  const resetBtn = document.getElementById('admin-reset-default');

  const statsContainer = document.getElementById('admin-stats');
  const tableBody = document.getElementById('admin-table-body');
  const searchInput = document.getElementById('admin-search');
  const categoryFilter = document.getElementById('admin-cat-filter');
  const addBtn = document.getElementById('admin-add-btn');

  const productModal = document.getElementById('admin-product-modal');
  const modalTitle = document.getElementById('admin-modal-title');
  const productForm = document.getElementById('admin-product-form');
  const closeModalBtn = document.getElementById('admin-close-modal');
  const cancelModalBtn = document.getElementById('admin-cancel-modal');

  let editingProductId = null;

  /* ─────────────────────────────────────────
     AUTH CHECK
     ───────────────────────────────────────── */
  function checkAuth() {
    const isAuthed = sessionStorage.getItem(AUTH_KEY) === 'true';
    if (isAuthed) {
      if (gateOverlay) gateOverlay.style.display = 'none';
      if (adminContent) adminContent.style.display = 'block';
      renderDashboard();
    } else {
      if (gateOverlay) gateOverlay.style.display = 'flex';
      if (adminContent) adminContent.style.display = 'none';
    }
  }

  if (gateForm) {
    gateForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = passcodeInput ? passcodeInput.value.trim() : '';
      if (code === REQUIRED_CODE) {
        sessionStorage.setItem(AUTH_KEY, 'true');
        if (gateError) gateError.textContent = '';
        checkAuth();
        showToast('🔓 Access Granted — Admin Panel Unlocked');
      } else {
        if (gateError) gateError.textContent = 'Invalid Passcode. Access Denied.';
        if (gateBox) {
          gateBox.classList.add('shake');
          setTimeout(() => gateBox.classList.remove('shake'), 400);
        }
      }
    });
  }

  if (lockBtn) {
    lockBtn.addEventListener('click', () => {
      sessionStorage.removeItem(AUTH_KEY);
      checkAuth();
      showToast('🔒 Admin Panel Locked');
    });
  }

  /* ─────────────────────────────────────────
     DASHBOARD RENDERER
     ───────────────────────────────────────── */
  function renderDashboard() {
    const products = ProductStore.getAll();
    renderStats(products);
    renderTable(products);
  }

  function renderStats(products) {
    if (!statsContainer) return;

    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.price || 0), 0);
    const featuredCount = products.filter(p => p.featured).length;
    const outOfStockCount = products.filter(p => !p.inStock).length;

    statsContainer.innerHTML = `
      <div class="admin-stat-card">
        <span class="option-label">Total Catalog</span>
        <span style="font-size:1.875rem; font-weight:700; font-family:var(--font-display);">${totalProducts} Pieces</span>
      </div>
      <div class="admin-stat-card">
        <span class="option-label">Total Drop Value</span>
        <span style="font-size:1.875rem; font-weight:700; font-family:var(--font-display); color:var(--success);">Rs. ${totalValue.toLocaleString()}</span>
      </div>
      <div class="admin-stat-card">
        <span class="option-label">Featured Pieces</span>
        <span style="font-size:1.875rem; font-weight:700; font-family:var(--font-display); color:var(--red-accent-light);">${featuredCount} Active</span>
      </div>
      <div class="admin-stat-card">
        <span class="option-label">Stock Status</span>
        <span style="font-size:1.875rem; font-weight:700; font-family:var(--font-display); color:${outOfStockCount > 0 ? 'var(--warning)' : 'var(--bone)'};">${outOfStockCount} Sold Out</span>
      </div>
    `;
  }

  function renderTable(products) {
    if (!tableBody) return;

    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const catTerm = categoryFilter ? categoryFilter.value : 'all';

    let filtered = products.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(searchTerm) || p.description.toLowerCase().includes(searchTerm);
      const matchCat = catTerm === 'all' || p.category === catTerm;
      return matchSearch && matchCat;
    });

    if (filtered.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding:48px; color:var(--grey);">
            No products found matching your filter criteria.
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = filtered.map(p => `
      <tr>
        <td style="width:60px;">
          <img src="${p.image}" alt="${p.title}" style="width:48px; height:56px; object-fit:cover; border-radius:6px; background:#0a0a0a;" loading="lazy">
        </td>
        <td>
          <div style="font-weight:600; color:var(--bone);">${p.title}</div>
          <div style="font-size:11px; color:#555;">ID: ${p.id}</div>
        </td>
        <td>
          <span style="font-size:11px; text-transform:uppercase; letter-spacing:0.1em; color:var(--grey);">${p.category}</span>
        </td>
        <td>
          <div style="font-weight:700; color:var(--bone);">Rs. ${p.price.toLocaleString()}</div>
          ${p.originalPrice ? `<div style="font-size:11px; color:#6B6B6B; text-decoration:line-through;">Rs. ${p.originalPrice.toLocaleString()}</div>` : ''}
        </td>
        <td>
          ${p.inStock
            ? `<span style="font-size:10px; font-weight:700; color:var(--success); background:rgba(76,175,80,0.1); padding:4px 8px; border-radius:4px;">IN STOCK</span>`
            : `<span style="font-size:10px; font-weight:700; color:#555; background:var(--ink-light); padding:4px 8px; border-radius:4px;">SOLD OUT</span>`
          }
        </td>
        <td>
          ${p.badge ? `<span class="modal-badge">${p.badge}</span>` : '<span style="color:#444;">—</span>'}
        </td>
        <td>
          <div class="admin-actions-cell">
            <button class="btn-admin-edit" onclick="adminEditProduct('${p.id}')">Edit</button>
            <button class="btn-admin-delete" onclick="adminDeleteProduct('${p.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  /* Search & Filter listeners */
  if (searchInput) searchInput.addEventListener('input', () => renderTable(ProductStore.getAll()));
  if (categoryFilter) categoryFilter.addEventListener('change', () => renderTable(ProductStore.getAll()));

  /* ─────────────────────────────────────────
     PRODUCT MODAL (ADD / EDIT)
     ───────────────────────────────────────── */
  function openModal(isEdit = false, product = null) {
    editingProductId = isEdit && product ? product.id : null;
    if (modalTitle) modalTitle.textContent = isEdit ? 'Edit Product' : 'Add New Product';

    if (productForm) {
      productForm.reset();
      if (isEdit && product) {
        document.getElementById('p-title').value = product.title || '';
        document.getElementById('p-category').value = product.category || 'tees';
        document.getElementById('p-price').value = product.price || '';
        document.getElementById('p-originalPrice').value = product.originalPrice || '';
        document.getElementById('p-badge').value = product.badge || '';
        document.getElementById('p-image').value = product.image || '';
        document.getElementById('p-material').value = product.material || '';
        document.getElementById('p-sizes').value = product.sizes ? product.sizes.join(', ') : '';
        document.getElementById('p-colors').value = product.colors ? product.colors.join(', ') : '';
        document.getElementById('p-inStock').checked = Boolean(product.inStock);
        document.getElementById('p-featured').checked = Boolean(product.featured);
        document.getElementById('p-description').value = product.description || '';
      } else {
        document.getElementById('p-inStock').checked = true;
      }
    }

    if (productModal) {
      productModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (productModal) {
      productModal.classList.remove('open');
      document.body.style.overflow = '';
    }
    editingProductId = null;
  }

  if (addBtn) addBtn.addEventListener('click', () => openModal(false));
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

  if (productForm) {
    productForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = document.getElementById('p-title').value.trim();
      const category = document.getElementById('p-category').value;
      const price = parseFloat(document.getElementById('p-price').value);
      const originalPriceVal = document.getElementById('p-originalPrice').value.trim();
      const originalPrice = originalPriceVal ? parseFloat(originalPriceVal) : undefined;
      const badge = document.getElementById('p-badge').value.trim() || undefined;
      const image = document.getElementById('p-image').value.trim() || 'products/product-1.jpg';
      const material = document.getElementById('p-material').value.trim() || undefined;
      const sizesStr = document.getElementById('p-sizes').value.trim();
      const sizes = sizesStr ? sizesStr.split(',').map(s => s.trim()).filter(Boolean) : undefined;
      const colorsStr = document.getElementById('p-colors').value.trim();
      const colors = colorsStr ? colorsStr.split(',').map(c => c.trim()).filter(Boolean) : undefined;
      const inStock = document.getElementById('p-inStock').checked;
      const featured = document.getElementById('p-featured').checked;
      const description = document.getElementById('p-description').value.trim();

      if (!title || isNaN(price) || !description) {
        alert('Please fill out Title, Price, and Description.');
        return;
      }

      const productPayload = {
        title,
        category,
        price,
        originalPrice,
        badge,
        image,
        images: [image],
        material,
        sizes,
        colors,
        inStock,
        featured,
        description,
      };

      if (editingProductId) {
        ProductStore.update(editingProductId, productPayload);
        showToast(`✓ Updated "${title}" successfully!`);
      } else {
        ProductStore.add(productPayload);
        showToast(`✓ Added "${title}" to catalog!`);
      }

      closeModal();
      renderDashboard();
    });
  }

  /* ─────────────────────────────────────────
     GLOBAL ADMIN ACTIONS (EDIT / DELETE / RESET)
     ───────────────────────────────────────── */
  window.adminEditProduct = function (id) {
    const product = ProductStore.getById(id);
    if (product) openModal(true, product);
  };

  window.adminDeleteProduct = function (id) {
    const product = ProductStore.getById(id);
    if (!product) return;

    if (confirm(`Are you sure you want to delete "${product.title}"?`)) {
      ProductStore.delete(id);
      showToast(`🗑 Deleted "${product.title}"`);
      renderDashboard();
    }
  };

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Reset entire catalog to initial default products? This will erase custom added products.')) {
        ProductStore.resetToDefault();
        showToast('🔄 Catalog reset to default items.');
        renderDashboard();
      }
    });
  }

  /* Toast Helper */
  function showToast(msg) {
    const existing = document.querySelector('.toast-msg');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.textContent = msg;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  /* ─────────────────────────────────────────
     INIT
     ───────────────────────────────────────── */
  checkAuth();

})();
