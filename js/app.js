/* ═══════════════════════════════════════════
   PROJECT INKED — Core Application Logic
   Header, Mobile Menu, Cart, Product Modal,
   Scroll Animations, Utility Helpers
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────
     CART (localStorage backed)
     ───────────────────────────────────────── */
  const CART_KEY = 'projectinked_cart';

  function loadCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
  }
  function saveCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }

  let cartItems = loadCart();

  function addToCart(product, size, color) {
    const cartId = `${product.id}-${size || ''}-${color || ''}`;
    const existing = cartItems.find(i => i.cartId === cartId);
    if (existing) {
      existing.quantity++;
    } else {
      cartItems.push({ cartId, product, size, color, quantity: 1 });
    }
    saveCart(cartItems);
    renderCart();
    updateCartBadge();
  }

  function removeFromCart(cartId) {
    cartItems = cartItems.filter(i => i.cartId !== cartId);
    saveCart(cartItems);
    renderCart();
    updateCartBadge();
  }

  function updateQuantity(cartId, qty) {
    if (qty <= 0) { removeFromCart(cartId); return; }
    const item = cartItems.find(i => i.cartId === cartId);
    if (item) { item.quantity = qty; saveCart(cartItems); renderCart(); updateCartBadge(); }
  }

  function clearCart() {
    cartItems = [];
    saveCart(cartItems);
    renderCart();
    updateCartBadge();
  }

  function getSubtotal() {
    return cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  }
  function getTotalItems() {
    return cartItems.reduce((sum, i) => sum + i.quantity, 0);
  }

  // Expose cart API globally
  window.Cart = { addToCart, removeFromCart, updateQuantity, clearCart, getSubtotal, getTotalItems, getItems: () => cartItems };

  /* ─────────────────────────────────────────
     HEADER SCROLL EFFECT
     ───────────────────────────────────────── */
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ─────────────────────────────────────────
     MOBILE MENU
     ───────────────────────────────────────── */
  const mobileMenu = document.getElementById('mobile-menu');
  const menuOpen = document.getElementById('menu-open');
  const menuClose = document.getElementById('menu-close');

  if (menuOpen && mobileMenu) {
    menuOpen.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }
  if (menuClose && mobileMenu) {
    menuClose.addEventListener('click', closeMobileMenu);
  }
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeMobileMenu);
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMobileMenu();
    });
  }
  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ─────────────────────────────────────────
     CART SIDEBAR
     ───────────────────────────────────────── */
  const cartOverlay = document.getElementById('cart-overlay');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOpenBtn = document.getElementById('cart-open');
  const cartCloseBtn = document.getElementById('cart-close');
  const cartClearBtn = document.getElementById('cart-clear');

  function openCart() {
    if (cartOverlay) cartOverlay.classList.add('open');
    if (cartDrawer) cartDrawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    if (cartOverlay) cartOverlay.classList.remove('open');
    if (cartDrawer) cartDrawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (cartOpenBtn) cartOpenBtn.addEventListener('click', openCart);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
  if (cartClearBtn) cartClearBtn.addEventListener('click', clearCart);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (cartDrawer && cartDrawer.classList.contains('open')) closeCart();
    }
  });

  window.openCart = openCart;
  window.closeCart = closeCart;

  /* ── Render Cart ── */
  function renderCart() {
    const itemsContainer = document.getElementById('cart-items');
    const footerEl = document.getElementById('cart-footer');
    const countEl = document.getElementById('cart-count');
    const clearBtnEl = document.getElementById('cart-clear');
    const shippingText = document.getElementById('shipping-text');
    const shippingFill = document.getElementById('shipping-fill');

    if (!itemsContainer) return;

    const items = cartItems;
    const totalItems = getTotalItems();
    const subtotal = getSubtotal();
    const threshold = 5000;
    const freeShipping = subtotal >= threshold;
    const progress = Math.min((subtotal / threshold) * 100, 100);

    // Count
    if (countEl) {
      countEl.textContent = totalItems;
      countEl.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    // Clear btn
    if (clearBtnEl) clearBtnEl.style.display = items.length > 0 ? 'block' : 'none';

    // Shipping
    if (shippingText) {
      if (freeShipping) {
        shippingText.className = 'shipping-text unlocked';
        shippingText.textContent = '✓ Free shipping unlocked!';
      } else {
        shippingText.className = 'shipping-text';
        shippingText.textContent = `Rs. ${(threshold - subtotal).toLocaleString()} more for free shipping`;
      }
    }
    if (shippingFill) shippingFill.style.width = progress + '%';

    // Items
    if (items.length === 0) {
      itemsContainer.innerHTML = `
        <div class="cart-empty">
          <div class="emoji">🛍</div>
          <p>Your cart is empty</p>
          <button onclick="closeCart()">Shop the Drop</button>
        </div>`;
    } else {
      itemsContainer.innerHTML = items.map(item => `
        <div class="cart-item" data-cart-id="${item.cartId}">
          <div class="cart-item-img"><img src="${item.product.image}" alt="${item.product.title}" loading="lazy"></div>
          <div class="cart-item-details">
            <p class="cart-item-title">${item.product.title}</p>
            <div class="cart-item-meta">
              ${item.size ? `<span class="cart-item-tag">${item.size}</span>` : ''}
              ${item.color ? `<span class="cart-item-tag">${item.color}</span>` : ''}
            </div>
            <div class="cart-item-bottom">
              <div class="qty-controls">
                <button class="qty-btn" onclick="Cart.updateQuantity('${item.cartId}', ${item.quantity - 1})">−</button>
                <span class="qty-val">${item.quantity}</span>
                <button class="qty-btn" onclick="Cart.updateQuantity('${item.cartId}', ${item.quantity + 1})">+</button>
              </div>
              <span class="cart-item-price">Rs. ${(item.product.price * item.quantity).toLocaleString()}</span>
            </div>
          </div>
          <button class="cart-item-remove" aria-label="Remove item" onclick="Cart.removeFromCart('${item.cartId}')">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </button>
        </div>
      `).join('');
    }

    // Footer
    if (footerEl) {
      if (items.length > 0) {
        footerEl.style.display = 'block';
        footerEl.innerHTML = `
          <div class="cart-subtotal">
            <span class="cart-subtotal-label">Subtotal</span>
            <span class="cart-subtotal-val">Rs. ${subtotal.toLocaleString()}</span>
          </div>
          <p class="cart-tax">Taxes and shipping calculated at checkout</p>
          <button class="checkout-btn" onclick="window.location.href='checkout.html'">Checkout → Rs. ${subtotal.toLocaleString()}</button>
          <button class="cart-continue" onclick="closeCart()">Continue Shopping</button>
        `;
      } else {
        footerEl.style.display = 'none';
      }
    }
  }

  function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    const total = getTotalItems();
    if (badge) {
      badge.textContent = total > 99 ? '99+' : total;
      badge.style.display = total > 0 ? 'flex' : 'none';
    }
  }

  /* ─────────────────────────────────────────
     PRODUCT CARD RENDERER
     ───────────────────────────────────────── */
  window.renderProductCard = function (product) {
    const discount = product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

    let badgeClass = 'badge-default';
    if (product.badge === 'SOLD OUT') badgeClass = 'badge-sold-out';
    else if (product.badge === 'BEST SELLER') badgeClass = 'badge-best';
    else if (product.badge === 'NEW DROP') badgeClass = 'badge-new';

    const sizesHtml = product.sizes
      ? `<div class="size-chips">
           ${product.sizes.slice(0, 5).map(s => `<span class="size-chip">${s}</span>`).join('')}
           ${product.sizes.length > 5 ? `<span class="size-chip-more">+${product.sizes.length - 5}</span>` : ''}
         </div>`
      : '';

    return `
      <div class="product-card" data-product-id="${product.id}" onclick="openProductModal('${product.id}', event)">
        <div class="card-image">
          <img src="${product.image}" alt="${product.title}" loading="lazy">
          <div class="card-image-overlay"></div>
          ${product.badge ? `<div class="card-badge ${badgeClass}">${product.badge}</div>` : ''}
          ${discount > 0 && product.inStock ? `<div class="card-discount">-${discount}%</div>` : ''}
          <div class="card-quick-add">
            <button class="quick-add-btn ${!product.inStock ? 'sold-out' : ''}"
              onclick="handleQuickAdd(event, '${product.id}')"
              ${!product.inStock ? 'disabled' : ''}>
              ${!product.inStock ? 'Sold Out' : 'Quick Add'}
            </button>
          </div>
        </div>
        <div class="card-info">
          <p class="category">${product.category}</p>
          <h3 class="title">${product.title}</h3>
          <div class="price-row">
            <span class="price-current">Rs. ${product.price.toLocaleString()}</span>
            ${product.originalPrice ? `<span class="price-original">Rs. ${product.originalPrice.toLocaleString()}</span>` : ''}
            ${product.originalPrice ? `<span class="price-save">SAVE Rs. ${(product.originalPrice - product.price).toLocaleString()}</span>` : ''}
          </div>
          ${sizesHtml}
        </div>
      </div>
    `;
  };

  /* Quick Add handler */
  window.handleQuickAdd = function (e, productId) {
    e.stopPropagation();
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product || !product.inStock) return;

    const btn = e.currentTarget;
    const defaultSize = product.sizes ? (product.sizes[2] || product.sizes[0]) : undefined;
    const defaultColor = product.colors ? product.colors[0] : undefined;

    Cart.addToCart(product, defaultSize, defaultColor);

    btn.classList.add('added');
    btn.textContent = '✓ Added';
    setTimeout(() => {
      btn.classList.remove('added');
      btn.textContent = 'Quick Add';
    }, 1200);
  };

  /* Ripple effect on card click */
  document.addEventListener('click', e => {
    const card = e.target.closest('.product-card');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ripple = document.createElement('span');
    ripple.className = 'card-ripple';
    ripple.style.left = (x - 50) + 'px';
    ripple.style.top = (y - 50) + 'px';
    ripple.style.width = '100px';
    ripple.style.height = '100px';
    card.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });

  /* ─────────────────────────────────────────
     PRODUCT MODAL
     ───────────────────────────────────────── */
  window.openProductModal = function (productId, e) {
    if (e && (e.target.closest('.quick-add-btn') || e.target.closest('.card-quick-add'))) return;

    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const overlay = document.getElementById('product-modal');
    if (!overlay) return;

    const images = product.images && product.images.length ? product.images : [product.image];
    const discount = product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

    let activeImg = 0;
    let selectedSize = product.sizes ? (product.sizes[2] || product.sizes[0] || '') : '';
    let selectedColor = product.colors ? product.colors[0] || '' : '';

    function render() {
      overlay.querySelector('.modal-panel').innerHTML = `
        <button class="modal-close" aria-label="Close modal" onclick="closeProductModal()">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        </button>
        <div class="modal-grid">
          <div class="modal-image-wrap">
            <div class="aspect">
              <img src="${images[activeImg]}" alt="${product.title}" id="modal-main-img">
              ${discount > 0 && product.inStock ? `<div class="modal-discount-tag">${discount}% OFF</div>` : ''}
            </div>
            ${images.length > 1 ? `
              <div class="modal-thumbs">
                ${images.map((img, idx) => `
                  <button class="modal-thumb ${idx === activeImg ? 'active' : ''}" data-idx="${idx}">
                    <img src="${img}" alt="">
                  </button>
                `).join('')}
              </div>
            ` : ''}
          </div>
          <div class="modal-info">
            <div class="modal-category-row">
              <span class="modal-category">${product.category}</span>
              ${product.badge && product.badge !== 'SOLD OUT' ? `<span class="modal-badge">${product.badge}</span>` : ''}
            </div>
            <h2 class="modal-title">${product.title}</h2>
            <div class="modal-price-row">
              <span class="modal-price">Rs. ${product.price.toLocaleString()}</span>
              ${product.originalPrice ? `<span class="modal-price-orig">Rs. ${product.originalPrice.toLocaleString()}</span>` : ''}
              ${discount > 0 && product.inStock ? `<span class="modal-price-save">Save Rs. ${(product.originalPrice - product.price).toLocaleString()}</span>` : ''}
            </div>
            <p class="modal-desc">${product.description}</p>
            ${product.material ? `<p class="modal-material">Material: <span>${product.material}</span></p>` : ''}

            ${product.colors && product.colors.length > 0 ? `
              <div>
                <p class="option-label">Color: <span>${selectedColor}</span></p>
                <div class="option-btns">
                  ${product.colors.map(c => `
                    <button class="opt-btn ${c === selectedColor ? 'active' : ''}" data-color="${c}">${c}</button>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            ${product.sizes ? `
              <div>
                <p class="option-label" id="size-label">Size</p>
                <div class="option-btns" id="size-btns">
                  ${product.sizes.map(s => `
                    <button class="size-btn ${s === selectedSize ? 'active' : ''}" data-size="${s}">${s}</button>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <div class="modal-actions">
              <button class="atc-btn ${!product.inStock ? 'sold-out' : 'primary'}" id="modal-atc" ${!product.inStock ? 'disabled' : ''}>
                ${!product.inStock ? 'Sold Out' : 'Add to Cart'}
              </button>
              <button class="continue-btn" onclick="closeProductModal()">Continue Shopping</button>
            </div>

            <div class="trust-badges">
              <div class="trust-badge"><div class="icon">🚚</div><div class="label">Free Ship</div><div class="sub">Over Rs.5000</div></div>
              <div class="trust-badge"><div class="icon">↩</div><div class="label">Easy Return</div><div class="sub">7 Days</div></div>
              <div class="trust-badge"><div class="icon">🔒</div><div class="label">Secure Pay</div><div class="sub">Encrypted</div></div>
            </div>
          </div>
        </div>
      `;

      // Thumbnail clicks
      overlay.querySelectorAll('.modal-thumb').forEach(btn => {
        btn.addEventListener('click', () => {
          activeImg = parseInt(btn.dataset.idx);
          render();
        });
      });

      // Color clicks
      overlay.querySelectorAll('.opt-btn[data-color]').forEach(btn => {
        btn.addEventListener('click', () => {
          selectedColor = btn.dataset.color;
          render();
        });
      });

      // Size clicks
      overlay.querySelectorAll('.size-btn[data-size]').forEach(btn => {
        btn.addEventListener('click', () => {
          selectedSize = btn.dataset.size;
          const label = document.getElementById('size-label');
          if (label) { label.className = 'option-label'; label.textContent = 'Size'; }
          render();
        });
      });

      // Add to cart
      const atcBtn = document.getElementById('modal-atc');
      if (atcBtn && product.inStock) {
        atcBtn.addEventListener('click', () => {
          if (product.sizes && !selectedSize) {
            const label = document.getElementById('size-label');
            if (label) { label.className = 'option-label error'; label.textContent = '⚠ Select a size'; }
            overlay.querySelectorAll('.size-btn').forEach(b => b.classList.add('error-state'));
            return;
          }
          atcBtn.className = 'atc-btn adding';
          atcBtn.textContent = 'Adding...';
          Cart.addToCart(product, selectedSize || undefined, selectedColor || undefined);
          setTimeout(() => {
            atcBtn.className = 'atc-btn success';
            atcBtn.textContent = '✓ Added to Cart';
            setTimeout(() => {
              atcBtn.className = 'atc-btn primary';
              atcBtn.textContent = 'Add to Cart';
            }, 2500);
          }, 600);
        });
      }
    }

    render();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeProductModal = function () {
    const overlay = document.getElementById('product-modal');
    if (overlay) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  // Close modal on overlay click
  document.addEventListener('click', e => {
    const overlay = document.getElementById('product-modal');
    if (overlay && e.target === overlay) closeProductModal();
  });

  // Close modal on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeProductModal();
  });

  /* ─────────────────────────────────────────
     SCROLL REVEAL (IntersectionObserver)
     — Must run AFTER products are injected
     ───────────────────────────────────────── */
  function initReveal() {
    const revealElements = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });

    revealElements.forEach(el => {
      // If already in viewport (e.g. hero), make it visible immediately
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        // Small delay so CSS transition actually plays
        setTimeout(() => el.classList.add('visible'), 80);
      } else {
        observer.observe(el);
      }
    });
  }

  /* ─────────────────────────────────────────
     PRODUCT CARD STAGGER ANIMATIONS
     Called after cards are injected into DOM
     ───────────────────────────────────────── */
  function animateCards(gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    const cards = grid.querySelectorAll('.product-card');
    cards.forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(32px)';
      card.style.transition = `opacity 0.6s ease ${i * 120}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 120}ms`;
      // Use rAF to ensure paint before transition starts
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
      });
    });
  }

  // Expose so homepage inline script can call it after injecting cards
  window.animateCards = animateCards;
  window.initReveal = initReveal;

  /* ─────────────────────────────────────────
     SCROLL INDICATOR — fade out on scroll
     ───────────────────────────────────────── */
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    window.addEventListener('scroll', () => {
      scrollIndicator.style.opacity = window.scrollY > 80 ? '0' : '1';
    }, { passive: true });
  }

  /* ─────────────────────────────────────────
     INIT
     ───────────────────────────────────────── */
  renderCart();
  updateCartBadge();

  // Run reveal after full DOM + products are ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReveal);
  } else {
    // Already parsed — defer one frame so dynamic content settles
    requestAnimationFrame(initReveal);
  }

})();

