// Run before the first paint, before the demo modules load.
(() => {
  const key = 'wcd-demo.theme';
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let preference;
  try {
    preference = localStorage.getItem(key);
  } catch { /* Theme switching still works when storage is unavailable. */ }

  function apply(theme) {
    root.dataset.theme = theme;
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.setAttribute('aria-checked', String(theme === 'dark'));
      toggle.title = `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`;
    }
    window.dispatchEvent(new Event('wcd-demo-theme-change'));
  }

  apply(preference === 'light' || preference === 'dark' ? preference : system.matches ? 'dark' : 'light');
  system.addEventListener('change', () => {
    if (preference !== 'light' && preference !== 'dark') apply(system.matches ? 'dark' : 'light');
  });

  document.addEventListener('DOMContentLoaded', () => {
    apply(root.dataset.theme);
    document.getElementById('themeToggle').addEventListener('click', () => {
      preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
      apply(preference);
      try {
        localStorage.setItem(key, preference);
      } catch { /* Keep the current session usable without persistent storage. */ }
    });
  });
})();
