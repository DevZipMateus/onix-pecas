/* ==========================================
   ONIX PEÇAS AUTOMOTIVAS — JavaScript
   ========================================== */

'use strict';

// ===== HEADER COM SOMBRA AO ROLAR =====
const header = document.getElementById('header');

function onScroll() {
  if (window.scrollY > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  highlightActiveNav();
}

window.addEventListener('scroll', onScroll, { passive: true });


// ===== MENU HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const overlay = document.getElementById('overlay');
const mobileLinks = document.querySelectorAll('.mobile-link');

function openMenu() {
  mobileNav.classList.add('open');
  overlay.classList.add('show');
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  mobileNav.setAttribute('aria-hidden', 'false');
}

function closeMenu() {
  mobileNav.classList.remove('open');
  overlay.classList.remove('show');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileNav.setAttribute('aria-hidden', 'true');
}

hamburger.addEventListener('click', () => {
  const isOpen = mobileNav.classList.contains('open');
  isOpen ? closeMenu() : openMenu();
});

overlay.addEventListener('click', closeMenu);

mobileLinks.forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Fechar menu com Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
    closeMenu();
    hamburger.focus();
  }
});


// ===== ACTIVE NAV LINK AO ROLAR =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.desktop-nav ul li a');

function highlightActiveNav() {
  const scrollY = window.scrollY + (window.innerHeight * 0.35);

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}


// ===== ANIMAÇÃO REVEAL AO SCROLL =====
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Atraso leve baseado na posição no grid
      const siblings = Array.from(entry.target.parentElement.children);
      const position = siblings.indexOf(entry.target);
      const delay = Math.min(position * 70, 400);

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));


// ===== SMOOTH SCROLL PARA ÂNCORAS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const headerHeight = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--header-height')) || 72;

    const targetY = target.getBoundingClientRect().top + window.scrollY - headerHeight;

    window.scrollTo({ top: targetY, behavior: 'smooth' });
  });
});


// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
  onScroll();
});
