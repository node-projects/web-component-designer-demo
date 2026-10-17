// Apply before the first paint, including when browser storage is unavailable.
(() => {
  const key = 'wcd-demo-theme';
  const system = matchMedia('(prefers-color-scheme: dark)');
  let preference;
  try { preference = localStorage.getItem(key) ?? localStorage.getItem('wcd-demo.theme'); } catch { /* Use system preference. */ }
  if (preference !== 'light' && preference !== 'dark') preference = null;

  const apply = theme => {
    document.documentElement.dataset.theme = theme;
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(theme === 'dark'));
      toggle.title = `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`;
    }
    window.dispatchEvent(new CustomEvent('demo-theme-change', { detail: theme }));
  };
  const current = () => preference ?? (system.matches ? 'dark' : 'light');
  apply(current());
  system.addEventListener('change', () => { if (!preference) apply(current()); });
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) {
      preference = event.newValue === 'light' || event.newValue === 'dark' ? event.newValue : null;
      apply(current());
    }
  });
  document.addEventListener('DOMContentLoaded', () => {
    apply(current());
    document.getElementById('theme-toggle').addEventListener('click', () => {
      preference = current() === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(key, preference); } catch { /* Keep the in-memory choice. */ }
      apply(preference);
    });
  });
})();
