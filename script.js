/* ==========================================
   ONIX PEÇAS AUTOMOTIVAS — JavaScript
   Efeitos UI/UX + Interatividade
   ========================================== */

'use strict';

/* =============================================
   1. BARRA DE PROGRESSO DE SCROLL
   ============================================= */
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress-bar';
progressBar.setAttribute('aria-hidden', 'true');
document.body.prepend(progressBar);

function updateProgress() {
  const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
  const pct = scrollTotal > 0 ? (window.scrollY / scrollTotal) * 100 : 0;
  progressBar.style.width = pct + '%';
}


/* =============================================
   2. HEADER — SOMBRA E ESTADO AO ROLAR
   ============================================= */
const header = document.getElementById('header');

function onScroll() {
  header.classList.toggle('scrolled', window.scrollY > 20);
  updateProgress();
  highlightActiveNav();
}

window.addEventListener('scroll', onScroll, { passive: true });


/* =============================================
   3. MENU HAMBURGER
   ============================================= */
const hamburger = document.getElementById('hamburger');
const mobileNav  = document.getElementById('mobileNav');
const overlay    = document.getElementById('overlay');

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
  mobileNav.classList.contains('open') ? closeMenu() : openMenu();
});

overlay.addEventListener('click', closeMenu);
document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', closeMenu));

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
    closeMenu();
    hamburger.focus();
  }
});


/* =============================================
   4. NAV LINK ATIVO AO ROLAR
   ============================================= */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.desktop-nav ul li a');

function highlightActiveNav() {
  const scrollY = window.scrollY + window.innerHeight * 0.35;
  sections.forEach(section => {
    const top = section.offsetTop;
    const id  = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + section.offsetHeight) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}


/* =============================================
   5. EFEITO TYPING NO HERO H2
   ============================================= */
function typeWriter(element, startDelay = 700) {
  if (!element) return;

  const text = element.textContent.trim();
  element.textContent = '';

  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  element.appendChild(cursor);

  let i = 0;

  setTimeout(() => {
    const timer = setInterval(() => {
      if (i < text.length) {
        cursor.insertAdjacentText('beforebegin', text[i]);
        i++;
      } else {
        clearInterval(timer);
        setTimeout(() => {
          cursor.style.animation = 'none';
          cursor.style.opacity   = '0';
          setTimeout(() => cursor.remove(), 400);
        }, 2800);
      }
    }, 34);
  }, startDelay);
}


/* =============================================
   7. ANIMAÇÃO DA LINHA SOB O H1 DO HERO
   ============================================= */
function animateHeroLine() {
  const h1 = document.querySelector('.hero-content h1');
  if (h1) setTimeout(() => h1.classList.add('linha-animada'), 200);
}


/* =============================================
   8. CONTADORES ANIMADOS (HERO STATS)
   ============================================= */
function animateCounter(el, target, duration = 1800) {
  const startTime = performance.now();

  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }

  requestAnimationFrame(step);
}

function initCounters() {
  const counterEls = document.querySelectorAll('.stat-num[data-target]');
  if (!counterEls.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        animateCounter(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.6 });

  counterEls.forEach(el => observer.observe(el));
}


/* =============================================
   9. RIPPLE NOS BOTÕES
   ============================================= */
function initRipple() {
  document.querySelectorAll('.btn, .btn-whatsapp-contato').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x    = e.clientX - rect.left  - size / 2;
      const y    = e.clientY - rect.top   - size / 2;

      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.cssText = `width:${size}px; height:${size}px; left:${x}px; top:${y}px;`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });
}


/* =============================================
   10. TILT 3D NOS CARDS DE PRODUTO (só desktop)
   ============================================= */
function initCardTilt() {
  if ('ontouchstart' in window) return; // skip em dispositivos touch

  document.querySelectorAll('.produto-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.12s ease';
    });

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x    = e.clientX - rect.left;
      const y    = e.clientY - rect.top;
      const cx   = rect.width  / 2;
      const cy   = rect.height / 2;
      const rotX = ((y - cy) / cy) * -7;
      const rotY = ((x - cx) / cx) *  7;
      card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.4s ease';
      card.style.transform  = '';
      setTimeout(() => { card.style.transition = ''; }, 450);
    });
  });
}


/* =============================================
   11. REVEAL AO SCROLL (STAGGERED + DIRECIONAL)
   ============================================= */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const el       = entry.target;
    const siblings = Array.from(el.parentElement.children);
    const pos      = siblings.indexOf(el);
    const delay    = Math.min(pos * 75, 420);

    setTimeout(() => el.classList.add('visible'), delay);
    revealObserver.unobserve(el);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

revealEls.forEach(el => revealObserver.observe(el));


/* =============================================
   12. SMOOTH SCROLL PARA ÂNCORAS
   ============================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const id = this.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();

    const headerH = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--header-height')
    ) || 70;

    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - headerH, behavior: 'smooth' });
  });
});


/* =============================================
   INICIALIZAÇÃO
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  onScroll();
  animateHeroLine();
  initRipple();
  initCardTilt();
  initCounters();

  // Typing — só em desktop/tablet para não atrasar em mobile
  if (window.innerWidth > 600) {
    typeWriter(document.querySelector('.hero-content h2'), 700);
  }
});
