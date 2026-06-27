const Storage = {
  KEYS: {
    THEME:                'freshajobs_theme',
    SAVED_JOBS:           'freshajobs_saved',
    RECENT_JOBS:          'freshajobs_recent',
    APPLICATIONS:         'freshajobs_applications',
    SESSION:              'freshajobs_session',
    USERS:                'freshajobs_users',
    VIEWED_NOTIFICATIONS: 'freshajobs_notif_read',
    PROFILE:              'freshajobs_profile'
  },

  get(key, fallback = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch { return fallback; }
  },

  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch { return false; }
  },

  // ── Users & Auth ─────────────────────────────────────────────────────────
  initDemoUsers() {
    if (this.getUsers().length > 0) return;
    this.set(this.KEYS.USERS, [
      { name: 'Alex Johnson',    email: 'demo@freshajobs.com',     password: 'demo12345', role: 'seeker'   },
      { name: 'Sarah Recruiter', email: 'employer@freshajobs.com', password: 'demo12345', role: 'employer' }
    ]);
  },

  getUsers() { return this.get(this.KEYS.USERS, []); },

  findUserByEmail(email) {
    const normalized = email.trim().toLowerCase();
    return this.getUsers().find(u => u.email.toLowerCase() === normalized) || null;
  },

  registerUser({ name, email, password, role }) {
    const users = this.getUsers();
    const normalized = email.trim().toLowerCase();
    if (users.some(u => u.email.toLowerCase() === normalized)) {
      return { error: 'An account with this email already exists. Please log in.' };
    }
    const newUser = { name: name.trim(), email: normalized, password, role: role || 'seeker' };
    users.push(newUser);
    this.set(this.KEYS.USERS, users);
    return { user: newUser };
  },

  authenticate(email, password) {
    const user = this.findUserByEmail(email);
    if (!user || user.password !== password) return null;
    return user;
  },

  getSession() {
    const s = this.get(this.KEYS.SESSION, null);
    return (s && s.loggedIn) ? s : null;
  },

  setSession(user) {
    this.set(this.KEYS.SESSION, {
      name: user.name, email: user.email, role: user.role,
      loggedIn: true, loginAt: new Date().toISOString()
    });
  },

  clearSession() { localStorage.removeItem(this.KEYS.SESSION); },

  // ── Jobs ─────────────────────────────────────────────────────────────────
  getSavedJobs() { return this.get(this.KEYS.SAVED_JOBS, []); },

  toggleSavedJob(jobId) {
    const saved = this.getSavedJobs();
    const idx = saved.indexOf(jobId);
    if (idx > -1) saved.splice(idx, 1); else saved.push(jobId);
    this.set(this.KEYS.SAVED_JOBS, saved);
    return saved.includes(jobId);
  },

  isJobSaved(jobId) { return this.getSavedJobs().includes(jobId); },

  addRecentJob(jobId) {
    let recent = this.get(this.KEYS.RECENT_JOBS, []);
    recent = recent.filter(id => id !== jobId);
    recent.unshift(jobId);
    this.set(this.KEYS.RECENT_JOBS, recent.slice(0, 10));
    return recent;
  },

  getRecentJobs() { return this.get(this.KEYS.RECENT_JOBS, []); },

  addApplication(application) {
    const apps = this.get(this.KEYS.APPLICATIONS, []);
    apps.unshift({
      id: 'app_' + Date.now(),
      date: new Date().toISOString(),
      status: 'submitted',
      ...application
    });
    this.set(this.KEYS.APPLICATIONS, apps);
    return apps;
  },

  getApplications() { return this.get(this.KEYS.APPLICATIONS, []); },

  // ── Profile ───────────────────────────────────────────────────────────────
  saveProfile(profile) { this.set(this.KEYS.PROFILE, profile); },
  loadProfile()        { return this.get(this.KEYS.PROFILE, null); },

  // ── Notifications ─────────────────────────────────────────────────────────
  markNotificationsRead() {
    if (typeof FreshaJobsData === 'undefined') return;
    const ids = FreshaJobsData.notifications.map(n => n.id);
    this.set(this.KEYS.VIEWED_NOTIFICATIONS, ids);
  },

  getUnreadCount() {
    if (typeof FreshaJobsData === 'undefined') return 0;
    const read = this.get(this.KEYS.VIEWED_NOTIFICATIONS, []);
    return FreshaJobsData.notifications.filter(n => !read.includes(n.id) && n.unread).length;
  }
};
