// ==========================================
// main.js - Skólanámskrá Vallaskóla
// ==========================================

if (!window.YEARS_DATA) window.YEARS_DATA = {};
if (!window.STAFF_DATA) window.STAFF_DATA = [];
var currentViewHistory = currentViewHistory || [];

// 1. Sækja starfsmannalista hvort sem hann er Array eða Object
function getStaffList() {
  if (!window.STAFF_DATA) return [];
  if (Array.isArray(window.STAFF_DATA)) return window.STAFF_DATA;
  if (typeof window.STAFF_DATA === 'object') return Object.values(window.STAFF_DATA);
  return [];
}

// 2. Staðla dálkaheiti starfsmanna
function normalizePerson(person) {
  if (!person) return { name: '', role: '', team: '' };
  return {
    name: person.Name || person.name || person.Nafn || person.nafn || '',
    role: person.Role || person.role || person.Hlutverk || person.hlutverk || person.Starf || person.starf || 'Starfsmaður',
    team: person.Team || person.team || person.Teams || person.teams || person.Teymi || person.teymi || ''
  };
}

// 3. Athuga hvort starfsmaður tilheyri árgangi
function isPersonInGrade(person, gradeId) {
  if (!person) return false;
  const cleanGrade = gradeId.replace('y', '').trim();
  const rawGrades = person.Grades || person.grades || person.grade || person.Bekkir || person.bekkir || person.Árgangar || person.árgangar;

  if (!rawGrades) return false;

  let gradeList = [];
  if (Array.isArray(rawGrades)) {
    gradeList = rawGrades.map(g => g.toString().trim());
  } else {
    gradeList = rawGrades.toString().split(/[\s,]+/).map(g => g.trim());
  }

  return gradeList.some(g => {
    const num = g.replace(/\D/g, '');
    return num === cleanGrade || g.toLowerCase() === gradeId.toLowerCase();
  });
}

// 4. Teikna starfsmenn sem hreinan lista (án kassa)
function createStaffListHtml(staffList) {
  if (!staffList || staffList.length === 0) return '';

  return staffList.map(p => {
    const person = normalizePerson(p);
    const teamText = person.team ? ` (${person.team})` : '';

    return `
      <li class="py-1 flex items-center justify-between text-slate-800 text-sm border-b border-slate-100 last:border-none">
        <span class="font-bold">${person.name}</span>
        <span class="text-slate-500 text-xs">${person.role}${teamText}</span>
      </li>
    `;
  }).join('');
}

// 5. Flokka og birta starfsfólk árgangsins (Kemur á undan námskrá)
function generateStaffSectionHtml(gradeId) {
  const allStaff = getStaffList();
  if (allStaff.length === 0) return '';

  const gradeStaff = allStaff.filter(person => isPersonInGrade(person, gradeId));
  if (gradeStaff.length === 0) return '';

  const supervisors = gradeStaff.filter(s => normalizePerson(s).role.toLowerCase().includes('umsjón'));
  const support = gradeStaff.filter(s => normalizePerson(s).role.toLowerCase().includes('stuðning'));
  
  const isamTeam = gradeStaff.filter(s => normalizePerson(s).team.toLowerCase().includes('ísam'));
  const staeNatTeam = gradeStaff.filter(s => {
    const t = normalizePerson(s).team.toLowerCase();
    return t.includes('stæ') || t.includes('nát');
  });
  const langTeam = gradeStaff.filter(s => normalizePerson(s).team.toLowerCase().includes('tungumál'));

  const stod = gradeStaff.filter(s => {
    const r = normalizePerson(s).role.toLowerCase();
    return r.includes('sérkenn') || r.includes('þroskaþjálf') || r.includes('ísa');
  });

  const management = gradeStaff.filter(s => {
    const r = normalizePerson(s).role.toLowerCase();
    return r.includes('stjórn') || r.includes('skólastj') || r.includes('deildarstj');
  });

  const excludeSet = new Set([...supervisors, ...support, ...isamTeam, ...staeNatTeam, ...langTeam, ...stod, ...management]);
  const otherTeachers = gradeStaff.filter(s => !excludeSet.has(s));

  const renderGroup = (title, icon, list) => {
    if (!list || list.length === 0) return '';
    return `
      <div class="mb-4">
        <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <span>${icon}</span> ${title}
        </h3>
        <ul class="space-y-0.5">
          ${createStaffListHtml(list)}
        </ul>
      </div>
    `;
  };

  return `
    <div class="mb-8 pb-6 border-b border-slate-200">
      <h2 class="text-lg font-extrabold text-sky-950 mb-4 flex items-center gap-2">
        <span>👥</span> Starfsfólk árgangsins
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        ${renderGroup('Umsjónarkennarar', '🏫', supervisors)}
        ${renderGroup('Stuðningsfulltrúar', '🤝', support)}
        ${renderGroup('Ísam (Íslenska & Samfélagsfræði)', '📖', isamTeam)}
        ${renderGroup('Stæ / Nát (Stærðfræði & Náttúrufræði)', '📐', staeNatTeam)}
        ${renderGroup('Tungumálateymi', '🌍', langTeam)}
        ${renderGroup('Stoðþjónusta', '🧩', stod)}
        ${renderGroup('Aðrir kennarar', '🎨', otherTeachers)}
        ${renderGroup('Stjórnendur', '👔', management)}
      </div>
    </div>
  `;
}

// 6. Forsíðuyfirlit
window.showYears = function() {
  const container = document.getElementById('content-area') || document.getElementById('app') || document.body;

  const yearsList = window.YEARS_LIST || [
    { id: 'y1', title: '1. árgangur', icon: '🌱' },
    { id: 'y2', title: '2. árgangur', icon: '🍃' },
    { id: 'y3', title: '3. árgangur', icon: '☘️' },
    { id: 'y4', title: '4. árgangur', icon: '🌿' },
    { id: 'y5', title: '5. árgangur', icon: '🌳' },
    { id: 'y6', title: '6. árgangur', icon: '🌲' },
    { id: 'y7', title: '7. árgangur', icon: '🌴' },
    { id: 'y8', title: '8. árgangur', icon: '🌋' },
    { id: 'y9', title: '9. árgangur', icon: '🏔️' },
    { id: 'y10', title: '10. árgangur', icon: '🎓' },
    { id: 'stod', title: 'Stoðþjónusta', icon: '🧩' },
    { id: 'isat', title: 'ÍSAT', icon: '💬' }
  ];

  const cardsHtml = yearsList.map(item => `
    <button onclick="loadYearView('${item.id}')" class="bg-white border border-slate-200 hover:border-sky-500 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between h-36 group cursor-pointer">
      <div class="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">${item.icon || '📚'}</div>
      <div>
        <div class="font-extrabold text-slate-900 text-lg group-hover:text-sky-600 transition-colors">${item.title}</div>
        <div class="text-xs text-slate-500">Skoða námskrá</div>
      </div>
    </button>
  `).join('');

  container.innerHTML = `
    <div class="max-w-5xl mx-auto p-4 md:p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-extrabold text-sky-950">Skólanámskrá Vallaskóla</h1>
        <p class="text-sm text-slate-500 mt-1">Veldu árgang eða þjónustu til að skoða námskrá og starfsfólk</p>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        ${cardsHtml}
      </div>
    </div>
  `;
};

// 7. Birta árgangssíðu
function renderYearView(yearId) {
  const container = document.getElementById('content-area') || document.getElementById('app') || document.body;
  const data = window.YEARS_DATA ? window.YEARS_DATA[yearId] : null;

  if (!data) {
    container.innerHTML = `
      <div class="max-w-5xl mx-auto p-4 md:p-6">
        <div class="flex justify-between items-center mb-4">
          <button onclick="showYears()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer">
            ← Til baka
          </button>
          <button onclick="showYears()" class="text-sm font-semibold text-sky-600 hover:text-sky-800 cursor-pointer">Forsíða</button>
        </div>
        <div class="p-8 text-center bg-white rounded-2xl shadow-sm border border-slate-100">
          <h1 class="text-3xl font-extrabold text-slate-800 mb-2">Árgangur</h1>
          <p class="text-xs font-semibold text-sky-800 tracking-wider uppercase">Vallaskóli • Skólanámskrá</p>
          <div class="mt-8 p-6 bg-slate-50 rounded-xl text-slate-600">
            Upplýsingar í vinnslu.
          </div>
        </div>
      </div>
    `;
    return;
  }

  const mainContent = data.docHtml || '';
  const staffSection = generateStaffSectionHtml(yearId);

  container.innerHTML = `
    <div class="max-w-5xl mx-auto p-4 md:p-6">
      <div class="flex justify-between items-center mb-4">
        <button onclick="showYears()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer">
          ← Til baka
        </button>
        <button onclick="showYears()" class="text-sm font-semibold text-sky-600 hover:text-sky-800 cursor-pointer">Forsíða</button>
      </div>
      <div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
        <div class="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <span class="text-3xl">${data.icon || '📚'}</span>
          <div>
            <h1 class="text-2xl font-extrabold text-slate-900">${data.title || yearId}</h1>
            <p class="text-xs font-semibold text-sky-800 tracking-wider uppercase">Vallaskóli • Skólanámskrá</p>
          </div>
        </div>
        ${staffSection}
        ${mainContent}
      </div>
    </div>
  `;

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 8. Ræsing
document.addEventListener('DOMContentLoaded', () => {
  window.loadYearView = function(yearId) {
    if (typeof currentViewHistory !== 'undefined') {
      currentViewHistory.push(yearId);
    }
    renderYearView(yearId);
  };

  const container = document.getElementById('content-area') || document.getElementById('app');
  if (container && (!container.innerHTML || container.innerHTML.trim() === '')) {
    window.showYears();
  }
});
