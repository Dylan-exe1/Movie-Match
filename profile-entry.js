import { currentUser, logout } from '/js/auth.js';

const $ = id => document.getElementById(id);

function openModal() {
  $('editModal').setAttribute('aria-hidden', 'false');
}
function closeModal() {
  $('editModal').setAttribute('aria-hidden', 'true');
}

function showUser(user) {
  $('display-name').textContent = user.name;
  $('display-email').textContent = user.email;
  $('member-since').textContent = user.created
    ? new Date(user.created).toLocaleDateString()
    : '—';

  if (user.avatar) $('avatar').src = user.avatar;
  $('logoutBtn').style.display = 'inline-block';
}

function loadPrefs() {
  const prefs = JSON.parse(localStorage.getItem('mm_prefs') || '{}');
  Object.keys(prefs).forEach(k => {
    const el = $(`pref-${k}`);
    if (el) el.checked = prefs[k];
  });
}

function savePref(key, val) {
  const prefs = JSON.parse(localStorage.getItem('mm_prefs') || '{}');
  prefs[key] = val;
  localStorage.setItem('mm_prefs', JSON.stringify(prefs));
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem('mm_history') || '[]');
  const grid = $('match-history');
  grid.innerHTML = '';

  if (!history.length) {
    grid.innerHTML = `<p class="text-muted">No matches yet.</p>`;
    return;
  }

  history.forEach(m => {
    const card = document.createElement('div');
    card.className = 'card match-card';
    card.innerHTML = `
      <img src="${m.poster || '/assets/placeholder.png'}" loading="lazy">
      <strong>${m.title}</strong>
      <span class="text-muted small">${m.note || ''}</span>
    `;
    grid.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const session = JSON.parse(localStorage.getItem('mm_session') || 'null');
  if (!session?.user) return;

  showUser(session.user);
  loadPrefs();
  loadHistory();

  $('logoutBtn').onclick = () => {
    logout();
    location.reload();
  };

  $('editProfileBtn').onclick = () => {
    $('edit-name').value = session.user.name;
    $('edit-email').value = session.user.email;
    openModal();
  };

  $('cancelProfileBtn').onclick = closeModal;

  $('saveProfileBtn').onclick = () => {
    session.user.name = $('edit-name').value;
    session.user.email = $('edit-email').value;
    localStorage.setItem('mm_session', JSON.stringify(session));
    showUser(session.user);
    closeModal();
  };

  $('avatarInput').onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      $('avatar').src = reader.result;
      session.user.avatar = reader.result;
      localStorage.setItem('mm_session', JSON.stringify(session));
    };
    reader.readAsDataURL(file);
  };

  ['action','comedy','drama','sci','horror','romance'].forEach(k => {
    const box = $(`pref-${k}`);
    box?.addEventListener('change', () => savePref(k, box.checked));
  });
});
