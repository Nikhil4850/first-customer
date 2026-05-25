const Jobs = {
  state: {
    jobs: [],
    filtered: [],
    page: 1,
    perPage: 9,
    view: 'grid',
    sort: 'newest',
    filters: {},
    loading: false,
    infiniteMode: false
  },

  init() {
    this.state.jobs = getAllJobsEnriched();
    this.state.filtered = [...this.state.jobs];
    this.bindEvents();
    this.applyFiltersFromURL();
    this.render();
    this.renderFilters();
    this.renderRecommendations();
    this.renderRecentlyViewed();
    Utils.initScrollReveal();
  },

  bindEvents() {
    const searchInput = Utils.$('#job-search');
    if (searchInput) {
      searchInput.addEventListener('input', Utils.debounce((e) => {
        this.state.filters.search = e.target.value;
        this.filterAndRender();
      }, 300));
    }

    Utils.$('#sort-jobs')?.addEventListener('change', (e) => {
      this.state.sort = e.target.value;
      this.filterAndRender();
    });

    Utils.$$('.jobs-view-toggle button').forEach(btn => {
      btn.addEventListener('click', () => {
        Utils.$$('.jobs-view-toggle button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.view = btn.dataset.view;
        const grid = Utils.$('#jobs-container');
        if (grid) {
          grid.classList.toggle('list-view', this.state.view === 'list');
          grid.classList.toggle('grid-view', this.state.view === 'grid');
        }
      });
    });

    Utils.$('#load-more')?.addEventListener('click', () => this.loadMore());
    Utils.$('#toggle-filters')?.addEventListener('click', () => {
      Utils.$('.filters-sidebar')?.classList.toggle('mobile-open');
    });

    Utils.$('#infinite-scroll-toggle')?.addEventListener('change', (e) => {
      this.state.infiniteMode = e.target.checked;
      Utils.$('#pagination-wrap').style.display = e.target.checked ? 'none' : 'flex';
    });

    window.addEventListener('scroll', Utils.debounce(() => {
      if (!this.state.infiniteMode || this.state.loading) return;
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        this.loadMore();
      }
    }, 200));
  },

  applyFiltersFromURL() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('q')) this.state.filters.search = params.get('q');
    if (params.get('location')) this.state.filters.location = params.get('location');
    if (params.get('category')) this.state.filters.category = params.get('category');
    const searchInput = Utils.$('#job-search');
    if (searchInput && this.state.filters.search) searchInput.value = this.state.filters.search;
    this.filterAndRender();
  },

  renderFilters() {
    const container = Utils.$('#filter-options');
    if (!container) return;

    const locations = [...new Set(this.state.jobs.map(j => j.location.split(',')[0]))];
    const companies = [...new Set(this.state.jobs.map(j => j.company.name))];
    const types = [...new Set(this.state.jobs.map(j => j.type))];
    const remotes = [...new Set(this.state.jobs.map(j => j.remote))];

    container.innerHTML = `
      <div class="filter-group card">
        <h4>Location</h4>
        <div class="filter-options" id="filter-location">
          ${locations.slice(0, 8).map(loc => `
            <label><input type="checkbox" name="location" value="${loc}"> ${loc}</label>
          `).join('')}
        </div>
      </div>
      <div class="filter-group card">
        <h4>Job Type</h4>
        <div class="filter-options" id="filter-type">
          ${types.map(t => `<label><input type="checkbox" name="type" value="${t}"> ${t}</label>`).join('')}
        </div>
      </div>
      <div class="filter-group card">
        <h4>Work Mode</h4>
        <div class="filter-options" id="filter-remote">
          ${remotes.map(r => `<label><input type="checkbox" name="remote" value="${r}"> ${r}</label>`).join('')}
        </div>
      </div>
      <div class="filter-group card">
        <h4>Experience</h4>
        <div class="filter-options" id="filter-experience">
          <label><input type="checkbox" name="experience" value="0-1"> Entry Level</label>
          <label><input type="checkbox" name="experience" value="2-3"> Mid Level (2-4 yrs)</label>
          <label><input type="checkbox" name="experience" value="4-6"> Senior (4-6 yrs)</label>
          <label><input type="checkbox" name="experience" value="7+"> Expert (7+ yrs)</label>
        </div>
      </div>
      <div class="filter-group card">
        <h4>Salary Range</h4>
        <div class="filter-options" id="filter-salary">
          <label><input type="checkbox" name="salary" value="0-100"> Under $100k</label>
          <label><input type="checkbox" name="salary" value="100-150"> $100k - $150k</label>
          <label><input type="checkbox" name="salary" value="150-200"> $150k - $200k</label>
          <label><input type="checkbox" name="salary" value="200+"> $200k+</label>
        </div>
      </div>
      <div class="filter-group card">
        <h4>Company</h4>
        <div class="filter-options" id="filter-company">
          ${companies.map(c => `<label><input type="checkbox" name="company" value="${c}"> ${c}</label>`).join('')}
        </div>
      </div>
      <div class="filter-group card">
        <h4>Skills</h4>
        <div class="filter-options" id="filter-skills">
          ${['React', 'Python', 'JavaScript', 'AWS', 'TypeScript', 'Node.js'].map(s => `
            <label><input type="checkbox" name="skills" value="${s}"> ${s}</label>
          `).join('')}
        </div>
      </div>
      <button class="btn btn-outline" style="width:100%" id="clear-filters">Clear All Filters</button>
    `;

    container.querySelectorAll('input[type="checkbox"]').forEach(input => {
      input.addEventListener('change', () => this.collectFilters());
    });

    Utils.$('#clear-filters')?.addEventListener('click', () => {
      container.querySelectorAll('input[type="checkbox"]').forEach(i => i.checked = false);
      this.state.filters = {};
      if (Utils.$('#job-search')) Utils.$('#job-search').value = '';
      this.filterAndRender();
    });
  },

  collectFilters() {
    const filters = {};
    Utils.$$('#filter-options input:checked').forEach(input => {
      const name = input.name;
      if (!filters[name]) filters[name] = [];
      filters[name].push(input.value);
    });
    const search = Utils.$('#job-search')?.value;
    if (search) filters.search = search;
    this.state.filters = filters;
    this.filterAndRender();
  },

  filterAndRender() {
    let result = [...this.state.jobs];
    const f = this.state.filters;

    if (f.search) {
      const q = f.search.toLowerCase();
      result = result.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.company.name.toLowerCase().includes(q) ||
        j.skills.some(s => s.toLowerCase().includes(q))
      );
    }

    if (f.location?.length) {
      result = result.filter(j => f.location.some(loc => j.location.includes(loc)));
    }

    if (f.type?.length) {
      result = result.filter(j => f.type.includes(j.type));
    }

    if (f.remote?.length) {
      result = result.filter(j => f.remote.includes(j.remote));
    }

    if (f.company?.length) {
      result = result.filter(j => f.company.includes(j.company.name));
    }

    if (f.skills?.length) {
      result = result.filter(j => f.skills.some(s => j.skills.includes(s)));
    }

    if (f.experience?.length) {
      result = result.filter(j => {
        const exp = j.experience;
        return f.experience.some(e => {
          if (e === '0-1') return exp.includes('0') || exp.includes('1') || exp.includes('Intern');
          if (e === '2-3') return exp.includes('2') || exp.includes('3');
          if (e === '4-6') return exp.includes('4') || exp.includes('5') || exp.includes('6');
          if (e === '7+') return exp.includes('7') || exp.includes('PhD');
          return true;
        });
      });
    }

    if (f.salary?.length) {
      result = result.filter(j => {
        const match = j.salary.match(/\$?(\d+)/);
        const num = match ? parseInt(match[1]) : 0;
        return f.salary.some(range => {
          if (range === '0-100') return num < 100;
          if (range === '100-150') return num >= 100 && num < 150;
          if (range === '150-200') return num >= 150 && num < 200;
          if (range === '200+') return num >= 200;
          return true;
        });
      });
    }

    switch (this.state.sort) {
      case 'salary-high':
        result.sort((a, b) => this.parseSalary(b.salary) - this.parseSalary(a.salary));
        break;
      case 'salary-low':
        result.sort((a, b) => this.parseSalary(a.salary) - this.parseSalary(b.salary));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.posted) - new Date(b.posted));
        break;
      default:
        result.sort((a, b) => new Date(b.posted) - new Date(a.posted));
    }

    this.state.filtered = result;
    this.state.page = 1;
    this.render();
    this.updateResultsCount();
  },

  parseSalary(salary) {
    const match = salary.match(/\$?(\d+)/);
    return match ? parseInt(match[1]) : 0;
  },

  updateResultsCount() {
    const el = Utils.$('#results-count');
    if (el) el.textContent = `${this.state.filtered.length} jobs found`;
  },

  render() {
    const container = Utils.$('#jobs-container');
    if (!container) return;

    const start = 0;
    const end = this.state.page * this.state.perPage;
    const jobs = this.state.filtered.slice(start, end);

    if (jobs.length === 0) {
      container.innerHTML = `<div class="empty-state"><p>No jobs match your criteria. Try adjusting filters.</p></div>`;
      const wrap = Utils.$('#pagination-wrap');
      if (wrap) wrap.style.display = 'none';
      return;
    }

    container.innerHTML = jobs.map(job => this.renderJobCard(job)).join('');
    this.bindJobCardEvents(container);
    this.renderPagination();

    const paginationWrap = Utils.$('#pagination-wrap');
    if (paginationWrap && !this.state.infiniteMode) {
      paginationWrap.style.display = 'flex';
    }
  },

  renderJobCard(job) {
    const saved = Storage.isJobSaved(job.id);
    return `
      <article class="card job-card reveal" data-id="${job.id}">
        <div class="job-card-header">
          <div class="company-logo" style="background:${job.company.color}20;color:${job.company.color}">${job.company.logo}</div>
          <div>
            <h3 class="job-card-title"><a href="job-details.html?id=${job.id}">${Utils.escapeHtml(job.title)}</a></h3>
            <p class="job-card-company"><a href="company.html?id=${job.companyId}">${Utils.escapeHtml(job.company.name)}</a></p>
          </div>
          <button class="save-btn ${saved ? 'saved' : ''}" data-id="${job.id}" aria-label="Save job">★</button>
        </div>
        <div class="job-card-meta">
          <span>💰 ${job.salary}</span>
          <span>📍 ${job.location}</span>
          <span>⏱ ${job.experience}</span>
        </div>
        <div class="job-card-tags">
          <span class="badge">${job.type}</span>
          <span class="badge badge-accent">${job.remote}</span>
          ${job.featured ? '<span class="badge badge-warning">Featured</span>' : ''}
        </div>
        <div class="job-card-tags">
          ${job.skills.slice(0, 3).map(s => `<span class="tag">${s}</span>`).join('')}
        </div>
        <div class="job-card-footer">
          <span style="font-size:0.75rem;color:var(--text-muted)">${Utils.formatDate(job.posted)}</span>
          <div class="job-card-actions">
            <a href="job-details.html?id=${job.id}" class="btn btn-primary btn-sm">Apply Now</a>
          </div>
        </div>
      </article>
    `;
  },

  bindJobCardEvents(container) {
    container.querySelectorAll('.save-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const saved = Storage.toggleSavedJob(btn.dataset.id);
        btn.classList.toggle('saved', saved);
        Utils.showToast(saved ? 'Job saved!' : 'Job removed from saved', saved ? 'success' : 'info');
      });
    });
    Utils.initScrollReveal();
  },

  renderPagination() {
    const wrap = Utils.$('#pagination');
    if (!wrap) return;

    const totalPages = Math.ceil(this.state.filtered.length / this.state.perPage);
    if (totalPages <= 1) {
      wrap.innerHTML = '';
      return;
    }

    let html = `<button ${this.state.page === 1 ? 'disabled' : ''} data-page="${this.state.page - 1}">←</button>`;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= this.state.page - 1 && i <= this.state.page + 1)) {
        html += `<button class="${i === this.state.page ? 'active' : ''}" data-page="${i}">${i}</button>`;
      } else if (i === this.state.page - 2 || i === this.state.page + 2) {
        html += `<button disabled>...</button>`;
      }
    }
    html += `<button ${this.state.page === totalPages ? 'disabled' : ''} data-page="${this.state.page + 1}">→</button>`;
    wrap.innerHTML = html;

    wrap.querySelectorAll('button[data-page]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.state.page = parseInt(btn.dataset.page);
        this.render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  },

  loadMore() {
    const totalPages = Math.ceil(this.state.filtered.length / this.state.perPage);
    if (this.state.page >= totalPages) return;
    this.state.loading = true;
    this.state.page++;
    const container = Utils.$('#jobs-container');
    const start = (this.state.page - 1) * this.state.perPage;
    const jobs = this.state.filtered.slice(start, this.state.page * this.state.perPage);
    container.insertAdjacentHTML('beforeend', jobs.map(j => this.renderJobCard(j)).join(''));
    this.bindJobCardEvents(container);
    this.state.loading = false;
    Utils.initScrollReveal();
  },

  renderHomeJobs() {
    const container = Utils.$('#latest-jobs');
    if (!container) return;
    const jobs = [...this.state.jobs]
      .sort((a, b) => new Date(b.posted) - new Date(a.posted))
      .slice(0, 9);
    container.innerHTML = jobs.map(job => this.renderJobCard(job)).join('');
    this.bindJobCardEvents(container);
    Utils.showRevealsIn(container);
  },

  renderJobDetail() {
    const id = Utils.getQueryParam('id');
    if (!id) {
      window.location.href = 'jobs.html';
      return;
    }

    const job = this.state.jobs.find(j => j.id === id);
    if (!job) {
      window.location.href = 'jobs.html';
      return;
    }

    Storage.addRecentJob(id);
    document.title = `${job.title} at ${job.company.name} | Niks Jobs`;

    const main = Utils.$('#job-detail-content');
    if (!main) return;

    const saved = Storage.isJobSaved(id);
    main.innerHTML = `
      <div class="job-detail-header">
        <div class="company-logo" style="background:${job.company.color}20;color:${job.company.color};width:80px;height:80px;font-size:1.75rem">${job.company.logo}</div>
        <div>
          <h1>${Utils.escapeHtml(job.title)}</h1>
          <p><a href="company.html?id=${job.companyId}">${Utils.escapeHtml(job.company.name)}</a> · ${job.location}</p>
          <div class="job-detail-meta">
            <span class="badge">💰 ${job.salary}</span>
            <span class="badge badge-accent">${job.type}</span>
            <span class="badge">${job.remote}</span>
            <span class="badge">${job.experience}</span>
          </div>
        </div>
      </div>

      <div class="card job-description">
        <h3>About the Role</h3>
        <p>${Utils.escapeHtml(job.description)}</p>
        <h3>Responsibilities</h3>
        <ul>
          <li>Design, develop, and maintain high-quality software solutions</li>
          <li>Collaborate with cross-functional teams to deliver features</li>
          <li>Participate in code reviews and technical discussions</li>
          <li>Mentor junior team members and contribute to best practices</li>
          <li>Optimize application performance and scalability</li>
        </ul>
        <h3>Requirements</h3>
        <ul>
          <li>${job.experience} of relevant experience</li>
          <li>Strong proficiency in ${job.skills.join(', ')}</li>
          <li>Excellent problem-solving and communication skills</li>
          <li>Bachelor's degree in Computer Science or related field</li>
          <li>Experience with agile development methodologies</li>
        </ul>
        <h3>Benefits</h3>
        <ul>
          <li>Competitive salary and equity package</li>
          <li>Comprehensive health, dental, and vision insurance</li>
          <li>Flexible work arrangements and generous PTO</li>
          <li>Learning and development budget</li>
          <li>401(k) matching and wellness programs</li>
        </ul>
      </div>

      <div class="card">
        <h3>Skills Required</h3>
        <div class="skills-list" style="margin-top:1rem">
          ${job.skills.map(s => `<span class="badge">${s}</span>`).join('')}
        </div>
      </div>
    `;

    const sidebar = Utils.$('#job-detail-sidebar');
    if (sidebar) {
      sidebar.innerHTML = `
        <div class="card" style="position:sticky;top:calc(var(--header-height) + 1rem)">
          <button class="btn btn-primary btn-lg" style="width:100%;margin-bottom:0.75rem" id="apply-btn">Apply Now</button>
          <button class="btn btn-outline save-btn-detail ${saved ? 'saved' : ''}" style="width:100%;margin-bottom:1rem" data-id="${id}">★ ${saved ? 'Saved' : 'Save Job'}</button>
          <div class="share-buttons" style="justify-content:center;margin-bottom:1rem">
            <button title="Share on LinkedIn" data-share="linkedin">in</button>
            <button title="Share on Twitter" data-share="twitter">𝕏</button>
            <button title="Copy link" data-share="copy">🔗</button>
          </div>
          <hr style="border:none;border-top:1px solid var(--border);margin:1rem 0">
          <h4 style="margin-bottom:0.75rem">About ${Utils.escapeHtml(job.company.name)}</h4>
          <p style="font-size:0.875rem">${Utils.escapeHtml(job.company.about?.substring(0, 150) || '')}...</p>
          <a href="company.html?id=${job.companyId}" class="btn btn-ghost btn-sm" style="width:100%;margin-top:1rem">View Company</a>
        </div>
      `;

      Utils.$('.save-btn-detail')?.addEventListener('click', function() {
        const isSaved = Storage.toggleSavedJob(id);
        this.classList.toggle('saved', isSaved);
        this.textContent = isSaved ? '★ Saved' : '★ Save Job';
        Utils.showToast(isSaved ? 'Job saved!' : 'Removed from saved', 'success');
      });

      Utils.$$('.share-buttons button').forEach(btn => {
        btn.addEventListener('click', () => {
          const url = window.location.href;
          if (btn.dataset.share === 'copy') {
            navigator.clipboard?.writeText(url);
            Utils.showToast('Link copied!', 'success');
          } else {
            Utils.showToast('Share link copied!', 'success');
            navigator.clipboard?.writeText(url);
          }
        });
      });
    }

    this.renderSimilarJobs(job);
    this.initReadingProgress();
    this.initStickyApply(job);
  },

  renderSimilarJobs(currentJob) {
    const container = Utils.$('#similar-jobs');
    if (!container) return;
    const similar = this.state.jobs
      .filter(j => j.id !== currentJob.id && (j.companyId === currentJob.companyId || j.skills.some(s => currentJob.skills.includes(s))))
      .slice(0, 3);
    container.innerHTML = similar.map(j => this.renderJobCard(j)).join('');
    this.bindJobCardEvents(container);
  },

  initReadingProgress() {
    const bar = Utils.$('.reading-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      bar.style.width = (winScroll / height) * 100 + '%';
    });
  },

  initStickyApply(job) {
    const sticky = Utils.$('.sticky-apply');
    if (!sticky) return;
    sticky.innerHTML = `
      <div>
        <strong>${Utils.escapeHtml(job.title)}</strong>
        <span style="color:var(--text-muted);font-size:0.875rem;display:block">${job.company.name}</span>
      </div>
      <button class="btn btn-primary" id="sticky-apply-btn">Apply Now</button>
    `;
    window.addEventListener('scroll', () => {
      sticky.classList.toggle('visible', window.scrollY > 400);
    });
    Utils.$('#sticky-apply-btn')?.addEventListener('click', () => {
      Utils.$('#apply-modal')?.classList.add('active');
    });
  },

  renderRecommendations() {
    const container = Utils.$('#job-recommendations');
    if (!container) return;
    const saved = Storage.getSavedJobs();
    let recommended = this.state.jobs;
    if (saved.length) {
      const savedJobs = this.state.jobs.filter(j => saved.includes(j.id));
      const skills = [...new Set(savedJobs.flatMap(j => j.skills))];
      recommended = this.state.jobs.filter(j => j.skills.some(s => skills.includes(s)) && !saved.includes(j.id));
    }
    container.innerHTML = recommended.slice(0, 4).map(j => this.renderJobCard(j)).join('');
    this.bindJobCardEvents(container);
  },

  renderRecentlyViewed() {
    const container = Utils.$('#recently-viewed');
    if (!container) return;
    const recent = Storage.getRecentJobs();
    if (!recent.length) {
      container.innerHTML = '<p style="color:var(--text-muted);font-size:0.875rem">No recently viewed jobs</p>';
      return;
    }
    container.innerHTML = recent.map(id => {
      const job = this.state.jobs.find(j => j.id === id);
      if (!job) return '';
      return `<a href="job-details.html?id=${id}" class="recent-job-chip">${Utils.escapeHtml(job.title)}</a>`;
    }).join('');
  }
};
