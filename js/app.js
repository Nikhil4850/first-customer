const App = {
  init() {
    Storage.initDemoUsers();
    Auth.bootstrap();

    if (!Auth.handleRouteGuard()) return;

    Theme.init();
    this.initHeader();
    Notifications.init();
    Utils.initRippleButtons();
    Utils.lazyLoadImages();
    Utils.initScrollReveal();

    const page = document.body.dataset.page;
    switch (page) {
      case 'home': this.initHome(); break;
      case 'jobs': Jobs.init(); break;
      case 'job-detail':
        Jobs.state.jobs = getAllJobsEnriched();
        Jobs.renderJobDetail();
        this.initApplyModal();
        break;
      case 'dashboard': this.initDashboard(); break;
      case 'employer': this.initEmployerDashboard(); break;
      case 'profile': this.initProfile(); break;
      case 'company': this.initCompany(); break;
      case 'auth': Auth.init(); break;
    }

    this.initWidgets();
    this.initNewsletter();
  },

  initHeader() {
    const header = Utils.$('.header');
    window.addEventListener('scroll', () => {
      header?.classList.toggle('scrolled', window.scrollY > 50);
    });

    Utils.$('.menu-toggle')?.addEventListener('click', () => {
      Utils.$('.mobile-nav')?.classList.toggle('active');
    });

    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    Utils.$$('.nav-links a, .mobile-nav a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  },

  initHome() {
    Jobs.state.jobs = getAllJobsEnriched();
    Jobs.renderHomeJobs();
    this.renderCategories();
    this.renderCompanies();
    this.renderLocations();
    this.renderCareerTips();
    this.renderTestimonials();
    this.initCounters();
    this.initHeroSearch();
  },

  renderLocations() {
    const container = Utils.$('#locations-grid');
    if (!container) return;
    container.innerHTML = NiksJobsData.topLocations.map(loc => `
      <a href="jobs.html?location=${encodeURIComponent(loc.city)}" class="card location-card reveal">
        <span class="location-icon">${loc.icon}</span>
        <h3>${Utils.escapeHtml(loc.city)}</h3>
        <p>${Utils.escapeHtml(loc.country)}</p>
        <span class="badge badge-accent">${loc.jobs.toLocaleString()} jobs</span>
      </a>
    `).join('');
  },

  renderCareerTips() {
    const container = Utils.$('#career-tips-grid');
    if (!container) return;
    container.innerHTML = NiksJobsData.careerTips.map(tip => `
      <article class="card career-tip-card reveal">
        <span class="career-tip-icon">${tip.icon}</span>
        <h3>${Utils.escapeHtml(tip.title)}</h3>
        <p>${Utils.escapeHtml(tip.excerpt)}</p>
        <span class="career-tip-meta">${tip.readTime} read</span>
      </article>
    `).join('');
  },

  initHeroSearch() {
    Utils.$('#hero-search-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const keyword = Utils.$('#hero-keyword')?.value || '';
      const location = Utils.$('#hero-location')?.value || '';
      const category = Utils.$('#hero-category')?.value || '';
      const params = new URLSearchParams();
      if (keyword) params.set('q', keyword);
      if (location) params.set('location', location);
      if (category) params.set('category', category);
      window.location.href = `jobs.html?${params.toString()}`;
    });

    Utils.$$('.category-card').forEach(card => {
      card.addEventListener('click', () => {
        const cat = card.dataset.category;
        window.location.href = `jobs.html?category=${cat}`;
      });
    });
  },

  renderCategories() {
    const container = Utils.$('#categories-grid');
    if (!container) return;
    container.innerHTML = NiksJobsData.categories.map(cat => `
      <div class="card category-card reveal" data-category="${cat.id}">
        <div class="icon">${cat.icon}</div>
        <h3>${cat.name}</h3>
        <span>${cat.count.toLocaleString()} jobs</span>
      </div>
    `).join('');
    Utils.$$('.category-card').forEach(card => {
      card.addEventListener('click', () => {
        window.location.href = `jobs.html?category=${card.dataset.category}`;
      });
    });
  },

  renderCompanies() {
    const container = Utils.$('#featured-companies');
    if (!container) return;
    container.innerHTML = NiksJobsData.companies.map(c => `
      <a href="company.html?id=${c.id}" class="card company-card reveal">
        <div class="logo avatar" style="background:${c.color}20;color:${c.color}">${c.logo}</div>
        <h3>${Utils.escapeHtml(c.name)}</h3>
        <span>${c.industry}</span>
      </a>
    `).join('');
  },

  renderTestimonials() {
    const container = Utils.$('#testimonials-grid');
    if (!container) return;
    container.innerHTML = NiksJobsData.testimonials.map(t => `
      <div class="card testimonial-card reveal">
        <p>${Utils.escapeHtml(t.text)}</p>
        <div class="testimonial-author">
          <div class="avatar">${t.avatar}</div>
          <div>
            <strong>${Utils.escapeHtml(t.author)}</strong>
            <p style="font-size:0.875rem">${Utils.escapeHtml(t.role)}</p>
          </div>
        </div>
      </div>
    `).join('');
  },

  initCounters() {
    Utils.$$('.counter').forEach(el => {
      const target = parseInt(el.dataset.target) || 0;
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          Utils.animateCounter(el, target);
          observer.disconnect();
        }
      });
      observer.observe(el);
    });
  },

  initNewsletter() {
    Utils.$('#newsletter-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = Utils.$('#newsletter-email');
      if (!email?.value || !Auth.validateEmail(email.value)) {
        Utils.showToast('Please enter a valid email', 'error');
        return;
      }
      Utils.showToast('Thanks for subscribing!', 'success');
      email.value = '';
    });
  },

  initDashboard() {
    const session = Auth.getCurrentUser();
    if (!session) return;

    const profile = NiksJobsData.userProfile;
    const displayName = session.name || profile.name;

    Utils.$('#user-name') && (Utils.$('#user-name').textContent = displayName);
    Utils.$('#user-email') && (Utils.$('#user-email').textContent = session.email || profile.email);
    Utils.$('#dashboard-greeting') && (Utils.$('#dashboard-greeting').textContent = `Welcome back, ${displayName.split(' ')[0]}! 👋`);

    document.querySelectorAll('.sidebar .avatar-lg, [data-user-initials]').forEach(el => {
      if (el.classList.contains('avatar') || el.dataset.userInitials !== undefined) {
        el.textContent = Auth.getInitials(displayName);
      }
    });
    Utils.$('#profile-completion') && (Utils.$('#profile-completion').style.width = profile.completion + '%');
    Utils.$('#completion-percent') && (Utils.$('#completion-percent').textContent = profile.completion + '%');

    this.renderAppliedJobs();
    this.renderSavedJobsDashboard();
    this.initDashboardTabs();
    this.initResumeUpload();
  },

  renderAppliedJobs() {
    const container = Utils.$('#applied-jobs-list');
    if (!container) return;
    const applications = Storage.getApplications();
    const apps = applications.length ? applications : NiksJobsData.defaultApplications;

    container.innerHTML = apps.map(app => `
      <div class="card" style="margin-bottom:1rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem">
        <div>
          <h4>${Utils.escapeHtml(app.jobTitle || app.title)}</h4>
          <p style="font-size:0.875rem">${Utils.escapeHtml(app.company || app.companyName)} · ${Utils.formatDate(app.date)}</p>
        </div>
        <span class="badge badge-${app.status === 'interview' ? 'accent' : app.status === 'submitted' ? 'warning' : 'success'}">${app.status}</span>
      </div>
    `).join('');

    const timeline = Utils.$('#application-timeline');
    if (timeline) {
      const steps = ['Applied', 'Under Review', 'Interview', 'Offer'];
      const currentStep = 2;
      timeline.innerHTML = steps.map((step, i) => `
        <div class="timeline-item ${i < currentStep ? 'completed' : i === currentStep ? 'active' : ''}">
          <strong>${step}</strong>
          <p style="font-size:0.875rem;color:var(--text-muted)">${i < currentStep ? 'Completed' : i === currentStep ? 'In progress' : 'Pending'}</p>
        </div>
      `).join('');
    }
  },

  renderSavedJobsDashboard() {
    const container = Utils.$('#saved-jobs-list');
    if (!container) return;
    const savedIds = Storage.getSavedJobs();
    const jobs = getAllJobsEnriched().filter(j => savedIds.includes(j.id));

    if (!jobs.length) {
      container.innerHTML = '<div class="empty-state"><p>No saved jobs yet. Browse jobs to save your favorites!</p><a href="jobs.html" class="btn btn-primary" style="margin-top:1rem">Browse Jobs</a></div>';
      return;
    }

    container.innerHTML = jobs.map(job => Jobs.renderJobCard(job)).join('');
    Jobs.bindJobCardEvents(container);
  },

  initDashboardTabs() {
    Utils.$$('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        Utils.$$('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        Utils.$$('.tab-panel').forEach(p => p.style.display = 'none');
        Utils.$(`#tab-${tab}`).style.display = 'block';
      });
    });
  },

  initResumeUpload() {
    const zone = Utils.$('#resume-upload');
    if (!zone) return;
    const input = Utils.$('input[type="file"]', zone);

    zone.addEventListener('click', () => input?.click());
    zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('dragover'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('dragover');
      if (e.dataTransfer.files.length) {
        Utils.showToast(`Resume "${e.dataTransfer.files[0].name}" uploaded!`, 'success');
        zone.innerHTML = `<p>✓ ${e.dataTransfer.files[0].name}</p><p style="font-size:0.875rem;color:var(--text-muted)">Click to replace</p>`;
      }
    });
    input?.addEventListener('change', () => {
      if (input.files.length) {
        Utils.showToast(`Resume "${input.files[0].name}" uploaded!`, 'success');
        zone.innerHTML = `<p>✓ ${input.files[0].name}</p>`;
      }
    });
  },

  initEmployerDashboard() {
    this.renderEmployerJobs();
    this.renderApplicants();
    this.initJobForm();
    Utils.$$('#employer-tabs a[data-tab]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        Utils.$$('#employer-tabs a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
        Utils.$$('.employer-panel').forEach(p => p.style.display = 'none');
        const panel = Utils.$(`#employer-${link.dataset.tab}`);
        if (panel) panel.style.display = 'block';
      });
    });
  },

  renderEmployerJobs() {
    const container = Utils.$('#employer-jobs-list');
    if (!container) return;
    const jobs = getAllJobsEnriched().slice(0, 5);
    container.innerHTML = jobs.map(job => `
      <div class="card" style="margin-bottom:1rem">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem">
          <div>
            <h4>${Utils.escapeHtml(job.title)}</h4>
            <p style="font-size:0.875rem;color:var(--text-muted)">${job.location} · ${job.type} · ${Utils.formatDate(job.posted)}</p>
          </div>
          <div style="display:flex;gap:0.5rem">
            <button class="btn btn-ghost btn-sm edit-job" data-id="${job.id}">Edit</button>
            <button class="btn btn-outline btn-sm delete-job" data-id="${job.id}">Delete</button>
          </div>
        </div>
        <div style="margin-top:1rem;display:flex;gap:1rem;font-size:0.875rem">
          <span>👁 234 views</span>
          <span>📋 18 applicants</span>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.delete-job').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('.card').remove();
        Utils.showToast('Job deleted', 'info');
      });
    });
  },

  renderApplicants() {
    const container = Utils.$('#applicants-list');
    if (!container) return;
    container.innerHTML = NiksJobsData.applicants.map(a => `
      <div class="card" style="margin-bottom:1rem;display:flex;align-items:center;gap:1rem;flex-wrap:wrap">
        <div class="avatar">${a.avatar}</div>
        <div style="flex:1">
          <h4>${Utils.escapeHtml(a.name)}</h4>
          <p style="font-size:0.875rem">${Utils.escapeHtml(a.role)} · Applied ${Utils.formatDate(a.applied)}</p>
        </div>
        <span class="badge">${a.status}</span>
        <button class="btn btn-primary btn-sm">View Profile</button>
      </div>
    `).join('');
  },

  initJobForm() {
    Utils.$('#post-job-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      Utils.showToast('Job posted successfully!', 'success');
      e.target.reset();
    });
  },

  initProfile() {
    const session = Auth.getCurrentUser();
    if (!session) return;

    const profile = NiksJobsData.userProfile;
    Utils.$('#profile-name') && (Utils.$('#profile-name').textContent = session.name || profile.name);
    Utils.$('#profile-avatar') && (Utils.$('#profile-avatar').textContent = Auth.getInitials(session.name));
    Utils.$('#profile-title') && (Utils.$('#profile-title').textContent = profile.title);
    Utils.$('#profile-location') && (Utils.$('#profile-location').textContent = profile.location);
    Utils.$('#profile-bio') && (Utils.$('#profile-bio').textContent = profile.bio);

    const skillsEl = Utils.$('#profile-skills');
    if (skillsEl) {
      skillsEl.innerHTML = profile.skills.map(s => `<span class="badge">${s}</span>`).join('');
    }

    const eduEl = Utils.$('#profile-education');
    if (eduEl) {
      eduEl.innerHTML = profile.education.map(e => `
        <div class="education-item">
          <h4>${Utils.escapeHtml(e.school)}</h4>
          <p>${Utils.escapeHtml(e.degree)} · ${e.years}</p>
        </div>
      `).join('');
    }

    const expEl = Utils.$('#profile-experience');
    if (expEl) {
      expEl.innerHTML = profile.experience.map(e => `
        <div class="experience-item">
          <h4>${Utils.escapeHtml(e.role)}</h4>
          <p style="color:var(--primary-light)">${Utils.escapeHtml(e.company)} · ${e.years}</p>
          <p style="font-size:0.875rem;margin-top:0.5rem">${Utils.escapeHtml(e.description)}</p>
        </div>
      `).join('');
    }

    Utils.$$('.edit-section-btn').forEach(btn => {
      btn.addEventListener('click', () => Utils.showToast('Edit mode - connect to backend API', 'info'));
    });
  },

  initCompany() {
    const id = Utils.getQueryParam('id') || 'c1';
    const company = getCompany(id);
    if (!company) return;

    document.title = `${company.name} | Niks Jobs`;
    Utils.$('#company-name') && (Utils.$('#company-name').textContent = company.name);
    Utils.$('#company-industry') && (Utils.$('#company-industry').textContent = company.industry);
    Utils.$('#company-employees') && (Utils.$('#company-employees').textContent = company.employees);
    Utils.$('#company-location') && (Utils.$('#company-location').textContent = company.location);
    Utils.$('#company-about') && (Utils.$('#company-about').textContent = company.about);
    Utils.$('#company-logo') && (Utils.$('#company-logo').textContent = company.logo);
    if (Utils.$('#company-logo')) {
      Utils.$('#company-logo').style.background = `${company.color}20`;
      Utils.$('#company-logo').style.color = company.color;
    }

    const jobs = getAllJobsEnriched().filter(j => j.companyId === id);
    const container = Utils.$('#company-jobs');
    if (container) {
      container.innerHTML = jobs.length
        ? jobs.map(j => Jobs.renderJobCard(j)).join('')
        : '<p>No open positions at this time.</p>';
      Jobs.bindJobCardEvents(container);
    }
  },

  initApplyModal() {
    const openApply = () => {
      if (!Auth.isLoggedIn()) {
        const returnTo = 'job-details.html' + window.location.search;
        window.location.href = `login.html?redirect=${encodeURIComponent(returnTo)}`;
        return;
      }
      Utils.$('#apply-modal')?.classList.add('active');
    };

    document.addEventListener('click', (e) => {
      if (e.target.closest('#apply-btn, #sticky-apply-btn, #header-apply-btn')) {
        e.preventDefault();
        openApply();
      }
    });
    Utils.$('#apply-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = Utils.getQueryParam('id');
      const job = getAllJobsEnriched().find(j => j.id === id);
      if (job) {
        Storage.addApplication({
          jobId: id,
          jobTitle: job.title,
          company: job.company.name,
          companyName: job.company.name
        });
      }
      Utils.$('#apply-modal')?.classList.remove('active');
      Utils.showToast('Application submitted successfully!', 'success');
    });
    Utils.$$('#apply-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'apply-modal') Utils.$('#apply-modal').classList.remove('active');
    });
    Utils.$$('.modal-close')?.forEach(btn => {
      btn.addEventListener('click', () => Utils.$('#apply-modal')?.classList.remove('active'));
    });
  },

  initWidgets() {
    Utils.$('#chat-toggle')?.addEventListener('click', () => {
      Utils.$('#chat-panel')?.classList.toggle('active');
      Utils.$('#ai-panel')?.classList.remove('active');
    });
    Utils.$('#ai-toggle')?.addEventListener('click', () => {
      Utils.$('#ai-panel')?.classList.toggle('active');
      Utils.$('#chat-panel')?.classList.remove('active');
    });
    Utils.$$('.widget-close').forEach(btn => {
      btn.addEventListener('click', () => btn.closest('.widget-panel')?.classList.remove('active'));
    });

    const sendChat = () => {
      const input = Utils.$('#chat-input');
      const body = Utils.$('#chat-messages');
      if (!input?.value.trim() || !body) return;
      body.innerHTML += `<div style="text-align:right;margin:0.5rem 0"><span style="background:var(--primary);color:white;padding:0.5rem 1rem;border-radius:12px 12px 0 12px;display:inline-block">${Utils.escapeHtml(input.value)}</span></div>`;
      input.value = '';
      setTimeout(() => {
        body.innerHTML += `<div style="margin:0.5rem 0"><span style="background:var(--bg-tertiary);padding:0.5rem 1rem;border-radius:12px 12px 12px 0;display:inline-block">Thanks for reaching out! A recruiter will respond shortly.</span></div>`;
        body.scrollTop = body.scrollHeight;
      }, 1000);
      body.scrollTop = body.scrollHeight;
    };

    Utils.$('#chat-send')?.addEventListener('click', sendChat);
    Utils.$('#chat-input')?.addEventListener('keypress', (e) => e.key === 'Enter' && sendChat());

    Utils.$('#ai-send')?.addEventListener('click', () => {
      const input = Utils.$('#ai-input');
      const body = Utils.$('#ai-messages');
      if (!input?.value.trim() || !body) return;
      const q = input.value;
      body.innerHTML += `<div style="margin:0.5rem 0"><strong>You:</strong> ${Utils.escapeHtml(q)}</div>`;
      input.value = '';
      setTimeout(() => {
        body.innerHTML += `<div style="margin:0.5rem 0;padding:0.75rem;background:rgba(6,182,212,0.1);border-radius:8px"><strong>AI Assistant:</strong> Based on your profile, I recommend exploring Senior Frontend and Full Stack roles. Would you like me to show matching jobs?</div>`;
        body.scrollTop = body.scrollHeight;
      }, 800);
    });

    Utils.$('#schedule-interview')?.addEventListener('click', () => {
      Utils.$('#interview-modal')?.classList.add('active');
    });
    Utils.$$('.time-slot').forEach(slot => {
      slot.addEventListener('click', () => {
        Utils.$$('.time-slot').forEach(s => s.classList.remove('selected'));
        slot.classList.add('selected');
      });
    });
    Utils.$('#confirm-interview')?.addEventListener('click', () => {
      Utils.$('#interview-modal')?.classList.remove('active');
      Utils.showToast('Interview scheduled successfully!', 'success');
    });
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
