// Load from localStorage if available (admin saves go here)
(function() {
  try {
    const saved = localStorage.getItem('bncc_admin_state');
    if (saved) window.BNCC_DATA = JSON.parse(saved);
  } catch(e) {}
})();

const D = window.BNCC_DATA;

// ---- Hamburger nav ----
const ham = document.getElementById('hamburger');
const nav = document.getElementById('navLinks');
if (ham && nav) {
  ham.addEventListener('click', () => nav.classList.toggle('open'));
}

// ---- Initials helper ----
function initials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
}

const AVATAR_COLORS = [
  ['#E1F5EE','#0F6E56'],['#E6F1FB','#185FA5'],['#FAEEDA','#854F0B'],
  ['#FBEAF0','#993556'],['#EEEDFE','#534AB7'],['#EAF3DE','#3B6D11'],
  ['#FAECE7','#993C1D'],
];
function avatarColor(name) {
  let h = 0;
  for (let c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

// ---- INDEX PAGE ----
if (document.getElementById('h-wins') !== null) {
  // Hero stats
  document.getElementById('h-wins').textContent = D.season.wins ?? '—';
  document.getElementById('h-losses').textContent = D.season.losses ?? '—';
  document.getElementById('h-rank').textContent = D.season.standing || '—';

  // Announcements
  const annEl = document.getElementById('announceList');
  if (annEl) {
    if (!D.announcements.length) {
      annEl.innerHTML = '<li class="announce-empty">No announcements yet.</li>';
    } else {
      annEl.innerHTML = D.announcements.slice(0,5).map(a => {
        const colorMap = { urgent: '#d4af3a', info: '#185FA5', general: '#22613A' };
        const dot = colorMap[a.type] || '#22613A';
        return `<li class="announce-item">
          <span class="ann-dot" style="background:${dot}"></span>
          <span class="ann-body">
            <span class="ann-text">${a.text}</span>
            <span class="ann-date">${fmtDate(a.date)}</span>
          </span>
        </li>`;
      }).join('');
    }
  }

  // Next match
  const upcoming = D.matches.filter(m => m.result === 'upcoming').sort((a,b) => a.date.localeCompare(b.date));
  const nextEl = document.getElementById('nextMatch');
  if (nextEl && upcoming.length) {
    const m = upcoming[0];
    nextEl.innerHTML = `
      <div class="next-match-inner">
        <div class="next-vs">BNCC <span class="vs-sep">vs</span> ${m.opponent}</div>
        <div class="next-details">
          <span>📅 ${fmtDate(m.date)}</span>
          ${m.venue ? `<span>📍 ${m.venue}</span>` : ''}
        </div>
      </div>`;
  }

  // Results
  const resultsEl = document.getElementById('resultsList');
  if (resultsEl) {
    const past = D.matches.filter(m => m.result !== 'upcoming').slice(0,5);
    if (!past.length) {
      resultsEl.innerHTML = '<li class="empty-state">No results yet.</li>';
    } else {
      resultsEl.innerHTML = past.map(m => `
        <li class="result-row">
          <span class="result-opp">vs ${m.opponent}</span>
          ${m.score ? `<span class="result-score">${m.score}</span>` : ''}
          <span class="badge badge-${m.result}">${m.result.toUpperCase()}</span>
          <span class="result-date">${fmtDate(m.date)}</span>
        </li>`).join('');
    }
  }

  // Top batters (home)
  const btBody = document.querySelector('#battersTable tbody');
  if (btBody) {
    const top = D.batting.slice(0,5);
    btBody.innerHTML = top.length
      ? top.map(b => `<tr><td>${playerCell(b.name)}</td><td>${b.runs}</td><td>${b.avg.toFixed(1)}</td><td>${b.hs}</td></tr>`).join('')
      : '<tr><td colspan="4" class="empty-state">No data yet.</td></tr>';
  }

  // Top bowlers (home)
  const boBody = document.querySelector('#bowlersTable tbody');
  if (boBody) {
    const top = D.bowling.slice(0,5);
    boBody.innerHTML = top.length
      ? top.map(b => `<tr><td>${playerCell(b.name)}</td><td>${b.wickets}</td><td>${b.economy.toFixed(1)}</td><td>${b.best}</td></tr>`).join('')
      : '<tr><td colspan="4" class="empty-state">No data yet.</td></tr>';
  }
}

// ---- PLAYERS PAGE ----
if (document.getElementById('fullBattersTable') !== null) {
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.tab-panel');
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(x => x.classList.remove('active'));
    panels.forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    document.getElementById('tab-' + t.dataset.tab).classList.add('active');
  }));

  // Batting
  const bbody = document.querySelector('#fullBattersTable tbody');
  if (bbody && D.batting.length) {
    bbody.innerHTML = D.batting.map(b =>
      `<tr><td>${playerCell(b.name)}</td><td>${b.matches}</td><td>${b.innings}</td><td>${b.runs}</td><td>${b.avg.toFixed(1)}</td><td>${b.sr.toFixed(1)}</td><td>${b.hs}</td><td>${b.fifties}</td><td>${b.hundreds}</td></tr>`
    ).join('');
  }

  // Bowling
  const bobody = document.querySelector('#fullBowlersTable tbody');
  if (bobody && D.bowling.length) {
    bobody.innerHTML = D.bowling.map(b =>
      `<tr><td>${playerCell(b.name)}</td><td>${b.matches}</td><td>${b.overs}</td><td>${b.wickets}</td><td>${b.runs}</td><td>${b.economy.toFixed(2)}</td><td>${b.economy.toFixed(2)}</td><td>${b.best}</td></tr>`
    ).join('');
  }

  // Fielding
  const fbody = document.querySelector('#fieldingTable tbody');
  if (fbody && D.fielding.length) {
    fbody.innerHTML = D.fielding.map(f =>
      `<tr><td>${playerCell(f.name)}</td><td>${f.catches}</td><td>${f.runouts}</td><td>${f.stumpings}</td></tr>`
    ).join('');
  }
}

// ---- SCHEDULE PAGE ----
if (document.getElementById('allMatches') !== null) {
  const container = document.getElementById('allMatches');
  const filters = document.querySelectorAll('.filter-btn');

  function renderMatches(filter) {
    let matches = [...D.matches].sort((a,b) => b.date.localeCompare(a.date));
    if (filter !== 'all') matches = matches.filter(m => {
      if (filter === 'upcoming') return m.result === 'upcoming';
      if (filter === 'win') return m.result === 'win';
      if (filter === 'loss') return m.result === 'loss';
      return true;
    });
    if (!matches.length) {
      container.innerHTML = '<div class="empty-state" style="padding:2rem 0">No matches found.</div>';
      return;
    }
    container.innerHTML = matches.map(m => `
      <div class="match-card">
        <div class="match-card-left">
          <div class="match-card-opp">BNCC vs ${m.opponent}</div>
          ${m.venue ? `<div class="match-card-venue">📍 ${m.venue}</div>` : ''}
          ${m.score ? `<div class="match-card-score">${m.score}</div>` : ''}
        </div>
        <div class="match-card-right">
          <span class="badge badge-${m.result}">${m.result === 'upcoming' ? fmtDate(m.date) : m.result.toUpperCase()}</span>
          ${m.result !== 'upcoming' ? `<div class="match-card-date">${fmtDate(m.date)}</div>` : ''}
        </div>
      </div>`).join('');
  }

  filters.forEach(f => {
    f.addEventListener('click', () => {
      filters.forEach(x => x.classList.remove('active'));
      f.classList.add('active');
      renderMatches(f.dataset.filter);
    });
  });
  renderMatches('all');
}

// ---- GALLERY PAGE ----
if (document.getElementById('galleryGrid') !== null) {
  const grid = document.getElementById('galleryGrid');
  if (D.gallery.length) {
    grid.innerHTML = D.gallery.map(g => `
      <div class="gallery-item">
        <img src="${g.url}" alt="${g.caption || ''}" loading="lazy" />
        ${g.caption ? `<div class="gallery-caption">${g.caption}</div>` : ''}
      </div>`).join('');
  }
}

// ---- Helpers ----
function playerCell(name) {
  const [bg, fg] = avatarColor(name);
  return `<span class="player-cell"><span class="avatar" style="background:${bg};color:${fg}">${initials(name)}</span>${name}</span>`;
}

function fmtDate(str) {
  if (!str) return '';
  const d = new Date(str + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
