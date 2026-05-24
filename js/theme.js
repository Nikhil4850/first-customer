const Theme = {
  init() {
    const saved = localStorage.getItem(Storage.KEYS.THEME) || 'dark';
    this.set(saved);
    Utils.$$('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', () => this.toggle());
    });
  },

  set(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(Storage.KEYS.THEME, theme);
    Utils.$$('.theme-toggle').forEach(btn => {
      btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  },

  toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    this.set(current === 'dark' ? 'light' : 'dark');
  },

  get() {
    return document.documentElement.getAttribute('data-theme') || 'dark';
  }
};
