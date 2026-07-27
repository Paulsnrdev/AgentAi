/* ═══════════════════════════════════════════════════════════════════════
   AgentAI — Interactive JS
   ═══════════════════════════════════════════════════════════════════════ */

// ── SMOOTH SCROLL ─────────────────────────────────────────────────────
const NAV_H = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 70;

function scrollToTarget(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - NAV_H - 8;
  window.scrollTo({ top, behavior: 'smooth' });
}

document.querySelectorAll('[data-scroll]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    e.preventDefault();
    scrollToTarget(href);
  });
});

// ── SCROLL PROGRESS BAR ────────────────────────────────────────────────
const progressBar = document.getElementById('scroll-progress');

function updateProgress() {
  const scrolled = window.scrollY;
  const total    = document.body.scrollHeight - window.innerHeight;
  progressBar.style.width = (scrolled / total * 100) + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });

// ── NAV SCROLL CLASS ───────────────────────────────────────────────────
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── ACTIVE NAV LINK ON SCROLL ─────────────────────────────────────────
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav__link');

const sectionIO = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(l => l.classList.remove('active'));
    const active = document.querySelector(`.nav__link[href="#${entry.target.id}"]`);
    if (active) active.classList.add('active');
  });
}, { rootMargin: `-${NAV_H}px 0px -50% 0px`, threshold: 0 });

sections.forEach(s => sectionIO.observe(s));

// ── HAMBURGER / MOBILE DRAWER ─────────────────────────────────────────
const hamburger   = document.getElementById('hamburger');
const drawer      = document.getElementById('nav-drawer');
const overlay     = document.getElementById('nav-overlay');
const drawerClose = document.getElementById('drawer-close');

function openMenu() {
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  overlay.classList.add('visible');
  document.body.classList.add('menu-open');
}
function closeMenu() {
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  overlay.classList.remove('visible');
  document.body.classList.remove('menu-open');
}

hamburger.addEventListener('click', () => {
  hamburger.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
});
drawerClose.addEventListener('click', closeMenu);
overlay.addEventListener('click', closeMenu);

document.querySelectorAll('[data-close-drawer]').forEach(el => {
  el.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});

// ── RIPPLE EFFECT ON BUTTONS ──────────────────────────────────────────
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const r = document.createElement('span');
    r.classList.add('ripple');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    r.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${e.clientX - rect.left - size/2}px;
      top:  ${e.clientY - rect.top  - size/2}px;
    `;
    btn.appendChild(r);
    r.addEventListener('animationend', () => r.remove());
  });
});

// ── SERVICE CARD ACCORDION ────────────────────────────────────────────
document.querySelectorAll('.service-card__header').forEach(header => {
  header.addEventListener('click', () => {
    const card    = header.closest('.service-card');
    const body    = card.querySelector('.service-card__body');
    const isOpen  = !body.hidden;

    if (isOpen) {
      body.hidden = true;
      header.setAttribute('aria-expanded', 'false');
      card.classList.remove('open');
      card.removeAttribute('data-open');
    } else {
      body.hidden = false;
      header.setAttribute('aria-expanded', 'true');
      card.classList.add('open');
      card.setAttribute('data-open', 'true');
    }
  });
});

// ── COUNTER ANIMATION ─────────────────────────────────────────────────
function animateCount(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const dur    = 1800;
  let start    = null;

  function step(ts) {
    if (!start) start = ts;
    const prog  = Math.min((ts - start) / dur, 1);
    const eased = 1 - Math.pow(1 - prog, 3);
    const val   = target < 100
      ? Math.round(eased * target)
      : Math.floor(eased * target);

    el.textContent = val < 1000
      ? val + suffix
      : (val / 1000).toFixed(1).replace('.0', '') + 'M' + suffix.replace('M+', '+');

    if (prog < 1) requestAnimationFrame(step);
    else el.textContent = target < 1000 ? target + suffix : (target / 1000) + 'M' + suffix.replace('M+', '+');
  }
  requestAnimationFrame(step);
}

const counterIO = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    animateCount(entry.target);
    counterIO.unobserve(entry.target);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterIO.observe(el));

// ── SCROLL REVEAL ─────────────────────────────────────────────────────
const revealSelectors = [
  '.about__statement', '.about__pill',
  '.card', '.service-card', '.work-card',
  '.contact-section__left', '.contact-form',
  '.works__header', '.hero__stats',
  '.services__left',
];

revealSelectors.forEach(sel => {
  document.querySelectorAll(sel).forEach(el => el.classList.add('reveal'));
});

const revealIO = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));

// Stagger delays
document.querySelectorAll('.work-card').forEach((c, i) => {
  c.style.transitionDelay = `${i * 0.08}s`;
});
document.querySelectorAll('.card').forEach((c, i) => {
  c.style.transitionDelay = `${i * 0.07}s`;
});
document.querySelectorAll('.service-card').forEach((c, i) => {
  c.style.transitionDelay = `${i * 0.06}s`;
});


// ── JELLYFISH PARALLAX (mouse) ────────────────────────────────────────
const jellyWrap = document.getElementById('jelly-wrap');

if (jellyWrap && window.matchMedia('(hover: hover)').matches) {
  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    jellyWrap.style.transform = `translate(${dx * 16}px, ${dy * 12}px)`;
  });
}

// ── TOAST SYSTEM ──────────────────────────────────────────────────────
const toastContainer = document.getElementById('toasts');

function showToast(msg, duration = 3500) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  toastContainer.appendChild(t);

  setTimeout(() => {
    t.classList.add('toast--out');
    t.addEventListener('animationend', () => t.remove());
  }, duration);
}

// ── CONTACT FORM ──────────────────────────────────────────────────────
const form = document.getElementById('contact-form');

function validate(input) {
  const group = input.closest('.form-group');
  const error = group?.querySelector('.form-error');
  let msg = '';

  if (input.required && !input.value.trim()) {
    msg = 'This field is required.';
  } else if (input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
    msg = 'Please enter a valid email address.';
  }

  input.classList.toggle('error', !!msg);
  if (error) error.textContent = msg;
  return !msg;
}

form.querySelectorAll('.form-input').forEach(input => {
  input.addEventListener('blur', () => validate(input));
  input.addEventListener('input', () => {
    if (input.classList.contains('error')) validate(input);
  });
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const inputs  = [...form.querySelectorAll('.form-input')];
  const allOk   = inputs.map(inp => validate(inp)).every(Boolean);
  if (!allOk) return;

  const btn = form.querySelector('[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Sending…';

  // Simulate async send
  setTimeout(() => {
    form.reset();
    btn.disabled = false;
    btn.innerHTML = 'Send message <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
    showToast('Message sent! We\'ll reply within 24 hours.');
  }, 1200);
});

// ── "EXPLORE SERVICES" CTA ────────────────────────────────────────────
// (already handled by data-scroll on the <a> tags)

// ── WORKS CARD KEYBOARD ACCESSIBILITY ────────────────────────────────
document.querySelectorAll('.work-card').forEach(card => {
  card.setAttribute('tabindex', '0');
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const cta = card.querySelector('.work-card__hover a');
      if (cta) cta.click();
    }
  });
});
