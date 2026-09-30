const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const themeStatus = document.getElementById('themeStatus');
const year = document.getElementById('year');

const STORAGE_KEY = 'pf-theme';

year.textContent = new Date().getFullYear();

/* =========================================================
   theme
   ========================================================= */
const themeButtons = document.querySelectorAll('[data-theme-set]');
const systemQuery = window.matchMedia('(prefers-color-scheme: light)');

function applyTheme(theme, { save = true, announce = true } = {}) {
  document.documentElement.setAttribute('data-theme', theme);

  themeButtons.forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.themeSet === theme));
  });

  if (save) {
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* private mode */ }
  }

  if (announce && themeStatus) {
    themeStatus.textContent = `${theme === 'light' ? 'Light' : 'Dark'} theme enabled`;
  }
}

themeButtons.forEach((btn) => {
  btn.addEventListener('click', () => applyTheme(btn.dataset.themeSet));
});

/* follow the OS only until the visitor makes an explicit choice */
systemQuery.addEventListener('change', (e) => {
  let saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (err) { /* ignore */ }
  if (!saved) applyTheme(e.matches ? 'light' : 'dark', { save: false });
});

/* the inline <head> script already set data-theme — just sync the UI */
applyTheme(
  document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark',
  { save: false, announce: false }
);

/* =========================================================
   mobile nav
   ========================================================= */
function closeNav() {
  navLinks.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
}

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.addEventListener('click', (e) => {
  if (e.target.closest('a')) closeNav();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
    closeNav();
    navToggle.focus();
  }
});

/* =========================================================
   active section link
   ========================================================= */
const sections = [...document.querySelectorAll('main section[id]')];
const links = [...navLinks.querySelectorAll('a')];

let ticking = false;

function markActive() {
  const y = window.scrollY;
  let current = '';

  for (const section of sections) {
    if (section.offsetTop - 150 <= y) current = section.id;
  }
  for (const link of links) {
    link.classList.toggle('is-active', link.getAttribute('href') === `#${current}`);
  }
}

window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    markActive();
    ticking = false;
  });
}, { passive: true });

markActive();
