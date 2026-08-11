/* ═══════════════════════════════════════════
   PROJECT INKED — Contact Form Validation
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  const form = document.getElementById('contact-form');
  const inquirySelect = document.getElementById('inquiryType');
  const orderGroup = document.getElementById('orderNumberGroup');
  const formWrap = document.getElementById('form-container');

  if (!form) return;

  // Toggle Order Number input when Inquiry Type changes
  if (inquirySelect && orderGroup) {
    inquirySelect.addEventListener('change', () => {
      const val = inquirySelect.value;
      if (val === 'Order Support' || val === 'Returns/Exchange') {
        orderGroup.style.display = 'block';
      } else {
        orderGroup.style.display = 'none';
      }
    });
  }

  // Clear errors on input
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.classList.remove('error');
      const errEl = document.getElementById(`err-${field.id}`);
      if (errEl) errEl.textContent = '';
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Helper validation functions
    const setError = (id, msg) => {
      const field = document.getElementById(id);
      const errEl = document.getElementById(`err-${id}`);
      if (field) field.classList.add('error');
      if (errEl) errEl.textContent = msg;
      isValid = false;
    };

    const clearError = (id) => {
      const field = document.getElementById(id);
      const errEl = document.getElementById(`err-${id}`);
      if (field) field.classList.remove('error');
      if (errEl) errEl.textContent = '';
    };

    // Values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    const inquiryType = inquirySelect ? inquirySelect.value : 'General';
    const orderNumber = document.getElementById('orderNumber') ? document.getElementById('orderNumber').value.trim() : '';

    // Validate Name
    if (name.length < 2) {
      setError('name', 'Name is required (at least 2 characters)');
    } else {
      clearError('name');
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('email', 'Please enter a valid email address');
    } else {
      clearError('email');
    }

    // Validate Order Number if required
    if ((inquiryType === 'Order Support' || inquiryType === 'Returns/Exchange') && !orderNumber) {
      setError('orderNumber', 'Order number is required for support inquiries');
    } else {
      clearError('orderNumber');
    }

    // Validate Subject
    if (subject.length < 2) {
      setError('subject', 'Subject is required');
    } else {
      clearError('subject');
    }

    // Validate Message
    if (message.length < 10) {
      setError('message', 'Message must be at least 10 characters');
    } else {
      clearError('message');
    }

    if (!isValid) return;

    // Submit Simulation
    const submitBtn = form.querySelector('.form-submit');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    setTimeout(() => {
      if (formWrap) {
        formWrap.innerHTML = `
          <div class="contact-success">
            <div class="icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h3>MESSAGE RECEIVED</h3>
            <p>Thank you for reaching out. Our team will review your inquiry and get back to you shortly.</p>
            <button onclick="window.location.reload()">Send Another Message</button>
          </div>
        `;
      }
    }, 800);
  });
})();
