const Notifications = {
  init() {
    this.renderDropdown();
    this.updateBadge();
    const btn = Utils.$('.notif-btn');
    const dropdown = Utils.$('.notif-dropdown');
    if (!btn || !dropdown) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('active');
    });

    document.addEventListener('click', () => {
      dropdown.classList.remove('active');
    });

    dropdown.addEventListener('click', (e) => e.stopPropagation());

    Utils.$('.mark-all-read')?.addEventListener('click', () => {
      Storage.markNotificationsRead();
      this.updateBadge();
      Utils.$$('.notif-item').forEach(item => item.classList.remove('unread'));
      Utils.showToast('All notifications marked as read', 'success');
    });
  },

  renderDropdown() {
    const list = Utils.$('.notif-list');
    if (!list) return;

    const read = Storage.get(Storage.KEYS.VIEWED_NOTIFICATIONS, []);
    list.innerHTML = NiksJobsData.notifications.map(n => `
      <div class="notif-item ${!read.includes(n.id) && n.unread ? 'unread' : ''}" data-id="${n.id}">
        <div class="notif-icon ${n.type}">${this.getIcon(n.type)}</div>
        <div class="notif-content">
          <p><strong>${Utils.escapeHtml(n.title)}</strong></p>
          <p>${Utils.escapeHtml(n.message)}</p>
          <span class="notif-time">${n.time}</span>
        </div>
      </div>
    `).join('');
  },

  getIcon(type) {
    const icons = { alert: '🔔', application: '📋', interview: '📅', message: '💬' };
    return icons[type] || 'ℹ️';
  },

  updateBadge() {
    const badge = Utils.$('.notif-badge');
    const count = Storage.getUnreadCount();
    if (badge) {
      if (count > 0) {
        badge.textContent = count > 9 ? '9+' : count;
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    }
  }
};
