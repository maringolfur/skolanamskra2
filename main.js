// ==========================================
// main.js - Skólanámskrá Vallaskóla
// ==========================================

// 1. Frumstilling á víðværum breytum
if (!window.YEARS_DATA) window.YEARS_DATA = {};
if (!window.STAFF_DATA) window.STAFF_DATA = [];
var currentViewHistory = currentViewHistory || [];

// 2. Birta yfirlit yfir alla árganga (Forsíða)
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

// 3. Hjálparfall til að búa til starfsmannakort (Cards)
function createStaffCardsHtml(staffList, badgeBg = 'bg-sky-100', badgeText = 'text-sky-800') {
  if (!staffList || staffList.length === 0) return '';

  return staffList.map(person => {
    const initials = (person.name || '')
      .split(' ')
      .filter(n => n.length > 0)
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const teamText = person.team ? ` • ${person.team}` : '';

    return `
      <div class="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 shadow-sm">
        <div class="w-10 h-10 rounded-full ${badgeBg} ${badgeText} flex items-center justify-center font-bold text-sm shrink-0">
          ${initials}
        </div>
        <div class="min-w-0">
          <div class="font-bold text-slate-800 text-sm truncate">${person.name}</div>
          <div class="text-xs text-slate-500 truncate">${person.role || 'Starfsmaður'}${teamText}</div>
        </div>
      </div>
    `;
  }).join('');
}

// 4. Birta starfsfólk árgangsins (með stuðningi við teymi og hlutverk)
function generateStaffSectionHtml(gradeId) {
  if (!window.STAFF_DATA || window.STAFF_DATA.length === 0) return '';

  const cleanGradeNum = gradeId.replace('y', '').trim();
  const gradeStaff = window.STAFF_DATA.filter(person => {
    if (!person.grades) return false;
    return person.grades.some(g => g.toString().trim() === cleanGradeNum);
  });

  if (gradeStaff.length === 0) return '';

  // Flokkun fyrir unglingastig (ef teymi eru skráð) eða almenna flokkun
  const supervisors = gradeStaff.filter(s => (s.role || '').toLowerCase().includes('umsjón'));
  const support = gradeStaff.filter(s => (s.role || '').toLowerCase().includes('stuðning'));
  
  const isamTeam = gradeStaff.filter(s => (s.team || '').toLowerCase().includes('ísam'));
  const staeNatTeam = gradeStaff.filter(s => 
    (s.team || '').toLowerCase().includes('stæ') || (s.team || '').toLowerCase().includes('nát')
  );
  const langTeam = gradeStaff.filter(s => (s.team || '').toLowerCase().includes('tungumál'));

  const stod = gradeStaff.filter(s => {
    const r = (s.role || '').toLowerCase();
    return r.includes('sérkenn') || r.includes('þroskaþjálf') || r.includes('ísa');
  });

  const excludeSet = new Set([...supervisors, ...support, ...isamTeam, ...staeNatTeam, ...langTeam, ...stod]);
  const otherTeachers = gradeStaff.filter(s => !excludeSet.has(s));

  const renderGroup = (title, icon, list, badgeBg, badgeText) => {
    if (!list || list.length === 0) return '';
    return `
      <div class="mb-6">
        <h3 class="text-md font-bold text-slate-800 mb-3 border-b pb-1 flex items-center gap-2">
          <span>${icon}</span> ${title}
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          ${createStaffCardsHtml(list, badgeBg, badgeText)}
        </div>
      </div>
    `;
  };

  return `
    <div class="mt-10 pt-8 border-t border-slate-200">
      <h2 class="text-xl font-extrabold text-sky-950 mb-6 flex items-center gap-2">
        <span>👥</span> Starfsfólk árgangsins
      </h2>
      ${renderGroup('Umsjónarkennarar', '🏫', supervisors, 'bg-sky-600', 'text-white')}
      ${renderGroup('Stuðningsfulltrúar', '🤝', support, 'bg-amber-100', 'text-amber-800')}
      ${renderGroup('Ísam (Íslenska & Samfélagsfræði)', '📖', isamTeam, 'bg-orange-100', 'text-orange-800')}
      ${renderGroup('Stæ / Nát (Stærðfræði & Náttúrufræði)', '📐', staeNatTeam, 'bg-emerald-100', 'text-emerald-800')}
      ${renderGroup('Tungumálateymi', '🌍', langTeam, 'bg-purple-100', 'text-purple-800')}
      ${renderGroup('Stoðþjónusta', '🧩', stod, 'bg-indigo-100', 'text-indigo-800')}
      ${renderGroup('Aðrir kennarar og starfsfólk', '🎨', otherTeachers, 'bg-slate-100', 'text-slate-700')}
    </div>
  `;
}

// 5. Birta námskrá ákveðins árgangs
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
        ${mainContent}
        ${staffSection}
      </div>
    </div>
  `;

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 6. Ræsing
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
