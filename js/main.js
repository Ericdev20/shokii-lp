/* ============================================================
   SHOKII — main.js
   Vanilla JS — aucun framework
   ============================================================ */

'use strict';

/* ──────────────────────────────────────────────────────────
   1. MENU BURGER (mobile)
────────────────────────────────────────────────────────── */
(function initBurger() {
  const burger = document.getElementById('burgerBtn');
  const nav    = document.getElementById('mainNav');
  if (!burger || !nav) return;

  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    burger.classList.toggle('is-active', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
    document.querySelector('.header').classList.toggle('is-menu-open', isOpen);
  });

  // Fermeture au clic sur un lien
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      burger.classList.remove('is-active');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      document.querySelector('.header').classList.remove('is-menu-open');
    });
  });

  // Fermeture au clic en dehors du menu
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !burger.contains(e.target) && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      burger.classList.remove('is-active');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      document.querySelector('.header').classList.remove('is-menu-open');
    }
  });
})();

/* ──────────────────────────────────────────────────────────
   2. HEADER — effet au scroll
────────────────────────────────────────────────────────── */
(function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  const threshold = 40;

  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > threshold);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // état initial
})();

/* ──────────────────────────────────────────────────────────
   3. NAVIGATION ACTIVE — surligne le lien courant au scroll
────────────────────────────────────────────────────────── */
(function initActiveNav() {
  const sections  = document.querySelectorAll('section[id], header[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        const isMatch = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('active', isMatch);
      });
    });
  }, {
    rootMargin: `-${76}px 0px -60% 0px`,
    threshold: 0,
  });

  sections.forEach(s => observer.observe(s));
})();

/* ──────────────────────────────────────────────────────────
   4. ANIMATIONS DE RÉVÉLATION AU SCROLL
────────────────────────────────────────────────────────── */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    // Fallback pour navigateurs anciens
    elements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });

  elements.forEach(el => observer.observe(el));
})();

/* ──────────────────────────────────────────────────────────
   5. FORMULAIRE DE CONTACT
────────────────────────────────────────────────────────── */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');

  // Validation simple en temps réel
  function showError(input, message) {
    clearError(input);
    const msg = document.createElement('span');
    msg.className = 'form-error';
    msg.textContent = message;
    msg.setAttribute('role', 'alert');
    msg.style.cssText = 'display:block;color:#FF1F78;font-size:0.78rem;margin-top:4px;';
    input.parentElement.appendChild(msg);
    input.style.borderColor = '#FF1F78';
    input.style.boxShadow   = '0 0 0 4px rgba(255,31,120,0.12)';
  }

  function clearError(input) {
    const existing = input.parentElement.querySelector('.form-error');
    if (existing) existing.remove();
    input.style.borderColor = '';
    input.style.boxShadow   = '';
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  // Nettoyage à la frappe
  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => clearError(field));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const nom      = form.querySelector('#nom');
    const email    = form.querySelector('#email');
    const message  = form.querySelector('#message');

    if (!nom.value.trim()) {
      showError(nom, 'Veuillez entrer votre nom.');
      isValid = false;
    }

    if (!email.value.trim()) {
      showError(email, 'Veuillez entrer votre email.');
      isValid = false;
    } else if (!validateEmail(email.value.trim())) {
      showError(email, 'Adresse email invalide.');
      isValid = false;
    }

    if (!message.value.trim()) {
      showError(message, 'Veuillez entrer votre message.');
      isValid = false;
    }

    if (!isValid) return;

    // Simulation d'envoi
    const originalText = submitBtn.textContent;
    submitBtn.disabled  = true;
    submitBtn.textContent = 'Envoi en cours…';

    setTimeout(() => {
      submitBtn.textContent = '✓ Message envoyé !';
      submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
      submitBtn.style.boxShadow  = '0 4px 18px rgba(34,197,94,0.35)';
      form.reset();

      setTimeout(() => {
        submitBtn.disabled        = false;
        submitBtn.textContent     = originalText;
        submitBtn.style.background = '';
        submitBtn.style.boxShadow  = '';
      }, 3500);
    }, 1200);
  });
})();

/* ──────────────────────────────────────────────────────────
   6. SMOOTH SCROLL pour les ancres (fallback Safari/older)
────────────────────────────────────────────────────────── */
(function initSmoothScroll() {
  const HEADER_H = 76;
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - HEADER_H;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
