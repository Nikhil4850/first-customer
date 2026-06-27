const App = {
  init() {
    Storage.initDemoUsers();
    Auth.bootstrap();

    if (!Auth.handleRouteGuard()) return;

    Theme.init();
    this.initHeader();
    try { Notifications.init(); } catch (e) { console.warn('Notifications init skipped', e); }
    Utils.initRippleButtons();
    Utils.lazyLoadImages();
    Utils.initScrollReveal();

    const page = document.body.dataset.page;
    switch (page) {
      case 'home':       this.initHome(); break;
      case 'jobs':       Jobs.init(); break;
      case 'job-detail':
        Jobs.state.jobs = getAllJobsEnriched();
        Jobs.renderJobDetail();
        this.initApplyModal();
        break;
      case 'dashboard':  this.initDashboard(); break;
      case 'employer':   this.initEmployerDashboard(); break;
      case 'profile':    this.initProfile(); break;
      case 'company':    this.initCompany(); break;
      case 'auth':       Auth.init(); break;
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
    if (typeof FreshaJobsData === 'undefined') {
      console.error('Fresha Jobs: data failed to load. Check js/data.js');
      return;
    }

    Jobs.state.jobs = getAllJobsEnriched();
    Jobs.renderHomeJobs();
    this.renderCategories();
    this.renderCompanies();
    this.renderLocations();
    this.renderCareerTips();
    this.renderTestimonials();
    this.initCounters();
    this.initHeroSearch();

    Utils.showRevealsIn(Utils.$('#categories-grid'));
    Utils.showRevealsIn(Utils.$('#featured-companies'));
    Utils.showRevealsIn(Utils.$('#locations-grid'));
    Utils.showRevealsIn(Utils.$('#latest-jobs'));
    Utils.showRevealsIn(Utils.$('#career-tips-grid'));
    Utils.showRevealsIn(Utils.$('#testimonials-grid'));
    Utils.initScrollReveal();
  },

  renderLocations() {
    const container = Utils.$('#locations-grid');
    if (!container) return;
    container.innerHTML = FreshaJobsData.topLocations.map(loc => `
      <a href="jobs.html?location=${encodeURIComponent(loc.city)}" class="card location-card reveal">
        <span class="location-icon">${loc.icon}</span>
        <h3>${Utils.escapeHtml(loc.city)}</h3>
        <p class="location-country">${Utils.escapeHtml(loc.country)}</p>
        <p class="location-highlight">${Utils.escapeHtml(loc.highlight || '')}</p>
        <div class="location-stats">
          <span><strong>${loc.jobs.toLocaleString()}</strong> jobs</span>
          <span><strong>${loc.avgSalary || '—'}</strong> avg</span>
          <span class="location-growth">${loc.growth || ''}</span>
        </div>
        <div class="location-meta">
          <span class="tag">${loc.companies || 0} companies</span>
          <span class="tag">${loc.remote || 0}% remote</span>
        </div>
      </a>
    `).join('');
  },

  renderCareerTips() {
    const container = Utils.$('#career-tips-grid');
    if (!container) return;
    container.innerHTML = FreshaJobsData.careerTips.map(tip => `
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
      const keyword  = Utils.$('#hero-keyword')?.value  || '';
      const location = Utils.$('#hero-location')?.value || '';
      const category = Utils.$('#hero-category')?.value || '';
      const params = new URLSearchParams();
      if (keyword)  params.set('q', keyword);
      if (location) params.set('location', location);
      if (category) params.set('category', category);
      window.location.href = `jobs.html?${params.toString()}`;
    });

    Utils.$$('.category-card').forEach(card => {
      card.addEventListener('click', () => {
        window.location.href = `jobs.html?category=${card.dataset.category}`;
      });
    });
  },

  renderCategories() {
    const container = Utils.$('#categories-grid');
    if (!container) return;
    container.innerHTML = FreshaJobsData.categories.map(cat => `
      <div class="card category-card reveal" data-category="${cat.id}">
        ${cat.trending ? '<span class="category-trending">Trending</span>' : ''}
        <div class="icon">${cat.icon}</div>
        <h3>${cat.name}</h3>
        <p class="category-desc">${Utils.escapeHtml(cat.description || '')}</p>
        <div class="category-meta">
          <span class="badge">${cat.count.toLocaleString()} jobs</span>
          <span class="category-salary">${cat.avgSalary || ''}</span>
        </div>
        <p class="category-roles">${Utils.escapeHtml(cat.roles || '')}</p>
        ${cat.growth ? `<span class="category-growth">${cat.growth} YoY</span>` : ''}
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
    const list = FreshaJobsData.featuredCompanies || FreshaJobsData.companies;
    container.innerHTML = list.map(c => `
      <a href="company.html?id=${c.id}" class="card company-card reveal company-card-rich">
        ${c.hiringNow ? '<span class="company-hiring">Hiring now</span>' : ''}
        <div class="logo avatar" style="background:${c.color}20;color:${c.color}">${c.logo}</div>
        <h3>${Utils.escapeHtml(c.name)}</h3>
        <p class="company-tagline">${Utils.escapeHtml(c.tagline || c.industry)}</p>
        <span class="company-industry">${Utils.escapeHtml(c.industry)}</span>
        <div class="company-stats">
          <span class="badge badge-accent">${c.openJobs || 0} open roles</span>
          <span class="company-rating">★ ${c.rating || '4.5'}</span>
        </div>
        <p class="company-reviews">${(c.reviews || 0).toLocaleString()} reviews</p>
      </a>
    `).join('');
  },

  renderTestimonials() {
    const container = Utils.$('#testimonials-grid');
    if (!container) return;
    container.innerHTML = FreshaJobsData.testimonials.map(t => `
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

    const profile = FreshaJobsData.userProfile;
    const displayName = session.name || profile.name;

    if (Utils.$('#user-name'))         Utils.$('#user-name').textContent = displayName;
    if (Utils.$('#user-email'))        Utils.$('#user-email').textContent = session.email || profile.email;
    if (Utils.$('#dashboard-greeting')) Utils.$('#dashboard-greeting').textContent = `Welcome back, ${displayName.split(' ')[0]}! 👋`;

    document.querySelectorAll('.sidebar .avatar-lg, [data-user-initials]').forEach(el => {
      el.textContent = Auth.getInitials(displayName);
    });

    if (Utils.$('#profile-completion'))  Utils.$('#profile-completion').style.width = profile.completion + '%';
    if (Utils.$('#completion-percent'))  Utils.$('#completion-percent').textContent = profile.completion + '%';

    this.renderAppliedJobs();
    this.renderSavedJobsDashboard();
    this.initDashboardTabs();
    this.initResumeUpload();
  },

  renderAppliedJobs() {
    const container = Utils.$('#applied-jobs-list');
    if (!container) return;

    const apps = Storage.getApplications();
    const list = apps.length ? apps : FreshaJobsData.defaultApplications;

    container.innerHTML = list.map(app => `
      <div class="card" style="margin-bottom:1rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem">
        <div>
          <h4>${Utils.escapeHtml(app.jobTitle || app.title)}</h4>
          <p style="font-size:0.875rem">${Utils.escapeHtml(app.company || app.companyName)} · ${Utils.formatDate(app.date)}</p>
        </div>
        <span class="badge badge-${app.status === 'interview' ? 'accent' : app.status === 'submitted' || app.status === 'reviewing' ? 'warning' : 'success'}">${app.status}</span>
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
        const panel = Utils.$(`#tab-${tab}`);
        if (panel) panel.style.display = 'block';
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
    container.innerHTML = FreshaJobsData.applicants.map(a => `
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

    const profile = Storage.loadProfile() || FreshaJobsData.userProfile;
    if (Utils.$('#profile-name'))     Utils.$('#profile-name').textContent = session.name || profile.name;
    if (Utils.$('#profile-avatar'))   Utils.$('#profile-avatar').textContent = Auth.getInitials(session.name);
    if (Utils.$('#profile-title'))    Utils.$('#profile-title').textContent = profile.title;
    if (Utils.$('#profile-location')) Utils.$('#profile-location').textContent = profile.location;
    if (Utils.$('#profile-bio'))      Utils.$('#profile-bio').textContent = profile.bio;

    const skillsEl = Utils.$('#profile-skills');
    if (skillsEl) skillsEl.innerHTML = profile.skills.map(s => `<span class="badge">${s}</span>`).join('');

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
      btn.addEventListener('click', () => App.openProfileEditor(btn, session, profile));
    });

    // Resume upload on profile page
    const resumeZone = Utils.$('#resume-upload-profile');
    if (resumeZone) {
      const input = Utils.$('input[type="file"]', resumeZone);
      resumeZone.addEventListener('click', () => input?.click());
      input?.addEventListener('change', () => {
        if (input.files.length) {
          Utils.showToast(`Resume "${input.files[0].name}" updated!`, 'success');
          const p = resumeZone.querySelector('p');
          if (p) p.textContent = `📄 ${input.files[0].name}`;
        }
      });
    }
  },

  openProfileEditor(btn, session, profile) {
    const section = btn.closest('.profile-section, .profile-header');
    const isHeader = btn.closest('.profile-header') !== null;

    // Determine which section is being edited
    if (isHeader || btn.textContent.trim() === 'Edit Profile' || btn.textContent.trim() === '📷') {
      this.editProfileHeader(session, profile);
    } else if (section?.querySelector('#profile-skills')) {
      this.editSkills(profile);
    } else if (section?.querySelector('#profile-experience')) {
      this.editExperience(profile);
    } else if (section?.querySelector('#profile-education')) {
      this.editEducation(profile);
    }
  },

  _showModal(title, bodyHtml, onSave) {
    // Remove any existing profile modal
    Utils.$('#profile-edit-modal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'profile-edit-modal';
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
      <div class="modal-content card" style="max-width:540px;width:90%;max-height:85vh;overflow-y:auto;padding:2rem">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem">
          <h3 style="margin:0">${title}</h3>
          <button class="btn btn-ghost btn-sm modal-close-btn" style="font-size:1.25rem;padding:0.25rem 0.5rem">×</button>
        </div>
        <div id="profile-modal-body">${bodyHtml}</div>
        <div style="display:flex;gap:0.75rem;margin-top:1.5rem;justify-content:flex-end">
          <button class="btn btn-ghost modal-close-btn">Cancel</button>
          <button class="btn btn-primary" id="profile-modal-save">Save Changes</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelectorAll('.modal-close-btn').forEach(b => {
      b.addEventListener('click', () => modal.remove());
    });
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });

    Utils.$('#profile-modal-save').addEventListener('click', () => {
      if (onSave(modal)) modal.remove();
    });
  },

  editProfileHeader(session, profile) {
    const name = session.name || profile.name;
    this._showModal('Edit Profile', `
      <div class="form-group" style="margin-bottom:1rem">
        <label style="display:block;margin-bottom:0.4rem;font-size:0.875rem;color:var(--text-secondary)">Full Name</label>
        <input id="edit-name" class="form-control" type="text" value="${Utils.escapeHtml(name)}" style="width:100%">
      </div>
      <div class="form-group" style="margin-bottom:1rem">
        <label style="display:block;margin-bottom:0.4rem;font-size:0.875rem;color:var(--text-secondary)">Job Title</label>
        <input id="edit-title" class="form-control" type="text" value="${Utils.escapeHtml(profile.title)}" style="width:100%">
      </div>
      <div class="form-group" style="margin-bottom:1rem">
        <label style="display:block;margin-bottom:0.4rem;font-size:0.875rem;color:var(--text-secondary)">Location</label>
        <input id="edit-location" class="form-control" type="text" value="${Utils.escapeHtml(profile.location)}" style="width:100%">
      </div>
      <div class="form-group">
        <label style="display:block;margin-bottom:0.4rem;font-size:0.875rem;color:var(--text-secondary)">Bio</label>
        <textarea id="edit-bio" class="form-control" rows="4" style="width:100%;resize:vertical">${Utils.escapeHtml(profile.bio)}</textarea>
      </div>
    `, (modal) => {
      const newName     = Utils.$('#edit-name', modal).value.trim();
      const newTitle    = Utils.$('#edit-title', modal).value.trim();
      const newLocation = Utils.$('#edit-location', modal).value.trim();
      const newBio      = Utils.$('#edit-bio', modal).value.trim();

      if (!newName) { Utils.showToast('Name cannot be empty', 'error'); return false; }

      // Persist
      profile.title    = newTitle    || profile.title;
      profile.location = newLocation || profile.location;
      profile.bio      = newBio;
      Storage.saveProfile(profile);

      // Update session name
      const updatedSession = { ...Storage.getSession(), name: newName };
      Storage.setSession(updatedSession);

      // Update DOM
      if (Utils.$('#profile-name'))     Utils.$('#profile-name').textContent = newName;
      if (Utils.$('#profile-title'))    Utils.$('#profile-title').textContent = newTitle;
      if (Utils.$('#profile-location')) Utils.$('#profile-location').textContent = newLocation ? `📍 ${newLocation}` : '';
      if (Utils.$('#profile-bio'))      Utils.$('#profile-bio').textContent = newBio;
      if (Utils.$('#profile-avatar'))   Utils.$('#profile-avatar').textContent = Auth.getInitials(newName);

      Utils.showToast('Profile updated!', 'success');
      return true;
    });
  },

  editSkills(profile) {
    this._showModal('Edit Skills', `
      <p style="font-size:0.875rem;color:var(--text-secondary);margin-bottom:0.75rem">Comma-separated list of skills</p>
      <textarea id="edit-skills" class="form-control" rows="5" style="width:100%;resize:vertical">${profile.skills.join(', ')}</textarea>
    `, (modal) => {
      const raw = Utils.$('#edit-skills', modal).value;
      const skills = raw.split(',').map(s => s.trim()).filter(Boolean);
      if (!skills.length) { Utils.showToast('Add at least one skill', 'error'); return false; }

      profile.skills = skills;
      Storage.saveProfile(profile);

      const el = Utils.$('#profile-skills');
      if (el) el.innerHTML = skills.map(s => `<span class="badge">${Utils.escapeHtml(s)}</span>`).join('');
      Utils.showToast('Skills updated!', 'success');
      return true;
    });
  },

  editExperience(profile) {
    const renderExpFields = (exp, i) => `
      <div class="exp-entry card" data-index="${i}" style="margin-bottom:1rem;padding:1rem">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem">
          <strong>Experience ${i + 1}</strong>
          <button class="btn btn-ghost btn-sm remove-exp-btn" data-index="${i}" style="color:var(--danger)">Remove</button>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:0.75rem">
          <div>
            <label style="font-size:0.8rem;color:var(--text-secondary)">Role</label>
            <input class="form-input exp-role" type="text" value="${Utils.escapeHtml(exp.role)}" style="width:100%;margin-top:0.25rem">
          </div>
          <div>
            <label style="font-size:0.8rem;color:var(--text-secondary)">Company</label>
            <input class="form-input exp-company" type="text" value="${Utils.escapeHtml(exp.company)}" style="width:100%;margin-top:0.25rem">
          </div>
        </div>
        <div style="margin-bottom:0.75rem">
          <label style="font-size:0.8rem;color:var(--text-secondary)">Years (e.g. 2020 - Present)</label>
          <input class="form-input exp-years" type="text" value="${Utils.escapeHtml(exp.years)}" style="width:100%;margin-top:0.25rem">
        </div>
        <div>
          <label style="font-size:0.8rem;color:var(--text-secondary)">Description</label>
          <textarea class="form-input exp-desc" rows="2" style="width:100%;resize:vertical;margin-top:0.25rem">${Utils.escapeHtml(exp.description)}</textarea>
        </div>
      </div>
    `;

    const buildBody = (list) => `
      <div id="exp-list">${list.map((e, i) => renderExpFields(e, i)).join('')}</div>
      <button class="btn btn-outline btn-sm" id="add-exp-btn" style="width:100%;margin-top:0.5rem">+ Add Experience</button>
    `;

    let expList = profile.experience.map(e => ({ ...e }));

    this._showModal('Edit Experience', buildBody(expList), (modal) => {
      const entries = modal.querySelectorAll('.exp-entry');
      const updated = [];
      let valid = true;
      entries.forEach(entry => {
        const role    = entry.querySelector('.exp-role').value.trim();
        const company = entry.querySelector('.exp-company').value.trim();
        const years   = entry.querySelector('.exp-years').value.trim();
        const desc    = entry.querySelector('.exp-desc').value.trim();
        if (!role || !company) { valid = false; }
        updated.push({ role, company, years, description: desc });
      });
      if (!valid) { Utils.showToast('Role and company are required', 'error'); return false; }

      profile.experience = updated;
      Storage.saveProfile(profile);

      const el = Utils.$('#profile-experience');
      if (el) {
        el.innerHTML = updated.map(e => `
          <div class="experience-item">
            <h4>${Utils.escapeHtml(e.role)}</h4>
            <p style="color:var(--primary-light)">${Utils.escapeHtml(e.company)} · ${Utils.escapeHtml(e.years)}</p>
            <p style="font-size:0.875rem;margin-top:0.5rem">${Utils.escapeHtml(e.description)}</p>
          </div>
        `).join('');
      }
      Utils.showToast('Experience updated!', 'success');
      return true;
    });

    // Add / remove entry handlers (delegated since modal is freshly created)
    const modalEl = Utils.$('#profile-edit-modal');
    Utils.$('#add-exp-btn', modalEl).addEventListener('click', () => {
      expList.push({ role: '', company: '', years: '', description: '' });
      Utils.$('#exp-list', modalEl).innerHTML = expList.map((e, i) => renderExpFields(e, i)).join('');
      bindRemove(modalEl);
    });
    bindRemove(modalEl);

    function bindRemove(modalEl) {
      modalEl.querySelectorAll('.remove-exp-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          expList.splice(parseInt(btn.dataset.index), 1);
          Utils.$('#exp-list', modalEl).innerHTML = expList.map((e, i) => renderExpFields(e, i)).join('');
          bindRemove(modalEl);
        });
      });
    }
  },

  editEducation(profile) {
    const renderEduFields = (edu, i) => `
      <div class="edu-entry card" data-index="${i}" style="margin-bottom:1rem;padding:1rem">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem">
          <strong>Education ${i + 1}</strong>
          <button class="btn btn-ghost btn-sm remove-edu-btn" data-index="${i}" style="color:var(--danger)">Remove</button>
        </div>
        <div style="margin-bottom:0.75rem">
          <label style="font-size:0.8rem;color:var(--text-secondary)">School / Institution</label>
          <input class="form-input edu-school" type="text" value="${Utils.escapeHtml(edu.school)}" style="width:100%;margin-top:0.25rem">
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem">
          <div>
            <label style="font-size:0.8rem;color:var(--text-secondary)">Degree</label>
            <input class="form-input edu-degree" type="text" value="${Utils.escapeHtml(edu.degree)}" style="width:100%;margin-top:0.25rem">
          </div>
          <div>
            <label style="font-size:0.8rem;color:var(--text-secondary)">Years</label>
            <input class="form-input edu-years" type="text" value="${Utils.escapeHtml(edu.years)}" style="width:100%;margin-top:0.25rem">
          </div>
        </div>
      </div>
    `;

    const buildBody = (list) => `
      <div id="edu-list">${list.map((e, i) => renderEduFields(e, i)).join('')}</div>
      <button class="btn btn-outline btn-sm" id="add-edu-btn" style="width:100%;margin-top:0.5rem">+ Add Education</button>
    `;

    let eduList = profile.education.map(e => ({ ...e }));

    this._showModal('Edit Education', buildBody(eduList), (modal) => {
      const entries = modal.querySelectorAll('.edu-entry');
      const updated = [];
      let valid = true;
      entries.forEach(entry => {
        const school = entry.querySelector('.edu-school').value.trim();
        const degree = entry.querySelector('.edu-degree').value.trim();
        const years  = entry.querySelector('.edu-years').value.trim();
        if (!school) { valid = false; }
        updated.push({ school, degree, years });
      });
      if (!valid) { Utils.showToast('School name is required', 'error'); return false; }

      profile.education = updated;
      Storage.saveProfile(profile);

      const el = Utils.$('#profile-education');
      if (el) {
        el.innerHTML = updated.map(e => `
          <div class="education-item">
            <h4>${Utils.escapeHtml(e.school)}</h4>
            <p>${Utils.escapeHtml(e.degree)} · ${Utils.escapeHtml(e.years)}</p>
          </div>
        `).join('');
      }
      Utils.showToast('Education updated!', 'success');
      return true;
    });

    const modalEl = Utils.$('#profile-edit-modal');
    Utils.$('#add-edu-btn', modalEl).addEventListener('click', () => {
      eduList.push({ school: '', degree: '', years: '' });
      Utils.$('#edu-list', modalEl).innerHTML = eduList.map((e, i) => renderEduFields(e, i)).join('');
      bindRemove(modalEl);
    });
    bindRemove(modalEl);

    function bindRemove(modalEl) {
      modalEl.querySelectorAll('.remove-edu-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          eduList.splice(parseInt(btn.dataset.index), 1);
          Utils.$('#edu-list', modalEl).innerHTML = eduList.map((e, i) => renderEduFields(e, i)).join('');
          bindRemove(modalEl);
        });
      });
    }
  },

  initCompany() {
    const id = Utils.getQueryParam('id') || 'c1';
    const company = getCompany(id);
    if (!company) return;

    document.title = `${company.name} | Fresha Jobs`;

    // Logo — try image first, fall back to text
    const logoWrap = Utils.$('#cp-logo-wrap');
    const logoFallback = Utils.$('#cp-logo-fallback');
    if (logoWrap && company.logoUrl) {
      const img = document.createElement('img');
      img.alt = company.name;
      img.src = company.logoUrl;
      img.onerror = () => {
        img.remove();
        if (logoFallback) {
          logoFallback.textContent = company.logo;
          logoFallback.style.color = company.color;
          logoFallback.style.display = '';
        }
      };
      img.onload = () => { if (logoFallback) logoFallback.style.display = 'none'; };
      logoWrap.appendChild(img);
      logoWrap.style.background = `${company.color}15`;
    } else if (logoFallback) {
      logoFallback.textContent = company.logo;
      logoFallback.style.color = company.color;
    }

    // Header fields
    Utils.$('#cp-name')      && (Utils.$('#cp-name').textContent = company.name);
    Utils.$('#cp-industry')  && (Utils.$('#cp-industry').textContent = company.industry);
    Utils.$('#cp-location')  && (Utils.$('#cp-location').textContent = company.location);
    Utils.$('#cp-employees') && (Utils.$('#cp-employees').textContent = company.employees);
    Utils.$('#cp-founded')   && (Utils.$('#cp-founded').textContent = company.founded || '—');
    Utils.$('#cp-type')      && (Utils.$('#cp-type').textContent = company.type || '—');
    Utils.$('#cp-revenue')   && (Utils.$('#cp-revenue').textContent = company.revenue || '—');
    Utils.$('#cp-about')     && (Utils.$('#cp-about').textContent = company.about);
    Utils.$('#cp-culture')   && (Utils.$('#cp-culture').textContent = company.culture || '');

    // Tagline from featuredCompanies
    const featured = (FreshaJobsData.featuredCompanies || []).find(c => c.id === id);
    if (featured && Utils.$('#cp-tagline')) Utils.$('#cp-tagline').textContent = featured.tagline || '';
    if (featured?.hiringNow) {
      const badge = Utils.$('#cp-hiring-badge');
      if (badge) badge.style.display = '';
    }

    // Rating
    const rating = company.rating || (featured && featured.rating) || 0;
    const reviews = company.reviews || (featured && featured.reviews) || 0;
    Utils.$('#cp-rating')  && (Utils.$('#cp-rating').textContent = rating.toFixed(1));
    Utils.$('#cp-reviews') && (Utils.$('#cp-reviews').textContent = reviews.toLocaleString());
    const starsEl = Utils.$('#cp-stars');
    if (starsEl) {
      const full = Math.floor(rating);
      const half = rating - full >= 0.5;
      starsEl.textContent = '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - (half ? 1 : 0));
    }

    // Website link
    const webLink = Utils.$('#cp-website-link');
    if (webLink && company.website) webLink.href = company.website;

    // Jobs button
    const jobsBtn = Utils.$('#cp-jobs-btn');
    if (jobsBtn) jobsBtn.href = `jobs.html?company=${encodeURIComponent(company.name)}`;

    // Tech stack
    const techEl = Utils.$('#cp-tech-stack');
    if (techEl && company.techStack) {
      techEl.innerHTML = company.techStack.map(t => `<span class="tech-tag">${Utils.escapeHtml(t)}</span>`).join('');
    }

    // Benefits
    const benefitsEl = Utils.$('#cp-benefits');
    if (benefitsEl && company.benefits) {
      benefitsEl.innerHTML = company.benefits.map(b => `<div class="benefit-item">${Utils.escapeHtml(b)}</div>`).join('');
    }

    // Sidebar info
    Utils.$('#si-industry') && (Utils.$('#si-industry').textContent = company.industry);
    Utils.$('#si-size')     && (Utils.$('#si-size').textContent = company.employees);
    Utils.$('#si-founded')  && (Utils.$('#si-founded').textContent = company.founded || '—');
    Utils.$('#si-type')     && (Utils.$('#si-type').textContent = company.type || '—');
    Utils.$('#si-revenue')  && (Utils.$('#si-revenue').textContent = company.revenue || '—');
    Utils.$('#si-location') && (Utils.$('#si-location').textContent = company.location);

    // Social links
    const socialEl = Utils.$('#cp-social-links');
    if (socialEl && company.social) {
      const icons = { linkedin: 'in', twitter: '𝕏', github: '⌨' };
      socialEl.innerHTML = Object.entries(company.social).map(([key, url]) =>
        `<a href="${url}" class="cp-social-link" target="_blank" rel="noopener" aria-label="${key}">${icons[key] || key}</a>`
      ).join('');
    }

    // Open jobs
    const allJobs = getAllJobsEnriched().filter(j => j.companyId === id);
    const countBadge = Utils.$('#cp-jobs-count');
    if (countBadge) countBadge.textContent = allJobs.length;
    const jobsList = Utils.$('#cp-jobs-list');
    if (jobsList) {
      jobsList.innerHTML = allJobs.length
        ? allJobs.map(j => Jobs.renderJobCard(j)).join('')
        : '<p style="color:var(--text-muted);padding:1rem 0">No open positions at this time.</p>';
      Jobs.bindJobCardEvents(jobsList);
    }

    // Similar companies (same industry, exclude current)
    const similarEl = Utils.$('#cp-similar');
    if (similarEl) {
      const similar = FreshaJobsData.companies
        .filter(c => c.id !== id && c.industry.split(' ')[0] === company.industry.split(' ')[0])
        .slice(0, 4);
      const fallbackSimilar = similar.length ? similar : FreshaJobsData.companies.filter(c => c.id !== id).slice(0, 4);
      similarEl.innerHTML = fallbackSimilar.map(c => `
        <a href="company.html?id=${c.id}" class="cp-similar-item">
          <div class="cp-similar-logo" style="background:${c.color}15">
            ${c.logoUrl
              ? `<img src="${c.logoUrl}" alt="${Utils.escapeHtml(c.name)}" onerror="this.style.display='none';this.nextElementSibling.style.display=''"><span style="display:none;color:${c.color};font-weight:700">${Utils.escapeHtml(c.logo)}</span>`
              : `<span style="color:${c.color};font-weight:700">${Utils.escapeHtml(c.logo)}</span>`}
          </div>
          <div class="cp-similar-info">
            <span>${Utils.escapeHtml(c.name)}</span>
            <small>${Utils.escapeHtml(c.industry)}</small>
          </div>
        </a>`).join('');
    }

    // Tab switching
    document.querySelectorAll('.cp-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.cp-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.cp-tab-panel').forEach(p => p.style.display = 'none');
        tab.classList.add('active');
        const panel = Utils.$(`#tab-${tab.dataset.tab}`);
        if (panel) panel.style.display = '';
      });
    });

    // Follow button
    Utils.$('#cp-follow-btn')?.addEventListener('click', function() {
      this.textContent = this.textContent.includes('+') ? '✓ Following' : '+ Follow';
    });
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

    Utils.$('#apply-modal')?.addEventListener('click', (e) => {
      if (e.target.id === 'apply-modal') Utils.$('#apply-modal').classList.remove('active');
    });

    Utils.$$('.modal-close').forEach(btn => {
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
