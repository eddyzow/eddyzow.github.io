const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const serverUrl = isLocalhost
  ? 'http://localhost:3000'
  : 'https://eddyzow.herokuapp.com';

const apiBase = `${serverUrl}/api/support`;
const sock = io(serverUrl, { transports: ['websocket', 'polling'] });
const STAFF_TOKEN_KEY = 'bsp_support_staff_token';

const state = {
  tickets: [],
  activeTicket: null,
  search: '',
  status: 'all',
  presence: {},
  notesExpanded: false,
  staffToken: '',
  authReady: false,
  counts: {
    all: 0,
    open: 0,
    waiting_on_player: 0,
    closed: 0,
    archived: 0,
  },
};
let autosaveTimer = null;

const els = {
  dashboardShell: document.querySelector('.dashboard-shell'),
  toastStack: document.getElementById('toast-stack'),
  createTicketBtn: document.getElementById('create-ticket-btn'),
  logoutBtn: document.getElementById('logout-btn'),
  ticketList: document.getElementById('ticket-list'),
  ticketEmpty: document.getElementById('ticket-empty'),
  ticketDetail: document.getElementById('ticket-detail'),
  detailTicketId: document.getElementById('detail-ticket-id'),
  detailBackBtn: document.getElementById('detail-back-btn'),
  toggleNotesBtn: document.getElementById('toggle-notes-btn'),
  detailSubject: document.getElementById('detail-subject'),
  detailMeta: document.getElementById('detail-meta'),
  detailPresence: document.getElementById('detail-presence'),
  detailSettings: document.getElementById('detail-settings'),
  assignedTo: document.getElementById('assigned-to'),
  priority: document.getElementById('priority'),
  detailStatus: document.getElementById('detail-status'),
  internalNotes: document.getElementById('internal-notes'),
  messageFeed: document.getElementById('message-feed'),
  replyInput: document.getElementById('reply-input'),
  sendReplyBtn: document.getElementById('send-reply-btn'),
  cleanTicketBtn: document.getElementById('clean-ticket-btn'),
  deleteTicketBtn: document.getElementById('delete-ticket-btn'),
  actionDropdown: document.getElementById('action-dropdown'),
  actionDropdownBtn: document.getElementById('action-dropdown-btn'),
  permanentlyDeleteBtn: document.getElementById('permanently-delete-btn'),
  confirmTitle: document.getElementById('confirm-title'),
  confirmOverlay: document.getElementById('confirm-overlay'),
  confirmMessage: document.getElementById('confirm-message'),
  confirmOkBtn: document.getElementById('confirm-ok-btn'),
  confirmCancelBtn: document.getElementById('confirm-cancel-btn'),
  searchInput: document.getElementById('search-input'),
  statusFilter: document.getElementById('status-filter'),
  statOpen: document.getElementById('stat-open'),
  statWaiting: document.getElementById('stat-waiting'),
  statTotal: document.getElementById('stat-total'),
  authOverlay: document.getElementById('auth-overlay'),
  authPassword: document.getElementById('auth-password'),
  authLoginBtn: document.getElementById('auth-login-btn'),
  createTicketOverlay: document.getElementById('create-ticket-overlay'),
  createPlayerUsername: document.getElementById('create-player-username'),
  createPlayerId: document.getElementById('create-player-id'),
  createTicketSubject: document.getElementById('create-ticket-subject'),
  createTicketAssigned: document.getElementById('create-ticket-assigned'),
  createTicketCategory: document.getElementById('create-ticket-category'),
  createTicketPriority: document.getElementById('create-ticket-priority'),
  createTicketNotes: document.getElementById('create-ticket-notes'),
  createTicketCancelBtn: document.getElementById('create-ticket-cancel-btn'),
  createTicketSubmitBtn: document.getElementById('create-ticket-submit-btn'),
};
let confirmResolver = null;

const STATUS_SORT_ORDER = {
  open: 0,
  waiting_on_player: 1,
  closed: 2,
  archived: 3,
};

async function api(path, options = {}) {
  const res = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(state.staffToken ? { Authorization: `Bearer ${state.staffToken}` } : {}),
      ...(options.headers || {})
    }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) throw new Error(data.error || 'Request failed');
  return data;
}

function sourceKindLabel(value) {
  if (value === 'button') return 'Button';
  if (value === 'spinny_default') return 'Spinny default';
  if (value === 'ai_generated') return 'AI generated';
  if (value === 'staff') return 'Staff';
  if (value === 'system') return 'System';
  return 'Typed';
}

function setAuthState(token) {
  state.staffToken = token || '';
  state.authReady = Boolean(state.staffToken);
  try {
    if (state.staffToken) localStorage.setItem(STAFF_TOKEN_KEY, state.staffToken);
    else localStorage.removeItem(STAFF_TOKEN_KEY);
  } catch (_) {}
  els.authOverlay.classList.toggle('hidden', state.authReady);
}

async function verifyStaffSession() {
  const res = await fetch(`${apiBase}/auth/staff/session`, {
    headers: {
      'Content-Type': 'application/json',
      ...(state.staffToken ? { Authorization: `Bearer ${state.staffToken}` } : {}),
    }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) throw new Error(data.error || 'Staff authentication required');
  setAuthState(data.authDisabled ? '__testing_bypass__' : state.staffToken);
}

async function loginStaff() {
  const password = els.authPassword.value.trim();
  if (!password) throw new Error('Enter the staff password.');
  const res = await fetch(`${apiBase}/auth/staff/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false || !data.token) throw new Error(data.error || 'Login failed');
  setAuthState(data.token);
  els.authPassword.value = '';
  if (sock.connected) sock.emit('support:staff:subscribe', { token: state.staffToken });
  await loadTickets();
}

function logoutStaff() {
  setAuthState('');
  state.tickets = [];
  state.activeTicket = null;
  state.presence = {};
  state.counts = { all: 0, open: 0, waiting_on_player: 0, closed: 0, archived: 0 };
  els.statOpen.textContent = '0';
  els.statWaiting.textContent = '0';
  els.statTotal.textContent = '0';
  renderTicketList();
  renderActiveTicket();
  showToast('Logged out.', 'info');
}

function toggleCreateTicketModal(open) {
  els.createTicketOverlay.classList.toggle('hidden', !open);
  els.createTicketOverlay.setAttribute('aria-hidden', open ? 'false' : 'true');
}

function statusLabel(value) {
  if (value === 'archived') return 'Archived';
  if (value === 'waiting_on_player') return 'Waiting on player';
  if (value === 'closed') return 'Closed';
  return 'Open';
}

function categoryLabel(value) {
  return value === 'refund' ? 'Refund' : 'General';
}

function priorityLabel(value) {
  if (value === 'low') return 'Low';
  if (value === 'high') return 'High';
  if (value === 'urgent') return 'Urgent';
  return 'Normal';
}

function senderLabel(value) {
  if (value === 'agent') return 'Support';
  if (value === 'bot') return 'Spinny';
  if (value === 'player') return 'Player';
  return 'System';
}

function relativeTime(value) {
  if (!value) return '';
  const diff = Date.now() - new Date(value).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function showToast(message, type = 'info') {
  if (!els.toastStack || !message) return;
  const toast = document.createElement('div');
  toast.className = `dashboard-toast ${type}`;
  toast.textContent = message;
  els.toastStack.appendChild(toast);
  window.setTimeout(() => toast.remove(), 3200);
}

function showError(err) {
  if (/authentication required|login failed/i.test(err?.message || '')) setAuthState('');
  showToast(err?.message || 'Something went wrong.', 'error');
}

function shouldUseFocusedDetailLayout() {
  return window.innerWidth <= 1280;
}

function syncResponsiveLayout() {
  if (!els.dashboardShell) return;
  els.dashboardShell.classList.toggle('detail-focus', Boolean(state.activeTicket) && shouldUseFocusedDetailLayout());
}

function syncNotesPanel() {
  if (!els.detailSettings || !els.toggleNotesBtn) return;
  const expanded = Boolean(state.activeTicket) && state.notesExpanded;
  els.detailSettings.classList.toggle('collapsed', !expanded);
  els.toggleNotesBtn.classList.toggle('active', expanded);
  els.toggleNotesBtn.textContent = expanded ? 'Hide notes' : 'Notes';
}

function requestConfirmation(message, confirmLabel = 'Confirm', title = 'Confirm action') {
  if (!els.confirmOverlay) return Promise.resolve(true);
  if (els.confirmTitle) els.confirmTitle.textContent = title;
  els.confirmMessage.textContent = message;
  els.confirmOkBtn.textContent = confirmLabel;
  els.confirmOverlay.classList.remove('hidden');
  els.confirmOverlay.setAttribute('aria-hidden', 'false');
  return new Promise(resolve => {
    confirmResolver = resolve;
  });
}

function resolveConfirmation(value) {
  if (!confirmResolver) return;
  const resolve = confirmResolver;
  confirmResolver = null;
  els.confirmOverlay.classList.add('hidden');
  els.confirmOverlay.setAttribute('aria-hidden', 'true');
  resolve(value);
}

function recomputeCounts() {
  // Recount from the full in-memory ticket list so stats update instantly on
  // every socket event without waiting for the next loadTickets() API call.
  // We only know the tickets currently loaded (may be filtered), so we update
  // each status bucket we can derive and keep the server's `all` total in sync.
  const next = { open: 0, waiting_on_player: 0, closed: 0, archived: 0 };
  for (const t of state.tickets) {
    if (t.archived) { next.archived++; continue; }
    if (next[t.status] !== undefined) next[t.status]++;
  }
  // `all` = everything except archived (mirrors server-side logic)
  next.all = next.open + next.waiting_on_player + next.closed;
  // If a previous loadTickets gave us a higher `archived` total (because we're
  // not viewing the archived filter right now), keep the larger value.
  state.counts = {
    all: Math.max(next.all, state.counts.all || 0),
    open: next.open,
    waiting_on_player: next.waiting_on_player,
    closed: next.closed,
    archived: Math.max(next.archived, state.counts.archived || 0),
  };
}

function mergeTicket(ticket) {
  if (!ticket?.id) return;
  if (state.status === 'archived' && !ticket.archived) {
    state.tickets = state.tickets.filter(item => item.id !== ticket.id);
    if (state.activeTicket?.id === ticket.id) state.activeTicket = { ...state.activeTicket, ...ticket };
    recomputeCounts();
    return;
  }
  if (state.status !== 'archived' && ticket.archived) {
    state.tickets = state.tickets.filter(item => item.id !== ticket.id);
    if (state.activeTicket?.id === ticket.id) state.activeTicket = { ...state.activeTicket, ...ticket };
    recomputeCounts();
    return;
  }
  const idx = state.tickets.findIndex(item => item.id === ticket.id);
  if (idx >= 0) state.tickets[idx] = { ...state.tickets[idx], ...ticket };
  else state.tickets.unshift(ticket);
  sortTicketsInPlace();
  if (state.activeTicket?.id === ticket.id) state.activeTicket = { ...state.activeTicket, ...ticket };
  recomputeCounts();
}

function sortTicketsInPlace() {
  state.tickets.sort((a, b) => {
    if (state.status === 'all') {
      const orderDiff = (STATUS_SORT_ORDER[a.status] ?? 99) - (STATUS_SORT_ORDER[b.status] ?? 99);
      if (orderDiff !== 0) return orderDiff;
    }
    return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
  });
}

function setActiveStatusButtons(status) {
  els.detailStatus.querySelectorAll('[data-status]').forEach(button => {
    button.classList.toggle('active', button.dataset.status === status);
  });
}

function setFilterButtons(status) {
  els.statusFilter.querySelectorAll('[data-status]').forEach(button => {
    button.classList.toggle('active', button.dataset.status === status);
  });
}

function updateFilterCounts() {
  const counts = state.counts || {};

  els.statusFilter.querySelectorAll('[data-status]').forEach(button => {
    const label = button.dataset.status === 'waiting_on_player'
      ? 'Waiting'
      : button.dataset.status === 'archived'
        ? 'Archived'
      : button.dataset.status.charAt(0).toUpperCase() + button.dataset.status.slice(1).replace('_', ' ');
    const baseLabel = button.dataset.status === 'all' ? 'All' : label;
    button.innerHTML = `${baseLabel} <span class="filter-count">${counts[button.dataset.status] || 0}</span>`;
  });
}

function scheduleAutosave(delay = 320) {
  if (!state.activeTicket) return;
  window.clearTimeout(autosaveTimer);
  autosaveTimer = window.setTimeout(() => {
    saveTicketMeta().catch(showError);
  }, delay);
}

function renderStats() {
  const counts = state.counts || {};
  els.statOpen.textContent = String(counts.open || 0);
  els.statWaiting.textContent = String(counts.waiting_on_player || 0);
  els.statTotal.textContent = String(counts.all || 0);
  updateFilterCounts();
}

function renderTicketList() {
  if (!state.authReady) {
    els.ticketList.innerHTML = '<div class="empty-list">Log in to view tickets.</div>';
    return;
  }
  sortTicketsInPlace();
  renderStats();
  if (!state.tickets.length) {
    els.ticketList.innerHTML = '<div class="empty-list">No tickets found.</div>';
    return;
  }

  const renderTicketRow = ticket => `
    <button class="ticket-row ${ticket.category === 'refund' ? 'refund' : ''} ${state.activeTicket?.id === ticket.id ? 'active' : ''}" data-ticket-id="${ticket.id}">
      <div class="ticket-row-top">
        <span class="ticket-row-id">${ticket.id}</span>
        <span class="ticket-row-date">${relativeTime(ticket.updatedAt)}</span>
      </div>
      <div class="ticket-row-subject">${escapeHtml(ticket.subject || 'Support Request')}</div>
      <div class="ticket-row-player">${escapeHtml(ticket.playerUsername || ticket.clientId || 'Unknown player')}</div>
      <div class="ticket-row-preview">${escapeHtml(ticket.preview || 'No preview yet')}</div>
      <div class="ticket-row-meta">
        <span class="status-pill ${ticket.status}">${statusLabel(ticket.status)}</span>
        <span class="meta-pill priority ${ticket.priority || 'normal'}">${priorityLabel(ticket.priority)}</span>
        ${ticket.archived ? '<span class="meta-pill archived">Archived</span>' : ''}
        <span class="meta-pill category">${categoryLabel(ticket.category)}</span>
        ${ticket.hiddenFromClient ? '<span class="meta-pill hidden">Hidden</span>' : ''}
        ${ticket.assignedTo ? `<span class="meta-pill assigned">${escapeHtml(ticket.assignedTo)}</span>` : '<span class="meta-pill unassigned">Unassigned</span>'}
      </div>
    </button>
  `;

  if (state.status !== 'all') {
    els.ticketList.innerHTML = state.tickets.map(renderTicketRow).join('');
    return;
  }

  const groups = [
    ['open', 'Open'],
    ['waiting_on_player', 'Waiting'],
    ['closed', 'Closed'],
  ];

  els.ticketList.innerHTML = groups
    .map(([status, label]) => {
      const tickets = state.tickets.filter(ticket => ticket.status === status);
      if (!tickets.length) return '';
      return `
        <section class="ticket-section">
          <div class="ticket-section-label">${label} <span>${tickets.length}</span></div>
          ${tickets.map(renderTicketRow).join('')}
        </section>`;
    })
    .join('');
}

function renderMessages(ticket) {
  const messages = Array.isArray(ticket.messageObjects) ? ticket.messageObjects : [];
  els.messageFeed.innerHTML = messages.map(message => {
    const role = message.role === 'user' ? 'player' : (message.role || 'system');
    const author = message.authorName || (role === 'player' ? 'Player' : role === 'agent' ? 'Backspin Support' : role === 'bot' ? 'Spinny' : 'System');
    return `
      <article class="msg ${role}">
        <div class="msg-meta">${escapeHtml(author)} · ${new Date(message.createdAt || Date.now()).toLocaleString()}<span class="source-pill">${escapeHtml(sourceKindLabel(message.sourceKind))}</span></div>
        <div class="msg-body">${escapeHtml(message.text).replace(/\n/g, '<br>')}</div>
      </article>
    `;
  }).join('');
  els.messageFeed.scrollTop = els.messageFeed.scrollHeight;
}

function renderActiveTicket() {
  const ticket = state.activeTicket;
  if (!ticket) {
    els.ticketEmpty.classList.remove('hidden');
    els.ticketDetail.classList.add('hidden');
    state.notesExpanded = false;
    syncNotesPanel();
    syncResponsiveLayout();
    return;
  }

  els.ticketEmpty.classList.add('hidden');
  els.ticketDetail.classList.remove('hidden');
  els.detailTicketId.textContent = ticket.id;
  els.detailSubject.textContent = `${ticket.subject || 'Support Request'}${ticket.category === 'refund' ? ' · Refund' : ''}`;
  els.detailMeta.textContent = `${ticket.playerUsername || ticket.clientId || 'Unknown player'} · Updated ${relativeTime(ticket.updatedAt)} · ${ticket.messageCount || 0} messages · Last sender: ${senderLabel(ticket.lastMessageSender)} · Priority: ${priorityLabel(ticket.priority)}${ticket.archived ? ' · Archived' : ''}${ticket.hiddenFromClient ? ' · Hidden from player' : ''}`;
  const presence = state.presence[ticket.id];
  els.detailPresence.textContent = presence?.playerActive
    ? `Player is active in chat now · ${presence.activePlayerCount} viewer${presence.activePlayerCount === 1 ? '' : 's'}`
    : 'Player is not currently viewing this ticket';
  els.assignedTo.value = ticket.assignedTo || '';
  els.priority.value = ticket.priority || 'normal';
  els.internalNotes.value = ticket.internalNotes || '';
  setActiveStatusButtons(ticket.status || 'open');
  const isClosed = ticket.status === 'closed' || ticket.archived;
  els.replyInput.disabled = isClosed;
  els.replyInput.placeholder = ticket.archived ? 'Ticket archived — restore it to reply.' : isClosed ? 'Ticket closed — reopen to send a reply.' : 'Reply to the player…';
  els.sendReplyBtn.disabled = isClosed;
  els.cleanTicketBtn.textContent = ticket.archived ? 'Restore ticket' : 'Clean ticket';
  els.cleanTicketBtn.classList.toggle('active', Boolean(ticket.archived));
  els.deleteTicketBtn.textContent = ticket.hiddenFromClient ? 'Restore access' : 'Hide view';
  syncNotesPanel();
  renderMessages(ticket);
  syncResponsiveLayout();
}

async function loadTickets() {
  if (!state.authReady) return;
  const params = new URLSearchParams({ view: 'staff', limit: '100' });
  if (state.status !== 'all') params.set('status', state.status);
  if (state.search.trim()) params.set('search', state.search.trim());
  const data = await api(`/tickets?${params.toString()}`);
  state.tickets = data.tickets || [];
  state.counts = {
    all: Number(data.counts?.all || 0),
    open: Number(data.counts?.open || 0),
    waiting_on_player: Number(data.counts?.waiting_on_player || 0),
    closed: Number(data.counts?.closed || 0),
    archived: Number(data.counts?.archived || 0),
  };
  sortTicketsInPlace();
  if (state.activeTicket?.id) {
    const summary = state.tickets.find(ticket => ticket.id === state.activeTicket.id);
    if (summary) state.activeTicket = { ...state.activeTicket, ...summary };
  }
  renderTicketList();
  renderActiveTicket();
}

async function openTicket(ticketId) {
  if (!state.authReady) return;
  const data = await api(`/tickets/${encodeURIComponent(ticketId)}?view=staff`);
  state.activeTicket = data.ticket;
  sock.emit('support:ticket:join', { ticketId });
  mergeTicket(data.ticket);
  renderTicketList();
  renderActiveTicket();
}

async function sendReply() {
  if (!state.activeTicket || !state.authReady) return;
  if (state.activeTicket.archived) { showToast('Cannot reply — this ticket is archived. Restore it first.', 'error'); return; }
  const text = els.replyInput.value.trim();
  if (!text) return;
  els.sendReplyBtn.disabled = true;
  try {
    const data = await api(`/tickets/${encodeURIComponent(state.activeTicket.id)}/messages`, {
      method: 'POST',
      body: JSON.stringify({
        senderType: 'agent',
        authorName: els.assignedTo.value.trim() || 'Backspin Support',
        text,
        sourceKind: 'staff',
      })
    });
    state.activeTicket = data.ticket;
    mergeTicket(data.ticket);
    els.replyInput.value = '';
    renderTicketList();
    renderActiveTicket();
  } finally {
    els.sendReplyBtn.disabled = false;
  }
}

async function saveTicketMeta() {
  if (!state.activeTicket || !state.authReady) return;
  window.clearTimeout(autosaveTimer);
  const data = await api(`/tickets/${encodeURIComponent(state.activeTicket.id)}`, {
    method: 'PATCH',
    body: JSON.stringify({
      status: els.detailStatus.querySelector('.active')?.dataset.status || state.activeTicket.status,
      assignedTo: els.assignedTo.value.trim(),
      priority: els.priority.value,
      internalNotes: els.internalNotes.value.trim(),
    })
  });
  state.activeTicket = data.ticket;
  mergeTicket(data.ticket);
  renderTicketList();
  renderActiveTicket();
}

async function deleteActiveTicket() {
  if (!state.activeTicket || !state.authReady) return;
  const ticketId = state.activeTicket.id;
  const hideNext = !state.activeTicket.hiddenFromClient;
  const confirmed = await requestConfirmation(
    hideNext
      ? `Hide ${ticketId} from the player's inbox and open chat?`
      : `Restore ${ticketId} to the player's inbox?`,
    hideNext ? 'Hide from player' : 'Restore access'
  );
  if (!confirmed) return;
  const data = await api(`/tickets/${encodeURIComponent(ticketId)}`, {
    method: 'PATCH',
    body: JSON.stringify({ hiddenFromClient: hideNext })
  });
  state.activeTicket = data.ticket;
  mergeTicket(data.ticket);
  renderTicketList();
  renderActiveTicket();
  showToast(hideNext ? 'Ticket hidden from player.' : 'Player access restored.', 'success');
}

async function toggleArchiveActiveTicket() {
  if (!state.activeTicket || !state.authReady) return;
  const ticketId = state.activeTicket.id;
  const archiveNext = !state.activeTicket.archived;
  const confirmed = await requestConfirmation(
    archiveNext
      ? `Clean ${ticketId}? This will close it, archive it, and remove it from normal ticket lists.`
      : `Restore ${ticketId} from the archived section?`,
    archiveNext ? 'Clean ticket' : 'Restore ticket'
  );
  if (!confirmed) return;
  const data = await api(`/tickets/${encodeURIComponent(ticketId)}`, {
    method: 'PATCH',
    body: JSON.stringify({ archived: archiveNext, status: archiveNext ? 'closed' : 'closed' })
  });
  state.activeTicket = data.ticket;
  mergeTicket(data.ticket);
  if (archiveNext && state.status !== 'archived') {
    closeActiveTicketPanel();
  } else {
    renderActiveTicket();
  }
  renderTicketList();
  showToast(archiveNext ? 'Ticket cleaned and archived.' : 'Ticket restored from archive.', 'success');
}

function closeActiveTicketPanel() {
  if (state.activeTicket?.id) sock.emit('support:ticket:leave', { ticketId: state.activeTicket.id });
  state.activeTicket = null;
  renderTicketList();
  renderActiveTicket();
}

async function permanentlyDeleteActiveTicket() {
  if (!state.activeTicket || !state.authReady) return;
  const ticketId = state.activeTicket.id;
  const confirmed = await requestConfirmation(
    `Permanently delete ticket ${ticketId}? All messages and data will be removed. This cannot be undone.`,
    'Delete forever',
    'Delete ticket'
  );
  if (!confirmed) return;
  await api(`/tickets/${encodeURIComponent(ticketId)}`, { method: 'DELETE' });
  state.tickets = state.tickets.filter(t => t.id !== ticketId);
  closeActiveTicketPanel();
  renderTicketList();
  showToast('Ticket permanently deleted.', 'success');
}

async function createTicketFromDashboard() {
  const playerUsername = els.createPlayerUsername.value.trim();
  const playerId = els.createPlayerId.value.trim() || playerUsername;
  const subject = els.createTicketSubject.value.trim() || 'Support Request';
  if (!playerUsername) throw new Error('Player username is required.');
  const data = await api('/tickets', {
    method: 'POST',
    body: JSON.stringify({
      playerUsername,
      clientId: playerId,
      subject,
      category: els.createTicketCategory.value,
      priority: els.createTicketPriority.value,
      internalNotes: els.createTicketNotes.value.trim(),
      assignedTo: els.createTicketAssigned.value.trim(),
      messages: [],
    })
  });
  mergeTicket(data.ticket);
  renderTicketList();
  toggleCreateTicketModal(false);
  els.createPlayerUsername.value = '';
  els.createPlayerId.value = '';
  els.createTicketSubject.value = '';
  els.createTicketAssigned.value = '';
  els.createTicketCategory.value = 'general';
  els.createTicketPriority.value = 'normal';
  els.createTicketNotes.value = '';
  showToast('Ticket created.', 'success');
  await openTicket(data.ticket.id);
}

els.ticketList.addEventListener('click', event => {
  const btn = event.target.closest('[data-ticket-id]');
  if (!btn) return;
  openTicket(btn.dataset.ticketId).catch(showError);
});

els.createTicketBtn.addEventListener('click', () => {
  if (!state.authReady) return;
  toggleCreateTicketModal(true);
});

els.logoutBtn.addEventListener('click', () => {
  logoutStaff();
});

els.authLoginBtn.addEventListener('click', () => {
  loginStaff().catch(showError);
});

els.authPassword.addEventListener('keydown', event => {
  if (event.key === 'Enter') loginStaff().catch(showError);
});

els.createTicketCancelBtn.addEventListener('click', () => {
  toggleCreateTicketModal(false);
});

els.createTicketSubmitBtn.addEventListener('click', () => {
  createTicketFromDashboard().catch(showError);
});

els.createTicketOverlay.addEventListener('click', event => {
  if (event.target === els.createTicketOverlay) toggleCreateTicketModal(false);
});

els.sendReplyBtn.addEventListener('click', () => {
  sendReply().catch(showError);
});

els.deleteTicketBtn.addEventListener('click', () => {
  deleteActiveTicket().catch(showError);
});

els.cleanTicketBtn.addEventListener('click', () => {
  toggleArchiveActiveTicket().catch(showError);
});

els.permanentlyDeleteBtn.addEventListener('click', () => {
  permanentlyDeleteActiveTicket().catch(showError);
});

els.actionDropdownBtn.addEventListener('click', e => {
  e.stopPropagation();
  els.actionDropdown.classList.toggle('open');
});

document.addEventListener('click', () => {
  els.actionDropdown.classList.remove('open');
});

els.detailBackBtn.addEventListener('click', () => {
  closeActiveTicketPanel();
});

els.toggleNotesBtn.addEventListener('click', () => {
  state.notesExpanded = !state.notesExpanded;
  syncNotesPanel();
});

els.confirmCancelBtn.addEventListener('click', () => resolveConfirmation(false));
els.confirmOkBtn.addEventListener('click', () => resolveConfirmation(true));
els.confirmOverlay.addEventListener('click', event => {
  if (event.target === els.confirmOverlay) resolveConfirmation(false);
});

els.assignedTo.addEventListener('input', () => {
  scheduleAutosave();
});

els.priority.addEventListener('change', () => {
  scheduleAutosave(0);
});

els.internalNotes.addEventListener('input', () => {
  scheduleAutosave(420);
});

els.searchInput.addEventListener('input', () => {
  state.search = els.searchInput.value;
  loadTickets().catch(err => console.error(err));
});

els.statusFilter.addEventListener('click', event => {
  const button = event.target.closest('[data-status]');
  if (!button) return;
  state.status = button.dataset.status;
  setFilterButtons(state.status);
  loadTickets().catch(err => console.error(err));
});

els.detailStatus.addEventListener('click', async event => {
  const button = event.target.closest('[data-status]');
  if (!button) return;
  const newStatus = button.dataset.status;
  if (state.activeTicket?.archived && newStatus !== 'closed') {
    const confirmed = await requestConfirmation(
      `Setting this ticket to "${newStatus === 'waiting_on_player' ? 'Waiting' : 'Open'}" will remove it from the archive and make it visible in the normal ticket list again. Continue?`,
      'Unarchive & change status'
    );
    if (!confirmed) return;
    // Unarchive + set new status in one save
    const data = await api(`/tickets/${encodeURIComponent(state.activeTicket.id)}`, {
      method: 'PATCH',
      body: JSON.stringify({ archived: false, status: newStatus })
    }).catch(showError);
    if (!data) return;
    state.activeTicket = data.ticket;
    mergeTicket(data.ticket);
    renderTicketList();
    renderActiveTicket();
    showToast('Ticket unarchived and status updated.', 'success');
    return;
  }
  setActiveStatusButtons(newStatus);
  scheduleAutosave(0);
});

els.replyInput.addEventListener('keydown', event => {
  if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
    event.preventDefault();
    sendReply().catch(showError);
  }
});

document.querySelectorAll('.quick-reply').forEach(button => {
  button.addEventListener('click', () => {
    const text = button.dataset.reply || '';
    els.replyInput.value = els.replyInput.value ? `${els.replyInput.value.trim()}\n${text}` : text;
    els.replyInput.focus();
  });
});

sock.on('connect', () => {
  if (state.staffToken) sock.emit('support:staff:subscribe', { token: state.staffToken });
  if (state.activeTicket?.id) sock.emit('support:ticket:join', { ticketId: state.activeTicket.id });
});

sock.on('support:ticket:summary', payload => {
  if (!payload?.ticket) return;
  mergeTicket(payload.ticket);
  renderTicketList();
  if (state.activeTicket?.id === payload.ticket.id) renderActiveTicket();
});

sock.on('support:ticket:message', payload => {
  if (!payload?.ticket) return;
  mergeTicket(payload.ticket);
  if (state.activeTicket?.id === payload.ticketId) {
    const existingMessages = Array.isArray(state.activeTicket.messageObjects)
      ? state.activeTicket.messageObjects
      : [];
    const nextMessage = payload.message
      ? {
          id: payload.message.id,
          role: payload.message.role,
          text: payload.message.text,
          authorName: payload.message.authorName,
          sourceKind: payload.message.sourceKind,
          createdAt: payload.message.createdAt,
          senderType: payload.message.senderType,
        }
      : null;
    const mergedMessages = nextMessage && !existingMessages.some(message => message.id === nextMessage.id)
      ? [...existingMessages, nextMessage]
      : existingMessages;
    state.activeTicket = {
      ...state.activeTicket,
      ...payload.ticket,
      messageObjects: mergedMessages,
      messages: mergedMessages.map(message => message.text),
      messageCount: mergedMessages.length,
    };
    renderTicketList();
    renderActiveTicket();
  } else {
    renderTicketList();
  }
});

sock.on('support:ticket:presence', payload => {
  if (!payload?.ticketId) return;
  state.presence[payload.ticketId] = payload;
  if (state.activeTicket?.id === payload.ticketId) renderActiveTicket();
});

window.addEventListener('resize', syncResponsiveLayout);

setFilterButtons(state.status);

try {
  state.staffToken = localStorage.getItem(STAFF_TOKEN_KEY) || '';
} catch (_) {
  state.staffToken = '';
}

verifyStaffSession()
  .then(() => loadTickets())
  .catch(() => {
    setAuthState('');
    els.ticketList.innerHTML = '<div class="empty-list">Log in to view tickets.</div>';
  });
