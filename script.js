/* Navegação, acessibilidade e preferência de tema: sem dependências externas. */
(() => {
  const root = document.documentElement;
  const themeButton = document.getElementById('theme-toggle');
  const menuButton = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const year = document.getElementById('year');
  const storageKey = 'victor-portfolio-theme';

  let savedTheme = null;
  try { savedTheme = localStorage.getItem(storageKey); } catch (_) { /* navegação privada */ }
  if (savedTheme === 'light' || savedTheme === 'dark') root.dataset.theme = savedTheme;

  function updateThemeLabel() {
    if (themeButton) themeButton.setAttribute('aria-label', root.dataset.theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro');
  }
  updateThemeLabel();
  themeButton?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(storageKey, root.dataset.theme); } catch (_) { /* opcional */ }
    updateThemeLabel();
  });

  function closeMenu() {
    if (!mobileNav || !menuButton) return;
    mobileNav.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
  }
  menuButton?.addEventListener('click', () => {
    if (!mobileNav) return;
    const willOpen = mobileNav.hidden;
    mobileNav.hidden = !willOpen;
    menuButton.setAttribute('aria-expanded', String(willOpen));
    menuButton.setAttribute('aria-label', willOpen ? 'Fechar menu' : 'Abrir menu');
  });
  mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  window.matchMedia('(min-width: 851px)').addEventListener?.('change', event => { if (event.matches) closeMenu(); });

  if (year) year.textContent = String(new Date().getFullYear());

  // Animação progressiva somente quando o usuário não pediu movimento reduzido.
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const elements = document.querySelectorAll('.service-card, .timeline-item, .skill-group, .project-card, .education-card');
    elements.forEach(element => element.classList.add('reveal'));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px 28px 0px' });
    elements.forEach(element => observer.observe(element));
  }
})();
