const Auth = {
  PROTECTED_PAGES: ['dashboard', 'employer', 'profile'],

  bootstrap() {
    Storage.initDemoUsers();
    this.migrateLegacySession();
    this.updateNavigation();
    this.bindLogout();
  },

  migrateLegacySession() {
    if (Storage.getSession()) return;
    try {
      const legacy = localStorage.getItem('niksjobs_user');
      if (!legacy) return;
      const user = JSON.parse(legacy);
      if (user?.loggedIn && user?.email) {
        const account = Storage.findUserByEmail(user.email);
        if (account) Storage.setSession(account);
      }
      localStorage.removeItem('niksjobs_user');
    } catch { /* ignore */ }
  },

  isLoggedIn() {
    return !!Storage.getSession();
  },

  getCurrentUser() {
    return Storage.getSession();
  },

  isEmployer() {
    return this.getCurrentUser()?.role === 'employer';
  },

  getInitials(name) {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  },

  handleRouteGuard() {
    const page = document.body.dataset.page;
    const file = window.location.pathname.split('/').pop() || 'index.html';

    if (file === 'login.html' || file === 'register.html') {
      if (this.isLoggedIn()) {
        this.redirectAfterLogin();
        return false;
      }
      return true;
    }

    if (this.PROTECTED_PAGES.includes(page)) {
      if (!this.isLoggedIn()) {
        this.redirectToLogin();
        return false;
      }

      const user = this.getCurrentUser();

      if (page === 'employer' && user.role !== 'employer') {
        window.location.replace('dashboard.html');
        return false;
      }

      if (page === 'dashboard' && user.role === 'employer') {
        window.location.replace('employer-dashboard.html');
        return false;
      }
    }

    return true;
  },

  redirectToLogin() {
    const page = window.location.pathname.split('/').pop() || 'dashboard.html';
    const qs = window.location.search || '';
    const target = encodeURIComponent(page + qs);
    window.location.replace(`login.html?redirect=${target}`);
  },

  redirectAfterLogin() {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');

    if (redirect) {
      const decoded = decodeURIComponent(redirect);
      if (!decoded.includes('login') && !decoded.includes('register')) {
        window.location.replace(decoded);
        return;
      }
    }

    const user = this.getCurrentUser();
    window.location.replace(
      user?.role === 'employer' ? 'employer-dashboard.html' : 'dashboard.html'
    );
  },

  login(email, password) {
    const user = Storage.authenticate(email.trim(), password);
    if (!user) return { success: false, error: 'Invalid email or password. Please try again or create an account.' };

    Storage.setSession(user);
    return { success: true, user };
  },

  logout() {
    Storage.clearSession();
    window.location.replace('login.html');
  },

  updateNavigation() {
    const user = this.getCurrentUser();
    const isLoggedIn = !!user;

    document.querySelectorAll('[data-auth-guest]').forEach(el => {
      el.style.display = isLoggedIn ? 'none' : '';
    });

    document.querySelectorAll('[data-auth-user]').forEach(el => {
      el.style.display = isLoggedIn ? '' : 'none';
    });

    document.querySelectorAll('[data-auth-only]').forEach(el => {
      el.style.display = isLoggedIn ? '' : 'none';
    });

    document.querySelectorAll('[data-guest-only]').forEach(el => {
      el.style.display = isLoggedIn ? 'none' : '';
    });

    const userNameEls = document.querySelectorAll('[data-user-name]');
    const userEmailEls = document.querySelectorAll('[data-user-email]');
    const userInitialEls = document.querySelectorAll('[data-user-initials]');

    if (user) {
      userNameEls.forEach(el => { el.textContent = user.name; });
      userEmailEls.forEach(el => { el.textContent = user.email; });
      userInitialEls.forEach(el => { el.textContent = this.getInitials(user.name); });
    }

    const dashboardLinks = document.querySelectorAll('a[href="dashboard.html"]');
    dashboardLinks.forEach(link => {
      if (!isLoggedIn) {
        link.setAttribute('href', 'login.html?redirect=dashboard.html');
        link.setAttribute('title', 'Log in to access dashboard');
      } else if (user.role === 'employer') {
        link.setAttribute('href', 'employer-dashboard.html');
      } else {
        link.setAttribute('href', 'dashboard.html');
      }
    });

    const profileLinks = document.querySelectorAll('a[href="profile.html"]');
    profileLinks.forEach(link => {
      if (!isLoggedIn) link.setAttribute('href', 'login.html?redirect=profile.html');
    });

    this.injectNavActions(user);
  },

  injectNavActions(user) {
    const containers = document.querySelectorAll('.header .nav-actions');
    if (!containers.length) return;

    containers.forEach(container => {
      container.querySelectorAll('[data-guest-only], .logout-btn').forEach(el => {
        if (!el.closest('[data-nav-auth]')) el.remove();
      });

      const existing = container.querySelector('[data-nav-auth]');
      if (existing) existing.remove();

      const authBlock = document.createElement('div');
      authBlock.dataset.navAuth = 'true';
      authBlock.style.display = 'flex';
      authBlock.style.alignItems = 'center';
      authBlock.style.gap = '0.75rem';

      if (user) {
        const dashHref = user.role === 'employer' ? 'employer-dashboard.html' : 'dashboard.html';
        authBlock.innerHTML = `
          <a href="${dashHref}" class="user-chip" title="My Dashboard">
            <span class="avatar avatar-sm" data-user-initials>${this.getInitials(user.name)}</span>
            <span class="user-chip-name" data-user-name>${Utils.escapeHtml(user.name)}</span>
          </a>
          <button type="button" class="btn btn-outline btn-sm logout-btn">Log Out</button>
        `;
      } else {
        authBlock.innerHTML = `
          <a href="login.html" class="btn btn-ghost btn-sm" data-guest-only>Log In</a>
          <a href="register.html" class="btn btn-primary btn-sm" data-guest-only>Sign Up</a>
        `;
      }

      const themeBtn = container.querySelector('.theme-toggle');
      if (themeBtn) container.insertBefore(authBlock, themeBtn);
      else container.appendChild(authBlock);
    });

    this.bindLogout();
  },

  bindLogout() {
    document.querySelectorAll('.logout-btn, [data-logout]').forEach(btn => {
      if (btn.dataset.boundLogout) return;
      btn.dataset.boundLogout = 'true';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        Utils.showToast('Logging out...', 'info');
        setTimeout(() => this.logout(), 300);
      });
    });
  },

  init() {
    this.initLogin();
    this.initRegister();
    this.initForgotPassword();
    this.initFloatingLabels();
  },

  initFloatingLabels() {
    Utils.$$('.form-group.floating input').forEach(input => {
      const update = () => {
        input.parentElement.classList.toggle('has-value', input.value.trim() !== '');
      };
      input.addEventListener('input', update);
      input.addEventListener('blur', update);
      update();
    });
  },

  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  validatePassword(password) {
    return password.length >= 8;
  },

  showError(input, message) {
    const group = input.closest('.form-group');
    let error = group.querySelector('.form-error');
    if (!error) {
      error = document.createElement('span');
      error.className = 'form-error';
      group.appendChild(error);
    }
    error.textContent = message;
    input.style.borderColor = 'var(--danger)';
  },

  clearError(input) {
    const group = input.closest('.form-group');
    const error = group.querySelector('.form-error');
    if (error) error.remove();
    input.style.borderColor = '';
  },

  setLoading(form, loading) {
    const btn = form.querySelector('button[type="submit"]');
    if (!btn) return;
    btn.disabled = loading;
    btn.dataset.originalText = btn.dataset.originalText || btn.textContent;
    btn.textContent = loading ? 'Please wait...' : btn.dataset.originalText;
  },

  initLogin() {
    const form = Utils.$('#login-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      const email = Utils.$('#email', form);
      const password = Utils.$('#password', form);

      this.clearError(email);
      this.clearError(password);

      if (!this.validateEmail(email.value)) {
        this.showError(email, 'Please enter a valid email');
        valid = false;
      }
      if (!this.validatePassword(password.value)) {
        this.showError(password, 'Password must be at least 8 characters');
        valid = false;
      }

      if (!valid) return;

      this.setLoading(form, true);
      const result = this.login(email.value, password.value);

      if (!result.success) {
        this.setLoading(form, false);
        this.showError(password, result.error);
        Utils.showToast(result.error, 'error');
        return;
      }

      Utils.showToast(`Welcome back, ${result.user.name}!`, 'success');
      setTimeout(() => this.redirectAfterLogin(), 600);
    });

    Utils.$$('.social-auth button').forEach(btn => {
      btn.addEventListener('click', () => {
        Utils.showToast('Please sign in with your email and password.', 'info');
      });
    });
  },

  initRegister() {
    const form = Utils.$('#register-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      const name = Utils.$('#name', form);
      const email = Utils.$('#email', form);
      const password = Utils.$('#password', form);
      const confirm = Utils.$('#confirm-password', form);
      const role = Utils.$('input[name="role"]:checked', form);

      [name, email, password, confirm].forEach(input => this.clearError(input));

      if (!name.value.trim()) {
        this.showError(name, 'Name is required');
        valid = false;
      }
      if (!this.validateEmail(email.value)) {
        this.showError(email, 'Please enter a valid email');
        valid = false;
      }
      if (!this.validatePassword(password.value)) {
        this.showError(password, 'Password must be at least 8 characters');
        valid = false;
      }
      if (password.value !== confirm.value) {
        this.showError(confirm, 'Passwords do not match');
        valid = false;
      }

      if (!valid) return;

      this.setLoading(form, true);
      const reg = Storage.registerUser({
        name: name.value,
        email: email.value,
        password: password.value,
        role: role?.value || 'seeker'
      });

      if (reg.error) {
        this.setLoading(form, false);
        this.showError(email, reg.error);
        Utils.showToast(reg.error, 'error');
        return;
      }

      Storage.setSession(reg.user);
      Utils.showToast('Account created! Redirecting...', 'success');
      setTimeout(() => this.redirectAfterLogin(), 600);
    });
  },

  initForgotPassword() {
    const form = Utils.$('#forgot-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = Utils.$('#email', form);
      this.clearError(email);

      if (!this.validateEmail(email.value)) {
        this.showError(email, 'Please enter a valid email');
        return;
      }

      if (!Storage.findUserByEmail(email.value)) {
        this.showError(email, 'No account found with this email');
        return;
      }

      Utils.showToast('Password reset link sent (demo mode)', 'success');
      setTimeout(() => window.location.href = 'login.html', 1200);
    });
  }
};
