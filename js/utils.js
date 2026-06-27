const Utils = {
  // Single element
  $(selector, parent = document) {
    return parent.querySelector(selector);
  },

  // All matching elements as array
  $$(selector, parent = document) {
    return [...parent.querySelectorAll(selector)];
  },

  debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  },

  formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date)) return String(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  },

  getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  },

  animateCounter(element, target, duration = 2000) {
    const startTime = performance.now();
    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.floor(target * eased).toLocaleString() + (element.dataset.suffix || '');
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  },

  createRipple(event, button) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
    ripple.style.top  = (event.clientY - rect.top  - size / 2) + 'px';
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  },

  showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };
    toast.innerHTML = `<span>${icons[type] || icons.info}</span><span>${this.escapeHtml(String(message))}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(110%)';
      setTimeout(() => toast.remove(), 350);
    }, 3000);
  },

  lazyLoadImages() {
    const images = this.$$('img[data-src]');
    if (!images.length) return;
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        });
      }, { rootMargin: '100px' });
      images.forEach(img => observer.observe(img));
    } else {
      images.forEach(img => { img.src = img.dataset.src; });
    }
  },

  initScrollReveal() {
    const reveals = this.$$('.reveal:not([data-reveal-init])');
    if (!reveals.length) return;
    const show = (el) => el.classList.add('visible');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { show(entry.target); observer.unobserve(entry.target); }
        });
      }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
      reveals.forEach(el => {
        el.dataset.revealInit = 'true';
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) show(el);
        else observer.observe(el);
      });
    } else {
      reveals.forEach(el => { el.dataset.revealInit = 'true'; show(el); });
    }
  },

  showRevealsIn(container) {
    if (!container) return;
    container.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    this.initScrollReveal();
  },

  initRippleButtons() {
    this.$$('.btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.createRipple(e, btn));
    });
  },

  escapeHtml(text) {
    if (text == null) return '';
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
  }
};
