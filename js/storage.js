const Storage = {
  KEYS: {
    THEME: 'niksjobs_theme',
    SAVED_JOBS: 'niksjobs_saved',
    RECENT_JOBS: 'niksjobs_recent',
    APPLICATIONS: 'niksjobs_applications',
    SESSION: 'niksjobs_session',
    USERS: 'niksjobs_users',
    VIEWED_NOTIFICATIONS: 'niksjobs_notif_read'
  },

  get(key, fallback = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  initDemoUsers() {
    const users = this.getUsers();
    if (users.length > 0) return;

    this.set(this.KEYS.USERS, [
      {
        name: 'Alex Johnson',
        email: 'demo@niksjobs.com',
        password: 'demo12345',
        role: 'seeker'
      },
      {
        name: 'Sarah Recruiter',
        email: 'employer@niksjobs.com',
        password: 'demo12345',
        role: 'employer'
      }
    ]);
  },

  getUsers() {
    return this.get(this.KEYS.USERS, []);
  },

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

    const newUser = {
      name: name.trim(),
      email: normalized,
      password,
      role: role || 'seeker'
    };

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
    const session = this.get(this.KEYS.SESSION, null);
    if (session && session.loggedIn) return session;
    return null;
  },

  setSession(user) {
    this.set(this.KEYS.SESSION, {
      name: user.name,
      email: user.email,
      role: user.role,
      loggedIn: true,
      loginAt: new Date().toISOString()
    });
  },

  clearSession() {
    localStorage.removeItem(this.KEYS.SESSION);
  },

  getSavedJobs() {
    return this.get(this.KEYS.SAVED_JOBS, []);
  },

  toggleSavedJob(jobId) {
    const saved = this.getSavedJobs();
    const index = saved.indexOf(jobId);
    if (index > -1) saved.splice(index, 1);
    else saved.push(jobId);
    this.set(this.KEYS.SAVED_JOBS, saved);
    return saved.includes(jobId);
  },

  isJobSaved(jobId) {
    return this.getSavedJobs().includes(jobId);
  },

  addRecentJob(jobId) {
    let recent = this.get(this.KEYS.RECENT_JOBS, []);
    recent = recent.filter(id => id !== jobId);
    recent.unshift(jobId);
    this.set(this.KEYS.RECENT_JOBS, recent.slice(0, 10));
    return recent;
  },

  getRecentJobs() {
    return this.get(this.KEYS.RECENT_JOBS, []);
  },

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

  getApplications() {
    return this.get(this.KEYS.APPLICATIONS, []);
  },

  markNotificationsRead() {
    const ids = NiksJobsData.notifications.map(n => n.id);
    this.set(this.KEYS.VIEWED_NOTIFICATIONS, ids);
  },

  getUnreadCount() {
    const read = this.get(this.KEYS.VIEWED_NOTIFICATIONS, []);
    return NiksJobsData.notifications.filter(n => !read.includes(n.id) && n.unread).length;
  }
};
